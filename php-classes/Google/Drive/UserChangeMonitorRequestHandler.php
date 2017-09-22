<?php

namespace Google\Drive;

use Exception;
use Emergence\People\User;
use Emergence\Logger;

use Google\API as GoogleAPI;
use Google\DriveFile;

class UserChangeMonitorRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = UserChangeMonitor::class;

    public static $accountLevelBrowse = 'Administrator';
    public static $accountLevelWrite = 'Administrator';

    public static function handleRequest($action = null)
    {
        switch ($action ?: $action = static::shiftPath()) {
            case 'ping':
                return static::handleUserChangeRequest();

            case 'monitor-all':
                return static::handleMonitorAllRequest();

            default:
                return parent::handleRequest($action);
        }
    }

    public static function handleMonitorAllRequest()
    {
        foreach (User::getAllByWhere(['AccountLevel' => 'Teacher']) as $Teacher) {
            if (!$Teacher->PrimaryEmail) {
                Logger::general_warning('Google Drive User Change Monitor is not configured for {slateUsername} because no primary email is set.', [
                    'slateUsername' => $Teacher->Username
                ]);
               continue;
            } elseif ($Teacher->PrimaryEmail->getDomainName() != GoogleAPI::$domain) {
                Logger::general_warning('Google Drive User Change Monitior is not configured for {slateUsername} due to domain mismatch.', [
                    'slateUsername' => $Teacher->Username,
                    'userEmail' => $Teacher->PrimaryEmail
                ]);
               continue;
            }

            $Monitor = UserChangeMonitor::getOrCreate($Teacher->PrimaryEmail);

            $monitoring = 0;
            $failed = 0;
            try {
                if ($Monitor->monitor()) {
                    $monitoring++;
                }
            } catch (Exception $e) {
                $failed++;
                Logger::general_alert('Unable to monitor {slateUsername}\'s changes for Google Drive', [
                    'slateUsername' => $Teacher->Username,
                    'exception' => $e
                ]);
                continue;
            }
        }

        return static::respond('usersMonitored', [
            'total' => $monitoring,
            'failed' => $failed
        ], 'json');
    }

    public static function handleUserChangeRequest()
    {
        $recordClass = static::$recordClass;

        $channelId = $_SERVER['HTTP_X_GOOG_CHANNEL_ID'];
        $resourceState = $_SERVER['HTTP_X_GOOG_RESOURCE_STATE'];

        if ($resourceState == 'sync') {
            return static::respond('changesProcessed', ['success' => true], 'json');
        }

        if (empty($channelId)) {
            return static::throwInvalidRequestError('Invalid request - Header HTTP_X_GOOG_CHANNEL_ID is not set.');
        }

        $Monitor = $recordClass::getByWhere([
            'EmailID' => str_replace('change-monitor-', '', $channelId)
        ]);

        if (empty($Monitor)) {
            return static::throwError('Monitor not configured for channel.');
        }

        $response = GoogleAPI::request('/drive/v3/changes', [
            'user' => $Monitor->EmailContact->toString(),
            'scope' => DriveFile::$apiScope,
            'get' => [
                'pageToken' => $Monitor->StartPageToken
            ]
        ]);

        $updatedFiles = [];
        if (!empty($response['changes'])) {
            foreach ($response['changes'] as $change) {
                if ($change['kind'] != 'drive#change' || $change['type'] != 'file') {
                    continue;
                }

                if (!$DriveFile = DriveFile::getByWhere(['DriveID' => $change['fileId']])) {
                    continue;
                }

                try {
                    $updatedFiles[] = $DriveFile;
                    $DriveFile->updateFileDetails();
                    $DriveFile->save();
                } catch (\Exception $e) {
                    if ($change['removed'] || $e->getCode() === $DriveFile::GOOGLE_EXCEPTION_CODES['file-not-found']) {
                        $DriveFile->save();
                    }
    #                \Emergence\Logger::general_alert();
                    continue;
                }

            }
        }

        if (!empty($response['newStartPageToken'])) {
            $Monitor->StartPageToken = $response['newStartPageToken'];
        }

        if ($Monitor->Expiration < time()) {
            $Monitor->monitor();
        }

        $Monitor->save();

        return static::respond('changesProcessed', [
            'success' => true,
            'data' => [
                'id' => $Monitor->ID,
                'updated' => $updatedFiles
            ]
        ], 'json');

    }
}
<?php

namespace Google\Drive;

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

            default:
                return parent::handleRequest($action);
        }
    }

    public static function handleUserChangeRequest()
    {
        $recordClass = static::$recordClass;
        function getallheaders() {
            if (!is_array($_SERVER)) {
                return array();
            }

            $headers = array();
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                }
            }
            return $headers;
        }
        $requestHeaders = getallheaders();

        $channelId = $requestHeaders['X-Goog-Channel-Id'];
        $resourceState = $requestHeaders['X-Goog-Resource-State'];

        if ($resourceState == 'sync') {
            return static::respond('changesProcessed', ['success' => true], 'json');
        }

        if (empty($channelId)) {
            return static::throwInvalidRequestError('Invalid request - X-Goog-Channel-Id is not set.');
        }

        $Monitor = $recordClass::getByWhere([
            'EmailID' => str_replace('change-monitor-', '', $channelId)
        ]);

        if (empty($Monitor)) {
            return static::throwError('Monitor not configured for channel.');
        }

        $response = GoogleAPI::request('https://www.googleapis.com/drive/v3/changes', [
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
                    $DriveFile->updateGoogleFileDetails();
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
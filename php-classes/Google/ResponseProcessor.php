<?php

/*
* TODO:
* 1. Implement PSR-7 Standard Response MessageInterface Objects
*
* 2. Wrap batch process methods in try blocks, and
* throw Exceptions instead of returning false in process methods
*
* 3. Implement Logger to log any caught Exceptions;
*    - Allow optional parameter to batch process methods, $logger
*    - which accepts a logger class implementing \Psr\Log\LoggerInterface
*/

namespace Google;

use Emergence\People\User;

use Slate\People\Student;

use Slate\CBL\Tasks\StudentTask;
use Slate\CBL\Tasks\Attachments\GoogleDriveFile;

class ResponseProcessor
{
    public static function processAccessTokenResponse($key, array $response = [])
    {
        list($user, $scope) = explode('|', $key);

        if (empty($response['access_token'])) {
            return false;
        }

        // subtract 1 minute from returned token expiration
        \Cache::store(
            sprintf('%s/%s/%s', API::class, $user, $scope),
            $response['access_token'],
            $response['expires_in'] - 60
        );
    }

    public static function processBatchAccessTokenResponse(array $responses = [])
    {
        foreach ($responses as $key => $response) {
            static::processAccessTokenResponse($key, $response);
        }
    }

    public static function processPermissionResponse($key, array $response = [])
    {
        list($clonedAttachmentId, $validEmail, $role, $type) = explode('|', $key);

        if (!$ClonedAttachment = GoogleDriveFile::getByID($clonedAttachmentId)) {
            // log error
            continue;
        }

        $ClonedAttachment->syncedPermissions[$validEmail] = $role;
    }

    public static function processBatchPermissionResponse(array $responses = [])
    {
        foreach ($responses as $key => $response) {
            static::processPermissionResponse($key, $response);
        }
    }

    public static function processCloneResponse($key, array $response = [])
    {
        list($originalAttachmentId, $validEmail, $username) = explode('|', $key);

        if (isset($response['errors']) || isset($response['error'])) {
#            \Debug\Logger::general_notice(
#                'Response included an error, skipping.',
#                ['response' => $response, 'responseKey' => $key]
#            );
            return false;
        }

        if (!$User = User::getByField('Username', $username)) {
#            \Debug\Logger::general_notice(
#                'Slate user: {slateUsername} was not found, skipping.',
#                ['response' => $response, 'responseKey' => $key, 'slateUsername' => $username]
#            );
            return false;
        }

        if (!$User->isA(Student::class)) {
#            \Debug\Logger::general_notice(
#                'User {slateUsername} is not a student, skipping. ({userClass})',
#                ['response' => $response, 'responseKey' => $key, 'userClass' => $User->Class, 'slateUsername' => $User->Username]
#            );
            return false;
        }

        if (!$Attachment = GoogleDriveFile::getByID($originalAttachmentId)) {
#            \Debug\Logger::general_notice(
#                'Original Attachment (#{originalAttachmentId}) was not found, skipping',
#                ['response' => $response, 'responseKey' => $key, 'originalAttachmentId' => $originalAttachmentId]
#            );
            return false;
        }

        if (!$StudentTask = StudentTask::getByWhere(['StudentID' => $User->ID, 'TaskID' => $Attachment->Task->ID])) {
#            \Debug\Logger::general_notice(
#                'Task: {taskName} not assigned to {slateUsername} was not found, skipping.',
#                ['response' => $response, 'responseKey' => $key, 'taskName' => $Attachment->Task->Title, 'slateUsername' => $User->Username]
#            );
            return false;
        }

        $ClonedFile = DriveFile::create([
            'DriveID' => $response['id'],
            'ParentDriveID' => $Attachment->File->DriveID,
            'OwnerEmail' => $Attachment->File->OwnerEmail
        ]);

        $ClonedAttachment = GoogleDriveFile::create([
            'File' => $ClonedFile,
            'Context' => $StudentTask,
            'ParentAttachment' => $Attachment,
            'FileRevisionID' => "1"
        ]);

#        \Debug\Logger::general_notice('Google Batch Clone Response', ['key' => $key, 'response' => $response]);

        $ClonedFile->applyFileDetails($response);

        if (!$ClonedAttachment->validate()) {
#            \Debug\Logger::general_notice(
#                'Cloned Attachment invalid, unable to save.',
#                ['response' => $response, 'responseKey' => $key, 'userClass' => $User->Class, 'slateUsername' => $User->Username]
#            );
            // remove cloned file record / delete in drive?
            return false;
        }

        $ClonedAttachment->save();

        return true;

    }

    public static function processBatchCloneResponse(array $responses = [])
    {
        foreach ($responses as $key => $response) {
            static::processCloneResponse($key, $response);
        }
    }

    public static function processTransferOwnershipPermissionResponse($key, array $response = [])
    {
        list($clonedAttachmentId, $validEmail, $username, $permissionRole) = explode('|', $key);

        if (isset($response['errors']) || isset($response['error'])) {
#            \Debug\Logger::general_notice(
#                'Response included an error, skipping',
#                ['response' => $response, 'responseKey' => $key]
#            );
            return false;
        }

        if (!$ClonedAttachment = GoogleDriveFile::getByID($clonedAttachmentId)) {
#            \Debug\Logger::general_notice(
#                'Cloned Attachment #{clonedAttachmentId} not found, skipping',
#                ['response' => $response, 'responseKey' => $key, 'clonedAttachmentId' => $clonedAttachmentId]
#            );
            return false;
        }

        // granted default permissions
        if ($username == 'default') {
            $ClonedAttachment->File->syncedPermissions[$validEmail] = $permissionRole;
            return true;
        }

        if (!$User = User::getByField('Username', $username)) {
#            \Debug\Logger::general_notice(
#                'Slate user {slateUsername} not found, skipping',
#                ['response' => $response, 'responseKey' => $key, 'slateUsername' => $username]
#            );
            return false;
        }

        // granted user permissions
        if (!$User->isA(Student::class)) {
            $ClonedAttachment->File->syncedPermissions[$validEmail] = $permissionRole;
            return true;
        }
    }

    public static function processBatchTransferOwnershipPermissionResponse(array $responses = [])
    {
        foreach ($responses as $key => $response) {
            static::processTransferOwnershipPermissionResponse($key, $response);
        }
    }

    public static function processFileDetailsResponse($key, array $response = [])
    {
        $DriveFile = DriveFile::getByField('DriveID', $key);

        if (!$DriveFile) {
            return false;
        }

        if (isset($response['error']) || isset($response['errors'])) {
            return false;
        }

        $DriveFile->applyFileDetails($response);
        $DriveFile->save();
    }

    public static function processBatchFileDetailsResponse(array $responses = [])
    {
        foreach ($responses as $key => $response) {
            static::processFileDetailsResponse($key, $response);
        }
    }
}
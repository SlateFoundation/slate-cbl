<?php

namespace Google;

use Google\API as GoogleAPI;
use \Slate\CBL\Tasks\Attachments\GoogleDriveFile;
use \Slate\CBL\Tasks\Task;
use \Slate\CBL\Tasks\StudentTask;

class DriveFile extends \ActiveRecord
{
    public static $tableName = 'google_files';

    public static $singularNoun = 'google file';
    public static $pluralNoun = 'google files';

    public $details;

    public static $fields = [
        'Title',
        'OwnerEmail',
        'Type',
        'DriveID' => [
            'unique' => true
        ],
        'ParentDriveID' => [
            'default' => null
        ],
        'Status' => [
            'values' => ['normal', 'trashed', 'deleted'],
            'default' => 'normal'
        ]
    ];

    public static $validators = [
        'OwnerEmail' => [
            'validator' => 'email',
            'required' => true
        ],
        'Title' => [
            'required' => true,
            'validator' => [__CLASS__, 'validateTitle']
        ],
        'Type' => [
            'required' => true,
            'validator' => [__CLASS__, 'validateType']
        ]
    ];

    public static $dynamicFields = [
        'FileDetails' => [
            'getter' => 'getGoogleFileDetails'
        ]
    ];

    public function getGoogleFileDetails()
    {
        if ($this->details) {
            return $this->details;
        }

        if (!$this->OwnerEmail) {
            try {
                $token = GoogleAPI::fetchAccessToken('https://www.googleapis.com/auth/drive', $GLOBALS['Session']->Person->PrimaryEmail);
            } catch (\Exception $e) {
                return null;
            }
        } else {
            $token = GoogleAPI::fetchAccessToken('https://www.googleapis.com/auth/drive', $this->OwnerEmail);
        }

        $response = GoogleAPI::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID, []);

        if (!empty($response['error'])) {
            throw new \Exception('Error looking up document. '.$response['error']['errors'][0]['message']);
        }

        return $response;
    }

    public static function validateType(\RecordValidator $validator, \Google\DriveFile $File)
    {
        try {
            if (!$File->Type) {
                $details = $File->getGoogleFileDetails();
                $mimeTypeParts = explode('.', $details['mimeType']);
                $File->Type = end($mimeTypeParts);
            }
        } catch (\Exception $e) {
            $validator->addError('Type', 'Type is missing or invalid.');
        }

        if (!\Validators::string($File->Type)) {
            $validator->addError('Type', 'Type is missing or invalid.');
        }
    }

    public static function validateTitle(\RecordValidator $validator, \Google\DriveFile $File)
    {
        try {
            if (!$File->Title) {
                $details = $File->getGoogleFileDetails();
                $File->Title = $File->details['name'];
            }
        } catch (\Exception $e) {
            $validator->addError('Title', 'Title is missing or invalid.');
        }

        if (!\Validators::string($File->Title)) {
            $validator->addError('Title', 'Title is missing or invalid.');
        }
    }

    public function createPermission($email, $role, $type, $token = null)
    {
        if (!$token) {
            $token = GoogleAPI::fetchAccessToken('https://www.googleapis.com/auth/drive', $this->OwnerEmail);
        }

        $postData = [
            'type' => $type,
            'role' => $role,
            'emailAddress' => $email
        ];

        return GoogleAPI::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID.'/permissions', [
            'method' => 'POST',
            'post' => $postData
        ]);
    }
}
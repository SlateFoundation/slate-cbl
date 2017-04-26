<?php

namespace Google;

use Exception;
use RecordValidator;
use Validators;

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

    public static function __classLoaded()
    {
        if (empty(GoogleAPI::$domain)) {
            throw new Exception('Domain must be configured first');
        }

        if (empty(static::$validators['OwnerEmail']['domain'])) {
            static::$validators['OwnerEmail']['domain'] = GoogleAPI::$domain;
        }
    }

    public function getGoogleFileDetails()
    {
        if ($this->details) {
            return $this->details;
        }

        if (!$this->OwnerEmail) {
            return null;
        }
        $response = API::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID, ['token' => $token]);

        if (!empty($response['error'])) {
            throw new Exception('Error looking up document. '.$response['error']['errors'][0]['message']);
        }

        return $this->details = $response;
    }

    public static function validateType(RecordValidator $validator, self $File)
    {
        try {
            if (!$File->Type) {
                $details = $File->getGoogleFileDetails();
                $mimeTypeParts = explode('.', $details['mimeType']);
                $File->Type = end($mimeTypeParts);
            }
        } catch (Exception $e) {
            $validator->addError('Type', 'Type is missing or invalid.');
        }

        if (!Validators::string($File->Type)) {
            $validator->addError('Type', 'Type is missing or invalid.');
        }
    }

    public static function validateTitle(RecordValidator $validator, self $File)
    {
        try {
            if (!$File->Title) {
                $details = $File->getGoogleFileDetails();
                $File->Title = $details['name'];
            }
        } catch (Exception $e) {
            $validator->addError('Title', 'Title is missing or invalid.');
        }

        if (!Validators::string($File->Title)) {
            $validator->addError('Title', 'Title is missing or invalid.');
        }
    }

    public function createPermission($email, $role, $type, $token = null)
    {
        if (!$token) {
            $token = API::fetchAccessToken('https://www.googleapis.com/auth/drive', $this->OwnerEmail);
        }

        $postData = [
            'type' => $type,
            'role' => $role,
            'emailAddress' => $email
        ];

        return API::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID.'/permissions', [
            'method' => 'POST',
            'post' => $postData,
            'token' => $token
        ]);
    }

    public function duplicate($email, $token = null)
    {
        if (!$token) {
            $token = API::fetchAccessToken('https://www.googleapis.com/auth/drive', $email);
        }

        //TODO: confirm/create read permissions for the user duplicating the file

        return API::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID.'/copy', [
            'post' => [
                'name' => $this->Title,
                'token' => $token
            ]
        ]);
    }
}
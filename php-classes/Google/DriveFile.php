<?php

namespace Google;

use Exception;
use RecordValidator;
use Validators;
use Google\API as GoogleAPI;

class DriveFile extends \ActiveRecord
{

    const GOOGLE_EXCEPTION_CODES = [
        'file-not-found' => 404
    ];

    public static $tableName = 'google_files';

    public static $singularNoun = 'google file';
    public static $pluralNoun = 'google files';

    public static $apiScope = 'https://www.googleapis.com/auth/drive';
    public static $apiFields = 'id,kind,name,mimeType,owners,trashed,webViewLink';

    public $details;


    public static $fields = [
        'OwnerEmail',
        'Title',
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

    public function save($deep = true)
    {
        parent::save($deep);

        if ($this->getOriginalValue('Status') != $this->Status && $this->Status == 'trashed') {
            $message = sprintf(
                'A shared google drive file (<a href="%s" target="_blank">%s</a>) was recently trashed. Please refrain from trashing/deleting shared documents.',
                $this->details['webViewLink'],
                $this->Title
            );

            $this->untrash();

            \Emergence\Mailer\Mailer::send($this->OwnerEmail, 'Google Drive File removed from trash', $message);

        } elseif ($this->getOriginalValue('Status') != $this->Status && $this->Status == 'deleted') {
            $message = sprintf('A tracked google file (<a href="%s" target="_blank">%s</a>) was recently deleted. It previously belonged to %s', $this->details['webViewLink'], $this->Title, $this->OwnerEmail);

            \Emergence\Mailer\Mailer::send('nafis@jarv.us', 'Tracked File Deleted', $message);
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

        $response = API::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID, [
            'user' => $this->OwnerEmail,
            'scope' => static::$apiScope,
            'get' => [
                'fields' => static::$apiFields
            ]
        ]);

        if (!empty($response['error'])) {
            if ($response['error']['errors'][0]['reason'] == 'notFound') {
                $exceptionCode = static::GOOGLE_EXCEPTION_CODES['file-not-found'];
            } else {
                $exceptionCode = 0;
            }
            throw new \Exception('Error looking up document. '.$response['error']['message'], $exceptionCode);
        }

        return $this->details = $response;
    }

    public function updateGoogleFileDetails()
    {
        try {
            $details = $this->getGoogleFileDetails();
        } catch (\Exception $e) {
            if ($e->getCode() === static::GOOGLE_EXCEPTION_CODES['file-not-found'] && !$this->isPhantom) {
                $this->Status = 'deleted';
            }
            throw $e;
        }

        $mimeTypeParts = explode('.', $details['mimeType']);
        $this->Type = end($mimeTypeParts);

        $this->Title = $details['name'];

        if (!empty($details['owners'])) {
            $this->OwnerEmail = $details['owners'][0]['emailAddress'];
        }

        if ($details['trashed']) {
            $this->Status = 'trashed';
        } else {
            $this->Status = 'normal';
        }
    }

    public function createPermission($email, $role, $type)
    {
        return GoogleAPI::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID.'/permissions', [
            'method' => 'POST',
            'post' => [
                'type' => $type,
                'role' => $role,
                'emailAddress' => $email
            ],
            'user' => $this->OwnerEmail,
            'scope' => static::$apiScope
        ]);
    }

    public function duplicate($email)
    {
        $permissionRequest = $this->createPermission($email, 'reader', 'user');

        $response = GoogleAPI::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID.'/copy', [
            'post' => [
                'name' => $this->Title
            ],
            'user' => $email,
            'scope' => static::$apiScope
        ]);

        $duplicatedDriveFile = static::create([
            'DriveID' => $response['id'],
            'ParentDriveID' => $this->DriveID,
            'OwnerEmail' => $email
        ]);

        $duplicatedDriveFile->updateGoogleFileDetails();
        $duplicatedDriveFile->save();

        return $duplicatedDriveFile;

    }

    public function untrash()
    {
        $response = GoogleAPI::request('https://content.googleapis.com/drive/v3/files/'.$this->DriveID, [
            'user' => $this->OwnerEmail,
            'scope' => static::$apiScope,
            'method' => 'PATCH',
            'get' => [
                'fields' => static::$apiFields
            ],
            'post' => [
                'trashed' => false
            ]
        ]);

        $this->details = $response;
        $this->updateGoogleFileDetails();

        $this->save();
    }

    public static function validateType(\RecordValidator $validator, \Google\DriveFile $File)
    {
        try {
            if (!$File->Type) {
                $File->updateGoogleFileDetails();
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
                $File->updateGoogleFileDetails();
            }
        } catch (\Exception $e) {
            $validator->addError('Title', 'Title is missing or invalid.');
        }

        if (!\Validators::string($File->Title)) {
            $validator->addError('Title', 'Title is missing or invalid.');
        }
    }
}
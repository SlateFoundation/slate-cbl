<?php

namespace Google;

use Exception;
use RecordValidator;
use Validators;

use Emergence\Mailer\Mailer;

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

    public static $notificationsEmail;

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
        if (API::$domain && empty(static::$validators['OwnerEmail']['domain'])) {
            static::$validators['OwnerEmail']['domain'] = API::$domain;
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

            $this->untrashFile();

            Mailer::send($this->OwnerEmail, 'Google Drive File removed from trash', $message);

        } elseif ($this->Status == 'deleted' && $this->getOriginalValue('Status') != $this->Status && static::$notificationsEmail) {
            $message = sprintf('A tracked google file (<a href="%s" target="_blank">%s</a>) was recently deleted. It previously belonged to %s', $this->details['webViewLink'], $this->Title, $this->OwnerEmail);

            Mailer::send(static::$notificationsEmail, 'Tracked File Deleted', $message);
        }
    }

    public function getLink()
    {
        if (!empty($this->details['webViewLink'])) {
            return $this->details['webViewLink'];
        }

        if ($this->Type && $this->DriveID) {
            switch ($this->Type) {
                case 'spreadsheet':
                case 'drawing':
                    $prefix = $this->Type.'s';
                    break;

                case 'document':
                case 'presentation':
                    $prefix = $this->Type;
                    break;

                default:
                    $prefix = 'file';
                    break;
            }

            return sprintf('https://docs.google.com/%s/d/%s', $prefix, $this->DriveID);
        }

        return null;
    }

    public function getFileDetails($ignoreCache = false)
    {
        if ($ignoreCache !== false && $this->details) {
            return $this->details;
        }

        if (!$this->OwnerEmail) {
            return null;
        }

        $response = API::getFileDetails($this);

        if (!empty($response['error'])) {
            if ($response['error']['errors'][0]['reason'] == 'notFound') {
                $exceptionCode = static::GOOGLE_EXCEPTION_CODES['file-not-found'];
            } else {
                $exceptionCode = 0;
            }
            throw new Exception('Error looking up document. '.$response['error']['message'], $exceptionCode);
        }

        return $this->details = $response;
    }

    public function applyFileDetails(array $details)
    {
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

    public function updateFileDetails()
    {
        try {
            $details = $this->getFileDetails();
        } catch (Exception $e) {
            if ($e->getCode() === static::GOOGLE_EXCEPTION_CODES['file-not-found'] && !$this->isPhantom) {
                $this->Status = 'deleted';
                return;
            }

            throw $e;
        }

        $this->applyFileDetails($details);
    }

    public function createPermission($email, $role, $type, $getData = [])
    {
        return GoogleAPI::createPermission($this, $email, $role, $type);
    }

    public function transferOwnership($email, $type = 'user')
    {
        return GoogleAPI::transferOwnership($this, $email, $type);
    }

    public function cloneFile()
    {

        $response = API::cloneFile($this);

        $duplicatedDriveFile = static::create([
            'DriveID' => $response['id'],
            'ParentDriveID' => $this->DriveID,
            'OwnerEmail' => $this->OwnerEmail
        ]);

        $duplicatedDriveFile->updateFileDetails();
        $duplicatedDriveFile->save();

        return $duplicatedDriveFile;

    }

    public function untrashFile()
    {
        $response = API::untrashFile($this);

        $this->details = $response;
        $this->updateFileDetails();

        $this->save();
    }

    public static function validateType(RecordValidator $validator, self $File)
    {
        try {
            if (!$File->Type) {
                $File->updateFileDetails();
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
                $File->updateFileDetails();
            }
        } catch (Exception $e) {
            $validator->addError('Title', 'Title is missing or invalid.');
        }

        if (!Validators::string($File->Title)) {
            $validator->addError('Title', 'Title is missing or invalid.');
        }
    }
}
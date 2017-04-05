<?php

namespace Google;

class DriveFile extends \ActiveRecord
{
    public static $tableName = 'google_files';

    public static $singularNoun = 'google file';
    public static $pluralNoun = 'google files';

    public $details;

    public static $fields = [
        'DriveID' => [
            'unique' => true
        ],
        'OwnerEmail',
        'Title',
        'Type',
        'Status' => [
            'values' => ['normal', 'trashed', 'deleted'],
            'default' => 'normal'
        ],
        'ParentDocumentIdentifier' => [
            'default' => null
        ]
    ];

    public static $validators = [
        'OwnerEmail' => [
            'validator' => 'email',
            'required' => true
        ],
        'FileDetails' => [
            'validator' => [__CLASS__, 'validateGoogleFileDetails']
        ]
    ];

    public static $dynamicFields = [
        'FileDetails' => [
            'getter' => 'getGoogleFileDetails'
        ]
    ];

    public function getGoogleFileDetails()
    {
        if (!$this->OwnerEmail) {
            return null;
        }

        $token = API::fetchAccessToken('https://www.googleapis.com/auth/drive', $this->OwnerEmail);

        $response = API::request('https://content.googleapis.com/drive/v3/files/'.$this->ExternalIdentifier, []);

        if (!empty($response['error'])) {
            throw new \Exception('Error looking up document. '.$response['error']['errors'][0]['message']);
        }

        return $response;
    }

    public static function validateGoogleFileDetails(\RecordValidator $validator, File $File)
    {
        if (empty($File->details)) {
            try {
                $File->details = $File->getGoogleFileDetails();
            } catch (\Exception $e) {
                $validator->addError('GoogleDriveFile', $e->getMessage());
            }
        }

        if (empty($File->details)) {
            return;
        }

        if (isset($File->details['name'])) {
            $File->Title = $File->details['name'];
        }

        if (isset($File->details['mimeType'])) {
            $mimeTypeParts = explode('.', $File->details['mimeType']);
            $File->Type = end($mimeTypeParts);
        }
    }
}
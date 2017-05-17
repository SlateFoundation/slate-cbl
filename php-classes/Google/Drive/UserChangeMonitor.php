<?php

namespace Google\Drive;

use Exception;
use Emergence\People\ContactPoint\Email;

use Google\API as GoogleAPI;
use Google\DriveFile;


class UserChangeMonitor extends \ActiveRecord
{
    public static $tableName = 'google_change_monitor';

    public static $singularNoun = 'change monitor';
    public static $pluralNoun = 'change monitors';

    public static $trackModified = true;

    public static $webHookAddress; // = 'https://slate-cbl-dev.ngrok.io/google-file-watch/ping';
    public static $defaultExpiration = 604000000; // just under a week (ms)

    public static $fields = [
        'EmailID' => [
            'type' => 'uint',
            'unique' => true
        ],
        'StartPageToken',
        'Expiration' => [
            'type' => 'timestamp',
            'default' => null
        ],
        'Status' => [
            'type' => 'enum',
            'values' => ['active', 'inactive'],
            'default' => 'active'
        ]
    ];

    public static $validators = [
        'EmailContact' => [
            'validator' => 'require-relationship',
            'required' => true
        ],
        'StartPageToken' => [
            'validator' => 'string',
            'required' => true
        ]
    ];

    public static $relationships = [
        'EmailContact' => [
            'type' => 'one-one',
            'local' => 'EmailID',
            'class' => Email::class
        ]
    ];

    public static function getOrCreate(Email $EmailContact)
    {
        return static::getByWhere(['EmailID' => $EmailContact->ID]) ?: static::create(['EmailID' => $EmailContact->ID]);
    }

    /**
    * expiration (milliseconds)
    */
    public function monitor($expirationTimestamp = null)
    {
        if (empty($expirationTimestamp)) {
            $expiration = round(microtime(true) * 1000 + static::$defaultExpiration);
        } else {
            $expiration = $expirationTimestamp;
        }

        if (!$this->StartPageToken) {
            $this->getStartPageToken();
        }

        $request = GoogleAPI::request('/drive/v3/changes/watch', [
            'user' => $this->EmailContact->toString(),
            'scope' => DriveFile::$apiScope,
            'get' => [
                'pageToken' => $this->StartPageToken
            ],
            'post' => [
                'id' => 'change-monitor-'.$this->EmailID,
                'type' => 'web_hook',
                'address' => static::$webHookAddress,
                'expiration' => $expiration,
                'payload' => true
            ]
        ]);


        if (empty($request['resourceId']) &&
            !(!empty($request['error']) && is_array($request['error']) && !empty($request['error']['errors']) && is_array($request['error']['errors'][0]) && $request['error']['errors'][0]['reason'] == 'channelIdNotUnique')
        ) {
            $this->Status = 'inactive';
            $this->save();
            \Emergence\Logger::general_warning('Failed monitor response for {slateUsername}', [
                'monitorRequest' => $request,
                'slateUsername' => $Teacher->Username
            ]);
            throw new Exception('Error while attempting to monitor user changes.');
        }

        if (!empty($request['expiration'])) {
            $this->Expiration = $request['expiration'] / 1000;
        }

        $this->Status = 'active';
        $this->save();

        return $this->Status == 'active';
    }

    public function getStartPageToken()
    {
        if (!$this->EmailContact) {
            throw new Exception('Email must be set');
        }

        $request = GoogleAPI::request('/drive/v3/changes/startPageToken', [
            'user' => $this->EmailContact->toString(),
            'scope' => DriveFile::$apiScope
        ]);

        if (empty($request['startPageToken'])) {
            throw new Exception('Error retrieving start page token.');
        }

        return $this->StartPageToken = $request['startPageToken'];
    }
}
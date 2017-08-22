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

        $response = GoogleAPI::monitor($this, $expiration);


        if (empty($response['resourceId']) &&
            !(!empty($response['error']) && is_array($response['error']) && !empty($response['error']['errors']) && is_array($response['error']['errors'][0]) && $response['error']['errors'][0]['reason'] == 'channelIdNotUnique')
        ) {
            $this->Status = 'inactive';
            $this->save();
            \Emergence\Logger::general_warning('Failed monitor response for {slateUsername}', [
                'monitorResponse' => $response,
                'slateUsername' => $Teacher->Username
            ]);
            throw new Exception('Error while attempting to monitor user changes.');
        }

        if (!empty($response['expiration'])) {
            $this->Expiration = $response['expiration'] / 1000;
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

        $response = GoogleAPI::getUserChangeMonitorStartPageToken($this);

        if (empty($response['startPageToken'])) {
            throw new Exception('Error retrieving start page token.');
        }

        return $this->StartPageToken = $response['startPageToken'];
    }
}
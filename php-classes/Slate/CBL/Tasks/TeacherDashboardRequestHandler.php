<?php

namespace Slate\CBL\Tasks;

use Sencha_App;
use Sencha_RequestHandler;
use Google\API as GoogleAPI;

class TeacherDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        switch (static::shiftPath()) {
            case '':
            case false:
                return static::handleDashboardRequest();

            case 'bootstrap':
                return static::handleBootstrapRequest();

            default:
                return static::throwNotFoundError();
        }
    }

    public static function handleDashboardRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        return Sencha_RequestHandler::respond('app/SlateTasksTeacher/ext', [
            'App' => Sencha_App::getByName('SlateTasksTeacher'),
            'mode' => 'production'
        ]);
    }

    public static function handleBootstrapRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        return static::respond('bootstrap', [
            'user' => $GLOBALS['Session']->Person,
            'googleApiConfig' => [
                 'domain' => GoogleAPI::$domain,
                 'developerKey' => GoogleAPI::$developerKey,
                 'clientId' => GoogleAPI::$clientId
            ]
        ]);
    }
}
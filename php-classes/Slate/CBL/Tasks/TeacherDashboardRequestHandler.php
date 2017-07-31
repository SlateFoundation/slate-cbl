<?php

namespace Slate\CBL\Tasks;

use Google\API as GoogleAPI;

use Slate\CBL\CBL;

use Sencha_App;
use Sencha_RequestHandler;

class TeacherDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

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
        return Sencha_RequestHandler::respond('app/SlateTasksTeacher/ext', [
            'App' => Sencha_App::getByName('SlateTasksTeacher'),
            'mode' => 'production'
        ]);
    }

    public static function handleBootstrapRequest()
    {
        return static::respond('bootstrap', [
            'cblLevels' => CBL::getLevelsConfig(false),
            'cblRatings' => CBL::getRatingsConfig(),

            'google' => [
                 'domain' => GoogleAPI::$domain,
                 'developerKey' => GoogleAPI::$developerKey,
                 'clientId' => GoogleAPI::$clientId
            ]
        ]);
    }
}
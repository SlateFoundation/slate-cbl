<?php

namespace Slate\CBL\Tasks;

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
            'google' => [
                 'domain' => \Google\API::$domain,
                 'developerKey' => \Google\API::$developerKey,
                 'clientId' => \Google\API::$clientId
            ]
        ]);
    }
}
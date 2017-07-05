<?php

namespace Slate\CBL\Tasks;

class StudentDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

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
        return Sencha_RequestHandler::respond('app/SlateTasksStudent/ext', [
            'App' => Sencha_App::getByName('SlateTasksStudent'),
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
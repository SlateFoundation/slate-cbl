<?php

namespace Slate\CBL\Tasks;

use Emergence\WebApps\SenchaApp;
use Google\API as GoogleAPI;
use Slate\Term;

class StudentDashboardRequestHandler extends \Emergence\Site\RequestHandler
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
        $GLOBALS['Session']->requireAuthentication();

        return static::sendResponse(SenchaApp::load('SlateTasksStudent')->render());
    }

    public static function handleBootstrapRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

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

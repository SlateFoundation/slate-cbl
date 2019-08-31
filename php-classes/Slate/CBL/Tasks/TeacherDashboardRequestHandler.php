<?php

namespace Slate\CBL\Tasks;

use Emergence\WebApps\SenchaApp;
use Google\API as GoogleAPI;


class TeacherDashboardRequestHandler extends \Emergence\Site\RequestHandler
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

        return static::sendResponse(SenchaApp::load('SlateTasksTeacher')->render());
    }

    public static function handleBootstrapRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        $taskFields = [];

        foreach (Task::aggregateStackedConfig('fields') as $field => $config) {
            if (
                isset($config['default'])
                && !(
                    $config['type'] == 'timestamp'
                    && $config['default'] == 'CURRENT_TIMESTAMP'
                )
            ) {
                $taskFields[$field]['default'] = $config['default'];
            }

            if (!empty($config['values'])) {
                $taskFields[$field]['values'] = $config['values'];
            }
        }

        return static::respond('bootstrap', [
            'user' => $GLOBALS['Session']->Person,
            'googleApiConfig' => [
                 'domain' => GoogleAPI::$domain,
                 'developerKey' => GoogleAPI::$developerKey,
                 'clientId' => GoogleAPI::$clientId
            ],
            'taskFields' => $taskFields
        ]);
    }
}

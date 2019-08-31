<?php

namespace Slate\CBL\Demonstrations;

use Emergence\WebApps\SenchaApp;

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

        return static::sendResponse(SenchaApp::load('SlateDemonstrationsTeacher')->render());
    }

    public static function handleBootstrapRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        $demonstrationFields = [];

        foreach (Demonstration::aggregateStackedConfig('fields') as $field => $config) {
            if (
                isset($config['default'])
                && !(
                    $config['type'] == 'timestamp'
                    && $config['default'] == 'CURRENT_TIMESTAMP'
                )
            ) {
                $demonstrationFields[$field]['default'] = $config['default'];
            }

            if (!empty($config['values'])) {
                $demonstrationFields[$field]['values'] = $config['values'];
            }
        }

        return static::respond('bootstrap', [
            'user' => $GLOBALS['Session']->Person,
            'demonstrationFields' => $demonstrationFields
        ]);
    }
}

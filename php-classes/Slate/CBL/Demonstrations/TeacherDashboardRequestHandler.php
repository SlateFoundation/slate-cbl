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

        return static::sendResponse(SenchaApp::load('SlateDemonstrationsTeacher')->render(), 'webapps/SlateDemonstrationsTeacher');
    }

    public static function handleBootstrapRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        return static::respond('bootstrap', [
            'experience_types' => ExperienceDemonstration::$experienceTypeOptions,
            'performance_types' => ExperienceDemonstration::$performanceTypeOptions,
            'context_options' => ExperienceDemonstration::$contextOptions
        ]);
    }
}
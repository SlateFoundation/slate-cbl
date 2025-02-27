<?php

namespace Slate\CBL\Tasks;

use Emergence\WebApps\VueApp;

class LibraryRequestHandler extends \Emergence\Site\RequestHandler
{
    public static function handleRequest()
    {
        switch (static::shiftPath()) {
            case '':
            case false:
                return static::handleDashboardRequest();

            default:
                return static::throwNotFoundError();
        }
    }

    public static function handleDashboardRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Administrator');

        $app = VueApp::load('SlateTaskLibrary');

        return static::sendResponse($app->render());
    }
}
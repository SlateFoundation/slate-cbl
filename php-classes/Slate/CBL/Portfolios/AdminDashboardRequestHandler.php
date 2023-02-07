<?php

namespace Slate\CBL\Portfolios;

use Emergence\WebApps\VueApp;

class AdminDashboardRequestHandler extends \Emergence\Site\RequestHandler
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

        $app = VueApp::load('SlatePortfolioManager');

        return static::sendResponse($app->render());
    }
}

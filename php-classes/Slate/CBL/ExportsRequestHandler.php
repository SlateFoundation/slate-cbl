<?php
// TODO: delete this

namespace Slate\CBL;

use Emergence_FS;

class ExportsRequestHandler extends \RequestHandler
{

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        $scripts = [];
        foreach (Emergence_FS::getAggregateChildren('site-root/cbl/exports') as $scriptName => $scriptFile) {
            preg_match('/(.+\.csv)\.php/', $scriptName, $matches);
            if (!empty($matches)) {
                $scripts[$matches[1]] = $scriptFile;
            }
        }

        return static::respond('index', [
            'data' => $scripts
        ]);
    }
}
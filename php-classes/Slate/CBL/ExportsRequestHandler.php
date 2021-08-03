<?php
// TODO: delete this now that all references to it have been removed?
// If so, also remove ./site-root/cbl/exports/_index.php and the ./site-root/cbl/exports folder.

namespace Slate\CBL;

use Emergence_FS;

class ExportsRequestHandler extends \RequestHandler
{

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        $scripts = [];

        /* Removing per SCHOOL-83 - Delete all deprecated exports under /cbl/exports
        foreach (Emergence_FS::getAggregateChildren('site-root/cbl/exports') as $scriptName => $scriptFile) {
            preg_match('/(.+\.csv)\.php/', $scriptName, $matches);
            if (!empty($matches)) {
                $scripts[$matches[1]] = $scriptFile;
            }
        }
        */

        return static::respond('index', [
            'data' => $scripts
        ]);
    }
}
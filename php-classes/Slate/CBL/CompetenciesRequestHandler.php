<?php

namespace Slate\CBL;

use DB;
use SpreadsheetWriter;
use TableNotFoundException;
use Slate\People\Student;

class CompetenciesRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = Competency::class;
    public static $browseOrder = 'ContentAreaID, Code';
    public static $accountLevelBrowse = 'User';

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        if (!empty($_GET['content_area'])) {
            if (!$ContentArea = ContentAreasRequestHandler::getRecordByHandle($_GET['content_area'])) {
                return static::throwNotFoundError('Content area not found');
            }

            $conditions['ContentAreaID'] = $ContentArea->ID;
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }
}

<?php

namespace Slate\CBL;

class ContentAreasRequestHandler extends RecordsRequestHandler
{
    public static $recordClass = ContentArea::class;
    public static $browseOrder = 'Code';
    public static $accountLevelBrowse = 'User';


    protected static function buildBrowseConditions(array $conditions = [], array &$filterObjects = [])
    {
        $conditions = parent::buildBrowseConditions($conditions, $filterObjects);

        if (empty($_REQUEST['status']) || $_REQUEST['status'] != '*') {
            $conditions['Status'] = 'active';
        }

        return $conditions;
    }
}

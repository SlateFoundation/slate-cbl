<?php

namespace Slate\CBL;

class CompetenciesRequestHandler extends RecordsRequestHandler
{
    public static $recordClass = Competency::class;
    public static $browseOrder = 'ContentAreaID, Code';
    public static $accountLevelBrowse = 'User';

    protected static function buildBrowseConditions(array $conditions = [], array &$filterObjects = [])
    {
        $conditions = parent::buildBrowseConditions($conditions, $filterObjects);

        if ($ContentArea = static::getRequestedContentArea()) {
            $conditions['ContentAreaID'] = $ContentArea->ID;
            $filterObjects['ContentArea'] = $ContentArea;
        }

        return $conditions;
    }
}

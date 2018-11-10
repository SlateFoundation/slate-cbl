<?php

namespace Slate\CBL;

class SkillsRequestHandler extends RecordsRequestHandler
{
    public static $recordClass = Skill::class;
    public static $browseOrder = false;
    public static $accountLevelBrowse = 'User';

    public static function __classLoaded()
    {
        $recordClass = static::$recordClass;
        static::$browseOrder = sprintf('LENGTH(%1$s.Code), %1$s.Code', $recordClass::getTableAlias());
    }

    public static function handleBrowseRequest($options = array(), $conditions = array(), $responseID = null, $responseData = array())
    {
        if (!empty($_GET['competency'])) {
            if (!$Competency = CompetenciesRequestHandler::getRecordByHandle($_GET['competency'])) {
                return static::throwNotFoundError('Competency not found');
            }

            $conditions['CompetencyID'] = $Competency->ID;
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }
}
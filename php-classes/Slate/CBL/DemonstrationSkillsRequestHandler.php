<?php

namespace Slate\CBL;

use DB;
use Emergence\People\PeopleRequestHandler;

class DemonstrationSkillsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = DemonstrationSkill::class;

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        if (!empty($_GET['skill'])) {
            if (!$Skill = SkillsRequestHandler::getRecordByHandle($_GET['skill'])) {
                return static::throwNotFoundError('Skill not found');
            }

            $conditions['SkillID'] = $Skill->ID;
        }

        if (!empty($_GET['student'])) {
            if (!$Student = PeopleRequestHandler::getRecordByHandle($_GET['student'])) {
                return static::throwNotFoundError('Student not found');
            }

            $demonstrationIds = DB::allValues('ID', 'SELECT ID FROM `%s` WHERE StudentID = %u', [Demonstration::$tableName, $Student->ID]);

            $conditions[] = 'DemonstrationID IN ('.(count($demonstrationIds) ? implode(',', $demonstrationIds) : '0').')';
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }
}
<?php

namespace Slate\CBL\Demonstrations;

use DB;
use Emergence\People\GuardianRelationship;
use Emergence\People\PeopleRequestHandler;
use Slate\CBL\SkillsRequestHandler;

class DemonstrationSkillsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = DemonstrationSkill::class;
    public static $browseOrder = ['ID' => 'ASC'];
    public static $accountLevelRead = 'Staff';
    public static $accountLevelBrowse = 'User';
    public static $accountLevelComment = 'Staff';
    public static $accountLevelAPI = 'User';

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        if (!empty($_GET['skill'])) {
            if (!$Skill = SkillsRequestHandler::getRecordByHandle($_GET['skill'])) {
                return static::throwNotFoundError('Skill not found');
            }

            $conditions['SkillID'] = $Skill->ID;
            $responseData['Skill'] = $Skill;
        }

        if (!empty($_GET['student'])) {
            if ($_GET['student'] == '*current') {
                $GLOBALS['Session']->requireAuthentication();
                $Student = $GLOBALS['Session']->Person;
            } elseif (!$Student = PeopleRequestHandler::getRecordByHandle($_GET['student'])) {
                return static::throwNotFoundError('Student not found');
            }

            if (
                !$GLOBALS['Session']->hasAccountLevel('Staff') &&
                $Student->ID != $GLOBALS['Session']->PersonID &&
                !$GuardianRelationship = GuardianRelationship::getByWhere([
                    'Class' => GuardianRelationship::class,
                    'PersonID' => $Student->ID,
                    'RelatedPersonID' => $GLOBALS['Session']->PersonID,
                ])
            ) {
                return static::throwUnauthorizedError('Only staff and guardians may browse others\' records');
            }

            $demonstrationIds = DB::allValues('ID', 'SELECT ID FROM `%s` WHERE StudentID = %u', [Demonstration::$tableName, $Student->ID]);

            $conditions[] = 'DemonstrationID IN ('.(count($demonstrationIds) ? implode(',', $demonstrationIds) : '0').')';
            $responseData['Student'] = $Student;
        } elseif (!$GLOBALS['Session']->hasAccountLevel('Staff')) {
            return static::throwUnauthorizedError('Only staff may browse all records');
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }
}
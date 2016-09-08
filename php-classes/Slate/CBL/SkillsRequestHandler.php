<?php

namespace Slate\CBL;

class SkillsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = Skill::class;
    public static $accountLevelBrowse = false;

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

//    public static function handleRecordRequest(\ActiveRecord $Skill, $action = false)
//    {
//        switch ($action ? $action : $action = static::shiftPath()) {
//            case 'demonstrations':
//                return static::handleDemonstrationsRequest($Skill);
//            default:
//                return parent::handleRecordRequest($Skill, $action);
//        }
//    }

//    public static function handleDemonstrationsRequest(Skill $Skill)
//    {
//        if (!empty($_GET['student']) && ctype_digit($_GET['student'])) {
//            $studentId = $_GET['student'];
//        } else {
//            $studentId = null;
//        }
//
//
//        $query = sprintf('SELECT DemonstrationSkill.* FROM `%s` DemonstrationSkill', DemonstrationSkill::$tableName);
//
//        if ($studentId) {
//            $query .= sprintf(' JOIN `%s` Demonstration ON Demonstration.ID = DemonstrationSkill.DemonstrationID', Demonstration::$tableName);
//        }
//
//
//        $query .= sprintf(' WHERE DemonstrationSkill.SkillID = %u', $Skill->ID);
//
//        if ($studentId) {
//            $query .= sprintf(' AND Demonstration.StudentID = %u', $studentId);
//        }
//
//
//        return static::respond('skillDemonstrations', [
//            'success' => true,
//            'data' => DemonstrationSkill::getAllByQuery($query),
//            'skill' => $Skill
//        ]);
//    }
}
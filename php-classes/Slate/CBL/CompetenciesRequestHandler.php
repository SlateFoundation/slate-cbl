<?php

namespace Slate\CBL;

use DB;
use TableNotFoundException;

class CompetenciesRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = 'Slate\\CBL\\Competency';
    public static $browseOrder = 'ContentAreaID, Code';

    public static function handleRecordRequest(\ActiveRecord $Competency, $action = false)
    {
        switch ($action ? $action : $action = static::shiftPath()) {
            case 'demonstrations':
                return static::handleDemonstrationsRequest($Competency);
            default:
                return parent::handleRecordRequest($Competency, $action);
        }
    }
    
    public static function handleDemonstrationsRequest(Competency $Competency)
    {
        // get input students
        if (empty($_REQUEST['students'])) {
            return static::throwInvalidRequestError('students required');
        }

        $students = is_string($_REQUEST['students']) ? explode(',', $_REQUEST['students']) : $_REQUEST['students'];
        
        foreach ($students AS $studentId) {
            if (!ctype_digit($studentId)) {
                return static::throwInvalidRequestError('competency required');
            }
        }

        // query demonstrations sums
        try {
            $skillDemonstrations = DB::allRecords(
                'SELECT Demonstration.ID AS DemonstrationID, Demonstration.StudentID, DemonstrationSkill.SkillID, DemonstrationSkill.Level'
                .' FROM (SELECT ID FROM `%s` WHERE CompetencyID = %u) AS Skill'
                .' JOIN `%s` DemonstrationSkill'
                .'  ON DemonstrationSkill.SkillID = Skill.ID'
                .' JOIN (SELECT ID, StudentID FROM `%s` WHERE StudentID IN (%s)) Demonstration'
                .'  ON Demonstration.ID = DemonstrationSkill.DemonstrationID'
                ,[
                    Skill::$tableName
                    ,$Competency->ID
                    ,DemonstrationSkill::$tableName
                    ,Demonstration::$tableName
                    ,implode(',', $students)
                ]
            );
        } catch (TableNotFoundException $e) {
            $skillDemonstrations = [];
        }
        
        // cast strings to integers
        foreach ($skillDemonstrations AS &$skillDemonstration) {
            $skillDemonstration['DemonstrationID'] = intval($skillDemonstration['DemonstrationID']);
            $skillDemonstration['StudentID'] = intval($skillDemonstration['StudentID']);
            $skillDemonstration['SkillID'] = intval($skillDemonstration['SkillID']);
        }

        return static::respond('skills', [
            'data' => $skillDemonstrations
        ]);
    }
}
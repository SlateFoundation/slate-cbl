<?php

namespace Slate\CBL;

use DB;
use TableNotFoundException;

class ContentAreasRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = 'Slate\\CBL\\ContentArea';
    public static $browseOrder = 'Code';

    public static function handleRecordRequest(\ActiveRecord $ContentArea, $action = false)
    {
        switch ($action ? $action : $action = static::shiftPath()) {
            case 'competencies':
                return static::handleCompetenciesRequest($ContentArea);
            default:
                return parent::handleRecordRequest($ContentArea, $action);
        }
    }
    
    public static function handleCompetenciesRequest(ContentArea $ContentArea)
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

        // query total demonstrations required per competency in this content area
        try {
            $competencies = DB::table(
                'ID'
                ,'SELECT Competency.*, SUM(Skill.DemonstrationsNeeded) AS totalDemonstrationsNeeded'
                    .' FROM `%s` AS Competency'
                    .' JOIN `%s` Skill ON Skill.CompetencyID = Competency.ID'
                    .' WHERE ContentAreaID = %u'
                    .' GROUP BY (Competency.ID)'
                ,[
                    Competency::$tableName
                    ,Skill::$tableName
                    ,$ContentArea->ID
                ]
            );
        } catch (TableNotFoundException $e) {
            $competencies = [];
        }
        
        // query per-student and per-competency completed demonstrations
        try {
            $studentCompetencies = DB::allRecords(
                'SELECT Demonstration.StudentID, Skill.ID, Skill.CompetencyID, LEAST(Skill.DemonstrationsNeeded, COUNT(Demonstration.ID)) AS demonstrations'
                .' FROM (SELECT ID, CompetencyID, DemonstrationsNeeded FROM `%s` WHERE CompetencyID IN (%s)) Skill'
                .' JOIN `%s` DemonstrationSkill'
                .'  ON DemonstrationSkill.SkillID = Skill.ID'
                .' JOIN (SELECT ID, StudentID FROM `%s` WHERE StudentID IN (%s)) Demonstration'
                .'  ON Demonstration.ID = DemonstrationSkill.DemonstrationID'
                .' GROUP BY StudentID, Skill.ID'
                ,[
                    Skill::$tableName
                    ,implode(',', array_keys($competencies))
                    ,DemonstrationSkill::$tableName
                    ,Demonstration::$tableName
                    ,implode(',', $students)
                ]
            );
        } catch (TableNotFoundException $e) {
            $studentCompetencies = [];
        }

        // sort demonstrations into competencies array and index by student id
        foreach ($studentCompetencies AS $studentCompetency) {
            $competencies[$studentCompetency['CompetencyID']]['studentDemonstrations'][$studentCompetency['StudentID']] += (int)$studentCompetency['demonstrations'];
        }

        return static::respond('competencies', [
            'data' => array_values($competencies)
        ]);
    }
}
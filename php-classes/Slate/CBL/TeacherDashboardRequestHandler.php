<?php

namespace Slate\CBL;

use DB;
use TableNotFoundException;

class TeacherDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json'
        ,'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');
        
        switch ($action = static::shiftPath()) {
            case 'competencies':
                return static::handleCompetenciesRequest();
            case 'demonstrations':
                return static::handleDemonstrationsRequest();
            case '':
            case false:
                return static::handleDashboardRequest();
            default:
                return static::throwNotFoundError();
        }
    }
    
    public static function handleDashboardRequest()
    {
        if (!empty($_GET['content-area'])) {
            if (ctype_digit($_GET['content-area'])) {
                $ContentArea = ContentArea::getByID($_GET['content-area']);
            } else {
                $ContentArea = ContentArea::getByCode($_GET['content-area']);
            }
        }

        // TODO: get total + required demonstrations and supply in map 

        return static::respond('teacher-dashboard', [
            'students' => \Slate\People\Student::getAllByClass()
            ,'ContentArea' => $ContentArea 
        ]);
    }
    
    public static function handleCompetenciesRequest()
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

        // get input content area
        if (empty($_REQUEST['content-area'])) {
            return static::throwInvalidRequestError('content-area required');
        }
        
        if (ctype_digit($_REQUEST['content-area'])) {
            $ContentArea = ContentArea::getByID($_REQUEST['content-area']);
        } else {
            $ContentArea = ContentArea::getByCode($_REQUEST['content-area']);
        }

        if (!$ContentArea) {
            return static::throwNotFoundError('content-area not found');
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
    
    public static function handleDemonstrationsRequest()
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

        // get input competency
        if (empty($_REQUEST['competency'])) {
            return static::throwInvalidRequestError('competency required');
        }
        
        if (ctype_digit($_REQUEST['competency'])) {
            $Competency = Competency::getByID($_REQUEST['competency']);
        } else {
            $Competency = Competency::getByCode($_REQUEST['competency']);
        }

        if (!$Competency) {
            return static::throwNotFoundError('competency not found');
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
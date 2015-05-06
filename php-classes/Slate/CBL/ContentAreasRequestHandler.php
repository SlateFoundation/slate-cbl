<?php

namespace Slate\CBL;

use DB;
use TableNotFoundException;
use Slate\People\Student;

class ContentAreasRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = ContentArea::class;
    public static $browseOrder = 'Code';

    public static function handleRecordRequest(\ActiveRecord $ContentArea, $action = false)
    {
        switch ($action ? $action : $action = static::shiftPath()) {
            case 'competencies':
                return static::handleCompetenciesRequest($ContentArea);
            case 'recent-progress':
                return static::handleRecentProgressRequest($ContentArea, $action);
            default:
                return parent::handleRecordRequest($ContentArea, $action);
        }
    }

    public static function handleCompetenciesRequest(ContentArea $ContentArea)
    {
        // get input students
        if (empty($_REQUEST['students'])) {
            $studentIds = [];
        } else {
            $studentIds = is_string($_REQUEST['students']) ? explode(',', $_REQUEST['students']) : $_REQUEST['students'];
        }

        $students = [];
        foreach ($studentIds AS $studentId) {
            if (!ctype_digit($studentId)) {
                return static::throwInvalidRequestError('students must be identified by integer ID');
            }

            if (!$students[] = Student::getByID($studentId)) {
                return static::throwInvalidRequestError('student ID not found');
            }
        }

        // get data for all competencies
        $competencies = [];
        foreach ($ContentArea->Competencies AS $Competency) {
            $competencyData = $Competency->getDetails(['totalDemonstrationsRequired', 'minimumAverage']);

            foreach ($students AS $Student) {
                $competencyData['studentCompletions'][$Student->ID] = $Competency->getCompletionForStudent($Student);
            }

            $competencies[] = $competencyData;
        }

#        // query per-student and per-competency completed demonstrations
#        try {
#            $studentCompetencies = DB::allRecords(
#                'SELECT Demonstration.StudentID, Skill.ID, Skill.CompetencyID, LEAST(Skill.DemonstrationsRequired, COUNT(Demonstration.ID)) AS demonstrations'
#                .' FROM (SELECT ID, CompetencyID, DemonstrationsRequired FROM `%s` WHERE CompetencyID IN (%s)) Skill'
#                .' JOIN `%s` DemonstrationSkill'
#                .'  ON DemonstrationSkill.SkillID = Skill.ID'
#                .' JOIN (SELECT ID, StudentID FROM `%s` WHERE StudentID IN (%s)) Demonstration'
#                .'  ON Demonstration.ID = DemonstrationSkill.DemonstrationID'
#                .' GROUP BY StudentID, Skill.ID'
#                ,[
#                    Skill::$tableName
#                    ,implode(',', array_keys($competencies))
#                    ,DemonstrationSkill::$tableName
#                    ,Demonstration::$tableName
#                    ,implode(',', $students)
#                ]
#            );
#        } catch (TableNotFoundException $e) {
#            $studentCompetencies = [];
#        }
#
#        // sort demonstrations into competencies array and index by student id
#        foreach ($studentCompetencies AS $studentCompetency) {
#            $competencies[$studentCompetency['CompetencyID']]['studentDemonstrations'][$studentCompetency['StudentID']] += (int)$studentCompetency['demonstrations'];
#        }

        return static::respond('competencies', [
            'data' => $competencies
        ]);
    }
    
    public static function handleRecentProgressRequest($contentArea) {
        $student = $_GET['student'];
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 10;

        if (!ctype_digit($student)) {
            return static::throwInvalidRequestError('student must be identified by integer ID');
        }

        try {
            $progress = DB::allRecords("
                SELECT ds.DemonstratedLevel,
                       CONCAT(CASE p.Gender
                         WHEN 'Male'   THEN 'Mr. '
                         WHEN 'Female' THEN 'Ms. '
                          END, p.lastName) AS teacher,
                       s.Descriptor AS skill,
                       c.Descriptor AS competency
                  FROM %s AS ds
                  JOIN %s AS p
                    ON ds.CreatorID = p.ID
                  JOIN %s AS d
                    ON d.ID = ds.DemonstrationID
                  JOIN %s AS s
                    ON s.ID = ds.SkillID
                  JOIN %s AS c
                    ON c.ID = s.CompetencyID
                  WHERE d.StudentID = %s
                    AND c.ContentAreaID = %s
                  ORDER BY d.Created DESC
                  LIMIT %d;",
                [
                    DemonstrationSkill::$tableName,
                    \Emergence\People\Person::$tableName,
                    Demonstration::$tableName,
                    Skill::$tableName,
                    Competency::$tableName,
                    $student,
                    $contentArea->ID,
                    $limit
                ]
            );
        } catch (TableNotFoundException $e) {
            $progress = [];
        }
        
        return static::respond('progress', [
            'data' => $progress
        ]);
    }
}
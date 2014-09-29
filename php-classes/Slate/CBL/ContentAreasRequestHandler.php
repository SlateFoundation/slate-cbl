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

        foreach ($studentIds AS $studentId) {
            if (!ctype_digit($studentId)) {
                return static::throwInvalidRequestError('students must be identified by integer ID');
            }

            if (!$students[] = Student::getByID($studentId)) {
                return static::throwInvalidRequestError('student ID not found');
            }
        }

        // get data for all competencie
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
}
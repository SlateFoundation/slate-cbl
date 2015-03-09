<?php

namespace Slate\CBL;

use DB;
use SpreadsheetWriter;
use TableNotFoundException;
use Slate\People\Student;

class CompetenciesRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = Competency::class;
    public static $browseOrder = 'ContentAreaID, Code';


    public static function handleRecordsRequest($action = null)
    {
        switch ($action ?: $action = static::shiftPath()) {
            case 'export':
                return static::handleExportRequest();
            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function handleRecordRequest(\ActiveRecord $Competency, $action = false)
    {
        switch ($action ? $action : $action = static::shiftPath()) {
            case 'demonstrations':
                return static::handleDemonstrationsRequest($Competency);
            default:
                return parent::handleRecordRequest($Competency, $action);
        }
    }

    public static function handleExportRequest()
    {
        $sw = new SpreadsheetWriter();

        // fetch key objects from database
        $students = Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
        $contentAreas = ContentArea::getAll(['order' => 'Code']);


        // collect counts of all missing demonstrations by student+competency
        try {
            $missingResults = DB::allRecords(
                'SELECT StudentID, CompetencyID, SUM(neededDemonstrationsMissed) AS totalNeededDemonstrationsMissed'
                .' FROM ('
                .'  SELECT'
                .'    Demonstration.StudentID'
                .'    ,Skill.CompetencyID'
#                .'    ,DemonstrationSkill.SkillID'
#                .'    ,Skill.DemonstrationsRequired'
#                .'    ,SUM(IF(DemonstrationSkill.Level = 0, 1, 0)) totalMissing'
#                .'    ,SUM(IF(DemonstrationSkill.Level != 0, 1, 0)) totalNotMissing'
                .'    ,LEAST('
                .'       GREATEST(Skill.DemonstrationsRequired - SUM(IF(DemonstrationSkill.Level != 0, 1, 0)), 0)' // how many needed demonstrations don't have non-missing levels
                .'       ,SUM(IF(DemonstrationSkill.Level = 0, 1, 0))' // total missing demonstrations for this skill
                .'    ) AS neededDemonstrationsMissed'
                .'   FROM `%s` Demonstration'
                .'   JOIN `%s` DemonstrationSkill'
                .'    ON DemonstrationSkill.DemonstrationID = Demonstration.ID'
                .'   JOIN `%s` Skill'
                .'    ON Skill.ID = DemonstrationSkill.SkillID'
                .'   WHERE Demonstration.StudentID IN (%s)'
                .'   GROUP BY Demonstration.StudentID, DemonstrationSkill.SkillID'
                .' ) MissingDemonstrationsByStudentSkill'
                .' GROUP BY StudentID, CompetencyID'
                ,[
                    Demonstration::$tableName
                    ,DemonstrationSkill::$tableName
                    ,Skill::$tableName
                    ,implode(',', array_map(function($Student) {
                        return $Student->ID;
                    }, $students))
                ]
            );

            $missingDemonstrationsByStudentCompetency = [];
            foreach ($missingResults AS $result) {
                $missingDemonstrationsByStudentCompetency[$result['StudentID']][$result['CompetencyID']] = intval($result['totalNeededDemonstrationsMissed']);
            }
        } catch (TableNotFoundException $e) {
            $missingDemonstrationsByStudentCompetency = [];
        }


        // build and output headers list
        $headers = [
            'Student Name',
            'Student Number',
            'Grade Level'
        ];

        foreach ($contentAreas AS $ContentArea) {
            foreach ($ContentArea->Competencies AS $Competency) {
                $headers[] = $Competency->Code . '-Logged';
                $headers[] = $Competency->Code . '-Total';
                $headers[] = $Competency->Code . '-AVG';
            }

            $headers[] = $ContentArea->Code . '-Logged';
            $headers[] = $ContentArea->Code . '-Total';
            $headers[] = $ContentArea->Code . '-Missing';
            $headers[] = $ContentArea->Code . '-AVG';
        }

        $sw->writeRow($headers);


        // one row for each demonstration
        foreach ($students AS $Student) {
            $row = [
                $Student->FullName,
                $Student->StudentNumber,
                9 // TODO: don't hardcode
            ];

            foreach ($contentAreas AS $ContentArea) {
                $demonstrationsCounted = 0;
                $demonstrationsRequired = 0;
                $demonstrationsMissing = 0;
                $contentAreaAverageTotal = 0;
                
                foreach ($ContentArea->Competencies AS $Competency) {
                    $competencyCompletion = $Competency->getCompletionForStudent($Student);
                    
                    // Logged
                    $row[] = $competencyCompletion['demonstrationsCount'];
                    // Total
                    $row[] = $Competency->getTotalDemonstrationsRequired();
                    // Average
                    $row[] = $competencyCompletion['demonstrationsCount'] ? round($competencyCompletion['demonstrationsAverage'], 2) : null;

                    $demonstrationsCounted += $competencyCompletion['demonstrationsCount'];
                    $demonstrationsRequired += $Competency->getTotalDemonstrationsRequired();
                    
                    // averages are weighted by number of demonstrations
                    $contentAreaAverageTotal += $competencyCompletion['demonstrationsAverage'] * $competencyCompletion['demonstrationsCount'];

                    if(isset($missingDemonstrationsByStudentCompetency[$Student->ID][$Competency->ID])) {
                        $demonstrationsMissing += $missingDemonstrationsByStudentCompetency[$Student->ID][$Competency->ID];
                    }
                }

                $row[] = $demonstrationsCounted;
                $row[] = $demonstrationsRequired;
                $row[] = $demonstrationsMissing;
                $row[] = $demonstrationsCounted ? round($contentAreaAverageTotal / $demonstrationsCounted, 2) : null;
            }

            $sw->writeRow($row);
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
            $skillDemonstrations = DB::allRecords('
                 SELECT Demonstration.ID AS DemonstrationID,
                        Demonstration.StudentID,
                        Demonstration.Demonstrated,
                        DemonstrationSkill.SkillID,
                        DemonstrationSkill.Level,
                        DemonstrationSkill.ID
                   FROM (SELECT ID
                           FROM `%s`
                          WHERE CompetencyID = %u) AS Skill
                   JOIN `%s` DemonstrationSkill
                     ON DemonstrationSkill.SkillID = Skill.ID
                   JOIN (SELECT ID, StudentID, UNIX_TIMESTAMP(Demonstrated) AS Demonstrated
                           FROM `%s`
                          WHERE StudentID IN (%s)) Demonstration
                     ON Demonstration.ID = DemonstrationSkill.DemonstrationID'
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
            $skillDemonstration['Demonstrated'] = intval($skillDemonstration['Demonstrated']);
            $skillDemonstration['StudentID'] = intval($skillDemonstration['StudentID']);
            $skillDemonstration['SkillID'] = intval($skillDemonstration['SkillID']);
            $skillDemonstration['Level'] = intval($skillDemonstration['Level']);
            $skillDemonstration['ID'] = intval($skillDemonstration['ID']);
        }

        return static::respond('skills', [
            'data' => $skillDemonstrations
        ]);
    }
}

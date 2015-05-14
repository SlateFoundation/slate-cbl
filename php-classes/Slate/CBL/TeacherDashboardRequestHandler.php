<?php

namespace Slate\CBL;

use DB, TableNotFoundException;
use Slate\People\Student;

class TeacherDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        switch ($action = static::shiftPath()) {
            case '':
            case false:
                return static::handleDashboardRequest();
            case 'completions':
                return static::handleCompletionsRequest();
            case 'skill-demonstrations':
                return static::handleSkillDemonstrationsRequest();
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

        if (!empty($_GET['students'])) {
            try {
                $students = Student::getAllByListIdentifier($_GET['students']);
            } catch (\Exception $e) {
                return static::throwNotFoundError('Unable to load students list: ' . $e->getMessage());
            }
        }

        return static::respond('teacher-dashboard', [
            'ContentArea' => $ContentArea,
            'students' => $students
        ]);
    }

    public static function handleCompletionsRequest()
    {
        if (empty($_GET['students']) || !($students = Student::getAllByListIdentifier($_GET['students']))) {
            return static::throwNotFoundError('Students list required');
        }

        if (empty($_GET['competencies']) || !($competencies = Competency::getAllByListIdentifier($_GET['competencies']))) {
            return static::throwNotFoundError('Competencies list required');
        }

        $completions = [];

        foreach ($students AS $Student) {
            foreach ($competencies AS $Competency) {
                $completions[] = array_merge([
                    'StudentID' => $Student->ID,
                    'CompetencyID' => $Competency->ID
                ], $Competency->getCompletionForStudent($Student));
            }
        }

        return static::respond('completions', $completions);
    }

    public static function handleSkillDemonstrationsRequest()
    {
        if (empty($_GET['students']) || !($students = Student::getAllByListIdentifier($_GET['students']))) {
            return static::throwNotFoundError('Students list required');
        }

        if (empty($_GET['competencies']) || !($competencies = Competency::getAllByListIdentifier($_GET['competencies']))) {
            return static::throwNotFoundError('Competencies list required');
        }

        // query demonstrations sums
        try {
            $skillDemonstrations = DB::allRecords('
                 SELECT Demonstration.ID AS DemonstrationID,
                        Demonstration.StudentID,
                        Demonstration.Demonstrated,
                        DemonstrationSkill.SkillID,
                        DemonstrationSkill.TargetLevel,
                        DemonstrationSkill.DemonstratedLevel,
                        DemonstrationSkill.ID
                   FROM (SELECT ID
                           FROM `%1$s`
                          WHERE CompetencyID IN (%5$s)) AS Skill
                   JOIN `%2$s` DemonstrationSkill
                     ON DemonstrationSkill.SkillID = Skill.ID
                   JOIN (SELECT ID, StudentID, UNIX_TIMESTAMP(Demonstrated) AS Demonstrated
                           FROM `%3$s`
                          WHERE StudentID IN (%6$s)) Demonstration
                     ON Demonstration.ID = DemonstrationSkill.DemonstrationID
                   JOIN (SELECT StudentID, MAX(Level) AS CurrentLevel
                           FROM `%4$s`
                          WHERE StudentID IN (%6$s) AND CompetencyID IN (%5$s)
                          GROUP BY StudentID) StudentCompetency
                     ON StudentCompetency.StudentID = Demonstration.StudentID
                    AND StudentCompetency.CurrentLevel = DemonstrationSkill.TargetLevel'
                ,[
                    Skill::$tableName                   // 1
                    ,DemonstrationSkill::$tableName     // 2
                    ,Demonstration::$tableName          // 3
                    ,StudentCompetency::$tableName      // 4
                    ,implode(',', array_map(function($Competency) {
                        return $Competency->ID;
                    }, $competencies))                  // 5
                    ,implode(',', array_map(function($Student) {
                        return $Student->ID;
                    }, $students))                      // 6
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
            $skillDemonstration['TargetLevel'] = intval($skillDemonstration['TargetLevel']);
            $skillDemonstration['DemonstratedLevel'] = intval($skillDemonstration['DemonstratedLevel']);
            $skillDemonstration['ID'] = intval($skillDemonstration['ID']);
        }

        return static::respond('skillDemonstrations', $skillDemonstrations);
    }
}
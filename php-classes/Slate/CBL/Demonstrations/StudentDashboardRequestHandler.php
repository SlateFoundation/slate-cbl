<?php

namespace Slate\CBL\Demonstrations;

use DB, TableNotFoundException;

use Emergence\People\Person;
use Emergence\People\GuardianRelationship;
use Emergence\People\PeopleRequestHandler;

use Sencha_App;
use Sencha_RequestHandler;

use Slate\CBL\ContentArea;
use Slate\CBL\ContentAreasRequestHandler;
use Slate\CBL\Competency;
use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;
use Slate\People\Student;


class StudentDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        switch ($action = static::shiftPath()) {
            case '':
            case false:
                return static::handleDashboardRequest();

            case 'bootstrap':
                return static::handleBootstrapRequest();

            case 'content-areas':
                return static::handleContentAreasRequest();

            case 'recent-progress':
                return static::handleRecentProgressRequest();

            case 'completions':
                return static::handleCompletionsRequest();

            case 'demonstration-skills':
                return static::handleDemonstrationSkillsRequest();

            default:
                return static::throwNotFoundError();
        }
    }

    public static function handleDashboardRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

        return Sencha_RequestHandler::respond('app/SlateDemonstrationsStudent/ext', [
            'App' => Sencha_App::getByName('SlateDemonstrationsStudent'),
            'mode' => 'production'
        ]);
    }

    public static function handleBootstrapRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

        return static::respond('bootstrap', [
            'user' => $GLOBALS['Session']->Person
        ]);
    }

    public static function handleContentAreasRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

        $conditions = [];

        if ($GLOBALS['Session']->Person->isA(Student::class)) {
            $conditions['ID'] = [
                'operator' => 'IN',
                'values' => DB::allValues(
                    'ContentAreaID',
                    '
                    SELECT DISTINCT `%4$s`.ContentAreaID AS ContentAreaID
                      FROM `%1$s` %2$s
                      JOIN `%3$s` %4$s
                        ON %4$s.ID = %2$s.CompetencyID
                     WHERE %2$s.StudentID = %5$u
                    ',
                    [
                        StudentCompetency::$tableName,
                        StudentCompetency::getTableAlias(),

                        Competency::$tableName,
                        Competency::getTableAlias(),

                        // TODO: use requested student
                        $GLOBALS['Session']->PersonID
                    ]
                )
            ];
        }

        return static::respond('content-areas', [
            'data' => ContentArea::getAllByWhere($conditions),
            'success' => true
        ]);
    }

    public static function handleRecentProgressRequest()
    {
        $GLOBALS['Session']->requireAuthentication();
        $Student = static::_getRequestedStudent();
        $ContentArea = static::_getRequestedContentArea();


        $where = [
            'd.StudentID = ' . $Student->ID
        ];

        if ($ContentArea) {
            $where[] = 'c.ContentAreaID = ' . $ContentArea->ID;
        }


        $limit = isset($_GET['limit']) ? $_GET['limit'] : 10;


        try {
            // TODO: do name formatting on the client-side
            $progress = DB::allRecords('
                SELECT ds.TargetLevel AS targetLevel,
                       ds.DemonstratedLevel AS demonstratedLevel,
                       d.Created AS demonstrationCreated,
                       CONCAT(CASE p.Gender
                         WHEN "Male"   THEN "Mr. "
                         WHEN "Female" THEN "Ms. "
                          END, p.lastName) AS teacherTitle,
                       c.Descriptor AS competencyDescriptor,
                       s.Descriptor AS skillDescriptor,
                       d.StudentID,
                       c.ContentAreaID
                  FROM %s AS ds
                  JOIN %s AS p
                    ON ds.CreatorID = p.ID
                  JOIN %s AS d
                    ON d.ID = ds.DemonstrationID
                  JOIN %s AS s
                    ON s.ID = ds.SkillID
                  JOIN %s AS c
                    ON c.ID = s.CompetencyID
                  WHERE (%s)
                  ORDER BY d.ID DESC
                  LIMIT %d',
                [
                    DemonstrationSkill::$tableName,
                    Person::$tableName,
                    Demonstration::$tableName,
                    Skill::$tableName,
                    Competency::$tableName,
                    count($where) ? implode(') AND (', $where) : 'TRUE',
                    $limit
                ]
            );
        } catch (TableNotFoundException $e) {
            $progress = [];
        }

        // cast strings to integers
        foreach ($progress as &$progressRecord) {
            $progressRecord['demonstratedLevel'] = intval($progressRecord['demonstratedLevel']);
            $progressRecord['demonstrationCreated'] = strtotime($progressRecord['demonstrationCreated']);

            if ($Student) {
                unset($progressRecord['StudentID']);
            } else {
                $progressRecord['StudentID'] = intval($progressRecord['StudentID']);
            }

            if ($ContentArea) {
                unset($progressRecord['ContentAreaID']);
            } else {
                $progressRecord['ContentAreaID'] = intval($progressRecord['ContentAreaID']);
            }
        }


        return static::respond('progress', [
            'data' => $progress
        ]);
    }

    public static function handleCompletionsRequest()
    {
        $GLOBALS['Session']->requireAuthentication();
        $Student = static::_getRequestedStudent();

        if (empty($_GET['competencies']) || !($competencies = Competency::getAllByListIdentifier($_GET['competencies']))) {
            return static::throwNotFoundError('Competencies list required');
        }

        $lowestLevel = null;
        $completions = [];

        // fetch completion for current level of each competency
        foreach ($competencies as $Competency) {
            $StudentCompetency = StudentCompetency::getCurrentForStudent($Student, $Competency);

            if ($StudentCompetency) {
                $completions[] = $StudentCompetency->getCompletion();

                if (!$lowestLevel || $StudentCompetency->Level < $lowestLevel) {
                    $lowestLevel = $StudentCompetency->Level;
                }
            } else {
                $completions[] = StudentCompetency::getBlankCompletion($Student, $Competency);
            }
        }

        // fill completions with data for lowest incomplete level
        foreach ($completions as &$completion) {
            if ($completion['currentLevel'] == $lowestLevel) {
                continue;
            }

            $StudentCompetency = StudentCompetency::getByWhere([
                'StudentID' => $completion['StudentID'],
                'CompetencyID' => $completion['CompetencyID'],
                'Level' => $lowestLevel
            ]);

            $completion['lowest'] = $StudentCompetency ? $StudentCompetency->getCompletion() : false;
        }

        return static::respond('completions', [
            'data' => $completions
        ]);
    }

    public static function handleDemonstrationSkillsRequest()
    {
        $GLOBALS['Session']->requireAuthentication();
        $Student = static::_getRequestedStudent();

        if (empty($_GET['competencies']) || !($competencies = Competency::getAllByListIdentifier($_GET['competencies']))) {
            return static::throwNotFoundError('Competencies list required');
        }

        // query demonstrations sums
        try {
            $demonstrationSkills = DB::allRecords('
                 SELECT Demonstration.ID AS DemonstrationID,
                        Demonstration.StudentID,
                        Demonstration.Demonstrated,
                        DemonstrationSkill.SkillID,
                        DemonstrationSkill.TargetLevel,
                        DemonstrationSkill.DemonstratedLevel,
                        DemonstrationSkill.Override,
                        DemonstrationSkill.ID
                   FROM (SELECT ID
                           FROM `%1$s`
                          WHERE CompetencyID IN (%5$s)) AS Skill
                   JOIN `%2$s` DemonstrationSkill
                     ON DemonstrationSkill.SkillID = Skill.ID
                   JOIN (SELECT ID, StudentID, UNIX_TIMESTAMP(Demonstrated) AS Demonstrated
                           FROM `%3$s`
                          WHERE StudentID = %6$u) Demonstration
                     ON Demonstration.ID = DemonstrationSkill.DemonstrationID
                   JOIN (SELECT StudentID, MAX(Level) AS CurrentLevel
                           FROM `%4$s`
                          WHERE StudentID = %6$u AND CompetencyID IN (%5$s)
                          GROUP BY StudentID) StudentCompetency
                     ON StudentCompetency.StudentID = Demonstration.StudentID
                    AND StudentCompetency.CurrentLevel = DemonstrationSkill.TargetLevel'
                ,[
                    Skill::$tableName                   // 1
                    ,DemonstrationSkill::$tableName     // 2
                    ,Demonstration::$tableName          // 3
                    ,StudentCompetency::$tableName      // 4
                    ,implode(',', array_map(function ($Competency) {
                        return $Competency->ID;
                    }, $competencies))                  // 5
                    ,$Student->ID                       // 6
                ]
            );
        } catch (TableNotFoundException $e) {
            $demonstrationSkills = [];
        }

        // cast strings to integers
        foreach ($demonstrationSkills AS &$demonstrationSkill) {
            $demonstrationSkill['DemonstrationID'] = intval($demonstrationSkill['DemonstrationID']);
            $demonstrationSkill['Demonstrated'] = intval($demonstrationSkill['Demonstrated']);
            $demonstrationSkill['StudentID'] = intval($demonstrationSkill['StudentID']);
            $demonstrationSkill['SkillID'] = intval($demonstrationSkill['SkillID']);
            $demonstrationSkill['TargetLevel'] = intval($demonstrationSkill['TargetLevel']);
            $demonstrationSkill['DemonstratedLevel'] = intval($demonstrationSkill['DemonstratedLevel']);
            $demonstrationSkill['Override'] = boolval($demonstrationSkill['Override']);
            $demonstrationSkill['ID'] = intval($demonstrationSkill['ID']);
        }

        return static::respond('demonstrationSkills', [
            'data' => $demonstrationSkills
        ]);
    }

    protected static function _getRequestedStudent()
    {
        if (!empty($_GET['student'])) {
            $Student = PeopleRequestHandler::getRecordByHandle($_GET['student']);
            $userIsStaff = $GLOBALS['Session']->hasAccountLevel('Staff');

            if ($Student && !$userIsStaff) {
                $GuardianRelationship = \Emergence\People\GuardianRelationship::getByWhere([
                    'PersonID' => $Student->ID,
                    'RelatedPersonID' => $GLOBALS['Session']->PersonID
                ]);
            }

            if (!$Student || ($Student->ID != $GLOBALS['Session']->PersonID && !$userIsStaff && !$GuardianRelationship)) {
                return static::throwNotFoundError('Student not found');
            }
        }

        if (!$Student) { // automatically set student to session user
            $Student = $GLOBALS['Session']->Person;
        }

        return $Student;
    }

    protected static function _getRequestedContentArea()
    {
        $ContentArea = null;

        if (!empty($_GET['content_area'])) {
            if (!$ContentArea = ContentAreasRequestHandler::getRecordByHandle($_GET['content_area'])) {
                return static::throwNotFoundError('Content area not found');
            }
        }

        return $ContentArea;
    }
}

<?php

namespace Slate\CBL;

use DB, TableNotFoundException;
use Emergence\People\PeopleRequestHandler;
use Slate\People\Student;

class StudentDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Student');

        switch ($action = static::shiftPath()) {
            case 'recent-progress':
                return static::handleRecentProgressRequest();
            case '':
            case false:
                return static::handleDashboardRequest();
            default:
                return static::throwNotFoundError();
        }
    }

    public static function handleDashboardRequest()
    {
        return static::respond('student-dashboard', [
            'Student' => static::_getRequestedStudent(),
            'ContentArea' => static::_getRequestedContentArea()
        ]);
    }

    public static function handleRecentProgressRequest() {
        $Student = static::_getRequestedStudent();
        $ContentArea = static::_getRequestedContentArea();

        if (!$ContentArea) {
            return static::throwInvalidRequestError('Content area required');
        }

        $limit = isset($_GET['limit']) ? $_GET['limit'] : 10;

        try {
            // TODO: do name formatting on the client-side
            $progress = DB::allRecords('
                SELECT ds.DemonstratedLevel AS demonstratedLevel,
                       d.Created AS demonstrationCreated,
                       CONCAT(CASE p.Gender
                         WHEN "Male"   THEN "Mr. "
                         WHEN "Female" THEN "Ms. "
                          END, p.lastName) AS teacherTitle,
                       c.Descriptor AS competencyDescriptor,
                       s.Descriptor AS skillDescriptor
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
                  LIMIT %d',
                [
                    DemonstrationSkill::$tableName,
                    \Emergence\People\Person::$tableName,
                    Demonstration::$tableName,
                    Skill::$tableName,
                    Competency::$tableName,
                    $Student->ID,
                    $ContentArea->ID,
                    $limit
                ]
            );
        } catch (TableNotFoundException $e) {
            $progress = [];
        }

        // cast strings to integers
        foreach ($progress AS &$progressRecord) {
            $progressRecord['demonstratedLevel'] = intval($progressRecord['demonstratedLevel']);
            $progressRecord['demonstrationCreated'] = strtotime($progressRecord['demonstrationCreated']);
        }
        
        return static::respond('progress', [
            'data' => $progress
        ]);
    }

    protected static function _getRequestedStudent()
    {
        if (
            !empty($_GET['student']) &&
            $GLOBALS['Session']->hasAccountLevel('Staff')
        ) {
            if (!$Student = PeopleRequestHandler::getRecordByHandle($_GET['student'])) {
                return static::throwNotFoundError('Student not found');
            }
        } else {
            $Student = $GLOBALS['Session']->Person;
        }

        if (!$Student->isA(Student::class)) {
            return static::throwInvalidRequestError('Requested user is not a student');
        }

        return $Student;
    }

    protected static function _getRequestedContentArea()
    {
        $ContentArea = null;

        if (!empty($_GET['content-area'])) {
            if (!$ContentArea = ContentAreasRequestHandler::getRecordByHandle($_GET['content-area'])) {
                return static::throwNotFoundError('Content area not found');
            }
        }

        return $ContentArea;
    }
}
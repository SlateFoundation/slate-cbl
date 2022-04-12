<?php

namespace Slate\CBL\Demonstrations;

use DB;
use TableNotFoundException;

use Emergence\People\Person;
use Emergence\WebApps\SenchaApp;

use Slate\CBL\RecordsRequestHandler as CBLRecordsRequestHandler;
use Slate\CBL\ContentArea;
use Slate\CBL\Competency;
use Slate\CBL\Skill;

class StudentDashboardRequestHandler extends \Emergence\Site\RequestHandler
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

            case 'recent-progress':
                return static::handleRecentProgressRequest();

            default:
                return static::throwNotFoundError();
        }
    }

    public static function handleDashboardRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

        return static::sendResponse(SenchaApp::load('SlateDemonstrationsStudent')->render());
    }

    public static function handleBootstrapRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

        return static::respond('bootstrap', [
            'user' => $GLOBALS['Session']->Person
        ]);
    }

    public static function handleRecentProgressRequest()
    {
        // read request
        global $Session;
        $Session->requireAuthentication();
        $Student = CBLRecordsRequestHandler::getRequestedStudent() ?: $Session->Person;
        $ContentArea = CBLRecordsRequestHandler::getRequestedContentArea();


        // build conditions
        $where = [
            'd.StudentID = ' . $Student->ID,
            's.Status = "active"',
            'c.Status = "active"',
            'ca.Status = "active"'
        ];

        if ($ContentArea) {
            $where[] = 'c.ContentAreaID = ' . $ContentArea->ID;
        }


        // build limit
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 10;


        // query database
        try {
            // TODO: do name formatting on the client-side
            $progress = DB::allRecords('
                SELECT ds.TargetLevel AS targetLevel,
                       ds.DemonstratedLevel AS demonstratedLevel,
                       ds.Override AS override,
                       d.Created AS demonstrationCreated,
                       CONCAT(CASE p.Gender
                         WHEN "Male"   THEN "Mr. "
                         WHEN "Female" THEN "Ms. "
                         ELSE CONCAT(p.FirstName, " ")
                          END, p.LastName) AS teacherTitle,
                       c.Descriptor AS competencyDescriptor,
                       s.Descriptor AS skillDescriptor,
                       d.StudentID,
                       c.ContentAreaID
                  FROM %s AS ds
                  JOIN %s AS p
                    ON p.ID = ds.CreatorID
                  JOIN %s AS d
                    ON d.ID = ds.DemonstrationID
                  JOIN %s AS s
                    ON s.ID = ds.SkillID
                  JOIN %s AS c
                    ON c.ID = s.CompetencyID
                  JOIN %s AS ca
                    ON ca.ID = c.ContentAreaID
                  WHERE (%s)
                  ORDER BY d.ID DESC
                  LIMIT %d',
                [
                    DemonstrationSkill::$tableName,
                    Person::$tableName,
                    Demonstration::$tableName,
                    Skill::$tableName,
                    Competency::$tableName,
                    ContentArea::$tableName,
                    count($where) ? implode(') AND (', $where) : 'TRUE',
                    $limit
                ]
            );
        } catch (TableNotFoundException $e) {
            $progress = [];
        }


        // cast strings to integers
        foreach ($progress as &$progressRecord) {
            $progressRecord['targetLevel'] = intval($progressRecord['targetLevel']);
            $progressRecord['demonstratedLevel'] = intval($progressRecord['demonstratedLevel']);
            $progressRecord['override'] = (bool)$progressRecord['override'];
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


        // return progress packet
        return static::respond('progress', [
            'data' => $progress
        ]);
    }
}

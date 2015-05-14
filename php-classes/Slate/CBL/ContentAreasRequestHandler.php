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
//            case 'recent-progress':
//                return static::handleRecentProgressRequest($ContentArea, $action);
            default:
                return parent::handleRecordRequest($ContentArea, $action);
        }
    }

    // TODO: move to student-dashboard
//    public static function handleRecentProgressRequest($contentArea) {
//        $student = $_GET['student'];
//        $limit = isset($_GET['limit']) ? $_GET['limit'] : 10;
//
//        if (!ctype_digit($student)) {
//            return static::throwInvalidRequestError('student must be identified by integer ID');
//        }
//
//        try {
//            $progress = DB::allRecords("
//                SELECT ds.DemonstratedLevel,
//                       CONCAT(CASE p.Gender
//                         WHEN 'Male'   THEN 'Mr. '
//                         WHEN 'Female' THEN 'Ms. '
//                          END, p.lastName) AS teacher,
//                       s.Descriptor AS skill,
//                       c.Descriptor AS competency
//                  FROM %s AS ds
//                  JOIN %s AS p
//                    ON ds.CreatorID = p.ID
//                  JOIN %s AS d
//                    ON d.ID = ds.DemonstrationID
//                  JOIN %s AS s
//                    ON s.ID = ds.SkillID
//                  JOIN %s AS c
//                    ON c.ID = s.CompetencyID
//                  WHERE d.StudentID = %s
//                    AND c.ContentAreaID = %s
//                  ORDER BY d.Created DESC
//                  LIMIT %d;",
//                [
//                    DemonstrationSkill::$tableName,
//                    \Emergence\People\Person::$tableName,
//                    Demonstration::$tableName,
//                    Skill::$tableName,
//                    Competency::$tableName,
//                    $student,
//                    $contentArea->ID,
//                    $limit
//                ]
//            );
//        } catch (TableNotFoundException $e) {
//            $progress = [];
//        }
//        
//        return static::respond('progress', [
//            'data' => $progress
//        ]);
//    }
}
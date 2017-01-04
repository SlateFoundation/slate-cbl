<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\StudentTask;
use Slate\CBL\Tasks\StudentTaskSubmission;
use Slate\CBL\Tasks\Task;
use Slate\Courses\Section;
use Slate\Courses\SectionsRequestHandler;

class StudentTasksRequestHandlerNew extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json'
    ];

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

        switch ($action = static::shiftPath()) {
            case '':
            case false:
                return static::handleStudentTasksRequest();
            default:
                return static::throwNotFoundError();
        }

    }

    public static function handleStudentTasksRequest()
    {
        $student = static::_getRequestedStudent();
        $courseSection = static::_getRequestedCourseSection();

        $query = '
            SELECT Tasks.ID as ID,
                   Tasks.ParentTaskID as ParentID,
                   Tasks.Title as TaskTitle,
                   StudentTasks.ID as StudentTaskID,
                   StudentTasks.TaskStatus as TaskStatus,
                   StudentTasks.DueDate as DueDate,
                   CourseSections.Title as CourseSectionTitle,
                   CourseSections.Code as CourseSectionCode,
                   Submissions.UltimateSubmission as SubmittedDate
            FROM %1$s StudentTasks
            JOIN %2$s Tasks on Tasks.ID = StudentTasks.TaskID
            JOIN %3$s CourseSections on CourseSections.ID = StudentTasks.CourseSectionID
            LEFT JOIN (
                SELECT StudentTaskID as SubmissionStudentTaskID,
                       MAX(Created) as UltimateSubmission
                FROM %4$s
                GROUP BY SubmissionStudentTaskID
            ) as Submissions ON (SubmissionStudentTaskID = StudentTasks.ID )
            WHERE StudentTasks.StudentID = %5$d
        ';

        if ($courseSection) {
            $query .= ' AND StudentTasks.CourseSectionID = '.$courseSection->ID;
        } else {
            $query .= ' AND StudentTasks.CourseSectionID IS NOT NULL';  // return all
        }

        /* In the student task dashboard, tasks should be organized by status and then sorted by due date.
         * Status ordering should be Past due, due in the future, no due date completed.
         * Past due tasks should be organized most overdue to least overdue (chronologically with latest date at the top),
         * due in the future should be organized by closest to today (chronologically with earliest date at the top)
         * and completed should be organized by most recently completed at the top (chronologically with most recent submission date at the top).
         */
        $query .= ' ORDER BY TaskStatus = "completed",';                            // Completed go last
        $query .= ' (TaskStatus <> "assigned" AND TaskStatus <> "re-assigned"),';   // assigned statuses go first
        $query .= ' IF ( (TaskStatus = "assigned" OR TaskStatus = "re-assigned") AND StudentTasks.DueDate IS NULL, 1, 0),'; // DueDate = null goes last

        // Order by DueDate if assigned, Order by Submitted date DESC if not
        $query .= ' CASE WHEN (TaskStatus = "assigned" OR TaskStatus = "re-assigned")
                            THEN StudentTasks.DueDate
                            ELSE NULL
                    END,
                    SubmittedDate DESC
                ';

        try {
            $tasks = \DB::allRecords($query, [
                StudentTask::$tableName,            // 1
                Task::$tableName,                   // 2
                Section::$tableName,                // 3
                StudentTaskSubmission::$tableName,  // 4
                $student->ID                        // 5
            ]);
        } catch (TableNotFoundException $e) {
            $tasks = [];
        }

        return static::respond('tasks',[
            'success' => true
            ,'data' => $tasks
            ,'total' => count($tasks)
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

        return $Student;
    }

    protected static function _getRequestedCourseSection()
    {
        $CourseSection = null;

        if (!empty($_GET['course_section'])) {
            if (!$CourseSection = SectionsRequestHandler::getRecordByHandle($_GET['course_section'])) {
                return static::throwNotFoundError('Course Section not found');
            }
        }

        return $CourseSection;
    }
}


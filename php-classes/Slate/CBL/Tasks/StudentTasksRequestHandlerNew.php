<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\StudentTask;
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
                   StudentTasks.DueDate,
                   StudentTasks.Submitted as SubmittedTimestamp,
                   CourseSections.Title as CourseSectionTitle,
                   CourseSections.Code as CourseSectionCode
            FROM %1$s StudentTasks
            JOIN %2$s Tasks on Tasks.ID = StudentTasks.TaskID
            JOIN %3$s CourseSections on CourseSections.ID = StudentTasks.CourseSectionID
            WHERE StudentTasks.StudentID = %4$d
        ';

        if ($courseSection) {
            $query .= ' AND StudentTasks.CourseSectionID = '.$courseSection->ID;
        } else {
            $query .= ' AND StudentTasks.CourseSectionID IS NOT NULL';  // return all
        }

        try {
            $tasks = \DB::allRecords($query, [
                StudentTask::$tableName,    // 1
                Task::$tableName,           // 2
                Section::$tableName,        // 3
                $student->ID                // 4
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


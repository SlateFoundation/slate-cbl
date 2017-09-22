<?php

namespace Slate\CBL\Tasks;

use DB;
use Slate\Term;
use Slate\People\Student;
use Slate\Courses\Section;
use Slate\Courses\SectionParticipant;
use Slate\Courses\SectionsRequestHandler;
use Emergence\People\PeopleRequestHandler;


class TodosRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = Todo::class;
    public static $accountLevelBrowse = 'User';
    public static $accountLevelWrite = 'User';

    public static function handleRecordsRequest($action = false)
    {
        switch ($action = ($action ?: static::shiftPath())) {
            case 'clear-section':
                return static::handleClearRequest($_REQUEST['sectionId']);

            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        $GLOBALS['Session']->requireAuthentication();


        $Student = static::_getRequestedStudent();
        $Section = static::_getRequestedCourseSection();


        $enrolledSections = [];
        $todos = [];


        // Todos with a null SectionID are considered personal Todos
        $sectionTodos = static::getSectionTodos($student, null);
        $todos[] = [
            'ID' => 0,
            'SectionID' => 0,
            'StudentID' => $student->ID,
            'Title' => 'Personal',
            'Section' => [],
            'Todos' => $sectionTodos,
            'TodoCount' => count($sectionTodos)
        ];


        // get section-based Todos for specified section, current term, or any
        $participantConditions = [
            'PersonID' => $Student->ID
        ];

        if ($Section) {
            // return todos from a specific section
            $participantConditions['CourseSectionID'] = $Section->ID;
        } elseif ($currentTerm = Term::getCurrent()) {
            // return all todos from sections in the current term
            $participantConditions['CourseSectionID'] = [
                'values' => DB::allValues(
                    'ID',
                    'SELECT ID FROM `%s` Section WHERE TermID IN (%s)',
                    [
                        Section::$tableName,
                        implode(',', $currentTerm->getConcurrentTermIDs())
                    ]
                )
            ];
        }


        foreach (SectionParticipant::getAllByWhere($participantConditions) as $Participant) {
            $sectionTodos = static::getSectionTodos($Student, $Participant->CourseSectionID);

            $todos[] = [
                'ID' => $Participant->ID,
                'SectionID' => $Participant->SectionID,
                'StudentID' => $Student->ID,
                'Title' => $Participant->Section->Title,
                'Section' => $Participant->Section,
                'Todos' => $sectionTodos,
                'TodoCount' => count($sectionTodos)
            ];
        }

        return static::respond('todos', [
            'success' => true,
            'data' => $todos,
            'total' => count($todos)
        ]);
    }

    public static function getSectionTodos($student, $sectionId = null)
    {
        return Todo::getAllByWhere([
            'SectionID' => $sectionId,
            'StudentID' => $student->ID,
            'Cleared' => false
        ]);
    }

    public static function handleClearRequest($sectionId) {
        $student = static::_getRequestedStudent();

        if ($sectionId == 0) {
            $sectionId = null;  // using SectionID = 0 for personal todos
        }

        $todos = Todo::getAllByWhere([
            'SectionID' => $sectionId,
            'StudentID' => $student->ID,
            'Completed' => 1
        ]);

        foreach ($todos as $todo) {
            $todo->Cleared = true;
            $todo->save();
        }

        return static::respond('todos/clear-section',[
            'success' => true
            ,'total' => count($todos)
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
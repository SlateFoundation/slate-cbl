<?php

namespace Slate\CBL\Tasks;

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
        static::handleTodoListRequest();
    }

    public static function handleTodoListRequest()
    {
        $student = static::_getRequestedStudent();
        $courseSection = static::_getRequestedCourseSection();
        $enrolledSections = [];

        $todos = [];

        $sectionTodos = static::getSectionTodos($student, null);

        // Todos with a null SectionID are considered personal Todos
        array_push($todos, [
            'ID' => 0,
            'SectionID' => 0,
            'StudentID' => $student->ID,
            'Title' => 'Personal',
            'Section' => [],
            'Todos' => $sectionTodos,
            'TodoCount' => count($sectionTodos)
        ]);

        $enrolledSectionWhere = [
            'PersonID' => $student->ID
        ];

        if ($courseSection) {
            // return todos from a specific section
            $enrolledSectionWhere['CourseSectionID'] = $courseSection->ID;
            $enrolledSections = SectionParticipant::getAllByWhere($enrolledSectionWhere);
        } else {
            // return all todos from sections in the current term
            if ($currentTerm = Term::getCurrent()) {
                $currentTermIds = $currentTerm->getConcurrentTermIDs();
    
                $sections = Section::getAllByWhere(['TermID' => ['values' => $currentTermIDs]]);
    
                if (count($currentTermIDs) > 0) {
    
                    $sectionIds = array_map(function($s) {
                        return $s->ID;
                    }, $sections);
    
                    if (count($sectionIds) > 0) {
                        array_push($enrolledSectionWhere, 'CourseSectionId IN ('.implode(',',$sectionIds).')');
                        $enrolledSections = SectionParticipant::getAllByWhere($enrolledSectionWhere);
                    }
                }            
            }
            
        }

        foreach($enrolledSections as $enrolledSection) {
            $section = $enrolledSection-> getDynamicFieldValue('Section');

            $sectionTodos = static::getSectionTodos($student, $enrolledSection->CourseSectionID);

            $todo = [
                'ID' => $enrolledSection->ID,
                'SectionID' => $section->ID,
                'StudentID' => $student->ID,
                'Title' => $section->Title,
                'Section' => $section,
                'Todos' => $sectionTodos,
                'TodoCount' => count($sectionTodos)
            ];

            array_push($todos,$todo);
        }

        return static::respond('todos',[
            'success' => true
            ,'data' => $todos
            ,'total' => count($todos)
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


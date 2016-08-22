<?php

namespace Slate\CBL\Tasks;

use Slate\People\Student;
use Slate\Courses\Section;
use Slate\Courses\SectionParticipant;

class TodosRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = Todo::class;
    public static $accountLevelBrowse = 'User';
    public static $accountLevelWrite = 'User';

    public static function handleRecordsRequest($action = false)
    {
        $CurrentUser = $GLOBALS['Session']->Person;
        //\Debug::dumpVar($CurrentUser);


        switch ($action = ($action ?: static::shiftPath())) {
            case 'clear-section':
                return static::handleClearRequest($_REQUEST['sectionId'],$GLOBALS['Session']->Person->ID);

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
        $CurrentUser = $GLOBALS['Session']->Person;

        $todos = [];

        $sectionTodos = static::getSectionTodos(null);

        // Todos with a null SectionID are considered personal Todos
        array_push($todos, [
            'ID' => 0,
            'SectionID' => 0,
            'StudentID' => $CurrentUser->ID,
            'Title' => 'Personal',
            'Section' => [],
            'Todos' => $sectionTodos,
            'TodoCount' => count($sectionTodos)
        ]);

        $enrolledSectionWhere = [
            'PersonID' => $CurrentUser->ID
        ];

        if (isset($_REQUEST['course_section'])) {
            if (!$Section = \Slate\Courses\Section::getByHandle($_REQUEST['course_section'])) {
                return static::throwInvalidRequestError('Course section not found.');
            }

            $enrolledSectionWhere['CourseSectionID'] = $Section->ID;
        }

        $enrolledSections = SectionParticipant::getAllByWhere($enrolledSectionWhere);

        foreach($enrolledSections as $enrolledSection) {
            $section = $enrolledSection-> getDynamicFieldValue('Section');

            $sectionTodos = static::getSectionTodos($enrolledSection->CourseSectionID);

            $todo = [
                'ID' => $enrolledSection->ID,
                'SectionID' => $section->ID,
                'StudentID' => $CurrentUser->ID,
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

    public static function getSectionTodos($sectionId = null)
    {
        $CurrentUser = $GLOBALS['Session']->Person;

        return Todo::getAllByWhere([
            'SectionID' => $sectionId,
            'StudentID' => $CurrentUser->ID,
            'Cleared' => false
        ]);
    }

    public static function handleClearRequest($sectionId,$studentId) {
        $CurrentUser = $GLOBALS['Session']->Person;

        if ($sectionId == 0) {
            $sectionId = null;  // using SectionID = 0 for personal todos
        }

        $where = [
            'SectionID' => $sectionId,
            'StudentID' => $studentId,
            'Completed' => 1
        ];

        $todos = Todo::getAllByWhere([
            'SectionID' => $sectionId,
            'StudentID' => $CurrentUser->ID,
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


}

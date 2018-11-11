<?php

namespace Slate\CBL\Tasks;

use DB;
use Slate\Term;
use Slate\People\Student;
use Slate\Courses\Section;
use Slate\Courses\SectionParticipant;
use Slate\Courses\SectionsRequestHandler;
use Emergence\People\PeopleRequestHandler;

class TodosRequestHandler extends \Slate\CBL\RecordsRequestHandler
{
    public static $recordClass = Todo::class;
    public static $accountLevelBrowse = 'User';
    public static $accountLevelWrite = 'User';

    public static function handleRecordsRequest($action = false)
    {
        switch ($action = ($action ?: static::shiftPath())) {
            case 'clear-section':
                return static::handleClearRequest();

            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        global $Session;

        $Session->requireAuthentication();


        $Student = static::getRequestedStudent() ?: $Session->Person;
        $Section = static::getRequestedSection();


        $enrolledSections = [];
        $todos = [];


        // Todos with a null SectionID are considered personal Todos
        $todos[] = [
            'ID' => 0,
            'SectionID' => null,
            'StudentID' => $Student->ID,
            'Title' => 'Personal',
            'Section' => null,
            'Todos' => static::getSectionTodos($Student)
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
            $todos[] = [
                'ID' => $Participant->ID,
                'SectionID' => $Participant->Section->ID,
                'StudentID' => $Student->ID,
                'Title' => $Participant->Section->Title,
                'Section' => $Participant->Section,
                'Todos' => static::getSectionTodos($Student, $Participant->CourseSectionID)
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

    public static function handleClearRequest()
    {
        global $Session;

        $Session->requireAuthentication();

        $todos = Todo::getAllByWhere([
            'SectionID' => !empty($_REQUEST['sectionId']) ? $_REQUEST['sectionId'] : null,
            'StudentID' => $Session->PersonID,
            'Completed' => 1
        ]);

        foreach ($todos as $todo) {
            $todo->Cleared = true;
            $todo->save();
        }

        return static::respond('todos/clear-section', [
            'success' => true
            ,'total' => count($todos)
        ]);
    }
}

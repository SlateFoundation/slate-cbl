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
        switch ($action = $action ?: static::shiftPath()) {
            case '*groups':
                return static::handleGroupsRequest();
            case '!clear':
                return static::handleClearRequest();
            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function handleGroupsRequest()
    {
        global $Session;

        $Session->requireAuthentication();
        $Student = static::getRequestedStudent() ?: $Session->Person;


        $groups = [];


        // group with a null SectionID contains personal todos
        $groups[0] = [
            'title' => 'Personal',
            'studentId' => $Student->ID,
            'todos' => []
        ];


        // get section-based todos for specified section or selected/current term
        if ($Section = static::getRequestedSection()) {
            $sectionIds = [$Section->ID];
            $participantConditions['CourseSectionID'] = $Section->ID;
        } elseif ($Term = static::getRequestedTerm() ?: Term::getClosest()) {
            $sectionIds = DB::allValues(
                'ID',
                'SELECT ID FROM `%s` Section WHERE TermID IN (%s)',
                [
                    Section::$tableName,
                    implode(',', $Term->getConcurrentTermIDs())
                ]
            );
        }


        // add group for each enrolled section
        $enrollments = SectionParticipant::getAllByWhere([
            'CourseSectionID' => [ 'values' => $sectionIds ],
            'PersonID' => $Student->ID
        ]);

        foreach ($enrollments as $Participant) {
            $groups[$Participant->CourseSectionID] = [
                'title' => $Participant->Section->Title,
                'studentId' => $Student->ID,
                'section' => $Participant->Section,
                'todos' => []
            ];
        }


        // add todos
        $todos = Todo::getAllByWhere([
            'StudentID' => $Student->ID,
            'SectionID IS NULL OR SectionID IN ('.implode(',', $sectionIds).')',
            'Cleared' => false
        ]);

        foreach ($todos as $Todo) {
            $groups[$Todo->SectionID ?: 0]['todos'][] = $Todo;
        }


        return static::respond('todoGroups', [
            'success' => true,
            'data' => array_values($groups),
            'total' => count($groups)
        ]);
    }

    public static function handleClearRequest()
    {
        global $Session;

        $Session->requireAuthentication();

        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            return static::throwInvalidRequestError('request must be POST');
        }

        $Section = static::getRequestedSection();

        $todos = Todo::getAllByWhere([
            'SectionID' => $Section ? $Section->ID : null,
            'StudentID' => $Session->PersonID,
            'Completed' => true,
            'Cleared' => false
        ]);

        foreach ($todos as $Todo) {
            $Todo->Cleared = true;
            $Todo->save();
        }

        return static::respond('clearTodos', [
            'success' => true,
            'data' => $todos,
            'total' => count($todos)
        ]);
    }
}

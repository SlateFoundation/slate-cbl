<?php

namespace Slate\CBL;


use OutOfBoundsException;

use Slate\Courses\SectionParticipant;
use Slate\CBL\Tasks\TasksRequestHandler;

abstract class RecordsRequestHandler extends \Slate\RecordsRequestHandler
{
    /**
     * Examine the current request, determine if an individual
     * task has been explicitly requested, and reject the request
     * if the current user is not authorized to load data for the
     * task
     */
    protected static function getRequestedTask()
    {
        global $Session;

        // return null if no task was explicitely requested, let caller
        // decide what to do with that
        if (empty($_REQUEST['task'])) {
            return null;
        }

        // unauthenticated users can't request anything
        $Session->requireAuthentication();

        // get the requested task
        $Task = TasksRequestHandler::getRecordByHandle($_REQUEST['task']);

        if (!$Task) {
            throw new OutOfBoundsException('task not found');
        }

        // staff and author definitely have access
        $userIsStaff = $Session->hasAccountLevel('Staff');

        if ($userIsStaff || $Task->CreatorID == $Session->PersonID) {
            return $Task;
        }

        // look up if user participates in the section
        if ($Task && $Task->SectionID) {
            $SectionParticipant = SectionParticipant::getByWhere([
                'CourseSectionID' => $Task->SectionID,
                'PersonID' => $Session->PersonID
            ]);
        }

        // look up if user has been assigned this task
        if ($Task && !$SectionParticipant) {
            $StudentTask = Tasks\StudentTask::getByWhere([
                'TaskID' => $Task->ID,
                'StudentID' => $Session->PersonID
            ]);
        }

        // don't differentiate between nonexistant and unauthorized
        if (!$Task || (!$SectionParticipant && !$StudentTask)) {
            return static::throwNotFoundError('task not found');
        }

        return $Task;
    }
}
<?php

namespace Slate\CBL;


use OutOfBoundsException;

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
                'PersonID' => $Session->ID
            ]);
        }

        // don't differentiate between nonexistant and unauthorized
        if (!$Task || !$SectionParticipant) {
            return static::throwNotFoundError('Task not found');
        }

        return $Task;
    }
}
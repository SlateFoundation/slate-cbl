<?php

namespace Slate\CBL;

use OutOfBoundsException;

use Emergence\People\GuardianRelationship;

use Slate\Courses\SectionParticipant;

use Slate\CBL\Tasks\TasksRequestHandler;

abstract class RecordsRequestHandler extends \Slate\RecordsRequestHandler
{
    /**
     * Examine the current request, determine if an individual
     * content area has been explicitly requested
     */
    public static function getRequestedContentArea($fieldName = 'content_area')
    {
        // return null if no content area was explicitly requested, let caller
        // decide what to do with that
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        // try to load
        if (!$ContentArea = ContentAreasRequestHandler::getRecordByHandle($_REQUEST[$fieldName])) {
            throw new OutOfBoundsException($fieldName.' not found');
        }

        return $ContentArea;
    }

    /**
     * Examine the current request, determine if an individual
     * competency has been explicitly requested
     */
    public static function getRequestedCompetency($fieldName = 'competency')
    {
        // return null if no competency was explicitly requested, let caller
        // decide what to do with that
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        // try to load
        if (!$Competency = CompetenciesRequestHandler::getRecordByHandle($_REQUEST[$fieldName])) {
            throw new OutOfBoundsException($fieldName.' not found');
        }

        return $Competency;
    }

    /**
     * Examine the current request, determine if a list
     * of competencies has been explicitly requested
     */
    public static function getRequestedCompetencies($fieldName = 'competencies')
    {
        // return null if no competencies list was explicitly requested, let caller
        // decide what to do with that
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        // parse input
        $competencies = is_string($_REQUEST[$fieldName])
            ? explode(',', $_REQUEST[$fieldName])
            : $_REQUEST[$fieldName];

        // map identifiers
        foreach ($competencies as &$Competency) {
            if (!$Competency = CompetenciesRequestHandler::getRecordByHandle($Competency)) {
                throw new OutOfBoundsException('competency not found');
            }
        }

        return $competencies;
    }

    /**
     * Examine the current request, determine if an individual
     * skill has been explicitly requested
     */
    public static function getRequestedSkill($fieldName = 'skill')
    {
        // return null if no skill was explicitly requested, let caller
        // decide what to do with that
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        // try to load
        if (!$Skill = SkillsRequestHandler::getRecordByHandle($_REQUEST[$fieldName])) {
            throw new OutOfBoundsException($fieldName.' not found');
        }

        return $Skill;
    }

    /**
     * Examine the current request, determine if a list
     * of skills has been explicitly requested
     */
    public static function getRequestedSkills($fieldName = 'skills')
    {
        // return null if no skills list was explicitly requested, let caller
        // decide what to do with that
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        // parse input
        $skills = is_string($_REQUEST[$fieldName])
            ? explode(',', $_REQUEST[$fieldName])
            : $_REQUEST[$fieldName];

        // map identifiers
        foreach ($skills as &$Skill) {
            if (!$Skill = SkillsRequestHandler::getRecordByHandle($Skill)) {
                throw new OutOfBoundsException('skill not found');
            }
        }

        return $skills;
    }

    /**
     * Examine the current request, determine if an individual
     * task has been explicitly requested, and reject the request
     * if the current user is not authorized to load data for the
     * task
     */
    public static function getRequestedTask($fieldName = 'task')
    {
        global $Session;

        // return null if no task was explicitly requested, let caller
        // decide what to do with that
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        // unauthenticated users can't request anything
        $Session->requireAuthentication();

        // get the requested task
        $Task = TasksRequestHandler::getRecordByHandle($_REQUEST[$fieldName]);

        if (!$Task) {
            throw new OutOfBoundsException($fieldName.' not found');
        }

        // staff and author definitely have access
        $userIsStaff = $Session->hasAccountLevel('Staff');

        if ($userIsStaff || $Task->CreatorID == $Session->PersonID) {
            return $Task;
        }

        // look up if user or a ward participates in the section
        if ($Task->SectionID) {
            $SectionParticipant = SectionParticipant::getByWhere([
                'CourseSectionID' => $Task->SectionID,
                'PersonID' => [
                    'values' => array_merge(
                        [$Session->PersonID],
                        GuardianRelationship::getWardIds($Session->Person)
                    )
                ]
            ]);
        }

        // look up if user or a ward has been assigned this task
        if (!$SectionParticipant) {
            $StudentTask = Tasks\StudentTask::getByWhere([
                'TaskID' => $Task->ID,
                'StudentID' => [
                    'values' => array_merge(
                        [$Session->PersonID],
                        GuardianRelationship::getWardIds($Session->Person)
                    )
                ]
            ]);
        }

        // don't differentiate between nonexistant and unauthorized
        if (!$SectionParticipant && !$StudentTask) {
            throw new OutOfBoundsException($fieldName.' not found');
        }

        return $Task;
    }
}

<?php

namespace Slate\CBL\Tasks;


use Exception;

use DB;
use ActiveRecord;
use Emergence\People\Person;
use Google\DriveFile;

use Slate\People\PeopleRequestHandler;
use Slate\Courses\SectionsRequestHandler;
use Slate\CBL\SkillsRequestHandler;


class TasksRequestHandler extends \RecordsRequestHandler
{
    use \FieldValuesRequestHandlerTrait;


    public static $recordClass =  Task::class;
    public static $defaultBrowseConditions = [
        'Status' => [
            'operator' => '!=',
            'value' => 'archived'
        ]
    ];
    public static $browseOrder = ['Created' => 'DESC'];

    protected static function buildBrowseConditions(array $conditions = array(), array &$filterObjects = [])
    {
        $conditions = parent::buildBrowseConditions($conditions);

        if (isset($_REQUEST['course_section'])) {
            // TODO: only let staff do this?

            if (!$Section = SectionsRequestHandler::getRecordByHandle($_REQUEST['course_section'])) {
                return static::throwInvalidRequestError('Course section not found');
            }

            $conditions['SectionID'] = $Section->ID;
            $filterObjects['Section'] = $Section;
        } else {
            $includeUnshared = isset($_REQUEST['include_unshared']) && ($_REQUEST['include_unshared']=='true');
            $includeArchived = isset($_REQUEST['include_archived']) && ($_REQUEST['include_archived']=='true');
            $statusConditions = static::getStatusConditions($includeUnshared, $includeArchived);

            if ($statusConditions != false) {
                $conditions[] = $statusConditions;
            }
        }

        return $conditions;
    }

    public static function handleRecordsRequest($action = false)
    {
        switch ($action = ($action ?: static::shiftPath())) {
            case '*experience-types':
                return static::handleFieldValuesRequest('ExperienceType', ExperienceTask::$fields['ExperienceType']['values']);

            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function applyRecordDelta(\ActiveRecord $Task, $requestData)
    {
        // read related data out from request before applying default field handling
        if (array_key_exists('Assignees', $requestData)) {
            $assigneesData = $requestData['Assignees'];
            unset($requestData['Assignees']);
        }

        if (array_key_exists('Attachments', $requestData)) {
            $attachmentsData = $requestData['Attachments'];
            unset($requestData['Attachments']);
        }

        if (array_key_exists('Skills', $requestData)) {
            $skillsData = $requestData['Skills'];
            unset($requestData['Skills']);
        }


        // apply default field handling
        parent::applyRecordDelta($Task, $requestData);


        // apply related assignees
        if (isset($assigneesData)) {
            // fetch all existing StudentTask records indexed by StudentID
            $existingStudentTasks = $Task->isPhantom ? [] : StudentTask::getAllByField('TaskID', $Task->ID, [ 'indexField' => 'StudentID' ]);


            // create new or passthrough existing StudentTask records, removing any matched students from list of existing
            $studentTasks = [];
            foreach ($assigneesData as $studentId => $isAssigned) {
                $StudentTask = $existingStudentTasks[$studentId];
                unset($existingStudentTasks[$studentId]);

                if ($isAssigned) {
                    if ($StudentTask) {
                        $studentTasks[] = $StudentTask;
                    } elseif (!$Student = PeopleRequestHandler::getRecordbyHandle($studentId)) {
                        throw new Exception("Student '$studentId' not found");
                    } else {
                        $studentTasks[] = StudentTask::create([
                            'Student' => $Student
                        ]);
                    }
                }
            }


            // restore any remaining existing StudentTask records that weren't described in this update
            while ($StudentTask = array_shift($existingStudentTasks)) {
                $studentTasks[] = $StudentTask;
            }


            // apply new list to model, prune configuration will remove any existing records excluded from new array
            $Task->StudentTasks = $studentTasks;
        }


        // apply related attachments
        if (isset($attachmentsData)) {
            Attachments\AbstractTaskAttachment::applyAttachmentsData($Task, $attachmentsData);
        }


        // apply related skills
        if (isset($skillsData)) {
            // fetch all existing StudentTask records indexed by StudentID
            $existingTaskSkills = $Task->isPhantom ? [] : TaskSkill::getAllByField('TaskID', $Task->ID, [ 'indexField' => 'SkillID' ]);


            // create new or passthrough existing TaskSkill records
            $taskSkills = [];
            foreach ($skillsData as $skillData) {
                if (is_string($skillData) || is_int($skillData)) {
                    if (!$Skill = SkillsRequestHandler::getRecordByHandle($skillData)) {
                        throw new Exception("Skill '$skillData' not found");
                    }

                    $taskSkills[] = $existingTaskSkills[$Skill->ID] ?: TaskSkill::create([
                        'Skill' => $Skill
                    ]);
                } else {
                    throw new Exception('Skills list may only contain string skill codes');
                }
            }

            $Task->TaskSkills = $taskSkills;
        }
    }

    public static function getStatusConditions($includeUnshared, $includeArchived) {
        $recordClass = static::$recordClass;

        if ($_SESSION['User']->hasAccountLevel('Administrator')) {
            if ($includeUnshared && $includeArchived) {
                return false;
            } else {
                $statusCondition = '%1$s.Status = "shared"';

                if ($includeUnshared) {
                    $statusCondition .= ' OR %1$s.Status = "private"';
                }
                if ($includeArchived) {
                    $statusCondition .= ' OR %1$s.Status = "archived"';
                }
                return sprintf($statusCondition, $recordClass::getTableAlias());
            }
        } else {
                $statusCondition = '%1$s.Status = "shared"';

                if ($includeUnshared) {
                    $statusCondition .= ' OR (%1$s.Status = "private" AND %1$s.CreatorID = %2$u)';
                }
                if ($includeArchived) {
                    $statusCondition .= ' OR (%1$s.Status = "archived" AND %1$s.CreatorID = %2$u)';
                }
                return sprintf($statusCondition, $recordClass::getTableAlias(), $GLOBALS['Session']->PersonID);
        }
    }
}
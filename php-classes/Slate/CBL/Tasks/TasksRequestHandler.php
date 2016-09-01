<?php

namespace Slate\CBL\Tasks;

use DB;
use ActiveRecord;
use DB;
use Emergence\People\Person;

use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;

class TasksRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass =  Task::class;
    public static $browseOrder = ['Created' => 'DESC'];

    public static function handleRecordsRequest($action = false)
    {
        switch ($action = ($action ?: static::shiftPath())) {
            case '*experience-types':
                return static::handleFieldValuesRequest('ExperienceType');

            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function handleRecordRequest(ActiveRecord $Record, $action = false)
    {
        switch ($action = $action ?: static::shiftPath()) {
            case 'assignees':
                return static::handleTaskAssigneesRequest($Record);

            default:
                return parent::handleRecordRequest($Record, $action);
        }
    }

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        // handle tasks by section

        if (isset($_REQUEST['course_section'])) {
            if (!$Section = \Slate\Courses\Section::getByHandle($_REQUEST['course_section'])) {
                return static::throwInvalidRequestError('Course section not found.');
            }

            // chcek if ID or ParentTaskID is attached to a course section

            $taskIds = DB::allRecords(
                'SELECT DISTINCT %4$s.ID, %4$s.ParentTaskID FROM `%1$s` %2$s JOIN `%3$s` %4$s ON (%4$s.ID = %2$s.TaskID) WHERE %2$s.CourseSectionID = %5$u',
                [
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),

                    Task::$tableName,
                    Task::getTableAlias(),

                    $Section->ID
                ]
            );

            $taskIds = array_filter(array_unique(array_merge(array_column($taskIds, 'ID'), array_column($taskIds, 'ParentTaskID'))));

            $conditions['ID'] = [
                'values' => $taskIds
            ];
        } else { // show all tasks that are either shared, or created by current user.
            $recordClass = static::$recordClass;
            $conditions[] = sprintf('(%1$s.Status = "shared" OR %1$s.CreatorID = %2$u)', $recordClass::getTableAlias(), $GLOBALS['Session']->PersonID);
        }
        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }

    public static function handleFieldValuesRequest($fieldName)
    {
        $recordClass = static::$recordClass;

        $recordFields = $recordClass::aggregateStackedConfig('fields');

        if (!array_key_exists($fieldName, $recordFields)) {
            return static::throwInvalidRequestError(sprintf('Field: %s not found.', $fieldName));
        }

        $field = $recordFields[$fieldName];
        $query = $_REQUEST['q'];

        switch ($field['type']) {
            case 'enum':
                $values = $field['values'];
                if ($query) {
                    $conditions = '/^([a-z0-9_-\s]+)?'.DB::escape($query).'([a-z0-9_-\s]+)?$/i';
                    $values = array_values(array_filter($values, function($v) use ($conditions) {
                        return preg_match($conditions, $v, $matches);
                    }));
                    break;
                } else if (!empty($values)) {
                    break;
                }
                //if empty, trp getting unique values from API

            case 'string':
            case 'uint':

                if ($query) {
                    $conditions = sprintf('%s LIKE "%%%s%%"', $field['columnName'], DB::escape($query));
                } else {
                    $conditions = 1;
                }

                $values = DB::allValues($field['columnName'], 'SELECT %1$s FROM `%2$s` WHERE %3$s GROUP BY %1$s', [$field['columnName'], $recordClass::$tableName, $conditions]);
                break;
        }


        foreach ($values as &$v) {

            $v = [
                'name' => $v
            ];
        }

        return static::respond('task-field-values', [
            'data' => $values,
            'field' => $fieldName,
            'total' => count($values)
        ]);

    }

    public static function handleTaskAssigneesRequest(ActiveRecord $Record)
    {
        // replace with $Task->Assignees?
        try {
            $assignees = DB::allRecords('
                SELECT %4$s.* FROM `%1$s` %2$s'.
                ' JOIN `%3$s` %4$s ON (%2$s.StudentID = %4$s.ID)'.
                ' WHERE %2$s.TaskID = %5$u',
                [
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),

                    Person::$tableName,
                    Person::getTableAlias(),

                    $Record->ID
                ]
            );
        } catch (\TableNotFoundException $e) {
            $assignees = [];
        }

        return static::respond('task/assignees', [
            'data' => $assignees,
            'total' => DB::foundRows()
        ]);
    }

    /*
    *   Responsibilities:
    *       - Update relationships for Skills, Attachments, and StudentTasks.
    */

    protected static function onRecordSaved(\ActiveRecord $Record, $data)
    {
        //update skills
        if (isset($data['SkillIDs'])) {
            $originalSkills = $Record->Skills;
            $originalSkillIds = array_map(function($s) {
                return $s->ID;
            }, $originalSkills);

            $oldSkillIds = array_diff($originalSkillIds, $data['SkillIDs']);
            $newSkillIds = array_diff($data['SkillIDs'], $originalSkillIds);

            foreach ($newSkillIds as $newSkill) {
                TaskSkill::create([
                    'TaskID' => $Record->ID,
                    'SkillID' => $newSkill
                ], true);
            }

            if (!empty($oldSkillIds)) {
                DB::nonQuery('DELETE FROM `%s` WHERE TaskID = %u AND SkillID IN ("%s")', [
                    TaskSkill::$tableName,
                    $Record->ID,
                    join('", "', $oldSkillIds)
                ]);
            }
        }

        // update attachments
        if (isset($data['Attachments'])) {
            $originalAttachments = $Record->Attachments;
            $originalAttachmentIds = array_map(function($s) {
                return $s->ID;
            }, $originalAttachments);

            $failed = [];
            $attachmentIds = [];
            $attachments = [];
            $defaultAttachmentClass = AbstractTaskAttachment::$defaultClass;

            foreach ($data['Attachments'] as $attachmentData) {
                $attachmentClass = $attachmentData['Class'] ?: $defaultAttachmentClass;
                if ($attachmentData['ID'] >= 1) {
                    if (!$Attachment = $attachmentClass::getByID($attachmentData['ID'])) {
                        $failed[] = $attachmentData;
                        continue;
                    }
                } else {
                    $Attachment = $attachmentClass::create($attachmentData);
                }

                $Attachment->ContextID = $Record->ID;
                $Attachment->ContextClass = $Record->getRootClass();
                $Attachment->save();
                $attachments[] = $Attachment;
                $attachmentIds[] = $Attachment->ID;
            }

            DB::nonQuery('DELETE FROM `%s` WHERE ContextClass = "%s" AND ContextID = %u AND ID NOT IN ("%s")', [
                AbstractTaskAttachment::$tableName,
                $Record->getRootClass(),
                $Record->ID,
                join('", "', $attachmentIds)
            ]);
        }

        $Record->Attachments = $attachments;

        // update student tasks
        if (isset($data['Assignees'])) {
            $originalAssignees = $Record->Assignees;
            $originalAssigneeIds = array_map(function($s) {
                return $s->ID;
            }, $originalAssignees);

            $failed = [];
            $assigneeIds = [];
            $assignees = [];

            foreach ($data['Assignees'] as $assigneeData) {
                if (!$studentTask = StudentTask::getByWhere(['StudentID' => $assigneeData, 'TaskID' => $Record->ID])) {
                    $studentTask = StudentTask::create([
                        'TaskID' => $Record->ID,
                        'StudentID' => $assigneeData,
                        'CourseSectionID' => $data['CourseSectionID']
                    ]);
                }
                $studentTask->setFields([
                    'DueDate' => $Record->DueDate,
                    'ExperienceType' => $Record->ExperienceType,
                    'ExpirationDate' => $Record->ExpirationDate
                ]);

                $studentTask->save(false);
                $assigneeIds[] = $studentTask->StudentID;
            }

            DB::nonQuery('DELETE FROM `%s` WHERE TaskID = %u AND StudentID NOT IN ("%s")', [
                StudentTask::$tableName,
                $Record->ID,
                join('", "', $assigneeIds)
            ]);
        }
    }
}
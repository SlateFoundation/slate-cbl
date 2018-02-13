<?php

namespace Slate\CBL\Tasks;

use DB;
use ActiveRecord;
use Emergence\People\Person;
use Google\DriveFile;

use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;
use Slate\CBL\Demonstrations\ExperienceDemonstration;

class TasksRequestHandler extends \RecordsRequestHandler
{
    use \FieldValuesRequestHandlerTrait;


    public static $recordClass =  Task::class;
    public static $browseOrder = ['Created' => 'DESC'];

    protected static function buildBrowseConditions(array $conditions = array())
    {
        $conditions = parent::buildBrowseConditions($conditions);

        if (isset($_REQUEST['course_section'])) {
            // TODO: only let staff do this?

            if (!$Section = \Slate\Courses\Section::getByHandle($_REQUEST['course_section'])) {
                return static::throwInvalidRequestError('Course section not found.');
            }

            $conditions['SectionID'] = $Section->ID;
        } else { // show all tasks that are either shared, or created by current user.
            $recordClass = static::$recordClass;
            $conditions[] = sprintf('(%1$s.Status = "shared" OR (%1$s.Status = "private" AND %1$s.CreatorID = %2$u))', $recordClass::getTableAlias(), $GLOBALS['Session']->PersonID);
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

    public static function applyRecordDelta(\ActiveRecord $Record, $requestData)
    {
        parent::applyRecordDelta($Record, $requestData);

        $defaultAttachmentClass = AbstractTaskAttachment::$defaultClass;

        if (isset($requestData['Attachments'])) {
            $attachments = [];
            foreach ($requestData['Attachments'] as $attachmentData) {
                $attachmentClass = $attachmentData['Class'] ?: $defaultAttachmentClass;
                if ($attachmentData['ID'] >= 1) {
                    if (!$Attachment = $attachmentClass::getByID($attachmentData['ID'])) {
                        $failed[] = $attachmentData;
                        continue;
                    }

                    if (!empty($attachmentData['Status']) && in_array($attachmentData['Status'], $defaultAttachmentClass::getFieldOptions('Status', 'values'))) {
                        $Attachment->Status = $attachmentData['Status'];
                    }
                } else {
                    $Attachment = $attachmentClass::create($attachmentData);
                }


                if ($Attachment instanceof Attachments\GoogleDriveFile) {
                    if (!$Attachment->File) {
                        if (!$File = DriveFile::getByField('DriveID', $attachmentData['File']['DriveID'])) {
                            $File = DriveFile::create($attachmentData['File']);
                            if (!$File->OwnerEmail && $GLOBALS['Session']->Person && $GLOBALS['Session']->Person->PrimaryEmail) {
                                $File->OwnerEmail = $GLOBALS['Session']->Person->PrimaryEmail->toString();
                            }
                        }
                        $Attachment->File = $File;
                    } else if ($Attachment->File->isPhantom && $File = DriveFile::getByField('DriveID', $attachmentData['File']['DriveID'])) {
                        $Attachment->File = $File;
                    }
                }

                $attachments[] = $Attachment;
            }

            $Record->Attachments = $attachments;
        }
        // update student tasks
        if (isset($requestData['Assignees'])) {
            $studentTasks = [];
            foreach ($requestData['Assignees'] as $assigneeId) {
                if (!$StudentTask = StudentTask::getByWhere(['StudentID' => $assigneeId, 'TaskID' => $Record->ID])) {
                    $StudentTask = StudentTask::create([
                        'StudentID' => $assigneeId,
                        'SectionID' => $requestData['SectionID'],
                        'DueDate' => $Record->DueDate,
                        'ExperienceType' => $Record->ExperienceType,
                        'ExpirationDate' => $Record->ExpirationDate
                    ]);
                }
                $studentTasks[] = $StudentTask;
            }

            $Record->StudentTasks = $studentTasks;
        }
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
    }
}
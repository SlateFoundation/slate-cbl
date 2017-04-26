<?php

namespace Slate\CBL\Tasks;

use DB;
use ActiveRecord;
use Emergence\People\Person;
use Google\DriveFile;

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

            try {
                // check if ID or ParentTaskID is attached to a course section
                $taskIds = DB::allRecords(
                    'SELECT DISTINCT %4$s.ID, %4$s.ParentTaskID FROM `%1$s` %2$s JOIN `%3$s` %4$s ON (%4$s.ID = %2$s.TaskID) WHERE %2$s.SectionID = %5$u',
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
            } catch (\TableNotFoundException $e) {
                $conditions['ID'] = [
                    'values' => []
                ];
            }
        } else { // show all tasks that are either shared, or created by current user.
            $recordClass = static::$recordClass;
            $conditions[] = sprintf('(%1$s.Status = "shared" OR (%1$s.Status = "private" AND %1$s.CreatorID = %2$u))', $recordClass::getTableAlias(), $GLOBALS['Session']->PersonID);
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
                try {
                    $values = DB::allValues($field['columnName'], 'SELECT %1$s FROM `%2$s` WHERE %3$s GROUP BY %1$s', [$field['columnName'], $recordClass::$tableName, $conditions]);
                } catch (\TableNotFoundException $e) {
                    $values = [];
                }
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


    public static function applyRecordDelta(\ActiveRecord $Record, $requestData)
    {
        parent::applyRecordDelta($Record, $requestData);

        if (isset($requestData['Attachments'])) {
            foreach ($requestData['Attachments'] as $attachmentData) {
                $attachmentClass = $attachmentData['Class'] ?: $defaultAttachmentClass;
                if ($attachmentData['ID'] >= 1) {
                    if (!$Attachment = $attachmentClass::getByID($attachmentData['ID'])) {
                        $failed[] = $attachmentData;
                        continue;
                    }
                } else {
                    $Attachment = $attachmentClass::create($attachmentData);
                }

                if ($Attachment instanceof Attachments\GoogleDriveFile) {
                    if (!$Attachment->File) {
                        if (!$File = \Google\DriveFile::getByWhere(['DriveID' => $attachmentData['File']['DriveID']])) {
                            $File = \Google\DriveFile::create($attachmentData['File']);
                            if (!$File->OwnerEmail && $GLOBALS['Session']->Person && $GLOBALS['Session']->Person->PrimaryEmail) {
                                $File->OwnerEmail = $GLOBALS['Session']->Person->PrimaryEmail->toString();
                            }
                        }
                        $Attachment->File = $File;
                    } else if ($Attachment->File->isPhantom && $File = \Google\DriveFile::getByWhere(['DriveID' => $attachmentData['File']['DriveID']])) {
                        $Attachment->File = $File;
                    }
                }

                $Attachment->Context = $Record;
                $attachments[] = $Attachment;
            }

            $Record->Attachments = $attachments;
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

        // update student tasks
        if (isset($data['Assignees'])) {
            $originalAssignees = $Record->Assignees;
            $originalAssigneeIds = array_map(function($s) {
                return $s->ID;
            }, $originalAssignees);

            $assigneeIds = [];
            $assignees = [];

            foreach ($data['Assignees'] as $assigneeData) {
                if (!$studentTask = StudentTask::getByWhere(['StudentID' => $assigneeData, 'TaskID' => $Record->ID])) {
                    $studentTask = StudentTask::create([
                        'TaskID' => $Record->ID,
                        'StudentID' => $assigneeData,
                        'SectionID' => $data['SectionID']
                    ]);
                }
                $studentTask->setFields([
                    'DueDate' => $Record->DueDate,
                    'ExperienceType' => $Record->ExperienceType,
                    'ExpirationDate' => $Record->ExpirationDate
                ]);

                try {
                    $studentTask->save(false);
                } catch (\RecordValidationException $e) {
                    // record failed validation, continue creating others.
                    continue;
                }

                $assigneeIds[] = $studentTask->StudentID;
            }

            DB::nonQuery('DELETE FROM `%s` WHERE TaskID = %u AND StudentID NOT IN ("%s")', [
                StudentTask::$tableName,
                $Record->ID,
                join('", "', $assigneeIds)
            ]);
        }

        static::updateGoogleFilePermissions($Record);
    }

    public static function updateGoogleFilePermissions(Task $Record)
    {
        $userTokens = [];
        if (!empty($Record->Attachments)) {
            $googleDriveClass = Attachments\GoogleDriveFile::class;
            foreach ($Record->Attachments as $attachment) {
                if (!$attachment instanceof $googleDriveClass) {
                    continue;
                }

                if (!$attachment->isNew) {
                    continue;
                }

                if ($attachment->ShareMethod == 'view-only' || $attachment->ShareMethod == 'collaborate') {
                    $requiredPermissions = $attachment->getRequiredPermissions();
                    if (empty($userTokens[$attachment->File->OwnerEmail])) {
                        $userTokens[$attachment->File->OwnerEmail] = \Google\API::fetchAccessToken('https://www.googleapis.com/auth/drive', $attachment->File->OwnerEmail);
                    }

                    foreach ($requiredPermissions['read'] as $userId) {
                        $userEmail = Person::getByID($userId)->PrimaryEmail;

                        if (!$userEmail || !\Validators::email($userEmail->toString(), ['domain' => 'slatedemo.com'])) {
                            \Emergence\Logger::general_alert('Unable to create {permissionRole} permissions for user {userEmail} on {googleFileRecord}', [
                                'permissionRole' => 'reader',
                                'userId' => $userId,
                                'userEmail' => $userEmail,
                                'googleFileRecord' => $attachment
                            ]);
                            continue;
                        }

                        $userEmail = $userEmail->toString();
                        try {
                            $response = $attachment->File->createPermission($userEmail, 'reader', 'user', $userTokens[$attachment->File->OwnerEmail]);
                        } catch (\Exception $e) {
                            \Emergence\Logger::general_alert('Unable to create {permissionRole} permissions for user: {userEmail} on {googleFileRecord}', [
                                'permissionRole' => 'reader',
                                'userEmail' => $userEmail,
                                'googleFileRecord' => $attachment
                            ]);
                            continue;
                        }
                    }

                    foreach ($requiredPermissions['write'] as $userId) {
                        $userEmail = Person::getByID($userId)->PrimaryEmail;

                        if (!$userEmail || !\Validators::email($userEmail->toString(), ['domain' => 'slatedemo.com'])) {
                            \Emergence\Logger::general_alert('Unable to create {permissionRole} permissions for user {userEmail} on {googleFileRecord}', [
                                'permissionRole' => 'reader',
                                'user' => $userId,
                                'userEmail' => $userEmail ? $userEmail->toString() : 'no email',
                                'googleFileRecord' => $attachment
                            ]);
                            continue;
                        }

                        $userEmail = $userEmail->toString();
                        try {
                            $response = $attachment->File->createPermission($userEmail, 'writer', 'user', $userTokens[$attachment->File->OwnerEmail]);
                            \Emergence\Logger::general_warning('API request to create writer permission', [
                                'response' => $response,
                                'userEmail' => $userEmail,
                                'attachment' => $attachment
                            ]);
                        } catch (\Exception $e) {
                            \Emergence\Logger::general_alert('Unable to create {permissionRole} permissions for user: {userEmail}', [
                                'permissionRole' => 'writer',
                                'userEmail' => $userEmail,
                                'googleFileRecord' => $attachment
                            ]);
                            continue;
                        }
                    }
                } elseif ($attachment->ShareMethod == 'duplicate') {

                    if (empty($userTokens[$attachment->File->OwnerEmail])) {
                        $userTokens[$attachment->File->OwnerEmail] = \Google\API::fetchAccessToken('https://www.googleapis.com/auth/drive', $attachment->File->OwnerEmail);
                    }

                    foreach (StudentTask::getAllByWhere(['TaskID' => $Record->ID]) as $StudentTask) {

                        try {
                            $studentEmail = $StudentTask->Student->PrimaryEmail;

                            if (!$studentEmail || !\Validators::email($studentEmail->toString(), ['domain' => 'slatedemo.com'])) {
                                \Emergence\Logger::general_alert('Unable to duplicate file ({googleDriveID}) for {slateUsername}', [
                                    'slateUsername' => $studentEmail ? $studentEmail->toString() : 'no email',
                                    'student' => $StudentTask->Student,
                                    'googleDriveID' => $attachment->File->DriveID
                                ]);
                                continue;
                            }

                            $studentEmail = $studentEmail->toString();
                            if (empty($userTokens[$studentEmail])) {
                                $userTokens[$studentEmail] = \Google\API::fetchAccessToken('https://www.googleapis.com/auth/drive', $studentEmail);
                            }

                            $attachment->File->createPermission($studentEmail, 'reader', 'user', $userTokens[$attachment->File->OwnerEmail]);

                            $duplicateFileResponse = $attachment->File->duplicate($studentEmail, $userTokens[$studentEmail]);

                            $DriveFile = DriveFile::create([
                                'OwnerEmail' => $studentEmail,
                                'DriveID' => $duplicateFileResponse['id'],
                                'ParentDriveID' => $attachment->File->DriveID
                            ]);
                            $DriveFile->details = $duplicateFileResponse;

                            $GoogleDriveAttachment = $googleDriveClass::create([
                                'File' => $DriveFile,
                                'Context' => $StudentTask,
                                'ParentAttachment' => $attachment,
                                'RevisionID' => 1
                            ]);

                            $GoogleDriveAttachment->validate();
                            $GoogleDriveAttachment->save();

                            foreach ($attachment->getRequiredPermissions('read') as $userId) {
                                $userEmail = Person::getByID($userId)->PrimaryEmail;
                                if (!$userEmail || !\Validators::email($userEmail->toString(), ['domain' => 'slatedemo.com'])) {
                                    \Emergence\Logger::general_alert('Unable to duplicate file ({googleDriveID}) for {slateUsername}', [
                                        'slateUsername' => $userEmail ? $userEmail->toString() : 'no email',
                                        'userId' => $userId,
                                        'googleDriveID' => $DriveFile->DriveID
                                    ]);
                                    continue;
                                }
                                $userEmail = $userEmail->toString();

                                if (empty($userTokens[$userEmail])) {
                                    $userTokens[$userEmail] = \Google\API::fetchAccessToken('https://www.googleapis.com/auth/drive', $userEmail);
                                }

                                $DriveFile->createPermission($userEmail, 'reader', 'user', $userTokens[$studentEmail]);
                            }

                        } catch (\RecordValidationException $v) {
                            \Emergence\Logger::general_alert('Unable to save google drive duplicate file and attachment for user: {userEmail}', [
                                'userEmail' => $studentEmail,
                                'duplicateFileResponse' => $duplicateFileResponse,
                                'StudentTask' => $StudentTask,
                                'validationError' => $v
                            ]);
                            continue;
                        } catch (\Exception $e) {
                            \Emergence\Logger::general_alert('Unknown error while creating duplicate file and attachment for user: {userEmail}', [
                                'userEmail' => $studentEmail,
                                'duplicateFileResponse' => $duplicateFileResponse,
                                'StudentTask' => $StudentTask
                            ]);
                            continue;
                        }
                    }
                }
            }
        }
    }
}
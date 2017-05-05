<?php

namespace Slate\CBL\Tasks\Attachments;

use Google\DriveFile;

use Slate\CBL\Tasks\Task;
use Slate\CBL\Tasks\StudentTask;

use Emergence\People\Person;
use Emergence\Logger;

use Exception;
use RecordValidationException;
use Validators;

class GoogleDriveFile extends AbstractTaskAttachment
{
    public $syncedPermissions = [];

    public static $fields = [
        'FileID' => 'uint',
        'FileRevisionID',
        'ShareMethod' => [
            'type' => 'enum',
            'values' => ['duplicate', 'view-only', 'collaborate'],
            'default' => 'view-only'
        ],
        'ParentAttachmentID' => [
            'type' => 'uint',
            'default' => null
        ]
    ];

    public static $validators = [
        'File' => [
            'validator' => 'require-relationship',
            'required' => true
        ],
        'FileRevisionID' => [
            'validator' => 'string',
            'required' => true
        ]
    ];

    public static $relationships = [
        'File' => [
            'type' => 'one-one',
            'class' => \Google\DriveFile::class
        ],
        'ParentAttachment' => [
            'type' => 'one-one',
            'class' => __CLASS__
        ]
    ];

    public static $dynamicFields = [
        'File',
        'ParentAttachment'
    ];

    public function save($deep = true)
    {
        parent::save($deep);

        if ($this->isNew && empty($this->syncedPermissions)) {
            $this->updateFilePermissions();
        }
    }

    public function updateFilePermissions()
    {

        $validatorConfig = [
            'domain' => \Google\API::$domain
        ];

        if ($this->ShareMethod == 'view-only' || $this->ShareMethod == 'collaborate') {
            $requiredPermissions = $this->getRequiredPermissions();


            foreach ($requiredPermissions['read'] as $userId) {
                $userEmail = Person::getByID($userId)->PrimaryEmail;

                if (!$userEmail || !Validators::email($userEmail->toString(), $validatorConfig)) {
                    Logger::general_alert('Unable to create {permissionRole} permissions for user {userEmail} on {googleFileRecord}', [
                        'permissionRole' => 'reader',
                        'userId' => $userId,
                        'userEmail' => $userEmail ? $userEmail->toString() : 'no email',
                        'googleFileRecord' => $this
                    ]);
                    continue;
                }

                try {
                    $response = $this->File->createPermission($userEmail->toString(), 'reader', 'user');
                    $this->syncedPermissions[] = $userEmail->toString();
                } catch (Exception $e) {
                    Logger::general_alert('Unable to create {permissionRole} permissions for user: {userEmail} on {googleFileRecord}', [
                        'permissionRole' => 'reader',
                        'userEmail' => $userEmail->toString(),
                        'googleFileRecord' => $this
                    ]);
                    continue;
                }
            }

            foreach ($requiredPermissions['write'] as $userId) {
                $userEmail = Person::getByID($userId)->PrimaryEmail;

                if (!$userEmail || !Validators::email($userEmail->toString(), $validatorConfig)) {
                    continue;
                }

                try {
                    $response = $this->File->createPermission($userEmail->toString(), 'writer', 'user', $accessToken);
                    $this->syncedPermissions[] = $userEmail->toString();
                } catch (Exception $e) {
                    Logger::general_alert('Unable to create {permissionRole} permissions for user: {userEmail}', [
                        'permissionRole' => 'writer',
                        'userEmail' => $userEmail->toString(),
                        'googleFileRecord' => $this
                    ]);
                    continue;
                }
            }
        } elseif ($this->ShareMethod == 'duplicate') {

            foreach ($this->Context->StudentTasks as $StudentTask) {

                try {
                    $studentEmail = $StudentTask->Student->PrimaryEmail;

                    if (!$studentEmail || !Validators::email($studentEmail->toString(), $validatorConfig)) {
                        Logger::general_alert('Unable to duplicate file ({googleDriveID}) for {slateUsername}', [
                            'slateUsername' => $studentEmail ? $studentEmail->toString() : 'no email',
                            'student' => $StudentTask->Student,
                            'googleDriveID' => $this->File->DriveID
                        ]);
                        continue;
                    }

                    $studentEmail = $studentEmail->toString();

                    $this->File->createPermission($studentEmail, 'reader', 'user');
                    $this->syncedPermissions[] = $studentEmail;

                    $DuplicateDriveFile = $this->File->duplicate($studentEmail);

                    $GoogleDriveAttachment = static::create([
                        'File' => $DuplicateDriveFile,
                        'Context' => $StudentTask,
                        'ParentAttachment' => $this,
                        'FileRevisionID' => "1"
                    ]);

                    if ($GoogleDriveAttachment->validate()) {
                        $GoogleDriveAttachment->save();
                    } else {
                        throw new RecrodValidationException($GoogleDriveAttachment, 'Unable to save invalid attachment.');
                    }

                } catch (RecordValidationException $v) {
                    Logger::general_alert('Unable to save google drive duplicate file and attachment for user: {userEmail}', [
                        'userEmail' => $studentEmail,
                        'duplicateFileResponse' => $duplicateFileResponse,
                        'StudentTask' => $StudentTask,
                        'validationErrors' => $v->validationErrors
                    ]);
                    continue;
                } catch (Exception $e) {
                    Logger::general_alert('Unknown error while creating duplicate file and attachment for user: {userEmail}', [
                        'userEmail' => $studentEmail,
                        'Attachment' => $GoogleDriveAttachment,
                        'ParentAttachment' => $this,
                        'StudentTask' => $StudentTask
                    ]);
                    continue;
                }
            }
        }
    }

    public function getRequiredPermissions($type = null)
    {
        $permissions = [
            'read' => [],
            'write' => []
        ];

        switch ($this->ShareMethod) {
            case 'view-only':
                $permissions['read'] = array_merge(static::getRequiredStudents($this), static::getRequiredTeachers($this));
                break;
            case 'collaborate':
                $permissions['write'] = array_merge(static::getRequiredStudents($this), static::getRequiredTeachers($this));
                break;

            case 'duplicate':
                $permissions['read'] = static::getRequiredTeachers($this);
                break;
        }

        if  (!empty($type) && isset($permissions[$type])) {
            return $permissions[$type];
        }

        return $permissions;
    }

    protected static function getRequiredStudents(GoogleDriveFile $Attachment)
    {
        $userIds = [];

        if ($Attachment->ContextClass == Task::getStaticRootClass()) {
            $userIds = \DB::allValues(
                'StudentID',
                'SELECT StudentID FROM `%s` %s '.
                ' WHERE TaskID = %u ',
                [
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),
                    $Attachment->ContextID
                ]
            );
        }

        return $userIds;
    }

    protected static function getRequiredTeachers(GoogleDriveFile $Attachment)
    {
        $userIds = [];

        if ($Attachment->ContextClass == Task::getStaticRootClass()) {
            $userIds = \DB::allValues(
                'TeacherID',
                'SELECT %6$s.PersonID as TeacherID '.
                '  FROM `%1$s` %2$s '.
                '  JOIN `%3$s` %4$s '.
                '    ON %2$s.ID = %4$s.TaskID '.
                '  JOIN `%5$s` %6$s '.
                '    ON %4$s.SectionID = %6$s.CourseSectionID '.
                ' WHERE %6$s.Role = "Teacher" '.
                '   AND %2$s.ID = %7$u '.
                ' GROUP BY %6$s.PersonID, %6$s.Role ',
                [
                    Task::$tableName,
                    Task::getTableAlias(),
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),
                    \Slate\Courses\SectionParticipant::$tableName,
                    \Slate\Courses\SectionParticipant::getTableAlias(),
                    $Attachment->ContextID
                ]
            );
        } elseif ($Attachment->ContextClass == StudentTask::getStaticRootCLass()) {
            $userIds = \DB::allValues(
                'TeacherID',
                'SELECT %6$s.PersonID as TeacherID '.
                '  FROM `%1$s` %2$s '.
                '  JOIN `%3$s` %4$s '.
                '    ON %2$s.ID = %4$s.TaskID '.
                '  JOIN `%5$s` %6$s '.
                '    ON %4$s.SectionID = %6$s.CourseSectionID '.
                ' WHERE %6$s.Role = "Teacher" '.
                '   AND %2$s.ID = %7$u '.
                ' GROUP BY %6$s.PersonID, %6$s.Role ',
                [
                    Task::$tableName,
                    Task::getTableAlias(),
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),
                    \Slate\Courses\SectionParticipant::$tableName,
                    \Slate\Courses\SectionParticipant::getTableAlias(),
                    $Attachment->Context->TaskID
                ]
            );
        }

        return $userIds;
    }

}
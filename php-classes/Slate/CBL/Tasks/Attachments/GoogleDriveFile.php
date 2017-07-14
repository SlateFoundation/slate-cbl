<?php

namespace Slate\CBL\Tasks\Attachments;

use Google\DriveFile;
use Google\API as GoogleAPI;

use Slate\CBL\Tasks\Task;
use Slate\CBL\Tasks\StudentTask;
use Slate\People\Student;

use Emergence\People\IPerson;
use Emergence\People\Person;
use Emergence\Logger;

use DB;
use Exception;
use RecordValidationException;
use Validators;


class GoogleDriveFile extends AbstractTaskAttachment
{
    public $syncedPermissions = [];
    public static $defaultPermissions = [];

    public static $fields = [
        'FileID' => 'uint',
        'FileRevisionID' => [
            'default' => null
        ],
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
            'required' => false
        ]
    ];

    public static $relationships = [
        'File' => [
            'type' => 'one-one',
            'class' => DriveFile::class
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

    public function getValue($name)
    {
        switch ($name) {
            case 'Task':
                if ($this->ContextClass == Task::getStaticRootClass()) {
                    return $this->Context;
                } elseif ($this->ContextClass == StudentTask::getStaticRootClass()) {
                    return $this->Context->Task;
                }

            default:
                return parent::getValue($name);

        }
    }

    public function cloneAttachment(StudentTask $StudentTask)
    {
        $validEmail = static::getValidEmailAddress($StudentTask->Student);

        if (!$validEmail) {
            Logger::general_alert('Unable to clone google drive attachment for {personFullName} on {googleDriveAttachment}. Could not find a valid email address', [
                'person' => $StudentTask->Student,
                'personFullName' => $StudentTask->Student->getFullName(),
                'googleDriveAttachment' => $this
            ]);
            return false;
        }

        try {
            $DuplicateDriveFile = $this->File->cloneFile();
            $DuplicateDriveFile->transferOwnership($validEmail);
            $DuplicateDriveFile->updateGoogleFileDetails();

            $GoogleDriveAttachment = static::create([
                'File' => $DuplicateDriveFile,
                'Context' => $StudentTask,
                'ParentAttachment' => $this,
                'FileRevisionID' => "1"
            ]);

            if (!$GoogleDriveAttachment->validate()) {
                throw new RecordValidationException($GoogleDriveAttachment, 'Cannot save invalid attachment record');
            }

            $GoogleDriveAttachment->save();

            return $GoogleDriveAttachment;
        } catch (Exception $e) {
            Logger::general_alert('Unable to clone google drive attachment for {personFullName} on {googleDriveAttachment}. {exceptionMessage}', [
                'person' => $StudentTask->Student,
                'personFullName' => $StudentTask->Student->getFullName(),
                'googleDriveAttachment' => $this,
                'exceptionMessage' => $e->getMessage()
            ]);
            return false;
        }

    }
    
    public function syncDefaultPermissions()
    {
        foreach (static::$defaultPermissions as $email => $permission) {
            if (static::isEmailValid($email)) {
                if (empty($syncedPermissions = $this->syncedPermissions[$email])) {
                    try {
                        $this->File->createPermission($email, $permission['role'], $permission['type']);
                        $this->syncedPermissions[$email] = $permission['type'];
                    } catch (Exception $e) {
                        Logger::general_alert('Unable to create {permissionRole} permissions for {permissionType}: {userEmail} on {googleFileRecord}', [
                            'permissionRole' => $permission['role'],
                            'permissionType' => $permission['type'],
                            'userEmail' => $email,
                            'googleFileRecord' => $this
                        ]);
                    }
                }
            }
        }
    }

    public function syncUserPermissions(IPerson $Person)
    {
        if (
            $this->ShareMethod == 'duplicate' &&
            $Person->isA(Student::class) &&
            $StudentTask = StudentTask::getByWhere(['TaskID' => $this->Task->ID, 'StudentID' => $Person->ID])
        ) {
            // file has been duplicated already
            if (static::getByWhere(['ParentAttachmentID' => $this->ID, 'ContextID' => $StudentTask->ID, 'ContextClass' => $StudentTask->getRootClass()])) {
                return false;
            }

            if (!$clonedAttachment = $this->cloneAttachment($StudentTask)) {
                return false;
            }

            foreach (static::getRequiredTeachers($this) as $Teacher) {
                $clonedAttachment->syncUserPermissions($Teacher);
                $clonedAttachment->syncDefaultPermissions();
            }

            return true;
        } else {
            if ($Person->isA(Student::class)) {
                if ($this->ShareMethod == 'view-only') {
                    $type = 'reader';
                } elseif ($this->ShareMethod == 'collaborate') {
                    $type = 'writer';
                }
            } else { // teachers are granted write permissions on all documents
                $type = 'writer';
            }
            
            return $this->permit($Person, $type);
        }
    }

    public function getRequiredPermissions()
    {
        $permissions = array_merge(static::getRequiredStudents($this), static::getRequiredTeachers($this));

        return $permissions;
    }

    public function permit(IPerson $Person, $type)
    {
        $validEmail = static::getValidEmailAddress($Person);

        if (!$validEmail) {
            Logger::general_alert('Unable to create {permissionRole} permissions for person {personFullName} on {googleDriveAttachment}. Could not find a valid email address', [
                'permissionRole' => $type,
                'person' => $Person,
                'personFullName' => $Person->getFullName(),
                'attachment' => $this
            ]);
            return false;
        }

        if ($this->File->OwnerEmail == $validEmail) {
            return true;
        } elseif (!empty($syncedPermissions = $this->syncedPermissions[$validEmail])) {
            if ($syncedPermissions == 'writer' || $type == $syncedPermissions) { // user has been granted the highest permissions already
                return true;
            }
        }

        try {
            $this->File->createPermission($validEmail, $type, 'user');
            $this->syncedPermissions[$validEmail] = $type;
            return true;
        } catch (Exception $e) {
            Logger::general_alert('Unable to create {permissionRole} permissions for user: {userEmail} on {googleFileRecord}', [
                'permissionRole' => $type,
                'userEmail' => $userEmail->toString(),
                'googleFileRecord' => $this
            ]);
            throw $e;
        }
    }

    protected static function getValidEmailAddress(IPerson $Person)
    {
        $validEmail = false;

        if ($Person->PrimaryEmail && static::isEmailValid($Person->PrimaryEmail->toString())) {
            $validEmail = $Person->PrimaryEmail->toString();
        } else if (!empty($Person->ContactPoints)) {
            foreach ($Person->ContactPoints as $ContactPoint) {
                if ($ContactPoint->isA(\Emergence\People\ContactPoint\Email::class) && static::isEmailValid($ContactPoint->toString())) {
                    $validEmail = $ContactPoint->toString();
                    break;
                }
            }
        }

        return $validEmail;
    }
    
    protected static function isEmailValid($emailAddress)
    {
        return Validators::email($emailAddress, [
            'domain' => GoogleAPI::$domain
        ]);
    }

    protected static function getRequiredStudents(GoogleDriveFile $Attachment)
    {
        $users = [];

        if ($Attachment->ContextClass == Task::getStaticRootClass()) {
            $users = Person::getAllByQuery(
                'SELECT %4$s.* FROM `%1$s` %2$s '.
                '  JOIN `%3$s` %4$s '.
                '    ON %4$s.ID = %2$s.StudentID'.
                ' WHERE TaskID = %5$u ',
                [
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),
                    Person::$tableName,
                    Person::getTableAlias(),
                    $Attachment->ContextID
                ]
            );
        }

        return $users;
    }

    protected static function getRequiredTeachers(GoogleDriveFile $Attachment)
    {
        $users = [];

        if ($Attachment->ContextClass == Task::getStaticRootClass()) {
            $Task = $Attachment->Context;
        } else if ($Attachment->ContextClass == StudentTask::getStaticRootClass()) {
            $Task = $Attachment->Context->Task;
        }

        if ($Task) {
            $users = Person::getAllByQuery(
                'SELECT %8$s.* '.
                '  FROM `%1$s` %2$s '.
                '  JOIN `%3$s` %4$s '.
                '    ON %2$s.ID = %4$s.TaskID '.
                '  JOIN `%5$s` %6$s '.
                '    ON %4$s.SectionID = %6$s.CourseSectionID '.
                '  JOIN `%7$s` %8$s '.
                '    ON %8$s.ID = %6$s.PersonID '.
                ' WHERE %6$s.Role = "Teacher" '.
                '   AND %2$s.ID = %9$u '.
                ' GROUP BY %6$s.PersonID, %6$s.Role ',
                [
                    $Task::$tableName,
                    $Task::getTableAlias(),
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),
                    \Slate\Courses\SectionParticipant::$tableName,
                    \Slate\Courses\SectionParticipant::getTableAlias(),
                    Person::$tableName,
                    Person::getTableAlias(),
                    $Task->ID
                ]
            );
        }

        return $users;
    }
}
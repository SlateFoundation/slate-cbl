<?php

namespace Slate\CBL\Tasks\Attachments;

use Google\DriveFile;
use Google\API as GoogleAPI;

use Slate\CBL\Tasks\Task;
use Slate\CBL\Tasks\StudentTask;

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
            $DuplicateDriveFile = $this->File->cloneFile($validEmail);
    
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
    
    public function syncUserPermissions(IPerson $Person)
    {

        switch ($this->ShareMethod) {
            case 'duplicate':
            case 'view-only':
                $type = 'reader';
                break;
            case 'collaborate':
                $type = 'writer';
                break;
        }
        
        $permitted = $this->permit($Person, $type);
        
        if ($permitted && $this->ShareMethod == 'duplicate') {
            if ($Person->isA(\Slate\People\Student::class)) { // currently only instructors can duplicate documents for students
                if ($StudentTask = StudentTask::getByWhere(['TaskID' => $this->Task->ID, 'StudentID' => $Person->ID])) {
                    
                    if (!$clonedAttachment = $this->cloneAttachment($StudentTask)) {
                        continue;
                    }
                    
                    foreach (static::getRequiredTeachers($this) as $Teacher) {
                        $clonedAttachment->syncUserPermissions($Teacher);
                    }                
                }
            }
        }
        
        return $permitted;
    }

    public function syncPermissions()
    {
        $success = true;
        $requiredTeachers = $this->getRequiredTeachers($this);
        
        foreach ($this->Task->StudentTasks as $StudentTask) {
            if (empty($this->syncUserPermissions($StudentTask->Student))) {
                $success = false;
            }            
        }
        
        foreach ($requiredTeachers as $Teacher) {
            if (empty($this->syncUserPermissions($Teacher))) {
                $success = false;
            }
        }
        return $success;
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
        } elseif (!empty($this->syncedPermissions[$validEmail])) {
            return true;    
        }
        
        try {
            $this->File->createPermission($validEmail, $type, 'user');
            $this->syncedPermissions[] = $validEmail;
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
        $emailValidatorSettings = [
            'domain' => GoogleAPI::$domain
        ];
        
        
        if ($Person->PrimaryEmail && Validators::email($Person->PrimaryEmail->toString(), $emailValidatorSettings)) {
            $validEmail = $Person->PrimaryEmail->toString();
        } else if (!empty($Person->ContactPoints)) {
            foreach ($Person->ContactPoints as $ContactPoint) {
                if ($ContactPoint->isA(\Emergence\People\ContactPoint\Email::class) && Validators::email($ContactPoint->toString(), $emailValidatorSettings)) {
                    $validEmail = $ContactPoint->toString();
                    break;
                }
            }
        }
        
        return $validEmail;
        
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
<?php

namespace Slate\CBL\Tasks\Attachments;

use Slate\CBL\Tasks\Task;
use Slate\CBL\Tasks\StudentTask;

class GoogleDriveFile extends AbstractTaskAttachment
{
    public static $fields = [
        'FileID' => 'uint',
        'RevisionID',
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
        'RevisionID' => [
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
#
#            case 'duplicate':
##                    $permissions['duplicate'] = array_merge($permissions['duplicate'], static::getRequiredDuplicatePermissions($googleFileAttachment));
##                    break;
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
        }

        return $userIds;
    }

}
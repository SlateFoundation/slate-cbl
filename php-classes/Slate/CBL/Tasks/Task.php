<?php

namespace Slate\CBL\Tasks;

use DB;
use HandleBehavior;
use RecordValidator;
use Emergence\People\Person;
use Slate\Courses\Section;
use Slate\CBL\Skill;
use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;

class Task extends \VersionedRecord
{
    // ActiveRecord configuration
    public static $useCache = true;

    public static $tableName = 'cbl_tasks';
    public static $singularNoun = 'task';
    public static $pluralNoun = 'tasks';
    public static $collectionRoute = '/cbl/tasks';

    public static $subClasses = [
        __CLASS__,
        ExperienceTask::class,
    ];


    public static $fields = [
        'SectionID' => [
            'type' => 'uint',
            'index' => true,
            'default' => null
        ],
        'Title',
        'Handle' => [
            'unique' => true
        ],
        'ParentTaskID' => [
            'type' => 'uint',
            'default' => null
        ],
        'ClonedTaskID' => [
            'type' => 'uint',
            'default' => null,
        ],
        'Shared' => [
            'type' => 'enum',
            'values' => ['course', 'school', 'public'],
            'default' => null
        ],
        'Status' => [
            'type' => 'enum',
            'notnull' => true,
            'values' => ['private', 'shared', 'archived', 'deleted'],
            'default' => 'private'
        ],
        'Instructions' => [
            'type' => 'clob',
            'default' => null,
        ],

        // overridable by StudentTasks
        'DueDate' => [
            'type' => 'timestamp',
            'default' => null
        ],
        'ExpirationDate' => [
            'type' => 'timestamp',
            'default' => null
        ]
    ];

    public static $validators = [
        'Section' => [
            'type' => 'require-relationship',
            'required' => false
        ],
        'Title',
        'Status' => [
            'validator' => [__CLASS__, 'validateTaskStatus']
        ],
        'ParentTaskID' => [
            'validator' => [__CLASS__, 'validateParentTask']
        ]
    ];

    public static $relationships = [
        'Section' => [
            'type' => 'one-one',
            'class' => Section::class
        ],
        'ParentTask' => [
            'type' => 'one-one',
            'class' => __CLASS__
        ],
        'ClonedTask' => [
            'type' => 'one-one',
            'class' => __CLASS__
        ],
        'SubTasks' => [
            'type' => 'one-many',
            'class' => __CLASS__,
            'local' => 'ID',
            'foreign' => 'ParentTaskID'
        ],
        'Context' => [
            'type' => 'context-parent'
        ],
        'TaskSkills' => [
            'type' => 'one-many',
            'class' => TaskSkill::class,
            'prune' => 'delete'
        ],
        'Skills' => [
            'type' => 'many-many',
            'class' => Skill::class,
            'linkClass' => TaskSkill::class,
            'linkLocal' => 'TaskID',
            'linkForeign' => 'SkillID'
        ],
        'Attachments' => [
            'type' => 'context-children',
            'class' => AbstractTaskAttachment::class
        ],
        'StudentTasks' => [
            'type' => 'one-many',
            'class' => StudentTask::class,
            'prune' => 'delete'
        ],
        'Assignees' => [
            'type' => 'many-many',
            'class' => Person::class,
            'linkClass' => StudentTask::class,
            'linkLocal' => 'TaskID',
            'linkForeign' => 'StudentID'
        ]
    ];

    public static $dynamicFields = [
        'Section',
        'Skills',
        'Creator',
        // 'CreatorFullName' => 'Creator.FullName',
        'ParentTask',
        'SubTasks',
        'Context',
        'Attachments',
        'StudentTasks',
        'Assignees',
        'ClonedTask'
    ];

    public static $summaryFields = [
        'ID' => true,
        'Title' => true,
        'Created' => true,
        'Creator' => true
    ];

    public static $searchConditions = [
        'Title' => [
            'qualifiers' => ['any', 'title'],
            'points' => 2,
            'sql' => 'Title LIKE "%%%s%%"'
        ],
        'Created' => [
            'qualifiers' => ['created'],
            'points' => 1,
            'sql' => 'CAST(Created AS Date) = "%s"'
        ]
    ];

    public function save($deep = true)
    {
        HandleBehavior::onSave($this);

        return parent::save($deep);
    }

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        // implement handles
        HandleBehavior::onValidate($this, $this->_validator);

        // save results
        return $this->finishValidation();
    }

    public function destroy()
    {
        return static::delete($this->ID);
    }

    public static function delete($id)
    {
        DB::nonQuery('UPDATE `%s` SET Status="deleted" WHERE `%s` = %u', array(
            static::$tableName
            ,static::_cn('ID')
            ,$id
        ));

        return DB::affectedRows() > 0;
    }

    protected static function validateParentTask(RecordValidator $validator, Task $Task, $options)
    {
        if (!$validator->hasErrors('ParentTaskID') && $Task->ParentTaskID) {
            if ($Task->ParentTaskID == $Task->ID) {
                $validator->addError('ParentTaskID', 'A task cannot be its own parent');

                // clear immediately to prevent validation loop
                $Task->ParentTaskID = null;
            }

            if (!empty($Task->SubTasks)) {
                $validator->addError('ParentTaskID', 'A task with subtasks is a parent task and cannot be a subtask of another task');

                // clear immediately to prevent validation loop
                $Task->ParentTaskID = null;
            }
        }
    }

    protected static function validateTaskStatus(RecordValidator $RecordValidator, Task $Record, $options = [], $validatorKey)
    {
        if (!$RecordValidator->hasErrors($validatorKey)) {
            if ($Record->Status === 'private' && !$Record->SectionID) {
                $RecordValidator->addError($validatorKey, 'Tasks not assigned to a section must be made "public".');
            }
        }
    }
}

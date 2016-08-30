<?php

namespace Slate\CBL\Tasks;

use DB;
use HandleBehavior;
use Emergence\People\Person;
use Slate\CBL\Skill;
use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;

class Task extends \VersionedRecord
{
    //VersionedRecord configuration
    public static $historyTable = 'history_cbl_tasks';

    // ActiveRecord configuration
    public static $tableName = 'cbl_tasks';
    public static $singularNoun = 'task';
    public static $pluralNoun = 'tasks';
    public static $collectionRoute = '/cbl/tasks';
    public static $useCache = true;
    public static $subClasses = [
        __CLASS__,
        ExperienceTask::class,
    ];

    public static $fields = [
        'Title' => [
            'includeInSummary' => true
        ],
        'Handle' => [
            'unique' => true
        ],
        'ParentTaskID' => [
            'type' => 'uint',
            'notnull' => false,
            'includeInSummary' => true
        ],
        'DueDate' => [
            'type' => 'timestamp',
            'notnull' => false
        ],
        'ExpirationDate' => [
            'type' => 'timestamp',
            'notnull' => false
        ],
        'Instructions' => [
            'type' => 'clob',
            'notnull' => false
        ],
        'Shared' => [
            'type' => 'enum',
            'notnull' => true,
            'values' => ['course', 'school', 'public'],
            'default' => null
        ],
        'Status' => [
            'type' => 'enum',
            'notnull' => true,
            'values' => ['private', 'shared', 'deleted'],
            'default' => 'private'
        ]
    ];

    public static $validators = [
        'Title'
    ];

    public static $relationships = [
        'ParentTask' => [
            'type' => 'one-one',
            'class' => __CLASS__,
            'local' => 'ParentTaskID'
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
            'foreign' => 'TaskID'
        ]
    ];

    public static $dynamicFields = [
        'Skills',
        'Creator' => [
            'includeInSummary' => true,
            'stringsOnly' => false
        ],
        'ParentTask',
        'SubTasks',
        'Context',
        'Attachments',
        'StudentTasks',
        'ParentTaskTitle' => [
            'getter' => 'getParenTaskTitle'
        ]
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
        ],
        'ParentTaskTitle' => [
            'qualifiers' => ['parenttasktitle', 'parenttask'],
            'points' => 1,
            'join' => [
                'className' => __CLASS__,
                'localField' => 'ParentTaskID',
                'foreignField' => 'ID',
                'aliasName' => 'ParentTask'
            ],
            'sql' => 'ParentTask.Title LIKE "%%%s%%"'
        ],
        'Creator' => [
            'qualifiers' => ['creatorfullname', 'creator'],
            'points' => 1,
            'join' => [
                'className' => Person::class,
                'localField' => 'CreatorID',
                'foreignField' => 'ID'
            ],
            'callback' => [__CLASS__, 'getCreatorSearchConditionsSql']
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

    public function getParenTaskTitle()
    {
        return $this->ParentTask ? $this->ParentTask->Title : null;
    }

    public static function getCreatorSearchConditionsSql($term, $condition)
    {
        $personTableAlias = Person::getTableAlias();
        return 'CONCAT('.$personTableAlias.'.FirstName, " ", '.$personTableAlias.'.LastName) LIKE "%'.$term.'%"';
    }
}
<?php

namespace Slate\CBL\Tasks;

use DB;
use HandleBehavior;
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
        ],
        'ContextID' => [
            'type' => 'uint',
            'default' => null
        ],
        'ContextClass' => [
            'default' => null
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
            'type' => 'one-many',
            'class' => AbstractTaskAttachment::class,
            'foreign' => 'TaskID',
            'local' => 'ID'
        ]
    ];

    public static $dynamicFields = [
        'Skills',
        'Creator' => [
            'includeInSummary' => true,
            'stringsOnly' => false
        ],
#        => [
#            'getter' => 'getSkills'
#        ],
        'ParentTask',
        'SubTasks',
        'Context',
        'Attachments'
    ];
    
    public static $searchConditions = [];
    
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
}
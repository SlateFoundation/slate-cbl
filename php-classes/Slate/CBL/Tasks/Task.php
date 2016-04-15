<?php

namespace Slate\CBL\Tasks;

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
        'Title',
        'Handle' => [
            'unique' => true
        ],
        'ParentTaskID' => [
            'type' => 'uint',
            'notnull' => false
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
            'values' => ['course', 'school', 'public'],
            'default' => null
        ]
    ];

    public static $validators = [
        'Title'
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
}
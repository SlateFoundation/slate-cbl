<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Skill;

class TaskSkill extends \VersionedRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_task_skills';
    public static $singularNoun = 'task skill';
    public static $pluralNoun = 'task skills';

    public static $useCache = true;

    public static $fields = [
        'TaskID' => 'uint',
        'SkillID' => 'uint'
    ];

    public static $relationships = [
        'Task' => [
            'type' => 'one-one',
            'class' => Task::class
        ],
        'Skill' => [
            'type' => 'one-one',
            'class' => Skill::class
         ]
    ];

    public static $indexes = [
        'Task' => [
            'fields' => ['TaskID', 'SkillID'],
            'unique' => true
        ]
    ];

    public static $validators = [
        'Task' => 'require-relationship',
        'Skill' => 'require-relationship'
    ];
}

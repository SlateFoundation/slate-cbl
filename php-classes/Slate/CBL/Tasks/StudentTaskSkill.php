<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Skill;

class StudentTaskSkill extends \VersionedRecord
{
    //VersionedRecord configuration
    public static $historyTable = 'history_cbl_student_task_skills';

    // ActiveRecord configuration
    public static $tableName = 'cbl_student_task_skills';
    public static $singularNoun = 'student task skill';
    public static $pluralNoun = 'student task skills';

    public static $useCache = true;

    public static $fields = [
        'StudentTaskID' => 'uint',
        'SkillID' => 'uint'
    ];

    public static $relationships = [
        'StudentTask' => [
            'type' => 'one-one',
            'class' => StudentTask::class
        ],
        'Skill' => [
            'type' => 'one-one',
            'class' => Skill::class
         ]
    ];

    public static $dynamicFields = [
        'StudentTask',
        'Skill'
    ];
}

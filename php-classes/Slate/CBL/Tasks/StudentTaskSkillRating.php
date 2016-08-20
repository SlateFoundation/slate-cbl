<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Skill;

class StudentTaskSkillRating extends \VersionedRecord
{
    public static $historyTable = 'history_cbl_student_task_ratings';
    
    public static $tableName = 'cbl_student_task_ratings';
    
    public static $singularNoun = 'student task rating';
    public static $pluralNoun = 'student task ratings';
    
    public static $fields = [
        'StudentTaskID' => 'uint',
        'SkillID' => 'uint',
        
        'Score' => [
            'type' => 'enum',
            'values' => ['N/A', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'M'],
            'default' => 'N/A'
        ]
    ];
    
    public static $relationships = [
        'Skill' => [
            'type' => 'one-one',
            'class' => Skill::class
        ],
        'StudentTask' => [
            'type' => 'one-one',
            'class' => StudentTask::class
        ]
    ];

}
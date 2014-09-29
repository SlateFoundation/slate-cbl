<?php

namespace Slate\CBL;

class DemonstrationSkill extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_demonstration_skills';
    public static $singularNoun = 'demonstration skill';
    public static $pluralNoun = 'demonstration skills';

    public static $fields = [
        'DemonstrationID' => [
            'type' => 'uint'
            ,'index' => true
        ],
        'SkillID' => [
            'type' => 'uint'
            ,'index' => true
        ]
        ,'Level' => [
            'type' => 'tinyint',
            'unsigned' => true
        ]
    ];

    public static $relationships = [
        'Demonstration' => [
            'type' => 'one-one'
            ,'class' => Demonstration::class
        ],
        'Skill' => [
            'type' => 'one-one'
            ,'class' => Skill::class
        ]
    ];
    
    public static $validators = [
        'DemonstrationID' => [
            'validator' => 'number'
            ,'min' => 1
        ]
        ,'SkillID' => [
            'validator' => 'number'
            ,'min' => 1
        ]
        ,'Level' => [
            'validator' => 'number'
            ,'min' => 8
            ,'max' => 13
        ]
    ];
    
    public static $dynamicFields = [
        'Demonstration',
        'Skill'
    ];
}
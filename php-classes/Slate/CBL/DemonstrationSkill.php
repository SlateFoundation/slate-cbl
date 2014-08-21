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
            'type' => 'enum',
            'values' => ['8', '9', '10', '11', '12', '13']
        ]
    ];

    public static $relationships = [
        'Demonstration' => [
            'type' => 'one-one'
            ,'class' => 'Slate\\CBL\\Demonstration'
        ],
        'Skill' => [
            'type' => 'one-one'
            ,'class' => 'Slate\\CBL\\Skill'
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
    ];
    
    public static $dynamicFields = [
        'Demonstration',
        'Skill'
    ];

    public function validate($deep = true)
    {
        parent::validate($deep);

        $this->_validator->validate(array(
            'field' => 'Level'
            ,'validator' => 'selection'
            ,'choices' => static::getFieldOptions('Level', 'values')
        ));

        return $this->finishValidation();
    }
}
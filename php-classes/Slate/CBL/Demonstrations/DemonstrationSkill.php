<?php

namespace Slate\CBL\Demonstrations;

use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;

class DemonstrationSkill extends \VersionedRecord
{
    public static $allowTargetLevelChanges = false;

    // ActiveRecord configuration
    public static $tableName = 'cbl_demonstration_skills';
    public static $singularNoun = 'demonstration skill';
    public static $pluralNoun = 'demonstration skills';
    public static $collectionRoute = '/cbl/demonstration-skills';

    public static $fields = [
        'DemonstrationID' => [
            'type' => 'uint'
            ,'index' => true
        ],
        'SkillID' => [
            'type' => 'uint'
            ,'index' => true
        ],
        'TargetLevel' => [
            'type' => 'tinyint',
            'default' => null
        ],
        'DemonstratedLevel' => [
            'type' => 'tinyint',
            'unsigned' => true,
            'default' => null
        ],
        'Override' => [
            'type' => 'boolean',
            'default' => false
        ]
    ];

    public static $indexes = [
        'DemonstrationSkill' => [
            'fields' => ['DemonstrationID', 'SkillID'],
            'unique' => true
        ]
    ];

    public static $relationships = [
        'Demonstration' => [
            'type' => 'one-one',
            'class' => Demonstration::class
        ],
        'Skill' => [
            'type' => 'one-one',
            'class' => Skill::class
        ]
    ];

    public static $validators = [
        'Demonstration' => 'require-relationship',
        'Skill' => 'require-relationship',
        'TargetLevel' => [
            'validator' => 'number',
            'min' => 1,
            'max' => 13,
            'required' => false
        ]
    ];

    public static $dynamicFields = [
        'Demonstration',
        'Skill'
    ];

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        // demonstrated level
        if ($this->Override && $this->DemonstratedLevel !== null) {
            $this->_validator->addError('DemonstratedLevel', 'DemonstratedLevel must be null for override');
        } elseif (!$this->Override && $this->DemonstratedLevel === null) {
            $this->_validator->addError('DemonstratedLevel', 'DemonstratedLevel must not be null for non-override');
        }

        // target level can only be set on new records
        if (!static::$allowTargetLevelChanges && !$this->isPhantom && $this->isFieldDirty('TargetLevel')) {
            $this->_validator->addError('TargetLevel', 'TargetLevel cannot be changed on existing records');
        }

        // save results
        return $this->finishValidation();
    }

    public function save($deep = true)
    {
        // default TargetLevel to student's current level
        if (!$this->TargetLevel && $StudentCompetency = StudentCompetency::getCurrentForStudent($this->Demonstration->Student, $this->Skill->Competency)) {
            $this->TargetLevel = $StudentCompetency->Level;
        }

        return parent::save($deep);
    }
}
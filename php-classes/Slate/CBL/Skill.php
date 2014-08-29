<?php

namespace Slate\CBL;

class Skill extends \VersionedRecord
{
    // VersionedRecord configuration
    public static $historyTable = 'history_cbl_skills';

    // ActiveRecord configuration
    public static $tableName = 'cbl_skills';
    public static $singularNoun = 'skill';
    public static $pluralNoun = 'skills';
    public static $collectionRoute = '/cbl/skills';

    public static $fields = [
        'CompetencyID' => [
            'type' => 'uint'
            ,'index' => true
        ]
        ,'Code' => [
            'unique' => true
        ]
        ,'Descriptor'
        ,'Statement' => 'clob'
        ,'DemonstrationsNeeded' => [
            'type' => 'uint'
            ,'default' => 2
        ]
    ];

    public static $relationships = [
        'Competency' => [
            'type' => 'one-one'
            ,'class' => 'Slate\\CBL\\Competency'
        ]
    ];
    
    public static $validators = [
        'CompetencyID' => [
            'validator' => 'number'
            ,'min' => 1
        ]
        ,'Code' => [
            'validator' => 'handle'
            ,'errorMessage' => 'Code can only contain letters, numbers, hyphens, underscores, and periods'
        ]
        ,'Descriptor' => [
            'errorMessage' => 'A descriptor is required'
        ]
    ];
    
    public static $dynamicFields = [
        'Competency'
    ];

    public function getHandle()
    {
        return $this->Code;
    }

    public static function getByHandle($handle)
    {
        return static::getByCode($handle);
    }

    public static function getByCode($code)
    {
        return static::getByField('Code', $code);
    }

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        // check handle uniqueness
        if ($this->isFieldDirty('Code') && !$this->_validator->hasErrors('Code') && $this->Code) {
            $ExistingRecord = static::getByHandle($this->Code);

            if ($ExistingRecord && ($ExistingRecord->ID != $Record->ID)) {
                $validator->addError('Code', 'Code already registered');
            }
        }

        // save results
        return $this->finishValidation();
    }
}
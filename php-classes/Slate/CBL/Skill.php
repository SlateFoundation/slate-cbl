<?php

namespace Slate\CBL;

class Skill extends \VersionedRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_skills';
    public static $singularNoun = 'skill';
    public static $pluralNoun = 'skills';
    public static $collectionRoute = '/cbl/skills';
    public static $useCache = true;

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
        ,'DemonstrationsRequired' => 'json'
    ];

    public static $relationships = [
        'Competency' => [
            'type' => 'one-one'
            ,'class' => Competency::class
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
        'Competency',
        'CompetencyLevel' => [
            'getter' => 'getCompetencyLevel'
        ],
        'CompetencyDescriptor' => [
            'getter' => 'getCompetencyDescriptor'
        ],
        'CompetencyCode' => [
            'getter' => 'getCompetencyCode'
        ]
    ];

    public static $searchConditions = [
        'Code' => [
            'qualifiers' => ['code', 'any'],
            'points' => 2,
            'callback' => [__CLASS__, 'getCodeSql']
        ],

        'Descriptor' => [
            'qualifiers' => ['descriptor', 'any'],
            'points' => 1,
            'callback' => [__CLASS__, 'getDescriptorSql']
        ]
    ];

    public static function __classLoaded()
    {
        static::$searchConditions['CompetencyDescriptor'] = [
            'qualifiers' => ['competency', 'any'],
            'points' => 1,
            'join' => [
                'className' => Competency::class,
                'localField' => 'CompetencyID',
                'foreignField' => 'ID',
                'aliasName' => Competency::getTableAlias() // todo: remove when ActiveRecord class can set this automatically
            ],
            'callback' => [__CLASS__, 'getCompetencyDescriptorSql']
        ];
    }

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

            if ($ExistingRecord && ($ExistingRecord->ID != $this->ID)) {
                $this->_validator->addError('Code', 'Code already registered');
            }
        }

        // save results
        return $this->finishValidation();
    }

    public function save($deep = true)
    {
        $wasCompetencyDirty = $this->isFieldDirty('CompetencyID');
        $wasDemonstrationsRequiredDirty = $this->isFieldDirty('DemonstrationsRequired');

        parent::save($deep);

        if ($wasCompetencyDirty) {
            if ($this->Competency) {
                $this->Competency->getSkillIds(true); // true to force refresh of cached value
            }

            if ($oldCompetencyId = $this->getOriginalValue('CompetencyID')) {
                Competency::getByID($oldCompetencyId)->getSkillIds(true); // true to force refresh of cached value
            }
        }

        if ($wasDemonstrationsRequiredDirty) {
            $this->Competency->getTotalDemonstrationsRequired(null, true); // true to force refresh of cached value
        }
    }

    public static function getCompetencyDescriptorSql($term, $condition)
    {
        $competencyTableAlias = Competency::getTableAlias();
        return $competencyTableAlias.'.Descriptor LIKE "%'.$term.'%"';
    }

    public static function getCodeSql($term, $condition)
    {
         return static::getTableAlias() . '.Code LIKE "%'.$term.'%"';
    }

    public static function getDescriptorSql($term, $condition)
    {
        return static::getTableAlias() . '.Descriptor LIKE "%'.$term.'%"';
    }

    public function getCompetencyDescriptor()
    {
        return $this->Competency ? $this->Competency->Descriptor : null;
    }

    public function getCompetencyCode()
    {
        return $this->Competency ? $this->Competency->Code : null;
    }

    public function getCompetencyLevel()
    {
        $level = null;
        if ($GLOBALS['Session']->PersonID && $this->Competency && $StudentCompetency = StudentCompetency::getByWhere(['StudentID' => $GLOBALS['Session']->PersonID, 'CompetencyID' => $this->Competency->ID])) {
            $level = $StudentCompetency->Level;
        }

        return $level;
    }
}
<?php

namespace Slate\CBL;

use DB, Cache, TableNotFoundException;


class ContentArea extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_content_areas';
    public static $singularNoun = 'content area';
    public static $pluralNoun = 'content areas';
    public static $collectionRoute = '/cbl/content-areas';
    public static $useCache = true;

    public static $fields = [
        'Code' => [
            'type' => 'string'
            ,'unique' => true
        ]
        ,'Title' => 'string'
        ,'Status' => [
            'type' => 'enum',
            'values' => ['draft', 'active', 'archived'],
            'default' => 'active'
        ]
    ];

    public static $relationships = [
        'Competencies' => [
            'type' => 'one-many'
            ,'class' => Competency::class
            ,'foreign' => 'ContentAreaID'
            ,'order' => ['Code' => 'ASC']
        ]
    ];

    public static $validators = [
        'Title' => [
            'errorMessage' => 'A title is required'
        ]
    ];

    public static $dynamicFields = [
        'Competencies' => [
            'getter' => 'getActiveCompetencies'
        ],
        'competencyIds' => [
            'getter' => 'getActiveCompetencyIds'
        ],
    ];

    public static $summaryFields = [
        'ID' => true,
        'Code' => true,
        'Title' => true
    ];

    public function getHandle()
    {
        return $this->Code;
    }

    public function getTitle()
    {
        $title = $this->Code;

        if ($this->Title) {
            $title .= ': ' . $this->Title;
        }

        return $title;
    }

    public function getActiveCompetencyIds($forceRefresh = false)
    {
        $cacheKey = "cbl-contentarea/$this->ID/active-competency-ids";

        if (!$forceRefresh && false !== ($competencyIds = Cache::fetch($cacheKey))) {
            return $competencyIds;
        }

        try {
            $competencyIds = array_map('intval', DB::allValues(
                'ID',
                'SELECT ID FROM `%s` WHERE ContentAreaID = %u AND Status = "active"',
                [
                    Competency::$tableName,
                    $this->ID
                ]
            ));
        } catch (TableNotFoundException $e) {
            $competencyIds = [];
        }

        Cache::store($cacheKey, $competencyIds);

        return $competencyIds;
    }

    public function getActiveCompetencies($forceRefresh = false)
    {
        $competencies = [];

        foreach (static::getActiveCompetencyIds($forceRefresh) as $competencyId) {
            $competencies[] = Competency::getByID($competencyId);
        }

        return $competencies;
    }

    public function getActiveSkillIds($forceRefresh = false)
    {
        $cacheKey = "cbl-contentarea/$this->ID/active-skill-ids";

        if (!$forceRefresh && false !== ($skillIds = Cache::fetch($cacheKey))) {
            return $skillIds;
        }

        try {
            $skillIds = array_map('intval', DB::allValues(
                'ID',
                '
                    SELECT Skill.ID
                      FROM `%s` Skill
                      JOIN `%s` Competency
                        ON Competency.ID = Skill.CompetencyID
                     WHERE Competency.ContentAreaID = %u
                       AND Competency.Status = "active"
                       AND Skill.Status = "active"
                ',
                [
                    Skill::$tableName,
                    Competency::$tableName,
                    $this->ID
                ]
            ));
        } catch (TableNotFoundException $e) {
            $skillIds = [];
        }

        Cache::store($cacheKey, $skillIds);

        return $skillIds;
    }

    public function getActiveSkills($forceRefresh = false)
    {
        $skills = [];

        foreach (static::getActiveSkillIds($forceRefresh) as $skillId) {
            $skills[] = Skill::getByID($skillId);
        }

        return $skills;
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
        $wasStatusDirty = $this->isFieldDirty('Status');

        // set code
        if (!$this->Code) {
            $this->Code = \HandleBehavior::getUniqueHandle($this, $this->Title, [
                'handleField' => 'Code'
            ]);
        }

        // call parent
        parent::save($deep);

        if ($wasStatusDirty) {
            Skill::getInactiveIds(true);
        }
    }
}
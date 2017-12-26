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
            'getter' => 'getCompetencies'
        ],
        'competencyIds' => [
            'getter' => 'getCompetencyIds'
        ],
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

    public function getCompetencyIds($forceRefresh = false)
    {
        $cacheKey = "cbl-contentarea/$this->ID/competency-ids";

        if (!$forceRefresh && false !== ($competencyIds = Cache::fetch($cacheKey))) {
            return $competencyIds;
        }

        try {
            $competencyIds = array_map('intval', DB::allValues(
                'ID',
                'SELECT ID FROM `%s` WHERE ContentAreaID = %u',
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
    
    public function getCompetencies($forceRefresh = false)
    {
        $competencies = [];

        foreach (static::getCompetencyIds($forceRefresh) as $competencyId) {
            $competencies[] = Competency::getByID($competencyId);
        }

        return $competencies;
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
        // set code
        if (!$this->Code) {
            $this->Code = \HandleBehavior::getUniqueHandle($this, $this->Title, [
                'handleField' => 'Code'
            ]);
        }

        // call parent
        parent::save($deep);
    }
}
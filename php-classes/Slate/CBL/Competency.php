<?php

namespace Slate\CBL;

use DB, Cache, TableNotFoundException;


class Competency extends \VersionedRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_competencies';
    public static $singularNoun = 'competency';
    public static $pluralNoun = 'competencies';
    public static $collectionRoute = '/cbl/competencies';
    public static $useCache = true;

    public static $fields = [
        'ContentAreaID' => [
            'type' => 'uint'
            ,'index' => true
        ]
        ,'Code' => [
            'unique' => true
        ]
        ,'Descriptor'
        ,'Statement' => 'clob'
        ,'Status' => [
            'type' => 'enum',
            'values' => ['draft', 'active', 'archived'],
            'default' => 'active'
        ]
    ];

    public static $relationships = [
        'ContentArea' => [
            'type' => 'one-one'
            ,'class' => ContentArea::class
        ]
        ,'Skills' => [
            'type' => 'one-many'
            ,'class' => Skill::class
            ,'foreign' => 'CompetencyID'
        ]
    ];

    public static $validators = [
        'ContentArea' => 'require-relationship',
        'Code' => [
            'validator' => 'handle',
            'errorMessage' => 'Code can only contain letters, numbers, hyphens, underscores, and periods'
        ],
        'Descriptor' => [
            'errorMessage' => 'A descriptor is required'
        ]
    ];

    public static $dynamicFields = [
        'ContentArea',
        'Skills' => [
            'getter' => 'getActiveSkills'
        ],
        'skillIds' => [
            'getter' => 'getActiveSkillIds'
        ],
        'totalDemonstrationsRequired' => [
            'getter' => 'getTotalDemonstrationsRequired'
        ]
    ];

    public static $summaryFields = [
        'ID' => true,
        'Code' => true,
        'Descriptor' => true,
        'ContentAreaID' => true
    ];

    public function getHandle()
    {
        return $this->Code;
    }

    public function getTitle()
    {
        $title = $this->Code;

        if ($this->Descriptor) {
            $title .= ': ' . $this->Descriptor;
        }

        return $title;
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
        $wasContentAreaDirty = $this->isFieldDirty('ContentAreaID');
        $wasStatusDirty = $this->isFieldDirty('Status');

        parent::save($deep);

        if ($wasContentAreaDirty || $wasStatusDirty) {
            if ($this->ContentArea) {
                $this->ContentArea->getActiveSkillIds(true); // true to force refresh of cached value
            }

            Skill::getInactiveIds(true);
        }

        if ($wasContentAreaDirty) {
            if ($oldContentAreaId = $this->getOriginalValue('ContentAreaID')) {
                ContentArea::getByID($oldContentAreaId)->getActiveSkillIds(true); // true to force refresh of cached value
            }
        }
    }

    public function getActiveSkillIds($forceRefresh = false)
    {
        $cacheKey = "cbl-competency/$this->ID/active-skill-ids";

        if (!$forceRefresh && false !== ($skillIds = Cache::fetch($cacheKey))) {
            return $skillIds;
        }

        if ($this->Status == 'active') {
            try {
                $skillIds = array_map('intval', DB::allValues(
                    'ID',
                    'SELECT ID FROM `%s` WHERE CompetencyID = %u AND Status = "active"',
                    [
                        Skill::$tableName,
                        $this->ID
                    ]
                ));
            } catch (TableNotFoundException $e) {
                $skillIds = [];
            }
        } else {
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

    private $totalSkills;
    public function getTotalSkills($forceRefresh = false)
    {
        if ($this->totalSkills === null || $forceRefresh) {
            $this->totalSkills = count($this->getActiveSkillIds($forceRefresh));
        }

        return $this->totalSkills;
    }

    public function getTotalDemonstrationsRequired($level = null, $forceRefresh = false)
    {
        $cacheKey = "cbl-competency/$this->ID/total-demonstrations-required";

        if ($forceRefresh || false === ($levelTotals = Cache::fetch($cacheKey))) {
            try {
                $skills = $this->getActiveSkills();

                // accumulate available levels
                $collectedLevel = [];
                foreach ($skills as $Skill) {
                    $collectedLevel = array_merge($collectedLevel, array_keys($Skill->DemonstrationsRequired));
                }
                $collectedLevel = array_unique($collectedLevel);

                // sum required demonstrations
                $levelTotals = [];
                foreach ($collectedLevel as $collectedLeve) {
                    $levelTotals[$collectedLeve] = 0;

                    foreach ($skills as $Skill) {
                        if (isset($Skill->DemonstrationsRequired[$collectedLeve])) {
                            $levelTotals[$collectedLeve] += $Skill->DemonstrationsRequired[$collectedLeve];
                        } else {
                            $levelTotals[$collectedLeve] += $Skill->DemonstrationsRequired['default'];
                        }
                    }
                }
            } catch (TableNotFoundException $e) {
                $levelTotals = [];
            }
        }

        Cache::store($cacheKey, $levelTotals);

        if ($level) {
            if (array_key_exists($level, $levelTotals)) {
                return $levelTotals[$level];
            } else if (array_key_exists('default', $levelTotals)) {
                return $levelTotals['default'];
            } else { // handle competencies with no skills
                return 0;
            }
        }

        return $levelTotals;
    }

    public static function getAllByListIdentifier($identifier)
    {
        if (!$identifier) {
            return array();
        }

        if ($identifier == 'all') {
            return static::getAll();
        }

        if (preg_match('/^\d+(,\d+)*$/', $identifier)) {
            return static::getAllByWhere('ID IN (' . $identifier . ')');
        }

        throw new \Exception('Invalid list identifier for competencies');
    }

}
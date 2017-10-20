<?php

namespace Slate\CBL;

use DB, Cache, TableNotFoundException;
use Slate\People\Student;

class Competency extends \VersionedRecord
{
    public static $minimumAverageOffset = -0.5;
    public static $maximumTargetLevel = 12;

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
        'Skills',
        'totalDemonstrationsRequired' => [
            'getter' => 'getTotalDemonstrationsRequired'
        ],
        'minimumAverageOffset' => [
            'getter' => 'getMinimumAverageOffset'
        ]
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

    public function getMinimumAverageOffset()
    {
        return static::$minimumAverageOffset;
    }

    public function getMaximumTargetLevel()
    {
        // TODO: convert to a database field for the competency or content area?
        return static::$maximumTargetLevel;
    }

    public function getSkillIds($forceRefresh = false)
    {
        $cacheKey = "cbl-competency/$this->ID/skill-ids";

        if (!$forceRefresh && false !== ($skillIds = Cache::fetch($cacheKey))) {
            return $skillIds;
        }

        try {
            $skillIds = array_map('intval', DB::allValues(
                'ID',
                'SELECT Skill.ID FROM `%s` Skill WHERE Skill.CompetencyID = %u',
                [
                    Skill::$tableName,
                    $this->ID
                ]
            ));
        } catch (TableNotFoundException $e) {
            $skillIds = [];
        }

        Cache::store($cacheKey, $skillIds);

        return $skillIds;
    }

    private $totalSkills;
    public function getTotalSkills($forceRefresh = false)
    {
        if ($this->totalSkills === null || $forceRefresh) {
            $this->totalSkills = count($this->getSkillIds($forceRefresh));
        }

        return $this->totalSkills;
    }

    public function getTotalDemonstrationsRequired($level = null, $forceRefresh = false)
    {
        $cacheKey = "cbl-competency/$this->ID/total-demonstrations-required";
        if ($forceRefresh || false === ($levelTotals = Cache::fetch($cacheKey))) {
            try {
                $levelTotals = [];
                $totals = DB::allValues('DemonstrationsRequired',
                    'SELECT Skill.DemonstrationsRequired FROM `%s` Skill WHERE Skill.CompetencyID = %u',
                    [
                        Skill::$tableName,
                        $this->ID
                    ]
                );

                $uniqueLevels = [];
                foreach ($totals as &$total) {
                    $total = json_decode($total, true);
                    $uniqueLevels = array_unique(array_merge($uniqueLevels, array_keys($total)));
                }

                foreach ($uniqueLevels as $uniqueLevel) {

                    $levelTotals[$uniqueLevel] = 0;
                    foreach ($totals as $values) {
                        $levelTotals[$uniqueLevel] += isset($values[$uniqueLevel]) ? $values[$uniqueLevel] : $values['default'];
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
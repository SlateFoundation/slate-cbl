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
        'ContentAreaID' => [
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

    public function getCompletionForStudent(Student $Student, $level = null, $demonstrationConditions = '')
    {
#        $cacheKey = "cbl-competency/$this->ID/student-completion/$Student->ID";
#
#        if (!$forceRefresh && false !== ($completion = Cache::fetch($cacheKey))) {
#            return $completion;
#        }
        $currentLevel = $level ?: $this->getCurrentLevelForStudent($Student);
        if ($currentLevel && !empty($this->Skills)) {
            try {
                DB::nonQuery('SET @num := 0, @skill := ""');

                    $query =
                    "SELECT ".
                            "SUM(demonstrationsLogged) AS demonstrationsLogged, ".
                            "SUM(demonstrationsComplete) AS demonstrationsComplete, ".
                            "SUM(demonstrationsAverage * demonstrationsLogged) / SUM(demonstrationsLogged) AS demonstrationsAverage ".
                      "FROM ( ".
                            "SELECT ".
                                    "COUNT(IF(Override, NULL, DemonstratedLevel)) AS demonstrationsLogged, ".
                                    "LEAST(DemonstrationsRequired, SUM(IF(Override, DemonstrationsRequired, 1))) AS demonstrationsComplete, ".
                                    "AVG(IF(Override, NULL, DemonstratedLevel)) AS demonstrationsAverage ".
                              "FROM ( ".
                                    "SELECT ".
                                            "StudentDemonstrationSkill.TargetLevel, ".
                                            "StudentDemonstrationSkill.DemonstratedLevel, ".
                                            "StudentDemonstrationSkill.Override, ".
                                            "@num := if(@skill = StudentDemonstrationSkill.SkillID, @num + 1, 1) AS rowNumber, ".
                                            "@skill := StudentDemonstrationSkill.SkillID AS SkillID ".
                                    "FROM ( ".
                                         "SELECT ".
                                                "DemonstrationSkill.TargetLevel, ".
                                                "DemonstrationSkill.SkillID, ".
                                                "DemonstrationSkill.DemonstratedLevel, ".
                                                "DemonstrationSkill.Override ".
                                           "FROM `%s` DemonstrationSkill ".
                                           "JOIN (SELECT ID, Demonstrated FROM `%s` WHERE StudentID = %u) Demonstration ".
                                             "ON Demonstration.ID = DemonstrationSkill.DemonstrationID ".
                                          "WHERE DemonstrationSkill.SkillID IN (%s) ".
                                            "AND DemonstrationSkill.TargetLevel = %u ".
                                            "AND DemonstrationSkill.DemonstratedLevel > 0 ".
                                            "%s".
                                         ") StudentDemonstrationSkill ".
                                   "ORDER BY SkillID, DemonstratedLevel DESC ".
                                  ") OrderedDemonstrationSkill ".
                             "JOIN ( ".
                                    "SELECT ".
                                            "ID,".
                                            "IFNULL(".
                                                 "JSON_EXTRACT( ".
                                                     "DemonstrationsRequired, CONCAT('$.\"', %s, '\"') ".
                                                 "),".
                                                 "DemonstrationsRequired->'$.default') AS DemonstrationsRequired FROM `%s` ".
                                            ") Skill ".
                                        "ON Skill.ID = OrderedDemonstrationSkill.SkillID ".
                            "WHERE rowNumber <= Skill.DemonstrationsRequired ".
                            "GROUP BY SkillID".
                            ") SkillCompletion";
                $parameters = [
                    Demonstrations\DemonstrationSkill::$tableName,
                    Demonstrations\Demonstration::$tableName,
                    $Student->ID,
                    implode(',', $this->getSkillIds()),
                    $currentLevel,
                    ($demonstrationConditions ? 'AND ' . $demonstrationConditions . ' ' : ''),
                    $currentLevel,
                    Skill::$tableName
                ];

                $completion = DB::oneRecord($query, $parameters);

                // cast strings to floats
                return [
                    'currentLevel' => $currentLevel,
                    'demonstrationsLogged' => intval($completion['demonstrationsLogged']),
                    'demonstrationsComplete' => intval($completion['demonstrationsComplete']),
                    'demonstrationsAverage' => $completion['demonstrationsAverage'] == null ? null : floatval($completion['demonstrationsAverage'])
                ];
            } catch (TableNotFoundException $e) {}
        }

        // store in cache (will require cache-refreshers in relevant save methods)
#        Cache::store($cacheKey, $completion);

        return [
            'demonstrationsLogged' => 0,
            'demonstrationsComplete' => 0,
            'demonstrationsAverage' => null,
            'currentLevel' => $currentLevel
        ];
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

    public function getCurrentLevelForStudent(Student $Student)
    {
        try {
            $level = \DB::oneValue(
                'SELECT MAX(Level) AS Level FROM cbl_student_competencies WHERE StudentID = %u AND CompetencyID = %u',
                [
                    $Student->ID,
                    $this->ID
                ]
            );
        } catch (TableNotFoundException $e) {}

        return $level ? intval($level) : null;
    }

    public function getStudentCompetency(Student $Student, $level = null)
    {
        $StudentCompetency = null;
        try {
            $StudentCompetency = StudentCompetency::getByQuery(
                'SELECT * FROM `%s` WHERE StudentID = %u AND CompetencyID = %u ORDER BY Level DESC LIMIT 1',
                [
                    StudentCompetency::$tableName,
                    $Student->ID,
                    $this->ID
                ]
            );
        } catch (TableNotFoundException $e) {}

        return $StudentCompetency;
    }
}

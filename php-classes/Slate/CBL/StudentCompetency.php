<?php

namespace Slate\CBL;

use DB;
use TableNotFoundException;

use Slate\People\Student;

use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;

class StudentCompetency extends \ActiveRecord
{
    public static $minimumAverage;
    public static $minimumRating;
    public static $maximumLevel;

    public static $autoGraduate = true;
    public static $autoBaseline = true;

    public static $getDemonstrationConditions;
    public static $isLevelComplete;
    public static $growthCalculatorClass = Calculators\Growth\MostRecentMinusFirst::class;
    public static $averagePrecision = 1;
    public static $progressPrecision = 2;


    // ActiveRecord configuration
    public static $tableName = 'cbl_student_competencies';
    public static $singularNoun = 'student competency';
    public static $pluralNoun = 'student competencies';
    public static $collectionRoute = '/cbl/student-competencies';

    public static $fields = [
        'StudentID' => [
            'type' => 'uint'
        ],
        'CompetencyID' => [
            'type' => 'uint'
        ],
        'Level' => [
            'type' => 'tinyint'
        ],
        'EnteredVia' => [
            'type' => 'enum',
            'values' => array('enrollment', 'graduation')
        ],
        'BaselineRating' => [
            'type' => 'decimal',
            'length' => '5,2',
            'default' => null
        ]
    ];

    public static $relationships = [
        'Student' => [
            'type' => 'one-one',
            'class' => Student::class
        ],
        'Competency' => [
            'type' => 'one-one',
            'class' => Competency::class
        ]
    ];

    public static $validators = [
        'Student' => 'require-relationship',
        'Competency' => 'require-relationship'
    ];

    public static $indexes = [
        'StudentCompetency' => [
            'fields' => ['StudentID', 'CompetencyID', 'Level'],
            'unique' => true
        ]
    ];

    public static $dynamicFields = [
        'Student',
        'Competency',
        'completion' => [
            'getter' => 'getCompletion'
        ],
        'demonstrationOpportunities' => [
            'getter' => 'getDemonstrationOpportunities'
        ],
        'demonstrationsLogged' => [
            'getter' => 'getDemonstrationsLogged'
        ],
        'demonstrationsMissed' => [
            'getter' => 'getDemonstrationsMissed'
        ],
        'demonstrationsComplete' => [
            'getter' => 'getDemonstrationsComplete'
        ],
        'demonstrationsAverage' => [
            'getter' => 'getDemonstrationsAverage'
        ],
        'demonstrationsRequired' => [
            'getter' => 'getDemonstrationsRequired'
        ],
        'demonstrationData' => [
            'getter' => 'getDemonstrationData'
        ],
        'effectiveDemonstrationsData' => [
            'getter' => 'getEffectiveDemonstrationsData'
        ],
        'minimumAverage' => [
            'getter' => 'getMinimumAverage'
        ],
        'minimumRating' => [
            'getter' => 'getMinimumRating'
        ],
        'isLevelComplete' => [
            'getter' => 'isLevelComplete'
        ],
        'growth' => [
            'getter' => 'getGrowth'
        ],
        'progress' => [
            'getter' => 'getProgress'
        ],
        'next' => [
            'getter' => 'getNext'
        ]
    ];

    public function save($deep = true)
    {
        // initialize baseline
        if (
            static::$autoBaseline
            && !$this->BaselineRating
            && $this->isPhantom
            && $this->StudentID && $this->CompetencyID && $this->Level
            && ($Previous = $this->getPrevious())
        ) {
            $this->BaselineRating = max($Previous->getBaselineRating(), $Previous->getDemonstrationsAverage());
        }

        // call parent
        parent::save($deep);
    }

    public function getBaselineRating()
    {
        return round($this->BaselineRating, static::$averagePrecision);
    }

    public function getCompletion()
    {
        return [
            'StudentID' => $this->StudentID,
            'CompetencyID' => $this->CompetencyID,
            'currentLevel' => $this->Level,
            'baselineRating' => $this->BaselineRating,
            'demonstrationsLogged' => $this->getDemonstrationsLogged(),
            'demonstrationsMissed' => $this->getDemonstrationsMissed(),
            'demonstrationsComplete' => $this->getDemonstrationsComplete(),
            'demonstrationsAverage' => $this->getDemonstrationsAverage(),
            'demonstrationsRequired' => $this->getDemonstrationsRequired(),
            'growth' => $this->getGrowth()
        ];
    }

    public function calculateStartingRating()
    {
        $ratings = DB::valuesTable(
            'SkillID',
            'Rating',
            '
            SELECT S.ID AS SkillID,
                IFNULL(
                    JSON_EXTRACT(DemonstrationsRequired, \'$."%4$u"\'),
                    JSON_EXTRACT(DemonstrationsRequired, "$.default")
                ) AS DemonstrationsRequirements,
                (
                    SELECT DS.DemonstratedLevel
                    FROM `%3$s` DS
                    JOIN `%2$s` D
                        ON D.ID = DS.DemonstrationID
                    WHERE DS.SkillID = S.ID
                    AND DS.TargetLevel = %4$u
                    AND DS.DemonstratedLevel > 0
                    AND D.StudentID = %5$u
                    ORDER BY D.Demonstrated, D.ID
                    LIMIT 1
                ) AS Rating
              FROM `%1$s` S
             WHERE S.CompetencyID = %6$u
            HAVING DemonstrationsRequirements > 0
            ',
            [
                Skill::$tableName, // %1$s
                Demonstration::$tableName, // %2$s
                DemonstrationSkill::$tableName, // %3$s
                $this->Level, // %4$u
                $this->StudentID, // %5$u
                $this->CompetencyID // %6$u
            ]
        );

        $ratingsCount = count(array_filter($ratings));
        if (!$ratingsCount || $ratingsCount != count($ratings)) {
            return null;
        }

        return array_sum($ratings) / $ratingsCount;
    }

    private $demonstrationData;
    public function getDemonstrationData()
    {
        if ($this->demonstrationData === null) {
            // TODO: cache dynamically, maybe use models instead for parsing DemonstrationSkill results?
            try {
                $skillIds = $this->Competency->getSkillIds();

                if (count($skillIds)) {
                    $conditions = [
                        'SkillID' => [ 'values' => $skillIds ],
                        'TargetLevel' => $this->Level
                    ];

                    if (is_callable(static::$getDemonstrationConditions)) {
                        $conditions = call_user_func(static::$getDemonstrationConditions, $this, $conditions);
                    }

                    $this->demonstrationData = DB::arrayTable(
                        'SkillID',
                        '
                        SELECT DemonstrationSkill.*,
                               Demonstration.Demonstrated AS DemonstrationDate
                          FROM `%s` DemonstrationSkill
                          JOIN (SELECT ID, Demonstrated FROM `%s` WHERE StudentID = %u) Demonstration
                            ON Demonstration.ID = DemonstrationSkill.DemonstrationID
                         WHERE (%s)
                         ORDER BY SkillID, DemonstrationDate, DemonstrationID
                        ',
                        [
                            DemonstrationSkill::$tableName,
                            Demonstration::$tableName,
                            $this->StudentID,
                            implode(DemonstrationSkill::mapConditions($conditions, 'DemonstrationSkill'), ') AND (')
                        ]
                    );

                    foreach ($this->demonstrationData as &$demonstrationSkills) {
                        foreach ($demonstrationSkills as &$demonstrationSkill) {
                            $demonstrationSkill['ID'] = intval($demonstrationSkill['ID']);
                            $demonstrationSkill['Created'] = strtotime($demonstrationSkill['Created']);
                            $demonstrationSkill['CreatorID'] = intval($demonstrationSkill['CreatorID']);
                            $demonstrationSkill['DemonstrationID'] = intval($demonstrationSkill['DemonstrationID']);
                            $demonstrationSkill['SkillID'] = intval($demonstrationSkill['SkillID']);
                            $demonstrationSkill['DemonstrationDate'] = strtotime($demonstrationSkill['DemonstrationDate']);
                            $demonstrationSkill['TargetLevel'] = intval($demonstrationSkill['TargetLevel']);
                            $demonstrationSkill['DemonstratedLevel'] = intval($demonstrationSkill['DemonstratedLevel']);
                            $demonstrationSkill['Override'] = $demonstrationSkill['Override'] == '1';
                        }
                    }
                } else {
                    $this->demonstrationData = [];
                }
            } catch (TableNotFoundException $e) {
                $this->demonstrationData = [];
            }
        }

        return $this->demonstrationData;
    }

    private $demonstrationOpportunities;
    public function getDemonstrationOpportunities()
    {
        if ($this->demonstrationOpportunities === null) {
            $this->demonstrationOpportunities = 0;

            foreach ($this->getDemonstrationData() as $skillId => $demonstrationData) {
                foreach ($demonstrationData as $demonstration) {
                    if (empty($demonstration['Override'])) {
                        $this->demonstrationOpportunities++;
                    }
                }
            }
        }

        return $this->demonstrationOpportunities;
    }

    protected static function sortDemonstrations($a, $b)
    {
        return $a['ID'] < $b['ID'] ? -1 : 1;
    }

    protected static function sortEffectiveDemonstrations($a, $b)
    {
        if ($a['DemonstratedLevel'] == $b['DemonstratedLevel']) {
            return static::sortDemonstrations($a, $b);
        }

        return $a['DemonstratedLevel'] < $b['DemonstratedLevel'] ? 1 : -1;
    }

    private $effectiveDemonstrationsData;
    public function getEffectiveDemonstrationsData()
    {
        if ($this->effectiveDemonstrationsData === null) {
            $demonstrationsData = $this->getDemonstrationData();

            foreach ($demonstrationsData as $skillId => &$demonstrationData) {
                usort($demonstrationData, [__CLASS__,  'sortEffectiveDemonstrations']);

                $Skill = Skill::getByID($skillId);
                $demonstrationsRequired = $Skill->getDemonstrationsRequiredByLevel($this->Level);

                array_splice($demonstrationData, $demonstrationsRequired);

                usort($demonstrationData, [__CLASS__,  'sortDemonstrations']);
            }

            $this->effectiveDemonstrationsData = $demonstrationsData;
        }

        return $this->effectiveDemonstrationsData;
    }

    private $demonstrationsLogged;
    public function getDemonstrationsLogged()
    {
        if ($this->demonstrationsLogged === null) {
            $this->demonstrationsLogged = 0;

            foreach ($this->getEffectiveDemonstrationsData() as $skillId => $demonstrationData) {
                foreach ($demonstrationData as $demonstration) {
                    if (empty($demonstration['Override']) && !empty($demonstration['DemonstratedLevel'])) {
                        $this->demonstrationsLogged++;
                    }
                }
            }
        }

        return $this->demonstrationsLogged;
    }

    private $demonstrationsMissed;
    public function getDemonstrationsMissed()
    {
        if ($this->demonstrationsMissed === null) {
            $this->demonstrationsMissed = 0;

            foreach ($this->getEffectiveDemonstrationsData() as $skillId => $demonstrationData) {
                foreach ($demonstrationData as $demonstration) {
                    if (empty($demonstration['Override']) && empty($demonstration['DemonstratedLevel'])) {
                        $this->demonstrationsMissed++;
                    }
                }
            }
        }

        return $this->demonstrationsMissed;
    }

    private $demonstrationsComplete;
    public function getDemonstrationsComplete()
    {
        if ($this->demonstrationsComplete === null) {
            $this->demonstrationsComplete = 0;

            foreach ($this->getEffectiveDemonstrationsData() as $skillId => $demonstrationData) {
                $Skill = Skill::getByID($skillId);
                $demonstrationsRequired = $Skill->getDemonstrationsRequiredByLevel($this->Level);
                $skillCount = 0;

                foreach ($demonstrationData as $demonstration) {
                    if (!empty($demonstration['Override'])) {
                        $skillCount += $demonstrationsRequired;
                    } elseif (!empty($demonstration['DemonstratedLevel'])) {
                        $skillCount++;
                    }
                }

                $this->demonstrationsComplete += min($demonstrationsRequired, $skillCount);
            }
        }

        return $this->demonstrationsComplete;
    }

    private $demonstrationsAverage;
    public function getDemonstrationsAverage()
    {
        if ($this->demonstrationsAverage === null) {
            if ($this->getDemonstrationsLogged()) {
                $effectiveDemonstrationsData = $this->getEffectiveDemonstrationsData();
                $totalScore = 0;
                foreach ($effectiveDemonstrationsData as $skillId => $demonstrationsData) {
                    foreach ($demonstrationsData as $demonstration) {
                        if (empty($demonstration['Override'])) {
                            $totalScore += $demonstration['DemonstratedLevel'];
                        }
                    }
                }
                $this->demonstrationsAverage = round($totalScore / $this->getDemonstrationsLogged(), static::$averagePrecision);
            }
        }

        return $this->demonstrationsAverage;
    }

    private $demonstrationsRequired;
    public function getDemonstrationsRequired()
    {
        if ($this->demonstrationsRequired === null) {
            $this->demonstrationsRequired = $this->Competency->getTotalDemonstrationsRequired($this->Level);
        }

        return $this->demonstrationsRequired;
    }

    private $minimumAverageCache;
    public function getMinimumAverage()
    {
        if ($this->minimumAverageCache === null) {
            if (is_array(static::$minimumAverage)) {
                $minimumAverage = isset(static::$minimumAverage[$this->Level])
                    ? static::$minimumAverage[$this->Level]
                    : null;
            } elseif (is_callable(static::$minimumAverage)) {
                $minimumAverage = call_user_func(static::$minimumAverage, $this);
            } else {
                $minimumAverage = static::$minimumAverage;
            }

            if ($minimumAverage === null) {
                $this->minimumAverageCache = false;
            } elseif (!is_numeric($minimumAverage)) {
                throw new \UnexpectedValueException('minimumAverage must be numeric: '.var_export($minimumAverage, true));
            } elseif ($minimumAverage <= 0) {
                $this->minimumAverageCache = $minimumAverage + $this->Level;
            } else {
                $this->minimumAverageCache = $minimumAverage;
            }
        }

        return $this->minimumAverageCache === false ? null : $this->minimumAverageCache;
    }

    private $minimumRatingCache;
    public function getMinimumRating()
    {
        if ($this->minimumRatingCache === null) {
            if (is_array(static::$minimumRating)) {
                $minimumRating = isset(static::$minimumRating[$this->Level])
                    ? static::$minimumRating[$this->Level]
                    : null;
            } elseif (is_callable(static::$minimumRating)) {
                $minimumRating = call_user_func(static::$minimumRating, $this);
            } else {
                $minimumRating = static::$minimumRating;
            }

            if ($minimumRating === null) {
                $this->minimumRatingCache = false;
            } elseif (!is_numeric($minimumRating)) {
                throw new \UnexpectedValueException('minimumRating must be numeric: '.var_export($minimumRating, true));
            } elseif ($minimumRating <= 0) {
                $this->minimumRatingCache = $minimumRating + $this->Level;
            } else {
                $this->minimumRatingCache = $minimumRating;
            }
        }

        return $this->minimumRatingCache === false ? null : $this->minimumRatingCache;
    }

    public function isLevelComplete()
    {
        // require a minimum total demonstrations for the competency
        $competencyEvidenceRequirements = $this->Competency->getTotalDemonstrationsRequired($this->Level);

        if (
            $competencyEvidenceRequirements
            && $this->getDemonstrationsComplete() < $competencyEvidenceRequirements
        ) {
            return false;
        }


        // require minimum average as offset from level
        $minimumAverage = $this->getMinimumAverage();

        if (
            $minimumAverage !== null
            && $this->getDemonstrationsAverage() < $minimumAverage
        ) {
            return false;
        }


        // require all demonstrations have ratings above minimum
        $minimumRating = $this->getMinimumRating();

        if ($minimumRating !== null) {
            foreach ($this->getEffectiveDemonstrationsData() as $skillID => $demonstrations) {
                foreach ($demonstrations as $demonstration) {
                    if ($demonstration['DemonstratedLevel'] < $minimumRating) {
                        return false;
                    }
                }
            }
        }


        // custom level complete function
        if (is_callable(static::$isLevelComplete)) {
            return call_user_func(static::$isLevelComplete, $this) ?: false;
        }

        return true;
    }

    private $competencyGrowth;
    public function getGrowth()
    {
        if ($this->competencyGrowth === null) {
            $growthCalculationClass = static::$growthCalculatorClass;
            $this->competencyGrowth = $growthCalculationClass::calculateGrowth($this);
        }

        return $this->competencyGrowth === false ? null : round($this->competencyGrowth, static::$averagePrecision);
    }

    private $competencyProgress;
    public function getProgress()
    {
        if ($this->competencyProgress === null) {
            $required = $this->getDemonstrationsRequired();
            $complete = $this->getDemonstrationsComplete();
            $this->competencyProgress = $required ? $complete / $required : 1;
        }

        return $this->competencyProgress === false ? null : round($this->competencyProgress, static::$progressPrecision);
    }

    private $previous;
    public function getPrevious()
    {
        if ($this->previous === null) {
            $this->previous = static::getByWhere([
                'StudentID' => $this->StudentID,
                'CompetencyID' => $this->CompetencyID,
                'Level' => [
                    'operator' => '<',
                    'value' => $this->Level
                ]
            ], [ 'order' => ['Level' => 'DESC'] ]);
        }

        return $this->previous;
    }

    private $next;
    public function getNext()
    {
        if ($this->next === null) {
            $this->next = static::getByWhere([
                'StudentID' => $this->StudentID,
                'CompetencyID' => $this->CompetencyID,
                'Level' => [
                    'operator' => '>',
                    'value' => $this->Level
                ]
            ], [ 'order' => ['Level' => 'ASC'] ]);
        }

        return $this->next;
    }


    public static function getCurrentForStudent(Student $Student, Competency $Competency)
    {
        return static::getByWhere(['StudentID' => $Student->ID, 'CompetencyID' => $Competency->ID], ['order' => ['Level' => 'DESC']]);
    }

    public static function isCurrentLevelComplete(Student $Student, Competency $Competency)
    {
        $StudentCompetency = static::getCurrentForStudent($Student, $Competency);

        if ($StudentCompetency) {
            return $StudentCompetency->isLevelComplete();
        }

        return false;
    }

    public static function getBlankCompletion(Student $Student, Competency $Competency)
    {
        return [
                'StudentID' => $Student->ID,
                'CompetencyID' => $Competency->ID,
                'currentLevel' => null,
                'baselineRating' => null,
                'demonstrationsLogged' => 0,
                'demonstrationsMissed' => 0,
                'demonstrationsComplete' => 0,
                'demonstrationsAverage' => null,
                'demonstrationsRequired' => null,
                'growth' => null
            ];
    }
}

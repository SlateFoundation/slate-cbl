<?php

namespace Slate\CBL;

use DB;
use TableNotFoundException;

use Slate\People\Student;

use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;

class StudentCompetency extends \ActiveRecord
{
    public static $autoGraduate = true;
    public static $isLevelComplete;
    public static $minimumRatingOffset;

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
        'completion' => [
            'getter' => 'getCompletion'
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
        'growth' => [
            'getter' => 'getGrowth'
        ]
    ];

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
            'demonstrationsAtLevel' => $this->getDemonstrationsAtLevel(),
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
            try {
                $skillIds = $this->Competency->getSkillIds();

                if (count($skillIds)) {
                    $this->demonstrationData = DB::arrayTable(
                        'SkillID',
                        '
                        SELECT DemonstrationSkill.*,
                               Demonstration.Demonstrated AS DemonstrationDate
                          FROM `%s` DemonstrationSkill
                          JOIN (SELECT ID, Demonstrated FROM `%s` WHERE StudentID = %u) Demonstration
                            ON Demonstration.ID = DemonstrationSkill.DemonstrationID
                         WHERE DemonstrationSkill.SkillID IN (%s)
                           AND DemonstrationSkill.TargetLevel = %u
                         ORDER BY SkillID, DemonstrationDate, DemonstrationID
                        ',
                        [
                            DemonstrationSkill::$tableName,
                            Demonstration::$tableName,
                            $this->StudentID,
                            join(', ', $skillIds),
                            $this->Level
                        ]
                    );
                } else {
                    $this->demonstrationData = [];
                }
            } catch (TableNotFoundException $e) {
                $this->demonstrationData = [];
            }
        }

        return $this->demonstrationData;
    }

    protected static function sortEffectiveDemonstrations($a, $b)
    {
        if ($a['DemonstratedLevel'] == $b['DemonstratedLevel']) {
            return 0;
        }

        return $a['DemonstratedLevel'] < $b['DemonstratedLevel'] ? 1 : -1;
    }

    private $effectiveDemonstrationsData;
    public function getEffectiveDemonstrationsData()
    {
        if ($this->effectiveDemonstrationsData === null) {
            $demonstrationsData = $this->getDemonstrationData();

            foreach ($demonstrationsData as $skillId => &$demonstrationData) {
                uasort($demonstrationData, [__CLASS__,  'sortEffectiveDemonstrations']);

                $Skill = Skill::getByID($skillId);
                $demonstrationsRequired = $Skill->getDemonstrationsRequiredByLevel($this->Level);

                array_splice($demonstrationData, $demonstrationsRequired);
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

    private $demonstrationsAtLevel;
    public function getDemonstrationsAtLevel()
    {
        if ($this->demonstrationsComplete === null) {
            $this->demonstrationsAtLevel = 0;


            foreach ($this->getEffectiveDemonstrationsData() as $skillId => $demonstrationData) {
                $Skill = Skill::getByID($skillId);
                $demonstrationsRequired = $Skill->getDemonstrationsRequiredByLevel($this->Level);
                $skillCount = 0;
                $level = $this->Level;

                foreach ($demonstrationData as $demonstration) {
                    if (!empty($demonstration['Override'])) {
                        $skillCount += $demonstrationsRequired;
                      } elseif (!empty($demonstration['DemonstratedLevel']) && $demonstration['DemonstratedLevel'] >= $level) {
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
                $this->demonstrationsAverage = $totalScore / $this->getDemonstrationsLogged();
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

    public function isLevelComplete()
    {
        $logged = $this->getDemonstrationsLogged();
        $completed = $this->getDemonstrationsComplete();
        $average = $this->getDemonstrationsAverage();

        $competencyEvidenceRequirements = $this->Competency->getTotalDemonstrationsRequired($this->Level);
        $minimumOffset = $this->Competency->getMinimumAverageOffset();

        // Require a minimum total demonstrations for the competency
        if ($competencyEvidenceRequirements && $completed < $competencyEvidenceRequirements) {
            return false;
        }

        // Require minimum average as offset from level
        if ($minimumOffset !== null && $average < $this->Level + $minimumOffset) {
            return false;
        }

        // Require all demonstrations have ratings above minimum
        if (static::$minimumRatingOffset !== null) {
            $minimumRating = $this->Level + static::$minimumRatingOffset;

            foreach ($this->getEffectiveDemonstrationsData() as $skillID => $demonstrations) {
                foreach ($demonstrations as $demonstration) {
                    if ($demonstration['DemonstratedLevel'] < $minimumRating) {
                        return false;
                    }
                }
            }
        }

        // Custom level complete function
        if (is_callable(static::$isLevelComplete)) {
            return call_user_func(static::$isLevelComplete, $this);
        }

        return true;
    }

    private $competencyGrowth;
    public function getGrowth()
    {
        if ($this->competencyGrowth === null) {
            $demonstrationData = $this->getDemonstrationData();

            $growthData = array_filter(array_map(function($demonstrations) {
                // filter out overrides and missed demonstrations
                $demonstrations = array_filter($demonstrations, function ($demonstration) {
                    return $demonstration['DemonstratedLevel'] && empty($demonstration['Override']);
                });

                // growth can only be calculated if 2 ratings are available, or 1 rating and a baseline
                if (count($demonstrations) + ($this->BaselineRating ? 1 : 0) < 2) {
                    return null;
                }

                $lastRating = end($demonstrations);
                if ($this->BaselineRating) {
                    return $lastRating['DemonstratedLevel'] - $this->BaselineRating;
                } else {
                    $firstRating = reset($demonstrations);

                    return $lastRating['DemonstratedLevel'] - $firstRating['DemonstratedLevel'];
                }
            }, $demonstrationData));

            $totalGrowthSkills = count($growthData);

            if ($totalGrowthSkills && $totalGrowthSkills * 2 >= $this->Competency->getTotalSkills()) {
                $this->competencyGrowth = array_sum($growthData) / $totalGrowthSkills;
            } else {
                $this->competencyGrowth = false;
            }
        }

        return $this->competencyGrowth === false ? null : $this->competencyGrowth;
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
                'el' => null,
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

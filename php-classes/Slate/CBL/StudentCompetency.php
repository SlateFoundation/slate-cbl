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
        'demonstrationsComplete' => [
            'getter' => 'getDemonstrationsComplete'
        ],
        'demonstrationsAverage' => [
            'getter' => 'getDemonstrationsAverage'
        ],
        'demonstrationData' => [
            'getter' => 'getDemonstrationData'
        ],
        'effectiveDemonstrationsData' => [
            'getter' => 'getEffectiveDemonstrationsData'
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
            'demonstrationsComplete' => $this->getDemonstrationsComplete(),
            'demonstrationsAverage' => $this->getDemonstrationsAverage()
        ];
    }

    public function calculateStartingRating()
    {
        $validSkills = DB::allRecords(
            '
            SELECT ID,
                REPLACE(
                   IFNULL (
                       JSON_EXTRACT(DemonstrationsRequired, \'$."%u"\'),
                       JSON_EXTRACT(DemonstrationsRequired, "$.default")
                   ),
                   \'"\',
                   ""
                ) AS DemonstrationsRequirements
              FROM `%s`
             WHERE CompetencyID = %u
            HAVING DemonstrationsRequirements > 0
            ',
            [
                $this->Level,
                Skill::$tableName,
                $this->Competency->ID
            ]
        );
        $validSkillIds = array_column($validSkills, 'ID');

        $ratedSkills = DB::valuesTable(
            'SkillID',
            'skillRatings',
            '
            SELECT COUNT(*) AS skillRatings, SkillID
        	  FROM `%1$s` ds
    		  JOIN `%2$s` d
    			ON d.ID = ds.DemonstrationID
    		 WHERE ds.SkillID IN (%3$s)
    		   AND ds.TargetLevel = %4$u
    		   AND ds.DemonstratedLevel > 0
    		   AND d.StudentID = %5$u
    		   AND ds.Override = false
    		 GROUP BY SkillID
            ',
            [
                DemonstrationSkill::$tableName,
                Demonstration::$tableName,
                join(', ', $validSkillIds),
                $this->Level,
                $this->StudentID
            ]
        );

        // starting rating can not be calculated if each required skill has not been rated at least once
        foreach ($validSkillIds as $skillId) {
            if (empty($ratedSkills[$skillId])) {
                return null;
            }
        }

        // get the first rating (by date) for each skill
        $demonstrationSkillRatings = DB::allValues(
            'skillRatings',
            '
            SELECT ds.DemonstratedLevel as skillRatings
        	  FROM `%1$s` ds
    		  JOIN `%2$s` d
    		    ON d.ID = ds.DemonstrationID
    		 INNER JOIN (
                    SELECT MIN(demo.Demonstrated) as Created, SkillID
    		          FROM `%1$s` demoskill
    		          JOIN `%2$s` demo
    		            ON demo.ID = demoskill.DemonstrationID
    		         WHERE TargetLevel = %3$u
                       AND DemonstratedLevel > 0
                       AND Override = false
                       AND demoskill.SkillID IN (%4$s)
                       AND demo.StudentID = %5$u
                     GROUP BY SkillID
    		  ) ds2
    		    ON ds2.SkillID = ds.SkillID
    		   AND ds2.Created = d.Demonstrated
    		 WHERE ds.SkillID IN (%4$s)
    		   AND ds.TargetLevel = %3$u
    		   AND ds.DemonstratedLevel > 0
    		   AND d.StudentID = %5$u
    		   AND ds.Override = false
            ',
            [
                DemonstrationSkill::$tableName,
                Demonstration::$tableName,
                $this->Level,
                join(', ', $validSkillIds),
                $this->StudentID
            ]
        );

        return array_sum($demonstrationSkillRatings) / count($validSkills);
    }

    private $demonstrationData;
    public function getDemonstrationData()
    {
        if ($this->demonstrationData !== null) {
            return $this->demonstrationData;
        }

        try {
            $data = DB::arrayTable(
                'SkillID',
                'SELECT '.
                '    DemonstrationSkill.*, '.
                '    Demonstration.Demonstrated AS DemonstrationDate '.
                '  FROM `%s` DemonstrationSkill '.
                '  JOIN (SELECT ID, Demonstrated FROM `%s` WHERE StudentID = %u) Demonstration '.
                '    ON Demonstration.ID = DemonstrationSkill.DemonstrationID '.
                ' WHERE DemonstrationSkill.SkillID IN (%s) '.
                '   AND DemonstrationSkill.TargetLevel = %u '.
                ' ORDER BY SkillID, DemonstrationDate, DemonstrationID',
                [
                    DemonstrationSkill::$tableName,
                    Demonstration::$tableName,
                    $this->StudentID,
                    join(', ', $this->Competency->getSkillIds()),
                    $this->Level
                ]
            );

            return $this->demonstrationData = $data;
        } catch (TableNotFoundException $e) {
            return [];
        }
    }

    protected static function sortEffectiveDemonstrations($a, $b)
    {
        if ($a['DemonstratedLevel'] == $b['DemonstratedLevel']) {
            return 0;
        }
        return ($a['DemonstratedLevel'] < $b['DemonstratedLevel']) ? -1 : 1;
    }

    private $effectiveDemonstrationsData;
    public function getEffectiveDemonstrationsData()
    {
        if ($this->effectiveDemonstrationsData !== null) {
            return $this->effectiveDemonstrationsData;
        }

        $demonstrationsData = $this->getDemonstrationData();

        foreach ($demonstrationsData as $skillId => &$demonstrationData) {
            uasort($demonstrationData, [__CLASS__,  'sortEffectiveDemonstrations']);

            $Skill = Skill::getByID($skillId);
            $demonstrationsRequired = $Skill->getDemonstrationsRequiredByLevel($this->Level);

            array_splice($demonstrationData, $demonstrationsRequired);
        }

        return $this->effectiveDemonstrationsData = $demonstrationsData;
    }

    private $demonstrationsLogged;
    public function getDemonstrationsLogged()
    {

        if ($this->demonstrationsLogged !== null) {
            return $this->demonstrationsLogged;
        }

        $effectiveDemonstrationsData = $this->getEffectiveDemonstrationsData();
        $count = 0;
        foreach ($effectiveDemonstrationsData as $skillId => $demonstrationData) {
            $Skill = Skill::getByID($skillId);
            $skillCount = 0;
            foreach ($demonstrationData as $demonstration) {
                if (empty($demonstration['Override'])) {
                    if (!empty($demonstration['DemonstratedLevel'])) {
                        $skillCount++;
                    }
                }
            }
            // ?
            $count += min($skillCount, $Skill->getDemonstrationsRequiredByLevel($this->Level));
        }

        return $this->demonstrationsLogged = $count;

    }

    private $demonstrationsComplete;
    public function getDemonstrationsComplete()
    {
        if ($this->demonstrationsComplete !== null) {
            return $this->demonstrationsComplete;
        }

        $effectiveDemonstrationsData = $this->getEffectiveDemonstrationsData();
        $count = 0;
        foreach ($effectiveDemonstrationsData as $skillId => $demonstrationData) {
            $Skill = Skill::getByID($skillId);
            $skillCount = 0;
            foreach ($demonstrationData as $demonstration) {
                if (!empty($demonstration['DemonstratedLevel'])) {
                    if ($demonstration['Override']) {
                        $skillCount += $Skill->getDemonstrationsRequiredByLevel($this->Level);
                    } else {
                        $skillCount++;
                    }
                }

                $skillCount = min($Skill->getDemonstrationsRequiredByLevel($this->Level), $skillCount);
            }

            $count += $skillCount;
        }

        return $this->demonstrationsComplete = $count;
    }

    private $demonstrationsAverage;
    public function getDemonstrationsAverage()
    {
        if ($this->demonstrationsAverage !== null) {
            return $this->demonstrationsAverage;
        }

        $effectiveDemonstrationsData = $this->getEffectiveDemonstrationsData();
        $average = null;
        $totalScore = 0;

        foreach ($effectiveDemonstrationsData as $skillId => $demonstrationsData) {
            foreach ($demonstrationsData as $demonstration) {
                if (empty($demonstration['Override'])) {
                    $totalScore += $demonstration['DemonstratedLevel'];
                }
            }
        }

        if ($this->getDemonstrationsLogged()) {
            $average = $totalScore / $this->getDemonstrationsLogged();
        }

        return $this->demonstrationsAverage = $average;
    }

    public function isLevelComplete()
    {
        $logged = $this->getDemonstrationsLogged();
        $completed = $this->getDemonstrationsComplete();
        $average = $this->getDemonstrationsAverage();

        $competencyEvidenceRequirements = $this->Competency->getTotalDemonstrationsRequired($this->Level);
        $minimumOffset = $this->Competency->getMinimumAverageOffset();

        return (
            $completed >= $comptencyEvidenceRequirements &&
            (
                $logged === 0 ||
                $average >= ($this->Level + $minimumOffset)
            )
        );
    }

    public function getGrowth()
    {
        if (empty($this->BaselineRating)) {
            return null;
        }

        $demonstrationData = $this->getDemonstrationData();

        $totalSkills = $this->Competency->getTotalSkills();

        $growthData = array_map(function($demonstrations, $skillId) {
            if (count($demonstrations) === 1 && empty($this->BaselineRating)) {
                return null;
            }

            $lastRating = end($demonstrations);
            if ($this->BaselineRating) {
                return $lastRating['DemonstratedLevel'] - floatval($this->BaselineRating);
            } else {
                $firstRating = reset($demonstrations);

                return $lastRating['DemonstratedLevel'] - $firstRating['DemonstratedLevel'];
            }

        }, $demonstrationData, array_keys($demonstrationData));

        array_filter($growthData);
        $totalGrowthSkills = count($growthData);

        if (count($growthData) * 2 < $totalSkills) {
            return null;
        }

        return array_sum($growthData) / $totalSkills;
    }


    public static function getCurrentForStudent(Competency $Competency, Student $Student)
    {
        return static::getByWhere(['StudentID' => $Student->ID, 'CompetencyID' => $Competency->ID], ['order' => ['Level' => 'DESC']]);
    }

    public static function isCurrentLevelComplete($Student, $Competency)
    {
        $StudentCompetency = static::getCurrentForStudent($Competency, $Student);

        if ($StudentCompetency) {
            return $StudentCompetency->isLevelComplete();
        }

        return false;
    }
}
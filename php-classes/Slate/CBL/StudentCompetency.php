<?php

namespace Slate\CBL;

use DB;

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

    public function calculateStartingRating($autoSave = true)
    {
        $validSkills = DB::allRecords(
            'SELECT ID, '.
            ' CAST( '.
                'REPLACE( '.
            '       IFNULL ( '.
            '           JSON_EXTRACT(DemonstrationsRequired, CONCAT(\'$."\', %u, \'"\')), '.
            '           JSON_EXTRACT(DemonstrationsRequired, "$.default")'.
            '       ), '.
            '   \'"\', ' .
            '   "")'.
            '   AS UNSIGNED '.
            ' ) AS DemonstrationsRequirements '.
            '  FROM `%s` '.
            ' WHERE CompetencyID = %u '.
            'HAVING DemonstrationsRequirements > 0 ',
            [
                $this->Level,
                Skill::$tableName,
                $this->Competency->ID
            ]
        );
        $validSkillIds = array_column($validSkills, 'ID');

        $ratedSkills = DB::oneValue(

            'SELECT SUM(IF(skillRatings.total > 0, 1, 0)) as totalRatings '.
            '  FROM ( '.
                    'SELECT COUNT(*) AS total '.
            		'  FROM `%1$s` ds '.
            		'  JOIN `%2$s` d '.
            		'	ON d.ID = ds.DemonstrationID '.
            		' WHERE ds.SkillID IN (%3$s) '.
            		'   AND ds.TargetLevel = %4$u '.
            		'   AND ds.DemonstratedLevel > 0 '.
            		'   AND d.StudentID = %5$u '.
            		'   AND ds.Override = false '.
            		' GROUP BY SkillID '.
            ' ) AS skillRatings ',
            [
                DemonstrationSkill::$tableName,
                Demonstration::$tableName,
                join(', ', $validSkillIds),
                $this->Level,
                $this->StudentID
            ]
        );

        // check if each skill has been rated atleast once for the current level
        if ((int)$ratedSkills !== count($validSkills)) {
            return null;
        }

        // get the first rating (by date) for each skill
        $demonstrationSkillRatings = DB::allValues(
            'skillRatings',
            'SELECT ds.DemonstratedLevel as skillRatings'.
        	'  FROM `%1$s` ds '.
    		'  JOIN `%2$s` d '.
    		'    ON d.ID = ds.DemonstrationID '.
    		' INNER JOIN ( '.
                    'SELECT MIN(demoskill.Created) as Created, SkillID '.
    		        '  FROM `%1$s` demoskill '.
    		        '  JOIN `%2$s` demo '.
    		        '    ON demo.ID = demoskill.DemonstrationID '.
    		        ' WHERE TargetLevel = %3$u '.
                    '   AND DemonstratedLevel > 0 '.
                    '   AND Override = false '.
                    '   AND demoskill.SkillID IN (%4$s) '.
                    '   AND demo.StudentID = %5$u '.
                    ' GROUP BY SkillID '.
    		'  ) ds2 '.
    		'    ON ds2.SkillID = ds.SkillID '.
    		'   AND ds2.Created = ds.Created '.
    		' WHERE ds.SkillID IN (%4$s) '.
    		'   AND ds.TargetLevel = %3$u '.
    		'   AND ds.DemonstratedLevel > 0 '.
    		'   AND d.StudentID = %5$u '.
    		'   AND ds.Override = false ',
            [
                DemonstrationSkill::$tableName,
                Demonstration::$tableName,
                $this->Level,
                join(', ', $validSkillIds),
                $this->StudentID
            ]
        );

        $this->BaselineRating = array_sum($demonstrationSkillRatings) / count($validSkills);

        if ($autoSave === true) {
            $this->save();
        }
    }

    public static function isCurrentLevelComplete($Student, $Competency)
    {
        $completion = $Competency->getCompletionForStudent($Student);

        return (
                $completion['demonstrationsComplete'] >= $Competency->getTotalDemonstrationsRequired($completion['currentLevel']) &&
                (
                    $completion['demonstrationsLogged'] == 0 || // if demonstrationsComplete is full but none are logged, the student has fulfilled all their demonstrations via overrides and the average is irrelevant
                    $completion['demonstrationsAverage'] >= ($completion['currentLevel'] + $Competency->getMinimumAverageOffset())
                )
        );
    }
}
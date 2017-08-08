<?php

namespace Slate\CBL;

use Slate\People\Student;

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
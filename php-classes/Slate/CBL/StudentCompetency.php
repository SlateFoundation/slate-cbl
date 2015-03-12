<?php

namespace Slate\CBL;

use Slate\People\Student;

class StudentCompetency extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_student_competencies';
    public static $singularNoun = 'student competency';
    public static $pluralNoun = 'student competencies';
    public static $collectionRoute = '/cbl/student-competencies';

    public static $fields = [
        'StudentID' => [
            'type' => 'uint',
            'index' => true
        ],
        'CompetencyID' => [
            'type' => 'uint',
            'index' => true
        ],
        'Status' => [
            'type' => 'enum'
            ,'values' => ['enrolled', 'completed']
            ,'default' => 'enrolled'
        ],
        ['Level' => 'uint']
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
            'fields' => ['StudentID', 'CompetencyID'],
            'unique' => true
        ]
    ];
}
<?php

namespace Slate\CBL;

use Slate\People\Student;

class StandardOverride extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_standard_overrides';
    public static $singularNoun = 'standard override';
    public static $pluralNoun = 'standard overrides';
    public static $collectionRoute = '/cbl/standard-overrides';

    public static $fields = [
        'StudentID' => [
            'type' => 'uint',
            'index' => true
        ],
        'StandardID' => [
            'type' => 'uint',
            'index' => true
        ],
        'Comments' => [
            'type' => 'clob'
        ]
    ];

    public static $relationships = [
        'Student' => [
            'type' => 'one-one',
            'class' => Student::class
        ],
        'Standard' => [
            'type' => 'one-one',
            'class' => Skill::class /* TODO: change this to standard when refactored */
        ]
    ];

    public static $validators = [
        'Student' => 'require-relationship',
        'Standard' => 'require-relationship'
    ];

    public static $indexes = [
        'StandardOverride' => [
            'fields' => ['StudentID', 'StandardID'],
            'unique' => true
        ]
    ];
}
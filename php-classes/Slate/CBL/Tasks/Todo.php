<?php

namespace Slate\CBL\Tasks;

use Emergence\People\Person;
use Slate\Courses\Section;

class Todo extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_todos';
    public static $singularNoun = 'todo';
    public static $pluralNoun = 'todos';

    public static $fields = [
        'StudentID' => [
            'type' => 'uint',
            'index' => true
        ],
        'SectionID' => [
            'type' => 'uint',
            'default' => null,
            'index' => true
        ],
        'Description' => [
            'type' => 'string',
            'default' => null
        ],
        'DueDate' => [
            'type' => 'timestamp',
            'default' => null
        ],
        'Completed' => [
            'type' => 'boolean',
            'default' => false
        ],
        'Cleared' => [
            'type' => 'boolean',
            'default' => false
        ]
    ];

    public static $relationships = [
        'Student' => [
            'type' => 'one-one',
            'local' => 'StudentID',
            'class' => Person::class
        ],
        'Section' => [
            'type' => 'one-one',
            'local' => 'SectionID',
            'class' => Section::class
        ]
    ];

    public static $dynamicFields = [
        'Student',
        'Section'
    ];

    public static $validators = [
        'Student' => 'require-relationship'
    ];
}

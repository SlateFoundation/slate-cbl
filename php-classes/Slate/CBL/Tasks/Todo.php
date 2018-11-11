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
        'StudentID' => 'uint',
        'SectionID' => [
            'type' => 'uint',
            'notnull' => false
        ],
        'Description' => [
            'type' => 'string',
            'notnull' => false
        ],
        'DueDate' => [
            'type' => 'timestamp',
            'notnull' => false
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

    public static $dynamicFields = array(
        'Student',
        'Section'
    );

    public static $validators = [
        'Student' => 'require-relationship'
    ];
}

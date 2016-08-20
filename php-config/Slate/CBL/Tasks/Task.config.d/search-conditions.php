<?php

namespace Slate\CBL\Tasks;

use \Emergence\People\Person;

$personTableAlias = Person::getTableAlias();

$searchConditions = [
    'Title' => [
        'qualifiers' => ['any', 'title'],
        'points' => 2,
        'sql' => 'Title LIKE "%%%s%%"'
    ],
    'Created' => [
        'qualifiers' => ['created'],
        'points' => 1,
        'sql' => 'CAST(Created AS Date) = "%s"'
    ],
    'ParentTaskTitle' => [
        'qualifiers' => ['parenttasktitle', 'parenttask'],
        'points' => 1,
        'join' => [
            'className' => Task::class,
            'localField' => 'ParentTaskID',
            'foreignField' => 'ID',
            'aliasName' => 'ParentTask'
        ],
        'sql' => 'ParentTask.Title LIKE "%%%s%%"'
    ],
    'Creator' => [
        'qualifiers' => ['creatorfullname', 'creator'],
        'points' => 1,
        'join' => [
            'className' => Person::class,
            'localField' => 'CreatorID',
            'foreignField' => 'ID',
            'aliasName' => $personTableAlias
        ],
        'sql' => 'CONCAT('.$personTableAlias.'.FirstName, " ", '.$personTableAlias.'.LastName) LIKE "%%%s%%"'
    ]
];

Task::$searchConditions = array_merge(Task::$searchConditions, $searchConditions);
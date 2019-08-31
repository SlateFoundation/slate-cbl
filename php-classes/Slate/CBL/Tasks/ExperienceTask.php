<?php

namespace Slate\CBL\Tasks;

class ExperienceTask extends Task
{
    public static $fields = [
        'ExperienceType' => [
            'type' => 'string',
            'values' => [],
            'default' => null
        ]
    ];

    public static $validators = [
        'ExperienceType' => [
            'required' => false
        ]
    ];

    public static $searchConditions = [
        'ExperienceType' => [
            'qualifiers' => ['experiencetype', 'experience'],
            'points' => 1,
            'sql' => 'ExperienceType LIKE "%%%s%%"'
        ]
    ];
}

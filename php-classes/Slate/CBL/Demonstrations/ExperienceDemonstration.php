<?php

namespace Slate\CBL\Demonstrations;


class ExperienceDemonstration extends Demonstration
{
    public static $fields = [
        'ExperienceType' => [
            'type' => 'string',
            'values' => [],
            'default' => null
        ],
        'Context' => [
            'type' => 'string',
            'values' => [],
            'default' => null
        ],
        'PerformanceType' => [
            'type' => 'string',
            'values' => [],
            'default' => null
        ],
    ];

    public static $validators = [
        'ExperienceType' => [
            'required' => true
        ],
        'Context' => [
            'required' => true
        ],
        'PerformanceType' => [
            'required' => true
        ]
    ];
}
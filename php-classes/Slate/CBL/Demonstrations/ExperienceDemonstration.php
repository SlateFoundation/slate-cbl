<?php

namespace Slate\CBL\Demonstrations;


class ExperienceDemonstration extends Demonstration
{
    public static $fields = [
        'ExperienceType' => [
            'values' => ['Core Studio', 'Choice Studio', 'Workshop', 'Health and Wellness', 'PE/Fitness', 'Online Courseware', 'Situated Learning', 'Work-based Learning', 'Advisory']
        ],
        'Context' => [
            'values' => ['Journalism', 'Mythbusters', 'Personal Finance', 'Math Workshop', 'Literacy Workshop', 'Culinary Arts', 'Entrepreneurship', 'Performing Arts', 'Help Desk']
        ],
        'PerformanceType' => [
            'values' => ['Position paper', 'Lab report', 'Media presentation', 'Argumentative essay', 'Speech']
        ]
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
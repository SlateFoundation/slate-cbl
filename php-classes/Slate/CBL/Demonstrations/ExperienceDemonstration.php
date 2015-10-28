<?php

namespace Slate\CBL\Demonstrations;


class ExperienceDemonstration extends Demonstration
{
    public static $experienceTypeOptions = ['Core Studio', 'Choice Studio', 'Workshop', 'Health and Wellness', 'PE/Fitness', 'Online Courseware', 'Situated Learning', 'Work-based Learning', 'Advisory'];
    public static $contextOptions = ['Journalism', 'Mythbusters', 'Personal Finance', 'Math Workshop', 'Literacy Workshop', 'Culinary Arts', 'Entrepreneurship', 'Performing Arts', 'Help Desk'];
    public static $performanceTypeOptions = ['Position paper', 'Lab report', 'Media presentation', 'Argumentative essay', 'Speech'];

    public static $fields = [
        'ExperienceType',
        'Context',
        'PerformanceType'
    ];

    public static $validators = [
        'ExperienceType',
        'Context',
        'PerformanceType'
    ];
}
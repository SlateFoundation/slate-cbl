<?php

namespace Slate\CBL\Tasks;

class ExperienceTask extends Task
{
    public static $experienceTypeOptions = ['Core Studio', 'Choice Studio', 'Workshop', 'Health and Wellness', 'PE/Fitness', 'Online Courseware', 'Situated Learning', 'Work-based Learning', 'Advisory'];
    
    public static $fields = [
        'ExperienceType' => [
            'type' => 'enum',
            'default' => null
        ]
    ];
    
    public static $validators = [
#        'ExperienceType' => [ // add to config file
#            'validator' =>     
#        ]    
    ];
    
    public static $searchConditions = [
        'ExperienceType' => [
            'qualifiers' => ['experiencetype', 'experience'],
            'points' => 1,
            'sql' => 'ExperienceType LIKE "%%%s%%"'
        ]    
    ];
}
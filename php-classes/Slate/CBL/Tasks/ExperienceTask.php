<?php

namespace Slate\CBL\Tasks;

class ExperienceTask extends Task
{
    public static $experienceTypeOptions = ['Studio', 'Flex Time', 'Internship'];
    
    public static $fields = [
        'ExperienceType' => [
            'type' => 'string',
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
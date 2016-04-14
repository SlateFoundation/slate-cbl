<?php

namespace Slate\CBL\Tasks;

class ExperienceTask extends Task
{
    public static $experienceTypeOptions = ['Core Studio', 'Choice Studio', 'Workshop', 'Health and Wellness', 'PE/Fitness', 'Online Courseware', 'Situated Learning', 'Work-based Learning', 'Advisory'];
    
    public static $fields = [
        'ExperienceType'    
    ];
    
    public static $validators = [
        'ExperienceType'    
    ];
}
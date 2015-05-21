<?php

namespace Slate\CBL;

use Slate\People\Student;

/**
 * Tracks the demonstration of one skill at one level
 */

class Demonstration extends \VersionedRecord
{
    public static $experienceTypeOptions = ['Core Studio', 'Choice Studio', 'Workshop', 'Health and Wellness', 'PE/Fitness', 'Online Courseware', 'Situated Learning', 'Work-based Learning', 'Advisory'];
    public static $contextOptions = ['Journalism', 'Mythbusters', 'Personal Finance', 'Math Workshop', 'Literacy Workshop', 'Culinary Arts', 'Entrepreneurship', 'Performing Arts', 'Help Desk'];
    public static $performanceTypeOptions = ['Position paper', 'Lab report', 'Media presentation', 'Argumentative essay', 'Speech'];
    
    // VersionedRecord configuration
    public static $historyTable = 'history_demonstrations';

    // ActiveRecord configuration
    public static $tableName = 'cbl_demonstrations';
    public static $singularNoun = 'demonstration';
    public static $pluralNoun = 'demonstrations';
    public static $collectionRoute = '/cbl/demonstrations';
    public static $useCache = true;

    public static $fields = [
        'StudentID' => [
            'type' => 'uint'
            ,'index' => true
        ]
        ,'Demonstrated' => 'timestamp'
        ,'ExperienceType'
        ,'Context'
        ,'PerformanceType'
        ,'ArtifactURL' => [
            'notnull' => false
        ]
        ,'Comments' => [
            'type' => 'clob',
            'notnull' => false
        ]
    ];

    public static $relationships = [
        'Student' => [
            'type' => 'one-one'
            ,'class' => Student::class
        ],
        'Skills' => [
            'type' => 'one-many'
            ,'class' => DemonstrationSkill::class
            ,'foreign' => 'DemonstrationID'
        ]
    ];
    
    public static $validators = [
        'StudentID' => [
            'validator' => 'number'
            ,'min' => 1
        ]
        ,'ExperienceType'
        ,'Context'
        ,'PerformanceType'
    ];
    
    public static $dynamicFields = [
        'Student',
        'competencyCompletions' => ['method' => 'getCompetencyCompletions'],
        'Skills'
    ];

#    public static function getAllBySkill(Skill $Skill)
#    {
#        return static::getAllByField('SkillID', $Skill->ID, ['order' => ['ID' => 'ASC']]);
#    }
    
    public function save($deep = true)
    {
        if (!$this->Demonstrated) {
            $this->Demonstrated = time();
        }
        
        return parent::save($deep);
    }
    
    public function destroy()
    {
        foreach ($this->Skills AS $Skill) {
            $Skill->destroy();
        }

        return parent::destroy();
    }

    /**
     * Returns current completion state of all competencies affected by this demonstration
     */
    public function getCompetencyCompletions()
    {
        // use cached $this->Skills array to include skills that may have been destroyed in this session
        $competencies = Competency::getAllByQuery(
            'SELECT DISTINCT Competency.*'
            .' FROM `%s` Skill'
            .' JOIN `%s` Competency ON Competency.ID = Skill.CompetencyID'
            .' WHERE Skill.ID IN (%s)',
            [
                Skill::$tableName,
                Competency::$tableName,
                implode(',', array_map(function($DemonstrationSkill) {
                    return $DemonstrationSkill->SkillID;
                }, $this->Skills))
            ]
        );

        $completions = [];
        foreach ($competencies AS $Competency) {
            $completion = $Competency->getCompletionForStudent($this->Student);
            $completion['StudentID'] = $this->StudentID;
            $completion['CompetencyID'] = $Competency->ID;
            $completions[] = $completion;
        }
        
        return $completions;
    }
}

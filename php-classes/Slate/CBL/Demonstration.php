<?php

namespace Slate\CBL;

use Slate\People\Student;

/**
 * Tracks the demonstration of one skill at one level
 *
 * TODO:
 * - Create a complementary class DemonstrationSkill that moves the level out of the
 * Demonstration record and enables multiple skills+levels to be logged per demonstration
 *
 * QUESTIONS:
 * - What is the maximum list of Levels the CBL system should support? Should L13 exist?
 */

class Demonstration extends \VersionedRecord
{
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
        ,'Demonstrated' => 'date'
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

    /**
     * Returns current completion state of all competencies affected by this demonstration
     */
    public function getCompetencyCompletions()
    {
        $competencies = Competency::getAllByQuery(
            'SELECT DISTINCT Competency.*'
            .' FROM `%s` DemonstrationSkill'
            .' JOIN `%s` Skill ON Skill.ID = DemonstrationSkill.SkillID'
            .' JOIN `%s` Competency ON Competency.ID = Skill.CompetencyID'
            .' WHERE DemonstrationSkill.DemonstrationID = %u',
            [
                DemonstrationSkill::$tableName,
                Skill::$tableName,
                Competency::$tableName,
                $this->ID
            ]
        );

        $completions = [];
        foreach ($competencies AS $Competency) {
            $completion = $Competency->getCompletionForStudent($this->Student);
            $completion['CompetencyID'] = $Competency->ID;
            $completions[] = $completion;
        }
        
        return $completions;
    }
}
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
        'completion' => ['method' => 'getCompletion'],
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
     * Returns current completion state of all skills and competencies affected by this demonstration
     */
    public function getCompletion()
    {
        $competencies = [];
        $skills = [];
        
        $touchedSkillIds = \DB::allValues(
            'SkillID'
            ,'SELECT SkillID FROM `%s` WHERE DemonstrationID = %u'
            ,[
                DemonstrationSkill::$tableName
                ,$this->ID
            ]
        );

        // TODO: only count demonstrations of a necessary level
        $skillCompletions = \DB::table(
            'SkillID'
            ,'SELECT Skill.CompetencyID, Skill.ID AS SkillID, Skill.DemonstrationsNeeded AS needed, LEAST(Skill.DemonstrationsNeeded, COUNT(StudentDemonstrationSkill.ID)) AS complete'
            .' FROM ('
            .'   SELECT DISTINCT Skill.CompetencyID AS ID'
            .'   FROM `%s` Skill'
            .'   WHERE ID IN (%s)'
            .' ) TouchedCompetency'
            .' JOIN `%s` Skill ON Skill.CompetencyID = TouchedCompetency.ID'
            .' LEFT JOIN ('
            .'   SELECT DemonstrationSkill.ID, DemonstrationSkill.SkillID'
            .'    FROM `%s` DemonstrationSkill'
            .'    JOIN (SELECT ID FROM `%s` WHERE StudentID = %u) Demonstration'
            .'     ON Demonstration.ID = DemonstrationSkill.DemonstrationID'
            .' ) StudentDemonstrationSkill ON StudentDemonstrationSkill.SkillID = Skill.ID'
            .' GROUP BY Skill.ID'
            ,[
                Skill::$tableName
                ,implode(',', $touchedSkillIds)
                ,Skill::$tableName
                ,DemonstrationSkill::$tableName
                ,Demonstration::$tableName
                ,$this->StudentID
            ]
        );

        foreach ($skillCompletions AS &$skillCompletion) {
            if (in_array($skillCompletion['SkillID'], $touchedSkillIds)) {
                $skills[] = [
                    'ID' => (int)$skillCompletion['SkillID']
                    ,'complete' => (int)$skillCompletion['complete']
                    ,'needed' => (int)$skillCompletion['needed']
                ];
            }
            
            $competencies[$skillCompletion['CompetencyID']]['ID'] = (int)$skillCompletion['CompetencyID'];
            $competencies[$skillCompletion['CompetencyID']]['complete'] += (int)$skillCompletion['complete'];
            $competencies[$skillCompletion['CompetencyID']]['needed'] += (int)$skillCompletion['needed'];
        }
        
        return [
            'competencies' => array_values($competencies)
            ,'skills' => $skills
        ];
    }
}
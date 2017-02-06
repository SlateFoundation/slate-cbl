<?php

namespace Slate\CBL\Demonstrations;

use Slate\People\Student;
use Slate\CBL\Competency;
use Slate\CBL\Skill;
use Slate\CBL\Tasks\StudentTask;

class Demonstration extends \VersionedRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_demonstrations';
    public static $singularNoun = 'demonstration';
    public static $pluralNoun = 'demonstrations';
    public static $collectionRoute = '/cbl/demonstrations';
    public static $useCache = true;
    public static $subClasses = [
        __CLASS__,
        ExperienceDemonstration::class,
        OverrideDemonstration::class
    ];

    public static $fields = [
        'StudentID' => [
            'type' => 'uint'
            ,'index' => true
        ]
        ,'Demonstrated' => [
            'type' => 'timestamp'
            ,'default' => null
        ]
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
        if ($StudentTask = StudentTask::getByWhere(['DemonstrationID' => $this->ID])) {
            $templateSkills = array_map(function($Skill) {
                return $Skill->ID;
            }, $StudentTask->AllSkills);
        } else {
            $templateSkills = [];
        }

        if (count($this->Skills) || count($templateSkills)) {
            $competencies = Competency::getAllByQuery(
                'SELECT DISTINCT Competency.*'
                .' FROM `%s` Skill'
                .' JOIN `%s` Competency ON Competency.ID = Skill.CompetencyID'
                .' WHERE Skill.ID IN (%s)',
                [
                    Skill::$tableName,
                    Competency::$tableName,
                    implode(',', array_merge(array_map(function($DemonstrationSkill) {
                        return $DemonstrationSkill->SkillID;
                    }, $this->Skills), $templateSkills))
                ]
            );
        } else {
            $competencies = [];
        }

        $completions = [];
        foreach ($competencies AS $Competency) {
            $completion = $Competency->getCompletionForStudent($this->Student);
            $completion['StudentID'] = $this->StudentID;
            $completion['CompetencyID'] = $Competency->ID;
            $completions[] = $completion;
        }
        
        return $completions;
    }
    
    /**
     * Returns current completion state of all skills affected by this demonstration
     */
    public function getSkillCompletions()
    {
        if (count($this->Skills)) {
            $skills = Skill::getAllByWhere([
                'ID' => [
                    'operator' => 'IN',
                    'values' => array_map(function($DemonstrationSkill) {
                        return $DemonstrationSkill->SkillID;
                    })
                ]    
            ]);
         } else {
             $skills = [];
         }
         
        $completions = [];
        foreach ($skills as $skill) {
            $completions[] = array_merge($skill->getCompletionForStudent($this->Student), [
                'StudentID' => $this->StudentID
            ]);
        }
        
        return $completions;
     }
}

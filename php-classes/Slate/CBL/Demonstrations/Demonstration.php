<?php

namespace Slate\CBL\Demonstrations;

use Slate\CBL\Competency;
use Slate\CBL\StudentCompetency;
use Slate\CBL\Skill;

use Slate\People\Student;

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
        'DemonstrationSkills' => [
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
        'Competencies' => ['getter' => 'getCompetencies'],
        'StudentCompetencies' => ['getter' => 'getStudentCompetencies'],
        'DemonstrationSkills'
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
        foreach ($this->DemonstrationSkills AS $Skill) {
            $Skill->destroy();
        }

        return parent::destroy();
    }

    /**
     * Returns list of competencies associated with skills rated in this demonstration
     */
    private $competencies;
    public function getCompetencies()
    {
        if ($this->competencies === null) {
            $this->competencies = [];

            // use cached $this->DemonstrationSkills array to include skills that may have been destroyed in this session
            foreach ($this->DemonstrationSkills as $DemonstrationSkill) {
                $competencyId = $DemonstrationSkill->Skill->CompetencyID;

                if (!isset($this->competencies[$competencyId])) {
                    $this->competencies[$competencyId] = $DemonstrationSkill->Skill->Competency;
                }
            }

            // strip keys
            $this->competencies = array_values($this->competencies);
        }

        return $this->competencies;
    }

    /**
     * Returns list of StudentCompetency records affected by this demonstration
     */
    private $studentCompetencies;
    public function getStudentCompetencies()
    {
        if ($this->studentCompetencies === null) {
            $this->studentCompetencies = [];

            // use cached $this->DemonstrationSkills array to include skills that may have been destroyed in this session
            $studentCompetenciesByLevel = [];
            foreach ($this->DemonstrationSkills as $DemonstrationSkill) {
                $competencyId = $DemonstrationSkill->Skill->CompetencyID;

                if (
                    !isset($studentCompetenciesByLevel[$competencyId])
                    || !isset($studentCompetenciesByLevel[$competencyId][$DemonstrationSkill->TargetLevel])
                ) {
                    $StudentCompetency = StudentCompetency::getByWhere([
                        'StudentID' => $this->StudentID,
                        'CompetencyID' => $competencyId,
                        'Level' => $DemonstrationSkill->TargetLevel
                    ]);

                    if ($StudentCompetency) {
                        $studentCompetenciesByLevel[$competencyId][$DemonstrationSkill->TargetLevel] = $StudentCompetency;
                        $this->studentCompetencies[] = $StudentCompetency;
                    }
                }
            }
        }

        return $this->studentCompetencies;
    }
}

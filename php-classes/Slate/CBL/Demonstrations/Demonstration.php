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
            'type' => 'uint',
            'index' => true
        ],
        'Demonstrated' => [
            'type' => 'timestamp',
            'default' => null
        ],
        'ArtifactURL' => [
            'notnull' => false
        ],
        'Comments' => [
            'type' => 'clob',
            'notnull' => false
        ]
    ];

    public static $relationships = [
        'Student' => [
            'type' => 'one-one',
            'class' => Student::class
        ],
        'DemonstrationSkills' => [
            'type' => 'one-many',
            'class' => DemonstrationSkill::class,
            'foreign' => 'DemonstrationID',
            'prune' => 'delete'
        ]
    ];

    public static $validators = [
        'Student' => 'require-relationship'
    ];

    public static $dynamicFields = [
        'Student',
        'Competencies' => ['getter' => 'getCompetencies'],
        'StudentCompetencies' => ['getter' => 'getStudentCompetencies'],
        'AffectedStudentCompetencies' => ['getter' => 'getAffectedStudentCompetencies'],
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
        foreach ($this->DemonstrationSkills as $DemonstrationSkill) {
            $DemonstrationSkill->destroy();
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
     * Returns list of StudentCompetency records affected by this demonstration in its present state
     */
    public function getStudentCompetencies()
    {
        $studentCompetencies = [];

        foreach ($this->captureAffectedStudentCompetencies(true) as $levelStudentCompetencies) {
            foreach ($levelStudentCompetencies as $StudentCompetency) {
                $studentCompetencies[] = $StudentCompetency;
            }
        }

        return $studentCompetencies;
    }

    /**
     * Returns list of StudentCompetency records affected by this demonstration in its present state
     */
    public function getAffectedStudentCompetencies()
    {
        $studentCompetencies = [];

        foreach ($this->captureAffectedStudentCompetencies() as $levelStudentCompetencies) {
            foreach ($levelStudentCompetencies as $StudentCompetency) {
                $studentCompetencies[] = $StudentCompetency;
            }
        }

        return $studentCompetencies;
    }

    /**
     * Enable recording affected student competencies throughout
     */
    private $recordAffectedStudentCompetencies = false;
    public function recordAffectedStudentCompetencies($enable = true)
    {
        $this->recordAffectedStudentCompetencies = $enable;

        if ($enable) {
            $this->captureAffectedStudentCompetencies();
        }
    }

    private $affectedStudentCompetenciesByLevel = [];
    public function captureAffectedStudentCompetencies($currentOnly = false)
    {
        if ($this->recordAffectedStudentCompetencies && !$currentOnly) {
            $studentCompetenciesByLevel = &$this->affectedStudentCompetenciesByLevel;
        } else {
            $studentCompetenciesByLevel = [];
        }

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
                }
            }
        }

        return $studentCompetenciesByLevel;
    }
}

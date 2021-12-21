<?php

namespace Slate\CBL\Demonstrations;


use Exception;

use Slate\CBL\Competency;
use Slate\CBL\StudentCompetency;
use Slate\CBL\Skill;
use Slate\CBL\Tasks\StudentTask;

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
        ],
        'StudentTask' => [
          'type' => 'one-one',
          'class' => StudentTask::class,
          'local' => 'ID',
          'foreign' => 'DemonstrationID'
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
        'DemonstrationSkills',
        'StudentTask'
    ];

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

    /**
     * Differentially apply a complete array of new DemonstrationSkills data
     */
    public function applySkillsData(array $skillsData)
    {
        // index existing DemonstrationSkill records by SkillID
        $existingSkills = [];

        foreach ($this->DemonstrationSkills as $DemonstrationSkill) {
            $existingSkills[$DemonstrationSkill->SkillID] = $DemonstrationSkill;
        }


        // cache current competency levels so all skills saved in this request target the same level, even if it advances during
        $competencyLevels = [];


        // create new and update existing skills
        $skills = [];
        foreach ($skillsData as $skillData) {
            // skip if DemonstratedLevel and Override is unset or null -- these will be deleted
            if (!isset($skillData['DemonstratedLevel']) && empty($skillData['Override'])) {
                continue;
            }

            if (empty($skillData['SkillID'])) {
                throw new Exception('demonstration skill requires SkillID be set');
            }

            $override = !empty($skillData['Override']);
            $rating = $override ? null : $skillData['DemonstratedLevel'];

            if ($DemonstrationSkill = $existingSkills[$skillData['SkillID']]) {
                if (!empty($skillData['TargetLevel'])) {
                    $DemonstrationSkill->TargetLevel = $skillData['TargetLevel'];
                }

                $DemonstrationSkill->DemonstratedLevel = $rating;
                $DemonstrationSkill->Override = $override;
            } else {
                $DemonstrationSkill = DemonstrationSkill::create([
                    'Demonstration' => $this,
                    'SkillID' => $skillData['SkillID'],
                    'DemonstratedLevel' => $rating,
                    'Override' => $override
                ]);

                if (!empty($skillData['TargetLevel'])) {
                    $DemonstrationSkill->TargetLevel = $skillData['TargetLevel'];
                } elseif (array_key_exists($DemonstrationSkill->Skill->CompetencyID, $competencyLevels)) {
                    $DemonstrationSkill->TargetLevel = $competencyLevels[$DemonstrationSkill->Skill->CompetencyID];
                } else {
                    $StudentCompetency = StudentCompetency::getCurrentForStudent($this->Student, $DemonstrationSkill->Skill->Competency);
                    $DemonstrationSkill->TargetLevel = $competencyLevels[$DemonstrationSkill->Skill->CompetencyID] = $StudentCompetency ? $StudentCompetency->Level : null;
                }

                // append to existing map to prevent issues if data contains multiple entries for same SkillID
                $existingSkills[$skillData['SkillID']] = $DemonstrationSkill;
            }

            $skills[] = $DemonstrationSkill;
        }


        // write new list to relationship
        $this->DemonstrationSkills = $skills;
    }
}

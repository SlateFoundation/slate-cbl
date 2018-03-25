<?php

namespace Slate\CBL\Demonstrations;


use Exception;

use ActiveRecord;
use DB;
use SpreadsheetWriter;
use TableNotFoundException;

use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;
use Slate\People\Student;

class DemonstrationsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = Demonstration::class;
    public static $browseOrder = ['ID' => 'ASC'];

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        if (!empty($_GET['skill']) && ctype_digit($_GET['skill'])) {
            // TODO: implement this as a lower-level override to the generated browse query so it can be a FROM subquery
            try {
                $demonstrations = DB::allValues(
                    'DemonstrationID',
                    'SELECT DemonstrationID FROM `%s` WHERE SkillID = %u',
                    [
                        DemonstrationSkill::$tableName,
                        $_GET['skill']
                    ]
                );
            } catch (TableNotFoundException $e) {
                $demonstrations = [];
            }

            $conditions[] = 'ID IN ('.implode($demonstrations, ',').')';
        }

        if (!empty($_GET['student']) && ctype_digit($_GET['student'])) {
            $conditions['StudentID'] = $_GET['student'];
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }

    protected static function applyRecordDelta(ActiveRecord $Demonstration, $requestData)
    {
        if (array_key_exists('DemonstrationSkills', $requestData)) {
            $demonstrationSkillsData = $requestData['DemonstrationSkills'];
            unset($requestData['DemonstrationSkills']);
        }


        parent::applyRecordDelta($Demonstration, $requestData);


        if (isset($demonstrationSkillsData)) {
            $Demonstration->recordAffectedStudentCompetencies();

            // index existing DemonstrationSkill records by SkillID
            $existingDemonstrationSkills = [];

            foreach ($Demonstration->DemonstrationSkills as $DemonstrationSkill) {
                $existingDemonstrationSkills[$DemonstrationSkill->SkillID] = $DemonstrationSkill;
            }


            // cache current competency levels so all skills saved in this request target the same level, even if it advances during
            $competencyLevels = [];


            // create new and update existing skills
            $demonstrationSkills = [];
            foreach ($demonstrationSkillsData as $demonstrationSkillData) {
                // skip if DemonstratedLevel and Override is unset or null -- these will be deleted
                if (!isset($demonstrationSkillData['DemonstratedLevel']) && !isset($demonstrationSkillData['Override'])) {
                    continue;
                }

                if (!isset($demonstrationSkillData['SkillID'])) {
                    throw new Exception('demonstration skill requires SkillID be set');
                }

                $override = !empty($demonstrationSkillData['Override']);
                $rating = $override ? null : $demonstrationSkillData['DemonstratedLevel'];

                if ($DemonstrationSkill = $existingDemonstrationSkills[$demonstrationSkillData['SkillID']]) {
                    if (!empty($demonstrationSkillData['TargetLevel'])) {
                        $DemonstrationSkill->TargetLevel = $demonstrationSkillData['TargetLevel'];
                    }

                    $DemonstrationSkill->DemonstratedLevel = $rating;
                    $DemonstrationSkill->Override = $override;
                } else {
                    $DemonstrationSkill = DemonstrationSkill::create([
                        'SkillID' => $demonstrationSkillData['SkillID'],
                        'DemonstratedLevel' => $rating,
                        'Override' => $override
                    ]);

                    if (!empty($demonstrationSkillData['TargetLevel'])) {
                        $DemonstrationSkill->TargetLevel = $demonstrationSkillData['TargetLevel'];
                    } elseif (array_key_exists($DemonstrationSkill->Skill->CompetencyID, $competencyLevels)) {
                        $DemonstrationSkill->TargetLevel = $competencyLevels[$DemonstrationSkill->Skill->CompetencyID];
                    } else {
                        $StudentCompetency = StudentCompetency::getCurrentForStudent($Demonstration->Student, $DemonstrationSkill->Skill->Competency);
                        $DemonstrationSkill->TargetLevel = $competencyLevels[$DemonstrationSkill->Skill->CompetencyID] = $StudentCompetency ? $StudentCompetency->Level : null;
                    }

                    // append to existing map to prevent issues if data contains multiple entries for same SkillID
                    $existingDemonstrationSkills[$demonstrationSkillData['SkillID']] = $DemonstrationSkill;
                }

                $demonstrationSkills[] = $DemonstrationSkill;
            }


            // write new list to relationship
            $Demonstration->DemonstrationSkills = $demonstrationSkills;
        }
    }

    protected static function onBeforeRecordDestroyed(ActiveRecord $Demonstration)
    {
        $Demonstration->recordAffectedStudentCompetencies();
    }
}
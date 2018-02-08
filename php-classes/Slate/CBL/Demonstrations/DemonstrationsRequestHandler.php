<?php

namespace Slate\CBL\Demonstrations;

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


    protected static function onBeforeRecordSaved(ActiveRecord $Demonstration, $requestData)
    {
        // validate skills list
        if (array_key_exists('DemonstrationSkills', $requestData)) {
            if (!is_array($requestData['DemonstrationSkills']) || !count($requestData['DemonstrationSkills'])) {
                return static::throwInvalidRequestError('At least one performance level must be logged');
            }

            foreach ($requestData['DemonstrationSkills'] AS $index => $skill) {
                if (empty($skill['SkillID']) || !is_numeric($skill['SkillID']) || $skill['SkillID'] < 1) {
                    return static::throwInvalidRequestError("Skill at index $index is missing SkillID");
                }

                if (
                    empty($skill['Override']) &&
                    (
                        !isset($skill['DemonstratedLevel']) ||
                        !is_numeric($skill['DemonstratedLevel']) ||
                        $skill['DemonstratedLevel'] < 0
                    )
                ) {
                    return static::throwInvalidRequestError("Skill at index $index is missing DemonstratedLevel");
                }
            }
        }
    }

    protected static function onRecordSaved(ActiveRecord $Demonstration, $requestData)
    {
        if (array_key_exists('DemonstrationSkills', $requestData)) {
            // get existing skill records and index by SkillID
            if (!$Demonstration->isNew) {
                try {
                    $existingSkills = DB::table(
                        'SkillID'
                        ,'SELECT ID, SkillID, DemonstratedLevel FROM `%s` WHERE DemonstrationID = %u'
                        ,[
                            DemonstrationSkill::$tableName
                            ,$Demonstration->ID
                        ]
                    );
                } catch (TableNotFoundException $e) {
                    $existingSkills = [];
                }
            } else {
                $existingSkills = [];
            }

            // save new and update existing skills
            $touchedSkillIds = [];
            $competencyLevels = []; // cache current competency levels so all skills saved in this request target the same level, even if it advances during

            foreach ($requestData['DemonstrationSkills'] AS $skill) {
                $touchedSkillIds[] = $skill['SkillID'];

                if (!array_key_exists($skill['SkillID'], $existingSkills)) {
                    $Skill = Skill::getByID($skill['SkillID']);

                    if (!empty($skill['TargetLevel'])) {
                        $targetLevel = $skill['TargetLevel'];
                    } elseif(array_key_exists($Skill->CompetencyID, $competencyLevels)) {
                        $targetLevel = $competencyLevels[$Skill->CompetencyID];
                    } else {
                        $targetLevel = $competencyLevels[$Skill->CompetencyID] = $StudentCompetency = StudentCompetency::getCurrentForStudent($Demonstration->Student, $Skill->Competency) ? $StudentCompetency->Level : null;
                    }

                    $DemoSkill = DemonstrationSkill::create([
                        'Demonstration' => $Demonstration
                        ,'Skill' => $Skill
                        ,'TargetLevel' => $targetLevel
                        ,'DemonstratedLevel' => empty($skill['DemonstratedLevel']) && !empty($skill['Override']) ? $targetLevel : $skill['DemonstratedLevel']
                        ,'Override' => !empty($skill['Override'])
                    ], true);
                } elseif ($existingSkills[$skill['SkillID']]['DemonstratedLevel'] != $skill['DemonstratedLevel']) {
                    DB::nonQuery(
                        'UPDATE `%s` SET DemonstratedLevel = "%s" WHERE ID = %u'
                        ,[
                            DemonstrationSkill::$tableName
                            ,DB::escape($skill['DemonstratedLevel'])
                            ,$existingSkills[$skill['SkillID']]['ID']
                        ]
                    );
                }
            }

            // delete any existing skills that weren't touched in this save
            $removedSkillIds = array_diff(array_keys($existingSkills), $touchedSkillIds);

            if (count($removedSkillIds)) {
                DB::nonQuery(
                    'DELETE FROM `%s` WHERE DemonstrationID = %u AND SkillID IN (%s)'
                    ,[
                        DemonstrationSkill::$tableName
                        ,$Demonstration->ID
                        ,implode(',', $removedSkillIds)
                    ]
                );
            }

            $Demonstration->clearRelatedObject('DemonstrationSkills');
        }
    }
}
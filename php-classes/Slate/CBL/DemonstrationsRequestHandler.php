<?php

namespace Slate\CBL;

use DB;
use ActiveRecord;
use SpreadsheetWriter;
use TableNotFoundException;
use Slate\People\Student;

class DemonstrationsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = Demonstration::class;
    public static $browseOrder = ['ID' => 'ASC'];


    public static function handleRecordsRequest($action = null)
    {
        switch ($action ?: $action = static::shiftPath()) {
            // TODO: move to exports folder
//            case '*export-legacy':
//                return static::handleLegacyExportRequest();
//            case '*export':
//                return static::handleExportRequest();
            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function handleBrowseRequest($options = array(), $conditions = array(), $responseID = null, $responseData = array())
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
    
    // TODO: move to teacher-dashboard or to new folder exports
    // 04/02/2015: This is how the report was originally requested and is being kept here until we know it is no longer needed
    public static function handleLegacyExportRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        // This was causing a script timeout (30 seconds), this should help speed it up
        \Site::$debug = false;
        
        $sw = new SpreadsheetWriter();

        // fetch key objects from database
        $students = Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
        $skills = Skill::getAll(['order' => 'Code']);
        $demonstrations = Demonstration::getAllByWhere('StudentID IN ('.implode(',', array_map(function($Student) {
            return $Student->ID;
        }, $students)).')', ['order' => 'ID']);


        // build and output headers list
        $headers = [
            'Demonstrated',
            'Student Name',
            'Student Number',
            'Portfolio Level',
            'Context',
            'Experience',
            'Task',
            'URL',
            'Comments'
        ];

        foreach ($skills AS $Skill) {
            $headers[] = $Skill->Code;
        }

        $sw->writeRow($headers);


        // one row for each demonstration
        foreach ($demonstrations AS $Demonstration) {
            $row = [
                date('Y-m-d', $Demonstration->Demonstrated),
                $Demonstration->Student->FullName,
                $Demonstration->Student->StudentNumber,
                9, // TODO: don't hard code
                $Demonstration->Context,
                $Demonstration->ExperienceType,
                $Demonstration->PerformanceType,
                $Demonstration->ArtifactURL,
                $Demonstration->Comments
            ];

            $demonstrationSkills = DemonstrationSkill::getAllByField('DemonstrationID', $Demonstration->ID, ['indexField' => 'SkillID']);

            foreach ($skills AS $Skill) {
                if (array_key_exists($Skill->ID, $demonstrationSkills)) {
                    $row[] = $demonstrationSkills[$Skill->ID]->Level ? $demonstrationSkills[$Skill->ID]->Level : 'M';
                } else {
                    $row[] = null;
                }
            }

            $sw->writeRow($row);
        }
    }

    // TODO: move to teacher-dashboard
    public static function handleExportRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        // This was causing a script timeout (30 seconds), this should help speed it up
        \Site::$debug = false;
        
        $sw = new SpreadsheetWriter();

        // fetch key objects from database
        $students = Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
        $skills = Skill::getAll(['indexField' => 'ID']);
        $demonstrations = Demonstration::getAllByWhere('StudentID IN ('.implode(',', array_map(function($Student) {
            return $Student->ID;
        }, $students)).')', ['order' => 'ID']);

        // build and output headers list
        $headers = [
            'Timestamp',
            'Submitted by',
            'ID',
            'Name',
            'Type of experience',
            'Context',
            'Perfromance task',
            'Artifact',
            'Competency',
            'Standard',
            'Rating',
            'Level',
            'Mapping'
        ];
        
        $sw->writeRow($headers);

        // one row for each demonstration standard
       foreach ($demonstrations AS $Demonstration) {
            $row = [
                date('Y-m-d H:i', $Demonstration->Created),
                $Demonstration->Creator->FullName,
                $Demonstration->Student->StudentNumber,
                $Demonstration->Student->FullName,
                $Demonstration->ExperienceType,
                $Demonstration->Context,
                $Demonstration->PerformanceType,
                $Demonstration->ArtifactURL
            ];
                        
            $demonstrationSkills = DemonstrationSkill::getAllByField('DemonstrationID', $Demonstration->ID);
            
            // Don't rebuild the row for each standard demonstrated, just overwrite the last set of values
            foreach ($demonstrationSkills AS $DemonstrationSkill) {
                $skill = $skills[$DemonstrationSkill->SkillID];
                
                $row[] = $skill->Competency->Code;
                $row[] = $skill->Code;
                $row[] = $DemonstrationSkill->DemonstratedLevel > 0 ?  $DemonstrationSkill->DemonstratedLevel : 'M';
                $row[] = $DemonstrationSkill->TargetLevel;
                $row[] = '';
                $sw->writeRow($row);
            }
        }
    }

    protected static function onBeforeRecordSaved(ActiveRecord $Demonstration, $requestData)
    {
        // validate skills list
        if (array_key_exists('Skills', $requestData)) {
            if (!is_array($requestData['Skills']) || !count($requestData['Skills'])) {
                return static::throwInvalidRequestError('At least one performance level must be logged');
            }

            foreach ($requestData['Skills'] AS $index => $skill) {
                if (empty($skill['SkillID']) || !is_numeric($skill['SkillID']) || $skill['SkillID'] < 1) {
                    return static::throwInvalidRequestError("Skill at index $index is missing SkillID");
                }

                if (!isset($skill['DemonstratedLevel']) || !is_numeric($skill['DemonstratedLevel']) || $skill['DemonstratedLevel'] < 0) {
                    return static::throwInvalidRequestError("Skill at index $index is missing DemonstratedLevel");
                }
            }
        }
    }

    protected static function onRecordSaved(ActiveRecord $Demonstration, $requestData)
    {
        if (array_key_exists('Skills', $requestData)) {
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

            foreach ($requestData['Skills'] AS $skill) {
                $touchedSkillIds[] = $skill['SkillID'];

                if (!array_key_exists($skill['SkillID'], $existingSkills)) {
                    $Skill = Skill::getByID($skill['SkillID']);

                    if (!empty($skill['TargetLevel'])) {
                        $targetLevel = $skill['TargetLevel'];
                    } elseif(array_key_exists($Skill->CompetencyID, $competencyLevels)) {
                        $targetLevel = $competencyLevels[$Skill->CompetencyID];
                    } else {
                        $targetLevel = $competencyLevels[$Skill->CompetencyID] = $Skill->Competency->getCurrentLevelForStudent($Demonstration->Student);
                    }
                    
                    $DemoSkill = DemonstrationSkill::create([
                        'Demonstration' => $Demonstration
                        ,'Skill' => $Skill
                        ,'TargetLevel' => $targetLevel
                        ,'DemonstratedLevel' => $skill['DemonstratedLevel']
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

            $Demonstration->clearRelatedObject('Skills');
        }
    }
}
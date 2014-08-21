<?php

namespace Slate\CBL;

use DB;
use ActiveRecord;
use TableNotFoundException;

class DemonstrationsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = 'Slate\\CBL\\Demonstration';
    public static $browseOrder = ['ID' => 'ASC'];

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

    protected static function onBeforeRecordSaved(ActiveRecord $Demonstration, $requestData)
	{
        // validate skills list
        if (array_key_exists('skills', $requestData)) {
            if (!is_array($requestData['skills']) || !count($requestData['skills'])) {
                return static::throwInvalidRequestError('At least one performance level must be logged');
            }
            
            foreach ($requestData['skills'] AS $index => $skill) {
                if (empty($skill['ID']) || !is_numeric($skill['ID']) || $skill['ID'] < 1) {
                    return static::throwInvalidRequestError("Skill at index $index is missing ID");
                }
    
                if (empty($skill['Level']) || !in_array($skill['Level'], DemonstrationSkill::$fields['Level']['values'])) {
                    return static::throwInvalidRequestError("Skill at index $index is missing Level");
                }
            }
        }
	}

	protected static function onRecordSaved(ActiveRecord $Demonstration, $requestData)
	{
        if (array_key_exists('skills', $requestData)) {
            // get existing skill records and index by SkillID
            if (!$Demonstration->isNew) {
                try {
                    $existingSkills = DB::table(
                        'SkillID'
                        ,'SELECT ID, SkillID, Level FROM `%s` WHERE DemonstrationID = %u'
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
            
            foreach ($requestData['skills'] AS $skill) {
                $touchedSkillIds[] = $skill['ID'];
                    
                if (!array_key_exists($skill['ID'], $existingSkills)) {
                    $DemoSkill = DemonstrationSkill::create([
                        'DemonstrationID' => $Demonstration->ID
                        ,'SkillID' => $skill['ID']
                        ,'Level' => $skill['Level']
                    ], true);
                } elseif ($existingSkills[$skill['ID']]['Level'] != $skill['Level']) {
                    DB::nonQuery(
                        'UPDATE `%s` SET Level = "%s" WHERE ID = %u'
                        ,[
                            DemonstrationSkill::$tableName
                            ,DB::escape($skill['Level'])
                            ,$existingSkills[$skill['ID']]['ID']
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
        }
	}
}
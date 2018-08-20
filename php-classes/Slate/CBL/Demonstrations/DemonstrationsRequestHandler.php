<?php

namespace Slate\CBL\Demonstrations;


use ActiveRecord;
use DB;
use TableNotFoundException;


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
            $Demonstration->applySkillsData($demonstrationSkillsData);
        }
    }

    protected static function onBeforeRecordDestroyed(ActiveRecord $Demonstration)
    {
        $Demonstration->recordAffectedStudentCompetencies();
    }
}

<?php

namespace Slate\CBL\Demonstrations;

use ActiveRecord;
use DB;
use TableNotFoundException;
use UserUnauthorizedException;

class DemonstrationsRequestHandler extends \Slate\CBL\RecordsRequestHandler
{
    public static $recordClass = Demonstration::class;
    public static $accountLevelAPI = 'User';
    public static $accountLevelBrowse = 'User';
    public static $accountLevelRead = 'Staff';
    public static $accountLevelComment = 'Staff';
    public static $browseOrder = ['ID' => 'ASC'];

    protected static function buildBrowseConditions(array $conditions = [], array &$filterObjects = [])
    {
        global $Session;

        $conditions = parent::buildBrowseConditions($conditions, $filterObjects);

        // prepare student or students filter
        if (!$Session->Person) {
            throw new UserUnauthorizedException();
        } elseif ($Student = static::getRequestedStudent()) {
            $studentIds = [$Student->ID];
            $filterObjects['Student'] = $Student;
        } elseif (is_array($students = static::getRequestedStudents())) {
            $studentIds = array_map(function ($Student) {
                return $Student->ID;
            }, $students);
        } elseif (!$Session->hasAccountLevel('Staff')) {
            $studentIds = [$Session->PersonID];
        } else {
            $studentIds = null;
        }


        // prepare skill or skills filter
        if ($Skill = static::getRequestedSkill()) {
            $skillIds = [$Skill->ID];
            $filterObjects['Skill'] = $Skill;
        } elseif ($skills = static::getRequestedSkills()) {
            $skillIds = array_map(function ($Skill) {
                return $Skill->ID;
            }, $skills);
        } elseif ($Competency = static::getRequestedCompetency()) {
            $skillIds = $Competency->getSkillIds();
            $filterObjects['Competency'] = $Competency;
        } elseif ($competencies = static::getRequestedCompetencies()) {
            $skillIds = [];

            foreach ($competencies as $Competency) {
                $skillIds = array_merge($skillIds, $Competency->getSkillIds());
            }

            $skillIds = array_unique($skillIds);
        } elseif ($ContentArea = static::getRequestedContentArea()) {
            $skillIds = $ContentArea->getSkillIds();
            $filterObjects['ContentArea'] = $ContentArea;
        } else {
            $skillIds = null;
        }


        // apply filters, combining efficiently
        if (is_array($studentIds)) {
            $conditions['StudentID'] = [ 'values' => $studentIds ];
        }

        if (is_array($skillIds)) {
            try {
                if (is_array($studentIds)) {
                    $demonstrationIds = DB::allValues(
                        'DemonstrationID',
                        '
                            SELECT DISTINCT DemonstrationID
                              FROM `%s` DemonstrationSkill
                              JOIN `%s` Demonstration
                                ON Demonstration.ID = DemonstrationSkill.DemonstrationID
                             WHERE DemonstrationSkill.SkillID %s
                               AND Demonstration.StudentID %s
                        ',
                        [
                            DemonstrationSkill::$tableName,
                            Demonstration::$tableName,
                            (
                                count ($skillIds)
                                    ? 'IN ('.implode(',', $skillIds).')'
                                    : '= FALSE'
                            ),
                            (
                                count ($studentIds)
                                    ? 'IN ('.implode(',', $studentIds).')'
                                    : '= FALSE'
                            )
                        ]
                    );
                } else {
                    $demonstrationIds = DB::allValues(
                        'DemonstrationID',
                        '
                            SELECT DISTINCT DemonstrationID
                              FROM `%s`
                             WHERE SkillID %s
                        ',
                        [
                            DemonstrationSkill::$tableName,
                            (
                                count ($skillIds)
                                    ? 'IN ('.implode(',', $skillIds).')'
                                    : '= FALSE'
                            )
                        ]
                    );
                }
            } catch (TableNotFoundException $e) {
                $demonstrationIds = [];
            }

            if (count($demonstrationIds)) {
                $conditions[] = 'ID IN ('.implode(',', $demonstrationIds).')';
            } else {
                $conditions[] = 'ID = FALSE';
            }
        }


        return $conditions;
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

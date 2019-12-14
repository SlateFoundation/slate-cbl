<?php

namespace Slate\CBL\Demonstrations;

use DB;
use Emergence\People\PeopleRequestHandler;
use Slate\CBL\SkillsRequestHandler;

class DemonstrationSkillsRequestHandler extends \Slate\CBL\RecordsRequestHandler
{
    public static $recordClass = DemonstrationSkill::class;
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
        if (is_array($skillIds)) {
            $conditions['SkillID'] = [ 'values' => $skillIds ];
        }

        if (is_array($studentIds)) {
            try {
                $demonstrationIds = DB::allValues(
                    'ID',
                    'SELECT ID FROM `%s` WHERE StudentID %s',
                    [
                        Demonstration::$tableName,
                        (
                            count ($studentIds)
                                ? 'IN ('.implode(',', $studentIds).')'
                                : '= FALSE'
                        )
                    ]
                );
            } catch (TableNotFoundException $e) {
                $demonstrationIds = [];
            }

            if (count($demonstrationIds)) {
                $conditions[] = 'DemonstrationID IN ('.implode(',', $demonstrationIds).')';
            } else {
                $conditions[] = 'ID = FALSE';
            }
        }


        return $conditions;
    }
}

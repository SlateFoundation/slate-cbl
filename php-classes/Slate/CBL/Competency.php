<?php

namespace Slate\CBL;

use DB, Cache;
use Slate\People\Student;

class Competency extends \VersionedRecord
{
    // VersionedRecord configuration
    public static $historyTable = 'history_cbl_competencies';

    // ActiveRecord configuration
    public static $tableName = 'cbl_competencies';
    public static $singularNoun = 'competency';
    public static $pluralNoun = 'competencies';
    public static $collectionRoute = '/cbl/competencies';
    public static $useCache = true;

    public static $fields = [
        'ContentAreaID' => [
            'type' => 'uint'
            ,'index' => true
        ]
        ,'Code' => [
            'unique' => true
        ]
        ,'Descriptor'
        ,'Statement' => 'clob'
    ];

    public static $relationships = [
        'ContentArea' => [
            'type' => 'one-one'
            ,'class' => ContentArea::class
        ]
        ,'Skills' => [
            'type' => 'one-many'
            ,'class' => Skill::class
            ,'foreign' => 'CompetencyID'
        ]
    ];

    public static $validators = [
        'ContentAreaID' => [
            'validator' => 'number'
            ,'min' => 1
        ]
        ,'Code' => [
            'validator' => 'handle'
            ,'errorMessage' => 'Code can only contain letters, numbers, hyphens, underscores, and periods'
        ]
        ,'Descriptor' => [
            'errorMessage' => 'A descriptor is required'
        ]
    ];

    public static $dynamicFields = [
        'ContentArea',
        'Skills',
        'totalDemonstrationsRequired' => [
            'getter' => 'getTotalDemonstrationsRequired'
        ],
        'minimumLevel' => [
            'getter' => 'getMinimumLevel'
        ],
        'minimumAverage' => [
            'getter' => 'getMinimumAverage'
        ]
    ];

    public function getHandle()
    {
        return $this->Code;
    }

    public static function getByHandle($handle)
    {
        return static::getByCode($handle);
    }

    public static function getByCode($code)
    {
        return static::getByField('Code', $code);
    }

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        // check handle uniqueness
        if ($this->isFieldDirty('Code') && !$this->_validator->hasErrors('Code') && $this->Code) {
            $ExistingRecord = static::getByHandle($this->Code);

            if ($ExistingRecord && ($ExistingRecord->ID != $Record->ID)) {
                $validator->addError('Code', 'Code already registered');
            }
        }

        // save results
        return $this->finishValidation();
    }

    public function getMinimumLevel()
    {
        // TODO: determine dynamically based on current grade level, convert to dynamic attribute if possible
        return 8;
    }

    public function getMinimumAverage()
    {
        // TODO: determine dynamically based on current grade level, convert to dynamic attribute if possible
        return 8.75;
    }

    public function getSkillIds($forceRefresh = false)
    {
        $cacheKey = "cbl-competency/$this->ID/skill-ids";

        if (!$forceRefresh && false !== ($skillIds = Cache::fetch($cacheKey))) {
            return $skillIds;
        }

        $skillIds = array_map('intval', DB::allValues(
            'ID',
            'SELECT Skill.ID FROM `%s` Skill WHERE Skill.CompetencyID = %u',
            [
                Skill::$tableName,
                $this->ID
            ]
        ));

        Cache::store($cacheKey, $skillIds);

        return $skillIds;
    }

    public function getTotalDemonstrationsRequired($forceRefresh = false)
    {
        $cacheKey = "cbl-competency/$this->ID/total-demonstrations-required";

        if (!$forceRefresh && false !== ($total = Cache::fetch($cacheKey))) {
            return $total;
        }

        $total = intval(DB::oneValue(
            'SELECT SUM(Skill.DemonstrationsRequired) FROM `%s` Skill WHERE Skill.CompetencyID = %u',
            [
                Skill::$tableName,
                $this->ID
            ]
        ));

        Cache::store($cacheKey, $total);

        return $total;
    }

    public function getCompletionForStudent(Student $Student)
    {
#        $cacheKey = "cbl-competency/$this->ID/student-completion/$Student->ID";
#
#        if (!$forceRefresh && false !== ($completion = Cache::fetch($cacheKey))) {
#            return $completion;
#        }

        DB::nonQuery('set @num := 0, @skill := ""');

        $completion = DB::oneRecord(
            <<<'END_OF_SQL'
SELECT COUNT(Level) AS demonstrationsCount, AVG(Level) AS demonstrationsAverage
FROM (
    SELECT StudentDemonstrationSkill.Level,
        @num := if(@skill = StudentDemonstrationSkill.SkillID, @num + 1, 1) AS rowNumber,
        @skill := StudentDemonstrationSkill.SkillID AS SkillID
    FROM (
        SELECT DemonstrationSkill.SkillID, DemonstrationSkill.Level
        FROM `%s` DemonstrationSkill
        JOIN (SELECT ID FROM `%s` WHERE StudentID = %u) Demonstration ON Demonstration.ID = DemonstrationSkill.DemonstrationID
        WHERE DemonstrationSkill.SkillID IN (%s) AND DemonstrationSkill.Level >= %u
    ) StudentDemonstrationSkill
    ORDER BY SkillID, Level DESC
) OrderedDemonstrationSkill
JOIN `%s` Skill ON Skill.ID = OrderedDemonstrationSkill.SkillID
WHERE rowNumber <= DemonstrationsRequired;
END_OF_SQL
            ,[
                DemonstrationSkill::$tableName,
                Demonstration::$tableName,
                $Student->ID,
                implode(',', $this->getSkillIds()),
                $this->getMinimumLevel(),
                Skill::$tableName
            ]
        );

        // cast strings to floats
        $completion = [
            'demonstrationsCount' => intval($completion['demonstrationsCount']),
            'demonstrationsAverage' => floatval($completion['demonstrationsAverage'])
        ];

        // store in cache (will require cache-refreshers in relevant save methods)
#        Cache::store($cacheKey, $completion);

        return $completion;
    }
}
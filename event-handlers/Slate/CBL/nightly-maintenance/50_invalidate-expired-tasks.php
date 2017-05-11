<?php

namespace Slate\CBL\Tasks;

use DB;
use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;
use Slate\CBL\Demonstrations\DemonstrationSkill;

if (!StudentTask::$rateExpiredMissing) {
    return false;
}

set_time_limit(0);

$today = date('Y-m-d 00:00:00');

$expiredTasks = StudentTask::getAllByWhere([
    'ExpirationDate' => [
        'values' => null, // TODO: remove when ActiveRecord _mapFieldConditions can handle/prevent undefined index errors
        'value' => $today,
        'operator' => '<'
    ],
    'DemonstrationID' => null
]);

// create a demo for expired tasks without one
foreach ($expiredTasks as $expiredTask) {
    $expiredTask->getDemonstration();
}

// insert 'Missing' ratings for unrated skills associated with expired tasks
$query =
    'INSERT INTO `%1$s` '.
    '(`Class`, `DemonstrationID`, `SkillID`, `TargetLevel`, `DemonstratedLevel`) '.
    'SELECT * FROM ('.
        '('.
            'SELECT '.
                '"%2$s", '.
                '%4$s.DemonstrationID, '.
                '%6$s.SkillID, '.
                '%10$s.Level, '.
                 '0 '.

             'FROM `%3$s` %4$s '.

             'JOIN ( '.
                  'SELECT %6$s.SkillID, %6$s.TaskID '.
                    'FROM `%5$s` %6$s '.
              ') as %6$s '.
                'ON %6$s.TaskID = %4$s.TaskID '.
             'JOIN ( '.
                      'SELECT %8$s.ID, %8$s.CompetencyID '.
                        'FROM `%7$s` %8$s '.
                ') as %8$s '.
                  'ON %8$s.ID = %6$s.SkillID '.
             'JOIN ( '.
                    'SELECT MAX(%10$s.Level) as Level, %10$s.CompetencyID, %10$s.StudentID '.
                          'FROM `%9$s` %10$s '.
                       'GROUP BY StudentID, CompetencyID '.
                  ') as %10$s '.
                  'ON  %10$s.CompetencyID = %8$s.CompetencyID '.

            'WHERE %4$s.ExpirationDate < DATE(NOW()) '.
              'AND %10$s.StudentID = %4$s.StudentID '.
              'AND %6$s.SkillID NOT IN ( '.
                    'SELECT %11$s.SkillID '.
                         'FROM `%1$s` %11$s '.
                        'WHERE %11$s.DemonstrationID = %4$s.DemonstrationID '.
              ')'.
        ')'.
    ' UNION '.
        '('.
            'SELECT '.
                '"%2$s", '.
                '%4$s.DemonstrationID, '.
                '%13$s.SkillID, '.
                '%10$s.Level, '.
                '0 '.

             'FROM `%3$s` %4$s '.

             'JOIN ( '.
                  'SELECT %13$s.SkillID, %13$s.StudentTaskID '.
                    'FROM `%12$s` %13$s '.
              ') as %13$s '.
                'ON %13$s.StudentTaskID = %4$s.ID '.
             'JOIN ( '.
                      'SELECT %8$s.ID, %8$s.CompetencyID '.
                        'FROM `%7$s` %8$s '.
                ') as %8$s '.
                  'ON %8$s.ID = %13$s.SkillID '.
             'JOIN ( '.
                    'SELECT MAX(%10$s.Level) as Level, %10$s.CompetencyID, %10$s.StudentID '.
                          'FROM `%9$s` %10$s '.
                       'GROUP BY StudentID, CompetencyID '.
                  ') as %10$s '.
                  'ON  %10$s.CompetencyID = %8$s.CompetencyID '.

            'WHERE %4$s.ExpirationDate < DATE(NOW()) '.
              'AND %10$s.StudentID = %4$s.StudentID '.
              'AND %13$s.SkillID NOT IN ( '.
                    'SELECT %11$s.SkillID '.
                         'FROM `%1$s` %11$s '.
                        'WHERE %11$s.DemonstrationID = %4$s.DemonstrationID '.
              ')'.
        ')'.
    ") missingSkills";

$params = [
    DemonstrationSkill::$tableName, // 1
    DB::escape(DemonstrationSkill::class), // 2

    StudentTask::$tableName, // 3
    StudentTask::getTableAlias(), // 4

    TaskSkill::$tableName, // 5
    TaskSkill::getTableAlias(), // 6

    Skill::$tableName, // 7
    Skill::getTableAlias(), // 8

    StudentCompetency::$tableName, // 9
    StudentCompetency::getTableAlias(), // 10

    DemonstrationSkill::getTableAlias(), // 11

    StudentTaskSkill::$tableName, // 12
    StudentTaskSkill::getTableAlias(), // 13
];

DB::nonQuery($query, $params);
<?php

namespace Slate\CBL\Tasks;

use DB;
use Slate\CBL\Skill;
use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;

$studentRatingsTable = 'cbl_student_task_ratings';
$studentRatingsHistoryTable = 'history_'.$studentRatingsTable;

$demonstrationsTable = Demonstration::$tableName;
$studentTasksTable = StudentTask::$tableName;


// add column
if (!static::columnExists($studentTasksTable, 'DemonsrationID')) {
    printf("Adding DemonstrationID column to `$studentTasksTable`");
    DB::nonQuery('ALTER TABLE `%s` ADD `DemonstrationID` uint NULL DEFAULT NULL', $studentTasksTable);
}

if (!static::tableExists($studentRatingsTable)) {
    printf("Skipping records migration because table `$studentRatingsTable` does not exist.");
} else { // migrate old records
    $taskRatings = DB::allRecords(
        'SELECT StudentTaskID, SkillID, Score '
        .'FROM `%s`',
        [
            $studentRatingsTable
        ]
    );

    $totalRatings = count($taskRatings);
    $naRatings = 0;
    $migratedRatings = 0;

    // migrate ratings into demonstration skills
    foreach ($taskRatings as $taskRating) {
        if ($taskRating['Rating'] == 'N/A') {
            $naRatings++;
            continue;
        } else if ($taskRating['Rating'] == 'M') { // convert M (missing) ratings to 0
            $taskRating['Rating'] = 0;
        }

        $StudentTask = StudentTask::getByID($taskRating['StudentTaskID']);
        $Demonstration = $StudentTask->getDemonstration(true); // true to auto create demonstration if needed
        $Skill = Skill::getByID($taskRating['SkillID']);

        DemonstrationSkill::create([
            'DemonstrationID' => $Demonstration->ID,
            'SkillID' => $taskRating['SkillID'],
            'TargetLevel' => $Skill->Competency->getCurrentLevelForStudent($StudentTask->Student),
            'DemonstratedLevel' => intval($taskRating['Score'])
        ], true);

        $migratedRatings++;
    }

    // compare amount of records
    if (($totalRatings != $migratedRatings + $naRatings)) {
        printf("Records migrated ($migratedRatings) + Records skipped ($naRatings) does not equal the total amount of records found ($totalRatings). Migration has failed.");
        return static::STATUS_FAILED;
    }

    // drop old tables
    printf("Dropping deprecated tables: `%s` and `%s`", $studentRatingsTable, $studentRatingsHistoryTable);
    DB::nonQuery(
        'DROP TABLE `%s`',
        $studentRatingsTable
    );

    DB::nonQuery(
        'DROP TABLE `%s`',
        $studentRatingsHistoryTable
    );

    return static::STATUS_EXECUTED;
}
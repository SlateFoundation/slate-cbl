<?php

namespace Slate\CBL\Tasks;

use DB;
use Slate\CBL\Skill;
use Slate\CBL\Demonstrations\ExperienceDemonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;

$studentRatingsTable = 'cbl_student_task_ratings';
$studentRatingsHistoryTable = 'history_'.$studentRatingsTable;

$demonstrationsTable = ExperienceDemonstration::$tableName;
$studentTasksTable = StudentTask::$tableName;
$studentTasksHistoryTable = 'history_'.$studentTasksTable;

// add column
if (!static::columnExists($studentTasksTable, 'DemonstrationID')) {
    printf("Adding DemonstrationID column to `$studentTasksTable`");
    DB::nonQuery('ALTER TABLE `%s` ADD COLUMN `DemonstrationID` INT UNSIGNED NULL DEFAULT NULL', $studentTasksTable);
}

if (!static::columnExists($studentTasksHistoryTable, 'DemonstrationID')) {
    printf("Adding DemonstrationID column to `$studentTasksHistoryTable`");
    DB::nonQuery('ALTER TABLE `%s` ADD COLUMN `DemonstrationID` INT UNSIGNED NULL DEFAULT NULL', $studentTasksHistoryTable);
}


if (!static::tableExists($studentRatingsTable)) {
    printf("Skipping records migration because table `$studentRatingsTable` does not exist.");
    return static::STATUS_SKIPPED;
}

// migrate old records
$taskRatings = DB::allRecords(
    'SELECT StudentTaskID, SkillID, Score, CreatorID, Created '
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
    if ($taskRating['Score'] == 'N/A') {
        $naRatings++;
        continue;
    } else if ($taskRating['Score'] == 'M') { // convert M (missing) ratings to 0
        $taskRating['Score'] = 0;
    }

    if (!$StudentTask = StudentTask::getByID($taskRating['StudentTaskID'])) {
        $naRatings++;
        continue;
    }

    if (!$Demonstration = $StudentTask->Demonstration) {
        $Demonstration = ExperienceDemonstration::create([
            'CreatorID' => $StudentTask->CreatorID,
            'Created' => $taskRating['Created'],
            'StudentID' => $StudentTask->StudentID,
            'Demonstrated' => $StudentTask->Submitted ?: null,
            'ExperienceType' => $StudentTask->ExperienceType,
            'PerformanceType' => $StudentTask->Task->Title,
            'Context' => $StudentTask->Section->Title
        ]);
        $Demonstration->save(false);

        $StudentTask->DemonstrationID = $Demonstration->ID;
        $StudentTask->save(false);
    }
    $Skill = Skill::getByID($taskRating['SkillID']);
    $StudentCompetency = StudentCompetency::getCurrentForStudent($StudentTask->Student, $Skill->Competency);

    $DemonstrationSkill = DemonstrationSkill::create([
        'DemonstrationID' => $Demonstration->ID,
        'Created' => $taskRating['Created'],
        'CreatorID' => $taskRating['CreatorID'],
        'SkillID' => $taskRating['SkillID'],
        'TargetLevel' => $StudentCompetency ? $StudentCompetency->Level : null,
        'DemonstratedLevel' => intval($taskRating['Score'])
    ]);
    $DemonstrationSkill->save(false);

    $migratedRatings++;
}

// compare amount of records
if (($totalRatings != $migratedRatings + $naRatings)) {
    printf("Records migrated ($migratedRatings) + Records skipped ($naRatings) does not equal the total amount of records found ($totalRatings). Migration has failed.");
    return static::STATUS_FAILED;
}

return static::STATUS_EXECUTED;
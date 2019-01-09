<?php

use Slate\CBL\Tasks\Task;
use Slate\CBL\Tasks\StudentTask;


$tasks = Task::getAll();
printf("Reviewing %u tasks...\n", count($tasks));


$totals = [];
foreach ($tasks as $i => $Task) {

    // collect stats on associated student-tasks' dates
    $stats = DB::oneRecord(
        '
        SELECT COUNT(ID) AS RecordsCount,
               COUNT(DueDate) AS DueDatesCount,
               COUNT(DISTINCT DueDate) AS DueDatesDistinct,
               GROUP_CONCAT(
                   IF(DueDate IS NOT NULL AND DueDate = FROM_UNIXTIME(%u), ID, NULL)
               ) AS DueDatesRedundant,
               COUNT(ExpirationDate) AS ExpirationDatesCount,
               COUNT(DISTINCT ExpirationDate) AS ExpirationDatesDistinct,
               GROUP_CONCAT(
                   IF(ExpirationDate IS NOT NULL AND ExpirationDate = FROM_UNIXTIME(%u), ID, NULL)
               ) AS ExpirationDatesRedundant
          FROM `%s`
         WHERE TaskID = %u
        ',
        [
            $Task->DueDate,
            $Task->ExpirationDate,
            StudentTask::$tableName,
            $Task->ID
        ]
    );


    // skip tasks with no student-tasks
    if ($stats['RecordsCount'] == 0) {
        continue;
    }


    // upstream any uniform values
    if (
        $stats['RecordsCount'] == $stats['DueDatesCount']
        && $stats['DueDatesDistinct'] == 1
    ) {
        printf("Upstreaming %u uniform DueDates for Task#%u\n", $stats['DueDatesCount'], $Task->ID);
        $Task->DueDate = $Task->StudentTasks[0]->DueDate;
        $totals['task-due-uniformed']++;
        $totals['studenttask-due-upstreamed'] += $stats['DueDatesCount'];

        if ($Task->isFieldDirty('DueDate')) {
            printf("Updating Task DueDate to match\n");
            $totals['task-due-changed']++;
            $Task->save();
        }

        DB::nonQuery('UPDATE `%s` SET DueDate = NULL WHERE TaskID = %u', [StudentTask::$tableName, $Task->ID]);
    } elseif ($stats['DueDatesRedundant']) {
        $ids = explode(',', $stats['DueDatesRedundant']);
        printf("Clearing %u redundant DueDates for Task#%u\n", count($ids), $Task->ID);
        $totals['studenttask-due-cleared'] += count($ids);
        DB::nonQuery('UPDATE `%s` SET DueDate = NULL WHERE ID IN (%s)', [StudentTask::$tableName, implode(',', $ids)]);
    }


    if (
        $stats['RecordsCount'] == $stats['ExpirationDatesCount']
        && $stats['ExpirationDatesDistinct'] == 1
    ) {
        printf("Upstreaming %u uniform ExpirationDates for Task#%u\n", $stats['ExpirationDatesCount'], $Task->ID);
        $Task->ExpirationDate = $Task->StudentTasks[0]->ExpirationDate;
        $totals['task-expiration-uniformed']++;
        $totals['studenttask-expiration-upstreamed'] += $stats['ExpirationDatesCount'];

        if ($Task->isFieldDirty('ExpirationDate')) {
            printf("Updating Task ExpirationDate to match\n");
            $totals['task-expiration-changed']++;
            $Task->save();
        }

        DB::nonQuery('UPDATE `%s` SET ExpirationDate = NULL WHERE TaskID = %u', [StudentTask::$tableName, $Task->ID]);
    } elseif ($stats['ExpirationDatesRedundant']) {
        $ids = explode(',', $stats['ExpirationDatesRedundant']);
        printf("Clearing %u redundant ExpirationDates for Task#%u\n", count($ids), $Task->ID);
        $totals['studenttask-expiration-cleared'] += count($ids);
        DB::nonQuery('UPDATE `%s` SET ExpirationDate = NULL WHERE ID IN (%s)', [StudentTask::$tableName, implode(',', $ids)]);
    }
}


print_r([
    'totals' => $totals
]);


return count($totals) ? static::STATUS_EXECUTED : static::STATUS_SKIPPED;

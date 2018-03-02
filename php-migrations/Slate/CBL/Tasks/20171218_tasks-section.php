<?php

namespace Slate\CBL\Tasks;

use DB;
use HandleBehavior;


// skip if Task table does not exist or already has SectionID
if (!static::tableExists(Task::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", Task::$tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists(Task::$tableName, 'SectionID')) {
    printf("Skipping migration because column `%s`.`SectionID` already exists\n", Task::$tableName);
    return static::STATUS_SKIPPED;
}


// find existing SectionIDs for all associated StudentTask records, clone Task records as needed
$taskColumnNames = array_diff(static::getColumnNames(Task::$tableName), ['ID', 'Handle']);
$taskSectionIds = DB::arrayTable('TaskID', 'SELECT DISTINCT TaskID, SectionID FROM `%s`', StudentTask::$tableName);
$taskSectionId = [];

foreach ($taskSectionIds as $taskId => $studentTaskSections) {
    // original task gets first section
    if ($studentTaskSection = array_shift($studentTaskSections)) {
        $taskSectionId[$taskId] = $studentTaskSection['SectionID'];
    }

    // no cloning is needed
    if (count($studentTaskSections) == 0) {
        continue;
    }

    $taskTitle = DB::oneValue('SELECT Title FROM `%s` WHERE ID = %u', [Task::$tableName, $taskId]);

    // clone for any/each additional section
    while ($studentTaskSection = array_shift($studentTaskSections)) {
        $cloneHandle = HandleBehavior::getUniqueHandle(Task::class, $taskTitle);
        DB::nonQuery(
            'INSERT INTO `%1$s` (`ID`, `Handle`, `%4$s`) SELECT NULL, "%3$s", `%4$s` FROM `%1$s` WHERE ID = %2$u',
            [
                Task::$tableName,
                $taskId,
                DB::escape($cloneHandle),
                implode('`, `', $taskColumnNames)
            ]
        );

        $taskSectionId[DB::insertID()] = $studentTaskSection['SectionID'];
        printf("Cloning task %u for section %u\n", $taskId, $studentTaskSection['SectionID']);
    }
}


// add SectionID column to Task table
static::addColumn(Task::$tableName, 'SectionID', 'int unsigned NULL default NULL', 'AFTER `ModifierID`');
static::addColumn(Task::getHistoryTableName(), 'SectionID', 'int unsigned NULL default NULL', 'AFTER `ModifierID`');
static::addIndex(Task::$tableName, 'SectionID');


// clone Task for each SectionID where multiple are associated
printf("Setting SectionID for %u Task records\n", count($taskSectionId));
foreach ($taskSectionId as $taskId => $sectionId) {
    DB::nonQuery('UPDATE `%s` SET SectionID = %u WHERE ID = %u', [
        Task::$tableName,
        $sectionId,
        $taskId
    ]);
}


// remove SectionID column from StudentTask table
static::dropColumn(StudentTask::$tableName, 'SectionID');
static::dropColumn(StudentTask::getHistoryTableName(), 'SectionID');


// finish
return static::STATUS_EXECUTED;
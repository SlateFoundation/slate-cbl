<?php

use Slate\CBL\Tasks\Task;

// skip if Task table does not exist or has no ParentTaskID column
if (!static::tableExists(Task::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", Task::$tableName);
    return static::STATUS_SKIPPED;
}

if (!static::columnExists(Task::$tableName, 'ParentTaskID')) {
    printf("Skipping migration because column `%s`.`ParentTaskID` does not exist\n", Task::$tableName);
    return static::STATUS_SKIPPED;
}

$invalidTasks = Task::getAllByWhere([
    'ParentTaskID = ID'
], ['indexField' => 'ID']);

if (!empty($invalidTasks)) {
    printf("Updating %u invalid task records", count($invalidTasks));
    DB::nonQuery(
        '
            UPDATE `%s`
               SET ParentTaskID = NULL
             WHERE ParentTaskID = ID
        ',
        [
            Task::$tableName
        ]
    );
    return static::STATUS_EXECUTED;
} else {
    printf("Skipping migration because there are no invalid parent tasks.");
    return static::STATUS_SKIPPED;
}

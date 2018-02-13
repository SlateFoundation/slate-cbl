<?php

namespace Slate\CBL\Tasks;


// skip if Task table does not exist or already has ClonedTaskID
if (!static::tableExists(Task::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", Task::$tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists(Task::$tableName, 'ClonedTaskID')) {
    printf("Skipping migration because column `%s`.`ClonedTaskID` already exists\n", Task::$tableName);
    return static::STATUS_SKIPPED;
}


// add ClonedTaskID column to Task table
static::addColumn(Task::$tableName, 'ClonedTaskID', 'int unsigned NULL default NULL', 'AFTER `ParentTaskID`');
static::addColumn(Task::getHistoryTableName(), 'ClonedTaskID', 'int unsigned NULL default NULL', 'AFTER `ParentTaskID`');


// finish
return static::STATUS_EXECUTED;
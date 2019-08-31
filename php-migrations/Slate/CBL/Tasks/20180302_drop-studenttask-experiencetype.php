<?php

namespace Slate\CBL\Tasks;

use DB;
use HandleBehavior;


// skip if StudentTask table does not exist or does not have ExperienceType field
if (!static::tableExists(StudentTask::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", StudentTask::$tableName);
    return static::STATUS_SKIPPED;
}

if (!static::columnExists(StudentTask::$tableName, 'ExperienceType')) {
    printf("Skipping migration because column `%s`.`ExperienceType` does not exists\n", StudentTask::$tableName);
    return static::STATUS_SKIPPED;
}


// cancel run if manual data cleanup is needed
$mismatches = intval(DB::oneValue(
    'SELECT COUNT(*) FROM `%s` st JOIN `%s` t ON t.ID = st.TaskID WHERE st.ExperienceType != t.ExperienceType',
    [
        StudentTask::$tableName,
        Task::$tableName
    ]
));

if ($mismatches > 0) {
    printf("Unable to complete migration, %u StudentTask records have ExperienceType value not matching that of associated Task record.\n", $mismatches);
    print("Reconcile manually and then attempt to run this migration again.\n");
    return static::STATUS_DEBUG;
}


// remove SectionID column from StudentTask table
print("Dropping ExperienceType column from StudentTask table");
static::dropColumn(StudentTask::$tableName, 'ExperienceType');
static::dropColumn(StudentTask::getHistoryTableName(), 'ExperienceType');


// finish
return static::STATUS_EXECUTED;
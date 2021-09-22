<?php

namespace Slate\CBL\Tasks;

use DB;

// skip if table does not exist yet
if (!static::tableExists(StudentTask::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", StudentTask::$tableName);
    return static::STATUS_SKIPPED;
}


// skip if DemonstrationID index already exists
if (static::getColumn(StudentTask::$tableName, 'DemonstrationID')['COLUMN_KEY']) {
    printf("Skipping migration because DemonstrationID index already exists\n");
    return static::STATUS_SKIPPED;
}


// add index
static::addIndex(StudentTask::$tableName, 'DemonstrationID');

return static::STATUS_EXECUTED;

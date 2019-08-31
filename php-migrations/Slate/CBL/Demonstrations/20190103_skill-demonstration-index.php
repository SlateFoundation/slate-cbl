<?php

namespace Slate\CBL\Demonstrations;

use DB;

// skip if table does not exist yet
if (!static::tableExists(DemonstrationSkill::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", DemonstrationSkill::$tableName);
    return static::STATUS_SKIPPED;
}


// skip if DemonstrationID index already exists
$indexData = DB::oneRecord(
    '
    SELECT *
      FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = SCHEMA()
       AND TABLE_NAME = "%s"
       AND INDEX_NAME = "DemonstrationID"
    ',
    DB::escape([DemonstrationSkill::$tableName])
);

if ($indexData) {
    printf("Skipping migration because DemonstrationID index already exists\n");
    return static::STATUS_SKIPPED;
}


// add index
static::addIndex(DemonstrationSkill::$tableName, 'DemonstrationID');

return static::STATUS_EXECUTED;

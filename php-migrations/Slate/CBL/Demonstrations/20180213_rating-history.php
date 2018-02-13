<?php

namespace Slate\CBL\Demonstrations;


use DB;
use SQL;


// skip if DemonstrationTask table does not exist or history table already exists
if (!static::tableExists(DemonstrationSkill::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", DemonstrationSkill::$tableName);
    return static::STATUS_SKIPPED;
}

$historyTableName = DemonstrationSkill::getHistoryTableName();
if (static::tableExists($historyTableName)) {
    printf("Skipping migration because table `%s` already exists\n", $historyTableName);
    return static::STATUS_SKIPPED;
}


print("Creating history table: $historyTableName");
DB::multiQuery(SQL::getCreateTable(DemonstrationSkill::class));


// finish
return static::STATUS_EXECUTED;
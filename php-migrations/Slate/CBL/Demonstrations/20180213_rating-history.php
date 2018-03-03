<?php

namespace Slate\CBL\Demonstrations;


use DB;
use SQL;


$tableName = DemonstrationSkill::$tableName;
$historyTableName = DemonstrationSkill::getHistoryTableName();
$skipped = true;


// skip if DemonstrationTask table does not exist or history table already exists
if (!static::tableExists(DemonstrationSkill::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", DemonstrationSkill::$tableName);
    return static::STATUS_SKIPPED;
}


// create history table if needed
if (!static::tableExists($historyTableName)) {
    print("Creating history table: $historyTableName");
    DB::multiQuery(SQL::getCreateTable(DemonstrationSkill::class));
    $skipped = false;
}


// add modified/modifier columns
if (!static::columnExists($tableName, 'Modified')) {
    printf("Adding `Modified` column to `%s` table\n", $tableName);
    DB::nonQuery('ALTER TABLE `%s` ADD `Modified` timestamp NULL default NULL AFTER `CreatorID`', $tableName);
    $skipped = false;
}

if (!static::columnExists($tableName, 'ModifierID')) {
    printf("Adding `ModifierID` column to `%s` table\n", $tableName);
    DB::nonQuery('ALTER TABLE `%s` ADD `ModifierID` int unsigned NULL default NULL AFTER `Modified`', $tableName);
    $skipped = false;
}


// finish
return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;
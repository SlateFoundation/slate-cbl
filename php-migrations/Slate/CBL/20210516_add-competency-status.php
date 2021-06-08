<?php

namespace Slate\CBL;

use DB, SQL;

$tableName = Competency::$tableName;
$historyTableName = Competency::getHistoryTableName();
$columnName = 'Status';


// check if this migration can be skipped
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist.", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists($tableName, $columnName)) {
    printf("Skipping migration because column `%s`.`%s` already exists\n", $tableName, $columnName);
    return static::STATUS_SKIPPED;
}


// apply migration
$definition = SQL::getFieldDefinition(Competency::class, $columnName);
$definition = substr($definition, strpos($definition, ' ') + 1); // trim column name

static::addColumn($tableName, $columnName, $definition);
static::addColumn($historyTableName, $columnName, $definition);

printf("Archiving records with prefix OLD...\n");
DB::nonQuery('UPDATE `%s` SET Status = "archived" WHERE CODE LIKE "OLD%%"', $tableName);
$archived = DB::affectedRows();
printf("Archived %u records\n", $archived);

printf("Archiving history records with prefix OLD...\n");
DB::nonQuery('UPDATE `%s` SET Status = "archived" WHERE CODE LIKE "OLD%%"', $historyTableName);
$archived = DB::affectedRows();
printf("Archived %u history records\n", $archived);


// return migration status
return static::STATUS_EXECUTED;

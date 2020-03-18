<?php

namespace Slate\CBL\Tasks;

use DB, SQL;

$columnName = 'Status';

if (!static::tableExists(Task::$tableName)) {
    printf("Skipping migration because table `%s` does not exist.", Task::$tableName);
    return static::STATUS_SKIPPED;
}

if (!static::columnExists(Task::$tableName, $columnName)) {
    printf("Skipping migration because column `%s`.`%s` does not exists\n", Task::$tableName, $columnName);
    return static::STATUS_SKIPPED;
}

printf("Updating `%s`.`%s` column enum values.", Task::$tableName, $columnName);
$updateTable = DB::nonQuery(
    'ALTER TABLE `%s` CHANGE COLUMN `%s` %s',
    [
        Task::$tableName,
        $columnName,
        SQL::getFieldDefinition(Task::class, $columnName)
    ]
);

printf("Updating `%s`.`%s` column enum values.", Task::getHistoryTableName(), $columnName);
$updateHistoryTable = DB::nonQuery(
    'ALTER TABLE `%s` CHANGE COLUMN `%s` %s',
    [
        Task::getHistoryTableName(),
        $columnName,
        SQL::getFieldDefinition(Task::class, $columnName, true)
    ]
);

return static::STATUS_EXECUTED;
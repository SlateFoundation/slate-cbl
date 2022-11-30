<?php

namespace Slate\CBL\Tasks;

use DB;

$tableName = Task::$tableName;
$historyTableName = 'history_'.$tableName;

$columnName = 'Shared';


// skip conditions
if (!static::tableExists($tableName) || !static::getColumn($tableName, $columnName)) {
    return static::STATUS_SKIPPED;
}

// update table
printf("Removing column `%s`.`%s`", $tableName, $columnName);
DB::nonQuery(
    'ALTER TABLE `%1$s` DROP COLUMN `%2$s`',
    [
        $tableName,
        $columnName
    ]
);

// update history table
printf("Removing column `%s`.`%s`", $historyTableName, $columnName);
DB::nonQuery(
    'ALTER TABLE `%1$s` DROP COLUMN `%2$s`',
    [
        $historyTableName,
        $columnName
    ]
);

return static::STATUS_EXECUTED;
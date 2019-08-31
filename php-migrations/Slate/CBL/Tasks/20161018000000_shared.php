<?php

namespace Slate\CBL\Tasks;

use DB;

$tableName = Task::$tableName;
$historyTableName = 'history_'.$tableName;

$columnName = 'Shared';

// skip conditions
if (!static::tableExists($tableName) || static::getColumnIsNullable($tableName, $columnName)) {
    return static::STATUS_SKIPPED;
}

// update table
printf("Updating column `%s`.`%s`", $tableName, $columnName);
DB::nonQuery(
    'ALTER TABLE `%1$s` '
    .'CHANGE COLUMN `%2$s` '
    .'`%2$s` ENUM("course","school","public") CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL',
    [
        $tableName,
        $columnName
    ]
);

// update history table
printf("Updating column `%s`.`%s`", $historyTableName, $columnName);
DB::nonQuery(
    'ALTER TABLE `%1$s` '
    .'CHANGE COLUMN `%2$s` '
    .'`%2$s` ENUM("course","school","public") CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL',
    [
        $historyTableName,
        $columnName
    ]
);

return static::STATUS_EXECUTED;
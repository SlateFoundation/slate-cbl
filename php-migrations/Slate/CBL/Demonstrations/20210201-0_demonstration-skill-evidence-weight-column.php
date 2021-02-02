<?php

namespace Slate\CBL\Demonstrations;

use DB;

$columnName = 'EvidenceWeight';
$tableName = DemonstrationSkill::$tableName;
$historyTableName = DemonstrationSkill::getHistoryTableName();

if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists($tableName, $columnName)) {
    printf("Skipping migration because column `%s`.%s does not exist yet\n", $tableName, $columnName);
    return static::STATUS_SKIPPED;
}

printf("Updating table `%s`\n", $tableName);
DB::nonQuery('ALTER TABLE `%s` ADD `%s` TINYINT(10) NULL DEFAULT NULL', [$tableName, $columnName]);

printf("Updating table `%s`\n", $historyTableName);
DB::nonQuery('ALTER TABLE `%s` ADD `%s` TINYINT(10) NULL DEFAULT NULL', [$historyTableName, $columnName]);

if (static::columnExists($tableName, $columnName)) {
    return static::STATUS_EXECUTED;
} else {
    return static::STATUS_FAILED;
}
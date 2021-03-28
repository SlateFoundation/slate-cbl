<?php

namespace Slate\CBL\Demonstrations;


$columnName = 'EvidenceWeight';
$tableName = DemonstrationSkill::$tableName;
$historyTableName = DemonstrationSkill::getHistoryTableName();

// skip if table doesn't exist yet or already has new column
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists($tableName, $columnName)) {
    printf("Skipping migration because column `%s`.%s already exists\n", $tableName, $columnName);
    return static::STATUS_SKIPPED;
}

// add EvidenceWeight columns
static::addColumn($tableName, $columnName, 'TINYINT(10) NULL DEFAULT NULL');
static::addColumn($historyTableName, $columnName, 'TINYINT(10) NULL DEFAULT NULL');

return static::STATUS_EXECUTED;

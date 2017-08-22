<?php

namespace Slate\CBL;

use DB, SQL;

$tableName = StudentCompetency::$tableName;
$columnName = 'BaselineRating';

if (!static::tableExists($tableName)) {
    print('Table does not exist, skipping.');
    return static::STATUS_SKIPPED;
}

if (static::columnExists($tableName, $columnName)) {
    printf('Column `%s`.`%s` exists already, skipping.', $tableName, $columnName);
    return static::STATUS_SKIPPED;
}

$fieldDefinition = SQL::getFieldDefinition(StudentCompetency::class, $columnName, false);

DB::nonQuery(
    'ALTER TABLE `%s` ADD %s',
    [
        $tableName,
        $fieldDefinition
    ]
);

return static::columnExists($tableName, $columnName) ? static::STATUS_EXECUTED : static::STATUS_FAILED;
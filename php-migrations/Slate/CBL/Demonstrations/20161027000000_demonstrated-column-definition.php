<?php

namespace Slate\CBL\Demonstrations;

$tableName = Demonstration::$tableName;
$columnType = 'TIMESTAMP';
$columnDefinition = $columnType . ' NULL DEFAULT NULL';

$skipped = true;

// skip conditions
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `demonstrations` does not exist yet\n");
    return static::STATUS_SKIPPED;
}

// migration
if (strtoupper(static::getColumnType($tableName, 'Demonstrated')) == $columnType && !static::getColumnIsNullable($tableName, 'Demonstrated')) {
    print("Updating `Demonstrated` column definition\n");
    \DB::nonQuery("ALTER TABLE " . $tableName . " CHANGE COLUMN `Demonstrated` `Demonstrated` $columnDefinition");
    $skipped = false;
}

return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;
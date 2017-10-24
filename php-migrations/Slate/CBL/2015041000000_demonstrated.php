<?php

namespace Slate\CBL\Demonstrations;

$newDemonstratedType = 'TIMESTAMP';
// skip conditions

$skipped = true;

if (!static::tableExists(Demonstration::$tableName)) {
    printf("Skipping migration because table `demonstrations` does not exist yet\n");
    return static::STATUS_SKIPPED;
}

// migration
if (static::getColumnType(Demonstration::$tableName, 'Demonstrated') != $newDemonstratedType) {
    print("Updating `Demonstrated` column type\n");
    \DB::nonQuery("ALTER TABLE " . Demonstration::$tableName . " CHANGE COLUMN `Demonstrated` `Demonstrated` $newDemonstratedType NULL default NULL");
    $skipped = false;
}

// done
return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;

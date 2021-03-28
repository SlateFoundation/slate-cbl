<?php

namespace Slate\CBL\Demonstrations;

use DB;


$tableName = DemonstrationSkill::$tableName;
$historyTableName = DemonstrationSkill::getHistoryTableName();

// skip if table doesn't exist
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", $tableName);
    return static::STATUS_SKIPPED;
}

// skip if Class column already contains Missing subclass
if (static::hasColumnEnumValue($tableName, 'Class', MissingDemonstrationSkill::class)) {
    printf("Skipping migration because column `%s`.`Class` already has value '%s'\n", $tableName, MissingDemonstrationSkill::class);
    return static::STATUS_SKIPPED;
}

// add new Class value
static::addColumnEnumValue($tableName, 'Class', MissingDemonstrationSkill::class);
static::addColumnEnumValue($historyTableName, 'Class', MissingDemonstrationSkill::class);

// migrate legacy missing demonstrations
DB::nonQuery(
    'UPDATE `%s` SET Class = "%s", DemonstratedLevel = NULL WHERE Class = "%s" AND DemonstratedLevel = 0',
    [
        $tableName,
        DB::escape(MissingDemonstrationSkill::class),
        DB::escape(DemonstrationSkill::class)
    ]
);
printf(
    "Updated %u DemonstrationSkill records with Rating = 0 to MissingDemonstrationSkill class\n",
    DB::affectedRows()
);

<?php

namespace Slate\CBL\Demonstrations;


$tableName = DemonstrationSkill::$tableName;
$historyTableName = DemonstrationSkill::getHistoryTableName();

// skip if table doesn't exist
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", $tableName);
    return static::STATUS_SKIPPED;
}

// skip if Class column already contains DidNotMeet subclass
if (static::hasColumnEnumValue($tableName, 'Class', DidNotMeetDemonstrationSkill::class)) {
    printf("Skipping migration because column `%s`.`Class` already has value '%s'\n", $tableName, DidNotMeetDemonstrationSkill::class);
    return static::STATUS_SKIPPED;
}

// add new Class value
static::addColumnEnumValue($tableName, 'Class', DidNotMeetDemonstrationSkill::class);
static::addColumnEnumValue($historyTableName, 'Class', DidNotMeetDemonstrationSkill::class);

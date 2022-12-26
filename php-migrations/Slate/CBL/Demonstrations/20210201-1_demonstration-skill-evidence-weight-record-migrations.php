<?php

namespace Slate\CBL\Demonstrations;

use DB;


$tableName = DemonstrationSkill::$tableName;
$historyTableName = DemonstrationSkill::getHistoryTableName();
$columnName = 'Override';

// skip if table doesn't exist yet or already has new column
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (!static::columnExists($tableName, $columnName)) {
    printf("Skipping migration because column `%s`.%s does not exist\n", $tableName, $columnName);
    return static::STATUS_SKIPPED;
}

// check for invalid records
$invalidRecords = DB::oneValue(
    '
        SELECT COUNT(*) AS Total
          FROM `%s` DemonstrationSkill
          JOIN `%s` Demonstration
            ON (DemonstrationSkill.DemonstrationID = Demonstration.ID)
         WHERE IF (Demonstration.Class = "%s", 1, 0) != DemonstrationSkill.Override
    ',
    [
        $tableName,
        Demonstration::$tableName,
        DB::escape(OverrideDemonstration::class)
    ]
);

if (!empty($invalidRecords)) {
    printf("Found %u invalid records that have `Override` set, but are not associated with an `OverrideDemonstration`.\n", $invalidRecords);
    return static::STATUS_FAILED;
}

// apply migrations
migrateRecords($tableName);
migrateRecords($historyTableName);

static::dropColumn($tableName, $columnName);
static::dropColumn($historyTableName, $columnName);


return static::STATUS_EXECUTED;


function migrateRecords($tableName) {

    // migrate override records
    printf("Migrating Override records in `%s`\n", $tableName);
    DB::nonQuery(
        '
            UPDATE `%s`
               SET EvidenceWeight = NULL
             WHERE Override = 1
        ',
        [
            $tableName
        ]
    );
    printf("Migrated %u Override records in `%s`\n", DB::affectedRows(), $tableName);

    // migrate non override records
    printf("Migrating non-Override records in `%s`\n", $tableName);
    DB::nonQuery(
        '
            UPDATE `%s`
               SET EvidenceWeight = 1
             WHERE Override = 0
        ',
        [
            $tableName
        ]
    );
    printf("Migrated %u non-Override records in `%s`\n", DB::affectedRows(), $tableName);
}

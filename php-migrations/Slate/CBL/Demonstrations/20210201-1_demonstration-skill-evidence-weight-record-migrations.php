<?php

namespace Slate\CBL\Demonstrations;

use DB;

$invalidRecords = DB::oneValue(
    '
        SELECT COUNT(*) AS Total
          FROM `%1$s` %2$s
          JOIN `%3$s` %4$s
            ON (%2$s.DemonstrationID = %4$s.ID)
         WHERE IF (%4$s.Class = "%5$s", 1, 0) != %2$s.Override
    ',
    [
        DemonstrationSkill::$tableName,
        DemonstrationSkill::getTableAlias(),
        Demonstration::$tableName,
        Demonstration::getTableAlias(),
        DB::escape(OverrideDemonstration::class)
    ]
);

if (!empty($invalidRecords)) {
    printf("Found %u invalid records that have `Override` set, but are not associated with an `OverrideDemonstration`.\n", $invalidRecords);
    return static::STATUS_FAILED;
}
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
    
    // migrate non override records
    printf("Migrating non Override records in `%s`\n", $tableName);
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
}

function deprecateColumn($tableName) {
    // deprecate override column
    printf("Deprecating column `%s`.Override\n", $tableName);
    DB::nonQuery('ALTER TABLE %s DROP COLUMN Override', [
        $tableName
    ]);
}

migrateRecords(DemonstrationSkill::$tableName);
migrateRecords(DemonstrationSkill::getHistoryTableName());

deprecateColumn(DemonstrationSkill::$tableName);
deprecateColumn(DemonstrationSkill::getHistoryTableName());


return static::STATUS_EXECUTED;
<?php

namespace Slate\CBL\Demonstrations;
use DB;


$tableName = DemonstrationSkill::$tableName;
$constraintName = 'DemonstrationSkill';


// skip conditions
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::getConstraint($tableName, $constraintName)) {
    printf("Skipping migration because constraint `%s` already exists\n", $constraintName);
    return static::STATUS_SKIPPED;
}


// find duplicate values
$duplicatePairs = DB::allRecords(
    'SELECT DemonstrationID, SkillID, COUNT(*) AS Total, MAX(Created) AS LastCreated, MAX(ID) AS LastID FROM `%s` GROUP BY DemonstrationID, SkillID HAVING Total > 1 ORDER BY LastID',
    [
        $tableName
    ]
);

printf("Found %u sets of duplicate DemonstrationID+SkillID values\n\n", count($duplicatePairs));

foreach ($duplicatePairs as $pair) {
    printf("Found duplicate: DemonstrationID=%u + SkillID=%u last updated %s\n", $pair['DemonstrationID'], $pair['SkillID'], $pair['LastCreated']);

    $records = DB::allRecords('SELECT * FROM `%s` WHERE DemonstrationID = %u AND SkillID = %u ORDER BY ID', [
        $tableName,
        $pair['DemonstrationID'],
        $pair['SkillID']
    ]);

    $firstID = null;
    $duplicateIDs = [];
    $lastRating = null;

    foreach ($records as $record) {
        if ($firstID) {
            $duplicateIDs[] = $record['ID'];
        } else {
            $firstID = $record['ID'];
        }

        $lastRating = $record['DemonstratedLevel'];

        printf("\tLevel=%02u\tRating=%02u\tID=%u\tCreated=%s\n", $record['TargetLevel'], $record['DemonstratedLevel'], $record['ID'], $record['Created']);
    }

    printf("\n\tSetting Rating=%u where ID=%u, deleting %s\n\n", $lastRating, $firstID, implode(', ', $duplicateIDs));

    DB::nonQuery('UPDATE `%s` SET DemonstratedLevel = %u WHERE ID = %u', [$tableName, $lastRating, $firstID]);
    DB::nonQuery('DELETE FROM `%s` WHERE ID IN (%s)', [$tableName, implode(',', $duplicateIDs)]);
}

print("Finished resolving duplicates\n");


// drop solo index on DemonstrationID
$demonstrationIdColumn = static::getColumn($tableName, 'DemonstrationID');

if ($demonstrationIdColumn['COLUMN_KEY'] == 'MUL') {
    printf("Updating table `%s`, dropping index on DemonstrationID\n", $tableName);
    DB::nonQuery('ALTER TABLE `%s` DROP INDEX `DemonstrationID`', $tableName);
}


// add unique key on (DemonstrationID, SkillID)
if (!static::getConstraint($tableName, $constraintName)) {
    printf("Updating table `%s`, adding unique constraint `%s`\n", $tableName, $constraintName);
    DB::nonQuery('ALTER TABLE `%s` ADD UNIQUE INDEX `%s` (DemonstrationID, SkillID)', [$tableName, $constraintName]);
}


// done
return static::STATUS_EXECUTED;
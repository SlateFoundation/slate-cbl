<?php

namespace Slate\CBL;
use DB;


$tableName = StudentCompetency::$tableName;


// skip conditions
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists($tableName, 'Level')) {
    printf("Skipping migration because column `%s`.Level already exists\n", $tableName);
    return static::STATUS_SKIPPED;
}


// migration
printf("Updating table `%s`\n", $tableName);
DB::nonQuery('ALTER TABLE `%s` ADD `Level` tinyint NOT NULL, ADD `EnteredVia` enum("enrollment","graduation") NOT NULL', $tableName);
DB::nonQuery('UPDATE `%s` SET Level = 10, EnteredVia = "graduation"', $tableName);
DB::nonQuery('ALTER TABLE `%s` DROP COLUMN `CompletionType`', $tableName);
DB::nonQuery('ALTER TABLE `%s` DROP INDEX `StudentCompetency`, ADD UNIQUE INDEX `StudentCompetency` (StudentID, CompetencyID, Level)', $tableName);
DB::nonQuery('ALTER TABLE `%s` DROP INDEX `CompetencyID`, DROP INDEX `StudentID`', $tableName);


// done
return static::STATUS_EXECUTED;
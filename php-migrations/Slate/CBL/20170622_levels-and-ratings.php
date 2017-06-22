<?php

namespace Slate\CBL;
use DB;


$tableName = Demonstrations\DemonstrationSkill::$tableName;


// skip conditions
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists($tableName, 'Rating')) {
    printf("Skipping migration because column `%s`.Rating already exists\n", $tableName);
    return static::STATUS_SKIPPED;
}


// migration
printf("Updating table `%s`\n", $tableName);
DB::nonQuery('ALTER TABLE `%s` CHANGE `TargetLevel` `Level` tinyint NULL default NULL', $tableName);
DB::nonQuery('ALTER TABLE `%s` CHANGE `DemonstratedLevel` `Rating` tinyint unsigned NOT NULL', $tableName);


// done
return static::STATUS_EXECUTED;
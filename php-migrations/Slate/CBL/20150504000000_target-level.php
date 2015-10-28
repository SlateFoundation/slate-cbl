<?php

namespace Slate\CBL;
use DB;


$tableName = Demonstrations\DemonstrationSkill::$tableName;


// skip conditions
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists($tableName, 'TargetLevel')) {
    printf("Skipping migration because column `%s`.TargetLevel already exists\n", $tableName);
    return static::STATUS_SKIPPED;
}


// migration
printf("Updating table `%s`\n", $tableName);
DB::nonQuery('ALTER TABLE `%s` ADD `TargetLevel` tinyint NULL DEFAULT NULL AFTER `SkillID`', $tableName);
DB::nonQuery('ALTER TABLE `%s` CHANGE `Level` `DemonstratedLevel` tinyint NOT NULL', $tableName);
DB::nonQuery('UPDATE `%s` SET `TargetLevel` = 9', $tableName);


// done
return static::STATUS_EXECUTED;
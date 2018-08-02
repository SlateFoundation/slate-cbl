<?php

namespace Slate\CBL\Demonstrations;


use DB;


// skip if DemonstrationTask table does not exist or already has ClonedTaskID
if (!static::tableExists(DemonstrationSkill::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", DemonstrationSkill::$tableName);
    return static::STATUS_SKIPPED;
}

if (static::getColumnIsNullable(DemonstrationSkill::$tableName, 'DemonstratedLevel')) {
    printf("Skipping migration because column `%s`.`DemonstratedLevel` already nullable\n", DemonstrationSkill::$tableName);
    return static::STATUS_SKIPPED;
}


// make DemonstratedLevel column nullable
DB::nonQuery(
    'ALTER TABLE `%s` CHANGE `DemonstratedLevel` `DemonstratedLevel` tinyint unsigned NULL default NULL',
    DemonstrationSkill::$tableName
);

// set to null anywhere Override is true
DB::nonQuery(
    'UPDATE `%s` SET DemonstratedLevel = NULL WHERE Override',
    DemonstrationSkill::$tableName
);


// finish
return static::STATUS_EXECUTED;
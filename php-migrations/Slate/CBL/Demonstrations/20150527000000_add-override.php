<?php

namespace Slate\CBL;
use DB;


$tableName = Demonstrations\DemonstrationSkill::$tableName;


// skip conditions
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::columnExists($tableName, 'Override')) {
    printf("Skipping migration because column `%s`.Override already exists\n", $tableName);
    return static::STATUS_SKIPPED;
}


// migration
printf("Updating table `%s`\n", $tableName);
DB::nonQuery('ALTER TABLE `%s` ADD `Override` boolean NOT NULL default 0', $tableName);


// done
return static::STATUS_EXECUTED;
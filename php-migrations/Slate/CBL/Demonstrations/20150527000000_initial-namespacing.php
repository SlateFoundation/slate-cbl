<?php

namespace Slate\CBL\Demonstrations;

use DB;

$tableName = Demonstration::$tableName;
$historyTableName = Demonstration::$historyTable;
$newType = 'enum(\'Slate\\\\CBL\\\\Demonstrations\\\\Demonstration\',\'Slate\\\\CBL\\\\Demonstrations\\\\ExperienceDemonstration\',\'Slate\\\\CBL\\\\Demonstrations\\\\OverrideDemonstration\')';


// skip conditions
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

if (static::getColumnType($tableName, 'Class') == $newType) {
    printf("Skipping migration because `%s`.`Class` column already has correct type\n", $tableName);
    return static::STATUS_SKIPPED;
}


// migration
printf("Upgrading column `%s`.`Class`\n", $tableName);

DB::nonQuery(
    'ALTER TABLE `%s` CHANGE `Class` `Class` %s NOT NULL,
                      CHANGE `ExperienceType` `ExperienceType` varchar(255) NULL default NULL,
                      CHANGE `Context` `Context` varchar(255) NULL default NULL,
                      CHANGE `PerformanceType` `PerformanceType` varchar(255) NULL default NULL',
    [
        $tableName,
        $newType
    ]
);

DB::nonQuery(
    'UPDATE `%s` SET `Class` = "Slate\\\\CBL\\\\Demonstrations\\\\ExperienceDemonstration"',
    $tableName
);


printf("Upgrading column `%s`.`Class`\n", $historyTableName);

DB::nonQuery(
    'ALTER TABLE `%s` CHANGE `Class` `Class` %s NOT NULL,
                      CHANGE `ExperienceType` `ExperienceType` varchar(255) NULL default NULL,
                      CHANGE `Context` `Context` varchar(255) NULL default NULL,
                      CHANGE `PerformanceType` `PerformanceType` varchar(255) NULL default NULL',
    [
        $historyTableName,
        $newType
    ]
);

DB::nonQuery(
    'UPDATE `%s` SET `Class` = "Slate\\\\CBL\\\\Demonstrations\\\\ExperienceDemonstration"',
    $historyTableName
);


return static::STATUS_EXECUTED;
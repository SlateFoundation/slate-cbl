<?php

namespace Slate\CBL\Demonstrations;

use DB;

$tableName = DemonstrationSkill::$tableName;
$newType = 'enum(\'Slate\\\\CBL\\\\Demonstrations\\\\DemonstrationSkill\')';


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
    'ALTER TABLE `%s` CHANGE `Class` `Class` %s NOT NULL',
    [
        $tableName,
        $newType
    ]
);

DB::nonQuery(
    'UPDATE `%s` SET `Class` = "Slate\\\\CBL\\\\Demonstrations\\\\DemonstrationSkill"',
    $tableName
);


return static::STATUS_EXECUTED;
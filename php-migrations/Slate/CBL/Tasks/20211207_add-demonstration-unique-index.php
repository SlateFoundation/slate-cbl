<?php

namespace Slate\CBL\Tasks;
use DB;


$tableName = StudentTask::$tableName;


// skip conditions
if (!static::tableExists($tableName)) {
    printf("Skipping migration because table `%s` does not exist yet\n", $tableName);
    return static::STATUS_SKIPPED;
}

$skipped = true;


// drop solo index on DemonstrationID
$demonstrationIdColumn = static::getColumn($tableName, 'DemonstrationID');

if ($demonstrationIdColumn['COLUMN_KEY'] != 'UNI') {
    printf("Updating table `%s`, dropping existing non-unique index on DemonstrationID\n", $tableName);
    DB::nonQuery('ALTER TABLE `%s` DROP INDEX `DemonstrationID`', $tableName);
    $skipped = false;
}


// add unique key on (DemonstrationID, SkillID)
if (!static::getConstraint($tableName, 'DemonstrationID')) {
    printf("Updating table `%s`, adding unique constraint `DemonstrationID`\n", $tableName);
    DB::nonQuery('ALTER TABLE `%s` ADD UNIQUE KEY `DemonstrationID` (DemonstrationID)', $tableName);
    $skipped = false;
}


// done
return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;
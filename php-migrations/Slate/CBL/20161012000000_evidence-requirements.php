<?php

namespace Slate\CBL;

use DB;

$newColumnType = 'JSON';
$newColumnDefinition = $newColumnType . ' NOT NULL';

$originalColumnName = 'DemonstrationsRequired';
$tempColumnName = 'DemonstrationsRequiredJSON';
$skillTable = Skill::$tableName;

$skipped = true;

// skip conditions
if (!static::tableExists($skillTable)) {
    return static::STATUS_SKIPPED;
}

// migration
if (static::getColumnType($skillTable, $originalColumnName) != $newColumnType) {
    // create new column with temporary name
    printf("Creating JSON column ($newColumnDefinition) in table `$skillTable` with temporary name.");
    DB::nonQuery('ALTER TABLE `%s` ADD COLUMN `%s` %s', $skillTable, $tempColumnName, $newColumnDefinition);

    // set er values in new column
    printf("Setting default value for new DemonstrationsRequired column");
    DB::nonQuery(
        'UPDATE `%s` '
        .' SET %s = JSON_OBJECT("default", DemonstrationsRequired)',
        $skillTable,
        $tempColumnName
    );

    // sanity check
    $failed = DB::oneValue( // confirm
        'SELECT COUNT(*) FROM `%s` '
        .'WHERE DemonstrationsRequired != %s->"$.default"',
        $skillTable,
        $tempColumnName
    );

    if ($failed) {
        printf("Failed to confirm new column values.");
        return static::STATUS_FAILED; // confirm
    }

    // remove older column
    printf("Removing original column $originalColumnName");
    DB::nonQuery(
        'ALTER TABLE `%s` '
        .' DROP COLUMN %s',
        $skillTable,
        $originalColumnName
    );

    // rename newer column
    printf("Renaming column from $tempColumnName -> $originalColumnName");
    DB::nonQuery(
        'ALTER TABLE `%s` '
        .' CHANGE %s %s %s',
        $skillTable,
        $tempColumnName,
        $originalColumnName,
        $newColumnDefinition
    );


    $skipped = false;
}

return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;
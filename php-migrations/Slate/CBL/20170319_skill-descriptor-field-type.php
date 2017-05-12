<?php

namespace Slate\CBL;

use DB;

$newColumnType = 'TEXT';
$skillTable = Skill::$tableName;

if (!static::tableExists($skillTable)) {
    print('Skipping, table does not exist.');
    return static::STATUS_SKIPPED;
}

if (static::getColumnType($skillTable, 'Descriptor') == $newColumnType) {
    print('Skipping, column type already migrated.');
    return static::STATUS_SKIPPED;
}

DB::nonQuery('ALTER TABLE `%s` CHANGE COLUMN `Descriptor` `Descriptor` %s NOT NULL', [$skillTable, $newColumnType]);
DB::nonQuery('ALTER TABLE `%s` CHANGE COLUMN `Descriptor` `Descriptor` %s NOT NULL', [$skillTable, $newColumnType]);

return static::STATUS_EXECUTED;
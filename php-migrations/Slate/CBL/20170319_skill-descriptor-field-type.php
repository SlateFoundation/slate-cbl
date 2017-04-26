<?php

namespace Slate\CBL;

$newColumnType = 'TEXT';

if (!static::tableExists(Skill::$tableName)) {
    print('Skippingo table does not exist.');
    return static::STATUS_SKIPPED;
}

if (static::getColumnType(Skill::$tableName, 'Descriptor') == $newColumnType) {
    print('Skipping, column type already migrated.');
    return static::STATUS_SKIPPED;
}

\DB::nonQuery("ALTER TABLE " . Skill::$tableName . " CHANGE COLUMN `Descriptor` `Descriptor` $newColumnType NOT NULL");
\DB::nonQuery("ALTER TABLE " . Skill::$historyTable . " CHANGE COLUMN `Descriptor` `Descriptor` $newColumnType NOT NULL");

return static::STATUS_EXECUTED;
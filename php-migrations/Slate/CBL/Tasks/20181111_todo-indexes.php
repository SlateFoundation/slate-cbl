<?php

namespace Slate\CBL\Tasks;

$status = static::STATUS_SKIPPED;

// skip if table does not exist yet
if (!static::tableExists(Todo::$tableName)) {
    printf("Skipping migration because table `%s` does not yet exist\n", Todo::$tableName);
    return $status;
}

// ensure StudentID column has index
if (!static::getColumn(Todo::$tableName, 'StudentID')['COLUMN_KEY']) {
    static::addIndex(Todo::$tableName, 'StudentID');
    $status = static::STATUS_EXECUTED;
}


// ensure SectionID column has index
if (!static::getColumn(Todo::$tableName, 'SectionID')['COLUMN_KEY']) {
    static::addIndex(Todo::$tableName, 'SectionID');
    $status = static::STATUS_EXECUTED;
}


return $status;

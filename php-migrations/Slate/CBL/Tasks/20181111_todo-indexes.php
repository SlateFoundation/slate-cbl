<?php

namespace Slate\CBL\Tasks;

$status = static::STATUS_SKIPPED;


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

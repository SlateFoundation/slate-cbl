<?php

namespace Slate\CBL\Tasks;

use DB;

// update invalid column values from "0000-00-00 00:00:00" to NULL

if (!static::tableExists(StudentTask::$tableName)) {
    return static::STATUS_SKIPPED;
}

$selectStatement = 'SELECT ID FROM `%s` WHERE ExpirationDate = "0000-00-00 00:00:00"';

$studentTaskIdsWithInvalidDates = DB::allValues('ID', $selectStatement, StudentTask::$tableName);
$historyTaskIds = DB::allValues('ID', $selectStatement, 'history_'.StudentTask::$tableName);

if (empty($studentTaskIdsWithInvalidDates) && empty($historyTaskIds)) {
    return static::STATUS_SKIPPED;
}

// allow 0000-00-00 00:00:00 timestamps
$sqlMode = DB::oneValue(
    'SELECT @@SESSION.sql_mode AS session'
);
// remove NO_ZERO_DATE, NO_ZERO_IN_DATE sql_mode's from session to allow table alterations
$tempSqlMode = array_filter(
    explode(
        ",",
        $sqlMode
    ),
    function($v) {
        return !preg_match("/NO_ZERO(_.+)?_DATE/", $v);
    }
);

DB::nonQuery(
    'SET SESSION sql_mode = "%s"',
    $tempSqlMode
);

$updateStatement = 'UPDATE `%s` SET ExpirationDate = NULL WHERE ExpirationDate = "0000-00-00 00:00:00"';

DB::nonQuery($updateStatement, StudentTask::$tableName);
DB::nonQuery($updateStatement, 'history_'.StudentTask::$tableName);

// reset sql mode
DB::nonQuery('SET SESSION sql_mode = "%s"', $sqlMode);

return static::STATUS_EXECUTED;
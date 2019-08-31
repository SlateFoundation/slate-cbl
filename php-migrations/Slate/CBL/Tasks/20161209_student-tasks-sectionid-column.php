<?php

namespace Slate\CBL\Tasks;

use DB;

if (!static::tableExists(StudentTask::$tableName)) {
    return static::STATUS_SKIPPED;
}

// check if CourseSectionID column has been updated to SectionID
if (!static::columnExists(StudentTask::$tableName, 'CourseSectionID')) {
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

$studentTaskIds = DB::allValues('ID', 'SELECT ID FROM `%s` WHERE CourseSectionID = 0 OR CourseSectionID IS NULL', StudentTask::$tableName);

if (!empty($studentTaskIds)) {
    // delete "ghost" student tasks and related data
    $deleteStatement = 'DELETE FROM `%s` WHERE ID IN (%s)';
    DB::nonQuery($deleteStatement, [StudentTask::$tableName, join(", ", $studentTaskIds)]);
    DB::nonQuery('DELETE FROM `%s` WHERE StudentTaskID IN (%s)', [StudentTaskSkill::$tableName, join(", ", $studentTaskIds)]);
    DB::nonQuery('DELETE FROM `%s` WHERE StudentTaskID IN (%s)', [StudentTaskSubmission::$tableName, join(", ", $studentTaskIds)]);
    DB::nonQuery('DELETE FROM `%s` WHERE ContextClass = "%s" AND ContextID IN (%s)', [Attachments\AbstractTaskAttachment::$tableName, StudentTask::getStaticRootClass(), join(", ", $studentTaskIds)]);
}

// add SectionID column
$statement = 'ALTER TABLE `%s` ADD COLUMN `SectionID` INT UNSIGNED NOT NULL AFTER StudentID';
DB::nonQuery($statement, StudentTask::$tableName);
// (history table)
DB::nonQuery($statement, 'history_'.StudentTask::$tableName);

// update SectionID column values
DB::nonQuery('UPDATE %s SET SectionID = CourseSectionID', StudentTask::$tableName);
// (history table)
DB::nonQuery('UPDATE %s SET SectionID = CourseSectionID WHERE CourseSectionID >= 1', 'history_'.StudentTask::$tableName);

// drop CourseSectionID column
$dropColumnStatement = 'ALTER TABLE `%s` DROP COLUMN `CourseSectionID`';
DB::nonQuery($dropColumnStatement, StudentTask::$tableName);
// (history table)
DB::nonQuery($dropColumnStatement, 'history_'.StudentTask::$tableName);

// reset sql mode
DB::nonQuery('SET SESSION sql_mode = "%s"', $sqlMode);

return static::STATUS_EXECUTED;
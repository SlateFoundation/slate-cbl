<?php

namespace Slate\CBL;

use DB;

$newColumnType = 'json';
$newColumnDefinition = $newColumnType . ' NOT NULL';

$originalColumnName = 'DemonstrationsRequired';
$tempColumnName = 'DemonstrationsRequiredJSON';
$skillTable = Skill::$tableName;
$skillsHistoryTable = 'history_'.$skillTable;

$deprecatedColumns = [
    'FirstLevel' => 9,
    'SecondLevel' => 10,
    'ThirdLevel' => 11,
    'FourthLevel' => 12
];

$skipped = true;

// skip conditions
if (!static::tableExists($skillTable)) {
    return static::STATUS_SKIPPED;
}

if ($historyTableExists = static::tableExists($skillsHistoryTable)) { // workaround for 'zero' dates in history table
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
}

// migration
if (static::getColumnType($skillTable, $originalColumnName) != $newColumnType) {
    // create new column with temporary name
    if (!static::columnExists($skillsTable, $tempColumnName)) {
        printf("Creating JSON column ($newColumnDefinition) in table `$skillTable` with temporary name: $tempColumnName\n");
        DB::nonQuery(
            'ALTER TABLE `%s` ADD COLUMN `%s` %s',
            [
                $skillTable,
                $tempColumnName,
                $newColumnDefinition
            ]
        );
    }

    // set er values in new column
    printf("Setting default value for new DemonstrationsRequired column\n");
    DB::nonQuery(
        'UPDATE `%s` '
        .' SET %s = IF(DemonstrationsRequired LIKE "{%%}", DemonstrationsRequired, JSON_OBJECT("default", DemonstrationsRequired))',
        [
            $skillTable,
            $tempColumnName
        ]
    );

    // sanity check
    $failed = DB::oneValue(
        'SELECT COUNT(*) FROM `%s` '
        .'WHERE IF(DemonstrationsRequired LIKE "{%%}", CAST(DemonstrationsRequired->"$.default" AS UNSIGNED), DemonstrationsRequired) != CAST(%s->"$.default" AS UNSIGNED)',
        [
            $skillTable,
            $tempColumnName
        ]
    );

    if ($failed) {
        printf("Failed to confirm new column values\n");
        return static::STATUS_FAILED;
    }

    // check if deprecated level based columns exist
    foreach ($deprecatedColumns as $levelColumnPrefix => $levelColumnValue) {
        $columnName = $levelColumnPrefix . 'DemonstrationsRequired';

        if (static::columnExists($skillTable, $columnName)) {
            // add level value to column's json object
            DB::nonQuery(
                'UPDATE `%1$s` '
                .'SET %2$s = JSON_INSERT(%2$s, \'$."%4$u"\', %3$s) '
                .'WHERE DemonstrationsRequired != %3$s',
                [
                    $skillTable,
                    $tempColumnName,
                    $columnName,
                    $levelColumnValue
                ]
            );

            // sanity check
            $failed = DB::oneValue(
                'SELECT COUNT(*) FROM `%1$s` '
                .'WHERE %2$s != IFNULL(JSON_EXTRACT(%4$s, \'$."%3$u"\'), JSON_EXTRACT(%4$s, "$.default"))',
                [
                    $skillTable,
                    $columnName,
                    $levelColumnValue,
                    $tempColumnName
                ]
            );

            if ($failed) {
                printf("Failed to confirm new values for Level %u from column: %s", $levelColumnValue, $columnName);
                return static::STATUS_FAILED;
            }

            // remove older column
            printf("Removing deprecated column $columnName from `$skillTable`\n");
            DB::nonQuery(
                'ALTER TABLE `%s` '
                .' DROP COLUMN %s',
                [
                    $skillTable,
                    $columnName
                ]
            );
        }

        if ($historyTableExists && static::columnExists($skillsHistoryTable, $columnName)) {
            printf("Removing deprecated column $columnName from `$skillsHistoryTable`\n");
            DB::nonQuery(
                'ALTER TABLE `%s` '
                .' DROP COLUMN %s',
                [
                    $skillsHistoryTable,
                    $columnName
                ]
            );
        }
    }

    // remove older column
    printf("Removing original column $originalColumnName\n");
    DB::nonQuery(
        'ALTER TABLE `%s` '
        .' DROP COLUMN %s',
        [
            $skillTable,
            $originalColumnName
        ]
    );

    // rename newer column
    printf("Renaming column from $tempColumnName -> $originalColumnName\n");
    DB::nonQuery(
        'ALTER TABLE `%s` '
        .' CHANGE %s %s %s',
        [
            $skillTable,
            $tempColumnName,
            $originalColumnName,
            $newColumnDefinition
        ]
    );

    // alter history table original column
    if ($historyTableExists) {
        printf("Reconfiguring history table column into JSON column\n");
        DB::nonQuery(
            'ALTER TABLE `%s` '
            .' CHANGE %s %s %s',
            [
                $skillsHistoryTable,
                $originalColumnName,
                $originalColumnName,
                $newColumnDefinition
            ]
        );

        // reset sql mode for session
        DB::nonQuery(
            'SET SESSION sql_mode = "%s"',
            $sqlMode
        );
    }


    $skipped = false;
}

return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;

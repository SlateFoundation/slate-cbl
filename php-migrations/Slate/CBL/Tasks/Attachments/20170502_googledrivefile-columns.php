<?php

namespace Slate\CBL\Tasks\Attachments;

use DB;


if (!static::tableExists(GoogleDriveFile::$tableName)) {
    print('Table does not exist, skipping migration.');
    return static::STATUS_SKIPPED;
}

$skipped = true;
if (!static::columnExists(GoogleDriveFile::$tableName, 'FileID')) {
    $statement = 'ALTER TABLE `%s` ADD COLUMN `FileID` INT(10) UNSIGNED NULL DEFAULT NULL';

    print('Adding `FileID` column to table.');
    DB::nonQuery($statement, [GoogleDriveFile::$tableName]);
    $skipped = false;
}

if (!static::columnExists(GoogleDriveFile::$tableName, 'FileRevisionID')) {
    $statement = 'ALTER TABLE `%s` ADD COLUMN `FileRevisionID` VARCHAR(255) NULL DEFAULT NULL';

    print('Adding `FileRevisionID` column to table.');
    DB::nonQuery($statement, [GoogleDriveFile::$tableName]);
    $skipped = false;
}

if (!static::columnExists(GoogleDriveFile::$tableName, 'ShareMethod')) {
    $statement = "ALTER TABLE `%s` ADD COLUMN `ShareMethod` ENUM('duplicate','view-only','collaborate') NULL DEFAULT NULL";

    print('Adding `ShareMethod` column to table.');
    DB::nonQuery($statement, [GoogleDriveFile::$tableName]);
    $skipped = false;
}

if (!static::columnExists(GoogleDriveFile::$tableName, 'ParentAttachmentID')) {
    $statement = "ALTER TABLE `%s` ADD COLUMN `ParentAttachmentID` INT(10) UNSIGNED NULL DEFAULT NULL";

    print('Adding `ParentAttachmentID` column to table.');
    DB::nonQuery($statement, [GoogleDriveFile::$tableName]);
    $skipped = false;
}

if (static::columnExists(GoogleDriveFile::$tableName, 'ExternalID')) {
    print('Removing deprecated column ExternalID');
    DB::nonQuery('ALTER TABLE `%s` DROP COLUMN `ExternalID`', [GoogleDriveFile::$tableName]);
    $skipped = false;
}

return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;
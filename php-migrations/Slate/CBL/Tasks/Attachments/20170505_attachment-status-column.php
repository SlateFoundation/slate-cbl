<?php

namespace Slate\CBL\Tasks\Attachments;

if (!static::tableExists(AbstractTaskAttachment::$tableName)) {
    print('Table does not exist yet, skipping migration.');
    return static::STATUS_SKIPPED;
}

if (static::columnExists(AbstractTaskAttachment::$tableName, 'Status')) {
    print('Column exists, skipping migration.');
    return static::STATUS_SKIPPED;
}

$statement = "ALTER TABLE `%s` ADD COLUMN `Status` ENUM('%s') NOT NULL DEFAULT '%s'";
$params = [
    AbstractTaskAttachment::$tableName,
    join("', '", AbstractTaskAttachment::getFieldOptions('Status', 'values')),
    AbstractTaskAttachment::getFieldOptions('Status', 'default')
];

printf('Adding `Status` column to `%s`', AbstractTaskAttachment::$tableName);
\DB::nonQuery($statement, $params);

return static::columnExists(AbstractTaskAttachment::$tableName, 'Status') ? static::STATUS_EXECUTED : static::STATUS_FAILED;


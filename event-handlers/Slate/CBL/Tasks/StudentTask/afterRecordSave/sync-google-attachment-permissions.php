<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\Attachments\GoogleDriveFile;

$StudentTask = $_EVENT['Record'];
$GoogleDriveClass = GoogleDriveFile::class;

// assign later, sync permissions
if ($StudentTask->isNew && !$StudentTask->Task->isNew) {
    foreach ($StudentTask->Task->Attachments as $Attachment) {
        if ($Attachment->isA(GoogleDriveFile::class)) {
            $Attachment->syncUserPermissions($StudentTask->Student);
        }
    }
}
<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\Attachments\GoogleDriveFile;

$StudentTask = $_EVENT['Record'];
$GoogleDriveClass = GoogleDriveFile::class;
$attachments = [];

// assign later, sync permissions
if ($StudentTask->isNew) {
    foreach ($StudentTask->Task->Attachments as $Attachment) {
        if ($Attachment->isA(GoogleDriveFile::class)) {
            $attachments[] = $Attachment;
        }
    }
}

if (count($attachments)) {
    GoogleDriveFile::syncUsersPermissions($attachments, [$StudentTask->Student]);
}
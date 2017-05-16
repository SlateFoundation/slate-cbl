<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\Attachments\GoogleDriveFile;

$Task = $_EVENT['Record'];
$GoogleDriveClass = GoogleDriveFile::class;

foreach ($Task->Attachments as $Attachment) {
    if ($Attachment->isA(GoogleDriveFile::class)) {
        if ($Attachment->isNew) { // sync all permissions
            $Attachment->syncPermissions();
        }
    }   
}

<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\Attachments\GoogleDriveFile;

$Task = $_EVENT['Record'];
$GoogleDriveClass = GoogleDriveFile::class;

// sync google drive file permssions for when creating new tasks, or editing a task with new attachments
foreach ($Task->Attachments as $Attachment) {
    if ($Attachment->isA(GoogleDriveFile::class)) {
        if ($Attachment->isNew) { // sync all permissions
            foreach ($Attachment->getRequiredPermissions() as $Person) {
                $Attachment->syncUserPermissions($Person);
            }
            if ($Attachment->ShareMethod != 'duplicate') {
                $Attachment->syncDefaultPermissions();
            }
        }
    }   
}

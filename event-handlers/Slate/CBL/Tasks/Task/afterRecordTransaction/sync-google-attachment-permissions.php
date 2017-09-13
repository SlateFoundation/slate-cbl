<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\Attachments\GoogleDriveFile;

$Task = $_EVENT['Record'];
$GoogleDriveClass = GoogleDriveFile::class;
$attachments = [];
$newAttachments = [];
$students = [];

// sync google drive file permssions for when creating new tasks, or editing a task with new attachments
if ($Task->isNew) {
    foreach ($Task->Attachments as $Attachment) {
        if ($Attachment->isA(GoogleDriveFile::class)) {
            $attachments[] = $Attachment;
        }
    }
} else {
    foreach ($Task->StudentTasks as $StudentTask) {
        if ($StudentTask->isNew) {
            $students[] = $StudentTask->Student;
        }
    }

    foreach ($Task->Attachments as $Attachment) {
        if ($Attachment->isA(GoogleDriveFile::class)) {
            if ($Attachment->isNew) {
                $newAttachments[] = $Attachment;
            } elseif (count($students)) {
                $attachments[] = $Attachment;
            }
        }
    }

    if (count($newAttachments)) {
        GoogleDriveFile::syncUsersPermissions($newAttachments);
    }
}

if (!empty($attachments)) {
    GoogleDriveFile::syncUsersPermissions($attachments, $students);
}
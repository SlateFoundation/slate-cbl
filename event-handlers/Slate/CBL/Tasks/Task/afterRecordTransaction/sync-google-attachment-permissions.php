<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\Attachments\GoogleDriveFile;

$Task = $_EVENT['Record'];
$GoogleDriveClass = GoogleDriveFile::class;
$attachments = [];
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

    if (count($students)) {
        foreach ($Task->Attachments as $Attachment) {
            if ($Attachment->isA(GoogleDriveFile::class)) {
                $attachments[] = $Attachment;
            }
        }
    }
}

if (!empty($attachments)) {
    GoogleDriveFile::syncUsersPermissions($attachments, $students);
}
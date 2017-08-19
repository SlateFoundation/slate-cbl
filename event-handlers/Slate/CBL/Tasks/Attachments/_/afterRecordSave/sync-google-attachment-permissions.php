<?php

namespace Slate\CBL\Tasks\Attachments;

use Slate\People\Student;
use Slate\CBL\Tasks\StudentTask;

$Attachment = $_EVENT['Record'];

// student attached a drive file
if ($Attachment->isNew && $Attachment->Context && $Attachment->Context->isA(StudentTask::class) && $Attachment->Creator && $Attachment->Creator->isA(Student::class)) {
    GoogleDriveFile::syncUsersPermissions([$Attachment]);
}
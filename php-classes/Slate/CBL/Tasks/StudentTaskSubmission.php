<?php

namespace Slate\CBL\Tasks;

class StudentTaskSubmission extends \VersionedRecord
{
    public static $tableName = 'cbl_student_task_submissions';
    public static $historyTable = 'history_cbl_student_task_submissions';
    public static $singularNoun = 'student task submission';
    public static $pluralNoun = 'student task submissions';

    public static $fields = [
        'StudentTaskID' => 'uint'
    ];

    public static $relationships = [
        'StudentTask' => [
            'type' => 'one-one',
            'local' => 'StudentTaskID',
            'class' => StudentTask::class
        ]
    ];
}

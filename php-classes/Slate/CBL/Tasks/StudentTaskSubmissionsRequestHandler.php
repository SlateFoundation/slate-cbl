<?php

namespace Slate\CBL\Tasks;


class StudentTaskSubmissionsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = StudentTask::class;
    public static $accountLevelBrowse = 'User';

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        $student = static::getRequestedStudent();

        // TODO: do something? delete this file?
    }
}

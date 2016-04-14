<?php

namespace Slate\CBL\Tasks;

class TasksRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass =  Task::class;
    public static $browseOrder = ['ID' => 'ASC'];
}
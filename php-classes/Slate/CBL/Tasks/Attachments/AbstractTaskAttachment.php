<?php

namespace Slate\CBL\Tasks\Attachments;

use Slate\CBL\Tasks\Task;

abstract class AbstractTaskAttachment extends \ActiveRecord
{
    public static $tableName = 'task_attachments';

    public static $singularNoun = 'task attachment';
    public static $pluralNoun = 'task attachments';

    public static $fields = [
        'TaskID' => 'uint',
        'Title' => [
            'type' => 'string',
            'default' => null
        ]
    ];

    public static $relationships = [
        'Task' => [
            'type' => 'one-one',
            'class' => Task::class
        ]
    ];
}
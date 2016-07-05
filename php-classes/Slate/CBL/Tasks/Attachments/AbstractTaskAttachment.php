<?php

namespace Slate\CBL\Tasks\Attachments;

use Slate\CBL\Tasks\Task;

class AbstractTaskAttachment extends \ActiveRecord
{
    public static $tableName = 'cbl_task_attachments';

    public static $singularNoun = 'task attachment';
    public static $pluralNoun = 'task attachments';
    
    public static $subClasses =  [
        GoogleDocument::class,
        Link::class
    ];
    
    public static $defaultClass = Link::class;

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
<?php

namespace Slate\CBL\Tasks\Attachments;

use Slate\CBL\Tasks\Task;

class AbstractTaskAttachment extends \ActiveRecord
{
    public static $tableName = 'cbl_task_attachments';

    public static $singularNoun = 'task attachment';
    public static $pluralNoun = 'task attachments';

    public static $subClasses =  [
        GoogleDriveFile::class,
        Link::class
    ];

    public static $defaultClass = Link::class;

    public static $fields = [
        'ContextClass',
        'ContextID' => 'uint',
        'Title' => [
            'type' => 'string',
            'default' => null
        ],
        'Status' => [
            'type' => 'enum',
            'values' => ['normal', 'removed'],
            'default' => 'normal'
        ]
    ];

    public static $relationships = [
        'Context' => [
            'type' => 'context-parent'
        ]
    ];
}
<?php

namespace Slate\CBL\Tasks\Attachments;

class GoogleDocument extends Link
{
    public static $fields = [
        'FileID' => 'uint',
        'RevisionID',
        'Share' => [
            'type' => 'enum',
            'values' => ['duplicate', 'view-only', 'collaborate'],
            'default' => 'view-only'
        ]
    ];

    public static $validators = [
        'File' => [
            'validator' => 'require-relationship',
            'required' => true
        ],
        'RevisionID' => [
            'validator' => 'string',
            'required' => true
        ]
    ];
}
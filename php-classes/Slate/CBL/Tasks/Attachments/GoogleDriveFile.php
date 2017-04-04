<?php

namespace Slate\CBL\Tasks\Attachments;

class GoogleDriveFile extends Link
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

    public static $relationships = [
        'File' => [
            'type' => 'one-one',
            'class' => \Google\File::class
        ]
    ];
}
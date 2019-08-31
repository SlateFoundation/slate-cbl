<?php

namespace Slate\CBL\Tasks\Attachments;

class Link extends AbstractTaskAttachment
{
    public static $fields = [
        'URL' => 'string'
    ];

    public static $validators = [
        'URL' => [
            'validator' => 'URL',
            'required' => true
        ]
    ];
}

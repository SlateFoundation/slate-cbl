<?php

namespace Slate\CBL\Tasks\Attachments;

class GoogleDocument extends AbstractTaskAttachment
{
    public static $fields = [
        'ExternalID'
    ];

    public static $validators = [
        'ExternalID' => [
            'validator' => 'string',
            'required' => true
        ]
    ];
}
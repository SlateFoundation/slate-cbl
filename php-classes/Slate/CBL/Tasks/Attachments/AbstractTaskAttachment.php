<?php

namespace Slate\CBL\Tasks\Attachments;

use Exception;

use ActiveRecord;

use Slate\CBL\Tasks\Task;

abstract class AbstractTaskAttachment extends ActiveRecord
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

    /**
     * Differentially apply a complete array of new attachments data to a give context
     */
    public static function applyAttachmentsData(ActiveRecord $Context, array $attachmentsData)
    {
        // index existing attachment records by ID
        $existingAttachments = [];

        foreach ($Context->Attachments as $Attachment) {
            $existingAttachments[$Attachment->ID] = $Attachment;
        }


        // create new and update existing attachments
        $attachments = [];
        foreach ($attachmentsData as $attachmentData) {
            if (
                !empty($attachmentData['ID'])
                && ($Attachment = $existingAttachments[$attachmentData['ID']])
            ) {
                $Attachment->setFields($attachmentData);
                unset($existingAttachments[$attachmentData['ID']]);
            } elseif (!empty($attachmentData['Class'])) {
                $attachmentClass = $attachmentData['Class'];
                $Attachment = $attachmentClass::create($attachmentData);
            } else {
                throw new Exception('Attachment data must have ID or Class set');
            }

            $attachments[] = $Attachment;
        }


        // set unrefresh existing assignments to removed
        foreach ($existingAttachments as $Attachment) {
            $Attachment->Status = 'removed';
            $attachments[] = $Attachment;
        }


        // write new list to relationship
        $Context->Attachments = $attachments;
    }
}

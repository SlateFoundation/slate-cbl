<?php

namespace Slate\Progress;


class SectionInterimReport extends AbstractSectionTermReport
{
    public static $cssTpl = 'section-interim-reports/_css';
    public static $bodyTpl = 'section-interim-reports/_body';


    public static $tableName = 'section_interim_reports';
    public static $singularNoun = 'section interim report';
    public static $pluralNoun = 'section interim reports';
    public static $collectionRoute = '/progress/section-interim-reports';

    public static $defaultClass = __CLASS__;
    public static $subClasses = [__CLASS__];

    public static $fields = [
        'Notes' => [
            'type' => 'clob',
            'default' => null
        ],
        'NotesFormat' => [
            'type' => 'enum',
            'values' => ['markdown', 'html'],
            'default' => 'markdown'
        ]
    ];

    public static $indexes = [
        'StudentSectionTerm' => [
            'fields' => ['StudentID', 'SectionID', 'TermID'],
            'unique' => true
        ]
    ];

    public static function getNoun($count = 1)
    {
        return $count == 1 ? 'interim report' : 'interim reports';
    }
}
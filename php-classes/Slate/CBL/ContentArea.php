<?php

namespace Slate\CBL;

class ContentArea extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_content_areas';
    public static $singularNoun = 'content area';
    public static $pluralNoun = 'content areas';
    public static $collectionRoute = '/cbl/content-areas';

    public static $fields = [
        'Code' => [
            'type' => 'string'
            ,'unique' => true
        ]
        ,'Title' => 'string'
    ];

    public static $relationships = [
        'Competencies' => [
            'type' => 'one-many'
            ,'class' => 'Slate\\CBL\\Competency'
            ,'foreign' => 'ContentAreaID'
            ,'order' => ['Code' => 'ASC']
        ]
    ];
    
    public static $validators = [
        'Title' => [
            'errorMessage' => 'A title is required'
        ]
    ];
    
    public static $dynamicFields = [
        'Competencies'
    ];

    public function getHandle()
    {
        return $this->Code;
    }

    public static function getByHandle($handle)
    {
        return static::getByCode($handle);
    }

    public static function getByCode($code)
    {
        return static::getByField('Code', $code);
    }

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        // check handle uniqueness
        if ($this->isFieldDirty('Code') && !$this->_validator->hasErrors('Code') && $this->Code) {
            $ExistingRecord = static::getByHandle($this->Code);

            if ($ExistingRecord && ($ExistingRecord->ID != $Record->ID)) {
                $validator->addError('Code', 'Code already registered');
            }
        }

        // save results
        return $this->finishValidation();
    }

    public function save($deep = true)
    {
        // set code
        if (!$this->Code) {
            $this->Code = \HandleBehavior::getUniqueHandle($this, $this->Title, [
                'handleField' => 'Code'
            ]);
        }

        // call parent
        parent::save($deep);
    }
}
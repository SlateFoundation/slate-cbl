<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;

class TasksRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass =  Task::class;
    public static $browseOrder = ['ID' => 'ASC'];
    public static $browseConditions = [
        'Status' => [
            'operator' => '!=',
            'value' => 'deleted'
        ]
    ];
    
    public static function handleRecordsRequest($action = false) 
    {
        switch ($action = ($action ?: static::shiftPath())) {
            case '*experience-types':
                return static::handleFieldValuesRequest('ExperienceType');
            
            default:
                return parent::handleRecordsRequest($action);
        }
    }
    
    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        if (!empty($_REQUEST['excludeSubtasks'])) {
            $conditions['ParentTaskID'] = null;
        }
        
        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }
    
    public static function handleFieldValuesRequest($fieldName)
    {
        $recordClass = static::$recordClass;
        
        $recordFields = $recordClass::aggregateStackedConfig('fields');
        
        if (!array_key_exists($fieldName, $recordFields)) {
            return static::throwInvalidRequestError(sprintf('Field: %s not found.', $fieldName));
        }
        
        $field = $recordFields[$fieldName];
        $query = $_REQUEST['q'];
        
        switch ($field['type']) {
            case 'enum':
                $values = $field['values'];
                if ($query) {
                    $conditions = '/^([a-z0-9_-\s]+)?'.$query.'([a-z0-9_-\s]+)?$/i';
                    $values = array_values(array_filter($values, function($v) use ($conditions) {
                        return preg_match($conditions, $v, $matches);
                    }));
                    break;
                } else if (!empty($values)) {
                    break;
                }
                //if empty, trp getting unique values from API
            
            case 'string':
            case 'uint':
                
                if ($query) {
                    $conditions = sprintf('%s LIKE "%%%s%%"', $field['columnName'], \DB::escape($query));
                } else {
                    $conditions = 1;
                }
                
                $values = \DB::allValues($field['columnName'], 'SELECT %1$s FROM `%2$s` WHERE %3$s GROUP BY %1$s', [$field['columnName'], $recordClass::$tableName, $conditions]);
                break;
        }
        
        
        foreach ($values as &$v) {
            
            $v = [
                'name' => $v
            ];
        }
        
        return static::respond('task-field-values', [
            'data' => $values,
            'field' => $fieldName,
            'total' => count($values)
        ]);
#        \MICS::dump($values, 'values', true);
    }
    
    protected static function onRecordSaved(\ActiveRecord $Record, $data)
    {
        //update skills
        if (isset($data['SkillIDs'])) {
            $originalSkills = $Record->Skills;
            $originalSkillIds = array_map(function($s) {
                return $s->ID;
            }, $originalSkills);
            
            $oldSkillIds = array_diff($originalSkillIds, $data['SkillIDs']);
            $newSkillIds = array_diff($data['SkillIDs'], $originalSkillIds);
#            \MICS::dump([
#                'original skills' => $originalSkills,
#                'original skill ids' => $originalSkillIds,
#                'old skill ids' => $oldSkillIds,
#                'new skill ids' => $newSkillIds
#            ], 'dump', true);
            foreach ($newSkillIds as $newSkill) {
                TaskSkill::create([
                    'TaskID' => $Record->ID,
                    'SkillID' => $newSkill
                ], true);
            }
            
            if (!empty($oldSkillIds)) {
#                \MICS::dump($oldSkillIds)
                \DB::nonQuery('DELETE FROM `%s` WHERE TaskID = %u AND SkillID IN ("%s")', [
                    TaskSkill::$tableName,
                    $Record->ID,
                    join('", "', $oldSkillIds)
                ]);
            }
        }
        
        //update attachments
        if (isset($data['Attachments'])) {
            $originalAttachments = $Record->Attachments;
            $originalAttachmentIds = array_map(function($s) {
                return $s->ID;
            }, $originalAttachments);
            
            $failed = [];
            $attachmentIds = [];
            $attachments = [];
            $defaultAttachmentClass = AbstractTaskAttachment::$defaultClass;
            
            foreach ($data['Attachments'] as $attachmentData) {
                $attachmentClass = $attachmentData['Class'] ?: $defaultAttachmentClass;
                if ($attachmentData['ID'] >= 1) {
                    if (!$Attachment = $attachmentClass::getByID($attachmentData['ID'])) {
                        $failed[] = $attachmentData;
                        continue;
                    }
                } else {
                    $Attachment = $attachmentClass::create($attachmentData);
                }
                
                $Attachment->TaskID = $Record->ID;
                $Attachment->save();
                $attachments[] = $Attachment;
                $attachmentIds[] = $Attachment->ID;
                
            }
            
#            \MICS::dump([
#                'attachment data' => $data['Attachments'],
#                'original attachments' => $originalAttachments,
#                'original attachment ids' => $originalAttachmentIds,
#                'old attachment ids' => $oldAttachmentsIds
##                'new attachment ids' => $newAttachmentIds
#            ], 'dump', true);
            
#            if (!empty($oldAttachmentIds)) {
            \DB::nonQuery('DELETE FROM `%s` WHERE TaskID = %u AND ID NOT IN ("%s")', [
                AbstractTaskAttachment::$tableName,
                $Record->ID,
                join('", "', $attachmentIds)
            ]);
#            }
        }
        $Record->Attachments = $attachments;
#        \MICS::dump($Record->Attachments, 'record attachments', true);
    }
}
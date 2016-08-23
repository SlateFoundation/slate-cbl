<?php

namespace Slate\CBL\Tasks;

use Slate\People\Student;
use Slate\CBL\Skill;
use Emergence\Comments\Comment;
use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;

class StudentTasksRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass =  StudentTask::class;
    public static $accountLevelBrowse = 'User';
    //public static $browseOrder = ['TaskID' => 'ASC'];


    public static function handleRecordsRequest($action = false)
    {
        $CurrentUser = $GLOBALS['Session']->Person;

        switch ($action = $action ?: static::shiftPath()) {
            case 'assigned':
                return static::handleBrowseRequest([], [
                    'StudentID' => $CurrentUser
                ]);
            default:
                return parent::handleRecordsRequest($action);
        }
    }


    public static function handleRecordRequest(\ActiveRecord $Record, $action = false)
    {
        switch ($action = $action ?: static::shiftPath()) {
            case 'rate':
                return static::handleRateSkillRequest($Record);
            default:
                return parent::handleRecordRequest($Record, $action);
        }
    }

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        if (isset($_REQUEST['course_section'])) {
            if (!$Section = \Slate\Courses\Section::getByHandle($_REQUEST['course_section'])) {
                return static::throwInvalidRequestError('Course section not found.');
            }

            $conditions['CourseSectionID'] = $Section->ID;
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }

    public static function handleRateSkillRequest(StudentTask $Record)
    {
        $requestData = $_REQUEST;
        $rating = $requestData['Score'];
        $skillId = $requestData['SkillID'];
        $error = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            if (!isset($skillId) || !$Skill = Skill::getByHandle($skillId)) {
                $error = sprintf('Skill %s not found.', $skillId);
            } else {

                if (!$skillRating = StudentTaskSkillRating::getByWhere(['StudentTaskID' => $Record->ID, 'SkillID' => $Skill->ID])) {
                    $skillRating = StudentTaskSkillRating::create([
                        'StudentTaskID' => $Record->ID,
                        'SkillID' => $Skill->ID
                    ]);
                }

                $skillRating->Score = $rating;
                $skillRating->save(false);
            }


        }

        return static::respond('studenttask/ratings', [
            'data' => $skillRating,
            'record' => $Record,
            'success' => empty($error),
            'error' => $error
        ]);
    }

    public static function onRecordSaved(\ActiveRecord $Record, $data)
    {

        if (is_array($data) && isset($data['Comment'])) {
            Comment::create([
                'ContextClass' => $Record->getRootClass(),
                'ContextID' => $Record->ID,
                'Message' => $data['Comment']
            ], true);
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

                $Attachment->ContextID = $Record->ID;
                $Attachment->ContextClass = $Record->getRootClass();
                $Attachment->save();
                $attachments[] = $Attachment;
                $attachmentIds[] = $Attachment->ID;
            }


            \DB::nonQuery('DELETE FROM `%s` WHERE ContextClass = "%s" AND ContextID = %u AND ID NOT IN ("%s")', [
                AbstractTaskAttachment::$tableName,
                $Record->getRootClass(),
                $Record->ID,
                join('", "', $attachmentIds)
            ]);

        }
        $Record->Attachments = $attachments;

    }

    public static function checkWriteAccess(\ActiveRecord $Record, $suppressLogin = false)
    {
        if ($Record && $Record->StudentID == $GLOBALS['Session']->PersonID) {
            return true;
        }

        return parent::checkWriteAccess($Record, $suppressLogin);
    }


}

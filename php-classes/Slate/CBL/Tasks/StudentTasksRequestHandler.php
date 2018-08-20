<?php

namespace Slate\CBL\Tasks;


use DB;
use JSON;
use ActiveRecord;
use Emergence\Comments\Comment;


use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;

use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;

use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;
use Slate\CBL\Tasks\Attachments\GoogleDriveFile;


class StudentTasksRequestHandler extends \Slate\CBL\RecordsRequestHandler
{
    public static $recordClass =  StudentTask::class;
    public static $accountLevelBrowse = 'User';

    protected static function buildBrowseConditions(array $conditions = [], array &$filterObjects = [])
    {
        global $Session;

        $conditions = parent::buildBrowseConditions($conditions);

        // apply student filter
        if ($Student = static::getRequestedStudent()) {
            $conditions['StudentID'] = $Student->ID;
            $filterObjects['Student'] = $Student;
        } elseif (!$Session || !$Session->hasAccountLevel('Staff')) {
            // only staff can load without a student filter
            $conditions[] = 'FALSE';
        }

        // apply task or course_section filter
        if ($Task = static::getRequestedTask()) {
            $conditions['TaskID'] = $Task->ID;
            $filterObjects['Task'] = $Task;
        } elseif ($Section = static::getRequestedSection()) {
            $conditions['TaskID'] = [
                'values' => DB::allValues('ID', 'SELECT ID FROM `%s` WHERE SectionID = %u', [ Task::$tableName, $Section->ID ])
            ];
            $filterObjects['CourseSection'] = $Section;
        }

        return $conditions;
    }

    protected static function applyRecordDelta(ActiveRecord $StudentTask, $requestData)
    {
        if (array_key_exists('DemonstrationSkills', $requestData)) {
            $demonstrationSkillsData = $requestData['DemonstrationSkills'];
            unset($requestData['DemonstrationSkills']);
        }


        parent::applyRecordDelta($StudentTask, $requestData);


        if (isset($demonstrationSkillsData)) {
            // save skills not associated with parent task
            $skills = [];
            foreach ($demonstrationSkillsData as $demonstrationSkillData) {
                if (empty($demonstrationSkillData['SkillID'])) {
                    throw new Exception('demonstration skill requires SkillID be set');
                }

                $skills[$demonstrationSkillData['SkillID']] = true;
            }

            foreach ($StudentTask->Task->TaskSkills as $TaskSkill) {
                unset($skills[$TaskSkill->SkillID]);
            }

            foreach ($skills as $skillId => &$StudentTaskSkill) {
                $StudentTaskSkill = StudentTaskSkill::create([
                    'SkillID' => $skillId
                ]);
            }

            $StudentTask->TaskSkills = array_values($skills);


            // save ratings via an attached demonstration
            $Demonstration = $StudentTask->getOrCreateDemonstration();
            $Demonstration->recordAffectedStudentCompetencies();
            $Demonstration->applySkillsData($demonstrationSkillsData);
        }
    }

    // public static function handleRecordsRequest($action = false)
    // {
    //     switch ($action = $action ?: static::shiftPath()) {
    //         // TODO: re-implement as query params on browse endpoint
    //         case 'assigned':
    //             return static::handleAssignedRequest();

    //         // TODO: re-implement endpoint RE: https://jarvus.atlassian.net/browse/CBL-215
    //         case 'submit':
    //             return static::handleStudentTaskSubmissionRequest();
    //         default:
    //             return parent::handleRecordsRequest($action);
    //     }
    // }


    // public static function handleRecordRequest(\ActiveRecord $Record, $action = false)
    // {
    //     switch ($action = $action ?: static::shiftPath()) {
    //         case 'rate':
    //             return static::handleRateSkillRequest($Record);
    //         default:
    //             return parent::handleRecordRequest($Record, $action);
    //     }
    // }

    // public static function handleAssignedRequest($options = [], $conditions = [])
    // {
    //     $student = static::_getRequestedStudent();

    //     $conditions['StudentID'] = $student->ID;

    //     return static::handleBrowseRequest($options, $conditions);

    // }

    // public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    // {
    //     $student = static::_getRequestedStudent();
    //     $courseSection = static::_getRequestedCourseSection();

    //     if ($courseSection) {
    //         $conditions['TaskID'] = [
    //             'values' => DB::allValues('ID', 'SELECT ID FROM `%s` WHERE SectionID = %u', [Task::$tableName, $courseSection->ID])
    //         ];
    //     }

    //     return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    // }

    // public static function handleRateSkillRequest(StudentTask $StudentTask)
    // {
    //     // collect input
    //     if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    //         return static::throwInvalidRequestError('POST required');
    //     }

    //     $requestData = JSON::getRequestData() ?: $_POST;


    //     // validate request
    //     if (empty($requestData['SkillID'])) {
    //         return static::throwError('SkillID required');
    //     }

    //     if (!array_key_exists('Rating', $requestData)) {
    //         return static::throwError('Rating required');
    //     }

    //     if (!$Skill = Skill::getByHandle($requestData['SkillID'])) {
    //         return static::throwError('Skill "%s" not found', $requestData['SkillID']);
    //     }

    //     if (!$StudentCompetency = StudentCompetency::getCurrentForStudent($StudentTask->Student, $Skill->Competency)) {
    //         return static::throwError('Student %s not enrolled in competency %s', $StudentTask->Student->Username, $Skill->Competency->Code);
    //     }


    //     // load existing data
    //     $Demonstration = $StudentTask->getDemonstration();

    //     $DemonstrationSkill = DemonstrationSkill::getByWhere([
    //         'DemonstrationID' => $Demonstration->ID,
    //         'SkillID' => $Skill->ID
    //     ]);


    //     // destroy or update record
    //     if ($requestData['Rating'] === null) {
    //         if ($DemonstrationSkill) {
    //             $DemonstrationSkill->destroy();
    //         }
    //     } else {
    //         if (!$DemonstrationSkill) {
    //             $DemonstrationSkill = DemonstrationSkill::create([
    //                 'DemonstrationID' => $Demonstration->ID,
    //                 'SkillID' => $Skill->ID,
    //                 'TargetLevel' => $StudentCompetency->Level
    //             ]);
    //         }

    //         $DemonstrationSkill->DemonstratedLevel = $requestData['Rating'];
    //         $DemonstrationSkill->save(false);
    //     }


    //     // return response with full StudentTask supplemental record
    //     return static::respond('ratingUpdated', [
    //         'success' => true,
    //         'data' => $DemonstrationSkill,
    //         'StudentTask' => $StudentTask
    //     ]);
    // }

    // public static function handleStudentTaskSubmissionRequest()
    // {
    //     $_REQUEST = JSON::getRequestData();

    //     if ($_REQUEST) {
    //         $StudentTask = static::getRecordByHandle($_REQUEST['ID']);
    //     }

    //     static::setStudentTaskAttachments($StudentTask, $_REQUEST);
    //     if (!empty($StudentTask->Submissions) || $StudentTask->TaskStatus == 're-assigned') {
    //         $StudentTask->TaskStatus = 're-submitted';
    //     } else {
    //         $StudentTask->TaskStatus = 'submitted';
    //     }

    //     $StudentTask->save();

    //     $StudentTaskSubmission = new StudentTaskSubmission();
    //     $StudentTaskSubmission->StudentTaskID = $StudentTask->ID;
    //     $StudentTaskSubmission->save();

    //     return static::respond('submitted', [
    //         'data' => $StudentTask,
    //         'success' => true,
    //     ]);
    // }

    // public static function setStudentTaskAttachments(StudentTask $Record, $requestData)
    // {

    //     $defaultAttachmentClass = AbstractTaskAttachment::$defaultClass;

    //     $attachments = [];
    //     if (isset($requestData['Attachments'])) {
    //         foreach ($requestData['Attachments'] as $attachmentData) {
    //             $attachmentClass = $attachmentData['Class'] ?: $defaultAttachmentClass;
    //             if ($attachmentData['ID'] >= 1) {
    //                 if (!$Attachment = $attachmentClass::getByID($attachmentData['ID'])) {
    //                     $failed[] = $attachmentData;
    //                     continue;
    //                 }

    //                 if (!empty($attachmentData['Status']) && in_array($attachmentData['Status'], $defaultAttachmentClass::getFieldOptions('Status', 'values'))) {
    //                      $Attachment->Status = $attachmentData['Status'];
    //                  }
    //             } else {
    //                 $Attachment = $attachmentClass::create($attachmentData);
    //             }

    //             if ($Attachment instanceof Attachments\GoogleDriveFile) {
    //                 if (!$Attachment->File) {
    //                     if (!$File = \Google\DriveFile::getByField('DriveID', $attachmentData['File']['DriveID'])) {
    //                         $File = \Google\DriveFile::create($attachmentData['File']);
    //                         if (!$File->OwnerEmail && $GLOBALS['Session']->Person && $GLOBALS['Session']->Person->PrimaryEmail) {
    //                             $File->OwnerEmail = $GLOBALS['Session']->Person->PrimaryEmail->toString();
    //                         }
    //                     }
    //                     $Attachment->File = $File;
    //                 } else if ($Attachment->File->isPhantom && $File = \Google\DriveFile::getByField('DriveID', $attachmentData['File']['DriveID'])) {
    //                     $Attachment->File = $File;
    //                 }
    //             }

    //             $Attachment->Context = $Record;
    //             $attachments[] = $Attachment;
    //         }

    //         $Record->Attachments = $attachments;
    //     }

    // }

    // public static function onRecordSaved(\ActiveRecord $Record, $data)
    // {

    //     if (is_array($data) && isset($data['Comment'])) {
    //         Comment::create([
    //             'ContextClass' => $Record->getRootClass(),
    //             'ContextID' => $Record->ID,
    //             'Message' => $data['Comment']
    //         ], true);
    //     }

    //      //update skills
    //     if (isset($data['SkillIDs'])) {
    //         $originalSkills = $Record->Skills;
    //         $originalSkillIds = array_map(function($s) {
    //             return $s->ID;
    //         }, $originalSkills);

    //         $oldSkillIds = array_diff($originalSkillIds, $data['SkillIDs']);
    //         $newSkillIds = array_diff($data['SkillIDs'], $originalSkillIds);

    //         foreach ($newSkillIds as $newSkill) {
    //             if (!$taskSkill = TaskSkill::getByWhere(['TaskID' => $Record->Task->ID, 'SkillID' => $newSkill])) { // check if skill is attached to related task first
    //                 StudentTaskSkill::create([
    //                     'StudentTaskID' => $Record->ID,
    //                     'SkillID' => $newSkill
    //                 ], true);
    //             }
    //         }

    //         if (!empty($oldSkillIds)) {

    //             DB::nonQuery('DELETE FROM `%s` WHERE StudentTaskID = %u AND SkillID IN ("%s")', [
    //                 StudentTaskSkill::$tableName,
    //                 $Record->ID,
    //                 join('", "', $oldSkillIds)
    //             ]);
    //         }
    //     }
    // }

    public static function checkWriteAccess(\ActiveRecord $Record = null, $suppressLogin = false)
    {
        if ($Record && $Record->StudentID == $GLOBALS['Session']->PersonID) {
            return true;
        }

        return parent::checkWriteAccess($Record, $suppressLogin);
    }
}
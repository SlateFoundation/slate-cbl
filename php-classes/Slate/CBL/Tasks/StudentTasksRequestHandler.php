<?php

namespace Slate\CBL\Tasks;

use DB;
use Slate\People\Student;
use Slate\CBL\Skill;
use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;
use Slate\CBL\Tasks\Attachments\GoogleDriveFile;
use Slate\Courses\SectionsRequestHandler;
use Emergence\People\PeopleRequestHandler;
use Emergence\Comments\Comment;
use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;

class StudentTasksRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass =  StudentTask::class;
    public static $accountLevelBrowse = 'User';

    public static function handleRecordsRequest($action = false)
    {
        switch ($action = $action ?: static::shiftPath()) {
            case 'assigned':
                return static::handleAssignedRequest();

            // TODO: re-implement endpoint RE: https://jarvus.atlassian.net/browse/CBL-215
            case 'submit':
                return static::handleStudentTaskSubmissionRequest();
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

    public static function handleAssignedRequest($options = [], $conditions = [])
    {
        $student = static::_getRequestedStudent();

        $conditions['StudentID'] = $student->ID;

        return static::handleBrowseRequest($options, $conditions);

    }

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        $student = static::_getRequestedStudent();
        $courseSection = static::_getRequestedCourseSection();

        if ($courseSection) {
            $conditions['SectionID'] = $courseSection->ID;
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }

    public static function handleRateSkillRequest(StudentTask $Record)
    {

        $requestData = $_REQUEST;
        $skillId = $requestData['SkillID'];
        $rating = $requestData['Score'];

        $error = null;

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            if (!$rating || $rating == 'N/A') {
                return static::handleSkillRatingRemoval($Record, $skillId);
            } else if ($rating == 'M') {
                $rating = 0;
            }

            $Demonstration = $Record->getDemonstration();

            if (!isset($skillId) || !$Skill = Skill::getByHandle($skillId)) {
                $error = sprintf('Skill %s not found.', $skillId);
            } else {
                $competencyLevel = $Skill->Competency->getCurrentLevelForStudent($Record->Student);

                if (!$demoSkill = DemonstrationSkill::getByWhere(['DemonstrationID' => $Demonstration->ID, 'SkillID' => $Skill->ID, 'TargetLevel' => $competencyLevel])) {
                    $demoSkill = DemonstrationSkill::create([
                        'DemonstrationID' => $Demonstration->ID,
                        'SkillID' => $Skill->ID,
                        'TargetLevel' => $competencyLevel
                    ]);
                }

                $demoSkill->DemonstratedLevel = $rating;
                $demoSkill->save(false);
            }
        }

        return static::respond('studenttask/ratings', [
            'data' => $demoSkill,
            'record' => $Record,
            'success' => empty($error),
            'error' => $error
        ]);
    }

    public static function handleSkillRatingRemoval(StudentTask $Record, $skillId)
    {
        $destroyed = false;

        if (
            ($demonstration = $Record->Demonstration) &&
            ($skill = Skill::getByHandle($skillId)) &&
            ($competencyLevel = $skill->Competency->getCurrentLevelForStudent($Record->Student)) &&
            ($demonstrationSkill = DemonstrationSkill::getByWhere([
                'DemonstrationID' => $Record->DemonstrationID,
                'SkillID' => $skill->ID,
                'TargetLevel' => $competencyLevel
            ]))
        ) {
            $destroyed = $demonstrationSkill->destroy();
        } else {
            return static::throwInvalidRequestError('Unable to rate skill. Please try again or contact an administrator.');
        }

        return static::respond('studenttask/ratings', [
            'success' => $destroyed,
            'record' => $Record
        ]);

    }

    public static function handleStudentTaskSubmissionRequest()
    {
        $_REQUEST = \JSON::getRequestData();

        if ($_REQUEST) {
            $StudentTask = static::getRecordByHandle($_REQUEST['ID']);
        }

        static::setStudentTaskAttachments($StudentTask, $_REQUEST);
        if (!empty($StudentTask->Submissions) || $StudentTask->TaskStatus == 're-assigned') {
            $StudentTask->TaskStatus = 're-submitted';
        } else {
            $StudentTask->TaskStatus = 'submitted';
        }

        $StudentTask->save();

        $StudentTaskSubmission = new StudentTaskSubmission();
        $StudentTaskSubmission->StudentTaskID = $StudentTask->ID;
        $StudentTaskSubmission->save();

        return static::respond('studenttask/submit', [
            'data' => $StudentTask,
            'success' => true,
        ]);
    }

    public static function setStudentTaskAttachments(StudentTask $Record, $requestData)
    {

        $defaultAttachmentClass = AbstractTaskAttachment::$defaultClass;

        $attachments = [];
        if (isset($requestData['Attachments'])) {
            foreach ($requestData['Attachments'] as $attachmentData) {
                $attachmentClass = $attachmentData['Class'] ?: $defaultAttachmentClass;
                if ($attachmentData['ID'] >= 1) {
                    if (!$Attachment = $attachmentClass::getByID($attachmentData['ID'])) {
                        $failed[] = $attachmentData;
                        continue;
                    }

                    if (!empty($attachmentData['Status']) && in_array($attachmentData['Status'], $defaultAttachmentClass::getFieldOptions('Status', 'values'))) {
                         $Attachment->Status = $attachmentData['Status'];
                     }
                } else {
                    $Attachment = $attachmentClass::create($attachmentData);
                }

                if ($Attachment instanceof Attachments\GoogleDriveFile) {
                    if (!$Attachment->File) {
                        if (!$File = \Google\DriveFile::getByField('DriveID', $attachmentData['File']['DriveID'])) {
                            $File = \Google\DriveFile::create($attachmentData['File']);
                            if (!$File->OwnerEmail && $GLOBALS['Session']->Person && $GLOBALS['Session']->Person->PrimaryEmail) {
                                $File->OwnerEmail = $GLOBALS['Session']->Person->PrimaryEmail->toString();
                            }
                        }
                        $Attachment->File = $File;
                    } else if ($Attachment->File->isPhantom && $File = \Google\DriveFile::getByField('DriveID', $attachmentData['File']['DriveID'])) {
                        $Attachment->File = $File;
                    }
                }

                $Attachment->Context = $Record;
                $attachments[] = $Attachment;
            }

            $Record->Attachments = $attachments;
        }

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

         //update skills
        if (isset($data['SkillIDs'])) {
            $originalSkills = $Record->Skills;
            $originalSkillIds = array_map(function($s) {
                return $s->ID;
            }, $originalSkills);

            $oldSkillIds = array_diff($originalSkillIds, $data['SkillIDs']);
            $newSkillIds = array_diff($data['SkillIDs'], $originalSkillIds);

            foreach ($newSkillIds as $newSkill) {
                if (!$taskSkill = TaskSkill::getByWhere(['TaskID' => $Record->Task->ID, 'SkillID' => $newSkill])) { // check if skill is attached to related task first
                    StudentTaskSkill::create([
                        'StudentTaskID' => $Record->ID,
                        'SkillID' => $newSkill
                    ], true);
                }
            }

            if (!empty($oldSkillIds)) {

                DB::nonQuery('DELETE FROM `%s` WHERE StudentTaskID = %u AND SkillID IN ("%s")', [
                    StudentTaskSkill::$tableName,
                    $Record->ID,
                    join('", "', $oldSkillIds)
                ]);
            }
        }
    }

    public static function checkWriteAccess(\ActiveRecord $Record, $suppressLogin = false)
    {
        if ($Record && $Record->StudentID == $GLOBALS['Session']->PersonID) {
            return true;
        }

        return parent::checkWriteAccess($Record, $suppressLogin);
    }

    protected static function _getRequestedStudent()
    {

        if (!empty($_GET['student'])) {
            $Student = PeopleRequestHandler::getRecordByHandle($_GET['student']);
            $userIsStaff = $GLOBALS['Session']->hasAccountLevel('Staff');

            if ($Student && !$userIsStaff) {
                $GuardianRelationship = \Emergence\People\GuardianRelationship::getByWhere([
                    'PersonID' => $Student->ID,
                    'RelatedPersonID' => $GLOBALS['Session']->PersonID
                ]);
            }

            if (!$Student || (!$userIsStaff && !$GuardianRelationship)) {
                return static::throwNotFoundError('Student not found');
            }
        } else {
            $Student = $GLOBALS['Session']->Person;
        }

        return $Student;
    }

    protected static function _getRequestedCourseSection()
    {
        $CourseSection = null;

        if (!empty($_GET['course_section'])) {
            if (!$CourseSection = SectionsRequestHandler::getRecordByHandle($_GET['course_section'])) {
                return static::throwNotFoundError('Course Section not found');
            }
        }

        return $CourseSection;
    }
}
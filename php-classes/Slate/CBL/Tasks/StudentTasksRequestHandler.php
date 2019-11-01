<?php

namespace Slate\CBL\Tasks;

use Exception;

use DB;
use JSON;
use ActiveRecord;
use UserUnauthorizedException;
use Emergence\Comments\Comment;
use Emergence\People\GuardianRelationship;

use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;
use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;
use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;
use Slate\CBL\Tasks\Attachments\GoogleDriveFile;

class StudentTasksRequestHandler extends \Slate\CBL\RecordsRequestHandler
{
    public static $recordClass =  StudentTask::class;
    public static $accountLevelAPI = 'User';
    public static $accountLevelBrowse = 'User';
    public static $accountLevelRead = 'Staff';
    public static $accountLevelComment = 'Staff';

    protected static function buildBrowseConditions(array $conditions = [], array &$filterObjects = [])
    {
        global $Session;

        $conditions = parent::buildBrowseConditions($conditions);


        // apply student or students filter
        if (!$Session->Person) {
            throw new UserUnauthorizedException();
        } elseif ($Student = static::getRequestedStudent()) {
            $conditions['StudentID'] = $Student->ID;
            $filterObjects['Student'] = $Student;
        } elseif (is_array($students = static::getRequestedStudents())) {
            $conditions['StudentID'] = [
                'values' => array_map(function ($Student) {
                    return $Student->ID;
                }, $students)
            ];
        } elseif (!$Session->hasAccountLevel('Staff')) {
            $conditions['StudentID'] = [
                'values' => array_merge(
                    [$Session->PersonID],
                    GuardianRelationship::getWardIds($Session->Person)
                )
            ];
        }


        // apply task or course_section filter
        if ($Task = static::getRequestedTask()) {
            $conditions['TaskID'] = $Task->ID;
            $filterObjects['Task'] = $Task;
        } elseif ($Section = static::getRequestedSection()) {
            $taskIds = DB::allValues(
                'ID',
                'SELECT ID FROM `%s` WHERE SectionID = %u',
                [
                    Task::$tableName,
                    $Section->ID
                ]
            );

            if (count($taskIds)) {
                $conditions['TaskID'] = [ 'values' => $taskIds ];
            } else {
                // block all results if no tasks match
                $conditions[] = 'FALSE';
            }

            $filterObjects['CourseSection'] = $Section;
        }


        return $conditions;
    }

    protected static function applyRecordDelta(ActiveRecord $StudentTask, $requestData)
    {
        // read related data out from request before applying default field handling
        if (array_key_exists('Attachments', $requestData)) {
            $attachmentsData = $requestData['Attachments'];
            unset($requestData['Attachments']);
        }

        if (array_key_exists('DemonstrationSkills', $requestData)) {
            $demonstrationSkillsData = $requestData['DemonstrationSkills'];
            unset($requestData['DemonstrationSkills']);
        }

        if (!empty($requestData['TaskStatus']) && $requestData['TaskStatus'] == 'submitting') {
            $submitting = true;
            unset($requestData['TaskStatus']);
        }

        if (array_key_exists('Comments', $requestData)) {
            $commentsData = $requestData['Comments'];
            unset($requestData['Comments']);
        }


        // apply default field handling
        parent::applyRecordDelta($StudentTask, $requestData);


        // apply status
        if (!empty($submitting)) {
            $submissions = $StudentTask->Submissions;

            if (count($submissions) || $StudentTask->TaskStatus == 're-assigned') {
                $StudentTask->TaskStatus = 're-submitted';
            } else {
                $StudentTask->TaskStatus = 'submitted';
            }

            $submissions[] = StudentTaskSubmission::create();
            $StudentTask->Submissions = $submissions;
        }


        // apply related attachments
        if (isset($attachmentsData)) {
            Attachments\AbstractTaskAttachment::applyAttachmentsData($StudentTask, $attachmentsData);
        }


        // apply related skills
        if (isset($demonstrationSkillsData)) {
            if (!$StudentTask->userCanRateStudentTask()) {
                throw new UserUnauthorizedException('rate authorization denied');
            }

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


        // apply related comments
        if (isset($commentsData) && $StudentTask->userCanComment()) {
            Comment::applyCommentsData($StudentTask, $commentsData);
        }
    }

    public static function checkWriteAccess(\ActiveRecord $Record = null, $suppressLogin = false)
    {
        if ($Record && $Record->StudentID == $GLOBALS['Session']->PersonID) {
            return true;
        }

        return parent::checkWriteAccess($Record, $suppressLogin);
    }
}
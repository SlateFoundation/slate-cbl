<?php

namespace Slate\CBL\Tasks;

use Exception;
use OutOfBoundsException;

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

use Slate\Courses\Section;
use Slate\Courses\SectionParticipant;

use Slate\Term;

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
            } elseif (!in_array('FALSE', $conditions)) {
                // block all results if no tasks match
                $conditions[] = 'FALSE';
            }

            $filterObjects['CourseSection'] = $Section;
        } elseif ($Sections = static::getRequestedSections()) {
            // get student in question -- default to session user
            if (!$Student) {
                $Student = $Session->Person;
            }

            $sectionConditions = [];
            foreach ($Sections as $section) {
                if (empty($Student)) {
                    $sectionConditions = false;
                    break;
                }

                switch ($section) {
                    case '*currentyear':
                        $termIds = Term::getClosestMasterContainedTermIDs();

                        if (empty($termIds)) {
                            $sectionConditions = false;
                            break 2;
                        }

                        $sectionConditions[] = sprintf(
                            'Section.TermID IN (%s)',
                            join(', ', $termIds)
                        );
                        break;

                    case '*enrolled':
                        $enrollments = SectionParticipant::getAllByWhere([
                            'PersonID' => $Student->ID
                        ]);

                        if (empty($enrollments)) {
                            $sectionConditions = false;
                            break 2;
                        }

                        $sectionConditions[] = sprintf('Section.ID IN (%s)',
                            join(', ',
                                array_map(
                                    function($enrollment) {
                                        return $enrollment->CourseSectionID;
                                    },
                                    $enrollments
                                )
                            )
                        );

                        break;

                    case '*currentterm':
                        $termIds = Term::getClosestConcurrentTermIDs();

                        if (empty($termIds)) {
                            $sectionConditions = false;
                            break 2;
                        }

                        $sectionConditions[] = sprintf(
                            'Section.TermID IN (%s)',
                            join(', ', $termIds)
                        );

                        break;

                    default:
                        throw new OutOfBoundsException('section_filter value: '. $section . ' not valid.');
                }
            }

            if ($sectionConditions === false) {
                if (!in_array('FALSE', $conditions)) {
                    $conditions[] = 'FALSE';
                }
            } else {
                $taskIds = DB::allValues(
                    'TaskID',
                    'SELECT Task.ID as TaskID
                       FROM `%s` Task
                       JOIN `%s` Section
                         ON Section.ID = Task.SectionID
                       JOIN `%s` Term
                         ON Term.ID = Section.TermID
                      WHERE (%s)',
                    [
                        Task::$tableName,
                        Section::$tableName,
                        Term::$tableName,
                        join(' AND ', $sectionConditions)
                    ]
                );

                if (count($taskIds)) {
                    $conditions['TaskID'] = [ 'values' => $taskIds ];
                } elseif (!in_array('FALSE', $conditions)) {
                    // block all results if no tasks match
                    $conditions[] = 'FALSE';
                }
            }
        }

        if ($Status = static::getRequestedStatus()) {
            if (is_array($Status)) {
                $conditions['TaskStatus'] = [
                    'values' => $Status,
                    'operator' => 'IN'
                ];
            } else {
                $conditions['TaskStatus'] = $Status;
            }
        }

        $Timelines = static::getRequestedTimelines();
        if (!empty($Timelines)) {
            $timelineConditions = [];
            foreach ($Timelines as $timeline) {
                switch ($timeline) {
                    case '*late':
                        $timelineConditions[] = '(IFNULL(StudentTask.DueDate, Task.DueDate) < CURDATE())';
                        break;

                    case '*recent':
                        $timelineConditions[] = '(IFNULL(StudentTask.DueDate, Task.DueDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 WEEK) AND DATE_ADD(CURDATE(), INTERVAL 2 WEEK))';
                        break;

                    case '*today':
                        $timelineConditions[] = '(IFNULL(StudentTask.DueDate, Task.DueDate) = CURDATE())';
                        break;

                    case '*currentweek':
                        $timelineConditions[] = '(IFNULL(StudentTask.DueDate, Task.DueDate) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 WEEK))';
                        break;

                    case '*nextweek':
                        $timelineConditions[] = '(IFNULL(StudentTask.DueDate, Task.DueDate) BETWEEN DATE_ADD(CURDATE(), INTERVAL 1 WEEK) AND DATE_ADD(CURDATE(), INTERVAL 2 WEEK))';
                        break;

                    case '*nodate':
                        $timelineConditions[] = '(IFNULL(StudentTask.DueDate, Task.DueDate) IS NULL)';
                        break;

                    default:
                        throw new OutOfBoundsException('timeline filter: '. $timeline . ' is invalid.');
                }
            }

            $studentTaskIds = DB::allValues(
                'StudentTaskID',
                '
                    SELECT StudentTask.ID as StudentTaskID
                      FROM `%1$s` StudentTask
                      JOIN `%2$s` Task
                        ON Task.ID = StudentTask.TaskID
                     WHERE (%3$s)
                ',
                [
                    StudentTask::$tableName,
                    Task::$tableName,
                    join(' OR ', $timelineConditions)
                ]
            );

            if (!empty($studentTaskIds)) {
                $conditions['ID'] = [
                    'values' => $studentTaskIds,
                    'operator' => 'IN'
                ];
            } elseif (!in_array('FALSE', $conditions)) {
                // block all results if no tasks match
                $conditions[] = 'FALSE';
            }
        }

        if (!$Task && !$includeArchived = static::getRequestedArchiveFilter()) { // do not filter archived when retreiving singular task
            $archivedTaskIds = DB::allValues(
                'ID',
                '
                    SELECT ID
                      FROM `%s`
                     WHERE Status = "archived"
                ',
                [ Task::$tableName ]
            );

            if (!empty($archivedTaskIds)) {
                if (isset($conditions['TaskID']['values'])) {
                        $conditions['TaskID']['values'] = array_diff($conditions['TaskID']['values'], $archivedTaskIds);
                } else {
                    $conditions['TaskID'] = [
                        'operator' => 'NOT IN',
                        'values' => $archivedTaskIds
                    ];
                }
            }
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

        // \MICS::dump($requestData, 'request data before');

        // apply default field handling
        parent::applyRecordDelta($StudentTask, $requestData);

        // \MICS::dump($requestData, 'request data after');

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

    public static function getRequestedTimelines($fieldName = 'timeline_filter')
    {
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        $requestedTimeline = $_REQUEST[$fieldName];
        if (!is_array($requestedTimeline)) {
            $requestedTimeline = explode(',', $requestedTimeline);
        }

        $validTimelines = [
            '*late',
            '*recent',
            '*today',
            '*currentweek',
            '*nextweek',
            '*nodate'
        ];
        $timelines = [];
        foreach ($requestedTimeline as $value) {
            if (!in_array($value, $validTimelines)) {
                throw new OutOfBoundsException('timeline_filter value: '.$value . ' invalid.');
            }
            $timelines[] = $value;
        }

        return $timelines;
    }

    public static function getRequestedStatus($fieldName = 'taskstatus')
    {
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        $recordClass = static::$recordClass;
        $validStatuses = $recordClass::getFieldOptions('TaskStatus', 'values');
        $requestedStatuses = $_REQUEST[$fieldName];

        if (!is_array($requestedStatuses)) {
            $requestedStatuses = explode(',', $requestedStatuses);
        }

        $statuses = [];
        foreach ($requestedStatuses as $value) {
            if (!in_array($value, $validStatuses)) {
                throw new OutOfBoundsException('status filter: '. $value . ' is not valid.');
            }

            $statuses[] = $value;
        }
        // if (is_array($_REQUEST[$fieldName])) {
        // } else {
        //     $status = $_REQUEST[$fieldName];
        //     if (!in_array($status, $validStatuses)) {
        //         throw new OutOfBoundsException('status filter: '. $status . ' is not valid.');
        //     }

        //     $statuses[] = $status;
        // }

        return count($statuses) === 1 ? array_pop($statuses) : $statuses;

    }

    public static function getRequestedSections($fieldName = 'section_filter')
    {
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        $requestedSections = $_REQUEST[$fieldName];
        if (!is_array($requestedSections)) {
            $requestedSections = explode(',', $requestedSections);
        }

        $validSectionFilters = [
            '*currentyear',
            '*currentterm',
            '*enrolled'
        ];
        $sections = [];
        foreach ($requestedSections as $section) {
            if (!in_array($section, $validSectionFilters)) {
                throw new OutOfBoundsException('section_filter value: '.$section.' invalid.');
            }
            $sections[] = $section;
        }

        return $sections;
    }

    public static function getRequestedArchiveFilter($fieldName = 'include_archived')
    {
        if (empty($_REQUEST[$fieldName])) {
            return null;
        }

        if ($_REQUEST[$fieldName] === 'false') {
            $_REQUEST[$fieldName] = false;
        }

        return !!$_REQUEST[$fieldName];
    }
}
<?php

namespace Slate\CBL\Tasks;

use Emergence\People\IPerson;
use Emergence\People\Person;
use Emergence\Comments\Comment;
use Emergence\People\GuardianRelationship;

use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;
use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\ExperienceDemonstration;

class StudentTask extends \VersionedRecord
{
    public static $rateExpiredMissing = false;
    public static $canSubmitStatuses = ['assigned'];
    public static $canResubmitStatuses = ['re-assigned', 'submitted', 're-submitted'];
    public static $canReassignStatuses = ['assigned', 'submitted', 're-submitted', 'completed'];
    public static $canCompleteStatuses = ['assigned', 're-assigned', 'submitted', 're-submitted'];


    //VersionedRecord configuration
    public static $historyTable = 'history_cbl_student_tasks';


    // ActiveRecord configuration
    public static $tableName = 'cbl_student_tasks';
    public static $singularNoun = 'student task';
    public static $pluralNoun = 'student tasks';
    public static $collectionRoute = '/cbl/student-tasks';


    public static $fields = [
        'TaskID' => 'uint',
        'StudentID' => 'uint',

        'TaskStatus' => [
            'type' => 'enum',
            'notnull' => true,
            'values' => ['assigned', 're-assigned', 'submitted', 're-submitted', 'completed'],
            'default' => 'assigned'
        ],
        'DemonstrationID' => [
            'type' => 'uint',
            'default' => null,
            'index' => true
        ],

        // Task fields that can be overridden
        'DueDate' => [
            'type' => 'timestamp',
            'default' => null
        ],
        'ExpirationDate' => [
            'type' => 'timestamp',
            'default' => null
        ]
    ];

    public static $relationships = [
        'Task' => [
            'type' => 'one-one',
            'local' => 'TaskID',
            'class' => Task::class
        ],
        'Student' => [
            'type' => 'one-one',
            'local' => 'StudentID',
            'class' => Person::class
        ],
        'Comments' => [
            'type' => 'context-children',
            'class' => Comment::class
        ],
        'Attachments' => [
            'type' => 'context-children',
            'class' => Attachments\AbstractTaskAttachment::class
        ],
        'Submissions' => [
            'type' => 'one-many',
            'class' => StudentTaskSubmission::class,
            'foreign' => 'StudentTaskID',
            'local' => 'ID',
            'order' => ['ID' => 'ASC']
        ],
        'TaskSkills' => [
            'type' => 'one-many',
            'class' => StudentTaskSkill::class,
            'prune' => 'delete'
        ],
        'Skills' => [
            'type' => 'many-many',
            'class' => Skill::class,
            'linkClass' => StudentTaskSkill::class,
            'linkLocal' => 'StudentTaskID',
            'linkForeign' => 'SkillID'
        ],
        'Demonstration' => [
            'type' => 'one-one',
            'class' => Demonstration::class
        ]
    ];

    public static $dynamicFields = array(
        'Task',
        'Student',
        'SkillRatings',
        'Comments',
        'Attachments',
        'Submissions',
        'Skills',
        'Demonstration',
        'Submitted' => [
            'getter' => 'getSubmissionTimestamp'
        ]
    );

    public static $indexes = [
        'StudentTask' => [
            'fields' => ['TaskID', 'StudentID'],
            'unique' => true
        ]
    ];

    public static $validators = [
        'Task' => 'require-relationship',
        'Student' => 'require-relationship'
    ];

    public static $searchConditions = [
        'Task' => [
            'qualifiers' => ['task'],
            'points' => 2,
            'sql' => 'TaskID = %u'
        ],
        'Student' => [
            'qualifiers' => ['student'],
            'points' => 2,
            'sql' => 'StudentID = %u'
        ]
    ];

    public function getEffectiveDueDate()
    {
        if ($this->DueDate) {
            return $this->DueDate;
        }

        if ($this->Task) {
            return $this->Task->DueDate;
        }

        return null;
    }

    public function getEffectiveExpirationDate()
    {
        if ($this->ExpirationDate) {
            return $this->ExpirationDate;
        }

        if ($this->Task) {
            return $this->Task->ExpirationDate;
        }

        return null;
    }


    public function getOrCreateDemonstration()
    {
        if (!$this->Demonstration) {
            $this->Demonstration = ExperienceDemonstration::create([
                'StudentID' => $this->StudentID,
                'PerformanceType' => $this->Task->Title,
                'Context' => $this->Task->Section->Title,
                'ExperienceType' => $this->Task->ExperienceType
            ]);
        }

        return $this->Demonstration;
    }

    public function getAvailableActions(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        $actions = parent::getAvailableActions($User);

        $actions['submit'] = $this->userCanSubmitStudentTask($User);
        $actions['resubmit'] = $this->userCanResubmitStudentTask($User);
        $actions['rate'] = $this->userCanRateStudentTask($User);
        $actions['reassign'] = $this->userCanReassignStudentTask($User);
        $actions['complete'] = $this->userCanCompleteStudentTask($User);
        $actions['comment'] = $this->userCanComment($User);

        return $actions;
    }

    public function userCanCreateRecord(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        return $User && $User->hasAccountLevel('Staff');
    }

    public function userCanReadRecord(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        if ($User === null && php_sapi_name() === 'cli') {
            return true;
        }

        return $User && (
            $User->ID == $this->StudentID
            || in_array($this->StudentID, GuardianRelationship::getWardIds($User))
            || $User->hasAccountLevel('Staff')
        );
    }

    public function userCanUpdateRecord(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        // must be logged-in to update record
        if (!$User) {
            return false;
        }

        // staff can update any record
        if ($User->hasAccountLevel('Staff')) {
            return true;
        }

        // only status can be updated by non-staff
        if (
            count($this->originalValues) != 1
            || !$this->isFieldDirty('TaskStatus')
        ) {
            return false;
        }

        if ($this->TaskStatus == 'submitted' && $this->userCanSubmitStudentTask($User)) {
            return true;
        }

        if ($this->TaskStatus == 're-submitted' && $this->userCanResubmitStudentTask($User)) {
            return true;
        }

        return false;
    }

    public function userCanDeleteRecord(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        return $User && $User->hasAccountLevel('Staff');
    }

    public function userCanSubmitStudentTask(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();
        $expirationDate = $this->ExpirationDate ?: $this->Task->ExpirationDate;

        return (
            $User
            && $User->ID == $this->StudentID
            && (!$expirationDate || strtotime('23:59:59', $expirationDate) >= time())
            && in_array($this->getOriginalValue('TaskStatus') ?: $this->TaskStatus, static::$canSubmitStatuses)
        );
    }

    public function userCanResubmitStudentTask(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();
        $expirationDate = $this->ExpirationDate ?: $this->Task->ExpirationDate;

        return (
            $User
            && $User->ID == $this->StudentID
            && (!$expirationDate || strtotime('23:59:59', $expirationDate) >= time())
            && in_array($this->getOriginalValue('TaskStatus') ?: $this->TaskStatus, static::$canResubmitStatuses)
        );
    }

    public function userCanRateStudentTask(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        return $User && $User->hasAccountLevel('Staff');
    }

    public function userCanReassignStudentTask(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        return (
            $User
            && $User->hasAccountLevel('Staff')
            && in_array($this->getOriginalValue('TaskStatus') ?: $this->TaskStatus, static::$canReassignStatuses)
        );
    }

    public function userCanCompleteStudentTask(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        return (
            $User
            && $User->hasAccountLevel('Staff')
            && in_array($this->getOriginalValue('TaskStatus') ?: $this->TaskStatus, static::$canCompleteStatuses)
        );
    }

    public function userCanComment(IPerson $User = null)
    {
        $User = $User ?: $this->getUserFromEnvironment();

        return (
            $User
            && (
                $User->ID == $this->StudentID
                || $User->hasAccountLevel('Staff')
            )
        );
    }

    public function getSubmissionTimestamp()
    {
        $submissions = $this->Submissions;

        if (
            $this->TaskStatus != 'assigned'
            && ($Submission = end($submissions))
        ) {
            return $Submission->Created;
        }

        return null;
    }
}

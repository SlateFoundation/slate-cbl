<?php

namespace Slate\CBL\Tasks;

use Emergence\People\Person;
use Emergence\Comments\Comment;
use Slate\People\Student;
use Slate\Courses\Section;
use Slate\CBL\StudentCompetency;

class StudentTask extends \VersionedRecord
{
    public static $historyTable = 'history_cbl_student_tasks';

    public static $tableName = 'cbl_student_tasks';

    public static $singularNoun = 'student task';
    public static $pluralNoun = 'student tasks';

    public static $collectionRoute = '/cbl/student-tasks';

    public static $fields = [
        'TaskID' => 'uint',
        'StudentID' => 'uint',
        'CourseSectionID' => [
            'type' => 'uint',
            'default' => null
        ],
        'ExperienceType' => [
            'default' => null
        ],
        'DueDate' => [
            'type' => 'timestamp',
            'default' => null
        ],
        'ExpirationDate' => [
            'type' => 'timestamp',
            'default' => null
        ],
        'TaskStatus' => [
            'type' => 'enum',
            'notnull' => true,
            'values' => ['assigned', 're-assigned', 'submitted', 're-submitted', 'completed'],
            'default' => 'assigned'
        ],
        'Submitted' => [
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
        'Section' => [
            'type' => 'one-one',
            'local' => 'CourseSectionID',
            'class' => Section::class
        ],
        'Comments' => [
            'type' => 'context-children',
            'class' => Comment::class
        ],
        'SkillRatings' => [
            'type' => 'one-many',
            'class' => StudentTaskSkillRating::class,
            'foreign' => 'StudentTaskID',
            'local' => 'ID'
        ],
        'Attachments' => [
            'type' => 'context-children',
            'class' => Attachments\AbstractTaskAttachment::class
        ]
    ];

    public static $dynamicFields = array(
        'Task',
        'Student',
        'Section',
        'SkillRatings',
        'Comments',
        'Attachments',
        'StudentName' => [
            'getter' => 'getStudentName'
        ],
        'TaskSkills' => [
            'getter' => 'getTaskSkills'
        ]
    );

    public static $indexes = [
        'StudentTask' => [
            'fields' => ['TaskID', 'StudentID'],
            'unique' => true
        ]
    ];

    public static $validators = [
        'Task' => [
            'validator' => 'require-relationship'
        ],

        'Student' => [
            'validator' => 'require-relationship'
        ]
    ];

    public static $searchConditions = [
        'Task' => [
            'qualifiers' => ['task', 'task_id', 'taskid'],
            'points' => 2,
            'sql' => 'TaskID = %u'
        ],
        'Student' => [
            'qualifiers' => ['student', 'student_id', 'studentid'],
            'points' => 2,
            'sql' => 'StudentID = %u'
        ]
    ];

    public function getStudentName()
    {
        return $this->Student->FullName;
    }

    public function getTaskSkills()
    {
        $taskSkills = [];
        foreach ($this->Task->Skills as $skill) {
            $studentCompetency = $skill->Competency ? StudentCompetency::getByWhere(['StudentID' => $this->StudentID, 'CompetencyID' => $skill->Competency->ID]) : null;
            $skillRating = StudentTaskSkillRating::getByWhere(['StudentTaskID' => $this->ID, 'SkillID' => $skill->ID]);
            $taskSkills[] = array_merge($skill->getData(), [
                'CompetencyLevel' => $studentCompetency ? $studentCompetency->Level : null,
                'CompetencyCode' => $skill->Competency ? $skill->Competency->Code : null,
                'CompetencyDescriptor' => $skill->Competency ? $skill->Competency->Descriptor : null,
                'Rating' => $skillRating ? $skillRating->Score : null
            ]);
        }

        return $taskSkills;
    }

    public function save($deep = true)
    {
        if ($GLOBALS['Session']->Person instanceof Student) {
            if ($this->TaskStatus === 're-assigned') {
                $this->TaskStatus = 're-submitted';
            } else {
                $this->TaskStatus = 'submitted';
            }
            $this->Submitted = date('Y-m-d G:i:s');
        }
        parent::save(deep);
    }
}


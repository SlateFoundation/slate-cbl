<?php

namespace Slate\CBL\Tasks;

use Emergence\People\Person;
use Emergence\Comments\Comment;
use Slate\People\Student;
use Slate\Courses\Section;
use Slate\CBL\StudentCompetency;
use Slate\CBL\Skill;
use Slate\CBL\Demonstrations\Demonstration;

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
        ],
        'DemonstrationID' => [
            'type' => 'uint',
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
        'Attachments' => [
            'type' => 'context-children',
            'class' => Attachments\AbstractTaskAttachment::class
        ],
        'Submissions' => [
            'type' => 'one-many',
            'class' => StudentTaskSubmission::class,
            'foreign' => 'StudentTaskID',
            'local' => 'ID'
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
        'Section',
        'SkillRatings',
        'Comments',
        'Attachments',
        'Submissions',
        'StudentName' => [
            'getter' => 'getStudentName'
        ],
        'TaskSkills' => [
            'getter' => 'getTaskSkills'
        ],
        'Skills'
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
        // todo: use a UI-centric api endpoint instead of dynamic fields
        $taskSkills = [];
        $demoSkillIds = [];
        $demoSkills = $this->Demonstration ? $this->Demonstration->Skills : [];
        foreach ($demoSkills as $demoSkill) {
            $demoSkillIds[$demoSkill->SkillID] = $demoSkill;
        }

        if ($this->Task && $this->Task->Skills) {
            foreach ($this->Task->Skills as $skill) {
                $studentCompetency = $skill->Competency ? StudentCompetency::getByWhere(['StudentID' => $this->StudentID, 'CompetencyID' => $skill->Competency->ID]) : null;
                $demoSkillRating = $demoSkillIds[$skill->ID] ? $demoSkillIds[$skill->ID]->DemonstratedLevel : null;

                $taskSkills[] = array_merge($skill->getData(), [
                    'CompetencyLevel' => $studentCompetency ? $studentCompetency->Level : null,
                    'CompetencyCode' => $skill->Competency ? $skill->Competency->Code : null,
                    'CompetencyDescriptor' => $skill->Competency ? $skill->Competency->Descriptor : null,
                    'Rating' => $demoSkillRating
                ]);
            }
        }

        if ($this->Skills) {
            foreach ($this->Skills as $skill) {
                $studentCompetency = $skill->Competency ? StudentCompetency::getByWhere(['StudentID' => $this->StudentID, 'CompetencyID' => $skill->Competency->ID]) : null;
                $demoSkillRating = $demoSkillIds[$skill->ID] ? $demoSkillIds[$skill->ID]->DemonstratedLevel : null;

                $taskSkills[] = array_merge($skill->getData(), [
                    'CompetencyLevel' => $studentCompetency ? $studentCompetency->Level : null,
                    'CompetencyCode' => $skill->Competency ? $skill->Competency->Code : null,
                    'CompetencyDescriptor' => $skill->Competency ? $skill->Competency->Descriptor : null,
                    'Rating' => $demoSkillRating
                ]);
            }
        }

        return $taskSkills;
    }

    public function getDemonstration($autoCreate = true)
    {
        if (!$demonstration = $this->Demonstration && $autoCreate === true) {
            $demonstration = Demonstration::create([
                'StudentID' => $this->StudentID
            ], true);

            $this->DemonstrationID = $demonstration->ID;
            $this->save(false);
        }

        return $this->Demonstration;
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

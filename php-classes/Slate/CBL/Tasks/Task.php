<?php

namespace Slate\CBL\Tasks;

use DB;
use HandleBehavior;
use RecordValidator;
use Emergence\People\Person;
use Slate\Courses\Section;
use Slate\CBL\Skill;
use Slate\CBL\Tasks\TaskSkill;
use Slate\CBL\Tasks\Attachments\AbstractTaskAttachment;

class Task extends \VersionedRecord
{
    // ActiveRecord configuration
    public static $useCache = true;

    public static $tableName = 'cbl_tasks';
    public static $singularNoun = 'task';
    public static $pluralNoun = 'tasks';
    public static $collectionRoute = '/cbl/tasks';

    public static $subClasses = [
        __CLASS__,
        ExperienceTask::class,
    ];


    public static $fields = [
        'SectionID' => [
            'type' => 'uint',
            'index' => true,
            'default' => null
        ],
        'Title',
        'Handle' => [
            'unique' => true
        ],
        'ParentTaskID' => [
            'type' => 'uint',
            'default' => null
        ],
        'ClonedTaskID' => [
            'type' => 'uint',
            'default' => null,
        ],
        'Status' => [
            'type' => 'enum',
            'notnull' => true,
            'values' => ['private', 'shared', 'archived', 'deleted'],
            'default' => 'private'
        ],
        'Instructions' => [
            'type' => 'clob',
            'default' => null,
        ],

        // overridable by StudentTasks
        'DueDate' => [
            'type' => 'timestamp',
            'default' => null
        ],
        'ExpirationDate' => [
            'type' => 'timestamp',
            'default' => null
        ]
    ];

    public static $validators = [
        'Section' => [
            'type' => 'require-relationship',
            'required' => false
        ],
        'Title',
        'Status' => [
            'validator' => [__CLASS__, 'validateTaskStatus']
        ],
        'ParentTaskID' => [
            'validator' => [__CLASS__, 'validateParentTask']
        ]
    ];

    public static $relationships = [
        'Section' => [
            'type' => 'one-one',
            'class' => Section::class
        ],
        'ParentTask' => [
            'type' => 'one-one',
            'class' => __CLASS__
        ],
        'ClonedTask' => [
            'type' => 'one-one',
            'class' => __CLASS__
        ],
        'SubTasks' => [
            'type' => 'one-many',
            'class' => __CLASS__,
            'local' => 'ID',
            'foreign' => 'ParentTaskID'
        ],
        'Context' => [
            'type' => 'context-parent'
        ],
        'TaskSkills' => [
            'type' => 'one-many',
            'class' => TaskSkill::class,
            'prune' => 'delete'
        ],
        'Skills' => [
            'type' => 'many-many',
            'class' => Skill::class,
            'linkClass' => TaskSkill::class,
            'linkLocal' => 'TaskID',
            'linkForeign' => 'SkillID'
        ],
        'Attachments' => [
            'type' => 'context-children',
            'class' => AbstractTaskAttachment::class
        ],
        'StudentTasks' => [
            'type' => 'one-many',
            'class' => StudentTask::class,
            'prune' => 'delete'
        ],
        'Assignees' => [
            'type' => 'many-many',
            'class' => Person::class,
            'linkClass' => StudentTask::class,
            'linkLocal' => 'TaskID',
            'linkForeign' => 'StudentID'
        ]
    ];

    public static $dynamicFields = [
        'Section',
        'Skills',
        'Creator',
        // 'CreatorFullName' => 'Creator.FullName',
        'ParentTask',
        'SubTasks',
        'Context',
        'Attachments',
        'StudentTasks',
        'Assignees',
        'ClonedTask'
    ];

    public static $summaryFields = [
        'ID' => true,
        'Title' => true,
        'Created' => true,
        'Creator' => true
    ];

    public static $searchConditions = [
        'Title' => [
            'qualifiers' => ['any', 'title'],
            'points' => 2,
            'callback' => 'getTitleConditions'
        ],
        'ParentTask' => [
            'qualifiers' => ['parenttask'],
            'points' => 2,
            'join' => [
                'className' => Task::class,
                'aliasName' => 'ParentTask',
                'localField' => 'ParentTaskID',
                'foreignField' => 'ID'
            ],
            'callback' => 'getParentTaskConditions'
        ],
        'Skills' => [
            'qualifiers' => ['skills'],
            'points' => 2,
            'callback' => 'getSkillsConditions'
        ],
        'Creator' => [
            'qualifiers' => ['creator'],
            'points' => 2,
            'callback' => 'getCreatorConditions'
        ],
        'Created' => [
            'qualifiers' => ['created'],
            'points' => 1,
            'sql' => 'CAST(Created AS Date) = "%s"'
        ]
    ];

    public static $sorters = [
        'ParentTask' => [__CLASS__, 'sortByParentTask'],
        'ExperienceType' => [__CLASS__, 'sortByExperienceType'],
        'Skills' => [__CLASS__, 'sortBySkills'],
        'Creator' => [__CLASS__, 'sortByCreator']
    ];

    public function save($deep = true)
    {
        HandleBehavior::onSave($this);

        return parent::save($deep);
    }

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        // implement handles
        HandleBehavior::onValidate($this, $this->_validator);

        // save results
        return $this->finishValidation();
    }

    public function destroy()
    {
        return static::delete($this->ID);
    }

    public static function delete($id)
    {
        DB::nonQuery('UPDATE `%s` SET Status="deleted" WHERE `%s` = %u', array(
            static::$tableName
            ,static::_cn('ID')
            ,$id
        ));

        return DB::affectedRows() > 0;
    }

    protected static function validateParentTask(RecordValidator $validator, Task $Task, $options)
    {
        if (!$validator->hasErrors('ParentTaskID') && $Task->ParentTaskID) {
            if ($Task->ParentTaskID == $Task->ID) {
                $validator->addError('ParentTaskID', 'A task cannot be its own parent');

                // clear immediately to prevent validation loop
                $Task->ParentTaskID = null;
            }

            if (!empty($Task->SubTasks)) {
                $validator->addError('ParentTaskID', 'A task with subtasks is a parent task and cannot be a subtask of another task');

                // clear immediately to prevent validation loop
                $Task->ParentTaskID = null;
            }
        }
    }

    protected static function validateTaskStatus(RecordValidator $RecordValidator, Task $Record, $options = [], $validatorKey)
    {
        if (!$RecordValidator->hasErrors($validatorKey)) {
            if ($Record->Status === 'private' && !$Record->SectionID) {
                $RecordValidator->addError($validatorKey, 'Tasks not assigned to a section must be made "public".');
            }
        }
    }

    public static function getTitleConditions($identifier, $matchedCondition)
    {
        return static::getTableAlias().'.Title LIKE "%%'.$identifier.'%%"';
    }

    public static function getParentTaskConditions($identifier, $matchedCondition)
    {
        $parentTasks = DB::allRecords('SELECT ID FROM %s WHERE Title LIKE "%%%s%%"', [
            Task::$tableName,
            DB::escape($identifier)
        ]);

        $parentTasks = array_map(function($task) {
            return $task['ID'];
        },$parentTasks);

        $condition = $matchedCondition['join']['aliasName'].'.ID'.' IN ('.implode(',',$parentTasks).')';

        return $condition;
    }

    public static function getSkillsConditions($identifier)
    {
        $relatedTasks = DB::allRecords('
            SELECT ts.TaskID
            FROM %s as ts
            JOIN %s as sk
              ON ts.SkillID = sk.ID
            WHERE sk.Code LIKE "%%%s%%"',
        [
            TaskSkill::$tableName,
            Skill::$tableName,
            DB::escape($identifier)
        ]);

        $relatedTasks = array_map(function($task) {
            return $task['TaskID'];
        },$relatedTasks);

        if (count($relatedTasks) <= 0) {
            $relatedTasks = [0];
        }

        $condition = static::getTableAlias().'.ID IN ('.implode(',',array_unique($relatedTasks)).')';

        return $condition;
    }

    public static function getCreatorConditions($identifier)
    {
        $relatedTasks = DB::allRecords('
            SELECT task.ID
            FROM %s as task
            JOIN %s as person
              ON task.CreatorID = person.ID
            WHERE person.FirstName LIKE "%%%s%%"
            OR person.LastName LIKE "%%%s%%"',
        [
            Task::$tableName,
            Person::$tableName,
            DB::escape($identifier),
            DB::escape($identifier)
        ]);

        $relatedTasks = array_map(function($task) {
            return $task['ID'];
        },$relatedTasks);

        if (count($relatedTasks) <= 0) {
            $relatedTasks = [0];
        }

        $condition = static::getTableAlias().'.ID IN ('.implode(',',array_unique($relatedTasks)).')';

        return $condition;
    }

    public static function sortByParentTask($dir) {
        return sprintf('
            (SELECT ParentTask.Title FROM %s ParentTask
            WHERE ParentTask.ID = %s.ParentTaskID)
            %s
        ',
            static::$tableName,
            static::getTableAlias(),
            $dir
        );
    }

    public static function sortByExperienceType($dir) {
        return sprintf('
            (SELECT ExperienceTask.ExperienceType
            FROM %s ExperienceTask
            WHERE ExperienceTask.ID = %s.ID)
            %s
        ',
            static::$tableName,
            static::getTableAlias(),
            $dir
        );
    }

    public static function sortBySkills($dir) {
        return sprintf('
            (SELECT min(Skills.Code)
            FROM %s TaskSkills
            JOIN %s Skills on Skills.ID = TaskSkills.SkillID
            WHERE TaskSkills.TaskID = %s.ID
            GROUP BY TaskSkills.TaskID)
            %s
        ',
            TaskSkill::$tableName,
            Skill::$tableName,
            static::getTableAlias(),
            $dir
        );
    }

    public static function sortByCreator($dir) {
        return sprintf('
            (SELECT CONCAT(Creator.LastName, " ", Creator.FirstName)
            FROM %s Creator
            WHERE Creator.ID = %s.CreatorID)
            %s
        ',
            Person::$tableName,
            static::getTableAlias(),
            $dir
        );
    }
}

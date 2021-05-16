<?php

return [
    'title' => 'Student Tasks',
    'description' => 'Each row represents an assignment of a task to a student',
    'filename' => 'student-tasks',
    'headers' => [
        'ID',
        'StudentFullName' => 'Student',
        'StudentNumber' => 'Student Number',
        'TaskTitle' => 'Task Title',
        'TaskExperienceType' => 'Experience Type',
        'CreatorUsername' => 'Teacher Assigned',
        'Created',
        'SectionTitle' => 'Course Section',
        'Status' => 'Current Status of task',
        'DueDate' => 'Due date',
        'ExpirationDate' => 'Expiration date',
        'SubmittedDate' => 'Submitted date',
        'SkillCodes' => 'Skills Codes',
        'CourseCode' => 'Course Code',
        'TermTitle' => 'Term Title',
        'TermHandle' => 'Term Handle'
    ],
    'readQuery' => function (array $input) {
        $query = [
            'students' => 'all',
            'date_after' => null,
            'date_before' => null,
            'submitted_date_after' => null,
            'submitted_date_before' => null,
            'term' => null,
            'created_within_term' => true,
            'submitted_within_term' => true
        ];

        if (!empty($input['students'])) {
            $query['students'] = $input['students'];
        }

        // Term currently overrides {submitted_}date_{before|after} input
        $Term = null;
        if (!empty($input['term'])) {
            if ($input['term'] === '*current') {
                $Term = Slate\Term::getCurrent();
            } elseif ($input['term'] === '*current-master') {
                $Term = Slate\Term::getCurrent();
                $Term = $Term ? $Term->getMaster() : null;
            } else {
                $Term = Slate\Term::getByHandle($input['term']);
            }

            if (!$Term) {
                throw new RangeException('term could not be found');
            }

            $query['term'] = $Term;

            if (isset($input['created_within_term'])) {
                $created_within_term = $input['created_within_term'];
            } else { // default
                $created_within_term = $query['submitted_within_term'];
            }

            if (isset($input['submitted_within_term'])) {
                $submitted_within_term = $input['submitted_within_term'];
            } else {
                $submitted_within_term = $query['submitted_within_term'];
            }

            if (empty($created_within_term) && empty($submitted_within_term)) {
                throw new RangeException('created_within_term or submitted_within_term must be selected with term filter');
            }

            if (!empty($created_within_term)) {
                $query['date_after'] = $Term->StartDate;
                $query['date_before'] = $Term->EndDate;
                unset($input['date_after']);
                unset($input['date_before']);
            }

            if (!empty($submitted_within_term)) {
                $query['submitted_date_after'] = $Term->StartDate;
                $query['submitted_date_before'] = $Term->EndDate;
                unset($input['submitted_date_after']);
                unset($input['submitted_date_before']);
            }
        }

        if (!empty($input['date_after'])) {
            if (!$date = strtotime($input['date_after'])) {
                throw new RangeException('date_after could not be parsed as a date');
            }

            $query['date_after'] = date('Y-m-d H:i:s', $date);
        }

        if (!empty($input['date_before'])) {
            if (!$date = strtotime($input['date_before'])) {
                throw new RangeException('date_before could not be parsed as a date');
            }

            $query['date_before'] = date('Y-m-d H:i:s', $date);
        }

        if (!empty($input['submitted_date_after'])) {
            if (!$date = strtotime($input['submitted_date_after'])) {
                throw new RangeException('submitted_date_after could not be parsed as a date');
            }

            $query['submitted_date_after'] = date('Y-m-d H:i:s', $date);
        }

        if (!empty($input['submitted_date_before'])) {
            if (!$date = strtotime($input['submitted_date_before'])) {
                throw new RangeException('submitted_date_before could not be parsed as a date');
            }

            $query['submitted_date_before'] = date('Y-m-d H:i:s', $date);
        }

        return $query;
    },
    'buildRows' => function (array $query = [], array $config = []) {

        // build students list
        $students = Slate\People\Student::getAllByListIdentifier($query['students']);

        // sort students by name
        usort($students, function ($Student1, $Student2) {
            return strcasecmp($Student1->LastName, $Student2->LastName) ?: strcasecmp($Student1->FirstName, $Student2->FirstName);
        });

        // convert students to IDs
        $studentIds = array_map(function($Student) {
            return $Student->ID;
        }, $students);

        // build StudentTask conditions
        $conditions = [];
        $order = [];
        $dateConditions = [];
        $joinStatement = '';

        $studentTaskTableAlias = Slate\CBL\Tasks\StudentTask::getTableAlias();

        if (count($studentIds)) {
            $conditions['StudentID'] = [
                'values' => $studentIds,
                'operator' => 'IN'
            ];
            $order[] = 'FIELD(StudentID, '.implode(',', $studentIds).')';
        } else {
            $conditions[] = 'FALSE';
        }

        if (!empty($query['date_after']) || !empty($query['date_before'])) {
            $createdConditions = [];
            if ($query['date_after'] && $query['date_before']) {
                $createdConditions['Created'] = [
                    'operator' => 'BETWEEN',
                    'min' => $query['date_after'],
                    'max' => $query['date_before']
                ];
            } elseif ($query['date_after']) {
                $createdConditions['Created'] = [
                    'operator' => '>=',
                    'value' => $query['date_after']
                ];
            } elseif ($query['date_before']) {
                $createdConditions['Created'] = [
                    'operator' => '<=',
                    'value' => $query['date_before']
                ];
            }

            $dateConditions = array_values(Slate\CBL\Tasks\StudentTask::mapConditions($createdConditions, true));
        }

        if (!empty($query['submitted_date_after']) || !empty($query['submitted_date_before'])) {
            $submissionConditions = [];
            $submissionTableAlias = Slate\CBL\Tasks\StudentTaskSubmission::getTableAlias();
            $submissionTableName = Slate\CBL\Tasks\StudentTaskSubmission::$tableName;

            $joinStatement .= " LEFT JOIN `{$submissionTableName}` $submissionTableAlias ON $submissionTableAlias.StudentTaskID = $studentTaskTableAlias.ID ";

            $submissionConditions = [];
            if ($query['submitted_date_after'] && $query['submitted_date_before']) {
                $submissionConditions['Created'] = [
                    'operator' => 'BETWEEN',
                    'min' => $query['submitted_date_after'],
                    'max' => $query['submitted_date_before']
                ];
            } elseif ($query['submitted_date_after']) {
                $submissionConditions['Created'] = [
                    'operator' => '>=',
                    'value' => $query['submitted_date_after']
                ];
            } elseif ($query['submitted_date_before']) {
                $submissionConditions['Created'] = [
                    'operator' => '<=',
                    'value' => $query['submitted_date_before']
                ];
            }
            $dateConditions = array_merge($dateConditions, array_values(Slate\CBL\Tasks\StudentTaskSubmission::mapConditions($submissionConditions, true)));
        }

        $order[] = 'ID';
        $conditions = Slate\CBL\Tasks\StudentTask::mapConditions($conditions);

        // initialize cache
        $taskSkillCodes = [];

        // build rows
        $result = DB::query(
            '
                SELECT DISTINCT %2$s.*
                    FROM `%1$s` %2$s
                    %3$s
                    WHERE ((%4$s)
                      AND ((%5$s)))
                    ORDER BY %6$s
            ',
            [
                Slate\CBL\Tasks\StudentTask::$tableName,
                $studentTaskTableAlias,
                !empty($joinStatement) ? ($joinStatement) : '',
                count($conditions) ? join(') AND (', $conditions) : 'TRUE',
                !empty($dateConditions) ? join(') OR (', $dateConditions) : 'TRUE',
                implode(',', $order)
            ]
        );

        while ($record = $result->fetch_assoc()) {
            $StudentTask = Slate\CBL\Tasks\StudentTask::instantiateRecord($record);
            $submissionTimestamp = $StudentTask->getSubmissionTimestamp();

            // start with list of skill codes for task, cached between records
            if (isset($taskSkillCodes[$StudentTask->TaskID])) {
                $skillCodes = $taskSkillCodes[$StudentTask->TaskID];
            } else {
                $skillCodes = [];

                foreach ($StudentTask->Task->Skills as $Skill) {
                    $skillCodes[] = $Skill->Code;
                }

                $taskSkillCodes[$StudentTask->TaskID] = $skillCodes;
            }

            // add student-specific skills
            foreach ($StudentTask->Skills as $Skill) {
                $skillCodes[] = $Skill->Code;
            }

            // sort and uniqify
            $skillCodes = array_unique($skillCodes);
            natcasesort($skillCodes);

            $dueDate = $StudentTask->DueDate ? date('m/d/Y', $StudentTask->DueDate) : $StudentTask->Task->DueDate ? date('m/d/Y', $StudentTask->Task->DueDate) : null;
            $expirationDate = $StudentTask->ExpirationDate ? date('m/d/Y', $StudentTask->ExpirationDate) : $StudentTask->Task->ExpirationDate ? date('m/d/Y', $StudentTask->Task->ExpirationDate) : null;
            $assignedDate = date('m/d/Y', $StudentTask->Created);

            yield [
                'ID' => $StudentTask->ID,
                'StudentFullName' => $StudentTask->Student->FullName,
                'StudentNumber' => $StudentTask->Student->StudentNumber,
                'TaskTitle' => $StudentTask->Task->Title,
                'TaskExperienceType' => $StudentTask->Task->ExperienceType,
                'CreatorUsername' => $StudentTask->Creator->Username,
                'Created' =>  $StudentTask->Task->Created ? date('m/d/Y H:i:s P', $StudentTask->Task->Created) : null,
                'SectionTitle' => $StudentTask->Task->Section->Title,
                'Status' => $StudentTask->TaskStatus,
                'DueDate' => $dueDate,
                'ExpirationDate' => $expirationDate,
                'SubmittedDate' => $submissionTimestamp ? date('m/d/Y', $submissionTimestamp) : null,
                'AssignedDate' => $assignedDate,
                'SkillCodes' => implode(', ', $skillCodes),
                'CourseCode' => $StudentTask->Task->Section->Course->Code,
                'TermTitle' => $StudentTask->Task->Section->Term->Title,
                'TermHandle' => $StudentTask->Task->Section->Term->Handle
            ];
        }

        $result->free();
    }
];

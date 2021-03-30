<?php

return [
    'title' => 'Student Tasks',
    'description' => 'Each row represents an assignment of a task to a student',
    'filename' => 'student-tasks',
    'headers' => [
        'StudentFullName' => 'Student',
        'StudentNumber' => 'Student Number',
        'TaskTitle' => 'Task Title',
        'TaskExperienceType' => 'Experience Type',
        'CreatorFullName' => 'Teacher Assigned',
        'Created',
        'SectionTitle' => 'Course Section',
        'Status' => 'Current Status of task',
        'DueDate' => 'Due date',
        'ExpirationDate' => 'Expiration date',
        'SubmittedDate' => 'Submitted date',
        'SkillCodes' => 'Skills Codes',
        'CourseCode' => 'Course Code',
        'TermTitle' => 'Term'
    ],
    'readQuery' => function (array $input) {
        $query = [
            'students' => 'all',
            'date_after' => null,
            'date_before' => null
        ];

        if (!empty($input['students'])) {
            $query['students'] = $input['students'];
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

        if (count($studentIds)) {
            $conditions['StudentID'] = [ 'values' => $studentIds ];
            $order[] = 'FIELD(StudentID, '.implode(',', $studentIds).')';
        } else {
            $conditions[] = 'FALSE';
        }

        if ($query['date_after'] && $query['date_before']) {
            $conditions['Created'] = [
                'operator' => 'BETWEEN',
                'min' => $query['date_after'],
                'max' => $query['date_before']
            ];
        } elseif ($query['date_after']) {
            $conditions['Created'] = [
                'operator' => '>=',
                'value' => $query['date_after']
            ];
        } elseif ($query['date_before']) {
            $conditions['Created'] = [
                'operator' => '<=',
                'value' => $query['date_before']
            ];
        }

        $order[] = 'ID';
        $conditions = Slate\CBL\Tasks\StudentTask::mapConditions($conditions);

        // initialize cache
        $taskSkillCodes = [];

        // build rows
        $result = DB::query(
            '
                SELECT StudentTask.*
                    FROM `%s` StudentTask
                    WHERE (%s)
                    ORDER BY %s
            ',
            [
                Slate\CBL\Tasks\StudentTask::$tableName,
                count($conditions) ? join(') AND (', $conditions) : 'TRUE',
                implode(',', $order)
            ]
        );

        while ($record = $result->fetch_assoc()) {
            $StudentTask = Slate\CBL\Tasks\StudentTask::instantiateRecord($record);
            $submissionTimestamp = $StudentTask->getSubmissionTimestamp();

            // start with list of skill codes for task, cached between records
            if (!$skillCodes = $taskSkillCodes[$studentTask->TaskID]) {
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

            yield [
                'StudentFullName' => $StudentTask->Student->FullName,
                'StudentNumber' => $StudentTask->Student->StudentNumber,
                'TaskTitle' => $StudentTask->Task->Title,
                'TaskExperienceType' => $StudentTask->Task->ExperienceType,
                'CreatorFullName' => $StudentTask->Creator->FullName,
                'Created' =>  $StudentTask->Created ? date('m/d/Y', $StudentTask->Created) : '',
                'SectionTitle' => $StudentTask->Task->Section->Title,
                'Status' => $StudentTask->TaskStatus,
                'DueDate' => $StudentTask->getEffectiveDueDate() ? date('m/d/Y', $StudentTask->getEffectiveDueDate()) : '',
                'ExpirationDate' => $StudentTask->getEffectiveExpirationDate() ? date('m/d/Y', $StudentTask->getEffectiveExpirationDate()) : '',
                'SubmittedDate' => $submissionTimestamp ? date('m/d/Y', $submissionTimestamp) : '',
                'SkillCodes' => implode(', ', $skillCodes),
                'CourseCode' => $StudentTask->Task->Section->Course->Code,
                'TermTitle' => $StudentTask->Task->Section->Term->Title
            ];
        }

        $result->free();
    }
];
<?php

return [
    'title' => 'Student Tasks',
    'description' => 'Each row represents an assignment of a task to a student',
    'filename' => 'student-tasks',
    'headers' => [
        'StudentTaskID' => 'Student Task ID',
        'TaskID' => 'Task ID',
        'ParentTaskID' => 'Parent Task ID',
        'ClonedTaskID' => 'Cloned Task ID',
        'DemonstrationID' => 'Demonstration ID',
        'StudentID' => 'Student ID',
        'StudentNumber' => 'Student Number',
        'StudentUsername' => 'Student Username',
        'StudentFullName' => 'Student Name',
        'CreatorID' => 'Teacher ID',
        'CreatorUsername' => 'Teacher Username',
        'CreatorFullName' => 'Teacher Name',
        'Created',
        'SectionTitle' => 'Section Name',
        'SectionCode' => 'Section Code',
        'CourseTitle' => 'Course Name',
        'CourseCode' => 'Course Code',
        'TermTitle' => 'Term Title',
        'TermHandle' => 'Term Handle',
        'TaskTitle' => 'Task Title',
        'TaskExperienceType' => 'Experience Type',
        'Status',
        'DueDate' => 'Due date',
        'ExpirationDate' => 'Expiration date',
        'SubmittedDate' => 'Submitted date',
        'SkillCodes' => 'Skills Codes',
        'TeacherAttachments' => 'Teacher Attachments',
        'StudentAttachments' => 'Student Attachments'
    ],
    'readQuery' => function (array $input) {
        $query = [
            'students' => 'all',
            'date_created_from' => null,
            'date_created_to' => null,
            'date_submitted_from' => null,
            'date_submitted_to' => null,
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
                $query['created_within_term'] = (bool)$input['created_within_term'];
            }

            if (isset($input['submitted_within_term'])) {
                $query['submitted_within_term'] = (bool)$input['submitted_within_term'];
            }

            if (empty($query['created_within_term']) && empty($query['submitted_within_term'])) {
                throw new RangeException('created_within_term or submitted_within_term must be selected with term filter');
            }

            if (!empty($query['created_within_term'])) {
                $query['date_created_from'] = $Term->StartDate;
                $query['date_created_to'] = $Term->EndDate;
                unset($input['date_created_from']);
                unset($input['date_created_to']);
            }

            if (!empty($query['submitted_within_term'])) {
                $query['date_submitted_from'] = $Term->StartDate;
                $query['date_submitted_to'] = $Term->EndDate;
                unset($input['date_submitted_from']);
                unset($input['date_submitted_to']);
            }
        }

        if (!empty($input['date_created_from'])) {
            if (!$date = strtotime($input['date_created_from'])) {
                throw new RangeException('date_created_from could not be parsed as a date');
            }

            $query['date_created_from'] = date('Y-m-d H:i:s', $date);
        }

        if (!empty($input['date_created_to'])) {
            if (!$date = strtotime($input['date_created_to'])) {
                throw new RangeException('date_created_to could not be parsed as a date');
            }

            $query['date_created_to'] = date('Y-m-d H:i:s', $date);
        }

        if (!empty($input['date_submitted_from'])) {
            if (!$date = strtotime($input['date_submitted_from'])) {
                throw new RangeException('date_submitted_from could not be parsed as a date');
            }

            $query['date_submitted_from'] = date('Y-m-d H:i:s', $date);
        }

        if (!empty($input['date_submitted_to'])) {
            if (!$date = strtotime($input['date_submitted_to'])) {
                throw new RangeException('date_submitted_to could not be parsed as a date');
            }

            $query['date_submitted_to'] = date('Y-m-d H:i:s', $date);
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
        $submissionConditions = [];

        $studentTaskTableAlias = Slate\CBL\Tasks\StudentTask::getTableAlias();
        $submissionTableAlias = Slate\CBL\Tasks\StudentTaskSubmission::getTableAlias();

        if (count($studentIds)) {
            $conditions['StudentID'] = [
                'values' => $studentIds,
                'operator' => 'IN'
            ];
            $order[] = 'FIELD(StudentID, '.implode(',', $studentIds).')';
        } else {
            $conditions[] = 'FALSE';
        }

        if (!empty($query['date_created_from']) || !empty($query['date_created_to'])) {
            $createdConditions = [];
            if ($query['date_created_from'] && $query['date_created_to']) {
                $createdConditions['Created'] = [
                    'operator' => 'BETWEEN',
                    'min' => $query['date_created_from'],
                    'max' => date('Y-m-d H:i:s', strtotime($query['date_created_to'].'+1 day'))
                ];
            } elseif ($query['date_created_from']) {
                $createdConditions['Created'] = [
                    'operator' => '>=',
                    'value' => $query['date_created_from']
                ];
            } elseif ($query['date_created_to']) {
                $createdConditions['Created'] = [
                    'operator' => '<=',
                    'value' => $query['date_created_to']
                ];
            }

            $dateConditions = array_values(Slate\CBL\Tasks\StudentTask::mapConditions($createdConditions, true));
        }

        if (!empty($query['date_submitted_from']) || !empty($query['date_submitted_to'])) {
            if ($query['date_submitted_from'] && $query['date_submitted_to']) {
                $submissionConditions['Created'] = [
                    'operator' => 'BETWEEN',
                    'min' => $query['date_submitted_from'],
                    'max' => date('Y-m-d H:i:s', strtotime($query['date_submitted_to'].'+1 day'))
                ];
            } elseif ($query['date_submitted_from']) {
                $submissionConditions['Created'] = [
                    'operator' => '>=',
                    'value' => $query['date_submitted_from']
                ];
            } elseif ($query['date_submitted_to']) {
                $submissionConditions['Created'] = [
                    'operator' => '<=',
                    'value' => $query['date_submitted_to']
                ];
            }

            $dateConditions = array_merge(
                $dateConditions,
                Slate\CBL\Tasks\StudentTaskSubmission::mapConditions($submissionConditions, true)
            );
        }

        $order[] = 'ID';
        $conditions = Slate\CBL\Tasks\StudentTask::mapConditions($conditions);

        // initialize cache
        $taskSkillCodes = [];

        // build rows
        $result = DB::query(
            '
                SELECT %2$s.*,
                       %4$s.Created AS SubmissionCreated
                  FROM `%1$s` %2$s
                  LEFT JOIN (
                         SELECT MAX(Created) AS Created, StudentTaskID
                           FROM `%3$s`
                          GROUP BY StudentTaskID
                       ) AS %4$s
                    ON %4$s.StudentTaskID = %2$s.ID
                        WHERE (
                            (%5$s)
                            AND (
                              (%6$s)
                            )
                          )
                    ORDER BY %7$s
            ',
            [
                Slate\CBL\Tasks\StudentTask::$tableName,
                $studentTaskTableAlias,
                Slate\CBL\Tasks\StudentTaskSubmission::$tableName,
                $submissionTableAlias,
                count($conditions) ? join(') AND (', $conditions) : 'TRUE',
                !empty($dateConditions) ? join(') OR (', $dateConditions) : 'TRUE',
                implode(',', $order)
            ]
        );

        while ($record = $result->fetch_assoc()) {
            $StudentTask = Slate\CBL\Tasks\StudentTask::instantiateRecord($record);
            $StudentTaskSubmission = Slate\CBL\Tasks\StudentTaskSubmission::instantiateRecord([
                'Created' => $record['SubmissionCreated']
            ]);

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

            // add attachments
            $attachments = [];
            foreach ($StudentTask->Task->Attachments as $Attachment) {
                $attachments[] = $Attachment->URL;
            }
            $teacherAttachments = !empty($attachments) ? implode(',', $attachments) : null;

            $attachments = [];
            foreach ($StudentTask->Attachments as $Attachment) {
                $attachments[] = $Attachment->URL;
            }
            $studentAttachments = !empty($attachments) ? implode(',', $attachments) : null;

            yield [
                'StudentTaskID' => $StudentTask->ID,
                'TaskID' => $StudentTask->TaskID,
                'ParentTaskID' => $StudentTask->Task->ParentTaskID,
                'ClonedTaskID' => $StudentTask->Task->ClonedTaskID,
                'DemonstrationID' => $StudentTask->DemonstrationID,
                'StudentID' => $StudentTask->Student->ID,
                'StudentNumber' => $StudentTask->Student->StudentNumber,
                'StudentUsername' => $StudentTask->Student->Username,
                'StudentFullName' => $StudentTask->Student->FullName,
                'CreatorID' => $StudentTask->Creator->ID,
                'CreatorUsername' => $StudentTask->Creator->Username,
                'CreatorFullName' => $StudentTask->Creator->FullName,
                'TaskTitle' => $StudentTask->Task->Title,
                'TaskExperienceType' => $StudentTask->Task->ExperienceType,
                'Created' =>
                    $StudentTask->Task->Created
                    ? date('m/d/Y H:i:s P', $StudentTask->Task->Created)
                    : null,
                'SectionTitle' => $StudentTask->Task->Section->Title,
                'SectionCode' => $StudentTask->Task->Section->Code,
                'CourseTitle' => $StudentTask->Task->Section->Course->Title,
                'CourseCode' => $StudentTask->Task->Section->Course->Code,
                'Status' => $StudentTask->TaskStatus,
                'DueDate' =>
                    $StudentTask->getEffectiveDueDate()
                    ? date('m/d/Y', $StudentTask->getEffectiveDueDate())
                    : null,
                'ExpirationDate' =>
                    $StudentTask->getEffectiveExpirationDate()
                    ? date('m/d/Y', $StudentTask->getEffectiveExpirationDate())
                    : null,
                'SubmittedDate' =>
                    $StudentTaskSubmission->Created && $StudentTaskSubmission->Created != 'CURRENT_TIMESTAMP'
                    ? date('m/d/Y', $StudentTaskSubmission->Created)
                    : null,
                'AssignedDate' => date('m/d/Y', $StudentTask->Created),
                'SkillCodes' => implode(', ', $skillCodes),
                'TermTitle' => $StudentTask->Task->Section->Term->Title,
                'TermHandle' => $StudentTask->Task->Section->Term->Handle,
                'TeacherAttachments' => $teacherAttachments,
                'StudentAttachments' => $studentAttachments
            ];
        }

        $result->free();
    }
];

<?php

return [
    'title' => 'Student Competencies',
    'description' => 'Each row represents a competency that a student has been enrolled in and their progress within it',
    'filename' => 'student-competencies',
    'headers' => [
        'ID',
        'PersonID' => 'Person ID',
        'StudentFullName' => 'Student',
        'StudentNumber' => 'Student Number',
        'CompetencyCode' => 'Competency',
        'Level' => 'Portfolio',
        'BaselineRating' => 'Baseline',
        'DemonstrationsAverage' => 'Performance Level',
        'Growth' => 'Growth',
        'Progress',
        'DemonstrationsRequired' => 'Total ER',
        'DemonstrationsComplete' => 'Completed ER',
        'DemonstrationsMissed' => 'Missed ER',
        'DemonstrationOpportunities' => 'Total Opportunities'
    ],
    'readQuery' => function (array $input) {
        $query = [
            'students' => 'all',
            'content_area' => null,
            'level' => null
        ];

        if (!empty($input['students'])) {
            $query['students'] = $input['students'];
        }

        if (!empty($input['content_area'])) {
            if (!$ContentArea = Slate\CBL\ContentArea::getByCode($input['content_area'])) {
                throw new OutOfBoundsException('content area not found');
            }

            $query['content_area'] = $ContentArea->Code;
        }

        if (!empty($input['level'])) {
            $query['level'] = $input['level'];
        }

        $query['only_highest'] = !empty($input['only_highest']);

        return $query;
    },
    'buildRows' => function (array $query = [], array $config = []) {

        // build students list
        $students = Slate\People\Student::getAllByListIdentifier($query['students']);

        // sort students by name
        usort($students, function ($Student1, $Student2) {
            return strcasecmp($Student1->LastName, $Student2->LastName) ?: strcasecmp($Student1->FirstName, $Student2->FirstName);
        });

        // build StudentCompetency conditions
        $conditions = [];
        $order = [];

        if ($query['content_area']) {
            $competencyCodes = DB::valuesTable(
                'ID',
                'Code',
                '
                    SELECT Competency.ID,
                           Competency.Code
                      FROM `%s` ContentArea
                      JOIN `%s` Competency
                        ON Competency.ContentAreaID = ContentArea.ID
                     WHERE ContentArea.Code = "%s"
                       AND Competency.Status = "active"
                ',
                [
                    Slate\CBL\ContentArea::$tableName,
                    Slate\CBL\Competency::$tableName,
                    DB::escape($query['content_area'])
                ]
            );
        } else {
            $competencyCodes = DB::valuesTable('ID', 'Code', 'SELECT Competency.ID, Competency.Code FROM `%s` Competency WHERE Competency.Status = "active"', Slate\CBL\Competency::$tableName);
        }

        $conditions['CompetencyID'] = [
            'values' => array_keys($competencyCodes)
        ];

        natcasesort($competencyCodes);
        $order[] = 'FIELD(StudentCompetency.CompetencyID, '.implode(',', array_keys($competencyCodes)).')';

        if ($query['level']) {
            $conditions['Level'] = $query['level'];
        }

        if ($query['only_highest']) {
            $conditions[] = sprintf(
                'NOT EXISTS (
                    SELECT 1
                      FROM `%s` HigherStudentCompetency
                     WHERE HigherStudentCompetency.StudentID = StudentCompetency.StudentID
                       AND HigherStudentCompetency.CompetencyID = StudentCompetency.CompetencyID
                       AND HigherStudentCompetency.Level > StudentCompetency.Level
                )',
                Slate\CBL\StudentCompetency::$tableName
            );
        } else {
            array_unshift($order, 'Level');
        }

        $conditions = Slate\CBL\StudentCompetency::mapConditions($conditions);

        // build rows
        foreach ($students as $Student) {
            $result = DB::query(
                '
                    SELECT StudentCompetency.*
                      FROM `%s` StudentCompetency
                     WHERE StudentID = %u
                       AND (%s)
                     ORDER BY %s
                ',
                [
                    Slate\CBL\StudentCompetency::$tableName,
                    $Student->ID,
                    count($conditions) ? join(') AND (', $conditions) : 'TRUE',
                    implode(',', $order)
                ]
            );

            while ($record = $result->fetch_assoc()) {
                $StudentCompetency = Slate\CBL\StudentCompetency::instantiateRecord($record);
                $demonstrationsComplete = $StudentCompetency->getDemonstrationsComplete();
                $demonstrationsRequired = $StudentCompetency->getDemonstrationsRequired();
                $demonstrationsAverage = round(
                    $StudentCompetency->getDemonstrationsAverage(),
                    Slate\CBL\StudentCompetency::$averagePrecision
                );
                $growth = round(
                    $StudentCompetency->getGrowth(),
                    Slate\CBL\StudentCompetency::$averagePrecision
                );

                yield [
                    'ID' => $StudentCompetency->ID,
                    'PersonID' => $Student->ID,
                    'StudentFullName' => $Student->FullName,
                    'StudentNumber' => $Student->StudentNumber,
                    'CompetencyCode' => $StudentCompetency->Competency->Code,
                    'Level' => $StudentCompetency->Level,
                    'BaselineRating' => round($StudentCompetency->BaselineRating, 1),
                    'DemonstrationsAverage' => $demonstrationsAverage ?: null,
                    'Growth' => $growth ?: null,
                    'Progress' => round($demonstrationsRequired ? $demonstrationsComplete/$demonstrationsRequired : 1, 2),
                    'DemonstrationsRequired' => $demonstrationsRequired,
                    'DemonstrationsComplete' => $demonstrationsComplete,
                    'DemonstrationsMissed' => $StudentCompetency->getDemonstrationsMissed(),
                    'DemonstrationOpportunities' => $StudentCompetency->getDemonstrationOpportunities()
                ];
            }

            $result->free();
        }
    }
];
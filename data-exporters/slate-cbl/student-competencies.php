<?php

return [
    'title' => 'Competency Progress',
    'description' => 'Each row represents a competency that a student has been enrolled in and their progress within it',
    'filename' => 'student-competencies',
    'headers' => [
        'ID' => 'Student Competency ID',
        'PersonID' => 'Student ID',
        'StudentNumber' => 'Student Number',
        'StudentUsername' => 'Student Username',
        'StudentFullName' => 'Student Name',
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
                throw new OutOfBoundsException('competency area not found');
            }

            $query['content_area'] = $ContentArea->Code;
        }

        if (!empty($input['level'])) {
            $query['level'] = $input['level'];
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
            if ($query['level']=='highest') {
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
              $conditions['Level'] = $query['level'];
              array_unshift($order, 'Level');
            }
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

                yield [
                    'ID' => $StudentCompetency->ID,
                    'PersonID' => $Student->ID,
                    'StudentNumber' => $Student->StudentNumber,
                    'StudentUsername' => $Student->Username,
                    'StudentFullName' => $Student->FullName,
                    'CompetencyCode' => $StudentCompetency->Competency->Code,
                    'Level' => $StudentCompetency->Level,
                    'BaselineRating' => $StudentCompetency->getBaselineRating(),
                    'DemonstrationsAverage' => $StudentCompetency->getDemonstrationsAverage() ?: null,
                    'Growth' => $StudentCompetency->getGrowth() ?: null,
                    'Progress' => $StudentCompetency->getProgress() ?: null,
                    'DemonstrationsRequired' => $StudentCompetency->getDemonstrationsRequired(),
                    'DemonstrationsComplete' => $StudentCompetency->getDemonstrationsComplete(),
                    'DemonstrationsMissed' => $StudentCompetency->getDemonstrationsMissed(),
                    'DemonstrationOpportunities' => $StudentCompetency->getDemonstrationOpportunities()
                ];
            }

            $result->free();
        }
    }
];
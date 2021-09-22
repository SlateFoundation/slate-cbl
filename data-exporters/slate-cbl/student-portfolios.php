<?php

return [
    'title' => 'Portfolio Progress',
    'description' => 'Each row represents a content area and portfolio level that a student has been enrolled in at least one competency within',
    'filename' => 'student-portfolios',
    'headers' => [
        'PersonID' => 'Student ID',
        'StudentNumber' => 'Student Number',
        'StudentUsername' => 'Student Username',
        'StudentFullName' => 'Student Name',
        'ContentAreaCode' => 'Content Area',
        'Level' => 'Portfolio',
        'DemonstrationsAverage' => 'Performance Level',
        'Growth' => 'Growth',
        'Progress',
        'DemonstrationsRequired' => 'Total ER',
        'DemonstrationsComplete' => 'Completed ER',
        'DemonstrationsMissed' => 'Missed ER',
        'DemonstrationOpportunities' => 'Total Opportunities',
        'CompetenciesCount' => 'Enrolled Competencies'
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

#        $query['only_highest'] = !empty($input['only_highest']);

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
        $order = ['Level'];

        if ($query['content_area']) {
            $conditions['CompetencyID'] = [
                'values' => DB::allValues(
                    'ID',
                    '
                        SELECT Competency.ID
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
                )
            ];
        } else {
            $conditions['CompetencyID'] = [
                'values' => DB::allValues(
                    'ID',
                    '
                        SELECT Competency.ID
                          FROM `%s` Competency
                         WHERE Competency.Status = "active"
                    ',
                    [
                        Slate\CBL\Competency::$tableName
                    ]
                )
            ];
        }

        $contentAreaCodes = DB::valuesTable('ID', 'Code', 'SELECT ContentArea.ID, ContentArea.Code FROM `%s` ContentArea', Slate\CBL\ContentArea::$tableName);
        natcasesort($contentAreaCodes);
        $order[] = 'FIELD(Competency.ContentAreaID, '.implode(',', array_keys($contentAreaCodes)).')';

        if ($query['level']) {
            $conditions['Level'] = $query['level'];
        }

#        if ($query['only_highest']) {
#            $conditions[] = sprintf(
#                'NOT EXISTS (
#                    SELECT 1
#                      FROM `%s` HigherStudentCompetency
#                     WHERE HigherStudentCompetency.StudentID = StudentCompetency.StudentID
#                       AND HigherStudentCompetency.CompetencyID = StudentCompetency.CompetencyID
#                       AND HigherStudentCompetency.Level > StudentCompetency.Level
#                )',
#                Slate\CBL\StudentCompetency::$tableName
#            );
#        } else {
#            array_unshift($order, 'Level');
#        }

        $conditions = Slate\CBL\StudentCompetency::mapConditions($conditions);

        // build rows
        foreach ($students as $Student) {
            $result = DB::query(
                '
                    SELECT StudentCompetency.*,
                           Competency.ContentAreaID
                      FROM `%s` StudentCompetency
                      JOIN `%s` Competency
                        ON Competency.ID = StudentCompetency.CompetencyID
                     WHERE StudentID = %u
                       AND (%s)
                     ORDER BY %s
                ',
                [
                    Slate\CBL\StudentCompetency::$tableName,
                    Slate\CBL\Competency::$tableName,
                    $Student->ID,
                    count($conditions) ? join(') AND (', $conditions) : 'TRUE',
                    implode(',', $order)
                ]
            );

            $portfolio = null;
            $finishedPortfolio = null;

            while (true) {
                $record = $result->fetch_assoc();

                // if this is the first, last, or a new ContentArea+Level, shift current portfolio to finished and initialize new portfolio
                if (
                    !$portfolio
                    || !$record
                    || $portfolio['ContentAreaID'] != $record['ContentAreaID']
                    || $portfolio['Level'] != $record['Level']
                ) {
                    if ($portfolio) {
                        $finishedPortfolio = $portfolio;
                    }

                    if ($record) {
                        $portfolio = [
                            'ContentAreaID' => $record['ContentAreaID'],
                            'Level' => $record['Level'],
                            'competencies' => [],
                            'totalRequired' => 0,
                            'totalMissed' => 0,
                            'totalComplete' => 0,
                            'totalOpportunities' => 0,
                            'averageValues' => [],
                            'growthValues' => []
                        ];
                    }
                }

                // add data to current portfolio
                if ($record) {
                    $portfolio['competencies'][] = $StudentCompetency = Slate\CBL\StudentCompetency::instantiateRecord($record);
                    $portfolio['totalRequired'] += $StudentCompetency->getDemonstrationsRequired();
                    $portfolio['totalMissed'] += $StudentCompetency->getDemonstrationsMissed();
                    $portfolio['totalComplete'] += $StudentCompetency->getDemonstrationsComplete();
                    $portfolio['totalOpportunities'] += $StudentCompetency->getDemonstrationOpportunities();

                    $average = $StudentCompetency->getDemonstrationsAverage();
                    if ($average !== null) {
                        $portfolio['averageValues'][] = $average;
                    }

                    $growth = $StudentCompetency->getGrowth();
                    if ($growth !== null) {
                        $portfolio['growthValues'][] = $growth;
                    }
                }

                // yield finished portfolio
                if ($finishedPortfolio) {
                    if (count($finishedPortfolio['averageValues'])) {
                        $average = round(
                            array_sum($finishedPortfolio['averageValues']) / count($finishedPortfolio['averageValues']),
                            Slate\CBL\StudentCompetency::$averagePrecision
                        );
                    } else {
                        $average = null;
                    }

                    if (count($finishedPortfolio['growthValues'])) {
                        $growth = round(
                            array_sum($finishedPortfolio['growthValues']) / count($finishedPortfolio['growthValues']),
                            Slate\CBL\StudentCompetency::$averagePrecision
                        );
                    } else {
                        $growth = null;
                    }

                    yield [
                        'PersonID' => $Student->ID,
                        'StudentFullName' => $Student->FullName,
                        'StudentUsername' => $Student->Username,
                        'StudentNumber' => $Student->StudentNumber,
                        'ContentAreaCode' => Slate\CBL\ContentArea::getByID($finishedPortfolio['ContentAreaID'])->Code,
                        'Level' => intval($finishedPortfolio['Level']),
                        'DemonstrationsAverage' => $average,
                        'Growth' => $growth,
                        'Progress' => round(
                            $finishedPortfolio['totalRequired']
                                ? $finishedPortfolio['totalComplete'] / $finishedPortfolio['totalRequired']
                                : 1,
                            2
                        ),
                        'DemonstrationsRequired' => $finishedPortfolio['totalRequired'],
                        'DemonstrationsComplete' => $finishedPortfolio['totalComplete'],
                        'DemonstrationsMissed' => $finishedPortfolio['totalMissed'],
                        'DemonstrationOpportunities' => $finishedPortfolio['totalOpportunities'],
                        'CompetenciesCount' => count($finishedPortfolio['competencies'])
                    ];

                    $finishedPortfolio = null;
                }

                if (!$record) {
                    break;
                }
            }

            $result->free();
        }
    }
];

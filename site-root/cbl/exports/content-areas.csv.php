<?php

$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;
set_time_limit(0);

$rows = [];

// build and add headers list
$headers = [
    'Student',
    'ID',
    'Content Area',
    'Portfolio',
    'Performance Level',
    'Growth',
    'Progress',
    'Total ER',
    'Total Opportunities',
    'Completed ER',
    'Rated ER',
    'Missed ER'
];

// add headers to result
array_push($rows, $headers);

$format = 'Y-m-d H:i:s';

$from = $_REQUEST['from'] ? date($format, strtotime($_REQUEST['from'])) : null;
$to = $_REQUEST['to'] ? date($format, strtotime($_REQUEST['to'])) : null;

$defaultDemonstrationConditions = [];
if ($from && $to) {
    $defaultDemonstrationConditions[] = sprintf('Demonstrated BETWEEN "%s" AND "%s"', $from, $to);
} else if ($from) {
    $defaultDemonstrationConditions[] = sprintf('Demonstrated >= "%s"', $from);
} else if ($to) {
    $defaultDemonstrationConditions[] = sprintf('Demonstrated <= "%s"', $to);
}

// retrieve students
$students = Slate\People\Student::getAllByListIdentifier(empty($_REQUEST['students']) ? 'all' : $_REQUEST['students']);

foreach ($students as $student) {
    $demonstrationConditions = array_merge($defaultDemonstrationConditions, [
        'StudentID' => $student->ID
    ]);

    $demonstrationIds = \DB::allValues(
        'ID',
        'SELECT ID FROM `%s` WHERE (%s)',
        [
            \Slate\CBL\Demonstrations\Demonstration::$tableName,
            join(') AND (',\Slate\CBL\Demonstrations\Demonstration::mapConditions($demonstrationConditions))
        ]
    );

    // Get Student Competencies and group them by Content Area
    $contentAreas = [];
    $studentCompetencies = Slate\CBL\StudentCompetency::getAllByField('StudentID',$student->ID);

    // create a two-dimensional array of $studentCompetencies indexed by content area and grade
    foreach ($studentCompetencies as $studentCompetency) {
        $code = $studentCompetency->Competency->ContentArea->Code;
        $level = $studentCompetency->Level;

        if (isset($contentAreas[$code][$level])) {
            array_push($contentAreas[$code][$level],$studentCompetency);
        } else {
            $contentAreas[$code][$level] = [$studentCompetency];
        }
    }


    // sort the array by content area code
    ksort($contentAreas);

    // sort the sub-arrays by level
    foreach ($contentAreas as $code => $level) {
        ksort($level);
        $contentAreas[$code] = $level;
    }

    foreach ($contentAreas as $contentAreaCode => $competencyLevels) {

        foreach ($competencyLevels as $competencyLevel => $studentCompetencies) {

            // initialize variables for calculated fields
            $totalER = 0;
            $totalOpportunities = 0;
            $totalCompletedOpportunities = 0;
            $totalRatedOpportunities = 0;
            $totalMissedOpportunities = 0;
            $totalGrowth = 0;
            $totalPerformanceLevel = 0;
            $validPerformanceLevels = 0;
            $totalCompetencyGrowth = 0;
            $totalCompetenciesWithGrowth = 0;

            foreach ($studentCompetencies as $studentCompetency) {
                $totalGrowth = 0;
                $totalSkillsWithGrowth = 0;
                $competency = $studentCompetency->Competency;

                // no foreign key enforcemnt, client is manually deleting competency records, skip this studentCompetency if no associated competency
                if (!$competency) {
                    continue;
                }

                $totalER = $totalER + $competency->getTotalDemonstrationsRequired($competencyLevel);

                $performanceLevel = $studentCompetency->getDemonstrationsAverage();
                if ($performanceLevel) {
                    $validPerformanceLevels++;
                    $totalPerformanceLevel += $performanceLevel;
                }

                 // get all skills for this competency
                $skills = $competency->Skills;

                $skillsWithGrowth = 0;

                foreach ($skills as $skill) {

                    $growth = 0;
                    $skillsWithGrowth = 0;
                    $completedOpportunities = 0;
                    $ratedOpportunities = 0;
                    $missedOpportunities = 0;
                    $demonstrationsRequired = 0;

                    $demonstrationsRequired = $skill->getDemonstrationsRequiredByLevel($competencyLevel, true);
                    if ($demonstrationsRequired > 0 && !empty($demonstrationIds)) {
                        $demonstrationSkills = \Slate\CBL\Demonstrations\DemonstrationSkill::getAllByWhere([
                            'SkillID' => $skill->ID,
                            'TargetLevel' => $competencyLevel,
                            'DemonstrationID' => [
                                'values' => $demonstrationIds
                            ]
                        ], [
                            'order' => 'Created ASC'
                        ]);


                        $nonMissingDemonstrationSkills = [];
                        foreach ($demonstrationSkills as $demonstrationSkill) {
                            $totalOpportunities += 1;

                            if ($demonstrationSkill->DemonstratedLevel > 0 && !$demonstrationSkill->Override) {
                                array_push($nonMissingDemonstrationSkills, $demonstrationSkill);
                            }

                            if ($demonstrationSkill->DemonstratedLevel > 0) {
                                $completedOpportunities += 1;
                            } else {
                                $missedOpportunities += 1;
                            }

                            // no credit for logs beyond the number required
                            if ($completedOpportunities > $demonstrationsRequired) {
                                $completedOpportunities = $demonstrationsRequired;
                            }

                            // if demo is overridden, it is a completed opportunity and not a missed opportunity
                            if ($demonstrationSkill->Override) {
                                $completedOpportunities = $demonstrationsRequired;
                                $missedOpportunities = 0;
                            } elseif ($demonstrationSkill->DemonstratedLevel > 0 && $ratedOpportunities < $demonstrationsRequired) {
                                $ratedOpportunities++;
                            }
                        }

                        // must have at least 2 non-zero logs to be counted for growth
                        if (count($nonMissingDemonstrationSkills) >= 2) {
                            $skillsWithGrowth++;

                            // Our query is ordered by date so we can use first and last record. (breaking these out into vars for code clarity)
                            $earliestLogLevel = $nonMissingDemonstrationSkills[0]->DemonstratedLevel;
                            $latestLogLevel = $nonMissingDemonstrationSkills[count($nonMissingDemonstrationSkills)-1]->DemonstratedLevel;

                            // growth is the difference between the first and last log.
                            $growth = $growth + ($latestLogLevel - $earliestLogLevel);

                        }

                        $totalGrowth += $growth;
                        $totalSkillsWithGrowth += $skillsWithGrowth;
                        $totalCompletedOpportunities += $completedOpportunities;
                        $totalMissedOpportunities += min($missedOpportunities, $demonstrationsRequired - $completedOpportunities);
                        $totalRatedOpportunities += $ratedOpportunities;
                    }

                }

                if ($totalSkillsWithGrowth > 0) {
                    $totalCompetencyGrowth += $totalGrowth / $totalSkillsWithGrowth;
                }

                if ($totalSkillsWithGrowth> 0) {
                    $totalCompetenciesWithGrowth++;
                }

            }

            if ($validPerformanceLevels > 0) {
                $totalPerformanceLevel = $totalPerformanceLevel / $validPerformanceLevels;
            }

            if ($totalCompetenciesWithGrowth > 0) {
                $totalGrowth = $totalCompetencyGrowth / $totalCompetenciesWithGrowth;
            } else {
                $totalGrowth = 0; // can't be calculated, zero it so we don't get growth from last row
            }

            $progress = 0;
            if ($totalER > 0) {
                $progress = 100 * ($totalCompletedOpportunities / $totalER);
            }

            // add date to result
            $row = [
                $student->getFullName(),
                $student->StudentNumber,
                $contentAreaCode,
                $competencyLevel,
                number_format((float)$totalPerformanceLevel, 2, '.', ''),
                number_format((float)$totalGrowth, 2, '.', ''),
                round($progress) . "%",
                $totalER,
                $totalOpportunities,
                $totalCompletedOpportunities,
                $totalRatedOpportunities,
                $totalMissedOpportunities
            ];

            array_push($rows, $row);

        }
    }
}

$sw = new SpreadsheetWriter();
$sw->writeRows($rows);
$sw->close();


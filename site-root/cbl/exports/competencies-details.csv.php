<?php

$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = true;
set_time_limit(0);

$rows = [];

// build and add headers list
$headers = [
    'StudentID',
    'Student',
    'ID',
    'Competency',
    'Portfolio',
    'Performance Level',
    'Growth',
    'Progress',
    'Total ER',
    'Total Opportunities',
    'Completed ER',
    'Rated',
    'Missed ER'
];

// add headers to result
array_push($rows, $headers);

// retrieve students
$students = Slate\People\Student::getAllByListIdentifier(empty($_REQUEST['students']) ? 'all' : $_REQUEST['students']);

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
    

    $studentCompetenciesByLevel = \DB::arrayTable(
        'Level',
        'SELECT %2$s.* FROM `%1$s` `%2$s`'.
        '  JOIN `%3$s` %4$s'.
        '    ON %2$s.CompetencyID = %4$s.ID'.
        ' WHERE %2$s.StudentID = %5$u'.
        ' ORDER BY %2$s.Level, %4$s.Code ASC',
        [
            \Slate\CBL\StudentCompetency::$tableName,
            \Slate\CBL\StudentCompetency::getTableAlias(),
            \Slate\CBL\Competency::$tableName,
            \Slate\CBL\Competency::getTableAlias(),
            $student->ID
        ]
    );

    foreach ($studentCompetenciesByLevel as $level => $studentCompetencies) {
        foreach ($studentCompetencies as $studentCompetency) {
            // initialize variables for calculated fields
            $totalGrowth = 0;
            $totalSkillsWithGrowth = 0;
            $totalER = 0;
            $totalOpportunities = 0;
            $totalCompletedOpportunities = 0;
            $totalRatedOpportunities = 0;
            $totalMissedOpportunities = 0;
            $competenciesWithGrowth = 0;

            // get competency for the competency completion data
            $competency = \Slate\CBL\Competency::getByID($studentCompetency['CompetencyID']);

            // competency record was deleted
            if (!$competency) {
                continue;
            }

            $completion = $competency->getCompletionForStudent($student, $level, $defaultDemonstrationConditions[0]);
            $totalER = $competency->getTotalDemonstrationsRequired($level);
            
            // get all skills for this competency
            $skills = $competency->Skills;
            $skillsWithGrowth = 0;

            foreach ($skills as $skill) {
                // initialize variables
                $growth = 0;
                $skillsWithGrowth = 0;
                $completedOpportunities = 0;
                $missedOpportunities = 0;
                $demonstrationsRequired = 0;

                // get demonstrations required for this skill
                $demonstrationsRequired = $skill->getDemonstrationsRequiredByLevel($level, true);
                if (!empty($demonstrationIds)) {

                    $demonstrationSkills = \Slate\CBL\Demonstrations\DemonstrationSkill::getAllByWhere([
                        'SkillID' => $skill->ID,
                        'TargetLevel' => $level,
                        'DemonstrationID' => [
                            'values' => $demonstrationIds
                        ]
                    ], [
                        'order' => 'Created ASC'
                    ]);

                    $nonMissingDemonstrationSkills = [];
                    foreach ($demonstrationSkills as $demonstrationSkill) {
                        $totalOpportunities++;

                        if ($demonstrationSkill->DemonstratedLevel > 0 && !$demonstrationSkill->Override) {
                            array_push($nonMissingDemonstrationSkills, $demonstrationSkill);
                        }

                        if ($demonstrationSkill->DemonstratedLevel > 0) {
                            $completedOpportunities += 1;
                        } else {
                            $missedOpportunities++;
                        }

                        // no credit for logs beyond the number required
                        if ($completedOpportunities > $demonstrationsRequired) {
                            $completedOpportunities = $demonstrationsRequired;
                        }

                        // if demo is overridden, it is a completed opportunity and not a missed opportunity
                        if ($demonstrationSkill->Override) {
                            $completedOpportunities = $demonstrationsRequired;
                            $missedOpportunities = 0;
                        } elseif ($demonstrationSkill->DemonstratedLevel > 0) {
                            $totalRatedOpportunities++;
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

                }
            }

            if ($totalSkillsWithGrowth > 0) {
                $totalGrowth = $totalGrowth / $totalSkillsWithGrowth;
            }

            if ($totalER > 0) {
                $progress = 100 * ($totalCompletedOpportunities / $totalER);
            } else {
                $progress = 100;
            }

            // add date to result
            $row = [
                $student->ID,
                $student->getFullName(),
                $student->StudentNumber,
                $competency->Code,
                $studentCompetency['Level'],
                number_format((float)$completion['demonstrationsAverage'], 2, '.', ''),
                number_format((float)$totalGrowth, 2, '.', ''),
                round($progress) . "%",
                $totalER,
                $totalOpportunities,
                $totalCompletedOpportunities,
                min($totalRatedOpportunities, $totalER),
                $totalMissedOpportunities
            ];
            array_push($rows, $row);
        }
    }
}

$sw = new \SpreadsheetWriter();
$sw->writeRows($rows);
$sw->close();
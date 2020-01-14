<?php

$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;
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
    'Rated ER',
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

foreach ($students as $Student) {

    $demonstrationConditions = array_merge($defaultDemonstrationConditions, [
        'StudentID' => $Student->ID
    ]);

    $demonstrationIds = \DB::allValues(
        'ID',
        'SELECT ID FROM `%s` WHERE (%s)',
        [
            \Slate\CBL\Demonstrations\Demonstration::$tableName,
            join(') AND (',\Slate\CBL\Demonstrations\Demonstration::mapConditions($demonstrationConditions))
        ]
    );


    $studentCompetencies = \Slate\CBL\StudentCompetency::getAllByField('StudentID', $Student->ID, ['order' => ['Level', 'CompetencyID']]);

    foreach ($studentCompetencies as $StudentCompetency) {
        // initialize variables for calculated fields
        $totalGrowth = 0;
        $totalSkillsWithGrowth = 0;
        $totalER = 0;
        $totalOpportunities = 0;
        $totalCompletedOpportunities = 0;
        $totalRatedOpportunities = 0;
        $totalMissedOpportunities = 0;
        $competenciesWithGrowth = 0;

        $totalER = $StudentCompetency->getDemonstrationsRequired();

        // get all skills for this competency
        $skills = $StudentCompetency->Competency->Skills;
        $skillsWithGrowth = 0;

        foreach ($skills as $Skill) {
            // initialize variables
            $growth = 0;
            $skillsWithGrowth = 0;
            $completedOpportunities = 0;
            $missedOpportunities = 0;
            $ratedOpportunities = 0;
            $demonstrationsRequired = 0;

            // get demonstrations required for this skill
            $demonstrationsRequired = $Skill->getDemonstrationsRequiredByLevel($StudentCompetency->Level);

            if (!empty($demonstrationIds)) {

                $demonstrationSkills = \Slate\CBL\Demonstrations\DemonstrationSkill::getAllByWhere([
                    'SkillID' => $Skill->ID,
                    'TargetLevel' => $StudentCompetency->Level,
                    'DemonstrationID' => [
                        'values' => $demonstrationIds
                    ]
                ], [
                    'order' => 'Created ASC'
                ]);

                $nonMissingDemonstrationSkills = [];
                foreach ($demonstrationSkills as $DemonstrationSkill) {
                    $totalOpportunities++;

                    if ($DemonstrationSkill->DemonstratedLevel > 0 && !$DemonstrationSkill->Override) {
                        array_push($nonMissingDemonstrationSkills, $DemonstrationSkill);
                    }

                    if ($DemonstrationSkill->DemonstratedLevel > 0) {
                        $completedOpportunities += 1;
                    } else {
                        $missedOpportunities++;
                    }

                    // no credit for logs beyond the number required
                    if ($completedOpportunities > $demonstrationsRequired) {
                        $completedOpportunities = $demonstrationsRequired;
                    }

                    // if demo is overridden, it is a completed opportunity and not a missed opportunity
                    if ($DemonstrationSkill->Override) {
                        $completedOpportunities = $demonstrationsRequired;
                        $missedOpportunities = 0;
                    } elseif ($DemonstrationSkill->DemonstratedLevel > 0 && $ratedOpportunities < $demonstrationsRequired) {
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
            $totalGrowth = $totalGrowth / $totalSkillsWithGrowth;
        }

        if ($totalER > 0) {
            $progress = 100 * ($totalCompletedOpportunities / $totalER);
        } else {
            $progress = 100;
        }

        // add date to result
        $row = [
            $Student->ID,
            $Student->getFullName(),
            $Student->StudentNumber,
            $StudentCompetency->Competency->Code,
            $StudentCompetency->Level,
            number_format((float)$StudentCompetency->getDemonstrationsAverage(), 1, '.', ''),
            number_format((float)$totalGrowth, 1, '.', ''),
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

$sw = new \SpreadsheetWriter();
$sw->writeRows($rows);
$sw->close();
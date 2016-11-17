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
    'Missed ER'
];

// add headers to result
array_push($rows, $headers);

// create a query for returning DemonstrationSkill by SkillID and a list of DemonstrationIDs
$demonstrationSkillsQueryString = '
    SELECT *
    FROM %1$s DemonstrationSkills
    WHERE DemonstrationID in (%2$s)
    AND SkillID = %3$s
    AND TargetLevel = %4$u
    ORDER BY DemonstrationSkills.Created
';

// retrieve students
$students = Slate\People\Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);

foreach ($students as $student) {

    $demonstrationIds = implode(',',
        \DB::allValues('ID', 'SELECT ID FROM %s WHERE StudentID = %u', [\Slate\CBL\Demonstrations\Demonstration::$tableName, $student->ID])
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
            $totalMissedOpportunities = 0;
            $totalGrowth = 0;
            $totalPerformanceLevel = 0;
            $validPerformanceLevels = 0;

            foreach ($studentCompetencies as $studentCompetency) {
                $competency = $studentCompetency->Competency;

                // no foreign key enforcemnt, client is manually deleting competency records, skip this studentCompetency if no associated competency
                if (!$competency) {
                    continue;
                }

                // TODO: temp fix - screen out competencies without skills causing an error in getCompletionForStudent method
                $skillIds = $competency->getSkillIds();
                if (count($skillIds)<=0) {
                    continue;
                }

                $completion = $competency->getCompletionForStudent($student, $competencyLevel);

                $totalER = $totalER + $competency->getTotalDemonstrationsRequired($competencyLevel);

                $performanceLevel = $completion['demonstrationsAverage'];
                if ($performanceLevel) {
                    $validPerformanceLevels++;
                    $totalPerformanceLevel += $performanceLevel;
                }

                 // get all skills for this competency
                $skills = Slate\CBL\Skill::getAllByField('CompetencyID', $competency->ID);

                $skillsWithGrowth = 0;

                foreach ($skills as $skill) {

                    $growth = 0;
                    $skillsWithGrowth = 0;
                    $completedOpportunities = 0;
                    $demonstrationsRequired = 0;

                    // get demonstrations required for this skill
                    if (!is_null($skill->DemonstrationsRequired)) {
                        if (array_key_exists($competencyLevel, $skill->DemonstrationsRequired)) {
                            $demonstrationsRequired = $skill->DemonstrationsRequired[$competencyLevel];
                        } else if (array_key_exists('default', $skill->DemonstrationsRequired)){
                            $demonstrationsRequired = $skill->DemonstrationsRequired['default'];
                        }
                    }

                    if ($demonstrationsRequired > 0 && strlen($demonstrationIds)>0) {

                        // execute query for DemonstrationSkills needed for calculated fields
                        $query = sprintf($demonstrationSkillsQueryString,
                            Slate\CBL\Demonstrations\DemonstrationSkill::$tableName,
                            $demonstrationIds,
                            $skill->ID,
                            $competencyLevel
                        );
                        $demonstrationSkills = Slate\CBL\Demonstrations\DemonstrationSkill::getAllByQuery($query);

                        $nonMissingDemonstrationSkills = [];
                        foreach ($demonstrationSkills as $log) {
                            if ($log->DemonstratedLevel > 0 && !$log->Override) {
                                array_push($nonMissingDemonstrationSkills,$log);
                            }
                        }

                        // must have at least 2 non-zero logs to be counted for growth
                        if (count($nonMissingDemonstrationSkills) >=2) {
                            $skillsWithGrowth ++;

                            // Our query is ordered by date so we can use first and last record. (breaking these out into vars for code clarity)
                            $earliestLogLevel = $nonMissingDemonstrationSkills[0]->DemonstratedLevel;
                            $latestLogLevel = $nonMissingDemonstrationSkills[count($nonMissingDemonstrationSkills)-1]->DemonstratedLevel;

                            // growth is the difference between the first and last log.
                            $growth = $growth + ($latestLogLevel - $earliestLogLevel);
                        }

                        foreach ($demonstrationSkills as $demonstrationSkill) {
                            $totalOpportunities += 1;
                            if ($demonstrationSkill->DemonstratedLevel > 0) {
                                $completedOpportunities += 1;
                            }

                            // no credit for logs beyond the number required
                            if ($completedOpportunities > $demonstrationsRequired) {
                                $completedOpportunities = $demonstrationsRequired;
                            }


                            // if demo is overridden, it is a completed opportunity
                            if ($demonstrationSkill->Override) {
                                $completedOpportunities = $demonstrationsRequired;
                            }

                        }

                        $totalGrowth += $growth;
                        $totalSkillsWithGrowth += $skillsWithGrowth;
                        $totalCompletedOpportunities += $completedOpportunities;
                        $totalMissedOpportunities += $demonstrationsRequired - $completedOpportunities;
                    }

                }

            }

            if ($validPerformanceLevels > 0) {
                $totalPerformanceLevel = $totalPerformanceLevel / $validPerformanceLevels;
            }

            if ($totalSkillsWithGrowth > 0) {
                $totalGrowth = $totalGrowth / $totalSkillsWithGrowth;
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
                $totalMissedOpportunities
            ];

            array_push($rows, $row);

        }
    }
}

$sw = new SpreadsheetWriter();
$sw->writeRows($rows);
$sw->close();


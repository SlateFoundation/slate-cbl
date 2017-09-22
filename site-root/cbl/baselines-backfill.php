<?php

use Slate\CBL\StudentCompetency;


$GLOBALS['Session']->requireAccountLevel('Administrator');
set_time_limit(0);
Benchmark::startLive();


// search for prior-average baselines
$studentCompetencies = StudentCompetency::getAllByQuery(
    '
     SELECT sc1.*
       FROM `%1$s` sc1
       JOIN `%1$s` sc2
         ON sc1.StudentID = sc2.StudentID AND sc1.CompetencyID = sc2.CompetencyID AND sc1.Level = sc2.Level + 1
      WHERE sc1.BaselineRating IS NULL
    ',
    [
        StudentCompetency::$tableName
    ]
);

$total = count($studentCompetencies);
$digits = strlen($total);

Benchmark::mark(sprintf('Fetched %u candidate StudentCompetency records for prior-average baselines', $total));


$count = 0;

while ($StudentCompetency = array_shift($studentCompetencies)) {
    $count++;

    $LastStudentCompetency = StudentCompetency::getByWhere([
        'StudentID' => $StudentCompetency->StudentID,
        'CompetencyID' => $StudentCompetency->CompetencyID,
        'Level' => $StudentCompetency->Level - 1
    ]);

    $StudentCompetency->BaselineRating = $LastStudentCompetency->getDemonstrationsAverage();
    $StudentCompetency->save();

    Benchmark::mark(sprintf("%0{$digits}u/%u: Set baseline=%s for Student=%s Competency=%s Level=%s", $count, $total, $StudentCompetency->BaselineRating ?: 'NULL', $StudentCompetency->StudentID, $StudentCompetency->CompetencyID, $StudentCompetency->Level));
}

Benchmark::mark(sprintf('Finished analyzing %u successor StudentCompetency records for prior-average baseline', $total));


// search for initial-rating baselines
$studentCompetencies = StudentCompetency::getAllByWhere(['BaselineRating' => null]);

$total = count($studentCompetencies);
$digits = strlen($total);

Benchmark::mark(sprintf('Fetched %u candidate StudentCompetency records for initial-rating baselines', $total));


$count = 0;

while ($StudentCompetency = array_shift($studentCompetencies)) {
    $count++;

    $StudentCompetency->BaselineRating = $StudentCompetency->calculateStartingRating();
    $StudentCompetency->save();

    Benchmark::mark(sprintf("%0{$digits}u/%u: Set baseline=%s for Student=%s Competency=%s Level=%s", $count, $total, $StudentCompetency->BaselineRating ?: 'NULL', $StudentCompetency->StudentID, $StudentCompetency->CompetencyID, $StudentCompetency->Level));
}

Benchmark::mark(sprintf('Finished analyzing %u StudentCompetency records for initial-ratings baseline', $total));
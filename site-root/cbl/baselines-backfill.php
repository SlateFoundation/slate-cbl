<?php

use Slate\CBL\StudentCompetency;


set_time_limit(0);

Benchmark::startLive();


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


while ($StudentCompetency = array_shift($studentCompetencies)) {
    $LastStudentCompetency = StudentCompetency::getByWhere([
        'StudentID' => $StudentCompetency->StudentID,
        'CompetencyID' => $StudentCompetency->CompetencyID,
        'Level' => $StudentCompetency->Level - 1
    ]);

    $StudentCompetency->BaselineRating = $LastStudentCompetency->getDemonstrationsAverage();
    $StudentCompetency->save();

    Benchmark::mark(sprintf('Set baseline=%s for Student=%s Competency=%s Level=%s', $StudentCompetency->BaselineRating ?: 'NULL', $StudentCompetency->StudentID, $StudentCompetency->CompetencyID, $StudentCompetency->Level));
}
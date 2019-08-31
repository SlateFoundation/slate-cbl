<?php

namespace Slate\CBL;

use Slate\CBL\StudentCompetency;

$Student = $_EVENT['Record']->Demonstration->Student;
$Competency = $_EVENT['Record']->Skill->Competency;

$StudentCompetency = StudentCompetency::getCurrentForStudent($Student, $Competency);

if (!$StudentCompetency) {
    return;
}

if (
    StudentCompetency::$autoGraduate
    && $StudentCompetency->isLevelComplete()
    && (
        !StudentCompetency::$maximumLevel
        || $StudentCompetency->Level < StudentCompetency::$maximumLevel
    )
) {
    // enroll student in next level
    StudentCompetency::create([
        'StudentID' => $Student->ID,
        'CompetencyID' => $Competency->ID,
        'Level' => $StudentCompetency->Level + 1,
        'EnteredVia' => 'graduation'
    ], true);
}

if (
    StudentCompetency::$autoBaseline
    && !$StudentCompetency->BaselineRating
) {
    $StudentCompetency->BaselineRating = $StudentCompetency->calculateStartingRating();
    $StudentCompetency->save();
}

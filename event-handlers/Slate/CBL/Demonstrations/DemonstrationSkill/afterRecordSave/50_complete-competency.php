<?php

namespace Slate\CBL;

use Slate\CBL\StudentCompetency;

$Student = $_EVENT['Record']->Demonstration->Student;
$Competency = $_EVENT['Record']->Skill->Competency;

$StudentCompetency = StudentCompetency::getCurrentForStudent($Competency, $Student);

if (
        $StudentCompetency &&
        StudentCompetency::$autoGraduate &&
        $StudentCompetency->isLevelComplete() &&
        $StudentCompetency->Level < $Competency->getMaximumTargetLevel()
   ) {

    // enroll student in next level
    StudentCompetency::create([
        'StudentID' => $Student->ID,
        'CompetencyID' => $Competency->ID,
        'Level' => $StudentCompetency->Level + 1,
        'EnteredVia' => 'graduation',
        'BaselineRating' => $StudentCompetency->getDemonstrationsAverage()
    ], true);
} elseif (empty($completion['baselineRating']) && $StudentCompetency) {
    $StudentCompetency->BaselineRating = $StudentCompetency->calculateStartingRating();
    $StudentCompetency->save();
}
<?php

namespace Slate\CBL;

$Student = $_EVENT['Record']->Demonstration->Student;
$Competency = $_EVENT['Record']->Skill->Competency;

$completion = $Competency->getCompletionForStudent($Student);

if (
    $completion['demonstrationsCount'] >= $Competency->getTotalDemonstrationsRequired() &&
    $completion['demonstrationsAverage'] >= $Competency->getMinimumAverage() &&
    $completion['currentLevel'] < $Competency->getMaximumTargetLevel()
    ) {

    // enroll student in next level
    StudentCompetency::create([
        'StudentID' => $Student->ID,
        'CompetencyID' => $Competency->ID,
        'Level' => $completion['currentLevel'] + 1,
        'EnteredVia' => 'graduation'
    ], true);
}
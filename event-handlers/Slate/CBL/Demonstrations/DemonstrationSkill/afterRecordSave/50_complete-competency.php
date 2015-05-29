<?php

namespace Slate\CBL;

$Student = $_EVENT['Record']->Demonstration->Student;
$Competency = $_EVENT['Record']->Skill->Competency;

$completion = $Competency->getCompletionForStudent($Student);

if (
        $completion['demonstrationsComplete'] >= $Competency->getTotalDemonstrationsRequired() &&
        (
            $completion['demonstrationsLogged'] == 0 || // if demonstrationsComplete is full but none are logged, the student has fulfilled all their demonstrations via overrides and the average is irrelevant
            $completion['demonstrationsAverage'] >= ($completion['currentLevel'] + $Competency->getMinimumAverageOffset())
        ) &&
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
<?php

namespace Slate\CBL;

use \Slate\CBL\StudentCompetency;

$Student = $_EVENT['Record']->Demonstration->Student;
$Competency = $_EVENT['Record']->Skill->Competency;

$completion = $Competency->getCompletionForStudent($Student);

if (
        StudentCompetency::$autoGraduate &&
        StudentCompetency::isCurrentLevelComplete($Student, $Competency) &&
        $completion['currentLevel'] < $Competency->getMaximumTargetLevel()
   ) {

    // enroll student in next level
    StudentCompetency::create([
        'StudentID' => $Student->ID,
        'CompetencyID' => $Competency->ID,
        'Level' => $completion['currentLevel'] + 1,
        'EnteredVia' => 'graduation',
        'BaselineRating' => $completion['demonstrationsAverage']
    ], true);
}
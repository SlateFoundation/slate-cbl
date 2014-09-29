<?php

namespace Slate\CBL;

$Student = $_EVENT['Record']->Demonstration->Student;
$Competency = $_EVENT['Record']->Skill->Competency;

$ExistingStudentCompetency = StudentCompetency::getByWhere([
    'StudentID' => $Student->ID,
    'CompetencyID' => $Competency->ID
]);

$completion = $Competency->getCompletionForStudent($Student);

#\Debug::dumpVar($completion, false, '$completion');
#\Debug::dumpVar($Competency->getTotalDemonstrationsRequired(), false, '$Competency->getTotalDemonstrationsRequired()');
#\Debug::dumpVar($Competency->getMinimumAverage(), false, '$Competency->getMinimumAverage()');
#\Debug::dumpVar($ExistingStudentCompetency, false, '$ExistingStudentCompetency');

if ($completion['demonstrationsCount'] >= $Competency->getTotalDemonstrationsRequired() && $completion['demonstrationsAverage'] >= $Competency->getMinimumAverage()) {

    if (!$ExistingStudentCompetency) {
        StudentCompetency::create([
            'StudentID' => $Student->ID,
            'CompetencyID' => $Competency->ID,
            'CompletionType' => 'demonstrated'
        ], true);
    }
} else {
    if ($ExistingStudentCompetency) {
        $ExistingStudentCompetency->destroy();
    }
}
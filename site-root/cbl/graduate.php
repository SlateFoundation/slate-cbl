<?php

$GLOBALS['Session']->requireAccountLevel('Staff');
$pretend = !empty($_REQUEST['pretend']);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $studentsGraduating = [];

    $students = \Slate\People\Student::getAllByWhere([
        'Class' => \Slate\People\Student::class
    ]);

    $competencies = \Slate\CBL\Competency::getAll();

    \Site::$debug = !empty($_GET['debug']);

    foreach ($students as $Student) {

        foreach ($competencies as $Competency) {
            $currentLevel = $Competency->getCurrentLevelForStudent($Student);

            if (
                \Slate\CBL\StudentCompetency::isCurrentLevelComplete($Student, $Competency) &&
                $currentLevel < $Competency->getMaximumTargetLevel()
            ) {
                // enroll student in next level
                \Slate\CBL\StudentCompetency::create([
                    'StudentID' => $Student->ID,
                    'CompetencyID' => $Competency->ID,
                    'Level' => $currentLevel + 1,
                    'EnteredVia' => 'graduation'
                ], !$pretend);

                if (!isset($studentsGraduating[$Student->ID])) {
                    $studentsGraduating[$Student->ID] = [
                        'name' => $Student->FullName,
                        'competencies' => []
                    ];
                }

                $studentsGraduating[$Student->ID]['competencies'][] = [
                    'code' => $Competency->Code,
                    'currentLevel' => $currentLevel,
                    'nextLevel' => $currentLevel + 1
                ];
            }
        }
    }


    RequestHandler::respond('cbl/graduate', [
        'studentsGraduating' => $studentsGraduating,
        'pretend' => $pretend
    ]);
}

RequestHandler::respond('cbl/graduate');
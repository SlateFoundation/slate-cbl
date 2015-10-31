<?php

$GLOBALS['Session']->requireAccountLevel('Staff');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = [];
    $students = \Slate\People\Student::getAllByWhere([
        'Class' => \Slate\People\Student::class
    ]);
    // \Debug::dump($students);
    foreach ($students as $Student) {

        $data[$Student->ID] = [
            'Name' => $Student->FullName,
            'Competencies' => []
        ];

        foreach (\Slate\CBL\Competency::getAll() as $Competency) {
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
                ], !empty($_REQUEST['pretend']));

                $data[$Student->ID]['Competencies'][] = $Competency->Code;
            }
        }

        if (!count($data[$Student->ID]['Competencies'])) {
            unset($data[$Student->ID]);
        }
    }

    if (!empty($data)) {
        $responseData = [
            'data' => $data,
            'pretend' => !empty($_REQUEST['pretend'])
        ];
    } else {
        $responseData = [
            'noStudents' => true
        ];
    }
}

RequestHandler::respond('cbl/graduate', $responseData);
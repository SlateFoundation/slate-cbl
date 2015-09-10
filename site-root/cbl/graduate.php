<?php

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
            $StudentCompetency = \Slate\CBL\StudentCompetency::isCurrentLevelComplete($Student, $Competency, $_REQUEST['Pretend']);

            if($StudentCompetency) {
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
            'pretend' => $_REQUEST['Pretend']
        ];
    } else {
        $responseData = [
            'noStudents' => true
        ];
    }
}

RequestHandler::respond('cbl/graduate', $responseData);
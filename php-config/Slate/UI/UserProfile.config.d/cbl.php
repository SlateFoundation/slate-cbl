<?php

Slate\UI\UserProfile::$sources[] = function (Emergence\People\Person $Person) {
    $links = [];

    if ($Person->isA(Slate\People\Student::class)) {
        $studentQuery = http_build_query([
            'student' => $Person->Username
        ]);

        $links['Student Dashboards'] = [
            'Competencies Dashboard' => '/cbl/dashboards/demonstrations/student?' . $studentQuery,
            'Tasks Dashboard' => '/cbl/dashboards/tasks/student?' . $studentQuery
        ];
    }

    return [
        'Competency-Based Learning' => $links
    ];
};
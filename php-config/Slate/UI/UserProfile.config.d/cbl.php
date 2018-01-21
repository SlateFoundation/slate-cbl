<?php

Slate\UI\UserProfile::$sources[] = function (Emergence\People\Person $Person) {
    $links = [];

    if (
        $Person->isA(Slate\People\Student::class) &&
        !empty($GLOBALS['Session']) &&
        (
            // viewer is staff
            $GLOBALS['Session']->hasAccountLevel('Staff') ||

            // viewer is subject
            $GLOBALS['Session']->PersonID == $Person->ID ||

            // viewer is guardian of subject
            in_array(
                $GLOBALS['Session']->PersonID,
                array_map(
                    function($Guardian) {
                        return $Guardian->ID;
                    },
                    $Person->Guardians
                )
            )
        )
    ) {
        $links['Student Dashboards'] = [
            'Competencies Dashboard' => '/cbl/dashboards/demonstrations/student#' . $Person->Username,
            'Tasks Dashboard' => '/cbl/dashboards/tasks/student#' . $Person->Username . '/all'
        ];
    }

    return [
        'Competency-Based Learning' => $links
    ];
};
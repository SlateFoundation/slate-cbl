<?php

if (empty($GLOBALS['Session'])) {
    return;
}

$cblTools = [
    '_icon' => 'cbl'
];

if ($GLOBALS['Session']->hasAccountLevel('Staff')) {
    $cblTools['Competency Dashboard'] = '/cbl/dashboards/demonstrations/teacher';
    $cblTools['Teacher Task Dashboard'] = '/cbl/dashboards/tasks/teacher';
    $cblTools['My Assigned Tasks'] = '/cbl/dashboards/tasks/student';
    $cblTools['Task Manager'] = '/cbl/dashboards/tasks/manager';

    $cblTools['Exports'] = [
        '_icon' => 'export',
        'Demonstrations' => '/cbl/exports/demonstrations.csv',
        'Progress' => [
            '_href' => '/cbl/exports/progress.csv',
            '_icon' => 'bar-chart'
        ]
    ];
} elseif ($GLOBALS['Session']->Person && $GLOBALS['Session']->Person->isA(Slate\People\Student::class)) {
    $cblTools['Competency Dashboard'] = '/cbl/dashboards/demonstrations/student';
    $cblTools['Task Dashboard'] = '/cbl/dashboards/tasks/student';
}

if ($GLOBALS['Session']->Person && !empty($GLOBALS['Session']->Person->Wards)) {
    foreach($GLOBALS['Session']->Person->Wards as $Ward) {
        $cblTools[$Ward->FirstNamePossessive . ' Competency Dashboard'] = '/cbl/dashboards/demonstrations/student?student='.$Ward->Username;
        $cblTools[$Ward->FirstNamePossessive . ' Task Dashboard'] = '/cbl/dashboards/tasks/student?student='.$Ward->Username;
    }
}

Slate\UI\Tools::$tools['Competency-Based Learning'] = $cblTools;
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

Slate\UI\Tools::$tools['Competency-Based Learning'] = $cblTools;

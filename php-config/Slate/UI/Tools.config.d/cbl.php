<?php

if (empty($GLOBALS['Session'])) {
    return;
}

$cblTools = [
    '_icon' => 'cbl'
];

if ($GLOBALS['Session']->hasAccountLevel('Administrator')) {
    $cblTools['Portfolio Manager'] = '/cbl/dashboards/portfolios/admin';
    $cblTools['Enrollments Dashboard'] = '/cbl/dashboards/student-competencies/admin';
}

if ($GLOBALS['Session']->hasAccountLevel('Staff')) {
    $cblTools['Competency Dashboard'] = '/cbl/dashboards/demonstrations/teacher';
    $cblTools['Task Dashboard'] = '/cbl/dashboards/tasks/teacher';
    //$cblTools['My Assigned Tasks'] = '/cbl/dashboards/tasks/student';
    $cblTools['Task Library'] = '/cbl/dashboards/tasks/manager';
} elseif ($GLOBALS['Session']->Person && $GLOBALS['Session']->Person->isA(Slate\People\Student::class)) {
    $cblTools['Competency Dashboard'] = '/cbl/dashboards/demonstrations/student';
    $cblTools['Task Dashboard'] = '/cbl/dashboards/tasks/student';
}

if ($GLOBALS['Session']->Person && !empty($GLOBALS['Session']->Person->Wards)) {
    foreach ($GLOBALS['Session']->Person->Wards as $Ward) {
        if (!$Ward instanceof \Slate\People\Student || $Ward->AccountLevel == 'Disabled') {
            continue;
        }

        $cblTools[$Ward->FirstNamePossessive . ' Competency Dashboard'] = '/cbl/dashboards/demonstrations/student#' . $Ward->Username;
        $cblTools[$Ward->FirstNamePossessive . ' Task Dashboard'] = '/cbl/dashboards/tasks/student#'.$Ward->Username.'/all';
    }
}

Slate\UI\Tools::$tools['Competency-Based Learning'] = $cblTools;
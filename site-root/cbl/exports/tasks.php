<?php
$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;
set_time_limit(0);

$rows = [];

// build and add headers list
$headers = [
    'Student',
    'ID',
    'Task Name',
    'Teacher Assigned',
    'Studio Name',
    'Current Status of task',
    'Due date',
    'Expiration date',
    'Submitted date',
    'Skills Codes'
];

array_push($rows, $headers);

$sw = new SpreadsheetWriter();

// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
$studentTasks = Slate\CBL\Tasks\StudentTask::getAllByWhere('StudentID IN ('.implode(',', array_map(function($Student) {
    return $Student->ID;
}, $students)).')', ['order' => 'ID']);


// create result rows
foreach ($studentTasks as $studentTask) {

    // Get Skill codes for each studentTask
    $taskSkills = $studentTask->Task->Skills;
    $skillCodes = [];

    foreach ($taskSkills as $taskSkill) {
        array_push($skillCodes, $taskSkill->Code);

    }

    // Screen out null timestamps
    $dueDate = $studentTask->DueDate ? date('m/d/Y', $studentTask->DueDate) : '';
    $expirationDate = $studentTask->ExpirationDate ? date('m/d/Y', $studentTask->ExpirationDate) : '';
    $submittedDate = $studentTask->Submitted ? date('m/d/Y', $studentTask->Submitted) : '';

    array_push($rows, [
        $studentTask->Student->getFullName(),
        $studentTask->Student->StudentNumber,
        $studentTask->Task->Title,
        $studentTask->Task->Creator->getFullName(),
        $studentTask->Section->Title,
        $studentTask->TaskStatus,
        $dueDate,
        $expirationDate,
        $submittedDate,
        implode(', ',$skillCodes)
    ]);
}

$sw->writeRows($rows);
$sw->close();



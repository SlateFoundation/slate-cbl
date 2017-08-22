<?php
$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;
set_time_limit(0);


// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
$studentIds = array_map(function($Student) {
    return $Student->ID;
}, $students);

$conditions = [
    'StudentID' => [
        'values' => $studentIds
    ]
];

$format = 'Y-m-d H:i:s';

$from = $_REQUEST['from'] ? date($format, strtotime($_REQUEST['from'])) : null;
$to = $_REQUEST['to'] ? date($format, strtotime($_REQUEST['to'])) : null;

if ($from && $to) {
    $conditions[] = sprintf('Created BETWEEN "%s" AND "%s"', $from, $to);
} else if ($from) {
    $conditions[] = sprintf('Created >= "%s"', $from);
} else if ($to) {
    $conditions[] = sprintf('Created <= "%s"', $to);
}

$studentTasks = Slate\CBL\Tasks\StudentTask::getAllByWhere($conditions);

// create result rows
foreach ($studentTasks as $studentTask) {

    // Get Skill codes for each studentTask
    $skillCodes = [];

    foreach ($studentTask->AllSkills as $skill) {
        array_push($skillCodes, $skill->Code);
    }

    // Screen out null timestamps
    $dueDate = $studentTask->DueDate ? date('m/d/Y', $studentTask->DueDate) : '';
    $expirationDate = $studentTask->ExpirationDate ? date('m/d/Y', $studentTask->ExpirationDate) : '';
    $createdDate = $studentTask->Created ? date("m/d/Y", $studentTask->Created) : '';

    $most_recent_submission = $studentTask->getSubmissionTimestamp();
    $submittedDate = $most_recent_submission ? date('m/d/Y', $most_recent_submission) : '';

    $rows[] = [
        $studentTask->Student->getFullName(),
        $studentTask->Student->StudentNumber,
        $studentTask->Task->Title,
        $studentTask->Task->Creator->getFullName(),
        $createdDate,
        $studentTask->Section->Title,
        $studentTask->TaskStatus,
        $dueDate,
        $expirationDate,
        $submittedDate,
        implode(', ',$skillCodes),
        $studentTask->Section->Course->Code,
        $studentTask->Section->Term->Title
    ];
}

// build and add headers list
$headers = [
    'Student',
    'ID',
    'Task Name',
    'Teacher Assigned',
    'Created',
    'Studio Name',
    'Current Status of task',
    'Due date',
    'Expiration date',
    'Submitted date',
    'Skills Codes',
    'Course Code',
    'Term'
];

$sw = new SpreadsheetWriter();

$sw->writeRow($headers);
$sw->writeRows($rows);
$sw->close();


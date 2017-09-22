<?php
$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;
set_time_limit(0);

// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_REQUEST['students']) ? 'all' : $_REQUEST['students']);
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
for ($i = 0; $i < count($studentTasks); $i++) {

    // Get Skill codes for each studentTask
    $skillCodes = '';

    for ($ii = 0; $ii < count($studentTasks[$i]->AllSkills); $ii++) {
        $skillCodes .= $studentTasks[$i]->AllSkills[$ii]->Code;
        if ($ii + 1 !== count($studentTasks[$i]->AllSkills)) {
            $skillCodes .= ', ';
        }
    }
    $skillCodes = rtrim($skillCodes, ',');

    // Screen out null timestamps
    $dueDate = $studentTasks[$i]->DueDate ? date('m/d/Y', $studentTasks[$i]->DueDate) : '';
    $expirationDate = $studentTasks[$i]->ExpirationDate ? date('m/d/Y', $studentTasks[$i]->ExpirationDate) : '';
    $createdDate = $studentTasks[$i]->Created ? date("m/d/Y", $studentTasks[$i]->Created) : '';

    $most_recent_submission = $studentTasks[$i]->getSubmissionTimestamp();
    $submittedDate = $most_recent_submission ? date('m/d/Y', $most_recent_submission) : '';

    $rows[] = [
        $studentTasks[$i]->Student->getFullName(),
        $studentTasks[$i]->Student->StudentNumber,
        $studentTasks[$i]->Task->Title,
        $studentTasks[$i]->ExperienceType,
        $studentTasks[$i]->Task->Creator->getFullName(),
        $createdDate,
        $studentTasks[$i]->Section->Title,
        $studentTasks[$i]->TaskStatus,
        $dueDate,
        $expirationDate,
        $submittedDate,
        $skillCodes,
        $studentTasks[$i]->Section->Course->Code,
        $studentTasks[$i]->Section->Term->Title
    ];
}

// build and add headers list
$headers = [
    'Student',
    'ID',
    'Task Name',
    'Experience Type',
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


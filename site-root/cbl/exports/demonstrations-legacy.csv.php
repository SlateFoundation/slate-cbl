<?php
$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;


// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_REQUEST['students']) ? 'all' : $_REQUEST['students']);
$studentIds = array_map(function($s) { return $s->ID; }, $students);

$skills = Slate\CBL\Skill::getAll(['order' => 'Code']);

$demonstrationConditions = [
    'StudentID' => [
        'values' => $studentIds
    ]
];

$format = 'Y-m-d H:i:s';

$from = $_REQUEST['from'] ? date($format, strtotime($_REQUEST['from'])) : null;
$to = $_REQUEST['to'] ? date($format, strtotime($_REQUEST['to'])) : null;

if ($from && $to) {
    $demonstrationConditions[] = sprintf('Demonstrated BETWEEN "%s" AND "%s"', $from, $to);
} else if ($from) {
    $demonstrationConditions[] = sprintf('Demonstrated >= "%s"', $from);
} else if ($to) {
    $demonstrationConditions[] = sprintf('Demonstrated <= "%s"', $to);
}


$demonstrations = Slate\CBL\Demonstrations\Demonstration::getAllByWhere(
    $demonstrationConditions,
    [
        'order' => 'ID'
    ]
);

// one row for each demonstration
foreach ($demonstrations AS $Demonstration) {
    $row = [
        date('Y-m-d', $Demonstration->Demonstrated),
        $Demonstration->Student->FullName,
        $Demonstration->Student->StudentNumber,
        'Portfolio Level' => null,
        $Demonstration->Context,
        $Demonstration->ExperienceType,
        $Demonstration->PerformanceType,
        $Demonstration->ArtifactURL,
        $Demonstration->Comments
    ];

    $demonstrationSkills = Slate\CBL\Demonstrations\DemonstrationSkill::getAllByField('DemonstrationID', $Demonstration->ID, ['indexField' => 'SkillID']);

    foreach ($skills AS $Skill) {

        if (array_key_exists($Skill->ID, $demonstrationSkills)) {
            if(!$row['Portfolio Level']) {
                $row['Portfolio Level'] = $demonstrationSkills[$Skill->ID]->TargetLevel;
            }
            $row[] = $demonstrationSkills[$Skill->ID]->DemonstratedLevel ? $demonstrationSkills[$Skill->ID]->DemonstratedLevel : 'M';
        } else {
            $row[] = null;
        }
    }
    $rows[] = $row;
}


$sw = new SpreadsheetWriter();
// build and output headers list
$headers = [
    'Demonstrated',
    'Student Name',
    'Student Number',
    'Portfolio Level',
    'Context',
    'Experience',
    'Task',
    'URL',
    'Comments'
];

foreach ($skills AS $Skill) {
    $headers[] = $Skill->Code;
}
$sw->writeRow($headers);
$sw->writeRows($rows);
$sw->close();
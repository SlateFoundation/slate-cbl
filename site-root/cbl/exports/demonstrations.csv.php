<?php
$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;
set_time_limit(0);

// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
$studentIds = array_map(function($s) { return $s->ID; }, $students);

$skills = Slate\CBL\Skill::getAll(['indexField' => 'ID']);

$demonstrationConditions = [
    'StudentID' => [
        'values' => $studentIds
    ]
];

$format = 'Y-m-d H:i:s';

$from = $_REQUEST['from'] ? date($format, strtotime($_REQUEST['from'])) : null;
$to = $_REQUEST['to'] ? date($format, strtotime($_REQUEST['to'])) : null;

$demonstrationConditions = [];
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

// one row for each demonstration standard
foreach ($demonstrations AS $Demonstration) {
    $demonstrationSkills = $Demonstration->Skills;

    $row = [
        date('Y-m-d H:i', $Demonstration->Created),
        $Demonstration->Creator->FullName,
        $Demonstration->Student->StudentNumber,
        $Demonstration->Student->FullName,
        $Demonstration->ExperienceType,
        $Demonstration->Context,
        $Demonstration->PerformanceType,
        $Demonstration->ArtifactURL
    ];
    // Don't rebuild the row for each standard demonstrated, just overwrite the last set of values
    foreach ($demonstrationSkills AS $DemonstrationSkill) {
        $skill = $DemonstrationSkill->Skill;

        $row['Competency'] = $skill->Competency->Code;
        $row['Standard'] = $skill->Code;

        // For overriden demonstrations, rating should be "O" rather than the DemonstratedLevel
        if ($DemonstrationSkill->Override) {
            $row['Rating'] = 'O';
        } elseif ($DemonstrationSkill->DemonstratedLevel > 0) {
            $row['Rating'] = $DemonstrationSkill->DemonstratedLevel;
        } else {
            $row['Rating'] = 'M';
        }

        $row['Level'] = $DemonstrationSkill->TargetLevel;
        $row['Mapping'] = '';

        $rows[] = $row;
    }
}

// build and output headers list
$headers = [
    'Timestamp',
    'Submitted by',
    'ID',
    'Name',
    'Type of experience',
    'Context',
    'Performance task',
    'Artifact',
    'Competency',
    'Standard',
    'Rating',
    'Level',
    'Mapping'
];

$sw = new SpreadsheetWriter();
$sw->writeRow($headers);
$sw->writeRows($rows);
$sw->close();

<?php
$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;

$sw = new SpreadsheetWriter();

// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
$skills = Slate\CBL\Skill::getAll(['order' => 'Code']);
$demonstrations = Slate\CBL\Demonstrations\Demonstration::getAllByWhere('StudentID IN ('.implode(',', array_map(function($Student) {
    return $Student->ID;
}, $students)).')', ['order' => 'ID']);


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


// one row for each demonstration
foreach ($demonstrations AS $Demonstration) {
    $row = [
        date('Y-m-d', $Demonstration->Demonstrated),
        $Demonstration->Student->FullName,
        $Demonstration->Student->StudentNumber,
        9, // TODO: don't hard code
        $Demonstration->Context,
        $Demonstration->ExperienceType,
        $Demonstration->PerformanceType,
        $Demonstration->ArtifactURL,
        $Demonstration->Comments
    ];

    $demonstrationSkills = Slate\CBL\Demonstrations\DemonstrationSkill::getAllByField('DemonstrationID', $Demonstration->ID, ['indexField' => 'SkillID']);

    foreach ($skills AS $Skill) {
        if (array_key_exists($Skill->ID, $demonstrationSkills)) {
            $row[] = $demonstrationSkills[$Skill->ID]->Level ? $demonstrationSkills[$Skill->ID]->Level : 'M';
        } else {
            $row[] = null;
        }
    }

    $sw->writeRow($row);
}

$sw->close();
<?php
$GLOBALS['Session']->requireAccountLevel('Staff');

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;

$sw = new SpreadsheetWriter();

// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
$skills = Slate\CBL\Skill::getAll(['indexField' => 'ID']);
$demonstrations = Slate\CBL\Demonstrations\Demonstration::getAllByWhere('StudentID IN ('.implode(',', array_map(function($Student) {
    return $Student->ID;
}, $students)).')', ['order' => 'ID']);

$maxSkills = DB::oneValue(
    'SELECT COUNT(*) as TotalSkills FROM `%s` demonstration_skill'.
    ' %s GROUP BY DemonstrationID ORDER BY TotalSkills DESC LIMIT 1',
    [
          Slate\CBL\Demonstrations\DemonstrationSkill::$tableName,
          ($demonstrations ? 'WHERE DemonstrationID IN ('.implode(',', array_map(function ($Demo) {
                return $Demo->ID;
          }, $demonstrations)).')' : '') 
    ]
);

// build and output headers list
$headers = [
    'Timestamp',
    'Submitted by',
    'ID',
    'Name',
    'Type of experience',
    'Context',
    'Perfromance task',
    'Artifact'
];

for ($i=0;$i<$maxSkills;$i++) {
    $headers = array_merge($headers, [
        'Competency',
        'Standard',
        'Rating',
        'Level',
        'Mapping'
    ]);
}

$sw->writeRow($headers);

// one row for each demonstration standard
foreach ($demonstrations AS $Demonstration) {
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
                
    $demonstrationSkills = Slate\CBL\Demonstrations\DemonstrationSkill::getAllByField('DemonstrationID', $Demonstration->ID);

    // Don't rebuild the row for each standard demonstrated, just overwrite the last set of values
    foreach ($demonstrationSkills AS $DemonstrationSkill) {
        $skill = $skills[$DemonstrationSkill->SkillID];
        
        $row[] = $skill->Competency->Code;
        $row[] = $skill->Code;
        $row[] = $DemonstrationSkill->DemonstratedLevel > 0 ?  $DemonstrationSkill->DemonstratedLevel : 'M';
        $row[] = $DemonstrationSkill->TargetLevel;
        $row[] = '';
        $sw->writeRow($row);
    }
}

$sw->close();
<?php
$GLOBALS['Session']->requireAccountLevel('Staff');

use Emergence\People\Person;
use Slate\People\Student;
use Slate\CBL\Skill;
use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;

// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;
set_time_limit(0);

// fetch key objects from database
$students = Student::getAllByListIdentifier(empty($_REQUEST['students']) ? 'all' : $_REQUEST['students']);
$studentIds = array_map(function($s) { return $s->ID; }, $students);

$skills = Skill::getAll(['indexField' => 'ID']);

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

$results = \DB::query(
    'SELECT %2$s.ID, '.
            'DATE(%2$s.Demonstrated) AS Demonstrated, '.
            'CONCAT(%4$s.FirstName, " ", %4$s.LastName) AS Creator, '.
            '%5$s.StudentNumber AS StudentNumber, '.
            'CONCAT(%5$s.FirstName, " ", %5$s.LastName) AS Student, '.
            '%2$s.ExperienceType, '.
            '%2$s.Context, '.
            '%2$s.PerformanceType, '.
            '%2$s.ArtifactURL '.
    ' FROM `%1$s` %2$s '.
    ' LEFT JOIN `%3$s` %4$s '.
    '   ON %2$s.CreatorID = %4$s.ID '.
    ' JOIN `%3$s` %5$s '.
    '   ON %2$s.StudentID = %5$s.ID '.
    'WHERE (%6$s) '.
    'ORDER BY %2$s.ID',
    [
        Demonstration::$tableName,
        Demonstration::getTableAlias(),

        Person::$tableName,
        Person::getTableAlias(),

        'Student',
        join(') AND (', Demonstration::mapConditions($demonstrationConditions))
    ]
);

$sw = new SpreadsheetWriter();
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
#    'Mapping'
];
$sw->writeRow($headers);

while($row = $results->fetch_assoc()) {
    $rowId = $row['ID'];
    unset($row['ID']);
    $demonstrationSkills = DemonstrationSkill::getAllByWhere(['DemonstrationID' => $rowId]);
    for ($i = 0; $i < count($demonstrationSkills); $i++) {

        $row['Competency'] = $demonstrationSkills[$i]->Skill->Competency->Code;
        $row['Standard'] = $demonstrationSkills[$i]->Skill->Code;

        // For overriden demonstrations, rating should be "O" rather than the DemonstratedLevel
        if ($demonstrationSkills[$i]->Override) {
            $row['Rating'] = 'O';
        } elseif ($demonstrationSkills[$i]->DemonstratedLevel > 0) {
            $row['Rating'] = $demonstrationSkills[$i]->DemonstratedLevel;
        } else {
            $row['Rating'] = 'M';
        }

        $row['Level'] = $demonstrationSkills[$i]->TargetLevel;

        $sw->writeRow($row);
    }
}

$sw->close();
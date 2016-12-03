<?php
$GLOBALS['Session']->requireAccountLevel('Staff');
// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;


// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_GET['students']) ? 'all' : $_GET['students']);
$contentAreas = Slate\CBL\ContentArea::getAll(['order' => 'Code']);

$format = 'Y-m-d H:i:s';

$from = $_REQUEST['from'] ? date($format, strtotime($_REQUEST['from'])) : null;
$to = $_REQUEST['to'] ? date($format, strtotime($_REQUEST['to'])) : null;

$conditions = '';
if ($from && $to) {
    $conditions = sprintf('AND %s.Demonstrated BETWEEN "%s" AND "%s"', \Slate\CBL\Demonstrations\Demonstration::getTableAlias(), $from, $to);
} else if ($from) {
    $conditions = sprintf('AND %s.Demonstrated >= "%s"', \Slate\CBL\Demonstrations\Demonstration::getTableAlias(), $from);
} else if ($to) {
    $conditions = sprintf('AND %s.Demonstrated <= "%s"', \Slate\CBL\Demonstrations\Demonstration::getTableAlias(), $to);
}

// collect counts of all missing demonstrations by student+competency
try {

    $missingResults = DB::allRecords(
        'SELECT StudentID, CompetencyID, SUM(neededDemonstrationsMissed) AS totalNeededDemonstrationsMissed'
        .' FROM ('
        .'  SELECT'
        .'    %2$s.StudentID'
        .'    ,Skill.CompetencyID'
        .'    ,%4$s.SkillID'
        .'    ,Skill.DemonstrationsRequired'
        .'    ,SUM(IF(%4$s.DemonstratedLevel = 0, 1, 0)) totalMissing'
        .'    ,SUM(IF(%4$s.DemonstratedLevel != 0, 1, 0)) totalNotMissing'
        .'    ,LEAST('
        .'       GREATEST(Skill.DemonstrationsRequired - SUM(IF(%4$s.DemonstratedLevel != 0, 1, 0)), 0)' // how many needed demonstrations don't have non-missing levels
        .'       ,SUM(IF(%4$s.DemonstratedLevel = 0, 1, 0))' // total missing demonstrations for this skill
        .'    ) AS neededDemonstrationsMissed'
        .'   FROM `%1$s` %2$s'
        .'   JOIN `%3$s` %4$s'
        .'    ON %4$s.DemonstrationID = %2$s.ID'
        .'   JOIN `%5$s` Skill'
        .'    ON Skill.ID = %4$s.SkillID'
        .'   WHERE %2$s.StudentID IN (%6$s)'
        .$conditions
        .'   GROUP BY %2$s.StudentID, %4$s.SkillID'
        .' ) MissingDemonstrationsByStudentSkill'
        .' GROUP BY StudentID, CompetencyID'
        ,[
            Slate\CBL\Demonstrations\Demonstration::$tableName,
            Slate\CBL\Demonstrations\Demonstration::getTableAlias(),
            Slate\CBL\Demonstrations\DemonstrationSkill::$tableName,
            Slate\CBL\Demonstrations\DemonstrationSkill::getTableAlias(),
            Slate\CBL\Skill::$tableName,
            implode(',', array_map(function($Student) {
                return $Student->ID;
            }, $students))
        ]
    );

    $missingDemonstrationsByStudentCompetency = [];
    foreach ($missingResults AS $result) {
        $missingDemonstrationsByStudentCompetency[$result['StudentID']][$result['CompetencyID']] = intval($result['totalNeededDemonstrationsMissed']);
    }
} catch (TableNotFoundException $e) {
    $missingDemonstrationsByStudentCompetency = [];
}


// build and output headers list
$headers = [
    'Student Name',
    'Student Number',
    'Grade Level'
];

foreach ($contentAreas AS $ContentArea) {
    foreach ($ContentArea->Competencies AS $Competency) {
        $headers[] = $Competency->Code . '-Logged';
        $headers[] = $Competency->Code . '-Total';
        $headers[] = $Competency->Code . '-AVG';
    }

    $headers[] = $ContentArea->Code . '-Logged';
    $headers[] = $ContentArea->Code . '-Total';
    $headers[] = $ContentArea->Code . '-Missing';
    $headers[] = $ContentArea->Code . '-AVG';
}


// one row for each demonstration
foreach ($students AS $Student) {
    $uniqueLevels = \DB::allValues(
        'DemonstratedLevel',
        'SELECT DISTINCT(%4$s.DemonstratedLevel) FROM `%1$s` %2$s '.
        'RIGHT JOIN `%3$s` %4$s ON (%2$s.ID = %4$s.DemonstrationID) '.
        'WHERE %2$s.StudentID=%5$u AND %4$s.DemonstratedLevel != 0 '.
        $conditions.
        ' ORDER BY %4$s.DemonstratedLevel ASC',
        [
            Slate\CBL\Demonstrations\Demonstration::$tableName,
            Slate\CBL\Demonstrations\Demonstration::getTableAlias(),
            Slate\CBL\Demonstrations\DemonstrationSkill::$tableName,
            Slate\CBL\Demonstrations\DemonstrationSkill::getTableAlias(),
            $Student->ID
        ]
    );

    foreach ($uniqueLevels as $level) {
        $row = [
            $Student->FullName,
            $Student->StudentNumber,
            $level
        ];
        foreach ($contentAreas AS $ContentArea) {
            $demonstrationsCounted = 0;
            $demonstrationsRequired = 0;
            $demonstrationsMissing = 0;
            $contentAreaAverageTotal = 0;

            foreach ($ContentArea->Competencies AS $Competency) {
                $competencyCompletion = $Competency->getCompletionForStudent($Student, $level);
                $currentLevel = !empty($competencyCompletion['currentLevel']) ? $competencyCompletion['currentLevel'] : 'default'; // use "default" level for calculating er's if user isn't on any level
                $totalDemonstrationsRequired = intval($Competency->getTotalDemonstrationsRequired($currentLevel, true));

                // Logged
                $row[] = intval($competencyCompletion['demonstrationsLogged']);
                // Total
                $row[] = $totalDemonstrationsRequired;
                // Average
                $row[] = intval($competencyCompletion['demonstrationsAverage'] ? round($competencyCompletion['demonstrationsAverage'], 2) : null);

                $demonstrationsCounted += $competencyCompletion['demonstrationsLogged'];
                $demonstrationsRequired += $totalDemonstrationsRequired;

                // averages are weighted by number of demonstrations
                $contentAreaAverageTotal += $competencyCompletion['demonstrationsAverage'] * $competencyCompletion['demonstrationsCount'];

                if(isset($missingDemonstrationsByStudentCompetency[$Student->ID][$Competency->ID])) {
                    $demonstrationsMissing += $missingDemonstrationsByStudentCompetency[$Student->ID][$Competency->ID];
                }

                $row[] = intval($demonstrationsCounted ? round($contentAreaAverageTotal / $demonstrationsCounted, 2) : null);
            }
        }
        $rows[] = $row;
    }
}

$sw = new SpreadsheetWriter();
$sw->writeRow($headers);
$sw->writeRows($rows);
$sw->close();
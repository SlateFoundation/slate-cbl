<?php
$GLOBALS['Session']->requireAccountLevel('Staff');
// This was causing a script timeout (30 seconds), this should help speed it up
\Site::$debug = false;


// fetch key objects from database
$students = Slate\People\Student::getAllByListIdentifier(empty($_REQUEST['students']) ? 'all' : $_REQUEST['students']);
$contentAreas = Slate\CBL\ContentArea::getAll(['order' => 'Code']);

$format = 'Y-m-d H:i:s';

$from = $_REQUEST['from'] ? date($format, strtotime($_REQUEST['from'])) : null;
$to = $_REQUEST['to'] ? date($format, strtotime($_REQUEST['to'])) : null;

$conditions = '';
if ($from && $to) {
    $conditions = sprintf('Demonstrated BETWEEN "%s" AND "%s"', $from, $to);
} else if ($from) {
    $conditions = sprintf('Demonstrated >= "%s"', $from);
} else if ($to) {
    $conditions = sprintf('Demonstrated <= "%s"', $to);
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
        .'   %7$s'
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
            }, $students)),
            !empty($conditions) ? sprintf(' AND %s.%s', Slate\CBL\Demonstrations\Demonstration::getTableAlias(), $conditions) : $conditions
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
        $query = 'SELECT DISTINCT(%4$s.DemonstratedLevel) FROM `%1$s` %2$s '.
        'RIGHT JOIN `%3$s` %4$s ON (%2$s.ID = %4$s.DemonstrationID) '.
        'WHERE %2$s.StudentID=%5$u AND %4$s.DemonstratedLevel != 0 '.
        '%6$s '.
        ' ORDER BY %4$s.DemonstratedLevel ASC',
        $parameters = [
            Slate\CBL\Demonstrations\Demonstration::$tableName,
            Slate\CBL\Demonstrations\Demonstration::getTableAlias(),
            Slate\CBL\Demonstrations\DemonstrationSkill::$tableName,
            Slate\CBL\Demonstrations\DemonstrationSkill::getTableAlias(),
            $Student->ID,
            !empty($conditions) ? sprintf(' AND %s.%s', Slate\CBL\Demonstrations\Demonstration::getTableAlias(), $conditions) : $conditions
        ]
    );

    foreach ($uniqueLevels as $level) {
        $row = [
            $Student->FullName,
            $Student->StudentNumber,
            $level
        ];
        foreach ($contentAreas AS $ContentArea) {
            $totalDemonstrationsCounted = 0;
            $totalDemonstrationsRequired = 0;
            $totalDemonstrationsMissing = 0;
            $contentAreaAverageTotal = 0;

            foreach ($ContentArea->Competencies AS $Competency) {

                $StudentCompetency = \Slate\CBL\StudentCompetency::getByWhere(['StudentID' => $Student->ID, 'CompetencyID' => $Competency->ID, 'Level' => $level]);

                $demonstrationsRequired = intval($Competency->getTotalDemonstrationsRequired($level, true));

                // Logged
                $row[] = $StudentCompetency ? intval($StudentCompetency->getDemonstrationsLogged()) : null;
                // Total
                $row[] = $demonstrationsRequired;
                // Average
                $row[] = $StudentCompetency && $StudentCompetency->getDemonstrationsAverage() ? round($StudentCompetency->getDemonstrationsAverage(), 2) : null;
                $totalDemonstrationsCounted += $StudentCompetency ? $StudentCompetency->getDemonstrationsLogged() : 0;
                $totalDemonstrationsRequired += $demonstrationsRequired;

                // averages are weighted by number of demonstrations
                $contentAreaAverageTotal += $StudentCompetency ? $StudentCompetency->getDemonstrationsAverage() * $StudentCompetency->getDemonstrationsLogged() : null;

                if(isset($missingDemonstrationsByStudentCompetency[$Student->ID][$Competency->ID])) {
                    $totalDemonstrationsMissing += $missingDemonstrationsByStudentCompetency[$Student->ID][$Competency->ID];
                }
            }

            // Content Area Logged
            $row[] = $totalDemonstrationsCounted;
            // Content Area Required
            $row[] = $totalDemonstrationsRequired;
            // Content Area Missing
            $row[] = $totalDemonstrationsMissing;
            // Content Area Average
            $row[] = $totalDemonstrationsCounted ? round($contentAreaAverageTotal / $totalDemonstrationsCounted, 2) : 0;
        }
        $rows[] = $row;
    }
}

$sw = new SpreadsheetWriter();
$sw->writeRow($headers);
$sw->writeRows($rows);
$sw->close();
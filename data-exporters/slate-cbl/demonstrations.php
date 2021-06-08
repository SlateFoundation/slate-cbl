<?php

use Emergence\People\Person;
use Slate\People\Student;
use Slate\CBL\Skill;
use Slate\CBL\Demonstrations\Demonstration;
use Slate\CBL\Demonstrations\DemonstrationSkill;

return [
    'title' => 'Demonstrations',
    'description' => 'Each row represents a demonstration',
    'filename' => 'demonstrations',
    'headers' => [
        'ID',
        'StudentID',
        'CreatorFullName' => 'Teacher FullName',
        'StudentNumber' => 'Student Number',
        'StudentFullName' => 'Student FullName',
        'ExperienceType' => 'Experience Type',
        'Context',
        'PerformanceType' => 'Performance Type',
        'ArtifactURL',
        'CreatorUsername' => 'Teacher Username',
        'Competency',
        'Standard' => 'Skill',
        'Created',
        'Modified',
        'Rating',
        'Level' => 'Portfolio'
    ],
    'readQuery' => function (array $input) {
        $query = [
            'students' => 'all',
            'date_from' => null,
            'date_to' => null,
            'term' => null
        ];

        if (!empty($input['students'])) {
            $query['students'] = $input['students'];
        }

        $Term = null;
        if (!empty($input['term'])) {
            if ($input['term'] === 'current') {
                $Term = Slate\Term::getCurrent();
            } elseif ($input['term'] === 'current-master') {
                $Term = Slate\Term::getCurrent();
                $Term = $Term ? $Term->getMaster() : null;
            } else {
                $Term = Slate\Term::getByHandle($input['term']);
            }

            if ($Term) {
                $query['date_from'] = $Term->StartDate;
                $query['date_to'] = $Term->EndDate;
            }
        } else if (!empty($input['date_to']) || !empty($input['date_from'])) {
            $query['date_to'] = $input['date_to'] ?: null;
            $query['date_from'] = $input['date_from'] ?: null;
        }

        return $query;
    },
    'buildRows' => function (array $query = [], array $config = []) {

        // This was causing a script timeout (30 seconds), this should help speed it up
        \Site::$debug = false;
        set_time_limit(0);

        // fetch key objects from database
        $students = Student::getAllByListIdentifier($query['students']);
        $studentIds = array_map(function($s) { return $s->ID; }, $students);

        $skills = Skill::getAll(['indexField' => 'ID']);

        $demonstrationConditions = [
            'StudentID' => [
                'values' => $studentIds
            ]
        ];

        $format = 'Y-m-d H:i:s';

        $from = $query['date_from'] ? date($format, strtotime($query['date_from'])) : null;
        $to = $query['date_to'] ? date($format, strtotime($query['date_to'])) : null;

        if ($from && $to) {
            $demonstrationConditions[] = sprintf('Demonstrated BETWEEN "%s" AND "%s"', $from, $to);
        } else if ($from) {
            $demonstrationConditions[] = sprintf('Demonstrated >= "%s"', $from);
        } else if ($to) {
            $demonstrationConditions[] = sprintf('Demonstrated <= "%s"', $to);
        }

        $results = \DB::query(
            'SELECT %2$s.ID, '.
                    '%2$s.StudentID, '.
                    'CONCAT(%4$s.FirstName, " ", %4$s.LastName) AS CreatorFullName, '.
                    '%5$s.StudentNumber AS StudentNumber, '.
                    'CONCAT(%5$s.FirstName, " ", %5$s.LastName) AS StudentFullName, '.
                    '%2$s.ExperienceType, '.
                    '%2$s.Context, '.
                    '%2$s.PerformanceType, '.
                    '%2$s.ArtifactURL, '.
                    '%4$s.Username AS CreatorUsername ' .
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

        while($row = $results->fetch_assoc()) {
            $rowId = $row['ID'];
            unset($row['ID']);
            $demonstrationSkills = DemonstrationSkill::getAllByWhere(['DemonstrationID' => $rowId]);
            for ($i = 0; $i < count($demonstrationSkills); $i++) {

                $row['Competency'] = $demonstrationSkills[$i]->Skill->Competency->Code;
                $row['Standard'] = $demonstrationSkills[$i]->Skill->Code;
                $row['Created'] = date('m/d/Y H:i:s P', $demonstrationSkills[$i]->Created);
                $row['Modified'] = $demonstrationSkills[$i]->Modified ? date('m/d/Y H:i:s P', $demonstrationSkills[$i]->Modified) : null;

                // For overriden demonstrations, rating should be "O" rather than the DemonstratedLevel
                if ($demonstrationSkills[$i]->Override) {
                    $row['Rating'] = 'O';
                } elseif ($demonstrationSkills[$i]->DemonstratedLevel > 0) {
                    $row['Rating'] = $demonstrationSkills[$i]->DemonstratedLevel;
                } else {
                    $row['Rating'] = 'M';
                }

                $row['Level'] = $demonstrationSkills[$i]->TargetLevel;
                $row['ID'] = $demonstrationSkills[$i]->ID;

                yield $row;
            }
        }

        $results->free();

    }
];
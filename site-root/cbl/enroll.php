<?php

use Slate\People\Student;
use Slate\CBL\ContentArea;
use Slate\CBL\StudentCompetency;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$students = Student::getAllByListIdentifier($_POST['students']);
	if (empty($students)) {
		throw new Exception('Students list is empty');
	}

	$contentAreas = [];
	foreach ($_POST['content-area'] AS $contentAreaCode) {
		if (!$contentAreas[] = ContentArea::getByCode($contentAreaCode)) {
			throw new Exception('Invalid content area code');
		}
	}

	if (empty($_POST['level']) || !ctype_digit($_POST['level'])) {
		throw new Exception('level must be positive int');
	}

    $baselineRating = null;
    if (!empty($_POST['baselineRating'])) {
        $baselineRating = floatval($_POST['baselineRating']);
    }

	$createdCount = 0;
	foreach ($students AS $Student) {
		foreach ($contentAreas AS $ContentArea) {
			foreach ($ContentArea->Competencies AS $Competency) {
				if (!StudentCompetency::getByWhere(['StudentID' => $Student->ID, 'CompetencyID' => $Competency->ID])) {
				    StudentCompetency::create([
				        'StudentID' => $Student->ID,
				        'CompetencyID' => $Competency->ID,
				        'Level' => $_POST['level'],
                        'BaselineRating' => $baselineRating,
				        'EnteredVia' => 'enrollment'
				    ], true);
					$createdCount++;
				}
			}
		}
	}

	die("Created $createdCount enrollments");
}

RequestHandler::respond('enroll');
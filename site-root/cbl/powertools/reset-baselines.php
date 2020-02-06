<?php

use Slate\CBL\Competency;
use Slate\CBL\ContentArea;
use Slate\CBL\StudentCompetency;

use Slate\People\Student;


$GLOBALS['Session']->requireAccountLevel('Developer');

$students = [];
if (isset($_REQUEST['students'])) {
    $students = Student::getAllByListIdentifier($_REQUEST['students']);
    $studentIds = array_map(function($s){
        return $s->ID;
    }, $students);
}

$contentArea = null;
if (isset($_REQUEST['content_area'])) {
    $contentArea = ContentArea::getByHandle($_REQUEST['content_area']);
}

$updated = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($_REQUEST['update'] as $studentCompetencyId) {
        if (!$StudentCompetency = StudentCompetency::getByID($studentCompetencyId)) {
            continue;
        }

        if (!$Previous = $StudentCompetency->getPrevious()) {
            continue;
        }

        $StudentCompetency->BaselineRating = $Previous->getDemonstrationsAverage();
        $StudentCompetency->save();
        $updated[] = $StudentCompetency->ID;
    }
}

$studentCompetencies = [];
if (!empty($students) && !empty($contentArea)) {
    $studentCompetencies = StudentCompetency::getAllByQuery(
        '
            SELECT studentComp.*
            FROM `%1$s` studentComp
            JOIN (
                SELECT CompetencyID, StudentID, MAX(Level) MaxLevel
                  FROM `%1$s` stuCmp
                WHERE stuCmp.StudentID IN (%3$s)
                    AND stuCmp.CompetencyID IN (%4$s)
                GROUP BY CompetencyID, StudentID
            ) studentComp2
                ON (
                        studentComp.StudentID = studentComp2.StudentID
                    AND studentComp.CompetencyID = studentComp2.CompetencyID
                    AND studentComp.Level = studentComp2.MaxLevel
                )
            JOIN `%2$s` student
                ON student.ID = studentComp.StudentID
            JOIN `%5$s` comp
              ON comp.ID = studentComp.CompetencyID
            GROUP BY studentComp.ID
            ORDER BY student.LastName, student.FirstName, comp.Code
         ',
         [
             StudentCompetency::$tableName,
             Student::$tableName,
             join(', ', $studentIds),
             join(', ', $contentArea->getCompetencyIds()),
             Competency::$tableName
         ]
    );
}

$studentsValue = empty($_REQUEST['students']) ? 'all' : $_REQUEST['students'];
$contentAreaValue = empty($_REQUEST['content_area']) ? '' : $_REQUEST['content_area'];

?>

<style>
    tr.restorable {
        background-color: orange;
    }
    td.restored {
        font-weight: bold;
    }
</style>

<html>
    <body>
    <?=print_r($failed, true)?>
    <form method="get">
        <input type="text" name="students" value="<?=$studentsValue?>"/>
        <select name="content_area">
            <?php foreach (ContentArea::getAll() as $ContentArea) : ?>
                <option value="<?=$ContentArea->Code?>" <?=$contentAreaValue === $ContentArea->Code ? 'selected="selected"' : ''?>><?=$ContentArea->Title?></option>
            <?php endforeach ?>
        </select>
        <button>Filter</button>
    </form>
    <form method="post">
        <input type="text" name="students" value="<?=$studentsValue?>" hidden="hidden"/>
        <input type="text" name="content_area" value="<?=$contentAreaValue?>" hidden="hidden"/>
        <button>Update Selected Student Competencies</button>
        <table border="1">
            <thead>
                <tr>
                    <th>StudentCompetencyID</th>
                    <th>Created</th>
                    <th>Student</th>
                    <th>Competency</th>
                    <th>Level</th>
                    <th>Via</th>
                    <th>Current Baseline</th>
                    <th>Previous Performance Level</th>
                    <th>Update</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($studentCompetencies as $StudentCompetency) : ?>
                    <?php
                    if (!$Previous = $StudentCompetency->getPrevious()) {
                        continue;
                    }
                    $justUpdated = in_array($StudentCompetency->ID, $updated);

                    $restorable =
                        $Previous->getDemonstrationsAverage() &&
                        $StudentCompetency->getBaselineRating() != $Previous->getDemonstrationsAverage();


                    $inputAttribs = $restorable ? '' : 'disabled="disabled"';
                    $tdClass =
                        $justUpdated ?
                            'restored' :
                            '';
                    $trClass =
                        $restorable ?
                            'restorable' :
                            '';
                    ?>

                    <tr class="<?=$trClass?>">
                        <td><?=$StudentCompetency->ID?></td>
                        <td>
                            <?=$StudentCompetency->Creator->Username?>
                            @ <?=date('Y-m-d H:i:s', $StudentCompetency->Created)?>
                        </td>
                        <td><?=$StudentCompetency->Student->Username?></td>
                        <td><?=$StudentCompetency->Competency->Code?></td>
                        <td><?=$StudentCompetency->Level?></td>
                        <td><?=$StudentCompetency->EnteredVia?></td>
                        <td class="<?=$tdClass?>"><?=$StudentCompetency->getBaselineRating()?></td>
                        <td><?=$Previous->getDemonstrationsAverage()?></td>
                        <td>
                            <input
                                type="checkbox"
                                name="update[]"
                                value="<?=$StudentCompetency->ID?>"
                                <?=$inputAttribs?>
                            />
                        </td>
                    </tr>
                    <?php flush() ?>
                <?php endforeach ?>
            </tbody>
        </table>
        <button>Update Selected Student Competencies</button>
    </form>
    </body>
</html>
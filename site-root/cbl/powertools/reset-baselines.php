<?php

use Slate\CBL\Competency;
use Slate\CBL\ContentArea;
use Slate\CBL\StudentCompetency;

use Slate\People\Student;


$GLOBALS['Session']->requireAccountLevel('Administrator');

$students = [];
if (!empty($_REQUEST['students'])) {
    $students = Student::getAllByListIdentifier($_REQUEST['students']);
    $studentIds = array_map(function($s){
        return $s->ID;
    }, $students);
}

$contentArea = null;
if (!empty($_REQUEST['content_area'])) {
    $contentArea = ContentArea::getByHandle($_REQUEST['content_area']);
}

$updated = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $update = $_REQUEST['update'];
    if (!empty($update)) {
        foreach ($update as $studentCompetencyId) {
            if (!$StudentCompetency = StudentCompetency::getByID($studentCompetencyId)) {
                continue;
            }

            if (!$Previous = $StudentCompetency->getPrevious()) {
                continue;
            }

            $StudentCompetency->BaselineRating = max($Previous->getBaselineRating(), $Previous->getDemonstrationsAverage());
            $StudentCompetency->save();
            $updated[] = $StudentCompetency->ID;
        }
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

    $rows = [];
    foreach ($studentCompetencies as $StudentCompetency) {
        if (!$Previous = $StudentCompetency->getPrevious()) {
            continue;
        }

        $baseline = $StudentCompetency->getBaselineRating();
        $previousBaseline = $Previous->getBaselineRating();
        $previousAvg = $Previous->getDemonstrationsAverage();
        $suggestedBaseline = max(
            $previousBaseline,
            $previousAvg
        );
        $delta = $baseline - $suggestedBaseline;
        $rows[] = [
            'id' => $StudentCompetency->ID,
            'created' => [
                'by' => $StudentCompetency->Creator->Username,
                'at' => date('Y-m-d H:i:s', $StudentCompetency->Created)
            ],
            'student' => $StudentCompetency->Student->Username,
            'competency' => $StudentCompetency->Competency->Code,
            'level' => $StudentCompetency->Level,
            'via' => $StudentCompetency->EnteredVia,
            'baseline' => $baseline,
            'previous_baseline' => $previousBaseline,
            'previous_avg' => $previousAvg,
            'update_to' => $suggestedBaseline,
            'delta' => $delta
        ];
    }
    uasort($rows, function($rowA, $rowB) {
        if ($rowA['delta'] == $rowB['delta']) {
            return 0;
        }
        return $rowA['delta'] > $rowB['delta'] ? 1 : -1;
    });
}

$studentsValue = empty($_REQUEST['students']) ? 'all' : $_REQUEST['students'];
$contentAreaValue = empty($_REQUEST['content_area']) ? '' : $_REQUEST['content_area'];

?>

<style>
    tr.restorable {
        background-color: orange;
    }
    table.hide-non-restorable tr.non-restorable {
        display: none;
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
        <label>
            <span>Show Non-Restorable Rows</span>
            <input type="checkbox" id="showall" />
        </label>
        <form method="post">
            <input type="text" name="students" value="<?=$studentsValue?>" hidden="hidden"/>
            <input type="text" name="content_area" value="<?=$contentAreaValue?>" hidden="hidden"/>
            <button>Update Selected Student Competencies</button>
            <table border="1" class="hide-non-restorable" id="baseline-table">
                <thead>
                    <tr>
                        <th>StudentCompetencyID</th>
                        <th>Created</th>
                        <th>Student</th>
                        <th>Competency</th>
                        <th>Level</th>
                        <th>Via</th>
                        <th>Current Baseline</th>
                        <th>Previous Baseline</th>
                        <th>Previous Performance Level</th>
                        <th>Update To</th>
                        <th>Delta</th>
                        <th>
                            <label>Select/Deselect All
                                <input type="checkbox" name="selectall" id="selectall" />
                            </label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($rows as $row) : ?>
                        <?php
                        $justUpdated = in_array($row['id'], $updated);

                        // must have either previous PL/Baseline that does not match current Baseline
                        $restorable =
                            $row['update_to'] &&
                            $row['baseline'] != $row['update_to'];

                        $inputAttribs = $restorable ? '' : 'disabled="disabled"';
                        $tdClass =
                            $justUpdated ?
                                'restored' :
                                '';
                        $trClass =
                            $restorable ?
                                'restorable' :
                                'non-restorable';
                        ?>

                        <tr class="<?=$trClass?>">
                            <td><?=$row['id']?></td>
                            <td>
                                <?=$row['created']['by']?>
                                @ <?=$row['created']['at']?>
                            </td>
                            <td><?=$row['student']?></td>
                            <td><?=$row['competency']?></td>
                            <td><?=$row['level']?></td>
                            <td><?=$row['via']?></td>
                            <td class="<?=$tdClass?>"><?=$row['baseline']?></td>
                            <td><?=$row['previous_baseline']?></td>
                            <td><?=$row['previous_avg']?></td>
                            <td>
                                <?=$row['update_to']?>
                            </td>
                            <td>
                                <?=$row['delta']?>
                            </td>
                            <td>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="update[]"
                                        value="<?=$row['id']?>"
                                        <?=$inputAttribs?>
                                    />
                                </label>
                            </td>
                        </tr>
                        <?php flush() ?>
                    <?php endforeach ?>
                </tbody>
            </table>
            <button>Update Selected Student Competencies</button>
        </form>

        <script type="text/javascript">

            var table = document.getElementById('baseline-table'),
                selectAllField = document.getElementById('selectall'),
                showAllField = document.getElementById('showall'),
                enabledCheckFields = document.querySelectorAll('input[name=update\\[\\]]:enabled');

            selectAllField.addEventListener('change', function() {
                enabledCheckFields.forEach(function(field) {
                    field.checked = selectAllField.checked;
                });
            });

            showAllField.addEventListener('change', function() {
                table.classList[showAllField.checked ? 'remove' : 'add']('hide-non-restorable');
            });

        </script>
    </body>

</html>
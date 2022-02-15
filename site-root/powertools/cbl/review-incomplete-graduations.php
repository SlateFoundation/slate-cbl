<?php

$GLOBALS['Session']->requireAccountLevel('Developer');


$minCreatedTime = strtotime('2019-08-20');
$totalRestored = 0;
set_time_limit(0);
ob_end_flush();


$graduations = Slate\CBL\StudentCompetency::getAllByQuery(
    '
    SELECT StudentCompetency.*
      FROM cbl_student_competencies StudentCompetency
     WHERE Created >= FROM_UNIXTIME(%u) AND EnteredVia = "graduation"
     ORDER BY ID DESC
    ',
    [
        $minCreatedTime
    ]
);
?>

<style>
    tr.complete {
        background-color: #DFD;
    }
    tr.incomplete {
        background-color: #FFD;
    }
    tr.restorable {
        background-color: orange;
    }
    td.restored {
        font-weight: bold;
    }
    td.unrestored {
        color: #AAA;
    }
</style>

<table border="1">
    <thead>
        <tr>
            <th>StudentCompetencyID</th>
            <th>Created</th>
            <th>Student</th>
            <th>Competency</th>
            <th>Level</th>
            <th>Via</th>
            <th>Baseline</th>
            <th>Previous</th>
        </tr>
    </thead>

    <tbody>
        <?php foreach ($graduations as $StudentCompetency) : ?>
            <?php
            $previous = Slate\CBL\StudentCompetency::getAllByWhere([
                'StudentID' => $StudentCompetency->StudentID,
                'CompetencyID' => $StudentCompetency->CompetencyID,
                'Level' => [
                    'operator' => '<',
                    'value' => $StudentCompetency->Level
                ]
            ], [
                'order' => ['Level' => 'DESC']
            ]);

            $restorable =
                $StudentCompetency->EnteredVia == 'graduation'
                && !$previous[0]->isLevelComplete();

            ?>
            <tr class="<?= $restorable ? 'restorable' : '' ?>">
                <td><?=$StudentCompetency->ID?></td>
                <td>
                    <?=$StudentCompetency->Creator->Username?>
                    @ <?=date('Y-m-d H:i:s', $StudentCompetency->Created)?>
                </td>
                <td><?=$StudentCompetency->Student->Username?></td>
                <td><?=$StudentCompetency->Competency->Code?></td>
                <td><?=$StudentCompetency->Level?></td>
                <td><?=$StudentCompetency->EnteredVia?></td>
                <td><?=$StudentCompetency->BaselineRating?></td>
                <td>
                    <table>
                        <?php foreach ($previous as $PreviousStudentCompetency) : ?>
                        <tr class="<?=$PreviousStudentCompetency->isLevelComplete() ? 'complete' : 'incomplete'?>">
                            <td><?=$PreviousStudentCompetency->Level?></td>
                            <td><?=$PreviousStudentCompetency->EnteredVia?></td>
                            <td>
                                <?=$PreviousStudentCompetency->Creator->Username?>
                                @ <?=date('Y-m-d H:i:s', $PreviousStudentCompetency->Created)?>
                            </td>
                        </tr>
                        <?php endforeach ?>
                    </table>
                </td>
                <?php if ($restorable) : ?>
                    <td class="<?=$restored ? 'restored' : 'unrestored'?>"><?=$restoreTo?></td>
                <?php endif ?>
            </tr>
            <?php flush() ?>
        <?php endforeach ?>
    </tbody>
</table>

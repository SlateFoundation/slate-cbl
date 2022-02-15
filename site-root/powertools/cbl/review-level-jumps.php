<?php

use Slate\CBL\Demonstrations\DemonstrationSkill;

$GLOBALS['Session']->requireAccountLevel('Developer');

$jumpedDemoSkills = DemonstrationSkill::getAllByQuery(
    '
    SELECT Current.*
      FROM cbl_demonstration_skills Current
      JOIN history_cbl_demonstration_skills Historic
        ON (Historic.ID = Current.ID AND Historic.TargetLevel != Current.TargetLevel)
     GROUP BY Historic.ID DESC
    '
);

$minModifiedTime = strtotime('2019-08-20');
$totalRestored = 0;
set_time_limit(0);
ob_end_flush();

if (!empty($_POST['execute'])) {
    DemonstrationSkill::$allowTargetLevelChanges = true;
}

?>

<?php if (empty($_POST['execute'])) : ?>
    <form method="POST"><input type="submit" name="execute" value="Execute Restorations"></form>
<?php endif ?>

<style>
    tr.current td {
        color: #AAA;
    }
    tr.restorable {
        background-color: #DFD;
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
            <th>DemonstrationSkillID</th>
            <th>DemonstrationID</th>
            <th>Student</th>
            <th>Skill</th>
            <th>Last Edit</th>
            <td>Current Level/Rating</td>
            <td>Recorded History</td>
            <td><?= empty($_POST['execute']) ? 'Would Restore' : 'Restored' ?> To</td>
        </tr>
    </thead>

    <tbody>
        <?php foreach ($jumpedDemoSkills as $DemoSkill) : ?>
            <?php
            $history = DB::allRecords(
                '
                SELECT RevisionID,
                    Created, CreatorID,
                    Modified, ModifierID,
                    TargetLevel,
                    DemonstratedLevel
                FROM history_cbl_demonstration_skills
                WHERE ID = %u
                ORDER BY RevisionID DESC
                ',
                $DemoSkill->ID
            );

            $restorable =
                count($history) > 1
                && $DemoSkill->TargetLevel == $history[0]['TargetLevel']
                && $DemoSkill->TargetLevel != $history[count($history)-1]['TargetLevel']
                && $DemoSkill->Modified > $minModifiedTime;

            $restoreTo = $restorable ? $history[count($history)-1]['TargetLevel'] : null;

            if (!empty($_POST['execute']) && $restorable) {
                $DemoSkill->TargetLevel = $restoreTo;
                $DemoSkill->save();
                $restored = true;
                $totalRestored++;
            } else {
                $restored = false;
            }

            ?>
            <tr class="<?= $restorable ? 'restorable' : '' ?>">
                <td><?=$DemoSkill->ID?></td>
                <td><?=$DemoSkill->DemonstrationID?></td>
                <td><?=$DemoSkill->Demonstration->Student->Username?></td>
                <td><?=$DemoSkill->Skill->Code?></td>
                <td>
                    <?=$DemoSkill->Modifier ? $DemoSkill->Modifier->Username : $DemoSkill->Creator->Username?>
                    @ <?=date('Y-m-d H:i:s', $DemoSkill->Modified?:$DemoSkill->Created)?>
                </td>
                <td><?=$DemoSkill->TargetLevel?>/<?=$DemoSkill->DemonstratedLevel?></td>
                <td>
                    <table>
                        <?php foreach ($history as $demoSkillRevision) : ?>
                        <tr class="<?= $demoSkillRevision['TargetLevel'] == $DemoSkill->TargetLevel ? 'current' : ''?>">
                            <td><?=$demoSkillRevision['TargetLevel']?>/<?=$demoSkillRevision['DemonstratedLevel']?></td>
                            <td>
                                <?=Emergence\People\Person::getByID($demoSkillRevision['ModifierID']?:$demoSkillRevision['CreatorID'])->Username?>
                                @ <?=$demoSkillRevision['Modified']?:$demoSkillRevision['Created']?>
                            </td>
                            <td><?=$demoSkillRevision['RevisionID']?></td>
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

<p><?=number_format($totalRestored)?> levels restored to initial value</p>
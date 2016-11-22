<?php

$skipped = true;

// migration
if (static::tableExists('cbl_demonstrations') && !static::getColumnIsNullable('cbl_demonstrations', 'Demonstrated')) {
    DB::nonQuery('ALTER TABLE `cbl_demonstrations` CHANGE `Demonstrated` `Demonstrated` timestamp NULL default NULL');
    $skipped = false;
}

if (static::tableExists('history_cbl_demonstrations') && !static::getColumnIsNullable('history_cbl_demonstrations', 'Demonstrated')) {
    DB::nonQuery('ALTER TABLE `history_cbl_demonstrations` CHANGE `Demonstrated` `Demonstrated` timestamp NULL default NULL');
    $skipped = false;
}


// done
return $skipped ? static::STATUS_SKIPPED : static::STATUS_EXECUTED;
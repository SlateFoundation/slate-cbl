<?php


// skip conditions
if (!static::tableExists('history_demonstrations')) {
    print("Skipping migration because table `history_demonstrations` does not exist\n");
    return static::STATUS_SKIPPED;
}

if (static::tableExists('history_cbl_demonstrations')) {
    print("Skipping migration because table `history_cbl_demonstrations` already exists\n");
    return static::STATUS_SKIPPED;
}


// migration
print("Renaming table `history_demonstrations` to `history_cbl_demonstrations`\n");
DB::nonQuery('ALTER TABLE history_demonstrations RENAME history_cbl_demonstrations;');


// done
return static::STATUS_EXECUTED;


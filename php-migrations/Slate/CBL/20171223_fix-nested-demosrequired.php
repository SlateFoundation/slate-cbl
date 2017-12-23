<?php

$skillsResult = DB::query(
    'SELECT ID, DemonstrationsRequired FROM `%s` WHERE DemonstrationsRequired LIKE \'{"default": "{%%}"}\'',
    [
        Slate\CBL\Skill::$tableName
    ]
);


if (!$skillsResult->num_rows) {
    print("No skills needing repair found.\n");
    return statiC::STATUS_SKIPPED;
}


printf("Repairing %u rows...\n", $skillsResult->num_rows);

while ($row = $skillsResult->fetch_assoc()) {
    DB::nonQuery(
        'UPDATE `%s` SET DemonstrationsRequired = "%s"',
        [
            Slate\CBL\Skill::$tableName,
            DB::escape(json_decode(substr($row['DemonstrationsRequired'], 12, -1)))
        ]
    );
}

return static::STATUS_EXECUTED;
<?php

namespace Slate\CBL;

if (!static::tableExists(Skill::$tableName)) {
    return static::STATUS_SKIPPED;
}

foreach (Skill::getAll() as $Skill) {
    if ($Skill->DemonstrationsRequired) {
        $Skill->DemonstrationsRequired = array_map('intval', $Skill->DemonstrationsRequired);
        $Skill->save();
    }
}

return static::STATUS_EXECUTED;
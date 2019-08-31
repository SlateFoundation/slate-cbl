<?php

namespace Slate\CBL;

use Exception;

if (!static::tableExists(Skill::$tableName)) {
    return static::STATUS_SKIPPED;
}

foreach (Skill::getAll() as $Skill) {
    if ($Skill->DemonstrationsRequired && is_array($Skill->DemonstrationsRequired)) {

        try {
            $Skill->DemonstrationsRequired = array_map(function ($value) {
                if (is_int($value)) {
                    return $value;
                } elseif (ctype_digit($value)) {
                    return intval($value);
                } elseif ($value === null) {
                    return null;
                } else {
                    throw new Exception('invalid value '.$value);
                }
            }, $Skill->DemonstrationsRequired);
        } catch (Exception $e) {
            printf("Failed to convert DemonstrationsRequired for skill #%u: %s\n", $Skill->ID, $e->getMessage());
            return static::STATUS_FAILED;
        }

        $Skill->save();
    }
}

return static::STATUS_EXECUTED;

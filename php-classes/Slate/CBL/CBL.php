<?php

namespace Slate\CBL;

class CBL
{
    public static $continuaUrl;

    public static $minRating = 1;
    public static $maxRating = 13;
    public static $minSliderRating = 8;
    public static $allowMissingRating = true;

    public static $levels = [
        9, 10, 11, 12
    ];

    public static $levelColors = [
        'pink' => '#d94181',
        'orange' => '#ffa200',
        'green' => '#5dc02a',
        'blue' => '#008cc1'
    ];

    public static function getLevelsConfig($indexed = true)
    {
        $levels = static::$levels;
        $levelsCfg = [];
        $usedColors = [];

        $allColors = static::$levelColors;

        foreach ($levels as $key => $value) {
            if (is_array($value)) {
                $levelsCfg[$key] = [
                    'label' => $value['label'] ?: static::getDefaultLevelLabel($key),
                    'color' => $value['color'] ?: static::getDefaultColor($usedColors),
                    'description' => $value['description'] ?: null,
                    'level' => $key
                ];
                $usedColors[] = $levelsCfg[$key]['color'];
                $levelsCfg[$key]['colorCode'] = $allColors[$levelsCfg[$key]['color']];
            } else if (is_int($value)) {
                $levelsCfg[$value] = [
                    'label' => static::getDefaultLevelLabel($value),
                    'color' => static::getDefaultColor($usedColors),
                    'description' => null,
                    'level' => $value
                ];
                $usedColors[] = $levelsCfg[$value]['color'];
                $levelsCfg[$value]['colorCode'] = $allColors[$levelsCfg[$value]['color']];
            }

        }

        return $indexed ? $levelsCfg : array_values($levelsCfg);
    }

    public static function getRatingsConfig()
    {
        return [
            'min' => static::$minRating,
            'max' => static::$maxRating,
            'sliderMin' => static::$minSliderRating,
            'allowMissing' => (bool) static::$allowMissingRating
        ];
    }

    protected static function getDefaultLevelLabel($level)
    {
        return 'L'.$level;
    }

    protected static function getDefaultColor(array $usedColors = [])
    {
        $color = null;
        $allColors = array_keys(static::$levelColors);
        $totalColors = count($allColors);
        $idx = 0;

        do {
            if ($idx >= $totalColors) {
                $orderedColors = array_count_values($usedColors);
                asort($orderedColors);
                $colors = array_keys($orderedColors);

                if (count(array_unique($orderedColors)) === 1) {
                    $color = $usedColors[0];
                } else {
                    $color = reset($colors);
                }
            } elseif (isset($allColors[$idx])) {
                $color = $allColors[$idx];
            }
            $idx++;
        } while (empty($color) || (in_array($color, $usedColors) && $idx < $totalColors + 1));

        return $color;
    }
}

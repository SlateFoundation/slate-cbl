<?php

namespace Slate\CBL\Calculators\Growth;

use Slate\CBL\StudentCompetency;

class MostRecentMinusFirst implements IGrowthCalculator
{
    public static function calculateGrowth(StudentCompetency $StudentCompetency)
    {
        $demonstrationData = $StudentCompetency->getDemonstrationsData();
        $growthData = array_filter(array_map(function($demonstrations) use ($StudentCompetency) {
            // filter out overrides and missed demonstrations
            $demonstrations = array_filter($demonstrations, function ($demonstration) {
                return $demonstration['DemonstratedLevel'] && empty($demonstration['Override']);
            });

            // growth can only be calculated if 2 ratings are available, or 1 rating and a baseline
            if (count($demonstrations) + ($StudentCompetency->BaselineRating ? 1 : 0) < 2) {
                return null;
            }

            $lastRating = end($demonstrations);
            if ($StudentCompetency->BaselineRating) {
                return $lastRating['DemonstratedLevel'] - $StudentCompetency->BaselineRating;
            } else {
                $firstRating = reset($demonstrations);

                return $lastRating['DemonstratedLevel'] - $firstRating['DemonstratedLevel'];
            }
        }, $demonstrationData));

        $totalGrowthSkills = count($growthData);
        if ($totalGrowthSkills && $totalGrowthSkills * 2 >= $StudentCompetency->Competency->getTotalSkills()) {
            return array_sum($growthData) / $totalGrowthSkills;
        } else {
            return null;
        }
    }
}
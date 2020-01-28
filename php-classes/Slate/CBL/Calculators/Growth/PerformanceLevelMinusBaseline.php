<?php

namespace Slate\CBL\Calculators\Growth;

use Slate\CBL\StudentCompetency;

class PerformanceLevelMinusBaseline implements IGrowthCalculator
{
    public static function calculateGrowth(StudentCompetency $StudentCompetency)
    {
        $baseline = $StudentCompetency->getBaselineRating();
        $performanceLevel = $StudentCompetency->getDemonstrationsAverage();

        // baseline & performance level must > 0
        if (!$performanceLevel || !$baseline) {
            return false;
        }

        // need two ratings, or a rating and baseline to calc growth
        $skillsWithRatings = 0;
        foreach ($StudentCompetency->getEffectiveDemonstrationsData() as $skillId => $demonstrations) {
            if (count($demonstrations) + ($baseline ? 1 : 0) >= 2) {
                $skillsWithRatings++;
            }
        }

        if ($skillsWithRatings * 2 < $StudentCompetency->Competency->getTotalSkills()) {
            return false;
        } else {
            return $performanceLevel - $baseline;
        }
    }
}
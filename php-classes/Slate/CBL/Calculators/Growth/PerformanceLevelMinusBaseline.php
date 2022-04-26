<?php

namespace Slate\CBL\Calculators\Growth;

use Slate\CBL\StudentCompetency;

class PerformanceLevelMinusBaseline implements IGrowthCalculator
{
    public static function calculateGrowth(StudentCompetency $StudentCompetency)
    {
        $baseline = $StudentCompetency->getBaselineAverage();
        $performanceLevel = $StudentCompetency->getDemonstrationsAverage();

        // try to build dynamic baseline:
        if ($baseline === null) {
            $earliestRatings = [];
            $neededRatings = 0;
            $demonstrations = $StudentCompetency->getDemonstrationsData();

            // find the earliest rating for each skill and count up how many skills have non-zero ER
            foreach ($StudentCompetency->Competency->getActiveSkills() as $Skill) {
                // don't count as needed or grab earliest rating if ER==0
                if (0 === $Skill->getDemonstrationsRequiredByLevel($StudentCompetency->Level)) {
                    continue;
                }

                $neededRatings++;

                if (!empty($demonstrations[$Skill->ID])) {
                    // find the rating with the earliest demonstration date
                    $earliestTimestamp = null;
                    $earliestRating = null;

                    foreach ($demonstrations[$Skill->ID] as $skillDemonstration) {
                        // skip this one if we've already found an earlier one
                        if ($earliestTimestamp !== null
                            && $earliestTimestamp < $skillDemonstration['DemonstrationDate']
                        ) {
                            continue;
                        }

                        // skip M ratings
                        if ($skillDemonstration['DemonstratedLevel'] === 0) {
                            continue;
                        }

                        // otherwise, this is our new earliest rating
                        $earliestRating = $skillDemonstration['DemonstratedLevel'];
                        $earliestTimestamp = $skillDemonstration['DemonstrationDate'];
                    }

                    // add this skill's earliest rating to the list, if one was found
                    if ($earliestRating !== null) {
                        $earliestRatings[] = $earliestRating;
                    }
                }
            }

            $earliestRatingsCount = count($earliestRatings);
            if (
                $earliestRatingsCount > 0
                && (
                    $earliestRatingsCount === $neededRatings
                    || $StudentCompetency->getProgress() >= 0.5
                )
            ) {
                $baseline = array_sum($earliestRatings) / $earliestRatingsCount;
            }
        }

        // baseline & performance level must > 0
        if (!$performanceLevel || !$baseline) {
            return false;
        }

        return $performanceLevel - $baseline;
    }
}
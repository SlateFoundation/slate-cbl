<?php

namespace Slate\CBL\Calculators\Growth;

use Slate\CBL\StudentCompetency;

interface IGrowthCalculator
{
    public static function calculateGrowth(StudentCompetency $StudentCompetency);
}
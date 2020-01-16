<?php

namespace Slate\CBL;

interface IGrowthCalculator
{
    public static function calculateGrowth(StudentCompetency $StudentCompetency);
}
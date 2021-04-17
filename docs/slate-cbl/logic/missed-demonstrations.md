# Missed Demonstrations

The number of missed demonstrations for a given student+skill is calculated as follows:

1. If any override is logged for the given student+skill, **0** missed demonstrations are reported, regardless of any missed demonstrations that may have been logged before the override.
2. Count the number of missed demonstrations logged. Missed demonstrations are stored like normal demonstrations but with `DemonstratedLevel` equal to the special value `0`.
3. If any demonstrations are logged for the given skill where `DemonstratedLevel` **does not equal** `0`, even those below `TargetLevel`, these are subtracted from the number of demonstrations required for the given skill to obtain the *remaining* number of demonstrations required.
4. If there are more missed demonstrations logged than the number produced by step #3, the lesser number is reported.

# Growth

## Baseline Rating

Baseline ratings are stored on the `StudentCompetency` model, and can come to be set three ways:

* In bulk via the enrollment tool
* From the average of the previous level during auto-graduation
* If no baseline is otherwise set by the time at least one rating is available for every skill, the average of the earliest rating in each skill is saved as the baseline

## Skill Growth

If a baseline rating is available, growth for each skill is calculated as the difference between the baseline rating and the most recent rating for that skill. If no baseline rating is available, growth is calculated as the difference between the oldest and most recent rating. If no baseline or less than two ratings are available for a given skill, no growth calculation is available. Missed and overridden skill demonstrations are filtered out before any growth calculations are made.

## Competency Growth

If at least half the skills in a competency have growth calculations available, growth for the competency is calculated as the average of available skill growth calculations.

## Content Area Growth

If at least one competency has a growth calculation available, growth for the content area is calculated as the average of all available competency growth calculations.

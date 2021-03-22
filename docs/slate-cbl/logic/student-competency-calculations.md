## Student Competency Functions

### getDemonstrationData

Get demonstrations, **grouped** by `SkillID` and **ordered** by `DemonstrationDate` and `DemonstrationID`

#### Output:
Array of demonstrations


### getDemonstrationOpportunities
Equal to the total amount of **non-Override demonstrations** found in `getDemonstrationData`

#### Output:
Array of demonstrations


### sortDemonstrations
Demonstrations are sorted by their `ID`

#### Output:
Array of demonstrations


### sortEffectiveDemonstrations
Sort demonstrations by `DemonstratedLevel`, or by the `sortDemonstrations` method if the demonstrations have the same `DemonstratedLevel`

#### Output:
Array of demonstrations


### getEffectiveDemonstrationsData
- Sort `getDemonstrationData` via `sortEffectiveDemonstrations`.
    - Reduce the number of demonstrations to the amount of *demonstrations required for the respective `Level`*
- Sort the demonstrations again via `sortDemonstrations`

#### Output:
Array of demonstrations

### getDemonstrationsLogged
- Get demonstrations via `getEffectiveDemonstrationsData`
    - Exclude **Override** records
    - Exclude records that do not have a **DemonstratedLevel**

#### Output:
Total of demonstrations found

### getDemonstrationsMissed
- Get demonstrations via `getEffectiveDemonstrationsData`
    - Exclude **Override** records
    - Exclude records that have a **DemonstratedLevel**

#### Output:
Total of demonstrations found

### getDemonstrationsComplete
- Get demonstrations via `getEffectiveDemonstrationsData`
    - If `DemonstratedLevel` is set:
        - Increase the total by **1**
    - If record is an **Override**:
        - Increase the total by the amount of demonstrations required for the respective Skill Level (via `Skill::getDemonstrationsRequiredByLevel()`)
        - If the Demonstration is an **Override**, equal to the the amount of skills required for that demonstration.

#### Output:
Total of demonstrations completed

### getDemonstrationsAverage
Equal to the total of `DemonstratedLevel` for demonstrations via `getEffectiveDemonstrations` that are *not an Override*, **divided** by the amount of demonstrations via `getDemonstrationsLogged`. (*There must be at least one demonstration logged.*)

#### Output:
Average **DemonstratedLevel** for demonstrations

### getDemonstrationsRequired
- Get demonstrations required for the respective **`Competency`** and **`Level`**


#### Output:
Total of demonstrations required

### getMinimumAverage
- Get minimum average rating for the respective **Level**

This can be implemented in the following ways. Implementation will vary based on Slate configuration.
- Hard-coded array of **Levels** mapped to the custom **Minimum Average**
- Hard-coded function that can determine the **Minimum Average** based on the **StudentComptency**
- Hard-coded **Minimum Average** value

#### Output:
Minimum Average Rating

### getMinimumRating
- Get minimum rating for the respective **Level**

This can be implemented in the following ways. Implementation will vary based on Slate configuration.
- Hard-coded array of **Levels** mapped to the custom **Minimum Rating**
- Hard-coded function that can determine the **Minimum Rating** based on the **StudentComptency**
- Hard-coded **Minimum Rating** value

#### Output:
Minimum Rating

### isLevelComplete
- Determine if the respective **Level** is completed by:
    - Getting the total of demonstrations (Evidence Required) for the respective **Competency** and confirming that:
        - The amount of demonstrations completed (via `getDemonstrationsCompleted`) is greater than or equal to the amount of Evidence Required
        - The average demonstration rating (via `getDemonstrationsAverage`) is greater than or equal to the minimum average (via `getMinimumAverage`)
        - All ratings (via `getEffectiveDemonstrations`) are above the minimum rating (via `getMinimumRating`)
    - Custom **Level Is Complete** function that determines if the level is completed for the given **StudentCompetency** Implementation will vary based on Slate configuration.

#### Output:
**True** or **False**

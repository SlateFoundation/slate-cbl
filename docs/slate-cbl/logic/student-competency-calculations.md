## Student Competency Functions

### getDemonstrationData

Get demonstrations, **grouped** by `SkillID` and **ordered** by `DemonstrationDate` and `DemonstrationID`


### getDemonstrationOpportunities
Equal to the total amount of **non-Override demonstrations** found in `getDemonstrationData`

### sortDemonstrations
Demonstrations are sorted by their `ID`

### sortEffectiveDemonstrations
Sort demonstrations by `DemonstratedLevel`, or by the `sortDemonstrations` method if the demonstrations have the same `DemonstratedLevel`

### getEffectiveDemonstrationsData
Sort `getDemonstrationData` via `sortEffectiveDemonstrations`. Reduce the number of demonstrations to the amount of *demonstrations required for the respective `Level`*, then finally sort the demonstrations again via `sortDemonstrations`

### getDemonstrationsLogged
Equal to the number of demonstrations via `getEffectiveDemonstrationsData` that are *not an **Override**, and have a `DemonstratedLevel` recorded.*

### getDemonstrationsMissed
Equal to the number of demonstrations via `getEffectiveDemonstrationsData` that are *not an **Override**, and **do not** have a `DemonstratedLevel` recorded (aka `M` rating).*

### getDemonstrationsComplete
Equal to the amount of demonstrations via `getEffectiveDemonstrationsData` that have a `DemonstratedLevel` **OR** if the Demonstration is an *Override*, equal to the the amount of skills required for that demonstration.

### getDemonstrationsAverage
Equal to the total of `DemonstratedLevel` for demonstrations via `getEffectiveDemonstrations` that are *not an Override*, **divided** by the amount of demonstrations via `getDemonstrationsLogged`. (*There must be at least one demonstration logged.*)

### getDemonstrationsRequired
Equal to the number of demonstrations required for the **`Competency`** for the respective **`Level`**


### getMinimumAverage

### getMinimumRating

### isLevelComplete

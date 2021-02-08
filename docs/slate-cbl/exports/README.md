# Data Exports

## Demonstrations-legacy \(CSV\)

* Lists all the information entered for a specific demonstration in a single row
* Includes the continuum level logged for each standard
* Can be customized through the URL to only include students of specific groups or course sections
* Example of download URL: /cbl/exports/demonstrations?students=group+class\_of\_2018
* [Link to example doc](https://docs.google.com/spreadsheets/d/18F9aDXH7bgMUG_p7265aY0JoI_TDJ-tcSf4oLNWFV-Y/edit#gid=0)

## Demonstrations \(CSV\)

* Organized with each skill on a separate row so that each demonstration may occpy multiple rows
* Includes all details for each demonstration as well as the relevant competency, standard, rating and level
* Example of download URL: /cbl/exports/demonstrations-legacy?students=group+class\_of\_2018

## Competencies \(CSV\)

* Organized with each student on a single line
* Every subject area and competency is represented on the CSV for every student
* Each competency has columns for Logged \(number of demonstrations\), Total \(total evidence requirements needed to progress\) and Average \(average score within that competency\)
* Each content area has columns for Logged \(total number of demonstrations\), Total \(total evidence requirements for the entire content area\), Missed \(total missed demonstrations\), and -Average \(average score of all competencies\)
* Example of download URL: /cbl/exports/competencies?students=group+class\_of\_2018
* [Link to example doc](https://docs.google.com/spreadsheets/d/1JugtlX931tKcOhmir31J_GqeLy-4J2y3gIJyu4aKMdI/edit#gid=0)

## Competencies-details \(CSV\)

* Organized with a unique row for each student for each competency \(total number of rows for each student equals the total number of active or completed competency portfolio levels\)
* Each competency lists the portfolio level, average performance level, growth, progress %, total evidence requirements, total opportunities, total completed evidence requirements, total rated evidence requirements \(non M or Override\) and total missed evidence requirements
  * Growth is calculated by including only the skills that have multiple numerical ratings \(not M or Override\). For each skill, you subtract the oldest from the most recent demonstration and then average this skill growth with all the other skills in that competency and portfolio level that had multiple numerical logs \(and thus could calculate growth\). Skills that have only one demonstration can not have growth and thus are NULL for growth. If within a competency, only one skill has growth for the given portfolio level, the growth of the competency equals the growth of that one skill.
* Example of download URL: /cbl/exports/competencies-details?students=group+class\_of\_2018

## Content-areas \(CSV\)

* Organized with a unique row for each student for each content area level \(total number of rows for each student equals the total number of completed or active content area portfolio levels\)
* Each content area row lists the portfolio level, performance level, growth, progress %, total evidence requirements, total opportunities, completed evidence requirements, rated evidence requirements \(non M or Override\), and missed evidence requirements
  * Growth is calculated by including only the skills that have two or more numerical ratings \(not M or Override\). For each skill, you subtract the oldest from the most recent demonstration and then average this skill growth with all the other skills that have growth in the given competency at that level. Then, you average the growth for each competency to calculate the growth for the content area. This means that if a single skill within a competency is the only one that has growth, the growth for that skill is treated as the competency growth and factors strongly into the averaging. If no skill in a competency has growth \(they're all NULL\), then the competency growth is NULL and should not count towards the content-area growth average.
* Example of download URL: /cbl/exports/content-areas?students=group+class\_of\_2018

## Tasks \(CSV\)

* Organized with a unique row for each task rated for each student
* Each row lists the student, their ID, task name, teacher who assigned it, studio, status of the task, due date, expiration date, submitted date and skill codes
* Example of download URL: /cbl/exports/tasks?students=group+class\_of\_2018

<?php

use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;

use Slate\CBL\Demonstrations\DemonstrationSkill;

use Slate\CBL\Tasks\Task;
use Slate\CBL\Tasks\StudentTask;
use Slate\CBL\Tasks\StudentTaskSkill;
use Slate\CBL\Tasks\TaskSkill;

use Slate\Term;

use Slate\People\Student;

set_time_limit(0);

$GLOBALS['Session']->requireAccountLevel('Administrator');

$studentTaskConditions = [];
$taskConditions = [];

$students = [];
if (!empty($_REQUEST['students'])) {
    try {
        $students = Student::getAllByListIdentifier($_REQUEST['students']);
        $studentIds = array_map(function($s){
            return $s->ID;
        }, $students);
    
        $studentTaskConditions['StudentID'] = [
            'operator' => 'IN',
            'values' => $studentIds
        ];

        if (count($students) === 0) {
            Debug::dump(sprintf('No students found matching filter: %s', $_REQUEST['students']), false);
        }
    } catch (\RangeException $e) {
        Debug::dump($e->getMessage(), false);
    }

}

$minDate = !empty($_REQUEST['minDate']) ? $_REQUEST['minDate'] : null;
$maxDate = !empty($_REQUEST['maxDate']) ? $_REQUEST['maxDate'] : null;

if ($minDate && $maxDate) {
    $studentTaskConditions['ExpirationDate'] = [
        'operator' => 'BETWEEN',
        'min' => $minDate,
        'max' => $maxDate
    ];
    $taskConditions['ExpirationDate'] = [
        'operator' => 'BETWEEN',
        'min' => $minDate,
        'max' => $maxDate
    ];
} else {
    $studentTaskConditions['ExpirationDate'] = [
        'operator' => '<',
        'value' => date('Y-m-d 00:00:00')
    ];
    $taskConditions['ExpirationDate'] = [
        'operator' => '<',
        'value' => date('Y-m-d 00:00:00')
    ];
}

$expirationConditionsMapped = StudentTask::mapConditions([
    'ExpirationDate' => $studentTaskConditions['ExpirationDate']
]);

$expiredTasks = StudentTask::getAllByQuery(
    'SELECT %2$s.* FROM `%1$s` %2$s '.
    '  JOIN `%3$s` %4$s ON `%2$s`.TaskID = %4$s.ID '.
    ' WHERE `%2$s`.StudentID IN (%5$s) '.
    '   AND ( '.
    '       `%2$s`.%6$s '.
    '   OR
            %4$s.%6$s '.
    '   )',
    [
        StudentTask::$tableName,
        StudentTask::getTableAlias(),

        Task::$tableName,
        Task::getTableAlias(),

        !empty($students) ? join(', ', $studentIds) : 0,

        $expirationConditionsMapped['ExpirationDate']
    ]
);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $expiredStudentTaskIds = [];
    foreach ($expiredTasks as $expiredTask) {
        $expiredStudentTaskIds[] = $expiredTask->ID;
        if ($expiredTask->DemonstrationID === null) {
            $expiredTask->Demonstration = $expiredTask->getOrCreateDemonstration();
            $expiredTask->Demonstration->CreatorID = $expiredTask->CreatorID;
            $expiredTask->save(true);
        }
    }

    if (count($expiredStudentTaskIds)) {
        $insertStatement =
            'INSERT INTO `%1$s` '.
            '(`CreatorID`, `Class`, `DemonstrationID`, `SkillID`, `TargetLevel`, `DemonstratedLevel`) ';
    
        // insert 'Missing' ratings for unrated skills associated with expired tasks
        $query =
            'SELECT * FROM ('.
                '('.
                    'SELECT '.
                        '%4$s.CreatorID, '.
                        '"%2$s" AS Class, '.
                        '%4$s.DemonstrationID, '.
                        '%6$s.SkillID, '.
                        '%10$s.Level, '.
                        '0 AS DemonstratedLevel '.
    
                        // uncomment these lines for debugging
                        // ',%4$s.ID AS StudentTaskID '. // debug
                        // ',%4$s.TaskID AS TaskID '. // debug
                        // ',%4$s.StudentID AS StudentID '. // debug
    
                    'FROM `%3$s` %4$s '.
    
                    'JOIN %15$s `%16$s` '.
                    '  ON %16$s.ID = %4$s.TaskID '.
    
                    'JOIN ( '.
                        'SELECT %6$s.SkillID, %6$s.TaskID '.
                            'FROM `%5$s` %6$s '.
                    ') as %6$s '.
                        'ON %6$s.TaskID = %4$s.TaskID '.
                    'JOIN ( '.
                            'SELECT %8$s.ID, %8$s.CompetencyID '.
                                'FROM `%7$s` %8$s '.
                        ') as %8$s '.
                        'ON %8$s.ID = %6$s.SkillID '.
                    'JOIN ( '.
                            'SELECT MAX(%10$s.Level) as Level, %10$s.CompetencyID, %10$s.StudentID '.
                                'FROM `%9$s` %10$s '.
                            'GROUP BY StudentID, CompetencyID '.
                        ') as %10$s '.
                        'ON  %10$s.CompetencyID = %8$s.CompetencyID '.
    
                    'WHERE '.
                    '%4$s.ID IN (%14$s) '.
                    // 'AND %15$s '.
                    'AND %10$s.StudentID = %4$s.StudentID '.
                    'AND %6$s.SkillID NOT IN ( '.
                            'SELECT %11$s.SkillID '.
                                'FROM `%1$s` %11$s '.
                                'WHERE %11$s.DemonstrationID = %4$s.DemonstrationID '.
                    ')'.
                ')'.
            ' UNION '.
                '('.
                    'SELECT '.
                        '%4$s.CreatorID, '.
                        '"%2$s" AS Class, '.
                        '%4$s.DemonstrationID, '.
                        '%13$s.SkillID, '.
                        '%10$s.Level, '.
                        '0 AS DemonstratedLevel '.
    
                        // uncomment these lines for debugging
                        // ',%4$s.ID AS StudentTaskID '. // debug
                        // ',%4$s.TaskID AS TaskID '. // debug
                        // ',%4$s.StudentID AS StudentID '. // debug
    
                    'FROM `%3$s` %4$s '.
    
                    'JOIN %15$s `%16$s` '.
                    '  ON %16$s.ID = %4$s.TaskID '.
    
                    'JOIN ( '.
                        'SELECT %13$s.SkillID, %13$s.StudentTaskID '.
                            'FROM `%12$s` %13$s '.
                    ') as %13$s '.
                        'ON %13$s.StudentTaskID = %4$s.ID '.
                    'JOIN ( '.
                            'SELECT %8$s.ID, %8$s.CompetencyID '.
                                'FROM `%7$s` %8$s '.
                        ') as %8$s '.
                        'ON %8$s.ID = %13$s.SkillID '.
                    'JOIN ( '.
                            'SELECT MAX(%10$s.Level) as Level, %10$s.CompetencyID, %10$s.StudentID '.
                                'FROM `%9$s` %10$s '.
                            'GROUP BY StudentID, CompetencyID '.
                        ') as %10$s '.
                        'ON  %10$s.CompetencyID = %8$s.CompetencyID '.
    
                    'WHERE '.
                    '%4$s.ID IN (%14$s) '.
                    // 'AND %15$s '.
                    'AND %10$s.StudentID = %4$s.StudentID '.
                    'AND %13$s.SkillID NOT IN ( '.
                            'SELECT %11$s.SkillID '.
                                'FROM `%1$s` %11$s '.
                                'WHERE %11$s.DemonstrationID = %4$s.DemonstrationID '.
                    ')'.
                ')'.
            ") missingSkills";
    
        $params = [
            DemonstrationSkill::$tableName, // 1
            DB::escape(DemonstrationSkill::class), // 2
    
            StudentTask::$tableName, // 3
            StudentTask::getTableAlias(), // 4
    
            TaskSkill::$tableName, // 5
            TaskSkill::getTableAlias(), // 6
    
            Skill::$tableName, // 7
            Skill::getTableAlias(), // 8
    
            StudentCompetency::$tableName, // 9
            StudentCompetency::getTableAlias(), // 10
    
            DemonstrationSkill::getTableAlias(), // 11
    
            StudentTaskSkill::$tableName, // 12
            StudentTaskSkill::getTableAlias(), // 13
    
            join(', ', $expiredStudentTaskIds), // 14
    
            Task::$tableName, // 15
            Task::getTableAlias() // 16
        ];
    
        if (!empty($_REQUEST['debug'])) {
            $missingSkills = DB::allRecords($query, $params);
            Debug::dump([$query, $params, vsprintf($query, $params)], false, 'query/params');
            Debug::dump($missingSkills, true, 'missing skills');
        }
    
        DB::nonQuery($insertStatement.$query, $params);
        Debug::dump(DB::affectedRows(), false, 'created');
    }

}


$studentsValue = empty($_REQUEST['students']) ? 'all' : $_REQUEST['students'];
$minDateValue = empty($_REQUEST['minDate']) ? Term::getCurrent()->getMaster()->StartDate : $_REQUEST['minDate'];
$maxDateValue = empty($_REQUEST['maxDate']) ? date('Y-m-d') : $_REQUEST['maxDate'];

?>

<html>
    <body>
        <h1>Backfill Missing Ratings</h1>

        <form method="post">
            <label>
                Students:
                <input type="text" name="students" value="<?=$studentsValue?>"/>
            </label>
            <label>
                Min Date
                <input type="date" name="minDate" value="<?=$minDateValue?>"/>
            </label>
            <label>
                Max Date
                <input type="date" name="maxDate" value="<?=$maxDateValue?>"/>
            </label>
            <button>Filter</button>
        </form>
    </body>

</html>
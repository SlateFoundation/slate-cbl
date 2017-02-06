<?php

namespace Slate\CBL\Tasks;

use Slate\CBL\Competency;
use Slate\CBL\Skill;
use Slate\CBL\Demonstrations\DemonstrationSkill;

class TeacherDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];
    
    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Staff');

        switch ($action = static::shiftPath()) {
            case '':
            case false:
                return static::handleDashboardRequest();
            
            case 'skill-completions':
                return static::handleSkillCompletionsRequest();
            case 'confirm-promotion':
                return static::handlePromotionConfirmationRequest();
            default:
                return static::throwNotFoundError();
        }
    }
    
    public static function handleDashboardRequest()
    {
        return Sencha_RequestHandler::respond('app/SlateTasksTeacher/ext', [
            'App' => Sencha_App::getByName('SlateDemonstrationsTeacher'),
            'mode' => 'production',
            'ContentArea' => $ContentArea,
            'students' => $students
        ]);
    }
    
    public static function handleSkillCompletionsRequest()
    {
        if (!$studentTaskId = $_REQUEST['studentTaskId']) {
            return static::throwInvalidRequestError('studentTaskId must be supplied.');
        } else if (!$StudentTask = StudentTask::getByID($studentTaskId)) {
            return static::throwNotFoundError('Student task was not found.');
        }
        
        $completions = [];
        $indexedDemonstrationSkills = [];
        
        $demonstrationSkills = $StudentTask->Demonstration ? $StudentTask->Demonstration->Skills : [];
        foreach ($demonstrationSkills as $DemonstrationSkill) {
            $indexedDemonstrationSkills[$DemonstrationSkill->SkillID] = $DemonstrationSkill;
        }
        
        foreach ($StudentTask->AllSkills as $Skill) {
            $completions[] = array_merge(
                $Skill->getDetails(['Competency']),
                [
                    'StudentID' => $StudentTask->StudentID,
                    'currentLevel' => array_key_exists($Skill->ID, $indexedDemonstrationSkills) ? $indexedDemonstrationSkills[$Skill->ID]->TargetLevel : $Skill->Competency->getCurrentLevelForStudent($StudentTask->Student)
                ]
            );
        }

        return static::respond('studenttask-ratings', [
            'skills' => $completions
        ]);
    }
    
    public static function handlePromotionConfirmationRequest()
    {
        $_REQUEST = \JSON::getRequestData();

        if (!$studentTaskId = $_REQUEST['studentTaskId']) {
            return static::throwInvalidRequestError('studentTaskId must be supplied.');
        } else if (!$StudentTask = StudentTask::getByID($studentTaskId)) {
            return static::throwNotFoundError('Student task was not found.');
        }
        
        if (empty($_REQUEST['Skills'])) {
            return static::throwInvalidRequestError('Skills must be provided.');
        }
        
        $groupedSkills = [];
        $competenciesToPromote = [];
        
        foreach ($_REQUEST['Skills'] as $demoSkill) {
            // group by competency first
            $demoSkill['Skill'] = $Skill = Skill::getByID($demoSkill['SkillID']);
            if (!isset($groupedSkills[$demoSkill['SkillID']])) {
                $groupedSkills[$Skill->CompetencyID] = [];
            }

            $groupedSkills[$Skill->CompetencyID][] = $demoSkill;
        }

        foreach ($groupedSkills as $compId => &$skills) {
            if (!$Competency = Competency::getByID($compId)) {
                continue;
            }
            
            $competencyCompletion = $Competency->getCompletionForStudent($StudentTask->Student);
            $currentLevel = $Competency->getCurrentLevelForStudent($StudentTask->Student);
            $demonstrationsRequired = $Competency->getTotalDemonstrationsRequired($currentLevel);

            if ($demonstrationsRequired - $competencyCompletion['demonstrationsComplete'] > count($skills)) { // not enough skill demonstrations logged for this competency
                unset($groupedSkills[$compId]);
                continue;
            }
            
            foreach ($skills as $index => $skill) {
                $skillCompletion = $skill['Skill']->getCompletionForStudent($StudentTask->Student);
                $demonstrationsRequired = $skillCompletion['demonstrationsRequired'];
                $phantom = isset($skill['ID']);
                
                if ($demonstrationsRequired - $skillCompletion['demonstrationsComplete'] > 1) { // not enough skill demonstrations logged
                    unset($groupedSkills[$compId]);
                    break;
                }
                
                if (!empty($skill['ID']) || $skill['DemonstrationID']) {
                    $DemonstrationSkill = $skill['ID'] ? DemonstrationSkill::getByID($skill['ID']) : DemonstrationSkill::getByWhere([
                        'TargetLevel' => $skill['TargetLevel'],
                        'DemonstrationID' => $skill['DemonstrationID'],
                        'SkillID' => $skill['SkillID']
                    ]);
                }
                
                $countedLogs = DemonstrationSkill::getAllByWhere([
                    'SkillID' => $skill['SkillID'],
                    'TargetLevel' => $currentLevel
                ], [
                    'limit' => $skillCompletion['demonstrationsLogged'],
                    'order' => [
                        'DemonstratedLevel' => 'DESC'    
                    ]
                ]);

                $countedLogsSum = 0;
                $totalLogs = 0;
                foreach ($countedLogs as $log) {
                    $totalLogs++;
                    if ($DemonstrationSkill && $log->ID == $DemonstrationSkill->ID) {
                        $countedLogsSum += intval($skill['DemonstratedLevel']);
                    } else {
                        $countedLogsSum += intval($log->DemonstratedLevel);
                    }
                }
                
                if (!$DemonstrationSkill)  {
                    $countedLogsSum += intval($skill['DemonstratedLevel']);
                    $totalLogs++;
                }

                $logAvg = $countedLogsSum / ($totalLogs);
                if ($logAvg < $currentLevel + $Competency->getMinimumAverageOffset()) { // avg not high enough
                    unset($skills[$index]);
                    continue;
                }
            }
            
            if (empty($skills)) {
                unset($groupedSkills[$compId]);
            }
        }
        
        return static::respond('competency-promotions', [
            'data' => Competency::getAllByWhere([
                'ID' => [
                    'values' => array_keys($groupedSkills),
                    'operator' => 'IN'
                ]    
            ])
        ]);
    }
}
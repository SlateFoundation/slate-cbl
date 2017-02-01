<?php

namespace Slate\CBL\Tasks;

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
#            case 'completions':
#                return static::handleCompletionsRequest();
#            case 'demonstration-skills':
#                return static::handleDemonstrationSkillsRequest();
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
            $completions[] = array_merge($Skill->getDetails(['Competency']), [
                'StudentID' => $StudentTask->StudentID,
                'currentLevel' => array_key_exists($Skill->ID, $indexedDemonstrationSkills) ? $indexedDemonstrationSkills[$Skill->ID]->TargetLevel : $Skill->Competency->getCurrentLevelForStudent($StudentTask->Student)
            ]);
        }

#        foreach ($StudentTask->AllSkills as $Skill) {
#            if (!array_key_exists($Skill->Competency->Code, $groupedSkills)) {
#                $groupedSkills[$Skill->Competency->Code] = [
#                    'skills' => [],
#                    'Code' => $Skill->Competency->Code,
#                    'Descriptor' => $Skill->Competency->Descriptor,
#                    'CompetencyLevel' => $Skill->Competency->getCurrentLevelForStudent($StudentTask->Student)
#                ];
#            }
#            
#            $skillData = $Skill->getDetails([]);
#            $skillData['CompetencyLevel'] = !empty($demoSkillIds[$Skill->ID]) ? $demoSkillIds[$Skill->ID]->TargetLevel : $groupedSkills[$Skill->Competency->Code]['CompetencyLevel'];
#            
#            $groupedSkills[$Skill->Competency->Code]['skills'][] = $skillData;
#        }
        
        return static::respond('studenttask-ratings', [
            'skills' => $completions
        ]);
    }
}
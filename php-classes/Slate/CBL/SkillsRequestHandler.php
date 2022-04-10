<?php

namespace Slate\CBL;

class SkillsRequestHandler extends RecordsRequestHandler
{
    public static $recordClass = Skill::class;
    public static $browseOrder = false;
    public static $accountLevelBrowse = 'User';

    public static function __classLoaded()
    {
        $recordClass = static::$recordClass;
        static::$browseOrder = sprintf('LENGTH(%1$s.Code), %1$s.Code', $recordClass::getTableAlias());
    }

    protected static function buildBrowseConditions(array $conditions = [], array &$filterObjects = [])
    {
        $conditions = parent::buildBrowseConditions($conditions, $filterObjects);

        if ($Competency = static::getRequestedCompetency()) {
            $conditions['CompetencyID'] = $Competency->ID;
            $filterObjects['Competency'] = $Competency;
        } elseif ($competencies = static::getRequestedCompetencies()) {
            $conditions['CompetencyID'] = [
                'values' => array_map(function ($Competency) {
                    return $Competency->ID;
                }, $competencies)
            ];
        } elseif ($ContentArea = static::getRequestedContentArea()) {
            $conditions['CompetencyID'] = [ 'values' => $ContentArea->getActiveCompetencyIds() ];
            $filterObjects['ContentArea'] = $ContentArea;
        }

        return $conditions;
    }
}

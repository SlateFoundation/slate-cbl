<?php

Slate\UI\SectionProfile::$sources[] = function (Slate\Courses\Section $Section) {
    $links = [];

    if (!empty($GLOBALS['Session']) && ($Person = $GLOBALS['Session']->Person)) {
        $isParticipant = false;

        // use the ->Teachers and ->Students relationships that the section profile will too
        foreach ($Section->Teachers as $Teacher) {
            if ($Teacher->ID == $Person->ID) {
                $isParticipant = true;
                break;
            }
        }

        if (!$isParticipant) {
            foreach ($Section->Students as $Student) {
                if ($Student->ID == $Person->ID) {
                    $isParticipant = true;
                    break;
                }
            }
        }

        if ($GLOBALS['Session']->hasAccountLevel('Staff')) {
            $links['Teacher Tasks Dashboard'] =' /cbl/dashboards/tasks/teacher#' . $Section->Code . '/all';
        }

        if ($isParticipant) {
            $links['Student Tasks Dashboard'] = '/cbl/dashboards/tasks/student#me/' . $Section->Code;
        }
    }

    return [
        'Competency-Based Learning' => $links
    ];
};
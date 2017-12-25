<?php

namespace Slate\CBL;

use ActiveRecord, RecordsRequestHandler;
use Emergence\People\PeopleRequestHandler;


class StudentCompetenciesRequestHandler extends RecordsRequestHandler
{
    public static $recordClass = StudentCompetency::class;
    public static $accountLevelAPI = 'User';
    public static $accountLevelBrowse = 'User';
    public static $accountLevelRead = 'Staff';
    public static $accountLevelComment = 'Staff';
    public static $accountLevelWrite = 'Administrator';
    public static $browseLimitDefault = 100;
    public static $browseOrder = ['ID' => 'DESC'];


    public static function checkReadAccess(ActiveRecord $Record, $suppressLogin = false)
    {
        $User = $GLOBALS['Session']->Person;

        if (!$suppressLogin) {
            $GLOBALS['Session']->requireAuthentication();
        } elseif (!$User) {
            return false;
        }

        if ($User->hasAccountLevel(static::$accountLevelRead)) {
            return true;
        }

        return $Record->StudentID === $User->ID;
    }

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        $User = $GLOBALS['Session']->Person;

        if (!$User || !$User->hasAccountLevel('Staff')) {
            $conditions['StudentID'] = $User->ID;
        }

        // apply student filter
        if (!$User) {
            return static::throwUnauthorizedError('Login required');
        } elseif (!empty($_GET['student'])) {
            if (!$Student = PeopleRequestHandler::getRecordByHandle($_GET['student'])) {
                return static::throwNotFoundError('Student not found');
            }

            if (!$User || ($Student->ID != $User->ID && !$User->hasAccountLevel('Staff'))) {
                return static::throwUnauthorizedError('Only staff may browse others\' records');
            }

            $conditions['StudentID'] = $Student->ID;
            $responseData['Student'] = $Student;
        } elseif (!$User->hasAccountLevel('Staff')) {
            $conditions['StudentID'] = $User->ID;
            $responseData['Student'] = $User;
        }


        // apply competency filter
        if (!empty($_GET['competency'])) {
            if (!$Competency = CompetenciesRequestHandler::getRecordByHandle($_GET['competency'])) {
                return static::throwNotFoundError('Competency not found');
            }

            $conditions['CompetencyID'] = $Competency->ID;
            $responseData['Competency'] = $Competency;
        } elseif (!empty($_GET['content_area'])) {
            if (!$ContentArea = ContentAreasRequestHandler::getRecordByHandle($_GET['content_area'])) {
                return static::throwNotFoundError('Content area not found');
            }

            $conditions['CompetencyID'] = [ 'values' => $ContentArea->getCompetencyIds() ];
            $responseData['ContentArea'] = $ContentArea;
        }


        // apply level filter
        if (!empty($_GET['level'])) {
            if (!ctype_digit($_GET['level'])) {
                return static::throwInvalidRequestError('Level must be numeric');
            }

            $conditions['Level'] = $_GET['level'];
        }


        // apply entered_via filter
        if (!empty($_GET['entered_via'])) {
            if (!in_array($_GET['entered_via'], StudentCompetency::getFieldOptions('EnteredVia', 'values'))) {
                return static::throwInvalidRequestError('Entered Via must be numeric');
            }

            $conditions['EnteredVia'] = $_GET['entered_via'];
        }

        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }  
}
<?php

namespace Slate\CBL;

use OutOfBoundsException;

use ActiveRecord;
use UserUnauthorizedException;

use Emergence\People\GuardianRelationship;

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


    public static function checkReadAccess(ActiveRecord $Record = null, $suppressLogin = false)
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

        return $Record && $Record->StudentID === $User->ID;
    }

    protected static function buildBrowseConditions(array $conditions = [], array &$filterObjects = [])
    {
        global $Session;

        $conditions = parent::buildBrowseConditions($conditions, $filterObjects);


        // apply student or students filter
        if (!$Session->Person) {
            throw new UserUnauthorizedException();
        } elseif ($Student = static::getRequestedStudent()) {
            $conditions['StudentID'] = $Student->ID;
            $filterObjects['Student'] = $Student;
        } elseif (is_array($students = static::getRequestedStudents())) {
            $conditions['StudentID'] = [
                'values' => array_map(function ($Student) {
                    return $Student->ID;
                }, $students)
            ];
        } elseif (!$Session->hasAccountLevel('Staff')) {
            $conditions['StudentID'] = [
                'values' => array_merge(
                    [$Session->PersonID],
                    GuardianRelationship::getWardIds($Session->Person)
                )
            ];
        }


        // apply competency filter
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
            $conditions['CompetencyID'] = [ 'values' => $ContentArea->getCompetencyIds() ];
            $filterObjects['ContentArea'] = $ContentArea;
        }


        // apply level filter
        if (!empty($_REQUEST['level'])) {
            if (!ctype_digit($_REQUEST['level'])) {
                throw new OutOfBoundsException('level must be numeric');
            }

            $conditions['Level'] = $_REQUEST['level'];
        }


        // apply entered_via filter
        if (!empty($_REQUEST['entered_via'])) {
            if (!in_array($_REQUEST['entered_via'], StudentCompetency::getFieldOptions('EnteredVia', 'values'))) {
                throw new OutOfBoundsException('entered_via invalid');
            }

            $conditions['EnteredVia'] = $_REQUEST['entered_via'];
        }


        return $conditions;
    }
}

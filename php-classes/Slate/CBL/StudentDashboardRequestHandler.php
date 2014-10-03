<?php

namespace Slate\CBL;

use Slate\People\Student;

class StudentDashboardRequestHandler extends \RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];

    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAccountLevel('Student');

        switch ($action = static::shiftPath()) {
            case '':
            case false:
                return static::handleDashboardRequest();
            default:
                return static::throwNotFoundError();
        }
    }

    public static function handleDashboardRequest()
    {
        if (!empty($_GET['content-area'])) {
            if (ctype_digit($_GET['content-area'])) {
                $ContentArea = ContentArea::getByID($_GET['content-area']);
            } else {
                $ContentArea = ContentArea::getByCode($_GET['content-area']);
            }
        }

        return static::respond('student-dashboard', [
            'Student' => static::_getRequestedStudent(),
            'ContentArea' => $ContentArea
        ]);
    }

    protected static function _getRequestedStudent()
    {
        if (
            !empty($_GET['student']) &&
            $GLOBALS['Session']->hasAccountLevel('Staff')
        ) {
            if (!$Student = Student::getByHandle($_GET['student'])) {
                return static::throwNotFoundError('Student not found');
            }
        } else {
            $Student = $GLOBALS['Session']->Person;
        }

        if (!$Student->isA(Student::class)) {
            return static::throwInvalidRequestError('Requested user is not a student');
        }

        return $Student;
    }
}
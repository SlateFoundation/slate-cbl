<?php

namespace Slate\CBL;

use Slate\People\Student;

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

        if (!empty($_GET['students'])) {
            try {
                $students = Student::getAllByListIdentifier($_GET['students']);
            } catch (\Exception $e) {
                return static::throwNotFoundError('Unable to load students list: ' . $e->getMessage());
            }
        }

        return static::respond('teacher-dashboard', [
            'ContentArea' => $ContentArea,
            'students' => $students
        ]);
    }
}
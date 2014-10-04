<?php

namespace Slate\CBL;

use Slate\People\Student;
use Slate\Courses\Section;
use Emergence\People\Groups\Group;

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
            if ($_GET['students'] == 'all') {
                $students = \Slate\People\Student::getAllByClass();
            } else {
                list ($groupType, $groupHandle) = explode(' ', $_GET['students'], 2);
                switch ($groupType) {
                    case 'group':
                        if (!$Group = Group::getByHandle($groupHandle)) {
                            return static::throwNotFoundError('Group not found');
                        }

                        $students = array_filter($Group->getAllPeople(), function($Person) {
                            return $Person->isA(Student::class);
                        });
                        break;
                    case 'section':
                        if (!$Section = Section::getByHandle($groupHandle)) {
                            return static::throwNotFoundError('Section not found');
                        }

                        $students = array_values(array_filter($Section->Students, function($Person) {
                            return $Person->isA(Student::class);
                        }));
                        break;
                    default:
                        return static::throwNotFoundError('Group type not recognized');
                }
            }
        }

        return static::respond('teacher-dashboard', [
            'ContentArea' => $ContentArea,
            'students' => $students
        ]);
    }
}
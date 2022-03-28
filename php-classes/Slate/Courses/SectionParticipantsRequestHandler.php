<?php

namespace Slate\Courses;


class SectionParticipantsRequestHandler extends \Slate\RecordsRequestHandler
{
    public static $recordClass = SectionParticipant::class;

    public static $accountLevelBrowse = 'Staff';
    public static $accountLevelWrite = 'Staff';
    public static $accountLevelRead = 'Staff';
    public static $accountLevelAPI = 'Staff';


    protected static function buildBrowseConditions(array $conditions = [], array &$filterObjects = [])
    {
        $conditions = parent::buildBrowseConditions($conditions, $filterObjects);

        if ($Section = static::getRequestedSection()) {
            $conditions['CourseSectionID'] = $Section->ID;
            $filterObjects['Section'] = $Section;
        } elseif ($Term = static::getRequestedTerm()) {
            $courseSectionIds = array_map(function($section) {
                return $section->ID;
            }, Section::getAllByWhere([
                'TermID' => [
                    'operator' => 'IN',
                    'values' => $Term->getContainedTermIDs()
                ]
            ]));

            $conditions['CourseSectionID'] = [
                'operator' => 'IN',
                'values' => $courseSectionIds
            ];
        }

        if ($Student = static::getRequestedStudent()) {
            $conditions['PersonID'] = $Student->ID;
            $filterObjects['Student'] = $Student;
        }

        if (!empty($_REQUEST['cohort'])) {
            $conditions['Cohort'] = $_REQUEST['cohort'];
        }

        if (!empty($_REQUEST['role'])) {
            $conditions['Role'] = [
                'values' => is_string($_REQUEST['role']) ? explode(',', $_REQUEST['role']) : $_REQUEST['role']
            ];
        }

        // apply disabled students filter
        if (!static::getRequestedIncludeDeactivated()) {
          $disabledStudentIds = \DB::allValues(
              'ID',
              '
                  SELECT ID
                    FROM `%s`
                  WHERE AccountLevel = "Disabled"
              ',
              [ \Emergence\People\Person::$tableName ]
          );

          if (!empty($disabledStudentIds)) {
                $conditions[] = 'PersonID NOT IN ('.implode(",",$disabledStudentIds).')';

          }
      }

        return $conditions;
    }

}
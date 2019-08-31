<?php

/*
* TODO:
* 1. Log any exceptions/errors while syncing user permissions
*/

namespace Slate\CBL\Tasks\Attachments;

use Google\DriveFile;
use Google\API as GoogleAPI;
use Google\RequestBuilder;
use Google\ResponseProcessor;

use Slate\CBL\Tasks\Task;
use Slate\CBL\Tasks\StudentTask;
use Slate\People\Student;

use Emergence\People\IPerson;
use Emergence\People\Person;
use Emergence\People\User;
use Emergence\Logger;

use DB;
use Exception;
use RecordValidationException;
use Validators;

class GoogleDriveFile extends AbstractTaskAttachment
{
    public $syncedPermissions = [];
    public static $defaultPermissions = [];

    public static $fields = [
        'FileID' => 'uint',
        'FileRevisionID' => [
            'default' => null
        ],
        'ShareMethod' => [
            'type' => 'enum',
            'values' => ['duplicate', 'view-only', 'collaborate'],
            'default' => 'view-only'
        ],
        'ParentAttachmentID' => [
            'type' => 'uint',
            'default' => null
        ]
    ];

    public static $validators = [
        'File' => [
            'validator' => 'require-relationship',
            'required' => true
        ],
        'FileRevisionID' => [
            'validator' => 'string',
            'required' => false
        ]
    ];

    public static $relationships = [
        'File' => [
            'type' => 'one-one',
            'class' => DriveFile::class
        ],
        'ParentAttachment' => [
            'type' => 'one-one',
            'class' => __CLASS__
        ]
    ];

    public static $dynamicFields = [
        'File',
        'ParentAttachment'
    ];

    public function getValue($name)
    {
        switch ($name) {
            case 'Task':
                if ($this->ContextClass == Task::getStaticRootClass()) {
                    return $this->Context;
                } elseif ($this->ContextClass == StudentTask::getStaticRootClass()) {
                    return $this->Context->Task;
                }

            default:
                return parent::getValue($name);
        }
    }

    public function cloneAttachment(StudentTask $StudentTask)
    {
        $validEmail = static::getValidEmailAddress($StudentTask->Student);

        if (!$validEmail) {
            Logger::general_alert('Unable to clone google drive attachment for {personFullName} on {googleDriveAttachment}. Could not find a valid email address', [
                'person' => $StudentTask->Student,
                'personFullName' => $StudentTask->Student->getFullName(),
                'googleDriveAttachment' => $this
            ]);
            return false;
        }

        try {
            $DuplicateDriveFile = $this->File->cloneFile();
            $DuplicateDriveFile->transferOwnership($validEmail);
            $DuplicateDriveFile->updateFileDetails();

            $GoogleDriveAttachment = static::create([
                'File' => $DuplicateDriveFile,
                'Context' => $StudentTask,
                'ParentAttachment' => $this,
                'FileRevisionID' => "1"
            ]);

            if (!$GoogleDriveAttachment->validate()) {
                throw new RecordValidationException($GoogleDriveAttachment, 'Cannot save invalid attachment record');
            }

            $GoogleDriveAttachment->save();

            return $GoogleDriveAttachment;
        } catch (Exception $e) {
            Logger::general_alert('Unable to clone google drive attachment for {personFullName} on {googleDriveAttachment}. {exceptionMessage}', [
                'person' => $StudentTask->Student,
                'personFullName' => $StudentTask->Student->getFullName(),
                'googleDriveAttachment' => $this,
                'exceptionMessage' => $e->getMessage()
            ]);
            return false;
        }
    }

    /*
    * Sync default permissions for attachment. Configured via static `$defaultPermissions` email keyed array, containing `role' & 'type' settings.
    * i.e.
    * [
    *     'group-email@domain.com' => [
    *         'role' => 'reader',
    *         'type' => 'group'
    *     ]
    * ]
    */
    public function syncDefaultPermissions()
    {
        foreach (static::$defaultPermissions as $email => $permission) {
            if (static::isEmailValid($email)) {
                if (empty($syncedPermissions = $this->syncedPermissions[$email])) {
                    try {
                        $this->File->createPermission($email, $permission['role'], $permission['type']);
                        $this->syncedPermissions[$email] = $permission['type'];
                    } catch (Exception $e) {
                        Logger::general_alert('Unable to create {permissionRole} permissions for {permissionType}: {userEmail} on {googleFileRecord}', [
                            'permissionRole' => $permission['role'],
                            'permissionType' => $permission['type'],
                            'userEmail' => $email,
                            'googleFileRecord' => $this
                        ]);
                    }
                }
            }
        }
    }

    /*
    * Sync Google Drive Permissions for a given Person
    */
    public function syncUserPermissions(IPerson $Person)
    {
        if (
            $this->ShareMethod == 'duplicate' &&
            $Person->isA(Student::class) &&
            $StudentTask = StudentTask::getByWhere(['TaskID' => $this->Task->ID, 'StudentID' => $Person->ID])
        ) {
            // file has been duplicated already
            if (static::getByWhere(['ParentAttachmentID' => $this->ID, 'ContextID' => $StudentTask->ID, 'ContextClass' => $StudentTask->getRootClass()])) {
                return false;
            }

            if (!$clonedAttachment = $this->cloneAttachment($StudentTask)) {
                return false;
            }

            foreach (static::getRequiredTeachers($this) as $Teacher) {
                $clonedAttachment->syncUserPermissions($Teacher);
                $clonedAttachment->syncDefaultPermissions();
            }

            return true;
        } else {
            if ($Person->isA(Student::class)) {
                $type = $this->getStudentPermissionRole();
            } else {
                $type = $this->getTeacherPermissionRole();
            }

            return $this->permit($Person, $type);
        }
    }

    /*
    * Sync Google Drive File Permissions for all required students/teachers
    */
    private $_syncComplete = false;
    protected static $maxPhase = 3;

    public static function syncUsersPermissions(array $attachments = [], $students = [], $teachers = [], $syncDefault = true)
    {
        $phase = 0;

        $Logger = new \Emergence\Logger();
        $Logger->notice('Syncing permissions for {totalStudents} to {totalAttachments} files', [
            'totalAttachments' => count($attachments),
            'totalStudents' => count($students),
            'syncDefault' => $syncDefault
        ]);

        while ($phase <= static::$maxPhase) {
            $requests = [];

            foreach ($attachments as $Attachment) {
                if (!$Attachment->isA(__CLASS__)) {
                    $Logger->error(
                        'Attachment is not a GoogleDriveFile, skipping.',
                        ['attachment' => $Attachment]
                    );
                    continue;
                }

                if ($Attachment->isPhantom) {
                    $Logger->error(
                        'Attachment is phantom, skipping.',
                        ['attachment' => $Attachment]
                    );
                    continue;
                }

                if ($Attachment->_syncComplete === true) {
                    $Logger->error(
                        'Attachment is has been synced already, skipping.',
                        ['attachment' => $Attachment]
                    );
                    continue;
                }

                $attachmentRequests = $Attachment->_getBatchRequestsByPhase($phase, $students, $teachers, $syncDefault);


                if (!empty($attachmentRequests) && is_array($attachmentRequests)) {
                    $requests = array_merge($requests, $attachmentRequests);
                }
            }


            $Logger->notice('{totalRequests} Attachment Requests pending', [
                'totalRequests' => count($requests),
                'request keys' => array_keys($requests)
            ]);
            $responses = GoogleAPI::executeBatchRequest(array_filter($requests), 1, $Logger);

            switch ($phase) {
                case 0:
                    ResponseProcessor::processBatchAccessTokenResponse($responses);
                    break;

                case 1:
                    $cloneResponses = [];
                    $permissionResponses = [];
                    foreach ($responses as $key => $response) {
                        if ($response['kind'] == 'drive#permission') {
                            $permissionResponses[$key] = $response;
                        } elseif ($response['kind'] == 'drive#file'){
                            $cloneResponses[$key] = $response;
                        }
                    }

                    if (!empty($cloneResponses)) {
                        ResponseProcessor::processBatchCloneResponse($cloneResponses);
                    }

                    if (!empty($permissionResponses)) {
                        ResponseProcessor::processBatchPermissionResponse($permissionResponses);
                    }

                    break;

                case 2:
                    ResponseProcessor::processBatchTransferOwnershipPermissionResponse($responses);
                    break;

                case 3:
                    ResponseProcessor::processBatchFileDetailsResponse($responses);
                    break;
            }

            $phase++;
        }
    }

    private function _getBatchRequestsByPhase($phase, $students, $teachers, $syncDefault)
    {
        $requests = [];
        $scope = DriveFile::$apiScope;


        switch ($phase) {
            case null:
            case 0:
                return $this->buildAccessTokenRequests($students, $teachers, $syncDefault);

            case 1:
                if ($this->ShareMethod == 'duplicate') {
                    return $this->buildCloneRequests($students);
                }

                return $this->buildPermissionRequests($students, $teachers, $syncDefault);

            case 2:
                if ($this->ShareMethod == 'duplicate') {
                    return $this->buildTransferOwnershipPermissionRequests($students, $teachers, $syncDefault);
                }

                return $this->_syncComplete = true;

            case 3:
                return $this->buildFileDetailsRequest();

            default:
                $this->_syncComplete = true;
                return $this->_syncComplete;
        }

    }

    private function buildAccessTokenRequests($students, $teachers, $syncDefault)
    {
        $requests = [];
        $scope = DriveFile::$apiScope;

        $requiredStudents = $students === null ? [] : count($students) ? $students : static::getRequiredStudents($this);
        $requiredTeachers = $teachers === null ? [] : count($teachers) ? $teachers : static::getRequiredTeachers($this);

        foreach (array_merge($requiredStudents, $requiredTeachers) as $requiredUser) {
            if ($emailAddress = static::getValidEmailAddress($requiredUser)) {
                $requests[$emailAddress . '|' . $scope] = RequestBuilder::getAccessToken($scope, $emailAddress);
            }
        }

        if ($syncDefault) {
            foreach (static::$defaultPermissions as $email => $config) {
                $requests[$email . '|' . $scope] = RequestBuilder::getAccessToken($scope, $email);
            }
        }

        return $requests;
    }

    private function buildPermissionRequests($students, $teachers, $syncDefault)
    {
        $requests = [];
        $studentPermissionRole = $this->getStudentPermissionRole();
        $teacherPermissionRole = $this->getTeacherPermissionRole();

        // sync student permissions
        if ($studentPermissionRole) {
            $requiredStudents = $students === null ? [] : count($students) ? $students : static::getRequiredStudents($this);
            foreach ($requiredStudents as $Student) {
                if (!$Student->isA(Student::class)) {
                    // log error ?
                    continue;
                }

                if (!$validEmail = static::getValidEmailAddress($Student)) {
                    // log error
                    continue;
                }

                $requestKey = sprintf('%u|%s|%s|%s', $this->ID, $validEmail, $studentPermissionRole, 'user');
                $requests[$requestKey] = RequestBuilder::createPermission($this->File, $validEmail, $studentPermissionRole, 'user');
            }
        }

        // sync teacher permissions
        if ($teacherPermissionRole) {
            $requiredTeachers = $teachers === null ? [] : count($teachers) ? $teachers : static::getRequiredTeachers($this);
            foreach ($requiredTeachers as $Teacher) {
                if (!$validEmail = static::getValidEmailAddress($Teacher)) {
                    // log error
                    continue;
                }

                $requestKey = sprintf('%u|%s|%s|%s', $this->ID, $validEmail, $teacherPermissionRole, 'user');
                $requests[$requestKey] = RequestBuilder::createPermission($this->File, $validEmail, $teacherPermissionRole, 'user');
            }
        }

        // sync default permissions
        if ($syncDefault) {
            foreach (static::$defaultPermissions as $email => $settings) {
                $requestKey = sprintf('%u|%s|%s|%s', $this->ID, $email, $settings['role'], $settings['type']);
                $requests[$requestKey] = RequestBuilder::createPermission($this->File, $email, $settings['role'], $settings['type']);
            }
        }

        return $requests;
    }

    private function buildCloneRequests($students)
    {
        $requests = [];
        $requiredStudents = $students === null ? [] : count($students) ? $students : static::getRequiredStudents($this);

        foreach ($requiredStudents as $Student) {
            if (!$Student->isA(Student::class)) {
                // log error ?
                continue;
            }

            if (!$StudentTask = StudentTask::getByWhere(['StudentID' => $Student->ID, 'TaskID' => $this->Task->ID])) {
                // log error
                continue;
            }

            if (!$validEmail = static::getValidEmailAddress($Student)) {
                // log error
                continue;
            }

             // file has been duplicated already
            if (static::getByWhere(['ParentAttachmentID' => $this->ID, 'ContextID' => $StudentTask->ID, 'ContextClass' => $StudentTask->getRootClass()])) {
                // log notice
                continue;
            }

            $requestKey = sprintf('%u|%s|%s|owner', $this->ID, $validEmail, $Student->Username);
            $requests[$requestKey] = RequestBuilder::cloneFile($this->File);
        }

        return $requests;
    }

    private function buildTransferOwnershipPermissionRequests($students, $teachers, $syncDefault)
    {
        $requests = [];
        $requiredStudents = $students === null ? [] : count($students) ? $students : static::getRequiredStudents($this);
        $requiredTeachers = $teachers === null ? [] : count($teachers) ? $teachers : static::getRequiredTeachers($this);

        foreach ($requiredStudents as $Student) {
            if (!$StudentTask = StudentTask::getByWhere(['StudentID' => $Student->ID, 'TaskID' => $this->Task->ID])) {
                \Emergence\Logger::general_warning(
                    'Unable to build permission request: Task #{taskId}: {taskName} not assigned to {slateUsername} was not found, skipping.',
                    ['taskId' => $this->Task->ID, 'taskName' => $this->Task->Title, 'slateUsername' => $Student->Username]
                );
                continue;
            }

            if (!$ClonedAttachment = static::getByWhere(['ParentAttachmentID' => $this->ID, 'ContextID' => $StudentTask->ID, 'ContextClass' => $StudentTask->getRootClass()])) {
                \Emergence\Logger::general_warning(
                    'Unable to build permission request: Cloned Attachment belonging to {slateUsername} not found, skipping.',
                    ['StudentTask' => $StudentTask, 'slateUsername' => $Student->Username]
                );
                continue;
            }

            if (!$validEmail = static::getValidEmailAddress($Student)) {
                \Emergence\Logger::general_warning(
                    'Unable to build permission request: User {slateUsername} email ({email}) is invaild, skipping.',
                    ['email' => $validEmail, 'slateUsername' => $Student->Username]
                );
                continue;
            }

            $requestKey = sprintf('%u|%s|%s|%s', $ClonedAttachment->ID, $validEmail, $Student->Username, 'owner');
            $requests[$requestKey] = RequestBuilder::transferOwnership($ClonedAttachment->File, $validEmail, 'user');

            foreach ($requiredTeachers as $Teacher) {

                if (!$validEmail = static::getValidEmailAddress($Teacher)) {
                    // log notice
                    continue;
                }

                $requestKey = sprintf('%u|%s|%s|%s', $ClonedAttachment->ID, $validEmail, $Teacher->Username, $ClonedAttachment->getTeacherPermissionRole());
                $requests[$requestKey] = RequestBuilder::createPermission($ClonedAttachment->File, $validEmail, $ClonedAttachment->getTeacherPermissionRole(), 'user');
            }

            if ($syncDefault) {
                foreach (static::$defaultPermissions as $validEmail => $settings) {
                    if (!static::isEmailValid($validEmail)) {
                        // log error
                        continue;
                    }

                    $requestKey = sprintf('%u|%s|default|%s', $ClonedAttachment->ID, $validEmail, $settings['role']);
                    $requests[$requestKey] = RequestBuilder::createPermission($ClonedAttachment->File, $validEmail, $settings['role'], $settings['type']);
                }
            }
        }

        return $requests;
    }

    private function buildFileDetailsRequest()
    {
        return [
            $this->File->DriveID => RequestBuilder::getFileDetails($this->File)
        ];
    }

    /*
    * Get student permission role for drive file
    */
    public function getStudentPermissionRole()
    {
        if ($this->Context->isA(Task::class)) {
            if ($this->ShareMethod == 'view-only') {
                return 'reader';
            } elseif ($this->ShareMethod == 'collaborate') {
                return 'writer';
            }
        }

        return null;
    }
    /*
    * Get teacher permission role for drive file
    */
    public function getTeacherPermissionRole()
    {
        if ($this->Context->isA(Task::class)) {
            if ($this->ShareMethod == 'duplicate') {
                return null;
            }

            return 'reader';
        } elseif ($this->Context->isA(StudentTask::class)) {
            return 'writer';
        }
    }

    /*
    * Get all users needing permission
    */
    public function getRequiredPermissions()
    {
        $permissions = array_merge(static::getRequiredStudents($this), static::getRequiredTeachers($this));

        return $permissions;
    }

    /*
    * Permit user access to google drive file
    */
    public function permit(IPerson $Person, $type)
    {
        $validEmail = static::getValidEmailAddress($Person);

        if (!$validEmail) {
            Logger::general_alert('Unable to create {permissionRole} permissions for person {personFullName} on {googleDriveAttachment}. Could not find a valid email address', [
                'permissionRole' => $type,
                'person' => $Person,
                'personFullName' => $Person->getFullName(),
                'attachment' => $this
            ]);
            return false;
        }

        if ($this->File->OwnerEmail == $validEmail) {
            return true;
        } elseif (!empty($syncedPermissions = $this->syncedPermissions[$validEmail])) {
            if ($syncedPermissions == 'writer' || $type == $syncedPermissions) { // user has been granted the highest permissions already
                return true;
            }
        }

        try {
            $this->File->createPermission($validEmail, $type, 'user');
            $this->syncedPermissions[$validEmail] = $type;
            return true;
        } catch (Exception $e) {
            Logger::general_alert('Unable to create {permissionRole} permissions for user: {userEmail} on {googleFileRecord}', [
                'permissionRole' => $type,
                'userEmail' => $userEmail->toString(),
                'googleFileRecord' => $this
            ]);
            throw $e;
        }
    }

    protected static function getValidEmailAddress(IPerson $Person)
    {
        $validEmail = false;

        if ($Person->PrimaryEmail && static::isEmailValid($Person->PrimaryEmail->toString())) {
            $validEmail = $Person->PrimaryEmail->toString();
        } else if (!empty($Person->ContactPoints)) {
            foreach ($Person->ContactPoints as $ContactPoint) {
                if ($ContactPoint->isA(\Emergence\People\ContactPoint\Email::class) && static::isEmailValid($ContactPoint->toString())) {
                    $validEmail = $ContactPoint->toString();
                    break;
                }
            }
        }

        return $validEmail;
    }

    protected static function isEmailValid($emailAddress)
    {
        return Validators::email($emailAddress, [
            'domain' => GoogleAPI::$domain
        ]);
    }

    protected static function getRequiredStudents(GoogleDriveFile $Attachment)
    {
        $users = [];

        if ($Attachment->ContextClass == Task::getStaticRootClass()) {
            $users = Person::getAllByQuery(
                'SELECT %4$s.* FROM `%1$s` %2$s '.
                '  JOIN `%3$s` %4$s '.
                '    ON %4$s.ID = %2$s.StudentID'.
                ' WHERE TaskID = %5$u ',
                [
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),
                    Person::$tableName,
                    Person::getTableAlias(),
                    $Attachment->ContextID
                ]
            );
        }

        return $users;
    }

    protected static function getRequiredTeachers(GoogleDriveFile $Attachment)
    {
        $users = [];

        if ($Attachment->ContextClass == Task::getStaticRootClass()) {
            $Task = $Attachment->Context;
        } else if ($Attachment->ContextClass == StudentTask::getStaticRootClass()) {
            $Task = $Attachment->Context->Task;
        }

        if ($Task) {
            $users = Person::getAllByQuery(
                'SELECT %8$s.* '.
                '  FROM `%1$s` %2$s '.
                '  JOIN `%3$s` %4$s '.
                '    ON %2$s.ID = %4$s.TaskID '.
                '  JOIN `%5$s` %6$s '.
                '    ON %4$s.SectionID = %6$s.CourseSectionID '.
                '  JOIN `%7$s` %8$s '.
                '    ON %8$s.ID = %6$s.PersonID '.
                ' WHERE %6$s.Role = "Teacher" '.
                '   AND %2$s.ID = %9$u '.
                ' GROUP BY %6$s.PersonID, %6$s.Role ',
                [
                    $Task::$tableName,
                    $Task::getTableAlias(),
                    StudentTask::$tableName,
                    StudentTask::getTableAlias(),
                    \Slate\Courses\SectionParticipant::$tableName,
                    \Slate\Courses\SectionParticipant::getTableAlias(),
                    Person::$tableName,
                    Person::getTableAlias(),
                    $Task->ID
                ]
            );
        }

        return $users;
    }
}

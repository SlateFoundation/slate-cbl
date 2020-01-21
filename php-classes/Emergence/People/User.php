<?php

namespace Emergence\People;

use DB;
use HandleBehavior;
use Emergence\Logger;


class User extends Person implements IUser
{
    public static $minPasswordLength = 5;
    public static $usernameGenerator = 'flast';
    public static $onPasswordSet;
    public static $fallbackUserFinders = [];

    public static $classLabel = 'User';

    public static $defaultClass = __CLASS__;
    public static $subClasses = [__CLASS__];
    public static $singularNoun = 'user';
    public static $pluralNoun = 'users';

    // ActiveRecord configuration
    public static $fields = [
        'Username' => [
            'unique' => true
            ,'includeInSummary' => true
        ]
        ,'Password' => [
            'type' => 'string'
            ,'default' => null
            ,'excludeFromData' => true
        ]
        ,'AccountLevel' => [
            'type' => 'enum'
            ,'values' => ['Disabled','Contact','User','Staff','Administrator','Developer']
            ,'default' => 'User'
        ]
        ,'TemporaryPassword' => [
            'type' => 'string'
            ,'default' => null
            ,'accountLevelEnumerate' => 'Administrator'
        ]
    ];

    public static $searchConditions = [
        'Username' => [
            'qualifiers' => ['any','username','uname','user']
            ,'points' => 3
            ,'sql' => 'Username LIKE "%%%s%%"'
        ]
        ,'AccountLevel' => [
            'qualifiers' => ['accountlevel']
            ,'points' => 2
            ,'sql' => 'AccountLevel LIKE "%%%s%%"'
        ]
    ];

    public static $validators = [
        'Username' => [
            'validator' => 'handle'
            ,'required' => true
            ,'errorMessage' => 'Username can only contain letters, numbers, hyphens, and underscores.'
        ]
        ,'AccountLevel' => [
            'validator' => 'selection'
            ,'choices' => [] // filled dynamically in __classLoaded
            ,'required' => false
        ]
    ];

    public static function __classLoaded()
    {
        // merge User classes into valid Person classes, but not again when child classes are loaded
        if (get_called_class() == __CLASS__) {
            Person::$subClasses = static::$subClasses = array_merge(Person::$subClasses, static::$subClasses);
            self::$validators['AccountLevel']['choices'] = self::$fields['AccountLevel']['values'];
        }

        // finish ActiveRecord initialization
        parent::__classLoaded();
    }

    public function getValue($name)
    {
        switch ($name) {
            case 'AccountLevelNumeric':
                return static::_getAccountLevelIndex($this->AccountLevel);
            case 'Handle':
                return $this->Username;
            default:
                return parent::getValue($name);
        }
    }

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        // disallow 'system' username
        if ($this->isFieldDirty('Username') && strtolower($this->Username) === 'system') {
            $this->_validator->addError('Username', "Username 'system' is forbidden");
        }

        // check username uniqueness
        if ($this->isDirty && !$this->_validator->hasErrors('Username') && $this->Username) {
            $ExistingUser = static::getByUsername($this->Username);

            if ($ExistingUser && ($ExistingUser->ID != $this->ID)) {
                $this->_validator->addError('Username', 'Username already registered.');
            }
        }

        // save results
        return $this->finishValidation();
    }

    public function save($deep = true)
    {
        // generate user name if none provided
        if (!$this->Username) {
            $this->Username = $this->getUniqueUsername();
        }

        return parent::save($deep);
    }

    public function getTitle()
    {
        return sprintf('%s (%s)', $this->Username, $this->AccountLevel);
    }

    public function getHandle()
    {
        return $this->Username;
    }

    public static function getByHandle($handle)
    {
        return static::getByUsername($handle);
    }

    // enable login by email
    public static function getByLogin($username, $password)
    {
        $User = static::getByUsername($username);

        if ($User && is_a($User, __CLASS__) && $User->hasAccountLevel('User') && $User->verifyPassword($password)) {
            return $User;
        } else {
            return null;
        }
    }

    public static function getByUsername($username)
    {
        // try to get by username first
        if ($User = static::getByField('Username', $username)) {
            return $User;
        }

        // try to get by email
        if (!\Validators\EmailAddress::isInvalid($username)) {
            $EmailPoint = \Emergence\People\ContactPoint\Email::getByString($username);

            if ($User = $EmailPoint->Person) {
                return $User;
            }
        }

        // try configured fallback user finders
        foreach (static::$fallbackUserFinders AS $index => $fallbackUserFinder) {
            if (!$fallbackUserFinder) {
                continue;
            }

            if (!is_callable($fallbackUserFinder)) {
                Logger::general_warning('User::$fallbackUserFinders[{index}] is not callable', ['index' => $index]);
                continue;
            }

            if ($User = call_user_func($fallbackUserFinder, $username)) {
                return $User;
            }
        }

        return null;
    }

    public function verifyPassword($password)
    {
        if ($this->Password[0] == '$') {
            return password_verify($password, $this->Password);
        } elseif (SHA1($password) == $this->Password) {
            $wasDirty = $this->isDirty;
            $this->setClearPassword($password);

            if (!$wasDirty) {
                $this->save();
            }

            return true;
        }

        return false;
    }

    public function setClearPassword($password)
    {
        $this->Password = password_hash($password, PASSWORD_DEFAULT);
        $this->TemporaryPassword = null;

        if (is_callable(static::$onPasswordSet)) {
            call_user_func(static::$onPasswordSet, $password, $this);
        }
    }

    public function setTemporaryPassword($temporaryPassword = null)
    {
        $temporaryPassword = $temporaryPassword ?: static::generatePassword();
        $this->setClearPassword($temporaryPassword);
        $this->TemporaryPassword = $temporaryPassword;
    }

    public function hasAccountLevel($accountLevel)
    {
        $accountLevelIndex = static::_getAccountLevelIndex($accountLevel);

        if ($accountLevelIndex === false) {
            return false;
        } else {
            return ($this->AccountLevelNumeric >= $accountLevelIndex);
        }
    }

    public function getUniqueUsername($options = [])
    {
        // apply default options
        $options = array_merge(
            ['suffixFormat' => '%s%u', 'domainConstraints' => []],
            is_string(static::$usernameGenerator) || is_callable(static::$usernameGenerator) ? ['format' => static::$usernameGenerator] : static::$usernameGenerator,
            $options,
            ['handleField' => 'Username']
        );

        if (!$this->isPhantom) {
            $options['domainConstraints'][] = 'ID != '.$this->ID;
        }

        // create seed username
        switch ($options['format']) {
            case 'flast':
                $username = preg_replace('/\PL/u', '', $this->FirstName[0].$this->LastName);
                break;
            case 'firstl':
                $username = preg_replace('/\PL/u', '', $this->FirstName.$this->LastName[0]);
                break;
            case 'first.last':
                $username = preg_replace('/\PL/u', '', $this->FirstName.'.'.$this->LastName);
                break;
            default:
                if (is_callable($options['format'])) {
                    $username = call_user_func($options['format'], $this, $options);
                } else {
                    throw new Exception('Unknown format format.');
                }
        }

        // use HandleBehavior to transform characters and guarantee uniqueness
        return HandleBehavior::getUniqueHandle(get_called_class(), $username, $options);
    }

    protected static function _getAccountLevelIndex($accountLevel)
    {
        return array_search($accountLevel, self::$fields['AccountLevel']['values']);
    }

    public static function generatePassword($length = 8)
    {
        $chars = ['2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's' ,'t', 'u', 'v', 'w', 'x', 'y', 'z'];
        $password = '';

        for ($i=0; $i<$length; $i++) {
            $password .= $chars[mt_rand(0, count($chars)-1)];
        }

        return $password;
    }
}
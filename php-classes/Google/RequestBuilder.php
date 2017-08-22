<?php

namespace Google;

use Cache, Exception;

use Emergence\Http\Message\Request;
use Emergence\Http\Message\Uri;

use Firebase\JWT\JWT;

use Google\Drive\UserChangeMonitor;

class RequestBuilder
{
    /*
    * Authentication Methods
    */
    public static function getAuthRequestHeaders($email, $scope = null)
    {
        if (empty($scope)) {
            $scope = DriveFile::$apiScope;
        }

        return [
            'Authorization' => 'Bearer '. API::getAccessToken($scope, $email)
        ];
    }

    public static function getAccessToken($scope, $user)
    {
        if (!API::$clientEmail) {
            throw new Exception('$clientEmail must be configured');
        }

        if (!API::$privateKey) {
            throw new Exception('$privateKey must be configured');
        }

        // return from cache if available
        $cacheKey = sprintf('%s/%s/%s', __CLASS__, $user, $scope);

        if ($accessToken = Cache::fetch($cacheKey)) {
            return $accessToken;
        }

        // fetch from API
        $tokenCredentialUrl = API::buildUrl('/oauth2/v4/token');

        $assertion = [
            'iss' => API::$clientEmail,
            'aud' => $tokenCredentialUrl,
            'exp' => time() + API::$expiry,
            'iat' => time() - API::$skew,
            'scope' => $scope
        ];

        if ($user) {
            $assertion['sub'] = $user;
        }

        return new Request(
            'POST',
            $tokenCredentialUrl,
            [
                'Content-Type' => 'application/x-www-form-urlencoded'
            ],

            http_build_query([
                'assertion' => JWT::encode($assertion, API::$privateKey, 'RS256'),
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer'
            ])
        );
    }


    /*
    * File Methods
    */
    public static function getFileDetails(DriveFile $File)
    {
        $Uri = new Uri(API::buildUrl('/drive/v3/files/'.$File->DriveID));
        $Request = new Request(
            'GET',
            $Uri->withQuery('fields='.$File::$apiFields),

            static::getAuthRequestHeaders($File->OwnerEmail)
        );

        return $Request->withAddedHeader('Content-Type', 'application/json');
    }

    public static function cloneFile(DriveFile $File)
    {
        $Request = new Request(
            'POST',
            API::buildUrl('/drive/v3/files/'.$File->DriveID.'/copy'),

            static::getAuthRequestHeaders($File->OwnerEmail),

            json_encode([
                'name' => $File->Title
            ])

        );

        return $Request->withAddedHeader('Content-Type', 'application/json');
    }

    public static function untrashFile(DriveFile $File)
    {
        $Uri = new Uri(API::buildUrl('/drive/v3/files/'.$File->DriveID));
        $Request = new Request(
            'PATCH',
            $Uri->withQuery('fields='.$File::$apiFields),

            static::getAuthRequestHeaders($File->OwnerEmail),

            json_encode([
                'trashed' => false
            ])
        );

        return $Request->withAddedHeader('Content-Type', 'application/json');
    }

    public static function createPermission(DriveFile $File, $email, $role, $type)
    {
        $Request = new Request(
            'POST',
            API::buildUrl('/drive/v3/files/'.$File->DriveID.'/permissions'),

            static::getAuthRequestHeaders($File->OwnerEmail),

            json_encode([
                'type' => $type,
                'role' => $role,
                'emailAddress' => $email
            ])
        );

        return $Request->withAddedHeader('Content-Type', 'application/json');
    }

    public static function transferOwnership(DriveFile $File, $email, $type)
    {
        $uri = new Uri(API::buildUrl('/drive/v3/files/'.$File->DriveID.'/permissions'));
        $Request = new Request(
            'POST',
            $uri->withQuery('transferOwnership=true'),

            static::getAuthRequestHeaders($File->OwnerEmail),

            json_encode([
                'type' => $type,
                'role' => 'owner',
                'emailAddress' => $email
            ])
        );

        return $Request->withAddedHeader('Content-Type', 'application/json');
    }


    /*
    * User Change Monitor Methods
    */
    public static function monitor(UserChangeMonitor $UserChangeMonitor, $expiration)
    {
        $Uri = new Uri(API::buildUrl('/drive/v3/changes/watch'));
        $Request = new Request(
            'POST',
            $Uri->withQuery('pageToken='.$UserChangeMonitor->StartPageToken),

            static::getAuthRequestHeaders((string)$UserChangeMonitor->EmailContact),

            json_encode([
                'id' => 'change-monitor-'.$UserChangeMonitor->EmailID,
                'type' => 'web_hook',
                'address' => $UserChangeMonitor::$webHookAddress,
                'expiration' => $expiration,
                'payload' => true
            ])
        );

        return $Request->withAddedHeader('Content-Type', 'application/json');
    }

    public static function getUserChangeMonitorStartPageToken(UserChangeMonitor $UserChangeMonitor)
    {
        $Requset = new Request(
            'GET',
            API::buildUrl('/drive/v3/changes/startPageToken'),

            static::getAuthRequestHeaders((string)$UserChangeMonitor->EmailContact)
        );

        return $Request->withAddedHeader('Content-Type', 'application/json');
    }
}
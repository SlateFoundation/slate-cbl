<?php

namespace Google;

use Cache;
use Firebase\JWT\JWT;


class API
{
    public static $clientEmail;
    public static $privateKey;
    public static $domain;
    public static $skew = 60;
    public static $expiry = 3600;

    protected static $accessToken;

    public static function getAccessToken($user, $scope)
    {
        if (!$userToken = Cache::fetch(sprintf('%s/%s/%s', __CLASS__, $user, $scope))) {
            $userToken = static::fetchAccessToken($scope, $user);
        }

        return $userToken;
    }


    public static function request($url, array $options = [])
    {
        // init get params
        if (empty($options['get'])) {
            $options['get'] = [];
        }

        // init post params
        if (empty($options['post'])) {
            $options['post'] = [];
        }

        // init headers
        if (empty($options['headers'])) {
            $options['headers'] = [];
        }

        if (!empty($options['user']) && !empty($options['scope']) ) {
            $options['headers'][] = 'Authorization: Bearer ' . static::getAccessToken($options['user'], $options['scope']);
        } elseif (empty($options['skipAuth'])) {
            if (!static::$accessToken) {
                throw new \Exception('fetchAccessToken must be called with a scope before executeRequest');
            }

            $options['headers'][] = 'Authorization: Bearer ' . static::$accessToken;
        }

        $options['headers'][] = 'User-Agent: emergence';

        // init url
        $url = static::buildUrl($url);

        if (!empty($options['get'])) {
            $url .= '?' . http_build_query(array_map(function($value) {
                if (is_bool($value)) {
                    return $value ? 'true' : 'false';
                }

                return $value;
            }, $options['get']));
        }

        // configure curl
        $ch = curl_init($url);

        // configure output
        if (!empty($options['outputPath'])) {
            $fp = fopen($options['outputPath'], 'w');
            curl_setopt($ch, CURLOPT_FILE, $fp);
        } else {
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        }

        // configure method and body
        if (!empty($options['post'])) {
            if (empty($options['method']) || $options['method'] == 'POST') {
                curl_setopt($ch, CURLOPT_POST, true);
            } else {
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $options['method']);
            }

            if (is_array($options['post'])) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($options['post']));
                $options['headers'][] = 'Content-Type: application/json';
            } else {
                curl_setopt($ch, CURLOPT_POSTFIELDS, $options['post']);
            }
        }

        // configure headers
        curl_setopt($ch, CURLOPT_HTTPHEADER, $options['headers']);

        // execute request
        $result = curl_exec($ch);
        curl_close($ch);

        if (isset($fp)) {
            fclose($fp);
        } elseif (!isset($options['decodeJson']) || $options['decodeJson']) {
            $result = json_decode($result, true);
        }

        return $result;
    }

    public static function buildUrl($url)
    {
        if (strpos($url, 'https://') === 0 || strpos($url, 'http://') === 0) {
            return $url;
        }

        return 'https://www.googleapis.com/' . ltrim($url, '/');
    }

    public static function fetchAccessToken($scope, $user)
    {
        if (!static::$clientEmail) {
            throw new \Exception('$clientEmail must be configured');
        }

        if (!static::$privateKey) {
            throw new \Exception('$privateKey must be configured');
        }

        $tokenCredentialUrl = static::buildUrl('/oauth2/v4/token');

        $assertion = [
            'iss' => static::$clientEmail,
            'aud' => $tokenCredentialUrl,
            'exp' => time() + static::$expiry,
            'iat' => time() - static::$skew,
            'scope' => $scope
        ];

        if ($user) {
            $assertion['sub'] = $user;
        }

        $response = static::request($tokenCredentialUrl, [
            'skipAuth' => true,
            'headers' => [
                'Content-Type: application/x-www-form-urlencoded'
            ],
            'post' => http_build_query([
                'assertion' => JWT::encode($assertion, static::$privateKey, 'RS256'),
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer'
            ])
        ]);

        if (empty($response['access_token'])) {
            throw new \Exception('access_token missing from auth response');
        }

        // subtract 1 minute from returned token expiration
        Cache::store(sprintf('%s/%s/%s', __CLASS__, $user, $scope), $response['access_token'], $response['expires_in'] - 60);

        return $response['access_token'];
    }
}
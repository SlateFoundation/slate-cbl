<?php

namespace Google;

use Cache;
use Firebase\JWT\JWT;

use Psr\Http\Message\MessageInterface;

class API
{
    public static $clientEmail;
    public static $privateKey;
    public static $domain;
    public static $developerKey;
    public static $clientId;
    public static $skew = 60;
    public static $expiry = 3600;

    public static $defaultAccessToken;

    public static function __callStatic($name, $arguments)
    {
        return static::executeRequest(call_user_func_array([RequestBuilder::class, $name], $arguments));
    }

    public static function executeRequest(MessageInterface $Request, array $options = [])
    {
        $Request = $Request->withAddedHeader('User-Agent', 'emergence');
        // configure curl
        $ch = curl_init((string)$Request->getUri());

        // configure output
        if (!empty($options['outputPath'])) {
            $fp = fopen($options['outputPath'], 'w');
            curl_setopt($ch, CURLOPT_FILE, $fp);
        } else {
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        }

        // configure method and body
        if (strtolower($Request->getMethod()) == 'post') {
            curl_setopt($ch, CURLOPT_POST, true);

            if (!empty((string)$Request->getBody())) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, (string)$Request->getBody());
            }

        } else if (strtolower($Request->getMethod()) != 'get') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $Request->getMethod());
        }

        // configure headers
        curl_setopt($ch, CURLOPT_HTTPHEADER, static::formatHeaders($Request->getHeaders()));

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

    public static function executeBatchRequest(array $Requests)
    {

        // configure curl
        $ch = curl_init(static::buildUrl('batch'));

        $boundary = mt_rand();

        $headers = [
            'Content-Type' => "multipart/mixed; boundary=$boundary",
            'User-Agent' => 'emergence'
        ];

        $body = [
            PHP_EOL,
            "--$boundary"
        ];

        // configure request
        curl_setopt($ch, CURLOPT_HTTPHEADER, static::formatHeaders($headers));
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // configure batch request body
        foreach ($Requests as $requestKey => $Request) {
            if ($Request instanceof MessageInterface) {
                $body[] = sprintf(
                    'Content-Type: application/http%1$s'.
                    'content-id: %2$s%1$s'.
                    'content-transfer-encoding: binary%1$s%1$s'.
                    '%3$s %4$s%1$s'.
                    '%5$s%1$s%1$s%1$s'.
                    '%6$s%1$s%1$s'.
                    '--%7$s',

                    PHP_EOL, // 1
                    $requestKey, // 2
                    $Request->getMethod(), // 3
                    $Request->getUri()->getPath() . ($Request->getUri()->getQuery() ? '?'.$Request->getUri()->getQuery() : ''), // 4
                    join(PHP_EOL, static::formatHeaders($Request->getHeaders())), // 5
                    empty($Request->getBody()) ? '' : (string)$Request->getBody(), // 6
                    $boundary
                );
            }
        }

        curl_setopt($ch, CURLINFO_HEADER_OUT, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, join(PHP_EOL, $body) . '--');

        // execute request
        $result = curl_exec($ch);
        curl_close($ch);

        // parse results
        $results = [];
        if (preg_match('/^(--batch_)([a-z0-9_\-]+)(--)?/i', $result, $matches)) {
            $responseBoundary = $matches[0];
            foreach (explode($responseBoundary, $result) as $responsePart) {
                if (empty($responsePart)) {
                    continue;
                }

                // skip responses where content-id can not be retrieved
                if (!preg_match('/Content-ID:\sresponse-([a-z0-9\_\-\|@\.]+)/i', $responsePart, $headerMatches)) {
                    continue;
                }
                $contentId = $headerMatches[1];

                // skip responses that are unparsable
                if (!preg_match('/\{([a-z0-9\s-_\\\\\/\.\,\?\="\\\':#@\[\{\]\}]+)\}/i', $responsePart, $responseParts)) {
                    continue;
                }

                // skip unparsable response bodies
                if (count($responseParts) >= 2) {
                    $responseBody = $responseParts[count($responseParts) - 2];
                } else {
                    continue;
                }

                $results[$contentId] = json_decode($responseBody, true);
            }
        } else {
            throw new \Exception('Unable to parse response.');
        }

        return $results;

    }

    public static function formatHeaders(array $headers = [])
    {
        $formattedHeaders = [];

        foreach ($headers as $name => $values) {
            if (is_array($values)) {
                $formattedHeaders[] = sprintf('%s: %s', $name, join(', ', $values));
            } else {
                $formattedHeaders[] = sprintf('%s: %s', $name, (string)$values);
            }
        }

        return $formattedHeaders;
    }

    public static function buildUrl($url)
    {
        if (strpos($url, 'https://') === 0 || strpos($url, 'http://') === 0) {
            return $url;
        }

        return 'https://www.googleapis.com/' . ltrim($url, '/');
    }

    public static function getAccessToken($scope, $user, $ignoreCache = false)
    {
        $cacheKey = sprintf('%s/%s/%s', __CLASS__, $user, $scope);

        if ($ignoreCache === false && $accessToken = \Cache::fetch($cacheKey)) {
            return $accessToken;
        }

        $Request = RequestBuilder::getAccessToken($scope, $user);

        $response = static::executeRequest($Request);

        if (empty($response['access_token'])) {
            throw new \Exception('access_token missing from auth response' . (!empty($response['error_description']) ? ': '.$response['error_description'] : ''));
        }

        // subtract 1 minute from returned token expiration
        Cache::store(
            $cacheKey,
            $response['access_token'],
            $response['expires_in'] - 60
        );

        return $response['access_token'];
    }
}
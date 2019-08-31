<?php

namespace Google;

use Cache;
use Emergence\Logger;
use Firebase\JWT\JWT;
use Psr\Http\Message\MessageInterface;
use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;

class API
{
    public static $clientEmail;
    public static $privateKey;
    public static $domain;
    public static $developerKey;
    public static $clientId;
    public static $skew = 60;
    public static $expiry = 3600;

    public static $defaultLogger = Logger::class;

    public static $retryResponseCodes = [
        403 => [
            'userRateLimitExceeded',
            'rateLimitExceeded'
        ],
        429 => [
            'rateLimitExceeded'
        ],
        500 => [
            'backendError',
            'internalError'
        ]
    ];

    public static $maxRetries = 3;

    public static $defaultAccessToken;

    public static function __callStatic($name, $arguments)
    {
        return static::executeRequest(call_user_func_array([RequestBuilder::class, $name], $arguments));
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

        if (empty($ignoreCache) && $accessToken = \Cache::fetch($cacheKey)) {
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

    public static function executeRequest(MessageInterface $Request, array $options = [], LoggerInterface $Logger = null)
    {
        if (!$Logger) {
            $Logger = new static::$defaultLogger();
        }

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


    /**
    * Batch Requests
    **/

    private static $batchRequestsQueue = [];
    private static function queueBatchRequests($requests)
    {
        static::$batchRequestsQueue = array_merge(static::$batchRequestsQueue, $requests);
    }

    protected static function initializeBatchRequest($boundary)
    {
        // configure curl
        $ch = curl_init(static::buildUrl('batch'));

        $headers = [
            'Content-Type' => "multipart/mixed; boundary=$boundary",
            'User-Agent' => 'emergence'
        ];

        // configure request
        curl_setopt($ch, CURLOPT_HTTPHEADER, static::formatHeaders($headers));
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLINFO_HEADER_OUT, true);

        return $ch;
    }

    protected static function generateRequestBody(MessageInterface $Request, $requestKey, $boundary)
    {
        $body = sprintf(
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
            $Request->getUri()->getPath() . "?quotaUser=$requestKey". ($Request->getUri()->getQuery() ? '&'.$Request->getUri()->getQuery() : ''), // 4
            join(PHP_EOL, static::formatHeaders($Request->getHeaders())), // 5
            empty($Request->getBody()) ? '' : (string)$Request->getBody(), // 6
            $boundary
        );

        return $body;
    }

    public static function executeBatchRequest(array $Requests, $retry = 1, LoggerInterface $Logger = null)
    {
        if (!$Logger) {
            $Logger = new static::$defaultLogger();
        }

        $results = [];
        $failedRequests = [];
        $failedResponses = [];
        $splitAt = 95;
        do {
            $boundary = mt_rand();
            $ch = static::initializeBatchRequest($boundary);
            $body = [
                PHP_EOL,
                "--$boundary"
            ];

            // configure batch request body
            foreach ($Requests as $requestKey => $Request) {
                if (count($body) % $splitAt === 0) {
                    static::$batchRequestsQueue = array_slice($Requests, $splitAt - 2, null, true);
                    break;
                }

                if ($Request instanceof MessageInterface) {
                    $body[] = static::generateRequestBody($Request, $requestKey, $boundary);
                }
            }

            curl_setopt($ch, CURLOPT_POSTFIELDS, join(PHP_EOL, $body) . '--');
            // execute request
            $result = curl_exec($ch);
            curl_close($ch);

            // parse response
            if (preg_match('/^(--batch_)([a-z0-9_\-]+)(--)?/i', $result, $matches)) {
                $responseBoundary = $matches[0];
                foreach (explode($responseBoundary, $result) as $responsePart) {
                    if (empty($responsePart)) {
                        continue;
                    }

                    // skip responses where content-id can not be retrieved
                    if (!preg_match('/Content-ID:\sresponse-([\S]+)/i', $responsePart, $headerMatches)) {
                        // end of batch request
                        if (!preg_match("/^(--)?(\s+)?/", trim($responsePart))) {
                            $Logger->log(
                                LogLevel::WARNING,
                                'Unparsable content-id',
                                [
                                    'responsePart' => $responsePart
                                ]
                            );
                        }

                        continue;
                    }
                    $contentId = $headerMatches[1];

                    if (!array_key_exists($contentId, $Requests)) {
                        $Logger->log(
                            LogLevel::WARNING,
                            'Unknown Response content-id: {responseContentId}',
                            [
                                'responseContentId' => $contentId,
                                'response' => $responsePart
                            ]
                        );
                    }

                    // skip responses that are unparsable
                    if (!preg_match('/\{([\S\s]+)\}\s+?$/i', $responsePart, $responseParts)) {
                        $Logger->log(
                            LogLevel::ERROR,
                            'Response unparsable, skipping.',
                            [
                                'responsePart' => $responsePart
                            ]
                        );
                        continue;
                    }

                    // skip unparsable response bodies
                    if (count($responseParts) < 2) {
                        $Logger->log(
                            LogLevel::ERROR,
                            'Response body unparsable, skipping. ({responseContentId})',
                            [
                                'responseParts' => $responseParts,
                                'contentId' => $contentId
                            ]
                        );
                        continue;
                    }
                    $responseBody = json_decode($responseParts[count($responseParts) - 2], true);

                    if (
                        (
                            $retry === true ||
                            is_numeric($retry) &&
                            (int)$retry <= static::$maxRetries
                        ) &&
                        isset($responseBody['error']) &&
                        is_array($responseBody['error']) &&
                        isset($responseBody['error']['code']) &&
                        isset($responseBody['error']['reason']) &&
                        isset(static::$retryResponseCodes[$responseBody['error']['code']]) &&
                        in_array($responseBody['error']['reason'], static::$retryResponseCodes[$responseBody['error']['code']])
                    ) {
                        $Logger->log(
                            LogLevel::WARNING,
                            'Retrying failed request ({responseContentId}). Error Code: {responseErrorCode} Reason: {responseErrorMessage}',
                            [
                                'responseContentId' => $contentId,
                                'responseErrorCode' => $responseBody['error']['code'],
                                'responseErrorMessage' => isset($responseBody['error']['errors'][0]['message']) ? $responseBody['error']['errors'][0]['message'] : $responseBody['error']['message']
                            ]
                        );
                        $failedRequests[$contentId] = $Requests[$contentId];
                        $failedResponses[$contentId] = $responseBody['error'];
                    }

                    $results[$contentId] = $responseBody;
                }
            } else {
#                \MICS::dump($result, 'exception');
                $Logger->log(
                    LogLevel::ERROR,
                    'Batch response unparsable.',
                    [
                        'response' => $result
                    ]
                );
                throw new \Exception('Unable to parse response.');
            }

            // queue failed requestest
            if (!empty($failedRequests)) {
                $Logger->warning('{totalFailedRequests} requests failed, retrying...', [
                    'totalFailedRequests' => count($failedRequests),
                    'failed request keys' => array_keys($failedRequests),
                    'failed responses' => $failedResponses,
                    'failed requests' => $failedRequests
                ]);
                sleep(pow(2, (is_numeric($retry) ? $retry : 1) - 1));
                $retry++;
                static::queueBatchRequests($failedRequests);
            }

            if (count(static::$batchRequestsQueue) === 0) {
                $Requests = [];
            } else {
                $Requests = static::$batchRequestsQueue;
                static::$batchRequestsQueue = [];
            }

        } while (count($Requests));

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


}
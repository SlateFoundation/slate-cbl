<?php

if (!$GLOBALS['Session']->hasAccountLevel('Administrator')) {
    return RequestHandler::throwUnauthorizedError();
}

$conditions = [];
$options = [
    'limit' => 0
];

if (!empty($_REQUEST['Status'])) {
    $conditions['Status'] = \DB::escape($_REQUEST['Status']);
}

RequestHandler::respond('files', [
    'data' => \Google\DriveFile::getAllByWhere($conditions, $options),
    'options' => $options,
    'conditions' => $conditions
]);
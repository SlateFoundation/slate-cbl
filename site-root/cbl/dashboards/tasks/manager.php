<?php

$GLOBALS['Session']->requireAccountLevel('Staff');

Sencha_RequestHandler::respond('app/SlateTasksManager/ext', [
    'App' => Sencha_App::getByName('SlateTasksManager'),
    'mode' => 'production'
]);
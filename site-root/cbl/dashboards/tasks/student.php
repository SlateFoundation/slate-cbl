<?php

$GLOBALS['Session']->requireAuthentication();

Sencha_RequestHandler::respond('app/SlateTasksStudent/ext', [
    'App' => Sencha_App::getByName('SlateTasksStudent'),
    'mode' => 'production'
]);
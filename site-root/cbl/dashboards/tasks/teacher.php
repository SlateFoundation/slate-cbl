<?php

$GLOBALS['Session']->requireAccountLevel('Staff');

Sencha_RequestHandler::respond('app/SlateTasksTeacher/ext', [
    'App' => Sencha_App::getByName('SlateTasksTeacher'),
    'mode' => 'production'
]);
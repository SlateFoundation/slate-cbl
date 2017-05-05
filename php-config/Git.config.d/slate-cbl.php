<?php

Git::$repositories['slate-cbl'] = [
    'remote' => 'https://github.com/SlateFoundation/slate-cbl.git',
    'originBranch' => 'releases/v2',
    'workingBranch' => 'releases/v2',
    'localOnly' => true,
    'trees' => [
        'event-handlers/Slate/CBL',
        'event-handlers/Emergence/Site/nightly-maintenance/50_cbl-google-drive-changes-monitor.php',
        'event-handlers/Emergence/Site/nightly-maintenance/50_cbl-invalidate-expired-tasks.php',
        'html-templates/app/SlateDemonstrationsStudent',
        'html-templates/app/SlateDemonstrationsTeacher',
        'html-templates/app/SlateTasksManager',
        'html-templates/app/SlateTasksStudent',
        'html-templates/app/SlateTasksTeacher',
        'html-templates/cbl',
        'php-classes/Slate/CBL',
        'php-classes/Google/API.php',
        'php-classes/Google/Drive',
        'php-classes/Google/DriveFile.php',
        'php-config/Git.config.d/slate-cbl.php',
        'php-config/Slate/UI/Tools.config.d/cbl.php',
        'php-migrations/Slate/CBL',
        'sencha-workspace/AggregridExample',
        'sencha-workspace/SlateDemonstrationsStudent',
        'sencha-workspace/SlateDemonstrationsTeacher',
        'sencha-workspace/SlateTasksManager',
        'sencha-workspace/SlateTasksStudent',
        'sencha-workspace/SlateTasksTeacher',
        'site-root/cbl',
        'site-root/google-drive/user-change-monitor.php'
    ]
];

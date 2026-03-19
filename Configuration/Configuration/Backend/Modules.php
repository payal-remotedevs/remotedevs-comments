<?php

declare(strict_types=1);

use RemoteDevs\RdComments\Controller\BackendCommentController;

return [
    'web_comments' => [
        'parent' => 'web',
        'position' => ['after' => 'web_info'],
        'access' => 'user,group',
        'workspaces' => 'live',
        'path' => '/module/web/comments',
        'labels' => 'LLL:EXT:rd_comments/Resources/Private/Language/locallang_mod.xlf',
        'iconIdentifier' => 'rd-comments-module',
        'extensionName' => 'RdComments',
        'controllerActions' => [
            BackendCommentController::class => [
                'backendList',
                'delete',
            ],
        ],
    ],
];
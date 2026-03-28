<?php

return [
    'comments' => [
        'parent' => 'web',
        'access' => 'systemMaintainer',
        'path' => '/module/comments',
        'iconIdentifier' => 'comment-plugin-comment',
        'labels' => 'LLL:EXT:rd_comments/Resources/Private/Language/locallang_mod.xlf',
        'extensionName' => 'RdComments',
        'navigationComponentId' => 'TYPO3.Backend',
        'controllerActions' => [
            \RemoteDevs\RdComments\Controller\BackendCommentController::class => 'backendList,showComments,showOnlyReplies,delete,pin,ajaxPin,ajaxDelete',
        ],
    ],
];
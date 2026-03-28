<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'Rd comments',
    'description' => '',
    'category' => 'plugin',
    'author' => 'Abhay Rathod',
    'author_email' => 'abhay.remotedevs@gmail.com',
    'author_company' => 'RemoteDevs',
    'state' => 'stable',
    'clearCacheOnLoad' => 0,
    'version' => '1.1.0',
    'constraints' => [
        'depends' => [
            'typo3' => '12.0.0-12.4.99',
            'news' => '11.0.0-11.4.2',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];

<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'RD Comments',
    'description' => 'Advanced comment system for TYPO3 News extension with nested replies and backend management',
    'category' => 'plugin',
    'author' => 'Abhay Rathod, Karan Anjara',
    'author_email' => 'abhay.remotedevs@gmail.com',
    'author_company' => 'RemoteDevs Infotech',
    'state' => 'stable',
    'clearCacheOnLoad' => 0,
    'version' => '1.0.0',
    'constraints' => [
        'depends' => [
            'typo3' => '11.5.0-11.5.99',
            'news' => '9.1.0-11.99.99'
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
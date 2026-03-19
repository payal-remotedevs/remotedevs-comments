<?php

declare(strict_types=1);

defined('TYPO3') || die();

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Information\Typo3Version;
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use RemoteDevs\RdComments\Controller\BackendCommentController;

if ((GeneralUtility::makeInstance(Typo3Version::class))->getMajorVersion() == 11) {
    // @extensionScannerIgnoreLine
    ExtensionManagementUtility::addLLrefForTCAdescr('tx_rdcomments_domain_model_comment', 'EXT:rd_comments/Resources/Private/Language/locallang_csh_tx_comments_domain_model_comment.xlf');
    // @extensionScannerIgnoreLine
    ExtensionManagementUtility::allowTableOnStandardPages('tx_rdcomments_domain_model_comment');
}

ExtensionUtility::registerModule(
    'RdComments',
    'web', 
    'comments', 
    '', 
    [
        BackendCommentController::class => 'backendList,delete',
    ],
    [
        'access' => 'user,group',
        'icon'   => 'EXT:rd_comments/Resources/Public/Icons/plug_comment.svg',
        'labels' => 'LLL:EXT:rd_comments/Resources/Private/Language/locallang_mod.xlf',
    ]
);

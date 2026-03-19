<?php
defined('TYPO3') || die();


use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

(static function () {
    ExtensionUtility::configurePlugin(
        'RdComments',
        'RdComment',
        [
            \RemoteDevs\RdComments\Controller\CommentController::class => 'list, create, delete'
        ],
        // non-cacheable actions
        [
            \RemoteDevs\RdComments\Controller\CommentController::class => 'list, create, delete'
        ]
    );

    ExtensionManagementUtility::addPageTSConfig(
        'mod {
            wizards.newContentElement.wizardItems.commentplugintab {
            header = LLL:EXT:rd_comments/Resources/Private/Language/locallang_db.xlf:commentplugintab.header
                elements {
                    comments {
                        iconIdentifier = rd_comments-plugin-comment
                        title = LLL:EXT:rd_comments/Resources/Private/Language/locallang_db.xlf:tx_rdcomments_comment.name
                        description = LLL:EXT:rd_comments/Resources/Private/Language/locallang_db.xlf:tx_rdcomments_comment.description
                        tt_content_defValues {
                            CType = list
                            list_type = rdcomments_rdcomment
                        }
                    }
                }
                show = *
            }
       }'
    );
})();

<?php
defined('TYPO3') || die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

call_user_func(function () {
    // Register plugin
    ExtensionUtility::registerPlugin(
        'RdComments',   // Extension name (without underscores)
        'RdComment',    // Plugin name (first uppercase letter)
        'RD Comments'   // Plugin title shown in backend
    );

    // Get plugin signature (lowercase)
    $pluginSignature = 'rdcomments_rdcomment';

    // Exclude some default fields
    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_excludelist'][$pluginSignature] = 'recursive,select_key,pages';

    // Add FlexForm field to the plugin
    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'pi_flexform';

    // Register your FlexForm XML
    ExtensionManagementUtility::addPiFlexFormValue(
        $pluginSignature,
        'FILE:EXT:rd_comments/Configuration/FlexForm/FlexForm.xml'
    );
});

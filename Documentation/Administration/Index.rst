.. _admin-manual:

Administration Manual
=====================

This section explains how to configure the RD Comments extension using TypoScript constants. These constants control how comments behave on the frontend, how records are stored, and how to override the default Fluid templates for customization.

You can define constants in two ways:

- Through the **Constant Editor** in the TYPO3 backend
- Or directly via the `constants.typoscript` file in your sitepackage

----

Configuration Overview
----------------------

+--------------------------------------------------------+--------------------------------------------------------------+
| **Constant**                                            | **Explanation**                                              |
+========================================================+==============================================================+
| `plugin.tx_rdcomments_rdcomment.persistence.storagePid`| Page ID where comment records are stored.                    |
|                                                        | Set this to the SysFolder or page where your comment data    |
|                                                        | should be saved. Required for frontend to work.              |
+--------------------------------------------------------+--------------------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.settings.termsRequired`| Enables a "Terms & Conditions" checkbox in the comment form. |
|                                                        |                                                              |
|                                                        | - `1`: Enable (visitors must accept terms to submit a comment)|
|                                                        | - `0`: Disable                                               |
+--------------------------------------------------------+--------------------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.settings.termsTypolinkParameter`| The link to your Terms & Conditions page.           |
|                                                        | Use a **Typolink format** URL, such as a full external link  |
|                                                        | (e.g., `https://example.com/terms`) or an internal page ID.  |
+--------------------------------------------------------+--------------------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.settings.dateFormat`   | Defines how comment dates appear in the frontend.            |
|                                                        | Supported values:                                            |
|                                                        | - `F j Y` → "June 30 2025"                                   |
|                                                        | - `Y-m-d` → "2025-06-30"                                     |
|                                                        | - `m/d/Y` → "06/30/2025"                                     |
|                                                        | - `d/m/Y` → "30/06/2025"                                     |
|                                                        | - `d.m.Y` → "30.06.2025"                                     |
+--------------------------------------------------------+--------------------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.settings.timeFormat`   | Defines how comment time appears in the frontend.            |
|                                                        | Supported values:                                            |
|                                                        | - `g:i a` → "2:45 pm" (12-hour lowercase)                    |
|                                                        | - `g:i A` → "2:45 PM" (12-hour uppercase)                    |
|                                                        | - `H:i`   → "14:45" (24-hour format)                         |
+--------------------------------------------------------+--------------------------------------------------------------+

----

Best Practices
--------------

- Always set the `storagePid` to a page where news and comments are stored .
- Enable `termsRequired` to comply with legal policies (like GDPR).
- Choose a `dateFormat` and `timeFormat` that match your site’s language and regional preferences.

----

Next Steps
----------

- Return to the :ref:`main extension overview <start>`
- Or continue to the :ref:`User Manual <userManual>` to learn how comment threads and moderation work.

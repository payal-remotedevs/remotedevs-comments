.. _admin-manual:

Administration Manual
=====================

This section explains how to configure the **RD Comments** extension using
**TypoScript constants**. These constants control how comments behave on the
frontend, where records are stored, and how Fluid templates can be overridden
for customization.

You can define TypoScript constants in two ways:

- Via the **Constant Editor** in the TYPO3 backend
- Directly in the `constants.typoscript` file of your SitePackage

----

Configuration Overview
----------------------

Comment Configuration
~~~~~~~~~~~~~~~~~~~~~

+------------------------------------------------------------------+--------------------------------------------------------------+
| **Constant**                                                     | **Explanation**                                              |
+==================================================================+==============================================================+
| `plugin.tx_rdcomments_rdcomment.settings.termsRequired`          | Enables a *Terms & Conditions* checkbox in the comment form.|
|                                                                  |                                                              |
|                                                                  | - `1`: Enabled (users must accept terms before submitting)  |
|                                                                  | - `0`: Disabled                                              |
+------------------------------------------------------------------+--------------------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.settings.termsTypolinkParameter` | Link to the Terms & Conditions page.                        |
|                                                                  | Must be provided in **Typolink format**, for example:        |
|                                                                  |                                                              |
|                                                                  | - Internal page UID (e.g. `123`)                             |
|                                                                  | - External URL (e.g. `https://example.com/terms`)            |
+------------------------------------------------------------------+--------------------------------------------------------------+

Files
~~~~~

+----------------------------------------------------------+---------------------------------------------------+
| **Constant**                                             | **Explanation**                                   |
+==========================================================+===================================================+
| `plugin.tx_rdcomments_rdcomment.view.templateRootPath`   | Path to the template root directory (frontend).   |
+----------------------------------------------------------+---------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.view.partialRootPath`    | Path to the template partials directory (frontend)|
+----------------------------------------------------------+---------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.view.layoutRootPath`     | Path to the template layouts directory (frontend).|
+----------------------------------------------------------+---------------------------------------------------+

----

Best Practices
--------------

- Enable `termsRequired` to comply with legal requirements such as GDPR
- Use the `view` path constants to override templates in your SitePackage
- Do not modify extension files directly — override behavior via TypoScript or
  templates in your SitePackage

----

Setup File Location
-------------------

The TypoScript setup is located at::

    Configuration/TypoScript/setup.typoscript

This file is loaded automatically once the **RD Comments static TypoScript
template** is included.

----

Next Steps
----------

- Return to the :ref:`extension overview <start>`
- Continue with the :ref:`User Manual <userManual>` to learn about comment
  rendering, threading, and moderation
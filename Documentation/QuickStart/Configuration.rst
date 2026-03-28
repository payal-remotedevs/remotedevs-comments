.. _quickConfiguration:

===================
Quick configuration
===================

.. note::

   **Before you proceed**, make sure to read the
   :ref:`Developer Notes <developer-notes>` section.
   It contains important instructions for correctly configuring the extension.
   Missing or incorrect configuration can prevent the comment form from rendering.

Adding TypoScript setup
=======================

To enable the default behavior and frontend rendering of the
:extension:`rd_comments` extension, its TypoScript configuration must be included.

In the TYPO3 backend, navigate to  
:guilabel:`Site Management > TypoScript`.

From the drop-down selector, choose **Edit TypoScript record** and open the
**Main TypoScript Rendering** record.
There, include the RD Comments TypoScript constants and setup.

This step is required to activate the default configuration and ensure that the
frontend plugin renders correctly.

.. image:: /Images/Configuration/RdIncludeTypoScript.png
   :alt: Include TypoScript for RD Comments

Go to the :guilabel:`Advanced Options` tab and add the following static template
from the list:

- :guilabel:`RD Comments (rd_comments)`

This step loads all required TypoScript settings to display the comment form and
comment threads in the frontend automatically.

If needed, you can override the default configuration using TypoScript constants
or by overriding the Fluid templates in your SitePackage.

.. warning::

   If the TypoScript is not included, the RD Comments plugin will render no output
   in the frontend, even if it is placed correctly on a page.

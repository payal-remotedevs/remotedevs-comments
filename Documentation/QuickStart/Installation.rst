.. _quickInstallation:

==============
Quick installation
==============

.. attention::

   When you install the `rd_comments` extension via Composer,
   the required `EXT:news` extension will be automatically installed if it's not already present in your project.

In a :ref:`composer-based TYPO3 installation <t3start:install>` you can install
the extension `rd_comments` via composer:

.. code-block:: bash

   composer require remotedevs/rd-comments

In TYPO3 installations above version 12.0, the extension will be automatically
installed. You do not have to activate it manually.

Update the database schema
--------------------------

Open your TYPO3 backend with :ref:`system maintainer` permissions.

In the module menu to the left, navigate to :guilabel:`Admin Tools > Maintenance`,
then click on :guilabel:`Analyze database` and apply all suggested changes.

.. image:: /Images/installation/database_structure.png
   :alt: TYPO3 Analyze Database screen

Clear all caches
----------------

In the same module :guilabel:`Admin Tools > Maintenance`, you can also
conveniently clear all caches by clicking the button :guilabel:`Flush cache`.

.. image:: /Images/installation/flushcache.png
   :alt: TYPO3 Flush Cache screen

.. _quickStart:

===========
Quick start
===========

.. rst-class:: bignums-tip

#. Install the extension:

   -  Install via Composer (recommended for TYPO3 v12)

   .. code-block:: bash

      composer require remotedevs/rd-comments

   -  Update the database schema using the TYPO3 Install Tool or
      :guilabel:`Admin Tools > Maintenance`

   .. rst-class:: horizbuttons-attention-m

   -  :ref:`Quick installation <quickInstallation>`

#. Add TypoScript setup:

   -  Include the RD Comments TypoScript constants and setup
      (via a static TypoScript template or the
      :guilabel:`Main TypoScript Rendering` record)
   -  This enables the default configuration and frontend rendering

   .. rst-class:: horizbuttons-attention-m

   -  :ref:`Quick configuration <quickConfiguration>`

#. Create initial content and connect to news:

   -  Set up the recommended page structure
   -  Add news records using :extension:`news`
   -  Ensure the comment section is rendered on the detail page

   .. rst-class:: horizbuttons-attention-m

   -  :ref:`Recommended page structure <quickPageStructure>`
   -  :ref:`Create news records <quickNewsRecords>`
   -  :ref:`Add the RD Comments plugin <quickAddPlugin>`

#. Create a comment:

   -  Enable commenting on the news detail page
   -  Frontend users can post comments and reply to existing ones

   .. rst-class:: horizbuttons-attention-m

   -  :ref:`Make a comment in frontend <FrontendRendering>`

.. toctree::
   :maxdepth: 5
   :titlesonly:
   :hidden:

   Installation
   Configuration
   CreateRecords
   FrontendRendering

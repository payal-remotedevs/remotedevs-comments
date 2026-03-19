.. _quickStart:

===========
Quick start
===========

.. rst-class:: bignums-tip

#. Install the extension:

   -  Install via Composer or place the extension in `typo3conf/ext/`

   .. code-block:: bash

      composer require remotedevs/rd-comments

   .. rst-class:: horizbuttons-attention-m

   -  :ref:`Quick installation <quickInstallation>`

#. Add TypoScript setup:

   -  Include the TypoScript constants and setup files
   -  This enables default configuration and frontend rendering

   .. rst-class:: horizbuttons-attention-m

   -  :ref:`Quick configuration <quickConfiguration>`

#. Create initial content and connect to news:

   -  Set up the recommended page structure
   -  Add `news` records using `EXT:news`
   -  Ensure the comment section is rendered on the detail view

   .. rst-class:: horizbuttons-attention-m

   -  :ref:`Recommended page structure <quickPageStructure>`
   -  :ref:`Create news records <quickNewsRecords>`
   -  :ref:`Add the RD Comments plugin <quickAddPlugin>`

#. Create a comment:

   -  Enable commenting on the news detail page
   -  Users can post comments and reply to existing ones

   .. rst-class:: horizbuttons-attention-m

   -  :ref:`Make a comment in frontend <FrontendRendering>`

---

.. toctree::
   :maxdepth: 5
   :titlesonly:
   :hidden:

   Installation
   Configuration
   CreateRecords
   FrontendRendering

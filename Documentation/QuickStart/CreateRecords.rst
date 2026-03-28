.. _CreateRecords:

==============================
Create initial content for news
==============================

.. _quickPageStructure:

Recommended page structure
==========================

To enable comments for news articles using `rd_comments`, use the following minimal structure:

* **Home** – Root page with TypoScript template included  
* **News List** – Page that displays a list of news articles  
* **News Detail & RD Comments plugin page** – Renders both the news article and the comment section  
* **Storage** – Folder to store both `news` and `comment` records

Example page tree:

.. code-block:: none

   Home
   ├── News List
   ├── News Detail & RD Comments plugin page
   └── Storage
       └── News & Comment Storage


.. _quickNewsRecords:

Create news records
===================

You must first create some news articles using the `EXT:news` extension.

.. image:: /Images/CreateRecords/CreateNewsRecord.png
   :alt: Create a news record
   :width: 600px
   :class: with-shadow

#. Go to the :guilabel:`Web > List` module  
#. Select the **News & Comment Storage** folder  
#. Click :guilabel:`Create new record` and choose :guilabel:`News`  
#. Fill in required fields such as **Title**, **Teaser**, and **Content**  
#. Click :guilabel:`Save`

Configure News Detail View
==========================

To display the full article on the detail page, add the **News Detail plugin** to the page.

.. image:: /Images/CreateRecords/AddNewsPluginDetail.png
   :alt: Add News Detail plugin
   :width: 600px
   :class: with-shadow

#. On the **News Detail** page, add a new content element
#. Select the :guilabel:`News Detail` plugin

Now assign the storage folder:

.. image:: /Images/CreateRecords/SetNewsStoragePage.png
   :alt: Set the News Storage Page UID
   :width: 600px
   :class: with-shadow

#. Under the :guilabel:`Plugin` tab:  
   - Set the **Starting Point / Storage Page** to your **News & Comment Storage** folder  
   - Click :guilabel:`Save`

.. _quickAddPlugin:

Add the RD Comments plugin
==========================

Add the RD Comments plugin to show the comment thread and form.

.. image:: /Images/CreateRecords/AddCommentPlugin.png
   :alt: Add RD Comments plugin to News Detail page
   :width: 600px
   :class: with-shadow

#. On the same **News Detail** page, add another content element: :guilabel:`RD Comments > Comments`

.. important::

   Both the **News Detail View** and **RD Comments** plugins must be placed on the **same page** for proper linking and display.


.. _quickPluginOptions:

Configure plugin options
========================

After adding the RD Comments plugin, open the :guilabel:`Plugin` tab to configure
date formatting and like behaviour for the frontend comment display.

.. image:: /Images/CreateRecords/AddFrontenddateandtime.png
   :alt: RD Comments plugin options — date format, time format, and like settings
   :width: 600px
   :class: with-shadow

**Custom Date Format**
   Enable this checkbox to override the date format set in TypoScript constants
   with the option selected directly on this plugin instance. When unchecked,
   the TypoScript constant value is used instead.

**Date Format**
   Controls how comment dates appear in the frontend. Choose one of:

   - ``F j, Y`` → May 26, 2017
   - ``Y-m-d`` → 2017-05-26 *(default)*
   - ``m/d/Y`` → 05/26/2017
   - ``d/m/Y`` → 26/05/2017

**Time Format**
   Controls how comment timestamps appear. Choose one of:

   - ``g:i a`` → 11:36 am *(default)*
   - ``g:i A`` → 11:36 AM
   - ``H:i`` → 11:36

**Like**
   Controls whether the like button is shown on comments:

   - **Show All Comments Like** — displays the like counter and button on every comment *(default)*
   - **Disable All Comments Like** — hides the like button across the entire page
   - **Selected News disable Like** — disables likes only for specific news articles
     (configure which articles in the field that appears below when this option is selected)

Click :guilabel:`Save` after making your selections.

.. note::

   Date and time format settings on the plugin instance only take effect when
   **Custom Date Format** is checked. Otherwise the values from
   ``plugin.tx_rdcomments_rdcomment.settings.dateFormat`` and
   ``plugin.tx_rdcomments_rdcomment.settings.timeFormat`` are used.
   See :ref:`admin-manual` for TypoScript reference.


Check the frontend
==================

When visiting the **News List** page in the frontend, you should see:

- A list of news articles
- Each article links to its corresponding detail view
- The detail page shows the article and a threaded comment section below

For layout and styling customisation, see the :ref:`FrontendRendering` section.
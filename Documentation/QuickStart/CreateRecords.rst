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

To display the full article on the detail page, configure the **News plugin** for Detail view.

.. image:: /Images/CreateRecords/AddNewsPluginDetail.png
   :alt: Add News plugin for Detail View
   :width: 600px
   :class: with-shadow

#. On the **News Detail** page, add a new content element: :guilabel:`News Plugin`  
#. In the plugin settings, choose :guilabel:`Detail view` as the **What to display** option

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

.. image:: /Images/CreateRecords/StorageSelection.png
   :alt: Select Comment Storage Folder
   :width: 600px
   :class: with-shadow

#. In the plugin settings:  
   - Set the **Record Storage Page** to the **News & Comment Storage**

.. important::

   Both the **News Detail View** and **RD Comments** plugins must be placed on the **same page** for proper linking and display.


Check the frontend
==================

When visiting the **News List** page in the frontend, you should see:

- A list of news articles
- Each article links to its corresponding detail view
- The detail page shows the article and a threaded comment section below

For layout and styling customization, see the :ref:`FrontendRendering` section.

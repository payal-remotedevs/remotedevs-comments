.. _rdCommentsModule:

RD Comments Module
==================

The **RD Comments** backend module provides editors and administrators with a streamlined interface to manage all comments submitted via the frontend. This includes viewing, replying, moderating, and deleting user comments directly from the TYPO3 backend.

Accessing the module
--------------------

To open the RD Comments module:

1. Log into the TYPO3 backend.
2. In the left-hand sidebar, locate and click on **News Comments**.
3. The module will open a dedicated interface listing all the comments stored in the system.

Initial state (no comments)            
---------------------------

When there are no comments associated with any news records, the module will display `No news items found with comments`. It confirms that the module is working but no data has been submitted yet.

.. image:: /Images/UsersManual/NoCommentsView.png
   :alt: Empty RD Comments module view
   :class: shadow mb-4
   :width: 100%

*This is how the module will render if no comments are available for any news records.*

Commented state (with data)
---------------------------

When comments exist, the module displays a structured list of news records that contain comments. Each news record section can be expanded to view associated comments.

.. image:: /Images/UsersManual/WithCommentsView.png
   :alt: RD Comments module view with threaded comments
   :class: shadow mb-4
   :width: 100%

- News records are listed in the left sidebar or collapsible sections.
- Comments are shown in a threaded structure under each news record.

Each news block represents a news item that has at least one comment. These blocks are **ordered by the most recently commented news first**, meaning the news record with the latest user interaction appears at the top.

The **title of each block** displays:

- The **news title**, so editors can easily identify the article.
- The corresponding **UID** of the news record, helping to cross-reference it with other backend modules.

Each individual comment entry includes:

- The **commenter's name and email** (if available)
- The **comment content**
- The **reply button**
- The **delete button**
- The **timestamp** on the right-hand side showing **when the comment was posted**

⚙️ The **date and time format** displayed here is based on the following TypoScript constants:

You can modify these formats in your `constants.typoscript` or via the **Constant Editor** to suit your preferred regional or display format but it will render only in frontend not in backend module.

Database Storage
----------------

All comments managed in this module are stored in the `tx_rdcomments_domain_model_comment` table. Threaded relationships are managed via:

- `parent`: points to the UID of the parent comment (for replies)
- `pid`: indicates the storage folder used

Next Steps
----------

- Learn how comment threads are displayed and managed: :ref:`Comment threading and nesting <commentThreading>`
- Understand how action buttons work: :ref:`Reply & Delete buttons <commentActions>`

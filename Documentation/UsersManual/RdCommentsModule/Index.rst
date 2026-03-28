.. _rdCommentsModule:

RD Comments Module
==================

The **RD Comments** backend module provides editors and administrators with a
streamlined interface to manage comments submitted via the frontend. This
includes viewing, replying to, moderating, and deleting user comments directly
from the TYPO3 backend.

Accessing the module
--------------------

To open the RD Comments module:

#. Log in to the TYPO3 backend.
#. In the left-hand navigation, locate and click **News Comments**.
#. The module opens a dedicated interface listing news records that contain
   comments.

Initial state (no comments)
---------------------------

When no comments exist for any news records, the module displays the message
``No news items found with comments``. This indicates that the module is working
correctly, but no comments have been submitted yet.

.. image:: /Images/UsersManual/NoCommentsView.png
   :alt: Empty RD Comments module view
   :class: shadow mb-4
   :width: 100%

*This is how the module appears when no comments are available.*

Commented state (with data)
---------------------------

When comments exist, the RD Comments backend module displays a list of news
records that contain comments.

Each news record is shown as a card in the **News Management** view, including
basic information such as the news title, teaser text, publication date, and
the UID of the news record. Editors can open a news record to review and manage
its associated comments.

.. image:: /Images/UsersManual/WithCommentsView.png
   :alt: RD Comments backend module showing news records with comments
   :class: shadow mb-4
   :width: 100%

- News records with comments are displayed as cards in the backend module.
- Each card indicates the number of comments associated with the news record.
- Clicking a card allows moderators to review, reply to, or delete comments.

Each news card represents a news item that has at least one comment. The cards
are **ordered by the most recently commented news first**, so the news record
with the latest user interaction appears at the top.

The **title area of each card** displays:

- The **news title**, allowing editors to easily identify the article
- The corresponding **UID** of the news record for backend reference

.. note::

   The date and time displayed in the backend module follow TYPO3’s backend
   localization and are **not affected by frontend TypoScript date format
   constants**.

Database storage
----------------

All comments managed in this module are stored in the
``tx_rdcomments_domain_model_comment`` database table.

Threaded relationships are handled using the following fields:

- ``parent``: References the UID of the parent comment (used for replies)
- ``pid``: Defines the storage folder where the comment record is stored

Next steps
----------

- Learn how comment threads are rendered: :ref:`Comment threading and nesting <commentThreading>`
- Understand how moderation actions work: :ref:`Reply & Delete buttons <commentActions>`

.. _commentThreading:

Comment Threading and Nesting
=============================

This section explains how comments and replies are rendered in the RD Comments backend module using a threaded, yet visually flat, structure.

Overview
--------

Each comment is displayed under the news item it belongs to. If a comment is a reply to another, it is shown directly below its parent. While the backend doesn't use visual indentation for nesting, it clearly indicates the reply chain through labeling.

Threading supports **infinite depth**, and parent-child relationships are preserved even in a flat layout.

Rendering Structure
-------------------

Unlike traditional threaded views, the RD Comments module uses a **flat structure**. Replies appear beneath their parent comment with slight variation based on the reply level:

+------------------+---------------------------------------------------------+-------------------------------------------------------------------------+
| **Level**        | **Rendered As**                                         | **Example**                                                             |
+==================+=========================================================+=========================================================================+
| Level 0 (Root)   | Main comment under the news item                        | John Doe: "Great update!"                                               |
+------------------+---------------------------------------------------------+-------------------------------------------------------------------------+
| Level 1 (Reply)  | Flat reply (no `Replied by:` label)                     | Lisa Smith: "I agree! Especially the new admin panel."                  |
+------------------+---------------------------------------------------------+-------------------------------------------------------------------------+
| Level 2+ (Reply) | Flat reply with `Replied by:` label showing replier’s   | Lisa Smith Replied by: Mark Lee: "Me too!"                              |
|                  | name                                                    |                                                                         |
+------------------+---------------------------------------------------------+-------------------------------------------------------------------------+

Each comment block includes:
- Commenter's name and email
- `Replied by:` label (for replies beyond the first level), showing the name of the user who replied
- Message content
- Action buttons (Delete, Show Replies, Hide Replies)

Visual Hierarchy Example
------------------------

.. code-block:: text

  UID: 123 — News Title: "TYPO3 12 Released"

    • John Doe (john@example.com)
      "This update is fantastic!"

    • Lisa Smith (lisa@example.com)
      "I agree! Especially the new admin panel."

    • Lisa Smith Replied by: Mark Lee (mark@example.com)
      "Same here. Although I had some upgrade issues."

    • Mark Lee Replied by: Admin (admin@typo3.org)
      "Hi Mark, please refer to the migration guide."

    • John Doe Replied by: Tom Ray (tom@example.com)
      "The UX improvements are really helpful."

  UID: 124 — News Title: "TYPO3 Migration Tips"

    • Alice Grey (alice@example.com)
      "Will this be compatible with all existing extensions?"

    • Alice Grey Replied by: Dev Team (devs@typo3.org)
      "Most of them, yes. A compatibility list is available."

Visual Threading Example 
-------------------------

Below is a real screenshot of how threaded comments are displayed inside the backend module:

.. image:: ../Images/UsersManual/CommentThreading.png
   :alt: Example of threaded comment structure in RD Comments module
   :class: shadow mb-4
   :width: 100%

This visual shows:
- Flat rendering of root comments and their replies
- The `Replied by:` label that clearly connects child to parent comment
- Grouping under each news title and UID for better context

Key UI Behavior
---------------

- Comments are grouped under their respective news records.
- Only **nested replies beyond the first level** display the `Replied by:` label (from parent to replier).
- The layout remains flat — there is no indentation for child comments.
- Replies can be toggled using **Show/Hide Replies** buttons.
- Comments are sorted chronologically within their thread (newest first).
- The **Delete** button allows moderators to remove any comment, including replies.

Next Steps
----------

- For detailed behavior of action buttons, see: :ref:`Show, Hide & Delete buttons <commentActions>`
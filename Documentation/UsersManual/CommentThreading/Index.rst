.. _commentThreading:

Comment Threading and Nesting
=============================

This section explains how comments and replies are rendered and managed in the
**RD Comments backend module**. The module supports **infinite-depth threading**
while keeping the interface intentionally **flat and moderation-friendly**.

Overview
--------

Comments are always grouped under the **news record** they belong to.
Each comment can have replies, and replies can themselves have further replies
without any depth limitation.

The backend module provides **two complementary views**:

1. **Main Comments View** – displays all comments for a news record in a flat list
2. **Reply View** – displays a focused thread with a parent comment and its replies

Both views preserve parent–child relationships **without visual indentation**.

Main Comments View
------------------

In the main comments view, all comments related to a news record are displayed
together as individual cards.

- Root comments and replies are rendered in a **flat structure**
- Replies appear directly below their parent comment
- No visual indentation is used
- Relationships are implied by grouping and interaction, not nesting

Threading supports **infinite depth**, even though the layout remains flat.

Each comment card includes:
- Commenter name and avatar
- Date and time
- Comment content
- Like counter
- Action buttons (**Delete**, **Show Replies**)

.. image:: /Images/UsersManual/Comment.png
   :alt: Main comments view in RD Comments backend module
   :class: shadow mb-4
   :width: 100%

Reply View (Focused Thread View)
--------------------------------

When an editor clicks **Show Replies** on a comment, the module switches to a
**focused reply view**.

This view isolates a single comment thread and displays:

- The **parent comment** at the top
- All its **direct replies** below it

The parent comment is visually emphasized using:
- A highlighted background
- A vertical accent border
- Removal of the delete button to prevent accidental deletion

.. image:: /Images/UsersManual/CommentThreading.png
   :alt: Focused reply view in RD Comments backend module
   :class: shadow mb-4
   :width: 100%

Replies Rendering
-----------------

Replies are displayed as individual comment cards beneath the parent comment.

Each reply includes:
- Commenter name
- Date and time
- Comment message
- Like counter
- **show Replies** button for nested replies
- **Delete** button for moderators

The layout remains flat:

- No indentation is applied
- Only replies belonging to the selected parent are shown
- Nested replies are also displayed and include their own **Show Replies** button

Visual Reply Example
--------------------

.. code-block:: text

  Parent Comment (Highlighted)
  ----------------------------
  RD Admin
  "This article was very helpful. Thanks for sharing!"

    • karan
      "I agree with abhay — the explanation is clear and easy to follow."

UI Behavior
-----------

- The **Back** button returns to the main comments view
- The parent comment remains fixed at the top for context
- Replies are sorted chronologically
- Like counters are visible but read-only
- Moderators can delete replies individually

Key Design Principles
---------------------

- Flat layout improves readability for large comment volumes
- Infinite-depth threading without visual clutter
- Clear parent–child relationships through focused views
- Optimized for moderation rather than deep discussion nesting

Next Steps
----------

- Learn how moderation actions work:
  :ref:`Show, Hide & Delete buttons <commentActions>`

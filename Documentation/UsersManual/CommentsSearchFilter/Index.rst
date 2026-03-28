.. _commentsSearchFilter:

Search & Filter Functionality
=============================

The **RD Comments backend module** provides built-in **search and filtering tools**
to help editors quickly locate news records, comments, and replies — even in
large datasets. All search actions work **instantly without page reloads**.

News Search
-----------

In the **News Management** view, a global **search field** is available at the top.

Search behavior:

- Searches across all visible **news cards**
- Matches content from:
  - News UID
  - News title
  - Teaser text
  - Publication date and time
- Results update immediately as you type
- No filters are available for the News view

Displayed fields in each news card:

- News UID
- News title
- Teaser
- Date and time
- Comment count (if available)

This keeps the News view intentionally simple and focused on discovery.

Comments Search & Filters
-------------------------

Inside a selected news record, the **Comments view** provides both **search** and
**filtering options**.

Search behavior:

- Works exactly the same as News search
- Searches across:
  - Comment UID
  - Comment author name
  - Comment content
  - Comment date and time
- Results update instantly without page reload

Filter options:

Editors can narrow results using the following filters:

- **All Comments**
  - Displays every comment for the selected news record
- **Pinned Comments**
  - Shows only comments that are currently pinned
- **Recent Comments**
  - Displays comments sorted by most recent activity

Search and filters work together, allowing precise moderation control.

Replies Search
--------------

In the **Reply View**, a dedicated search field is available.

Reply search behavior:

- Same functionality as News and Comments search
- Matches:
  - Reply UID
  - Reply author name
  - Reply content
  - Reply date and time
- No filters are available in this view
- Designed for quick lookup within focused discussion threads

The absence of filters keeps the reply interface clean and context-driven.

Key Characteristics
-------------------

- Unified search behavior across News, Comments, and Replies
- No page reloads — all actions are AJAX-based
- Filters are available **only where they add value**
- Optimized for fast moderation and large comment volumes

Summary
-------

- **News**: Search only (no filters)
- **Comments**: Search + filters (All, Pinned, Recent)
- **Replies**: Search only (no filters)

Next Steps
----------

- Learn how comments are structured:
  :ref:`Comment Threading and Nesting <commentThreading>`
- Review moderation actions:
  :ref:`Show Replies, Delete & Pin Actions <commentActions>`

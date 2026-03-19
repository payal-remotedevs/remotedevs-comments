.. _commentsListReadonly:

List Module View for Comments (Read-Only)
=========================================

.. attention::

   In order for the RD Comments to render and be accessible in both the frontend and backend modules,
   you **must configure the correct storage page UID** in your TypoScript constants.

   Example::

     plugin.tx_rdcomments.persistence.storagePid = 123

   If this is not set correctly, the comment records will **not appear** in the module or List view.

Overview
--------

In addition to the custom RD Comments backend module, all submitted comments are stored as TYPO3 records and are accessible in the **List module**. This module provides a direct way to **review, hide, or unhide** comments in a traditional list view, especially for bulk actions or auditing.

Accessing the List Module
-------------------------

To view RD Comments in the List module:

1. Log into the TYPO3 backend.
2. From the left navigation pane, select the **List** module.
3. Navigate to and click on the **storage folder** where your RD Comments records are stored.
4. You will see a list of all comment records associated with the news items.

Moderation via Visibility
-------------------------

Unlike the RD Comments module, the List module does **not provide threaded interaction**. However, it has a powerful feature for moderation: the **visibility toggle**.

- Each comment record has a **"Visibility" (hidden)** toggle field.
- You can **hide** a comment instead of deleting it.
- Hidden comments are not rendered on the frontend and **do not appear** in the RD Comments module view.
- The comment remains in the database and can be **restored** by simply unchecking the "hidden" box.

.. image:: ../Images/UsersManual/ListModuleComments.png
   :alt: Comment records shown in the TYPO3 List module with visibility toggle
   :class: shadow mb-4
   :width: 100%

This is especially helpful when:
- You want to **temporarily remove** inappropriate or spam content without losing conversation context.
- You need a **reversible moderation option**.
- Editors want to review or revise content before making it public again.

Displayed Fields
----------------

The List module view shows key details of each comment:

.. image:: ../Images/UsersManual/commentdetails.png
   :alt: The List module view for RD Comments showing comment details
   :class: shadow mb-4
   :width: 100%

- Author name and email
- Comment content
- term acceptance status
- Parameter link to the related comment (for threaded discussions)
- If the comment is a root comment (not a reply), it will also list its **replies** in read-only format beneath it.

Replies Rendering in Read-Only View
-----------------------------------

When a root comment (i.e., not a reply) is selected in the List module, the system also displays its associated **nested replies** in a grouped, read-only format.

This gives administrators a complete view of the discussion thread without requiring navigation to the RD Comments module.

.. image:: ../Images/UsersManual/ReadonlyRepliesInListModule.png
   :alt: Nested replies shown beneath a root comment in read-only List module view
   :class: shadow mb-4
   :width: 100%

This feature is helpful for:

- Viewing **full conversation threads** at a glance.
- Making moderation decisions based on reply context.
- Auditing comment activity from a single entry point.

Use Cases
---------

- **Moderate without delete**: Hide a comment for review without erasing it permanently.
- **Restore** hidden content easily by unchecking the hidden box.
- **Audit comment chains** using parent-child references in the `parent` field.

Best Practices
--------------

- Prefer **hiding** over deleting when moderation is temporary.
- Always double-check the **storage folder path** for consistency.
- Set permissions appropriately so only trusted users can modify visibility in this view.

Next Steps
----------

- Return to: :ref:`RD Comments module <rdCommentsModule>`
- Review available moderation tools: :ref:`Show, Hide & Delete buttons <commentActions>`
- Understand comment relationships: :ref:`Comment Threading and Nesting <commentThreading>`
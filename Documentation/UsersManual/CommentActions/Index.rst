.. _commentActions:

Show, Hide & Delete Buttons
===========================

This section explains the action buttons available in the RD Comments backend module and how editors can interact with comments and their replies.

Available Actions
-----------------

Each comment block in the backend includes a set of intuitive action buttons that allow moderators and editors to manage discussion threads.

+----------------------+--------------------------------------------------------------+
| **Action**           | **Description**                                              |
+======================+==============================================================+
| **Show Replies**     | Reveals all direct and nested replies under this comment.    |
|                      | Helps follow the conversation thread.                        |
+----------------------+--------------------------------------------------------------+
| **Hide Replies**     | Collapses the displayed replies to reduce visual clutter.    |
+----------------------+--------------------------------------------------------------+
| **Delete**           | Permanently removes the comment and all its replies from     |
|                      | the backend view. In the database, a soft-delete is applied. |
+----------------------+--------------------------------------------------------------+

Behavior Details
----------------

- **Show Replies** toggles the visibility of all replies under a comment without reloading the page.
- **Hide Replies** collapses visible replies for better focus.
- When a comment is deleted:
  - A **flash message** appears at the top:  
    **“Comment deleted successfully.”**
  - The comment is **immediately removed from the backend**, along with all of its nested replies.
  - In the database:
    - The `deleted` field in the `tx_rdcomments_domain_model_comment` table is set to `1`
    - This applies recursively to all nested replies of the deleted comment.
  - There is **no "Deleted" label** or placeholder — the entire thread is removed from view.

Visual Example
--------------

.. image:: /Images/UsersManual/CommentActions.png
   :alt: Action buttons in RD Comments backend
   :class: shadow mb-4
   :width: 100%

In this example:
- The **Show Replies** button reveals replies to the comment.
- The **Hide Replies** button collapses them again.
- The **Delete** button removes the entire comment thread from the interface.

Flash Message Notification
--------------------------

After a comment (and its replies) are deleted, the RD Comments module displays a confirmation message at the top of the screen.

.. image:: /Images/UsersManual/FlashMessage.png
   :alt: Flash message shown after successful comment deletion
   :class: shadow mb-4
   :width: 100%

- This message confirms the deletion action with the text:  
  **“Comment deleted successfully.”**
- It appears only once per delete operation and automatically disappears after reloading the page.

Best Practices
--------------

- Use **Show/Hide Replies** to manage complex threads during moderation.
- Be cautious with **Delete**, as it removes the entire comment thread, including replies.

Next Steps
----------

- Return to: :ref:`RD Comments module overview <rdCommentsModule>`
- Review how comment threads are displayed: :ref:`Comment Threading and Nesting <commentThreading>`

.. _commentActions:

Show Replies, Delete & Pin Actions
=================================

This section explains the action buttons available in the **RD Comments backend
module** and how editors can manage comments and their replies efficiently.

Available Actions
-----------------

Each comment card in the backend provides quick action buttons for moderation.

+------------------+--------------------------------------------------------------+
| **Action**       | **Description**                                              |
+==================+==============================================================+
| **Show Replies** | Opens a focused view showing the selected comment and all    |
|                  | of its related replies.                                      |
+------------------+--------------------------------------------------------------+
| **Pin / Unpin**  | Pins or unpins a comment to control its visibility order.   |
+------------------+--------------------------------------------------------------+
| **Delete**       | Removes the comment and all of its replies from the backend  |
|                  | view using a soft-delete mechanism.                          |
+------------------+--------------------------------------------------------------+

Behavior Details
----------------

Show Replies
~~~~~~~~~~~~

- Opens the **Reply View**, displaying the parent comment and its replies
- Nested replies remain accessible within the same view
- No page reload is required

Delete Comment
~~~~~~~~~~~~~~

- Clicking Delete does not immediately remove the comment and its replies. A confirmation dialog is displayed before the action is completed.
- The entire comment thread disappears instantly from the backend interface after confirming the deletion in the confirmation dialog.
- No page reload is required

.. image:: /Images/UsersManual/DeleteNotification.png
   :alt: dialog box shown after delete action
   :class: shadow mb-4
   :width: 100%

After deletion:

- A notification appears on the **right side** of the screen:

  **“Comment deleted successfully.”**

Pin / Unpin Comment
~~~~~~~~~~~~~~~~~~~

- Clicking the **Pin** icon toggles the pinned state of a comment
- The action is applied instantly **without page reload**

Notifications shown:

- If a comment is pinned:

  **“Comment pinned successfully.”**

- If a comment is unpinned:

  **“Comment unpinned successfully.”**

These notifications appear on the **right side** of the screen and disappear
automatically.

.. image:: /Images/UsersManual/PinNotification.png
   :alt: Notification shown after pin or unpin action
   :class: shadow mb-4
   :width: 100%

Visual Example
--------------

.. image:: /Images/UsersManual/CommentActions.png
   :alt: Action buttons in RD Comments backend module
   :class: shadow mb-4
   :width: 100%

In this example:

- **Show Replies** opens the reply view
- **Pin / Unpin** toggles the pinned state of the comment
- **Delete** opens a confirmation dialog before removing the entire comment thread

Best Practices
--------------

- Use **Pin** to highlight important or moderated comments
- Use **Show Replies** to review long or nested discussions
- Use **Delete** carefully, as it removes the entire thread, including replies

Next Steps
----------

- Learn about search and filtering:
  :ref:`RD Comments search <commentsSearchFilter>`
- Learn about thread structure:
  :ref:`Comment Threading and Nesting <commentThreading>`

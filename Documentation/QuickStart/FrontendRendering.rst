.. _FrontendRendering:

=============================
Frontend rendering of comments
=============================

Once you've added both the **News detail plugin** and the **RD Comments plugin** on the same page and linked the correct storage folder, the comment section is automatically rendered below the news article.

What appears on the frontend
============================

After everything is set up, visiting a news detail page will show:

- A **comment form** allowing users to post new comments or reply to existing ones
- A **threaded comment display** showing all comments related to the news article, including replies (if any exist)

.. image:: /Images/FrontendRendering/CommentForm.png
   :alt: Comment submission form
   :width: 600px
   :class: with-shadow
   
.. image:: /Images/FrontendRendering/CommentThread.png
   :alt: Display of threaded comments
   :width: 600px
   :class: with-shadow

No additional configuration is required for this output to appear. The extension automatically connects each comment to the currently displayed news article.

.. note::

   The comments will only appear if both plugins are present on the same page and a valid news record is selected.

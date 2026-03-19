.. _developer-notes:

Developer Notes
===============

This section provides technical notes for developers and integrators working with the RD Comments extension.

Before You Begin
----------------

To ensure the extension functions correctly, please review the following requirements and preparations:

- ✅ **Storage Page**:  
  Set the `plugin.tx_rdcomments_rdcomment.persistence.storagePid` constant. Without this, comments will not be stored or displayed.

- ✅ **Include jQuery (if needed)**:  
  If your site doesn't already include jQuery, make sure it's available globally before the comment script loads. RD Comments does **not** auto-include jQuery anymore.

- ✅ **Terms & Conditions** (optional):  
  If `termsRequired` is enabled, configure `termsTypolinkParameter` to avoid broken links on the frontend.

- ✅ **Frontend Plugin**:  
  Place the **RD Comments Plugin** on the desired detail pages (e.g., news or blog detail). Otherwise, the comment form and threads won't appear.

What You Can Customize
-----------------------

The extension supports full frontend customization using Fluid templates. You can override these paths in your SitePackage:

+------------------------------------------------------------+----------------------------------------------------------+
| **Constant**                                               | **Purpose**                                              |
+============================================================+==========================================================+
| `plugin.tx_rdcomments_rdcomment.view.templateRootPath`     | Override full views (e.g., `Comment/List.html`)          |
+------------------------------------------------------------+----------------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.view.partialRootPath`      | Override UI blocks (e.g., reply form or metadata)        |
+------------------------------------------------------------+----------------------------------------------------------+
| `plugin.tx_rdcomments_rdcomment.view.layoutRootPath`       | Override HTML wrapper/layout structure                   |
+------------------------------------------------------------+----------------------------------------------------------+

Fluid View Inheritance
----------------------

If you override **only specific templates**, be sure to **copy the necessary partials or layouts** that your custom template depends on. For example:

- If you override `Comment/List.html`, make sure `Comment/Item.html` and any related partials still exist or are overridden as needed.

Template Tips
-------------

- The default templates use Bootstrap 5 classes and Font Awesome.
- The comment thread is **recursively rendered** via a partial loop in frontend .
- Font Awesome icons are only included if you configure it yourself (the extension doesn't load them automatically anymore).

Styling and Script Integration
------------------------------

The RD Comments extension relies on specific CSS and JavaScript logic to render and handle the comment interface. If you're planning to **customize or override the frontend design**, keep the following in mind:

⚠️ **Do not remove the JS/CSS configurations blindly** — doing so will break the functionality (e.g., the comment box will not appear or reply toggles will not work).

### What You Should Do

- ✅ **Customize with care**:

  You can override the visual design of the comment system, but be extremely cautious not to disrupt required structural elements.

- ✅ **Keep all functional class names unchanged**:

  Do **not** remove or rename classes from the original HTML structure. These classes are used by JavaScript to toggle replies, render nested forms, animate scroll behavior, and control button states.

### Summary

If you're modifying the design of the comments section:

- **Don't strip or rename HTML classes**, as they are tied to JavaScript functionality
- Avoid removing JS/CSS unless you've completely reimplemented all required behavior
- Make sure reply toggling, nested form rendering, and scroll behaviors work as expected
- Always test your changes across devices and languages to maintain full frontend compatibility

Best Practices
--------------

- Use TypoScript constants to override paths — don’t modify core extension files.


$(function() {
    submitComment();
    hashValue();
    onFocusValidation();
    let $parentCommentId = '';
    replyComment();
});

function replyComment() {
    $(document).on("click", '.comment-btn.reply', function(event) {
        const parentCommentId = $(this).parent().attr('id');
        $('#' + parentCommentId + ' .comment-btn.reply').hide();
    });
}

// Scroll to paramlink
function hashValue() {
    const hash = window.location.hash;
    if (hash != '') {
        $('html, body').stop().animate({
            scrollTop: ($(hash).offset().top)
        }, 2000);
    }
}

// Submit form using ajax
function submitComment() {
    $(document).on('submit', '.tx_newscomments #comment-form', function(event) {
        event.preventDefault();
        const $form = $(this);
        const ajaxURL = $form.attr('action');
        const dataType = $('.tx_newscomments #dataType').val() || 'json';
        const $submitBtn = $('.tx_newscomments #submit');
        if (!validateField()) {
            return false;
        }
        $.ajax({
            type: 'POST',
            url: ajaxURL,
            dataType: dataType,
            data: $form.serialize(),
            beforeSend: function() {
                $submitBtn.prop('disabled', true).css('cursor', 'not-allowed');
            },
            success: function(response) {
            let responseData;
            try {
                responseData = typeof response === 'string' ? JSON.parse(response) : response;
            } catch (e) {
                // console.error("Invalid JSON:", e);
                alert("Unexpected server response.");
                return;
            }

            $(".tx_newscomments #comments-list").load(location.href + " .tx_newscomments #comments-list>*", function(responseTxt, statusTxt, jqXHR) {
                if (statusTxt === "success") {
                    $.each(responseData, function(key, val) {
                        const $msgBox = val.parentId == 0
                            ? $('.tx_newscomments .thanksmsg')
                            : $('.tx_newscomments .thanksmsg-' + val.parentId);

                        $msgBox.show();
                        $('html, body').animate({
                            scrollTop: $msgBox.offset().top
                        }, 250);

                        setTimeout(() => {
                            $msgBox.fadeOut("slow");
                        }, 5000);

                        if (val.parentId > 0) {
                            $('.tx_newscomments #comments-' + val.parentId).fadeIn('slow');
                            $('.tx_newscomments #parentId').val('');
                        }

                        if (val.depth >= 6) {
                            const commentId = val.parentId || key;
                            const $comment = $('.tx_newscomments #comments-' + commentId);
                            $comment.find('.comment-btn.reply').hide();
                        }
                    }); 
                    // 🔄 Reload page after 1 seconds
                    $form[0].reset();
                        setTimeout(() => {
                            location.reload();
                    }, 1800);
                } else {
                    alert("Error loading comments list: " + jqXHR.status + " " + jqXHR.statusText);
                }
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("AJAX error:", textStatus, errorThrown);
                // alert("Something went wrong: " + textStatus);
            },
            complete: function() {
                $submitBtn.prop('disabled', false).css('cursor', 'pointer');
            }
        });
    });

    $(document).on("click", ".reply", function(event) {
        const parentCommentId = $(this).parent().attr('id');
        $(this).siblings('.like').hide();

        const commentHTML = $('.active-comment-form').html();
        $('.active-comment-form .comment-form')[0].reset();
        $('.active-comment-form').html('');
        $('.active-comment-form').removeClass('active-comment-form');
        $(this).siblings('.reply-form').append(commentHTML);
        $('#comment-form-close-btn').show();
        removeDefaultValidation();
        $(this).siblings('.reply-form').addClass('active-comment-form');

        $('.active-comment-form #submit')
            .removeClass('rd-btn-send')
            .addClass('rd-btn-reply');
        $('.active-comment-form .text-muted').remove();
        $('.rd-comment-likes-count').remove();
        $('.comment-btn.show').remove();

        $('html, body').stop().animate({
            scrollTop: ($('.tx_newscomments #reply-form-' + parentCommentId).offset().top)
        }, 1000);

        $('.tx_newscomments #parentId').val(parentCommentId);
        onFocusValidation();
    });

    $(document).on('click', '#comment-form-close-btn', function () {
        $(this).closest('.reply-form').prev().show();
        $(this).closest('.reply-form').empty();
        $('.tx_newscomments #parentId').val('');
        closeReplyForm();
        $(this).closest('.rd-comment-likes-count').prev().show();
        $('.tx_newscomments #comment-form')[0]?.reset();
            // 🔄 Reload page after 1 seconds
            setTimeout(() => {
                location.reload();
        }, 50);
    });
}

// like comment using Ajax
$(document).on('click', '.comment-btn.like', function(e) {
    e.preventDefault();

    // Grab the URL that includes `type=1730800496`
    let likeAjaxUrl = $('.comments-container').data('like-url');
    // Remove action param from URL if it's included
    likeAjaxUrl = likeAjaxUrl.replace(/([&?])tx_rdcomments_rdcomment\[action\]=[^&]*/g, '');

    const commentId = $(this).closest('.comment-footer').attr('id');
    const $icon     = $(this).find('i');
    const isLiked   = $icon.hasClass('rd-icon-liked');
    const action    = isLiked ? 'unlike' : 'like';
    
    // Toggle the icon immediately (optional UX improvement)
     $icon.toggleClass('rd-icon-liked rd-icon-like');

        $.ajax({
            url: likeAjaxUrl,
            method: 'POST',
            dataType: 'json',
            data: {
            'tx_rdcomments_rdcomment[commentId]': commentId,
            'tx_rdcomments_rdcomment[action]': 'like', // always call likeAction
            'tx_rdcomments_rdcomment[userAction]': action, // real intent: like or unlike
            'tx_rdcomments_rdcomment[controller]': 'Comment'
            },
            success: function(response) {
            if (response.success) {
                const message = action === 'like'
                ? '✅ You liked the comment!'
                : '❎ You unliked the comment!';
                // alert message for like/unlike action
                // You can use a custom alert or toast notification here
                // alert(message);
                setTimeout(() => {
                    location.reload();
                }, 50);
            } else {
                alert('Failed to update like: ' + (response.error || 'Unknown error'));
                // If something went wrong, revert the icon
                $icon.toggleClass('rd-icon-liked rd-icon-like');
            }
            },
            error: function(jqXHR, textStatus, errorThrown) {
            // Revert the icon if it was toggled
            $icon.toggleClass('rd-icon-liked rd-icon-like');
            alert('AJAX error: ' + textStatus);
            }
        });
});

// Store original comment order
let originalCommentsHTML = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const commentsList = document.getElementById('comments-list');
  originalCommentsHTML = commentsList.innerHTML;
});

// Filter comments by search term
function searchComments() {
  // Get search input
  const searchBox = document.getElementById('searchBox');
  if (!searchBox) return;

  const input = searchBox.value.toLowerCase().trim();

  // Get comments list
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;

  // Get read-more-comments button and hide it
  const readMoreBtn = document.getElementById('read-more-comments');
  if (readMoreBtn) {
    readMoreBtn.style.display = 'none';
  }

  // Check mostLikedBtn
  const mostLikedBtn = document.getElementById('mostLikedBtn');

  // Restore original order if search is empty
  if (!input) {
    if (typeof originalCommentsHTML !== 'undefined') {
      commentsList.innerHTML = originalCommentsHTML;
      if (mostLikedBtn) mostLikedBtn.classList.remove('active');
      // Ensure read-more-comments button remains hidden after reset
      if (readMoreBtn) readMoreBtn.style.display = 'none';
    }
    return;
  }

  // Get all comments
  const comments = Array.from(commentsList.querySelectorAll('.comment'));
  if (comments.length === 0) return;

  const isUsernameSearch = input.startsWith('@');

  // Hide all comments and reply lists initially
  comments.forEach((comment) => {
    comment.style.display = 'none';
  });
  const replyLists = commentsList.querySelectorAll('.reply-list');
  replyLists.forEach((list) => {
    list.style.display = 'none';
  });

  // Process each comment
  comments.forEach((comment) => {
    const commentId = comment.id.replace('comments-', '');
    const contentElement = comment.querySelector('.comment-content');
    const usernameElement = comment.querySelector('.comment-username strong');
    
    const content = contentElement ? contentElement.textContent.toLowerCase().trim() : '';
    const username = usernameElement ? usernameElement.textContent.toLowerCase() : '';
    
    let match = false;
    if (isUsernameSearch) {
      const searchUsername = input.substring(1);
      match = username.includes(searchUsername);
    } else {
      match = content.includes(input);
    }

    if (match) {
      comment.style.display = 'block';

      // Show all parent comments and their reply lists
      let currentList = comment.closest('.reply-list');
      while (currentList) {
        currentList.style.display = 'block';
        
        const parentComment = currentList.closest('.comment');
        if (parentComment) {
          const parentId = parentComment.id.replace('comments-', '');
          parentComment.style.display = 'block';
          
          const toggleBtn = document.querySelector(`.comment-btn.show[data-comment-id="${parentId}"]`);
          if (toggleBtn) {
            toggleBtn.classList.add('open');
            toggleBtn.textContent = 'Hide Replies';
          }
        }
        
        // Move up to the next parent reply list
        currentList = currentList.parentElement.closest('.reply-list');
      }
    }
  });
}

// function searchComments() {
//   // Get search input
//   const searchBox = document.getElementById('searchBox');
//   if (!searchBox) return;

//   const input = searchBox.value.toLowerCase().trim();

//   // Get comments list
//   const commentsList = document.getElementById('comments-list');
//   if (!commentsList) return;

//   // Check mostLikedBtn
//   const mostLikedBtn = document.getElementById('mostLikedBtn');

//   // Restore original order if search is empty
//   if (!input) {
//     if (typeof originalCommentsHTML !== 'undefined') {
//       commentsList.innerHTML = originalCommentsHTML;
//       if (mostLikedBtn) mostLikedBtn.classList.remove('active');
//     }
//     return;
//   }

//   // Get all comments
//   const comments = Array.from(commentsList.querySelectorAll('.comment'));
//   if (comments.length === 0) return;

//   const isUsernameSearch = input.startsWith('@');

//   // Hide all comments and reply lists initially
//   comments.forEach((comment) => {
//     comment.style.display = 'none';
//   });
//   const replyLists = commentsList.querySelectorAll('.reply-list');
//   replyLists.forEach((list) => {
//     list.style.display = 'none';
//   });

//   // Process each comment
//   comments.forEach((comment) => {
//     const commentId = comment.id.replace('comments-', '');
//     const contentElement = comment.querySelector('.comment-content');
//     const usernameElement = comment.querySelector('.comment-username strong');
    
//     const content = contentElement ? contentElement.textContent.toLowerCase().trim() : '';
//     const username = usernameElement ? usernameElement.textContent.toLowerCase() : '';
    
//     let match = false;
//     if (isUsernameSearch) {
//       const searchUsername = input.substring(1);
//       match = username.includes(searchUsername);
//     } else {
//       match = content.includes(input);
//     }

//     if (match) {
//       comment.style.display = 'block';

//       // Show all parent comments and their reply lists
//       let currentList = comment.closest('.reply-list');
//       while (currentList) {
//         currentList.style.display = 'block';
        
//         const parentComment = currentList.closest('.comment');
//         if (parentComment) {
//           const parentId = parentComment.id.replace('comments-', '');
//           parentComment.style.display = 'block';
          
//           const toggleBtn = document.querySelector(`.comment-btn.show[data-comment-id="${parentId}"]`);
//           if (toggleBtn) {
//             toggleBtn.classList.add('open');
//             toggleBtn.textContent = 'Hide Replies';
//           }
//         }
        
//         // Move up to the next parent reply list
//         currentList = currentList.parentElement.closest('.reply-list');
//       }
//     }
//   });
// }

// Filter comments by most liked
function filterMostLiked() {
  const commentsList = document.getElementById('comments-list');
  const mostLikedBtn = document.getElementById('mostLikedBtn');
  const isActive = mostLikedBtn.classList.toggle('active');
  const searchInput = document.getElementById('searchBox').value;

  // Restore original order if toggled off or search is active
  if (!isActive || searchInput) {
    commentsList.innerHTML = originalCommentsHTML;
    mostLikedBtn.classList.remove('active');
    return;
  }

  const topLevelComments = Array.from(commentsList.children).filter(
    (el) => el.classList.contains('comment') && !el.classList.contains('reply-list')
  );

  const commentsWithReplies = topLevelComments.map((comment) => {
    const commentId = comment.id.replace('comments-', '');
    const likes = parseInt(comment.querySelector('.rd-comment-likes-count')?.textContent) || 0;
    const dateText = comment.querySelector('.comment-username .text-muted')?.textContent.trim() || '';

    let date = new Date(0);
    if (dateText) {
      try {
        const [datePart, timePart] = dateText.split(' At ');
        if (datePart && timePart) {
          const [day, month, year] = datePart.split('/').map(Number);
          const [hours, minutes] = timePart.split(':').map(Number);
          if (day && month && year && hours !== undefined && minutes !== undefined) {
            date = new Date(year, month - 1, day, hours, minutes);
          }
        }
      } catch (e) {
        console.warn(`Failed to parse date for comment ${commentId}: ${dateText}`);
      }
    }

    const replies = Array.from(comment.querySelectorAll('ul.reply-list')).map((replyList) => ({
      element: replyList,
      comments: Array.from(replyList.children).map((reply) => reply.outerHTML),
    }));

    return { element: comment, date, likes, replies };
  });


  commentsWithReplies.sort((a, b) => b.likes - a.likes || b.date - a.date);
  // Rebuild comment list
  commentsList.innerHTML = '';
  commentsWithReplies.forEach(({ element, replies }) => {
    commentsList.appendChild(element);
    replies.forEach((replyList) => {
      const ul = document.createElement('ul');
      ul.className = 'comments-list reply-list';
      ul.setAttribute('data-id', replyList.element.getAttribute('data-id'));
      ul.style.display = replyList.element.style.display;
      ul.innerHTML = replyList.comments.join('');
      commentsList.appendChild(ul);
    });
  });
}

// reply user name show js
$(document).ready(function () {
    $('li.comment[id^="comments-"]').each(function () {
        const depth = $(this).parents('ul.comments-list.reply-list').length;
        const $comment = $(this);
        const $usernameContainer = $comment.find('.comment-username').first();
        const $strong = $usernameContainer.find('strong').first();
        const childUsername = $strong.text().trim();
        
        // Try to get parent username from attribute
        let parentUsername = $comment.data('parent-username');

        if (depth >= 2) {
            // Inject only if parentUsername exists and <em> not already added
            if (parentUsername && $usernameContainer.find('em').length === 0) {
                $strong.after(`<em> replied to <strong>${parentUsername}</strong></em>`);
            }
        }
    });
});

// Show/Hide comment children
$(document).ready(function () {
    $(document).on("click", ".comment-btn.show", function () {
        const $button = $(this);
        const $parentComment = $button.closest("li");
        const $childReplies = $parentComment.children("ul.comments-list.reply-list");

        if ($childReplies.length) {
            const isVisible = $childReplies.first().is(":visible");

            $childReplies.toggle();

            // Toggle icons
            $button.find('.rd-icon-show').toggle(isVisible);
            $button.find('.rd-icon-hide').toggle(!isVisible);

            // Update text node (after icons)
            const textNode = $button.contents().filter(function () {
                return this.nodeType === 3 && $.trim(this.nodeValue).length > 0;
            }).get(0);

            const countMatch = textNode.nodeValue.match(/\(\d+\)/);
            const countText = countMatch ? ` ${countMatch[0]}` : "";
            textNode.nodeValue = (isVisible ? " Show Replies" : " Hide Replies") + countText;
        }

        if ($childReplies.length) {
            $('html, body').stop().animate({
                scrollTop: $parentComment.offset().top
            }, 100);
        }
    });
});

// read more btn 
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("read-more-comments");
    if (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".hidden-comment").forEach(function (el) {
                el.classList.remove("hidden-comment");
            });
            btn.parentElement.style.display = "none"; // Hide the button
        });
    }
});

// 5 comments depth condition
// $('.tx_newscomments li[id^="comments-"]').each(function () {
//     const depth = $(this).parents('ul.comments-list.reply-list').length;

//     if (depth >= 4) {
//         $(this).find('.comment-btn.reply').hide();
//     }
// }); 

// Open form on close button click
function closeReplyForm() {
    const commentHTML = $('.active-comment-form').html();

    $('.tx_newscomments .active-comment-form').html('');
    $('.tx_newscomments .active-comment-form').removeClass('active-comment-form');
    $('.tx_newscomments #form-comment-view').html(commentHTML);
    $('.tx_newscomments #form-comment-view').addClass('active-comment-form');

    $('.tx_newscomments .comment-btn.reply').show();
    $('.tx_newscomments .comment-btn.like').show();
    $('.tx_newscomments #comment-form-close-btn').hide();

    $('#parentId').val('');
    removeDefaultValidation();
    onFocusValidation();
}

// Custom Validation 
function validateField() {
    let flag = 1;
    let elementObj;
    const terms = document.getElementsByName('tx_rdcomments_rdcomment[newComment][terms]').length;

    if (!$('.tx_newscomments #name').val()) {
        $(".tx_newscomments #name").parent().addClass('has-error');
        $('.tx_newscomments #name_error').show();
        flag = 0;
    } else {
        if (!validateName($('.tx_newscomments #name').val())) {
            $(".tx_newscomments #name_error_msg").show();
            $(".tx_newscomments #name_error").hide();
            $(".tx_newscomments #name").parent().addClass('has-error');
            flag = 0;
        } else {
            $(".tx_newscomments #name").parent().removeClass('has-error');
            $(".tx_newscomments #name_error_msg").hide();
            $(".tx_newscomments #name_error").hide();
        }
    }

    if (!$('.tx_newscomments #email').val()) {
        $(".tx_newscomments #email").parent().addClass('has-error');
        $(".tx_newscomments #email_error").show();
        $(".tx_newscomments #email_error_msg").hide();
        flag = 0;
    } else {
        if (!validateEmail($('.tx_newscomments #email').val())) {
            $(".tx_newscomments #email_error_msg").show();
            $(".tx_newscomments #email_error").hide();
            $(".tx_newscomments #email").parent().addClass('has-error');
            flag = 0;
        } else {
            $(".tx_newscomments #email").parent().removeClass('has-error');
        }
    }

    if (!$('.tx_newscomments #comment').val()) {
        $(".tx_newscomments #comment").parent().addClass('has-error');
        $(".tx_newscomments #comment_error").show();
        flag = 0;
    } else {
        const length = $.trim($(".tx_newscomments #comment").val()).length;
        if (length == 0) {
            $(".tx_newscomments #comment_error").show();
            $(".tx_newscomments #comment").parent().addClass('has-error');
            flag = 0;
        } else {
            $(".tx_newscomments #comment").parent().removeClass('has-error');
        }
    }

    if (terms) {
        if (!$('.tx_newscomments input[name="tx_rdcomments_rdcomment[newComment][terms]"]:checked').length) {
            $(".tx_newscomments #terms").closest('.rd-form-group').addClass('has-error');
            $(".tx_newscomments #terms_error").show();
            flag = 0;
        } else {
            $(".tx_newscomments #terms").closest('.rd-form-group').removeClass('has-error');
            $(".tx_newscomments #terms_error").hide();
        }
    }

    return flag === 1;
}

// Custom validation for onfocus
function onFocusValidation() {
    $(".tx_newscomments #name").focusout(function() {
        const elementObj = $(this);
        if (elementObj.val() != '') {
            if (!validateName($('.tx_newscomments #name').val())) {
                $(".tx_newscomments #name_error_msg").show();
                $(".tx_newscomments #name_error").hide();
                $(".tx_newscomments #name").parent().addClass('has-error');
            } else {
                elementObj.parent().removeClass('has-error');
                $(".tx_newscomments #name_error_msg").hide();
                $(".tx_newscomments #name_error").hide();
            }
        } else {
            $(".tx_newscomments #name").parent().addClass('has-error');
            $(".tx_newscomments #name_error").show();
            $(".tx_newscomments #name_error_msg").hide();
        }
    });

    $(".tx_newscomments #email").focusout(function() {
        const elementObj = $(this);
        if (elementObj.val() != '') {
            if (!validateEmail($('.tx_newscomments #email').val())) {
                $(".tx_newscomments #email_error_msg").show();
                $(".tx_newscomments #email_error").hide();
                $(".tx_newscomments #email").parent().addClass('has-error');
            } else {
                elementObj.parent().removeClass('has-error');
                $(".tx_newscomments #email_error_msg").hide();
                $(".tx_newscomments #email_error").hide();
            }
        } else {
            $(".tx_newscomments #email").parent().addClass('has-error');
            $(".tx_newscomments #email_error").show();
            $(".tx_newscomments #email_error_msg").hide();
        }
    });

    $(".tx_newscomments #comment").focusout(function() {
        const elementObj = $(this);
        if (elementObj.val() != '') {
            const length = $.trim($(".tx_newscomments #comment").val()).length;
            if (length == 0) {
                $(".tx_newscomments #comment_error").show();
                $(".tx_newscomments #comment").parent().addClass('has-error');
            } else {
                $(".tx_newscomments #comment").parent().removeClass('has-error');
                $(".tx_newscomments #comment_error").hide();
            }
        } else {
            $(".tx_newscomments #comment").parent().addClass('has-error');
            $(".tx_newscomments #comment_error").show();
        }
    });

    $('.tx_newscomments input[name="tx_rdcomments_rdcomment[newComment][terms]"]').on('change', function() {
        if (!$('.tx_newscomments input[name="tx_rdcomments_rdcomment[newComment][terms]"]:checked').length) {
            $(".tx_newscomments #terms").closest('.rd-form-group').addClass('has-error');
            $(".tx_newscomments #terms_error").show();
        } else {
            $(".tx_newscomments #terms").closest('.rd-form-group').removeClass('has-error');
            $(".tx_newscomments #terms_error").hide();
        }
    });
}

function removeDefaultValidation() {
    $(".tx_newscomments #name").parent().removeClass('has-error');
    $(".tx_newscomments #name_error").hide();
    $(".tx_newscomments #name_error_msg").hide();

    $(".tx_newscomments #email").parent().removeClass('has-error');
    $(".tx_newscomments #email_error").hide();
    $(".tx_newscomments #email_error_msg").hide();

    $(".tx_newscomments #comment").parent().removeClass('has-error');
    $(".tx_newscomments #comment_error").hide();
}

// Validate Email field
function validateEmail(email) {
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailReg.test(email);
}

// Validate Name field
function validateName(name) {
    const nameReg = /^[\p{L}\p{M} \-']+$/u;
    return nameReg.test(name);
}
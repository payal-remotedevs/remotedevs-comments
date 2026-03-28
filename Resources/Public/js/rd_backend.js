/**
 * Backend Comment Management JS - Enhanced Production Version
 * -------------------------------------------------
 * Features:
 *  - AJAX pin/unpin without page reload
 *  - AJAX delete with confirmation dialog for all comment levels
 *  - Search functionality
 *  - Filter (pinned/recent) - FIXED
 *  - Professional animations and feedback
 *  - Smart back navigation for replies and sub-replies
 *  - Nested replies expansion/collapse
 */

document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
    setupFilter();
    setupAjaxPin();
    setupAjaxDelete();
    setupToggleReplies();
    setupBackButton();
    
    // Show/hide back button based on context
    toggleBackButton();
});

// 🔙 SMART BACK BUTTON FUNCTIONALITY
function setupBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (!backBtn) return;

    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if we're in a replies view
        const container = document.querySelector('.container');
        const articleId = container?.getAttribute('data-article-id');
        
        // Check URL parameters to determine our current location
        const urlParams = new URLSearchParams(window.location.search);
        const currentAction = urlParams.get('tx_rdcomments_backendcomment[action]');
        const commentUid = urlParams.get('tx_rdcomments_backendcomment[commentUid]');
        const newsUid = urlParams.get('tx_rdcomments_backendcomment[newsUid]') || 
                       urlParams.get('tx_rdcomments_backendcomment[article]');
        
        if (currentAction === 'showOnlyReplies' && commentUid && newsUid) {
            // We're in a sub-replies view, determine where to go back
            const parentCommentId = getParentCommentId(commentUid);
            
            if (parentCommentId) {
                // Go back to parent comment's replies
                navigateToReplies(newsUid, parentCommentId);
            } else {
                // Go back to main comments view
                navigateToComments(newsUid);
            }
        } else if (currentAction === 'showComments' && newsUid) {
            // We're in main comments view, go back to news list
            navigateToBackendList();
        } else {
            // Fallback to browser back
            window.history.back();
        }
    });
}

// Navigate to main comments view for a news article
function navigateToComments(newsUid) {
    const url = new URL(window.location.href);
    url.searchParams.set('tx_rdcomments_backendcomment[action]', 'showComments');
    url.searchParams.set('tx_rdcomments_backendcomment[article]', newsUid);
    url.searchParams.set('tx_rdcomments_backendcomment[controller]', 'BackendComment');
    url.searchParams.delete('tx_rdcomments_backendcomment[commentUid]');
    url.searchParams.delete('tx_rdcomments_backendcomment[newsUid]');
    window.location.href = url.toString();
}

// Navigate to replies view for a specific comment
function navigateToReplies(newsUid, commentUid) {
    const url = new URL(window.location.href);
    url.searchParams.set('tx_rdcomments_backendcomment[action]', 'showOnlyReplies');
    url.searchParams.set('tx_rdcomments_backendcomment[newsUid]', newsUid);
    url.searchParams.set('tx_rdcomments_backendcomment[commentUid]', commentUid);
    url.searchParams.set('tx_rdcomments_backendcomment[controller]', 'BackendComment');
    window.location.href = url.toString();
}

// Navigate to backend list (news overview)
function navigateToBackendList() {
    const url = new URL(window.location.href);
    url.searchParams.set('tx_rdcomments_backendcomment[action]', 'backendList');
    url.searchParams.set('tx_rdcomments_backendcomment[controller]', 'BackendComment');
    url.searchParams.delete('tx_rdcomments_backendcomment[article]');
    url.searchParams.delete('tx_rdcomments_backendcomment[commentUid]');
    url.searchParams.delete('tx_rdcomments_backendcomment[newsUid]');
    window.location.href = url.toString();
}

// Get parent comment ID from DOM structure (helper function)
function getParentCommentId(currentCommentUid) {
    // Try to find parent comment in the current page structure
    const currentCard = document.querySelector(`[data-comment-id="${currentCommentUid}"]`);
    if (!currentCard) return null;
    
    // Check if this comment is inside a sub-comments-grid
    const parentGrid = currentCard.closest('.sub-comments-grid');
    if (!parentGrid) return null;
    
    // Get the parent comment card
    const parentCard = parentGrid.previousElementSibling;
    if (parentCard && parentCard.classList.contains('comment-card')) {
        return parentCard.getAttribute('data-comment-id');
    }
    
    return null;
}

// Show/hide back button based on current view
function toggleBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (!backBtn) return;

    const isCommentsView = document.querySelector('.comments-section') !== null;
    const isRepliesView = document.querySelector('.sub-comments-section') !== null;
    const isNewsListView = document.querySelector('.news-grid') !== null;
    
    // Show back button in comments or replies view, hide in news list
    if (isCommentsView || isRepliesView) {
        backBtn.style.display = 'inline-flex';
    } else if (isNewsListView) {
        backBtn.style.display = 'none';
    }
}

// 🔍 SEARCH FUNCTIONALITY
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.comment-card:not(.parent-comment), .news-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const matches = text.includes(term);
            
            // Smooth show/hide with animation
            if (matches) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
}

// 🧩 FILTER FUNCTIONALITY
function setupFilter() {
    const filterSelect = document.getElementById('filter-select');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', function(e) {
        applyFilter(e.target.value);
    });
}

function applyFilter(filterType) {
    const cards = document.querySelectorAll('.comment-card:not(.parent-comment)');
    
    cards.forEach(card => {
        switch (filterType) {
            case 'pinned':
                // Show only pinned comments
                const hasPinnedBtn = card.querySelector('.btn-pin.pinned');
                showCard(card, hasPinnedBtn !== null);
                break;
                
            case 'recent':
                // Show only comments from the last 7 days
                const isRecent = isCommentRecent(card, 7);
                showCard(card, isRecent);
                break;
                
            default:
                // Show all comments
                showCard(card, true);
        }
    });
}

// Helper function to check if a comment is recent (within specified days)
function isCommentRecent(card, days = 7) {
    // Try to find the date element in the comment card
    const dateElement = card.querySelector('.comment-date, .meta-date, [data-timestamp], time');
    
    if (!dateElement) {
        // If no date element found, show the comment (fail-safe)
        return true;
    }
    
    let commentDate = null;
    
    // Try to get date from data-timestamp attribute (Unix timestamp)
    if (dateElement.hasAttribute('data-timestamp')) {
        const timestamp = parseInt(dateElement.getAttribute('data-timestamp'));
        if (!isNaN(timestamp)) {
            commentDate = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
        }
    }
    
    // If not found, try to parse the text content
    if (!commentDate) {
        const dateText = dateElement.textContent.trim();
        commentDate = parseCommentDate(dateText);
    }
    
    // If we still don't have a valid date, show the comment (fail-safe)
    if (!commentDate || isNaN(commentDate.getTime())) {
        return true;
    }
    
    // Calculate the difference in days
    const now = new Date();
    const diffTime = now - commentDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    return diffDays <= days;
}

// Parse various date formats commonly used in comments
function parseCommentDate(dateText) {
    // Try to parse ISO format first
    let date = new Date(dateText);
    if (!isNaN(date.getTime())) {
        return date;
    }
    
    // Try common European format: DD.MM.YYYY HH:MM
    const europeanMatch = dateText.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s*(\d{1,2}):(\d{2})/);
    if (europeanMatch) {
        const [, day, month, year, hour, minute] = europeanMatch;
        return new Date(year, month - 1, day, hour, minute);
    }
    
    // Try US format: MM/DD/YYYY HH:MM
    const usMatch = dateText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2}):(\d{2})/);
    if (usMatch) {
        const [, month, day, year, hour, minute] = usMatch;
        return new Date(year, month - 1, day, hour, minute);
    }
    
    // Try relative dates like "2 days ago", "3 hours ago"
    const relativeMatch = dateText.match(/(\d+)\s*(minute|hour|day|week|month)s?\s*ago/i);
    if (relativeMatch) {
        const [, amount, unit] = relativeMatch;
        const now = new Date();
        const value = parseInt(amount);
        
        switch (unit.toLowerCase()) {
            case 'minute':
                return new Date(now - value * 60 * 1000);
            case 'hour':
                return new Date(now - value * 60 * 60 * 1000);
            case 'day':
                return new Date(now - value * 24 * 60 * 60 * 1000);
            case 'week':
                return new Date(now - value * 7 * 24 * 60 * 60 * 1000);
            case 'month':
                return new Date(now - value * 30 * 24 * 60 * 60 * 1000);
        }
    }
    
    // If all parsing attempts fail, return null
    return null;
}

// Helper function to show/hide cards with animation
function showCard(card, shouldShow) {
    if (shouldShow) {
        card.style.display = '';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 10);
    } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (card.style.opacity === '0') {
                card.style.display = 'none';
            }
        }, 300);
    }
}

// 📌 AJAX PIN FUNCTIONALITY
function setupAjaxPin() {
    document.addEventListener('click', function(e) {
        const pinBtn = e.target.closest('.action-btn.btn-pin');
        if (!pinBtn) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const commentUid = pinBtn.getAttribute('data-comment-uid');
        let ajaxUrl = pinBtn.getAttribute('data-ajax-url');
        
        // If data-ajax-url is empty or missing, construct it dynamically
        if (!ajaxUrl || ajaxUrl.trim() === '') {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('tx_rdcomments_backendcomment[action]', 'ajaxPin');
            currentUrl.searchParams.set('tx_rdcomments_backendcomment[commentUid]', commentUid);
            currentUrl.searchParams.set('tx_rdcomments_backendcomment[controller]', 'BackendComment');
            ajaxUrl = currentUrl.toString();
        }
        
        if (!commentUid) {
            showToast('Configuration error: Missing comment ID', 'error');
            return;
        }
        
        // Disable button during request
        pinBtn.disabled = true;
        pinBtn.classList.add('loading');
        
        fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Server returned non-JSON response');
            }
        })
        .then(data => {
            if (data.success) {
                // Toggle pinned state
                pinBtn.classList.toggle('pinned');
                
                // Update title
                const isPinned = pinBtn.classList.contains('pinned');
                pinBtn.setAttribute('title', isPinned ? 'Unpin' : 'Pin');
                
                // Show success feedback
                showToast(data.message || (isPinned ? 'Comment pinned successfully' : 'Comment unpinned successfully'), 'success');
            } else {
                showToast(data.message || 'Failed to update pin status', 'error');
            }
        })
        .catch(error => {
            console.error('Pin error:', error);
            showToast('An error occurred while updating pin status', 'error');
        })
        .finally(() => {
            // Re-enable button
            pinBtn.disabled = false;
            pinBtn.classList.remove('loading');
        });
    });
}

// 🗑️ AJAX DELETE FUNCTIONALITY - Works for all comment levels
function setupAjaxDelete() {
    document.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.action-btn.btn-danger');
        if (!deleteBtn) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const commentUid = deleteBtn.getAttribute('data-comment-uid');
        let ajaxUrl = deleteBtn.getAttribute('data-ajax-url');
        
        // If data-ajax-url is empty or missing, construct it dynamically
        if (!ajaxUrl || ajaxUrl.trim() === '') {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('tx_rdcomments_backendcomment[action]', 'ajaxDelete');
            currentUrl.searchParams.set('tx_rdcomments_backendcomment[commentUid]', commentUid);
            currentUrl.searchParams.set('tx_rdcomments_backendcomment[controller]', 'BackendComment');
            ajaxUrl = currentUrl.toString();
        }
        
        if (!commentUid) {
            showToast('Configuration error: Missing comment ID', 'error');
            return;
        }
        
        // Show custom confirmation dialog
        showDeleteConfirmation(function() {
            // User confirmed deletion
            deleteBtn.disabled = true;
            deleteBtn.classList.add('loading');
            
            fetch(ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    throw new Error('Server returned non-JSON response');
                }
            })
            .then(data => {
                if (data.success) {
                    // Find and remove the comment card with animation
                    const commentCard = deleteBtn.closest('.comment-card');
                    if (commentCard) {
                        // Check if this is a parent comment
                        const isParentComment = commentCard.classList.contains('parent-comment');
                        
                        if (isParentComment) {
                            // If parent comment is deleted, also remove the replies grid
                            const repliesGrid = commentCard.nextElementSibling;
                            if (repliesGrid && repliesGrid.classList.contains('sub-comments-grid')) {
                                repliesGrid.style.transition = 'all 0.3s ease';
                                repliesGrid.style.opacity = '0';
                                repliesGrid.style.transform = 'scale(0.95)';
                            }
                        }
                        
                        // Animate removal
                        commentCard.style.transition = 'all 0.3s ease';
                        commentCard.style.opacity = '0';
                        commentCard.style.transform = 'scale(0.95)';
                        
                        setTimeout(() => {
                            commentCard.remove();
                            
                            // Also remove replies grid if parent was deleted
                            if (isParentComment) {
                                const repliesGrid = document.querySelector('.sub-comments-grid');
                                if (repliesGrid) {
                                    repliesGrid.remove();
                                }
                            }
                            
                            updateReplyCounts();
                            
                            // Check if all comments are gone, maybe redirect back
                            const remainingComments = document.querySelectorAll('.comment-card:not(.parent-comment)');
                            if (remainingComments.length === 0 && isParentComment) {
                                // If we deleted the parent and there are no more comments, go back
                                setTimeout(() => {
                                    const urlParams = new URLSearchParams(window.location.search);
                                    const newsUid = urlParams.get('tx_rdcomments_backendcomment[newsUid]') || 
                                                   urlParams.get('tx_rdcomments_backendcomment[article]');
                                    if (newsUid) {
                                        navigateToComments(newsUid);
                                    }
                                }, 1000);
                            }
                        }, 300);
                    }
                    
                    showToast(data.message || 'Comment deleted successfully', 'success');
                } else {
                    showToast(data.message || 'Failed to delete comment', 'error');
                    deleteBtn.disabled = false;
                    deleteBtn.classList.remove('loading');
                }
            })
            .catch(error => {
                console.error('Delete error:', error);
                showToast('An error occurred while deleting the comment', 'error');
                deleteBtn.disabled = false;
                deleteBtn.classList.remove('loading');
            });
        });
    });
}

// ⬇️ TOGGLE REPLIES VISIBILITY
function setupToggleReplies() {
    document.addEventListener('click', function(e) {
        const toggleBtn = e.target.closest('.toggle-replies');
        if (!toggleBtn) return;

        e.preventDefault();
        const commentId = toggleBtn.getAttribute('data-comment-id');
        const repliesContainer = document.getElementById('replies-' + commentId);

        if (repliesContainer) {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // Collapse
                repliesContainer.style.maxHeight = repliesContainer.scrollHeight + 'px';
                setTimeout(() => {
                    repliesContainer.style.maxHeight = '0';
                    repliesContainer.style.opacity = '0';
                }, 10);
                setTimeout(() => {
                    repliesContainer.style.display = 'none';
                }, 300);
            } else {
                // Expand
                repliesContainer.style.display = 'block';
                repliesContainer.style.maxHeight = '0';
                repliesContainer.style.opacity = '0';
                setTimeout(() => {
                    repliesContainer.style.maxHeight = repliesContainer.scrollHeight + 'px';
                    repliesContainer.style.opacity = '1';
                }, 10);
                setTimeout(() => {
                    repliesContainer.style.maxHeight = 'none';
                }, 300);
            }
            
            toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
            toggleBtn.classList.toggle('expanded', !isExpanded);
        }
    });
}

// 🔔 TOAST NOTIFICATION
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${getToastIcon(type)}</span>
            <span class="toast-message">${escapeHtml(message)}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        default: return 'ℹ';
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 🗑️ CUSTOM DELETE CONFIRMATION DIALOG
function showDeleteConfirmation(onConfirm) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'delete-modal-overlay';
    modal.innerHTML = `
        <div class="delete-modal">
            <div class="delete-modal-header">
                <span class="delete-modal-icon">⚠️</span>
                <h3>Confirm Deletion</h3>
            </div>
            <div class="delete-modal-body">
                <p>Are you sure you want to delete this comment?</p>
                <p class="delete-modal-warning">This action cannot be undone. All replies to this comment will also be deleted.</p>
            </div>
            <div class="delete-modal-footer">
                <button class="modal-btn modal-btn-cancel">Cancel</button>
                <button class="modal-btn modal-btn-delete">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Handle cancel
    modal.querySelector('.modal-btn-cancel').addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Handle delete
    modal.querySelector('.modal-btn-delete').addEventListener('click', function() {
        closeModal(modal);
        onConfirm();
    });
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Close on ESC key
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}

// 📊 UPDATE REPLY COUNTS
function updateReplyCounts() {
    document.querySelectorAll('.reply-count').forEach(countEl => {
        const replyBtn = countEl.closest('.reply-btn');
        if (!replyBtn) return;
        
        const href = replyBtn.getAttribute('href');
        if (!href) return;
        
        // Extract comment ID from href
        const match = href.match(/commentUid[=\]]+(\d+)/);
        if (!match) return;
        
        const commentId = match[1];
        const repliesContainer = document.getElementById('replies-' + commentId);
        
        if (repliesContainer) {
            const count = repliesContainer.querySelectorAll('.comment-card').length;
            countEl.textContent = `(${count})`;
            
            // Hide reply button if no replies left
            if (count === 0) {
                replyBtn.style.display = 'none';
            }
        }
    });
}

/**
 * NEWS LIST PAGE SPECIFIC FUNCTIONS
 */
if (document.querySelector('.news-grid')) {
    setupNewsSearch();
}

function setupNewsSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        const term = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.news-card');

        cards.forEach(card => {
            const title = card.querySelector('.news-title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.news-excerpt')?.textContent.toLowerCase() || '';
            const matches = title.includes(term) || excerpt.includes(term);
            
            if (matches) {
                card.style.display = '';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 200);
            }
        });
    });
}
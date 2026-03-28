<?php

declare(strict_types=1);

namespace RemoteDevs\RdComments\Controller;

use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Utility\DebugUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Messaging\AbstractMessage;
use TYPO3\CMS\Extbase\Utility\LocalizationUtility;
use TYPO3\CMS\Core\Type\ContextualFeedbackSeverity;
use GeorgRinger\News\Domain\Repository\NewsRepository;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use RemoteDevs\RdComments\Domain\Model\Comment;
use RemoteDevs\RdComments\Domain\Repository\CommentRepository;
use TYPO3\CMS\Extbase\Persistence\Repository;
use TYPO3\CMS\Extbase\Persistence\QueryInterface;
use TYPO3\CMS\Core\Http\HtmlResponse;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Database\ConnectionPool;
use Doctrine\DBAL\ParameterType;

/**
 * BackendCommentController 
 */
class BackendCommentController extends ActionController
{
    protected ?CommentRepository $commentRepository = null;
    protected NewsRepository $newsRepository;
    protected PersistenceManager $persistenceManager;

    public function injectCommentRepository(CommentRepository $commentRepository): void
    {
        $this->commentRepository = $commentRepository;
    }

    public function injectPersistenceManager(PersistenceManager $persistenceManager): void
    {
        $this->persistenceManager = $persistenceManager;
    }

    public function injectNewsRepository(NewsRepository $newsRepository): void
    {
        $this->newsRepository = $newsRepository;
    }

    public function __construct(
        CommentRepository $commentRepository,
        PersistenceManager $persistenceManager,
        NewsRepository $newsRepository
    ) {
        $this->commentRepository = $commentRepository;
        $this->persistenceManager = $persistenceManager;
        $this->newsRepository = $newsRepository;
    }

    /**
     * Initialize action 
     */
    public function initializeAction(): void
    {
        parent::initializeAction();
        
        $isAjax = $this->request->hasHeader('X-Requested-With') && 
                  $this->request->getHeader('X-Requested-With')[0] === 'XMLHttpRequest';
        
        if (!$isAjax) {
            $queryParams = $this->request->getQueryParams();
            $action = $queryParams['tx_rdcomments_backendcomment']['action'] ?? '';
            
            if (in_array($action, ['ajaxPin', 'ajaxDelete'])) {
                $_SERVER['HTTP_X_REQUESTED_WITH'] = 'XMLHttpRequest';
            }
        }
    }

    /**
     * Show Comments Action 
     */
    public function showCommentsAction(int $article): ResponseInterface
    {
        $queryParams = $this->request->getQueryParams();
        $requestedAction = $queryParams['tx_rdcomments_backendcomment']['action'] ?? '';
        $commentUid = (int)($queryParams['tx_rdcomments_backendcomment']['commentUid'] ?? 0);
        
        if ($requestedAction === 'ajaxPin' && $commentUid > 0) {
            return $this->handleAjaxPin($commentUid);
        } elseif ($requestedAction === 'ajaxDelete' && $commentUid > 0) {
            return $this->handleAjaxDelete($commentUid);
        }
        
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tx_rdcomments_domain_model_comment');

        $commentsRaw = $queryBuilder
            ->select('*')
            ->from('tx_rdcomments_domain_model_comment')
            ->where(
                $queryBuilder->expr()->eq('deleted', 0),
                $queryBuilder->expr()->eq('hidden', 0)
            )
            ->orderBy('pinned', 'DESC')
            ->addOrderBy('crdate', 'DESC')
            ->executeQuery()
            ->fetchAllAssociative();

        $allComments = [];
        $repliesMap = [];

        foreach ($commentsRaw as $commentRaw) {
            $commentUidCurrent = (int)$commentRaw['uid'];
            $parentCommentId = (int)$commentRaw['comment'];
            $newsId = (int)$commentRaw['newsuid'];

            $allComments[$commentUidCurrent] = [
                'uid' => $commentUidCurrent,
                'newsuid' => $newsId,
                'username' => $commentRaw['username'] ?: 'Anonymous',
                'usermail' => $commentRaw['usermail'],
                'crdate' => $commentRaw['crdate'] ? date('Y-m-d H:i', $commentRaw['crdate']) : '',
                'description' => $commentRaw['description'] ?: '',
                'pinned' => (bool)$commentRaw['pinned'],
                'likes' => (int)$commentRaw['likes'],
                'replies' => [],
                'parent' => $parentCommentId,
                'is_top_level' => empty($parentCommentId),
            ];

            if (!empty($parentCommentId)) {
                $repliesMap[$parentCommentId][] = $commentUidCurrent;
            }
        }

        $buildReplies = function ($comment) use (&$allComments, &$repliesMap, &$buildReplies) {
            $uid = $comment['uid'];
            if (!empty($repliesMap[$uid])) {
                foreach ($repliesMap[$uid] as $replyUid) {
                    if (isset($allComments[$replyUid])) {
                        $child = $allComments[$replyUid];
                        $comment['replies'][] = $buildReplies($child);
                    }
                }
            }
            return $comment;
        };

        $commentsByNews = [];

        foreach ($allComments as $comment) {
            if ($comment['is_top_level']) {
                $newsId = $comment['newsuid'];
                if (!isset($commentsByNews[$newsId])) {
                    $commentsByNews[$newsId] = [
                        'newsId' => $newsId,
                        'newsTitle' => '',
                        'comments' => []
                    ];
                }
                $commentsByNews[$newsId]['comments'][] = $buildReplies($comment);
            }
        }

        $news = $this->newsRepository->findByUid($article);

        $this->view->assignMultiple([
            'selectedArticle' => $news,
            'commentsByNews' => $commentsByNews,
        ]);

        $this->view->setTemplatePathAndFilename('EXT:rd_comments/Resources/Private/Templates/BackendComment/ShowComments.html');

        return new HtmlResponse($this->view->render());
    }

    /**
     * Handle AJAX Pin Request
     */
    protected function handleAjaxPin(int $commentUid): ResponseInterface
    {
        error_log('handleAjaxPin called with UID: ' . $commentUid);
        
        if (!$this->getBackendUser()->isAdmin()) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Insufficient permissions'
            ]);
        }

        if ($commentUid === 0) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid comment ID'
            ]);
        }

        $comment = $this->commentRepository->findByUid($commentUid);
        
        if (!$comment instanceof Comment) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Comment not found'
            ]);
        }

        try {
            $newPinnedState = !$comment->getPinned();
            $comment->setPinned($newPinnedState);
            $this->commentRepository->update($comment);
            $this->persistenceManager->persistAll();

            $message = $newPinnedState 
                ? LocalizationUtility::translate('comment_pinned_successfully', 'RdComments') ?? 'Comment pinned successfully'
                : LocalizationUtility::translate('comment_unpinned_successfully', 'RdComments') ?? 'Comment unpinned successfully';

            error_log('Pin action successful: ' . $message);

            return new JsonResponse([
                'success' => true,
                'message' => $message,
                'pinned' => $newPinnedState
            ]);
        } catch (\Exception $e) {
            error_log('Pin action error: ' . $e->getMessage());
            return new JsonResponse([
                'success' => false,
                'message' => 'Failed to update pin status: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Handle AJAX Delete Request
     */
    protected function handleAjaxDelete(int $commentUid): ResponseInterface
    {
        error_log('handleAjaxDelete called with UID: ' . $commentUid);
        
        if (!$this->getBackendUser()->isAdmin()) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Insufficient permissions'
            ]);
        }

        if ($commentUid === 0) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid comment ID'
            ]);
        }

        $comment = $this->commentRepository->findByUid($commentUid);
        
        if (!$comment instanceof Comment) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Comment not found'
            ]);
        }

        try {
            foreach ($comment->getChildcomment() ?? [] as $childComment) {
                $this->commentRepository->remove($childComment);
            }
            
            $this->commentRepository->remove($comment);
            $this->persistenceManager->persistAll();

            $message = LocalizationUtility::translate('comment_deleted_successfully', 'RdComments') 
                ?? 'Comment deleted successfully';

            error_log('Delete action successful: ' . $message);

            return new JsonResponse([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            error_log('Delete action error: ' . $e->getMessage());
            return new JsonResponse([
                'success' => false,
                'message' => 'Failed to delete comment: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * AJAX Pin Action 
     */
    public function ajaxPinAction(): ResponseInterface
    {
        error_log('ajaxPinAction called directly');
        
        $commentUid = 0;
        
        if ($this->request->hasArgument('commentUid')) {
            $commentUid = (int)$this->request->getArgument('commentUid');
        }
        
        if ($commentUid === 0) {
            $queryParams = $this->request->getQueryParams();
            $commentUid = (int)($queryParams['commentUid'] ?? $queryParams['tx_rdcomments_backendcomment']['commentUid'] ?? 0);
        }
        
        return $this->handleAjaxPin($commentUid);
    }

    /**
     * AJAX Delete Action 
     */
    public function ajaxDeleteAction(): ResponseInterface
    {
        error_log('ajaxDeleteAction called directly');
        
        $commentUid = 0;
        
        if ($this->request->hasArgument('commentUid')) {
            $commentUid = (int)$this->request->getArgument('commentUid');
        }
        
        if ($commentUid === 0) {
            $queryParams = $this->request->getQueryParams();
            $commentUid = (int)($queryParams['commentUid'] ?? $queryParams['tx_rdcomments_backendcomment']['commentUid'] ?? 0);
        }
        
        return $this->handleAjaxDelete($commentUid);
    }

    /**
     * Backend List Action
     */
    public function backendListAction(): ResponseInterface
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tx_rdcomments_domain_model_comment');
    
        $commentsRaw = $queryBuilder
            ->select('*')
            ->from('tx_rdcomments_domain_model_comment')
            ->where(
                $queryBuilder->expr()->eq('deleted', 0),
                $queryBuilder->expr()->eq('hidden', 0)
            )
            ->orderBy('pinned', 'DESC')
            ->addOrderBy('crdate', 'DESC')
            ->executeQuery()
            ->fetchAllAssociative();
    
        $allComments = [];
        $repliesMap = [];
    
        foreach ($commentsRaw as $commentRaw) {
            $commentUid = (int)$commentRaw['uid'];
            $parentCommentId = (int)$commentRaw['comment'];
            $newsId = (int)$commentRaw['newsuid'];

            $allComments[$commentUid] = [
                'uid' => $commentUid,
                'newsuid' => $newsId,
                'username' => $commentRaw['username'] ?: 'Anonymous',
                'usermail' => $commentRaw['usermail'],
                'crdate' => $commentRaw['crdate'] ? date('Y-m-d H:i', $commentRaw['crdate']) : '',
                'description' => $commentRaw['description'] ?: '',
                'pinned' => (bool)$commentRaw['pinned'],
                'likes' => (int)$commentRaw['likes'], 
                'replies' => [],
                'parent' => $parentCommentId,
                'is_top_level' => empty($parentCommentId),
            ];

            if (!empty($parentCommentId)) {
                $repliesMap[$parentCommentId][] = $commentUid;
            }
        }
    
        $buildReplies = function ($comment) use (&$allComments, &$repliesMap, &$buildReplies) {
            $uid = $comment['uid'];
            if (!empty($repliesMap[$uid])) {
                foreach ($repliesMap[$uid] as $replyUid) {
                    if (isset($allComments[$replyUid])) {
                        $child = $allComments[$replyUid];
                        $comment['replies'][] = $buildReplies($child);
                    }
                }
            }
            return $comment;
        };
    
        $commentsByNews = [];
    
        foreach ($allComments as $comment) {
            if ($comment['is_top_level']) {
                $newsId = $comment['newsuid'];
                if (!isset($commentsByNews[$newsId])) {
                    $commentsByNews[$newsId] = [
                        'newsId' => $newsId,
                        'newsTitle' => '',
                        'comments' => []
                    ];
                }
                $commentsByNews[$newsId]['comments'][] = $buildReplies($comment);
            }
        }
    
        $validCommentsByNews = [];
        $formattedNewsList = [];
        
        foreach ($commentsByNews as $newsId => $newsItem) {
            $news = $this->newsRepository->findByUid($newsItem['newsId']);
            
            if (!$news) {
                continue;
            }
            
            usort(
                $newsItem['comments'],
                fn($a, $b) => ($b['pinned'] <=> $a['pinned']) ?: strtotime($b['crdate']) <=> strtotime($a['crdate'])
            );

            $newsItem['newsTitle'] = $news->getTitle();
            $newsItem['newsTeaser'] = $news->getTeaser();
            $validCommentsByNews[$newsId] = $newsItem;
            
            $formattedNewsList[] = [
                'uid' => $newsId,
                'title' => $news->getTitle(),
                'teaser' => $news->getTeaser(),
                'date' => date('Y-m-d H:i', $news->getCrdate()->getTimestamp()),
                'time' => $news->getCrdate()->getTimestamp(),
            ];
        }
        
        $commentsByNews = $validCommentsByNews;
    
        $this->view->assignMultiple([
            'newsList' => $formattedNewsList,
            'commentsByNews' => $commentsByNews,
        ]);
    
        return $this->htmlResponse();
    }

    /**
     * Show Only Replies Action 
     */
    public function showOnlyRepliesAction(int $newsUid, int $commentUid = 0): ResponseInterface
    {
        $queryParams = $this->request->getQueryParams();
        $requestedAction = $queryParams['tx_rdcomments_backendcomment']['action'] ?? '';
        $ajaxCommentUid = (int)($queryParams['tx_rdcomments_backendcomment']['commentUid'] ?? 0);
        
        if ($requestedAction === 'ajaxPin' && $ajaxCommentUid > 0) {
            return $this->handleAjaxPin($ajaxCommentUid);
        } elseif ($requestedAction === 'ajaxDelete' && $ajaxCommentUid > 0) {
            return $this->handleAjaxDelete($ajaxCommentUid);
        }
        
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tx_rdcomments_domain_model_comment');

        $commentsRaw = $queryBuilder
            ->select('*')
            ->from('tx_rdcomments_domain_model_comment')
            ->where(
                $queryBuilder->expr()->eq('deleted', 0),
                $queryBuilder->expr()->eq('hidden', 0),
                $queryBuilder->expr()->eq(
                    'newsuid',
                    $queryBuilder->createNamedParameter($newsUid,ParameterType::INTEGER)
                )
            )
            ->orderBy('crdate', 'ASC')
            ->executeQuery()
            ->fetchAllAssociative();

        $allComments = [];
        $repliesMap = [];

        foreach ($commentsRaw as $commentRaw) {
            $commentUidCurrent = (int)$commentRaw['uid'];
            $parentCommentId = (int)$commentRaw['comment'];

            $allComments[$commentUidCurrent] = [
                'uid' => $commentUidCurrent,
                'parent' => $parentCommentId,
                'username' => $commentRaw['username'] ?: 'Anonymous',
                'usermail' => $commentRaw['usermail'],
                'crdate' => $commentRaw['crdate'] ? date('Y-m-d H:i', $commentRaw['crdate']) : '',
                'description' => $commentRaw['description'] ?: '',
                'likes' => (int)$commentRaw['likes'],
                'pinned' => (bool)$commentRaw['pinned'],
                'replies' => [],
                'is_top_level' => empty($parentCommentId),
            ];

            if (!empty($parentCommentId)) {
                $repliesMap[$parentCommentId][] = $commentUidCurrent;
            }
        }

        $buildReplies = function ($comment) use (&$allComments, &$repliesMap, &$buildReplies) {
            $uid = $comment['uid'];
            if (!empty($repliesMap[$uid])) {
                foreach ($repliesMap[$uid] as $replyUid) {
                    if (isset($allComments[$replyUid])) {
                        $child = $allComments[$replyUid];
                        $comment['replies'][] = $buildReplies($child);
                    }
                }
            }
            return $comment;
        };

        $topLevelComments = [];
        foreach ($allComments as $comment) {
            if ($comment['is_top_level']) {
                $topLevelComments[] = $buildReplies($comment);
            }
        }

        if ($commentUid > 0) {
            $selectedComment = null;
            
            foreach ($topLevelComments as $comment) {
                if ($comment['uid'] == $commentUid) {
                    $selectedComment = $comment;
                    break;
                }
                
                $findComment = function ($comments, $targetUid) use (&$findComment) {
                    foreach ($comments as $c) {
                        if ($c['uid'] == $targetUid) {
                            return $c;
                        }
                        if (!empty($c['replies'])) {
                            $found = $findComment($c['replies'], $targetUid);
                            if ($found !== null) {
                                return $found;
                            }
                        }
                    }
                    return null;
                };
                
                $selectedComment = $findComment([$comment], $commentUid);
                if ($selectedComment !== null) {
                    break;
                }
            }
            
            $topLevelComments = $selectedComment ? [$selectedComment] : [];
        }

        $news = $this->newsRepository->findByUid($newsUid);

        $this->view->assignMultiple([
            'selectedArticle' => $news,
            'comments' => $topLevelComments,
            'selectedCommentUid' => $commentUid,
        ]);

        $this->view->setTemplatePathAndFilename(
            'EXT:rd_comments/Resources/Private/Partials/BackendComment/Replies.html'
        );

        return new HtmlResponse($this->view->render());
    }

    /**
     * Delete action 
     */
    public function deleteAction(int $commentUid): ResponseInterface
    {
        if (!$this->getBackendUser()->isAdmin()) {
            $this->addFlashMessage(
                'Insufficient permissions',
                'Error',
                ContextualFeedbackSeverity::ERROR
            );
            return $this->redirect('backendList');
        }

        $comment = $this->commentRepository->findByUid($commentUid);
        if ($comment instanceof Comment) {
            foreach ($comment->getChildcomment() ?? [] as $childComment) {
                $this->commentRepository->remove($childComment);
            }
            $this->commentRepository->remove($comment);
            $this->persistenceManager->persistAll();
            $this->addFlashMessage(
                LocalizationUtility::translate('comment_deleted_successfully', 'RdComments') ?? 'Comment deleted successfully.',
                'Success',
                ContextualFeedbackSeverity::OK
            );
        } else {
            $this->addFlashMessage(
                LocalizationUtility::translate('comment_not_found', 'RdComments') ?? 'Comment not found.',
                'Error',
                ContextualFeedbackSeverity::ERROR
            );
        }

        return $this->redirect('backendList');
    }

    /**
     * Pin action 
     */
    public function pinAction(int $commentUid): ResponseInterface
    {
        if (!$this->getBackendUser()->isAdmin()) {
            $this->addFlashMessage(
                'Insufficient permissions',
                'Error',
                ContextualFeedbackSeverity::ERROR
            );
            return $this->redirect('backendList');
        }

        $comment = $this->commentRepository->findByUid($commentUid);
        if ($comment instanceof Comment) {
            $comment->setPinned(!$comment->getPinned());
            $this->commentRepository->update($comment);
            $this->persistenceManager->persistAll();
            $message = $comment->getPinned() ? 'comment_pinned_successfully' : 'comment_unpinned_successfully';
            $this->addFlashMessage(
                LocalizationUtility::translate($message, 'RdComments') ?? $message,
                'Success',
                ContextualFeedbackSeverity::OK
            );
        } else {
            $this->addFlashMessage(
                LocalizationUtility::translate('comment_not_found', 'RdComments') ?? 'Comment not found.',
                'Error',
                ContextualFeedbackSeverity::ERROR
            );
        }

        return $this->redirect('backendList');
    }

    protected function getBackendUser(): \TYPO3\CMS\Core\Authentication\BackendUserAuthentication
    {
        return $GLOBALS['BE_USER'];
    }
}
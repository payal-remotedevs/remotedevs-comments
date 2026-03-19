<?php

declare(strict_types=1);

namespace RemoteDevs\RdComments\Controller;


use TYPO3\CMS\Core\Utility\GeneralUtility;
use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Core\Messaging\AbstractMessage;
use TYPO3\CMS\Extbase\Utility\LocalizationUtility;
use GeorgRinger\News\Domain\Repository\NewsRepository;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use RemoteDevs\RdComments\Domain\Model\Comment;
use RemoteDevs\RdComments\Domain\Repository\CommentRepository;

/**
 * This file is part of the "rd_comment" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2025 Abhay Rathod <abhay.remotedevs@gmail.com>, RemoteDevs
 */

/**
 * BackendCommentController
 */
class BackendCommentController extends ActionController
{
    protected ?CommentRepository $commentRepository = null;

    protected NewsRepository $newsRepository;

    protected PersistenceManager $persistenceManager;


    /**
     * @param CommentRepository $commentRepository
     */
    public function injectCommentRepository(CommentRepository $commentRepository)
    {
        $this->commentRepository = $commentRepository;
    }

    /**
     * @param PersistenceManager $persistenceManager
     */
    public function injectPersistenceManager(PersistenceManager $persistenceManager)
    {
        $this->persistenceManager = $persistenceManager;
    }

    /**
     * @param NewsRepository $newsRepository
     */
    public function injectNewsRepository(NewsRepository $newsRepository)
    {
        $this->newsRepository = $newsRepository;
    }

    /*
     * @param string $uri
     * @return string
     */
    public function backendListAction(): ResponseInterface
    {
        $queryBuilder = GeneralUtility::makeInstance(\TYPO3\CMS\Core\Database\ConnectionPool::class)
            ->getQueryBuilderForTable('tx_rdcomments_domain_model_comment');

        $commentsRaw = $queryBuilder
            ->select('*')
            ->from('tx_rdcomments_domain_model_comment')
            ->where(
                $queryBuilder->expr()->eq('deleted', 0),
                $queryBuilder->expr()->eq('hidden', 0)
            )
            ->addOrderBy('crdate', 'DESC')
            ->execute()  // Changed from executeQuery() to execute()
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

        foreach ($commentsByNews as &$newsItem) {
            usort($newsItem['comments'], fn($a, $b) => strtotime($b['crdate']) <=> strtotime($a['crdate']));
            $news = $this->newsRepository->findByUid($newsItem['newsId']);
            $newsItem['newsTitle'] = $news ? $news->getTitle() : 'News #' . $newsItem['newsId'] . ' (Not Found)';
        }
        
        $formattedNewsList = array_map(fn($newsItem) => [
            'uid' => $newsItem['newsId'],
            'title' => $newsItem['newsTitle']
        ], $commentsByNews);

        $this->view->assignMultiple([
            'newsList' => $formattedNewsList,
            'commentsByNews' => $commentsByNews,
        ]);

        return $this->htmlResponse();
    }

    /**
     * Delete action
     *
     * @param int $commentUid
     * @return ResponseInterface
     */
    public function deleteAction(int $commentUid): ResponseInterface
    {
        if (!$this->getBackendUser()->isAdmin()) {
            $this->addFlashMessage(
                'Insufficient permissions',
                'Error',
                AbstractMessage::ERROR
            );
            $this->redirect('backendList');
            return $this->htmlResponse();
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
                AbstractMessage::OK
            );
        } else {
            $this->addFlashMessage(
                LocalizationUtility::translate('comment_not_found', 'RdComments') ?? 'Comment not found.',
                'Error',
                AbstractMessage::ERROR
            );
        }

        $this->redirect('backendList');
        return $this->htmlResponse();
    }

    protected function getBackendUser(): \TYPO3\CMS\Core\Authentication\BackendUserAuthentication
    {
        return $GLOBALS['BE_USER'];
    }
}

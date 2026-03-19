<?php

declare(strict_types=1);

namespace RemoteDevs\RdComments\Controller;

use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Core\Environment;
use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Install\Service\SessionService;
use RemoteDevs\RdComments\Domain\Model\Comment;
use TYPO3\CMS\Core\Utility\VersionNumberUtility;
use GeorgRinger\News\Domain\Repository\NewsRepository;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use RemoteDevs\RdComments\Domain\Repository\CommentRepository;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;

/**
 * This file is part of the "rd_comment" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2025 karan anjara <karan.remotedevs@gmail.com>, RemoteDevs
 */

/**
 * CommentController
 */
class CommentController extends ActionController
{
    protected ?CommentRepository $CommentRepository = null;

    protected NewsRepository $newsRepository;

    protected PersistenceManager $persistenceManager;

    protected int $newsUid;

    protected int $pageUid;

    /**
     * @param PersistenceManager $PersistenceManager
     */
    public function injectPersistenceManager(PersistenceManager $persistenceManager)
    {
        $this->persistenceManager = $persistenceManager;
    }

    /**
     * @param CommentRepository $commentRepository
     */
    public function injectCommentRepository(CommentRepository $commentRepository)
    {
        $this->CommentRepository = $commentRepository;
    }

    /**
     * @param CommentRepository $CommentRepository
     * @param NewsRepository $newsRepository
     * @param PersistenceManager $persistenceManager
     */
    public function __construct(
        CommentRepository  $CommentRepository,
        PersistenceManager $persistenceManager,
        NewsRepository     $newsRepository
    ) {
        $this->CommentRepository = $CommentRepository;
        $this->persistenceManager = $persistenceManager;
        $this->newsRepository = $newsRepository;
    }

    /**
     * Initialize action
     */
    public function initializeAction(): void
    {
        $sessionService = GeneralUtility::makeInstance(SessionService::class);
        $sessionService->startSession();
        $this->typo3VersionArray = VersionNumberUtility::convertVersionStringToArray(VersionNumberUtility::getCurrentTypo3Version());
        $getData = $this->request->getQueryParams();
        $postData = $this->request->getParsedBody();
        $requestData = array_merge($getData, (array)$postData);
        $newsArr = $requestData['tx_news_pi1'] ?? [];
        $newsUid = '';
        if (is_null($newsArr)) {
            if (isset($_SESSION['params']) && $_SESSION['params']['originalSettings']['singleNews']) {
                $newsUid = $_SESSION['params']['originalSettings']['singleNews'];
            }
        } else {
            $newsUid = $newsArr['news'] ?? null;
        }
        $this->newsUid = (int)$newsUid;

        $this->pageUid = 0;
        if (isset($GLOBALS['TSFE']) && is_object($GLOBALS['TSFE']) && isset($GLOBALS['TSFE']->id)) {
            $this->pageUid = (int)$GLOBALS['TSFE']->id;
        }

        $extbaseFrameworkConfiguration = $this->configurationManager->getConfiguration(ConfigurationManagerInterface::CONFIGURATION_TYPE_FRAMEWORK);

        if (empty($extbaseFrameworkConfiguration['persistence']['storagePid'])) {
            if (isset($_REQUEST['tx_rdcomments_domain_model_comment']['Storagepid'])) {
                $currentPid['persistence']['storagePid'] = $_REQUEST['tx_rdcomments_domain_model_comment']['Storagepid'];
            } else {
                if (isset($this->settings['storagePid']) && !empty($this->settings['storagePid'])) {
                    $currentPid['persistence']['storagePid'] = $this->settings['storagePid'];
                } else {
                    $currentPid['persistence']['storagePid'] = $this->pageUid;
                }
            }
            $this->configurationManager->setConfiguration(array_merge($extbaseFrameworkConfiguration, $currentPid));
        }
    }

    /**
     * list action
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function listAction(): ResponseInterface
    {
        $extbaseFrameworkConfiguration = $this->configurationManager->getConfiguration(
            ConfigurationManagerInterface::CONFIGURATION_TYPE_FRAMEWORK
        );

        $pid = empty($extbaseFrameworkConfiguration['persistence']['storagePid'])
            ? $this->pageUid
            : $extbaseFrameworkConfiguration['persistence']['storagePid'];

        if ($this->newsUid) {
            $comments = $this->CommentRepository->getCommentsByNews($this->newsUid);
            $allComments = $comments instanceof \TYPO3\CMS\Extbase\Persistence\Generic\QueryResult
                ? $comments->toArray()
                : iterator_to_array($comments);

            // Step 1: Build a map of child comment UIDs
            $childCommentUids = [];
            foreach ($allComments as $comment) {
                foreach ($comment->getChildcomment() as $child) {
                    $childCommentUids[$child->getUid()] = true;
                }
            }

            // Step 2: Filter root-level comments (those not in child UID map)
            $rootComments = array_filter($allComments, function ($comment) use ($childCommentUids) {
                return !isset($childCommentUids[$comment->getUid()]);
            });


            // Assign to view
            $this->view->assignMultiple([
                'comments' => $rootComments,
                'newsID' => $this->newsUid,
                'pageid' => $this->pageUid,
                'pid' => $pid,
                'settings' => $this->settings,
            ]);
        }
        return $this->htmlResponse();
    }

    /**
     * create action
     *
     * @param \RemoteDevs\RdComments\Domain\Model\Comment $newComment
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function createAction(Comment $newComment): ResponseInterface
    {
        $requestData = $this->request->getArguments();

        $newComment->setCrdate(time());
        $language = GeneralUtility::makeInstance(Context::class)->getPropertyFromAspect('language', 'id');
        $newComment->setSysLanguageUid($language);

        $parentId = (int)($requestData['parentId']);

        if ($parentId > 0) {
            $childComment = $this->CommentRepository->findByUid($parentId);
            $childComment->addChildcomment($newComment);
            $this->CommentRepository->update($childComment);
        }

        $this->CommentRepository->add($newComment);
        $this->persistenceManager->persistAll();
        $news = $this->newsRepository->findByUid($newComment->getNewsuid());

        if ($news) {
            $paramLink = $this->buildUriByUid(
                $this->pageUid,
                $news,
                ['commentid' => $newComment->getUid()]
            );
            $newComment->setParamlink($paramLink);
            $this->CommentRepository->update($newComment);
            $this->persistenceManager->persistAll();
        }

        $json[$newComment->getUid()] = [
            'parentId' => $parentId,
            'comment' => 'comment',
        ];
        return $this->jsonResponse(json_encode($json));
    }

    /**
     * @param int $uid
     * @param string $news
     * @param array $arguments
     * @return string
     */
    private function buildUriByUid(int $uid, $news, array $arguments = []): string
    {
        $commentId = $arguments['commentid'];

        $excludeFromQueryString = [
            'tx_rdcomment_newscomments[action]',
            'tx_rdcomment_newscomments[controller]',
            'tx_rdcomment_newscomments',
            'type'
        ];

        $this->uriBuilder
            ->reset()
            ->setTargetPageUid($uid)
            ->setAddQueryString(true)
            ->setArgumentsToBeExcludedFromQueryString($excludeFromQueryString)
            ->setSection('comments-' . $commentId);

        $uri = $this->uriBuilder->uriFor('detail', ['news' => $news], 'News', 'News', 'Pi1');

        return $this->addBaseUriIfNecessary($uri);
    }

    /**
     * @param string $uri
     * @return string
     */
    protected function addBaseUriIfNecessary($uri): string
    {
        if (PathUtility::isAbsolutePath($uri) || preg_match('#^(\w+:)?//#', $uri)) {
            return $uri;
        }

        $baseUri = '';
        if (isset($GLOBALS['TSFE']) && is_object($GLOBALS['TSFE'])) {
            $baseUri = $GLOBALS['TSFE']->getSite()->getBase()->__toString();
        } elseif (Environment::isCli()) {
            $baseUri = '/';
        } else {
            $request = $GLOBALS['TYPO3_REQUEST'] ?? null;
            if ($request instanceof \Psr\Http\Message\ServerRequestInterface) {
                $baseUri = $request->getUri()->__toString();
            }
        }

        return rtrim($baseUri, '/') . '/' . ltrim($uri, '/');
    }
}

<?php

namespace PhoenixPanel\Services\Nodes;

use PhoenixPanel\Models\Node;
use Illuminate\Contracts\Translation\Translator;
use PhoenixPanel\Contracts\Repository\NodeRepositoryInterface;
use PhoenixPanel\Exceptions\Service\HasActiveServersException;
use PhoenixPanel\Contracts\Repository\ServerRepositoryInterface;

class NodeDeletionService
{
    /**
     * NodeDeletionService constructor.
     */
    public function __construct(
        protected NodeRepositoryInterface $repository,
        protected ServerRepositoryInterface $serverRepository,
        protected Translator $translator
    ) {
    }

    /**
     * Delete a node from the panel if no servers are attached to it.
     *
     * @throws \PhoenixPanel\Exceptions\Service\HasActiveServersException
     */
    public function handle(int|Node $node): int
    {
        if ($node instanceof Node) {
            $node = $node->id;
        }

        $servers = $this->serverRepository->setColumns('id')->findCountWhere([['node_id', '=', $node]]);
        if ($servers > 0) {
            throw new HasActiveServersException($this->translator->get('exceptions.node.servers_attached'));
        }

        return $this->repository->delete($node);
    }
}

<?php

namespace PhoenixPanel\Repositories\Wings;

use Webmozart\Assert\Assert;
use PhoenixPanel\Models\Server;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Exception\TransferException;
use PhoenixPanel\Exceptions\Http\Connection\DaemonConnectionException;

class DaemonPowerRepository extends DaemonRepository
{
    /**
     * Sends a power action to the server instance.
     *
     * @throws \PhoenixPanel\Exceptions\Http\Connection\DaemonConnectionException
     */
    public function send(string $action): ResponseInterface
    {
        Assert::isInstanceOf($this->server, Server::class);

        try {
            return $this->getHttpClient()->post(
                sprintf('/api/servers/%s/power', $this->server->uuid),
                ['json' => ['action' => $action]]
            );
        } catch (TransferException $exception) {
            throw new DaemonConnectionException($exception);
        }
    }
}



<?php

namespace Phoenixpanel\Repositories\Wings;

use Webmozart\Assert\Assert;
use Phoenixpanel\Models\Server;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Exception\TransferException;
use Phoenixpanel\Exceptions\Http\Connection\DaemonConnectionException;

/**
 * @method \Phoenixpanel\Repositories\Wings\DaemonPowerRepository setNode(\Phoenixpanel\Models\Node $node)
 * @method \Phoenixpanel\Repositories\Wings\DaemonPowerRepository setServer(\Phoenixpanel\Models\Server $server)
 */
class DaemonPowerRepository extends DaemonRepository
{
    /**
     * Sends a power action to the server instance.
     *
     * @throws DaemonConnectionException
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

<?php

namespace PhoenixPanel\Repositories\Wings;

use PhoenixPanel\Models\Node;
use Lcobucci\JWT\Token\Plain;
use GuzzleHttp\Exception\GuzzleException;
use PhoenixPanel\Exceptions\Http\Connection\DaemonConnectionException;

class DaemonTransferRepository extends DaemonRepository
{
    /**
     * @throws \PhoenixPanel\Exceptions\Http\Connection\DaemonConnectionException
     */
    public function notify(Node $targetNode, Plain $token): void
    {
        try {
            $this->getHttpClient()->post(sprintf('/api/servers/%s/transfer', $this->server->uuid), [
                'json' => [
                    'server_id' => $this->server->uuid,
                    'url' => $targetNode->getConnectionAddress() . '/api/transfers',
                    'token' => 'Bearer ' . $token->toString(),
                    'server' => [
                        'uuid' => $this->server->uuid,
                        'start_on_completion' => false,
                    ],
                ],
            ]);
        } catch (GuzzleException $exception) {
            throw new DaemonConnectionException($exception);
        }
    }
}



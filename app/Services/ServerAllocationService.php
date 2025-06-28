<?php

namespace App\Services;

use Exception;

class ServerAllocationService
{
    /**
     * Allocates ports to a server.
     *
     * @param object $server The server object.
     * @param int $numPorts The number of ports to allocate.
     * @return array An array of allocated ports.
     * @throws Exception If there are not enough available ports.
     */
    public function allocatePorts($server, int $numPorts): array
    {
        $nodeId = $server->node_id;

        $availableAllocations = Allocation::where('node_id', $nodeId)
            ->where('allocated', false)
            ->limit($numPorts)
            ->get();

        if ($availableAllocations->count() < $numPorts) {
            throw new \Exception("Not enough available allocations on node {$nodeId}."); //Using Exception instead of DisplayException as it's not defined in the provided code
        }

        $allocatedPorts = $availableAllocations->map(function ($allocation) {
            $allocation->allocated = true;
            $allocation->save();
            return $allocation->port;
        })->toArray();

        return $allocatedPorts;
    }

    /**
     * Finds an available port.
     *
     * @return int The available port.
     * @throws Exception If no available ports are found.
     */
    private function findAvailablePort(): int
    {
        // In a real-world scenario, this would involve checking for available ports.
        // For this example, we'll just return a random port.
        // This is a placeholder and should be replaced with actual port allocation logic.
        return rand(1024, 65535);
    }
}
<?php

namespace PhoenixPanel\Services\Locations;

use PhoenixPanel\Models\Location;
use PhoenixPanel\Contracts\Repository\LocationRepositoryInterface;

class LocationUpdateService
{
    /**
     * LocationUpdateService constructor.
     */
    public function __construct(protected LocationRepositoryInterface $repository)
    {
    }

    /**
     * Update an existing location.
     *
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function handle(Location|int $location, array $data): Location
    {
        $location = ($location instanceof Location) ? $location->id : $location;

        return $this->repository->update($location, $data);
    }
}

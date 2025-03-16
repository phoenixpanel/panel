<?php

namespace Phoenixpanel\Contracts\Repository;

interface SettingsRepositoryInterface extends RepositoryInterface
{
    /**
     * Store a new persistent setting in the database.
     *
     * @throws \Phoenixpanel\Exceptions\Model\DataValidationException
     * @throws \Phoenixpanel\Exceptions\Repository\RecordNotFoundException
     */
    public function set(string $key, ?string $value = null);

    /**
     * Retrieve a persistent setting from the database.
     */
    public function get(string $key, mixed $default): mixed;

    /**
     * Remove a key from the database cache.
     */
    public function forget(string $key);
}

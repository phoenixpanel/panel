<?php

namespace PhoenixPanel\Contracts\Repository;

use PhoenixPanel\Models\Subuser;

interface SubuserRepositoryInterface extends RepositoryInterface
{
    /**
     * Return a subuser with the associated server relationship.
     */
    public function loadServerAndUserRelations(Subuser $subuser, bool $refresh = false): Subuser;

    /**
     * Return a subuser with the associated permissions relationship.
     */
    public function getWithPermissions(Subuser $subuser, bool $refresh = false): Subuser;

    /**
     * Return a subuser and associated permissions given a user_id and server_id.
     *
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function getWithPermissionsUsingUserAndServer(int $user, int $server): Subuser;
}



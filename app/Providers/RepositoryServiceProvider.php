<?php

namespace PhoenixPanel\Providers;

use Illuminate\Support\ServiceProvider;
use PhoenixPanel\Repositories\Eloquent\EggRepository;
use PhoenixPanel\Repositories\Eloquent\NestRepository;
use PhoenixPanel\Repositories\Eloquent\NodeRepository;
use PhoenixPanel\Repositories\Eloquent\TaskRepository;
use PhoenixPanel\Repositories\Eloquent\UserRepository;
use PhoenixPanel\Repositories\Eloquent\ApiKeyRepository;
use PhoenixPanel\Repositories\Eloquent\ServerRepository;
use PhoenixPanel\Repositories\Eloquent\SessionRepository;
use PhoenixPanel\Repositories\Eloquent\SubuserRepository;
use PhoenixPanel\Repositories\Eloquent\DatabaseRepository;
use PhoenixPanel\Repositories\Eloquent\LocationRepository;
use PhoenixPanel\Repositories\Eloquent\ScheduleRepository;
use PhoenixPanel\Repositories\Eloquent\SettingsRepository;
use PhoenixPanel\Repositories\Eloquent\AllocationRepository;
use PhoenixPanel\Contracts\Repository\EggRepositoryInterface;
use PhoenixPanel\Repositories\Eloquent\EggVariableRepository;
use PhoenixPanel\Contracts\Repository\NestRepositoryInterface;
use PhoenixPanel\Contracts\Repository\NodeRepositoryInterface;
use PhoenixPanel\Contracts\Repository\TaskRepositoryInterface;
use PhoenixPanel\Contracts\Repository\UserRepositoryInterface;
use PhoenixPanel\Repositories\Eloquent\DatabaseHostRepository;
use PhoenixPanel\Contracts\Repository\ApiKeyRepositoryInterface;
use PhoenixPanel\Contracts\Repository\ServerRepositoryInterface;
use PhoenixPanel\Repositories\Eloquent\ServerVariableRepository;
use PhoenixPanel\Contracts\Repository\SessionRepositoryInterface;
use PhoenixPanel\Contracts\Repository\SubuserRepositoryInterface;
use PhoenixPanel\Contracts\Repository\DatabaseRepositoryInterface;
use PhoenixPanel\Contracts\Repository\LocationRepositoryInterface;
use PhoenixPanel\Contracts\Repository\ScheduleRepositoryInterface;
use PhoenixPanel\Contracts\Repository\SettingsRepositoryInterface;
use PhoenixPanel\Contracts\Repository\AllocationRepositoryInterface;
use PhoenixPanel\Contracts\Repository\EggVariableRepositoryInterface;
use PhoenixPanel\Contracts\Repository\DatabaseHostRepositoryInterface;
use PhoenixPanel\Contracts\Repository\ServerVariableRepositoryInterface;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register all the repository bindings.
     */
    public function register(): void
    {
        // Eloquent Repositories
        $this->app->bind(AllocationRepositoryInterface::class, AllocationRepository::class);
        $this->app->bind(ApiKeyRepositoryInterface::class, ApiKeyRepository::class);
        $this->app->bind(DatabaseRepositoryInterface::class, DatabaseRepository::class);
        $this->app->bind(DatabaseHostRepositoryInterface::class, DatabaseHostRepository::class);
        $this->app->bind(EggRepositoryInterface::class, EggRepository::class);
        $this->app->bind(EggVariableRepositoryInterface::class, EggVariableRepository::class);
        $this->app->bind(LocationRepositoryInterface::class, LocationRepository::class);
        $this->app->bind(NestRepositoryInterface::class, NestRepository::class);
        $this->app->bind(NodeRepositoryInterface::class, NodeRepository::class);
        $this->app->bind(ScheduleRepositoryInterface::class, ScheduleRepository::class);
        $this->app->bind(ServerRepositoryInterface::class, ServerRepository::class);
        $this->app->bind(ServerVariableRepositoryInterface::class, ServerVariableRepository::class);
        $this->app->bind(SessionRepositoryInterface::class, SessionRepository::class);
        $this->app->bind(SettingsRepositoryInterface::class, SettingsRepository::class);
        $this->app->bind(SubuserRepositoryInterface::class, SubuserRepository::class);
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }
}



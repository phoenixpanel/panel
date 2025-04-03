<?php

namespace PheonixPanel\Providers;

use Illuminate\Support\ServiceProvider;
use PheonixPanel\Repositories\Eloquent\EggRepository;
use PheonixPanel\Repositories\Eloquent\NestRepository;
use PheonixPanel\Repositories\Eloquent\NodeRepository;
use PheonixPanel\Repositories\Eloquent\TaskRepository;
use PheonixPanel\Repositories\Eloquent\UserRepository;
use PheonixPanel\Repositories\Eloquent\ApiKeyRepository;
use PheonixPanel\Repositories\Eloquent\ServerRepository;
use PheonixPanel\Repositories\Eloquent\SessionRepository;
use PheonixPanel\Repositories\Eloquent\SubuserRepository;
use PheonixPanel\Repositories\Eloquent\DatabaseRepository;
use PheonixPanel\Repositories\Eloquent\LocationRepository;
use PheonixPanel\Repositories\Eloquent\ScheduleRepository;
use PheonixPanel\Repositories\Eloquent\SettingsRepository;
use PheonixPanel\Repositories\Eloquent\AllocationRepository;
use PheonixPanel\Contracts\Repository\EggRepositoryInterface;
use PheonixPanel\Repositories\Eloquent\EggVariableRepository;
use PheonixPanel\Contracts\Repository\NestRepositoryInterface;
use PheonixPanel\Contracts\Repository\NodeRepositoryInterface;
use PheonixPanel\Contracts\Repository\TaskRepositoryInterface;
use PheonixPanel\Contracts\Repository\UserRepositoryInterface;
use PheonixPanel\Repositories\Eloquent\DatabaseHostRepository;
use PheonixPanel\Contracts\Repository\ApiKeyRepositoryInterface;
use PheonixPanel\Contracts\Repository\ServerRepositoryInterface;
use PheonixPanel\Repositories\Eloquent\ServerVariableRepository;
use PheonixPanel\Contracts\Repository\SessionRepositoryInterface;
use PheonixPanel\Contracts\Repository\SubuserRepositoryInterface;
use PheonixPanel\Contracts\Repository\DatabaseRepositoryInterface;
use PheonixPanel\Contracts\Repository\LocationRepositoryInterface;
use PheonixPanel\Contracts\Repository\ScheduleRepositoryInterface;
use PheonixPanel\Contracts\Repository\SettingsRepositoryInterface;
use PheonixPanel\Contracts\Repository\AllocationRepositoryInterface;
use PheonixPanel\Contracts\Repository\EggVariableRepositoryInterface;
use PheonixPanel\Contracts\Repository\DatabaseHostRepositoryInterface;
use PheonixPanel\Contracts\Repository\ServerVariableRepositoryInterface;

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

<?php

namespace Phoenixpanel\Providers;

use Illuminate\Support\ServiceProvider;
use Phoenixpanel\Repositories\Eloquent\EggRepository;
use Phoenixpanel\Repositories\Eloquent\NestRepository;
use Phoenixpanel\Repositories\Eloquent\NodeRepository;
use Phoenixpanel\Repositories\Eloquent\TaskRepository;
use Phoenixpanel\Repositories\Eloquent\UserRepository;
use Phoenixpanel\Repositories\Eloquent\ApiKeyRepository;
use Phoenixpanel\Repositories\Eloquent\ServerRepository;
use Phoenixpanel\Repositories\Eloquent\SessionRepository;
use Phoenixpanel\Repositories\Eloquent\SubuserRepository;
use Phoenixpanel\Repositories\Eloquent\DatabaseRepository;
use Phoenixpanel\Repositories\Eloquent\LocationRepository;
use Phoenixpanel\Repositories\Eloquent\ScheduleRepository;
use Phoenixpanel\Repositories\Eloquent\SettingsRepository;
use Phoenixpanel\Repositories\Eloquent\AllocationRepository;
use Phoenixpanel\Contracts\Repository\EggRepositoryInterface;
use Phoenixpanel\Repositories\Eloquent\EggVariableRepository;
use Phoenixpanel\Contracts\Repository\NestRepositoryInterface;
use Phoenixpanel\Contracts\Repository\NodeRepositoryInterface;
use Phoenixpanel\Contracts\Repository\TaskRepositoryInterface;
use Phoenixpanel\Contracts\Repository\UserRepositoryInterface;
use Phoenixpanel\Repositories\Eloquent\DatabaseHostRepository;
use Phoenixpanel\Contracts\Repository\ApiKeyRepositoryInterface;
use Phoenixpanel\Contracts\Repository\ServerRepositoryInterface;
use Phoenixpanel\Repositories\Eloquent\ServerVariableRepository;
use Phoenixpanel\Contracts\Repository\SessionRepositoryInterface;
use Phoenixpanel\Contracts\Repository\SubuserRepositoryInterface;
use Phoenixpanel\Contracts\Repository\DatabaseRepositoryInterface;
use Phoenixpanel\Contracts\Repository\LocationRepositoryInterface;
use Phoenixpanel\Contracts\Repository\ScheduleRepositoryInterface;
use Phoenixpanel\Contracts\Repository\SettingsRepositoryInterface;
use Phoenixpanel\Contracts\Repository\AllocationRepositoryInterface;
use Phoenixpanel\Contracts\Repository\EggVariableRepositoryInterface;
use Phoenixpanel\Contracts\Repository\DatabaseHostRepositoryInterface;
use Phoenixpanel\Contracts\Repository\ServerVariableRepositoryInterface;

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

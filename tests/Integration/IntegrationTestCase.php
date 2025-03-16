<?php

namespace Phoenixpanel\Tests\Integration;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Phoenixpanel\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Phoenixpanel\Events\ActivityLogged;
use Phoenixpanel\Tests\Assertions\AssertsActivityLogged;
use Phoenixpanel\Tests\Traits\Integration\CreatesTestModels;
use Phoenixpanel\Transformers\Api\Application\BaseTransformer;

abstract class IntegrationTestCase extends TestCase
{
    use CreatesTestModels;
    use AssertsActivityLogged;

    protected array $connectionsToTransact = ['mysql'];

    protected $defaultHeaders = [
        'Accept' => 'application/json',
    ];

    public function setUp(): void
    {
        parent::setUp();

        Event::fake(ActivityLogged::class);
    }

    /**
     * Return an ISO-8601 formatted timestamp to use in the API response.
     */
    protected function formatTimestamp(string $timestamp): string
    {
        return CarbonImmutable::createFromFormat(CarbonInterface::DEFAULT_TO_STRING_FORMAT, $timestamp)
            ->setTimezone(BaseTransformer::RESPONSE_TIMEZONE)
            ->toAtomString();
    }
}

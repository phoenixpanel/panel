<?php

namespace PhoenixPanel\Tests\Integration\Api\Client\Server\Allocation;

use Illuminate\Http\Response;
use PhoenixPanel\Models\Allocation;
use PhoenixPanel\Models\Permission;
use PhoenixPanel\Tests\Integration\Api\Client\ClientApiIntegrationTestCase;

class CreateNewAllocationTest extends ClientApiIntegrationTestCase
{
    /**
     * Setup tests.
     */
    public function setUp(): void
    {
        parent::setUp();

        config()->set('phoenixpanel.client_features.allocations.enabled', true);
        config()->set('phoenixpanel.client_features.allocations.range_start', 5000);
        config()->set('phoenixpanel.client_features.allocations.range_end', 5050);
    }

    /**
     * Tests that a new allocation can be properly assigned to a server.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('permissionDataProvider')]
    public function testNewAllocationCanBeAssignedToServer(array $permission)
    {
        /** @var \PhoenixPanel\Models\Server $server */
        [$user, $server] = $this->generateTestAccount($permission);
        $server->update(['allocation_limit' => 2]);

        $response = $this->actingAs($user)->postJson($this->link($server, '/network/allocations'));
        $response->assertJsonPath('object', Allocation::RESOURCE_NAME);

        $matched = Allocation::query()->findOrFail($response->json('attributes.id'));

        $this->assertSame($server->id, $matched->server_id);
        $this->assertJsonTransformedWith($response->json('attributes'), $matched);
    }

    /**
     * Test that a user without the required permissions cannot create an allocation for
     * the server instance.
     */
    public function testAllocationCannotBeCreatedIfUserDoesNotHavePermission()
    {
        /** @var \PhoenixPanel\Models\Server $server */
        [$user, $server] = $this->generateTestAccount([Permission::ACTION_ALLOCATION_UPDATE]);
        $server->update(['allocation_limit' => 2]);

        $this->actingAs($user)->postJson($this->link($server, '/network/allocations'))->assertForbidden();
    }

    /**
     * Test that an error is returned to the user if this feature is not enabled on the system.
     */
    public function testAllocationCannotBeCreatedIfNotEnabled()
    {
        config()->set('phoenixpanel.client_features.allocations.enabled', false);

        /** @var \PhoenixPanel\Models\Server $server */
        [$user, $server] = $this->generateTestAccount();
        $server->update(['allocation_limit' => 2]);

        $this->actingAs($user)->postJson($this->link($server, '/network/allocations'))
            ->assertStatus(Response::HTTP_BAD_REQUEST)
            ->assertJsonPath('errors.0.code', 'AutoAllocationNotEnabledException')
            ->assertJsonPath('errors.0.detail', 'Server auto-allocation is not enabled for this instance.');
    }

    /**
     * Test that an allocation cannot be created if the server has reached its allocation limit.
     */
    public function testAllocationCannotBeCreatedIfServerIsAtLimit()
    {
        /** @var \PhoenixPanel\Models\Server $server */
        [$user, $server] = $this->generateTestAccount();
        $server->update(['allocation_limit' => 1]);

        $this->actingAs($user)->postJson($this->link($server, '/network/allocations'))
            ->assertStatus(Response::HTTP_BAD_REQUEST)
            ->assertJsonPath('errors.0.code', 'DisplayException')
            ->assertJsonPath('errors.0.detail', 'Cannot assign additional allocations to this server: limit has been reached.');
    }

    public static function permissionDataProvider(): array
    {
        return [[[Permission::ACTION_ALLOCATION_CREATE]], [[]]];
    }
}

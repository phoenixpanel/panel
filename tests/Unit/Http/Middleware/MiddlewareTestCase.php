<?php

namespace Phoenixpanel\Tests\Unit\Http\Middleware;

use Phoenixpanel\Tests\TestCase;
use Phoenixpanel\Tests\Traits\Http\RequestMockHelpers;
use Phoenixpanel\Tests\Traits\Http\MocksMiddlewareClosure;
use Phoenixpanel\Tests\Assertions\MiddlewareAttributeAssertionsTrait;

abstract class MiddlewareTestCase extends TestCase
{
    use MiddlewareAttributeAssertionsTrait;
    use MocksMiddlewareClosure;
    use RequestMockHelpers;

    /**
     * Setup tests with a mocked request object and normal attributes.
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->buildRequestMock();
    }
}

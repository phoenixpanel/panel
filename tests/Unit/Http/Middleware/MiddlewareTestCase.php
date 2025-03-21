<?php

namespace PhoenixPanel\Tests\Unit\Http\Middleware;

use PhoenixPanel\Tests\TestCase;
use PhoenixPanel\Tests\Traits\Http\RequestMockHelpers;
use PhoenixPanel\Tests\Traits\Http\MocksMiddlewareClosure;
use PhoenixPanel\Tests\Assertions\MiddlewareAttributeAssertionsTrait;

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

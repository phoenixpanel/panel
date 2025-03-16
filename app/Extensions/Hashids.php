<?php

namespace Phoenixpanel\Extensions;

use Hashids\Hashids as VendorHashids;
use Phoenixpanel\Contracts\Extensions\HashidsInterface;

class Hashids extends VendorHashids implements HashidsInterface
{
    public function decodeFirst(string $encoded, ?string $default = null): mixed
    {
        $result = $this->decode($encoded);
        if (!is_array($result)) {
            return $default;
        }

        return array_first($result, null, $default);
    }
}

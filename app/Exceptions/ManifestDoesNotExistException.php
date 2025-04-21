<?php

namespace PhoenixPanel\Exceptions;

/**
 * This exception is no longer used as AssetHashService has been updated
 * to handle missing manifest files gracefully without throwing exceptions.
 * 
 * Kept for backward compatibility.
 */
class ManifestDoesNotExistException extends \Exception
{
    // This class is kept for backward compatibility
}

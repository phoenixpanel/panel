<?php

namespace PhoenixPanel\Models;

/**
 * @property int $id
 * @property bool $enabled
 * @property string|null $top_ad_code
 * @property string|null $bottom_ad_code
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class AdSetting extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'ad_settings';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'enabled',
        'top_ad_code',
        'bottom_ad_code',
    ];

    /**
     * Cast values to correct type.
     */
    protected $casts = [
        'enabled' => 'boolean',
    ];

    /**
     * Get the current ad settings.
     */
    public static function getSettings(): self
    {
        return self::first() ?? self::create([
            'enabled' => false,
            'top_ad_code' => '',
            'bottom_ad_code' => '',
        ]);
    }
}
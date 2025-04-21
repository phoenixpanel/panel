<?php

namespace PhoenixPanel\Models;

use Illuminate\Database\Eloquent\Model;

class AdSetting extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ad_settings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'enabled',
        'header_ad_code',
        'sidebar_ad_code',
        'footer_ad_code',
        'content_ad_code',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'enabled' => 'boolean',
    ];
}
<?php

namespace PhoenixPanel\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdVariant extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'placement_id',
        'name',
        'ad_code',
        'weight',
        'is_control',
        'impressions',
        'clicks',
        'revenue',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'placement_id' => 'integer',
        'weight' => 'integer',
        'is_control' => 'boolean',
        'impressions' => 'integer',
        'clicks' => 'integer',
        'revenue' => 'float',
    ];

    /**
     * Get the placement that this variant belongs to.
     */
    public function placement(): BelongsTo
    {
        return $this->belongsTo(AdPlacement::class, 'placement_id');
    }

    /**
     * Get the click-through rate (CTR) for this variant.
     *
     * @return float
     */
    public function getCtrAttribute(): float
    {
        if ($this->impressions === 0) {
            return 0;
        }

        return ($this->clicks / $this->impressions) * 100;
    }

    /**
     * Get the effective cost per mille (eCPM) for this variant.
     *
     * @return float
     */
    public function getEcpmAttribute(): float
    {
        if ($this->impressions === 0) {
            return 0;
        }

        return ($this->revenue / $this->impressions) * 1000;
    }

    /**
     * Record an impression for this variant.
     */
    public function recordImpression(): void
    {
        $this->increment('impressions');
    }

    /**
     * Record a click for this variant.
     */
    public function recordClick(): void
    {
        $this->increment('clicks');
    }

    /**
     * Record revenue for this variant.
     *
     * @param float $amount
     */
    public function recordRevenue(float $amount): void
    {
        $this->increment('revenue', $amount);
    }

    /**
     * Compare this variant's performance with another variant.
     *
     * @param AdVariant $otherVariant
     * @return array
     */
    public function compareWith(AdVariant $otherVariant): array
    {
        $ctrDiff = $this->getCtrAttribute() - $otherVariant->getCtrAttribute();
        $ctrPercentChange = $otherVariant->getCtrAttribute() > 0 
            ? ($ctrDiff / $otherVariant->getCtrAttribute()) * 100 
            : 0;

        $ecpmDiff = $this->getEcpmAttribute() - $otherVariant->getEcpmAttribute();
        $ecpmPercentChange = $otherVariant->getEcpmAttribute() > 0 
            ? ($ecpmDiff / $otherVariant->getEcpmAttribute()) * 100 
            : 0;

        return [
            'ctr_diff' => $ctrDiff,
            'ctr_percent_change' => $ctrPercentChange,
            'ecpm_diff' => $ecpmDiff,
            'ecpm_percent_change' => $ecpmPercentChange,
            'is_better' => ($ctrDiff > 0 && $ecpmDiff > 0),
        ];
    }
}
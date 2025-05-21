<?php

namespace PhoenixPanel\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdPlacement extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'page_url',
        'x',
        'y',
        'width',
        'height',
        'device_targeting',
        'is_active',
        'start_date',
        'end_date',
        'recurring_schedule',
        'time_of_day_targeting',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'device_targeting' => 'array',
        'is_active' => 'boolean',
        'x' => 'integer',
        'y' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'recurring_schedule' => 'array',
        'time_of_day_targeting' => 'array',
    ];

    /**
     * Get the variants for this placement.
     */
    public function variants(): HasMany
    {
        return $this->hasMany(AdVariant::class, 'placement_id');
    }

    /**
     * Get the control variant for this placement.
     */
    public function controlVariant()
    {
        return $this->variants()->where('is_control', true)->first();
    }

    /**
     * Get a random variant based on weight distribution.
     */
    public function getRandomVariant()
    {
        $variants = $this->variants()->get();
        
        // If no variants, return null
        if ($variants->isEmpty()) {
            return null;
            /**
             * Check if the placement is currently active based on its schedule.
             *
             * @return bool
             */
            public function isScheduleActive(): bool
            {
                // If no scheduling is set, rely only on the is_active flag
                if (!$this->start_date && !$this->end_date &&
                    (!$this->recurring_schedule || empty($this->recurring_schedule)) &&
                    (!$this->time_of_day_targeting || empty($this->time_of_day_targeting))) {
                    return $this->is_active;
                }
        
                // Check if the placement is active
                if (!$this->is_active) {
                    return false;
                }
        
                $now = now();
                
                // Check start and end dates
                if ($this->start_date && $now->lt($this->start_date)) {
                    return false;
                }
                
                if ($this->end_date && $now->gt($this->end_date)) {
                    return false;
                }
                
                // Check recurring schedule (day of week)
                if ($this->recurring_schedule && !empty($this->recurring_schedule)) {
                    $currentDayOfWeek = strtolower($now->format('l')); // e.g., 'monday', 'tuesday', etc.
                    
                    if (!in_array($currentDayOfWeek, $this->recurring_schedule)) {
                        return false;
                    }
                }
                
                // Check time of day targeting
                if ($this->time_of_day_targeting && !empty($this->time_of_day_targeting)) {
                    $currentHour = (int) $now->format('G'); // 24-hour format without leading zeros
                    
                    if (!in_array($currentHour, $this->time_of_day_targeting)) {
                        return false;
                    }
                }
                
                return true;
            }
            
            /**
             * Get the next scheduled activation time.
             *
             * @return \Carbon\Carbon|null
             */
            public function getNextActivationTime()
            {
                if (!$this->is_active) {
                    return null;
                }
                
                $now = now();
                
                // If we have a start date in the future
                if ($this->start_date && $now->lt($this->start_date)) {
                    return $this->start_date;
                }
                
                // If we have recurring schedule or time of day targeting
                if (($this->recurring_schedule && !empty($this->recurring_schedule)) ||
                    ($this->time_of_day_targeting && !empty($this->time_of_day_targeting))) {
                    
                    // Start checking from now
                    $checkTime = $now->copy();
                    
                    // Check the next 7 days (to handle weekly schedules)
                    for ($i = 0; $i < 7; $i++) {
                        $dayOfWeek = strtolower($checkTime->format('l'));
                        $hour = (int) $checkTime->format('G');
                        
                        // If no recurring schedule or this day is in the schedule
                        $dayMatches = !$this->recurring_schedule ||
                                      empty($this->recurring_schedule) ||
                                      in_array($dayOfWeek, $this->recurring_schedule);
                        
                        if ($dayMatches) {
                            // If we have time of day targeting
                            if ($this->time_of_day_targeting && !empty($this->time_of_day_targeting)) {
                                // Find the next valid hour
                                foreach ($this->time_of_day_targeting as $targetHour) {
                                    if ($targetHour > $hour) {
                                        // Return today at this hour
                                        return $checkTime->copy()->setHour($targetHour)->setMinute(0)->setSecond(0);
                                    }
                                }
                            } else {
                                // No time restrictions, so it's active all day
                                if ($i === 0 && $checkTime->format('Y-m-d') === $now->format('Y-m-d')) {
                                    // It's already active today
                                    return $now;
                                } else {
                                    // Return the start of this day
                                    return $checkTime->copy()->setHour(0)->setMinute(0)->setSecond(0);
                                }
                            }
                        }
                        
                        // Move to the next day
                        $checkTime->addDay()->setHour(0)->setMinute(0)->setSecond(0);
                    }
                }
                
                return null;
            }
        }
        
        // If only one variant, return it
        if ($variants->count() === 1) {
            return $variants->first();
        }
        
        // Calculate total weight
        $totalWeight = $variants->sum('weight');
        
        // Get a random number between 0 and total weight
        $randomWeight = mt_rand(1, $totalWeight);
        
        // Find the variant that corresponds to the random weight
        $currentWeight = 0;
        foreach ($variants as $variant) {
            $currentWeight += $variant->weight;
            if ($randomWeight <= $currentWeight) {
                return $variant;
            }
        }
        
        // Fallback to the first variant (should not happen)
        return $variants->first();
    }
}
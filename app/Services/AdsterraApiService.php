<?php

namespace PhoenixPanel\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use PhoenixPanel\Repositories\Eloquent\SettingsRepository;

class AdsterraApiService
{
    /**
     * @var \GuzzleHttp\Client
     */
    protected $client;

    /**
     * @var \PhoenixPanel\Repositories\Eloquent\SettingsRepository
     */
    protected $settings;

    /**
     * @var string
     */
    protected $apiKey;

    /**
     * @var string
     */
    protected $apiBaseUrl = 'https://api.adsterra.com/v1';

    /**
     * AdsterraApiService constructor.
     *
     * @param \PhoenixPanel\Repositories\Eloquent\SettingsRepository $settings
     */
    public function __construct(SettingsRepository $settings)
    {
        $this->settings = $settings;
        $this->apiKey = $settings->get('phoenixpanel:ads:api_key');
        
        $this->client = new Client([
            'base_uri' => $this->apiBaseUrl,
            'timeout' => config('phoenixpanel.guzzle.timeout', 15),
            'connect_timeout' => config('phoenixpanel.guzzle.connect_timeout', 5),
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    /**
     * Check if the API key is set.
     *
     * @return bool
     */
    public function hasApiKey(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Fetch performance metrics for a specific date range.
     *
     * @param string $startDate Format: YYYY-MM-DD
     * @param string $endDate Format: YYYY-MM-DD
     * @param string|null $placementId Optional placement ID to filter by
     * @return array
     */
    public function getMetrics(string $startDate, string $endDate, ?string $placementId = null): array
    {
        if (!$this->hasApiKey()) {
            return $this->getPlaceholderData($startDate, $endDate);
        }

        try {
            $params = [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ];

            if ($placementId) {
                $params['placement_id'] = $placementId;
            }

            $response = $this->client->get('/metrics', [
                'query' => $params
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            
            return $data['data'] ?? [];
        } catch (GuzzleException $e) {
            Log::error('Adsterra API Error: ' . $e->getMessage());
            return $this->getPlaceholderData($startDate, $endDate);
        }
    }

    /**
     * Fetch performance metrics for a specific placement.
     *
     * @param string $placementId
     * @param string $startDate Format: YYYY-MM-DD
     * @param string $endDate Format: YYYY-MM-DD
     * @return array
     */
    public function getPlacementMetrics(string $placementId, string $startDate, string $endDate): array
    {
        return $this->getMetrics($startDate, $endDate, $placementId);
    }

    /**
     * Fetch all placements from the Adsterra API.
     *
     * @return array
     */
    public function getPlacements(): array
    {
        if (!$this->hasApiKey()) {
            return $this->getPlaceholderPlacements();
        }

        try {
            $response = $this->client->get('/placements');
            $data = json_decode($response->getBody()->getContents(), true);
            
            return $data['data'] ?? [];
        } catch (GuzzleException $e) {
            Log::error('Adsterra API Error: ' . $e->getMessage());
            return $this->getPlaceholderPlacements();
        }
    }

    /**
     * Generate placeholder data for when the API key is not set or API call fails.
     *
     * @param string $startDate
     * @param string $endDate
     * @return array
     */
    protected function getPlaceholderData(string $startDate, string $endDate): array
    {
        // Calculate number of days in the range
        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $interval = $start->diff($end);
        $days = $interval->days + 1; // Include both start and end dates

        $data = [];
        $date = clone $start;

        // Generate random data for each day
        for ($i = 0; $i < $days; $i++) {
            $dateStr = $date->format('Y-m-d');
            
            $data[] = [
                'date' => $dateStr,
                'impressions' => rand(1000, 5000),
                'clicks' => rand(10, 100),
                'ctr' => rand(1, 5) / 100, // CTR between 0.01 and 0.05
                'revenue' => rand(5, 20) / 10, // Revenue between $0.50 and $2.00
                'ecpm' => rand(10, 50) / 10, // eCPM between $1.00 and $5.00
            ];
            
            $date->modify('+1 day');
        }

        return $data;
    }

    /**
     * Generate placeholder placements for when the API key is not set or API call fails.
     *
     * @return array
     */
    protected function getPlaceholderPlacements(): array
    {
        return [
            [
                'id' => 'placeholder-1',
                'name' => 'Header Banner',
                'size' => '728x90',
                'status' => 'active',
            ],
            [
                'id' => 'placeholder-2',
                'name' => 'Sidebar Rectangle',
                'size' => '300x250',
                'status' => 'active',
            ],
            [
                'id' => 'placeholder-3',
                'name' => 'Footer Banner',
                'size' => '970x90',
                'status' => 'active',
            ],
            [
                'id' => 'placeholder-4',
                'name' => 'Mobile Banner',
                'size' => '320x50',
                'status' => 'active',
            ],
        ];
    }
}
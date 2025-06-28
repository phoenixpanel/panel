@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'ads'])

@section('title')
    Ad Management
@endsection

@section('content-header')
    <h1>Ad Management<small>Configure Ad Management settings for PhoenixPanel.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Settings</li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <form action="" method="POST">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Ads Management</h3>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label class="control-label">Enable Adsterra Functionality</label>
                            <div>
                                <input type="hidden" name="phoenixpanel:ads:enabled" value="0">
                                <label>
                                    <input type="checkbox" name="phoenixpanel:ads:enabled" value="1" @if(old('phoenixpanel:ads:enabled', config('phoenixpanel.ads.enabled')) == 1) checked @endif> Enable
                                </label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label">Adsterra Ad Code (160x600)</label>
                            <div>
                                <textarea name="phoenixpanel:ads:code" class="form-control" rows="5" placeholder="Paste your Adsterra ad code here">{{ old('phoenixpanel:ads:code', config('phoenixpanel.ads.code')) }}</textarea>
                                <p class="text-muted small">Enter the ad code provided by Adsterra for the 160x600 ad unit.</p>
                                <p class="text-muted small">Need an Adsterra account? <a href="https://beta.publishers.adsterra.com/referral/wJKNd3ApCE" target="_blank" rel="noopener noreferrer">Sign up here</a> using this referral link.</p>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label">Adsterra API Key <small>(optional)</small></label>
                            <div>
                                <input type="password" name="phoenixpanel:ads:api_key" class="form-control" value="{{ old('phoenixpanel:ads:api_key', config('phoenixpanel.ads.api_key')) }}" placeholder="Enter Adsterra API Key">
                                <p class="text-muted small">API key for Adsterra API integration (if using advanced features).</p>
                            </div>
                        </div>
                    </div>

                    <div class="box-footer">
                        {{ csrf_field() }}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Ad Metrics -->
    @if(!empty(config('phoenixpanel.ads.api_key')))
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Ad Metrics</h3>
                    <div class="box-tools">
                        <div class="date-range-controls" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                            <!-- Quick Select Buttons -->
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-sm btn-default date-range-option" data-days="1">Today</button>
                                <button type="button" class="btn btn-sm btn-default date-range-option" data-days="7">7 Days</button>
                                <button type="button" class="btn btn-sm btn-default date-range-option" data-days="30">30 Days</button>
                                <button type="button" class="btn btn-sm btn-default date-range-option" data-days="90">90 Days</button>
                            </div>
                            
                            <!-- Current Selection Display -->
                            <span class="label label-primary" id="current-selection">Last 7 Days</span>
                        </div>
                    </div>
                </div>
                <div class="box-body">
                    <div id="metrics-loading" style="display: none;">
                        <div class="text-center">
                            <i class="fa fa-spinner fa-spin fa-2x"></i>
                            <p>Loading metrics data...</p>
                        </div>
                    </div>
                    <div id="metrics-content">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="info-box" style="background: #212121">
                                    <span class="info-box-icon bg-aqua"><i class="fa fa-eye" style="top: 2rem; position: relative;"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Total Impressions</span>
                                        @if(isset($metrics) && $metrics === false)
                                            <span class="info-box-number text-danger">COULDN'T RETRIEVE METRICS</span>
                                        @else
                                            <span id="metric-impressions" class="info-box-number">{{ isset($metrics['items']) ? array_sum(array_column($metrics['items'], 'impression')) : 0 }}</span>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-box" style="background: #212121">
                                    <span class="info-box-icon bg-green"><i class="fa fa-mouse-pointer" style="top: 2rem; position: relative;"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Total Clicks</span>
                                        @if(isset($metrics) && $metrics === false)
                                            <span class="info-box-number text-danger">COULDN'T RETRIEVE METRICS</span>
                                        @else
                                            <span id="metric-clicks" class="info-box-number">{{ isset($metrics['items']) ? array_sum(array_column($metrics['items'], 'clicks')) : 0 }}</span>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        @if(isset($metrics['items']) && count($metrics['items']) > 0)
                        <div class="row">
                            <div class="col-md-6">
                                <div class="info-box" style="background: #212121">
                                    <span class="info-box-icon bg-yellow"><i class="fa fa-percent" style="top: 2rem; position: relative;"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Average CTR</span>
                                        <span id="metric-ctr" class="info-box-number">
                                            @php
                                            $totalImpressions = isset($metrics['items']) ? array_sum(array_column($metrics['items'], 'impression')) : 0;
                                            $totalClicks = isset($metrics['items']) ? array_sum(array_column($metrics['items'], 'clicks')) : 0;
                                            $ctr = $totalImpressions > 0 ? ($totalClicks / $totalImpressions) * 100 : 0;
                                            echo number_format($ctr, 2) . '%';
                                            @endphp
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-box" style="background: #212121">
                                    <span class="info-box-icon bg-purple"><i class="fa fa-dollar" style="top: 2rem; position: relative;"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Total Revenue</span>
                                        <span id="metric-revenue" class="info-box-number">${{ number_format(array_sum(array_column($metrics['items'], 'revenue')), 2) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="position: relative; height: 250px; width: 100%;">
                            <canvas id="metrics-chart"></canvas>
                        </div>
                        
                        <div class="text-muted">
                            <small id="metrics-last-updated">Last updated: {{ isset($metrics['dbDateTime']) ? $metrics['dbDateTime'] : 'Unknown' }}</small>
                        </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif
@endsection

@section('footer-scripts')
    @parent
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
    
    <style>
    .date-range-controls {
        margin-bottom: 10px;
        position: relative;
    }
    
    .date-range-controls .btn-group .btn {
        margin-right: 0;
    }
    
    .custom-date-panel {
        animation: slideDown 0.3s ease-in-out;
        position: fixed;
        top: auto;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        min-width: 600px;
        max-width: 90vw;
        background: white;
        border-radius: 6px;
        border: 1px solid #ddd;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .date-range-controls .label {
        font-size: 11px;
        padding: 4px 8px;
        vertical-align: middle;
    }
    
    /* Ensure the box-tools container has proper positioning context */
    .box-tools {
        position: relative;
        z-index: 1;
    }
    
    /* Ensure metric cards don't interfere with dropdown */
    .info-box {
        position: relative;
        z-index: 1;
    }
    
    @media (max-width: 768px) {
        .date-range-controls {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 5px !important;
        }
        
        .custom-date-panel {
            position: relative;
            top: auto;
            left: auto;
            right: auto;
            margin-top: 15px;
        }
        
        .custom-date-panel .col-md-4 {
            margin-bottom: 15px;
        }
    }
    </style>

    <script>
    $(document).ready(function() {
        let chart = null;
        
        // Setup CSRF token for all AJAX requests
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        // Initialize date pickers
        $('#date-range-start, #date-range-end').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        
        // Handle date range button clicks
        $(document).on('click', '.date-range-option', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const days = $(this).data('days');
            const clickedText = $(this).text();
            
            // Remove active state from all buttons and add to clicked one
            $('.date-range-option').removeClass('btn-primary').addClass('btn-default');
            $(this).removeClass('btn-default').addClass('btn-primary');
            
            // Update current selection display
            $('#current-selection').text(clickedText);
            
            // Hide custom date panel
            $('.custom-date-panel').hide();
            
            // Calculate and set date range
            let startDate, endDate;
            if (days === 1) {
                startDate = moment().format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
            } else {
                startDate = moment().subtract(days - 1, 'days').format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
            }
                        
            $('#date-range-start').val(startDate);
            $('#date-range-end').val(endDate);
            fetchMetrics(startDate, endDate);
            
            return false;
        });
        
        function fetchMetrics(startDate, endDate) {
            $('#metrics-loading').show();
            $('#metrics-content').hide();
                        
            // Clear any previous errors
            $('.info-box-number').removeClass('text-danger');
            
            $.ajax({
                type: 'GET',
                url: '{{ route('admin.settings.adsmanager.metrics') }}',
                data: {
                    start_date: startDate,
                    end_date: endDate,
                    _token: '{{ csrf_token() }}'
                },
                dataType: 'json',
                cache: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
                },
                success: function(data) {
                    updateMetricsDisplay(data);
                    $('#metrics-loading').hide();
                    $('#metrics-content').show();
                },
                error: function(xhr, status, error) {
                    console.log('Metrics API error:', {
                        status: status,
                        error: error,
                        responseText: xhr.responseText
                    });
                    
                    $('#metrics-loading').hide();
                    $('#metrics-content').show();
                    $('.info-box-number').text('COULDN\'T RETRIEVE METRICS').addClass('text-danger');
                }
            });
        }
        
        function updateMetricsDisplay(data) {            
            if (!data || !data.items || data.items.length === 0) {
                console.log("No metrics data available");
                $('#metric-impressions').text('0');
                $('#metric-clicks').text('0');
                $('#metric-ctr').text('0.00%');
                $('#metric-revenue').text('$0.00');
                return;
            }
            
            // Calculate totals
            let totalImpressions = 0;
            let totalClicks = 0;
            let totalRevenue = 0;
            
            data.items.forEach(item => {
                totalImpressions += parseInt(item.impression || 0);
                totalClicks += parseInt(item.clicks || 0);
                totalRevenue += parseFloat(item.revenue || 0);
            });
            
            // Calculate CTR correctly from total values
            const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
            
            // Update metrics display
            $('#metric-impressions').text(totalImpressions.toLocaleString());
            $('#metric-clicks').text(totalClicks.toLocaleString());
            $('#metric-ctr').text(avgCtr.toFixed(2) + '%');
            $('#metric-revenue').text('$' + totalRevenue.toFixed(2));
            $('#metrics-last-updated').text('Last updated: ' + (data.dbDateTime || new Date().toLocaleString()));
            
            // Update chart
            updateChart(data.items);
        }
        
        function updateChart(items) {
            const dates = [];
            const impressions = [];
            const clicks = [];
            const revenues = [];
            
            // Sort items by date
            items.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Extract data for chart
            items.forEach(item => {
                dates.push(item.date);
                impressions.push(parseInt(item.impression || 0));
                clicks.push(parseInt(item.clicks || 0));
                revenues.push(parseFloat(item.revenue || 0));
            });
            
            // Properly destroy existing chart
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
                chart = null;
            }
            
            // Get canvas element and verify it exists
            const canvasElement = document.getElementById('metrics-chart');
            if (!canvasElement) {
                return;
            }
            
            try {
                const ctx = canvasElement.getContext('2d');
                
                chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'Impressions',
                                data: impressions,
                                borderColor: '#00c0ef',
                                backgroundColor: 'rgba(0, 192, 239, 0.1)',
                                tension: 0.1,
                                fill: true
                            },
                            {
                                label: 'Clicks',
                                data: clicks,
                                borderColor: '#00a65a',
                                backgroundColor: 'rgba(0, 166, 90, 0.1)',
                                tension: 0.1,
                                fill: true
                            },
                            {
                                label: 'Revenue ($)',
                                data: revenues,
                                borderColor: '#605ca8',
                                backgroundColor: 'rgba(96, 92, 168, 0.1)',
                                tension: 0.1,
                                fill: true
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                            duration: 0 // Disable animations to prevent continuous redraws
                        },
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        }
                    }
                });                
            } catch (error) {
                console.error("Error creating chart:", error);
            }
        }
        
        // Initialize default selection (7 days) on page load
        function initializeDefaultSelection() {            
            // Set default active button (7 days)
            $('.date-range-option[data-days="7"]').removeClass('btn-default').addClass('btn-primary');
            
            // Set default date range
            const startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
            const endDate = moment().format('YYYY-MM-DD');
            
            $('#date-range-start').val(startDate);
            $('#date-range-end').val(endDate);
        }
        
        // Initialize chart if data exists
        @if(isset($metrics['items']) && count($metrics['items']) > 0)
        updateChart({!! json_encode($metrics['items']) !!});
        @endif
        
        // Initialize default selection
        initializeDefaultSelection();
    });
    </script>
@endsection
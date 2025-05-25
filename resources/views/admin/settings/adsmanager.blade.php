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
                                <input type="text" name="phoenixpanel:ads:api_key" class="form-control" value="{{ old('phoenixpanel:ads:api_key', config('phoenixpanel.ads.api_key')) }}" placeholder="Enter Adsterra API Key">
                                <p class="text-muted small">API key for Adsterra API integration (if using advanced features).</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box box-primary">
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
                        <div class="input-group">
                            <div class="input-group-btn">
                                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <span id="date-range-text">Last 7 Days</span> <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="#" class="date-range-option" data-days="7">Last 7 Days</a></li>
                                    <li><a href="#" class="date-range-option" data-days="30">Last 30 Days</a></li>
                                    <li><a href="#" class="date-range-option" data-days="custom">Custom Range</a></li>
                                </ul>
                            </div>
                            <div class="date-range-picker" style="display: none;">
                                <input type="text" class="form-control" id="date-range-start" placeholder="Start Date" value="{{ $startDate }}">
                                <input type="text" class="form-control" id="date-range-end" placeholder="End Date" value="{{ $endDate }}">
                                <button type="button" class="btn btn-primary" id="apply-date-range">Apply</button>
                            </div>
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
                                <div class="info-box">
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
                                <div class="info-box">
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
                                <div class="info-box">
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
                                <div class="info-box">
                                    <span class="info-box-icon bg-purple"><i class="fa fa-dollar" style="top: 2rem; position: relative;"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Total Revenue</span>
                                        <span id="metric-revenue" class="info-box-number">${{ number_format(array_sum(array_column($metrics['items'], 'revenue')), 2) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="metrics-chart" style="height: 250px;"></div>
                        
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

    <!-- Ad Preview -->
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Ad Preview</h3>
                </div>
                <div class="box-body">
                    <p>Left Margin Ad (160x600):</p>
                    <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
                        @if(config('phoenixpanel.ads.enabled'))
                            {!! config('phoenixpanel.ads.code') !!}
                        @else
                            <div style="text-align: center; padding: 20px;">Ad Disabled</div>
                        @endif
                    </div>

                    <p>Right Margin Ad (160x600):</p>
                    <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
                        @if(config('phoenixpanel.ads.enabled'))
                            {!! config('phoenixpanel.ads.code') !!}
                        @else
                            <div style="text-align: center; padding: 20px;">Ad Disabled</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    @push('scripts')
    <!-- Add debugging div for troubleshooting -->
    <div id="debug-info" style="display: none; border: 1px solid #ccc; margin-top: 20px; padding: 10px; background: #f9f9f9;">
        <h4>Debug Info</h4>
        <div id="debug-content"></div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>

    <script>
    $(document).ready(function() {
        let chart = null;
        
        // Setup CSRF token for all AJAX requests
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        console.log("Metrics page initialized");
        
        // Initialize date pickers
        $('#date-range-start, #date-range-end').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        
        // Handle date range options
        // Debug logging function
        function logDebug(message, data) {
            console.log(message, data);
            $('#debug-content').append(`<p><strong>${message}:</strong> ${JSON.stringify(data)}</p>`);
        }
        
        // Handle dropdown menu clicks directly on the links
        $(document).on('click', '.date-range-option', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event bubbling
            
            const days = $(this).data('days');
            logDebug("Date range option clicked", {days: days});
            
            $('#date-range-text').text($(this).text());
            
            if (days === 'custom') {
                $('.date-range-picker').show();
            } else {
                $('.date-range-picker').hide();
                const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
                const endDate = moment().format('YYYY-MM-DD');
                
                console.log("Setting date range:", startDate, "to", endDate);
                
                $('#date-range-start').val(startDate);
                $('#date-range-end').val(endDate);
                fetchMetrics(startDate, endDate);
            }
            
            return false; // Additional prevention of default behavior
        });
        
        // Handle apply button for custom range
        $('#apply-date-range').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event bubbling
            
            const startDate = $('#date-range-start').val();
            const endDate = $('#date-range-end').val();
            
            logDebug("Custom date range", {startDate, endDate});
            
            if (!startDate || !endDate) {
                alert('Please select both start and end dates');
                return;
            }
            
            fetchMetrics(startDate, endDate);
            return false;
        });
        
        function fetchMetrics(startDate, endDate) {
            $('#metrics-loading').show();
            $('#metrics-content').hide();
            
            logDebug("Fetching metrics for", {startDate, endDate});
            
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
                cache: false, // Prevent caching of AJAX requests
                beforeSend: function(xhr) {
                    // Ensure proper CSRF headers
                    xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
                },
                success: function(data) {
                    logDebug("Metrics data received", data);
                    updateMetricsDisplay(data);
                    $('#metrics-loading').hide();
                    $('#metrics-content').show();
                },
                error: function(xhr, status, error) {
                    logDebug("Metrics fetch error", {status, error, responseText: xhr.responseText});
                    $('#metrics-loading').hide();
                    $('#metrics-content').show();
                    $('.info-box-number').text('COULDN\'T RETRIEVE METRICS').addClass('text-danger');
                }
            });
        }
        
        function updateMetricsDisplay(data) {
            console.log("Updating metrics display with data:", data);
            
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
            let totalCtr = 0;
            
            data.items.forEach(item => {
                const impressions = parseInt(item.impression || 0);
                const clicks = parseInt(item.clicks || 0);
                const revenue = parseFloat(item.revenue || 0);
                const ctr = parseFloat(item.ctr || 0);
                
                console.log("Processing item:", item.date,
                    "impressions:", impressions,
                    "clicks:", clicks,
                    "revenue:", revenue,
                    "ctr:", ctr);
                
                totalImpressions += impressions;
                totalClicks += clicks;
                totalRevenue += revenue;
                totalCtr += ctr;
            });
            
            // Calculate CTR correctly from total values, not by averaging individual CTRs
            const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
            
            logDebug("Calculated totals", {
                impressions: totalImpressions,
                clicks: totalClicks,
                revenue: totalRevenue,
                avgCtr: avgCtr
            });
            
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
            
            if (chart) {
                chart.destroy();
            }
            
            const ctx = document.getElementById('metrics-chart').getContext('2d');
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
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Initialize chart if data exists
        @if(isset($metrics['items']) && count($metrics['items']) > 0)
        updateChart({!! json_encode($metrics['items']) !!});
        @endif
    });
    </script>
    
    <script>
    // Add this at the end to show debug info when needed
    function toggleDebug() {
        $('#debug-info').toggle();
    }
    
    // Add keyboard shortcut 'Ctrl+D' to toggle debug info
    $(document).keydown(function(e) {
        if (e.ctrlKey && e.keyCode === 68) { // 68 is the key code for 'D'
            e.preventDefault();
            toggleDebug();
        }
    });
    </script>
    @endpush

@endsection
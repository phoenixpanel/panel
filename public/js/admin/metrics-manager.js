/**
 * PhoenixPanel Metrics Manager
 * 
 * This file handles the metrics dashboard functionality for the Ad Manager,
 * allowing administrators to view performance metrics for their ad placements.
 */

/**
 * Metrics Manager Class
 * Handles the metrics dashboard functionality
 */
class MetricsManager {
    constructor() {
        this.metricsChart = null;
        this.metricsPieChart = null;
        this.startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        this.endDate = moment().format('YYYY-MM-DD');
        this.selectedPlacement = '';
        this.metricsData = [];
        this.placementsData = [];
        this.variantsData = [];
    }
    
    /**
     * Initialize the metrics dashboard
     */
    init() {
        this.setupDateRangePicker();
        this.setupEventListeners();
        this.loadMetrics();
    }
    
    /**
     * Set up the date range picker
     */
    setupDateRangePicker() {
        $('#metrics-daterange-picker').daterangepicker({
            startDate: moment().subtract(7, 'days'),
            endDate: moment(),
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, (start, end) => {
            this.startDate = start.format('YYYY-MM-DD');
            this.endDate = end.format('YYYY-MM-DD');
            this.loadMetrics();
        });
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Date range selector
        $('#metrics-date-range').on('change', (e) => {
            const value = $(e.target).val();
            
            // Show/hide custom date range picker
            if (value === 'custom') {
                $('.custom-date-range').show();
            } else {
                $('.custom-date-range').hide();
                
                // Set date range based on selection
                let start, end;
                switch (value) {
                    case 'today':
                        start = moment();
                        end = moment();
                        break;
                    case 'yesterday':
                        start = moment().subtract(1, 'days');
                        end = moment().subtract(1, 'days');
                        break;
                    case 'last7':
                        start = moment().subtract(6, 'days');
                        end = moment();
                        break;
                    case 'last30':
                        start = moment().subtract(29, 'days');
                        end = moment();
                        break;
                    case 'thisMonth':
                        start = moment().startOf('month');
                        end = moment().endOf('month');
                        break;
                    case 'lastMonth':
                        start = moment().subtract(1, 'month').startOf('month');
                        end = moment().subtract(1, 'month').endOf('month');
                        break;
                }
                
                this.startDate = start.format('YYYY-MM-DD');
                this.endDate = end.format('YYYY-MM-DD');
                this.loadMetrics();
            }
        });
        
        // Placement selector
        $('#metrics-placement').on('change', (e) => {
            this.selectedPlacement = $(e.target).val();
            this.loadMetrics();
        });
        
        // Refresh button
        $('#refresh-metrics').on('click', () => {
            this.loadMetrics();
        });
    }
    
    /**
     * Load metrics data from the server
     */
    loadMetrics() {
        // Show loading state
        $('#metrics-table tbody').html('<tr class="metrics-loading"><td colspan="6" class="text-center"><i class="fa fa-spinner fa-spin"></i> Loading metrics data...</td></tr>');
        
        // Disable refresh button
        $('#refresh-metrics').prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Loading...');
        
        // Make AJAX request
        $.ajax({
            url: '/admin/settings/ads/metrics',
            type: 'POST',
            data: {
                start_date: this.startDate,
                end_date: this.endDate,
                placement_id: this.selectedPlacement,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            timeout: 30000, // 30 second timeout
            success: (response) => {
                if (response.success) {
                    this.metricsData = response.metrics;
                    this.placementsData = response.placements;
                    this.variantsData = response.variants || [];
                    
                    // Update UI
                    this.updateMetricsUI(response);
                    
                    // Show API key notice if needed
                    if (!response.has_api_key) {
                        $('.api-key-notice').show();
                    } else {
                        $('.api-key-notice').hide();
                    }
                } else {
                    this.showErrorMessage(response.message || 'Failed to load metrics data.');
                }
            },
            error: (xhr, status, error) => {
                let errorMessage = 'An error occurred while loading metrics data.';
                
                if (status === 'timeout') {
                    errorMessage = 'The request timed out. The Adsterra API may be experiencing delays.';
                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                } else if (error) {
                    errorMessage += ' ' + error;
                }
                
                this.showErrorMessage(errorMessage);
            },
            complete: () => {
                // Re-enable refresh button
                $('#refresh-metrics').prop('disabled', false).html('<i class="fa fa-refresh"></i> Refresh Metrics');
            }
        });
    }
    
    /**
     * Display an error message to the user
     * @param {string} message - The error message to display
     */
    showErrorMessage(message) {
        // Check if error container exists, if not create it
        let errorContainer = $('.metrics-error-container');
        if (errorContainer.length === 0) {
            errorContainer = $('<div class="alert alert-danger metrics-error-container" style="margin-top: 15px;"><i class="fa fa-exclamation-circle"></i> <span class="error-message"></span> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            $('.metrics-summary').before(errorContainer);
        }
        
        // Update error message and show
        errorContainer.find('.error-message').text(message);
        errorContainer.show();
        
        // Show fallback data notice
        $('#metrics-table tbody').html('<tr><td colspan="6" class="text-center">Using fallback data. Please check your API configuration or try again later.</td></tr>');
    }
    
    /**
     * Update the metrics UI with the loaded data
     * @param {Object} response - The response from the server
     */
    updateMetricsUI(response) {
        // Update summary boxes
        $('#total-impressions').text(this.formatNumber(response.totals.impressions));
        $('#total-clicks').text(this.formatNumber(response.totals.clicks));
        $('#average-ctr').text(response.totals.ctr.toFixed(2) + '%');
        $('#total-revenue').text('$' + response.totals.revenue.toFixed(2));
        
        // Update placements dropdown
        const placementSelect = $('#metrics-placement');
        const currentValue = placementSelect.val();
        
        // Save current selection
        placementSelect.empty();
        placementSelect.append('<option value="">All Placements</option>');
        
        response.placements.forEach(placement => {
            placementSelect.append(`<option value="${placement.id}">${placement.name} (${placement.size})</option>`);
        });
        
        // Restore selection if possible
        if (currentValue) {
            placementSelect.val(currentValue);
        }
        
        // Update table
        this.updateMetricsTable(response.metrics);
        
        // Update charts
        this.updateCharts(response.metrics);
        
        // Update variant metrics if available
        if (response.variants && response.variants.length > 0) {
            this.updateVariantMetrics(response.variants);
        }
    }
    
    /**
     * Update the metrics table with the loaded data
     * @param {Array} metrics - The metrics data
     */
    updateMetricsTable(metrics) {
        const tbody = $('#metrics-table tbody');
        tbody.empty();
        
        if (metrics.length === 0) {
            tbody.html('<tr><td colspan="6" class="text-center">No data available for the selected period.</td></tr>');
            return;
        }
        
        metrics.forEach(metric => {
            const row = $('<tr></tr>');
            row.append(`<td>${moment(metric.date).format('MMM D, YYYY')}</td>`);
            row.append(`<td>${this.formatNumber(metric.impressions)}</td>`);
            row.append(`<td>${this.formatNumber(metric.clicks)}</td>`);
            row.append(`<td>${(metric.ctr * 100).toFixed(2)}%</td>`);
            row.append(`<td>$${metric.revenue.toFixed(2)}</td>`);
            row.append(`<td>$${metric.ecpm.toFixed(2)}</td>`);
            tbody.append(row);
        });
    }
    
    /**
     * Update the charts with the loaded data
     * @param {Array} metrics - The metrics data
     */
    updateCharts(metrics) {
        // Prepare data for line chart
        const dates = metrics.map(m => moment(m.date).format('MMM D'));
        const impressions = metrics.map(m => m.impressions);
        const clicks = metrics.map(m => m.clicks);
        const revenue = metrics.map(m => m.revenue);
        
        // Create or update line chart
        if (this.metricsChart) {
            this.metricsChart.data.labels = dates;
            this.metricsChart.data.datasets[0].data = impressions;
            this.metricsChart.data.datasets[1].data = clicks;
            this.metricsChart.data.datasets[2].data = revenue;
            this.metricsChart.update();
        } else {
            const ctx = document.getElementById('metrics-chart').getContext('2d');
            this.metricsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Impressions',
                            data: impressions,
                            borderColor: 'rgba(60, 141, 188, 1)',
                            backgroundColor: 'rgba(60, 141, 188, 0.2)',
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Clicks',
                            data: clicks,
                            borderColor: 'rgba(0, 166, 90, 1)',
                            backgroundColor: 'rgba(0, 166, 90, 0.2)',
                            tension: 0.4,
                            yAxisID: 'y1'
                        },
                        {
                            label: 'Revenue ($)',
                            data: revenue,
                            borderColor: 'rgba(221, 75, 57, 1)',
                            backgroundColor: 'rgba(221, 75, 57, 0.2)',
                            tension: 0.4,
                            yAxisID: 'y2'
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
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Impressions'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Clicks'
                            },
                            grid: {
                                drawOnChartArea: false,
                            },
                        },
                        y2: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Revenue ($)'
                            },
                            grid: {
                                drawOnChartArea: false,
                            },
                        }
                    }
                }
            });
        }
        
        // Prepare data for pie chart
        const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
        const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
        const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
        
        // Create or update pie chart
        if (this.metricsPieChart) {
            this.metricsPieChart.data.datasets[0].data = [totalImpressions, totalClicks, totalRevenue];
            this.metricsPieChart.update();
        } else {
            const ctxPie = document.getElementById('metrics-pie-chart').getContext('2d');
            this.metricsPieChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: ['Impressions', 'Clicks', 'Revenue ($)'],
                    datasets: [{
                        data: [totalImpressions, totalClicks, totalRevenue],
                        backgroundColor: [
                            'rgba(60, 141, 188, 0.8)',
                            'rgba(0, 166, 90, 0.8)',
                            'rgba(221, 75, 57, 0.8)'
                        ],
                        borderColor: [
                            'rgba(60, 141, 188, 1)',
                            'rgba(0, 166, 90, 1)',
                            'rgba(221, 75, 57, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Performance Distribution'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }
    
    /**
     * Format a number with commas
     * @param {number} num - The number to format
     * @returns {string} The formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    /**
     * Update variant metrics display
     * @param {Array} variants - Array of variant data
     */
    updateVariantMetrics(variants) {
        // Add a section for variant metrics if it doesn't exist
        if ($('.variant-metrics-section').length === 0) {
            const variantSection = $(`
                <div class="row variant-metrics-section" style="margin-top: 20px;">
                    <div class="col-md-12">
                        <div class="box box-info">
                            <div class="box-header with-border">
                                <h3 class="box-title">A/B Testing Variant Performance</h3>
                            </div>
                            <div class="box-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="variant-metrics-chart-container" style="position: relative; height: 300px;">
                                            <canvas id="variant-metrics-chart"></canvas>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" style="margin-top: 20px;">
                                    <div class="col-md-12">
                                        <div class="table-responsive">
                                            <table class="table table-bordered table-hover" id="variant-metrics-table">
                                                <thead>
                                                    <tr>
                                                        <th>Variant</th>
                                                        <th>Impressions</th>
                                                        <th>Clicks</th>
                                                        <th>CTR</th>
                                                        <th>Revenue</th>
                                                        <th>eCPM</th>
                                                        <th>Weight</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <!-- Variant metrics data will be populated dynamically -->
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            
            // Add the section before the metrics table
            $('#metrics-table').closest('.row').after(variantSection);
        }
        
        // Update the variant metrics table
        const tbody = $('#variant-metrics-table tbody');
        tbody.empty();
        
        if (variants.length === 0) {
            tbody.html('<tr><td colspan="7" class="text-center">No variant data available.</td></tr>');
            return;
        }
        
        // Sort variants by performance (CTR * eCPM)
        const sortedVariants = [...variants].sort((a, b) => {
            const aPerformance = a.ctr * a.ecpm;
            const bPerformance = b.ctr * b.ecpm;
            return bPerformance - aPerformance;
        });
        
        sortedVariants.forEach(variant => {
            const row = $('<tr></tr>');
            
            // Add variant name with control indicator
            const nameCell = $('<td></td>').text(variant.name);
            if (variant.is_control) {
                nameCell.append(' <span class="label label-info">Control</span>');
            }
            row.append(nameCell);
            
            // Add metrics
            row.append(`<td>${this.formatNumber(variant.impressions)}</td>`);
            row.append(`<td>${this.formatNumber(variant.clicks)}</td>`);
            row.append(`<td>${variant.ctr.toFixed(2)}%</td>`);
            row.append(`<td>$${variant.revenue.toFixed(2)}</td>`);
            row.append(`<td>$${variant.ecpm.toFixed(2)}</td>`);
            row.append(`<td>${variant.weight}%</td>`);
            
            tbody.append(row);
        });
        
        // Update or create the variant metrics chart
        this.updateVariantMetricsChart(variants);
    }
    
    /**
     * Update or create the variant metrics chart
     * @param {Array} variants - Array of variant data
     */
    updateVariantMetricsChart(variants) {
        const ctx = document.getElementById('variant-metrics-chart');
        if (!ctx) return;
        
        // Prepare data for chart
        const labels = variants.map(v => v.name);
        const ctrData = variants.map(v => v.ctr);
        const ecpmData = variants.map(v => v.ecpm);
        const impressionsData = variants.map(v => v.impressions);
        const backgroundColors = variants.map(v => v.is_control ? 'rgba(60, 141, 188, 0.8)' : 'rgba(0, 166, 90, 0.8)');
        
        // Create chart if it doesn't exist
        if (!window.variantMetricsChart) {
            window.variantMetricsChart = new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'CTR (%)',
                            data: ctrData,
                            backgroundColor: backgroundColors,
                            borderColor: 'rgba(60, 141, 188, 1)',
                            borderWidth: 1,
                            yAxisID: 'y'
                        },
                        {
                            label: 'eCPM ($)',
                            data: ecpmData,
                            backgroundColor: backgroundColors.map(color => color.replace('0.8', '0.6')),
                            borderColor: 'rgba(221, 75, 57, 1)',
                            borderWidth: 1,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'CTR (%)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'eCPM ($)'
                            },
                            grid: {
                                drawOnChartArea: false,
                            },
                        }
                    }
                }
            });
        } else {
            // Update existing chart
            window.variantMetricsChart.data.labels = labels;
            window.variantMetricsChart.data.datasets[0].data = ctrData;
            window.variantMetricsChart.data.datasets[0].backgroundColor = backgroundColors;
            window.variantMetricsChart.data.datasets[1].data = ecpmData;
            window.variantMetricsChart.data.datasets[1].backgroundColor = backgroundColors.map(color => color.replace('0.8', '0.6'));
            window.variantMetricsChart.update();
        }
    }
}

// Initialize metrics when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the ads settings page with metrics
    if (document.getElementById('metrics-chart')) {
        AdManager.initMetrics();
    }
});
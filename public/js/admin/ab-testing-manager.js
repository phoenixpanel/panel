/**
 * PhoenixPanel A/B Testing Manager
 * 
 * This file handles the A/B testing functionality for the Ad Manager,
 * allowing administrators to create and manage variants for ad placements.
 */

/**
 * A/B Testing Manager Class
 * Handles the A/B testing functionality
 */
class ABTestingManager {
    constructor() {
        this.variantComparisonChart = null;
        this.selectedPlacementId = null;
        this.variants = [];
        this.controlVariant = null;
    }
    
    /**
     * Initialize the A/B testing manager
     */
    static init() {
        const manager = new ABTestingManager();
        manager.setupEventListeners();
        window.abTestingManager = manager;
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Open new variant modal
        $(document).on('click', '.add-variant-btn', (e) => {
            e.preventDefault();
            const placementId = $(e.currentTarget).data('placement-id');
            this.selectedPlacementId = placementId;
            
            // Reset form
            $('#variant-form')[0].reset();
            $('#variant_placement_id').val(placementId);
            $('.weight-display').text('50%');
            
            // Show modal
            $('#newVariantModal').modal('show');
        });
        
        // Open edit variant modal
        $(document).on('click', '.edit-variant-btn', (e) => {
            e.preventDefault();
            const variantId = $(e.currentTarget).data('variant-id');
            const variantName = $(e.currentTarget).data('variant-name');
            const variantAdCode = $(e.currentTarget).data('variant-ad-code');
            const variantWeight = $(e.currentTarget).data('variant-weight');
            const isControl = $(e.currentTarget).data('is-control') === 1;
            
            // Populate form
            $('#edit_variant_id').val(variantId);
            $('#edit_variant_name').val(variantName);
            $('#edit_ad_code').val(variantAdCode);
            $('#edit_variant_weight').val(variantWeight);
            $('.edit-weight-display').text(variantWeight + '%');
            $('#edit_is_control').prop('checked', isControl);
            
            // Show modal
            $('#editVariantModal').modal('show');
        });
        
        // Open variant performance modal
        $(document).on('click', '.view-variants-performance-btn', (e) => {
            e.preventDefault();
            const placementId = $(e.currentTarget).data('placement-id');
            this.loadVariantPerformance(placementId);
        });
    }
    
    /**
     * Load variant performance data
     * @param {number} placementId - The placement ID
     */
    loadVariantPerformance(placementId) {
        // Show loading state
        $('#variant-comparison-table tbody').html('<tr><td colspan="7" class="text-center"><i class="fa fa-spinner fa-spin"></i> Loading variant data...</td></tr>');
        
        // Make AJAX request to get variant data
        $.ajax({
            url: '/admin/settings/ads/metrics',
            type: 'POST',
            data: {
                placement_id: placementId,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: (response) => {
                if (response.success) {
                    this.variants = response.variants || [];
                    this.controlVariant = this.variants.find(v => v.is_control) || null;
                    
                    // Update UI
                    this.updateVariantComparisonUI();
                    
                    // Show modal
                    $('#variantPerformanceModal').modal('show');
                } else {
                    alert('Failed to load variant data.');
                }
            },
            error: () => {
                alert('An error occurred while loading variant data.');
            }
        });
    }
    
    /**
     * Update the variant comparison UI
     */
    updateVariantComparisonUI() {
        // Update table
        this.updateVariantComparisonTable();
        
        // Update chart
        this.updateVariantComparisonChart();
        
        // Update recommendation
        this.updateRecommendation();
    }
    
    /**
     * Update the variant comparison table
     */
    updateVariantComparisonTable() {
        const tbody = $('#variant-comparison-table tbody');
        tbody.empty();
        
        if (this.variants.length === 0) {
            tbody.html('<tr><td colspan="7" class="text-center">No variants available for this placement.</td></tr>');
            return;
        }
        
        this.variants.forEach(variant => {
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
            
            // Add comparison to control
            if (variant.is_control) {
                row.append('<td>-</td>');
            } else if (this.controlVariant) {
                const comparison = this.compareVariants(variant, this.controlVariant);
                const comparisonCell = $('<td></td>');
                
                if (comparison.ctr_diff > 0) {
                    comparisonCell.append(`<div class="text-success">CTR: +${comparison.ctr_diff.toFixed(2)}% (${comparison.ctr_percent_change.toFixed(2)}%)</div>`);
                } else if (comparison.ctr_diff < 0) {
                    comparisonCell.append(`<div class="text-danger">CTR: ${comparison.ctr_diff.toFixed(2)}% (${comparison.ctr_percent_change.toFixed(2)}%)</div>`);
                } else {
                    comparisonCell.append(`<div>CTR: No change</div>`);
                }
                
                if (comparison.ecpm_diff > 0) {
                    comparisonCell.append(`<div class="text-success">eCPM: +$${comparison.ecpm_diff.toFixed(2)} (${comparison.ecpm_percent_change.toFixed(2)}%)</div>`);
                } else if (comparison.ecpm_diff < 0) {
                    comparisonCell.append(`<div class="text-danger">eCPM: -$${Math.abs(comparison.ecpm_diff).toFixed(2)} (${comparison.ecpm_percent_change.toFixed(2)}%)</div>`);
                } else {
                    comparisonCell.append(`<div>eCPM: No change</div>`);
                }
                
                row.append(comparisonCell);
            } else {
                row.append('<td>No control variant to compare with</td>');
            }
            
            tbody.append(row);
        });
    }
    
    /**
     * Update the variant comparison chart
     */
    updateVariantComparisonChart() {
        // Prepare data for chart
        const labels = this.variants.map(v => v.name);
        const ctrData = this.variants.map(v => v.ctr);
        const ecpmData = this.variants.map(v => v.ecpm);
        const backgroundColors = this.variants.map(v => v.is_control ? 'rgba(60, 141, 188, 0.8)' : 'rgba(0, 166, 90, 0.8)');
        
        // Create or update chart
        if (this.variantComparisonChart) {
            this.variantComparisonChart.data.labels = labels;
            this.variantComparisonChart.data.datasets[0].data = ctrData;
            this.variantComparisonChart.data.datasets[0].backgroundColor = backgroundColors;
            this.variantComparisonChart.data.datasets[1].data = ecpmData;
            this.variantComparisonChart.data.datasets[1].backgroundColor = backgroundColors;
            this.variantComparisonChart.update();
        } else {
            const ctx = document.getElementById('variant-comparison-chart').getContext('2d');
            this.variantComparisonChart = new Chart(ctx, {
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
                            backgroundColor: backgroundColors,
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
        }
    }
    
    /**
     * Update the recommendation based on variant performance
     */
    updateRecommendation() {
        const recommendationEl = $('#variant-recommendation');
        const selectWinnerBtn = $('.select-winner-btn');
        
        // Check if we have enough data for a recommendation
        if (!this.controlVariant || this.variants.length < 2) {
            recommendationEl.text('Add a control variant and at least one test variant to get recommendations.');
            selectWinnerBtn.hide();
            return;
        }
        
        // Check if we have enough impressions for a reliable recommendation
        const minImpressions = 1000;
        const hasEnoughData = this.variants.every(v => v.impressions >= minImpressions);
        
        if (!hasEnoughData) {
            recommendationEl.text('Collecting more data for a reliable recommendation. Each variant should have at least 1,000 impressions.');
            selectWinnerBtn.hide();
            return;
        }
        
        // Find the best performing variant
        let bestVariant = this.controlVariant;
        let bestPerformance = 0;
        
        this.variants.forEach(variant => {
            if (variant.is_control) return;
            
            const comparison = this.compareVariants(variant, this.controlVariant);
            const performance = (comparison.ctr_percent_change + comparison.ecpm_percent_change) / 2;
            
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestVariant = variant;
            }
        });
        
        // Generate recommendation
        if (bestVariant === this.controlVariant) {
            recommendationEl.html('The <strong>control variant</strong> is currently performing best. Continue testing or consider creating new variants.');
            selectWinnerBtn.hide();
        } else {
            const comparison = this.compareVariants(bestVariant, this.controlVariant);
            const ctrImprovement = comparison.ctr_percent_change.toFixed(2);
            const ecpmImprovement = comparison.ecpm_percent_change.toFixed(2);
            
            recommendationEl.html(`The variant <strong>${bestVariant.name}</strong> is outperforming the control by ${ctrImprovement}% CTR and ${ecpmImprovement}% eCPM. Consider selecting it as the winner.`);
            
            // Show select winner button
            selectWinnerBtn.show().data('winner-id', bestVariant.id);
        }
    }
    
    /**
     * Compare two variants
     * @param {Object} variant - The variant to compare
     * @param {Object} controlVariant - The control variant
     * @returns {Object} Comparison metrics
     */
    compareVariants(variant, controlVariant) {
        const ctrDiff = variant.ctr - controlVariant.ctr;
        const ctrPercentChange = controlVariant.ctr > 0 
            ? (ctrDiff / controlVariant.ctr) * 100 
            : 0;
            
        const ecpmDiff = variant.ecpm - controlVariant.ecpm;
        const ecpmPercentChange = controlVariant.ecpm > 0 
            ? (ecpmDiff / controlVariant.ecpm) * 100 
            : 0;
            
        return {
            ctr_diff: ctrDiff,
            ctr_percent_change: ctrPercentChange,
            ecpm_diff: ecpmDiff,
            ecpm_percent_change: ecpmPercentChange,
            is_better: (ctrDiff > 0 && ecpmDiff > 0)
        };
    }
    
    /**
     * Format a number with commas
     * @param {number} num - The number to format
     * @returns {string} The formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the ads settings page
    if (document.getElementById('newVariantModal')) {
        ABTestingManager.init();
    }
});
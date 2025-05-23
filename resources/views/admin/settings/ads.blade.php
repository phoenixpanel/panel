@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'ads'])

@section('title')
    Ad Settings
@endsection

@section('content-header')
    <h1>Ad Settings<small>Configure advertisement settings for PhoenixPanel.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Settings</li>
        <li><a href="{{ url('/admin/settings/ads-help') }}" class="btn btn-xs btn-info" target="_blank"><i class="fa fa-question-circle"></i> Help</a></li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <form action="{{ route('admin.settings.ads') }}" method="POST">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Adsterra API Configuration</h3>
                        <div class="box-tools">
                            <a href="{{ url('/admin/settings/ads-help#basic-settings') }}" class="btn btn-xs btn-default" target="_blank" data-toggle="tooltip" title="View help for API configuration">
                                <i class="fa fa-question-circle"></i> Help
                            </a>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label class="control-label">API Key <span class="info-icon" data-tooltip-id="api-key-tooltip">i</span></label>
                            <div>
                                <input type="password" class="form-control" name="phoenixpanel:ads:api_key" value="{{ old('phoenixpanel:ads:api_key', config('phoenixpanel.ads.api_key')) }}">
                                <p class="text-muted small">Your Adsterra API key for accessing their services.</p>
                                <!-- Debug info - remove after testing -->
                                @if(config('app.debug'))
                                    <small class="text-info">Debug: Config value = {{ config('phoenixpanel.ads.api_key') ? '[REDACTED]' : 'null' }}</small>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Universal Ad Code <span class="info-icon" data-tooltip-id="universal-code-tooltip">i</span></h3>
                        <div class="box-tools">
                            <a href="{{ url('/admin/settings/ads-help#basic-settings') }}" class="btn btn-xs btn-default" target="_blank" data-toggle="tooltip" title="View help for universal ad code">
                                <i class="fa fa-question-circle"></i> Help
                            </a>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label class="control-label">Enable Universal Ad Code <span class="info-icon" data-tooltip-id="universal-code-tooltip">i</span></label>
                            <div>
                                <input type="hidden" name="phoenixpanel:ads:universal_code_enabled" value="0">
                                <label>
                                    <input type="checkbox" name="phoenixpanel:ads:universal_code_enabled" value="1" @if(old('phoenixpanel:ads:universal_code_enabled', config('phoenixpanel.ads.universal_code_enabled')) == 1) checked @endif> Enable
                                </label>
                                <!-- Debug info - remove after testing -->
                                @if(config('app.debug'))
                                    <small class="text-info">Debug: Config value = {{ config('phoenixpanel.ads.universal_code_enabled') }}</small>
                                @endif
                                <p class="text-muted small">If enabled, the universal ad code will be used across the panel.</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Universal Ad Code <span class="info-icon" data-tooltip-id="universal-code-tooltip">i</span></label>
                            <div>
                                <textarea class="form-control" name="phoenixpanel:ads:universal_code" rows="6">{{ old('phoenixpanel:ads:universal_code', config('phoenixpanel.ads.universal_code')) }}</textarea>
                                <p class="text-muted small">The universal ad code to be used if enabled.</p>
                                <!-- Debug info - remove after testing -->
                                @if(config('app.debug'))
                                    <small class="text-info">Debug: Config value = {{ config('phoenixpanel.ads.universal_code') ? '[REDACTED]' : 'null' }}</small>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Ad Placements <span class="info-icon" data-tooltip-id="ad-placements-tooltip">i</span></h3>
                        <div class="box-tools">
                            <a href="{{ url('/admin/settings/ads-help#ad-placements') }}" class="btn btn-xs btn-default" target="_blank" data-toggle="tooltip" title="View help for ad placements">
                                <i class="fa fa-question-circle"></i> Help
                            </a>
                            <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#newPlacementModal">
                                <i class="fa fa-plus"></i> Add New Placement
                            </button>
                        </div>
                    </div>
                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <th>Page URL</th>
                                    <th>Position</th>
                                    <th>Size</th>
                                    <th>Device Targeting</th>
                                    <th>Variants</th>
                                    <th>Schedule</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                                <!-- This would be populated with actual data in a real implementation -->
                                <tr>
                                    <td colspan="9" class="text-center">No ad placements configured yet.</td>
                                </tr>
                                <!-- Example row for demonstration -->
                                <tr data-placement-id="1">
                                    <td>Banner Ad</td>
                                    <td>/dashboard</td>
                                    <td>100, 200</td>
                                    <td>728×90</td>
                                    <td>Desktop, Tablet</td>
                                    <td>2 variants</td>
                                    <td>
                                        <span class="label label-primary">May 22 - Jun 30</span>
                                        <div class="small">Daily: 9am-5pm</div>
                                    </td>
                                    <td class="status-cell">
                                        <span class="label label-success">Active</span>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-xs btn-info open-schedule-modal" data-placement-id="1" data-placement-name="Banner Ad">
                                            <i class="fa fa-calendar"></i> Schedule
                                        </button>
                                        <button type="button" class="btn btn-xs btn-default">
                                            <i class="fa fa-pencil"></i> Edit
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Visual Ad Placement Editor <span class="info-icon" data-tooltip-id="visual-editor-tooltip">i</span></h3>
                        <div class="box-tools">
                            <a href="{{ url('/admin/settings/ads-help#visual-editor') }}" class="btn btn-xs btn-default" target="_blank" data-toggle="tooltip" title="View help for visual editor">
                                <i class="fa fa-question-circle"></i> Help
                            </a>
                            <button type="button" class="btn btn-sm btn-info" id="toggle-visual-editor">
                                <i class="fa fa-eye"></i> Toggle Visual Editor
                            </button>
                            <button type="button" class="btn btn-sm btn-success" id="preview-ad-placements">
                                <i class="fa fa-desktop"></i> Preview Placements
                            </button>
                        </div>
                    </div>
                    <div class="box-body">
                        <p class="text-muted">Use the visual editor to drag and drop ad placements onto a representation of your site.</p>
                        <div id="ad-manager-container" style="display: none;">
                            <!-- The ad manager will be initialized here -->
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Performance Metrics <span class="info-icon" data-tooltip-id="metrics-tooltip">i</span></h3>
                        <div class="box-tools">
                            <a href="{{ url('/admin/settings/ads-help#metrics') }}" class="btn btn-xs btn-default" target="_blank" data-toggle="tooltip" title="View help for metrics">
                                <i class="fa fa-question-circle"></i> Help
                            </a>
                            <button type="button" class="btn btn-sm btn-info" id="refresh-metrics">
                                <i class="fa fa-refresh"></i> Refresh Metrics
                            </button>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="metrics-filter-panel">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Date Range <span class="info-icon" data-tooltip-id="date-range-tooltip">i</span></label>
                                                <select class="form-control" id="metrics-date-range">
                                                    <option value="today">Today</option>
                                                    <option value="yesterday">Yesterday</option>
                                                    <option value="last7" selected>Last 7 Days</option>
                                                    <option value="last30">Last 30 Days</option>
                                                    <option value="thisMonth">This Month</option>
                                                    <option value="lastMonth">Last Month</option>
                                                    <option value="custom">Custom Range</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Placement</label>
                                                <select class="form-control" id="metrics-placement">
                                                    <option value="">All Placements</option>
                                                    <!-- Placements will be populated dynamically -->
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4 custom-date-range" style="display: none;">
                                            <div class="form-group">
                                                <label>Custom Range</label>
                                                <div class="input-group">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" class="form-control pull-right" id="metrics-daterange-picker">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row metrics-summary">
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="info-box">
                                    <span class="info-box-icon bg-aqua"><i class="fa fa-eye"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Impressions</span>
                                        <span class="info-box-number" id="total-impressions">0</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="info-box">
                                    <span class="info-box-icon bg-green"><i class="fa fa-mouse-pointer"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Clicks</span>
                                        <span class="info-box-number" id="total-clicks">0</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="info-box">
                                    <span class="info-box-icon bg-yellow"><i class="fa fa-percent"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">CTR</span>
                                        <span class="info-box-number" id="average-ctr">0%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="info-box">
                                    <span class="info-box-icon bg-red"><i class="fa fa-dollar"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Revenue</span>
                                        <span class="info-box-number" id="total-revenue">$0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-8">
                                <div class="chart-container" style="position: relative; height: 300px;">
                                    <canvas id="metrics-chart"></canvas>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="chart-container" style="position: relative; height: 300px;">
                                    <canvas id="metrics-pie-chart"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row" style="margin-top: 20px;">
                            <div class="col-md-12">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover" id="metrics-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Impressions</th>
                                                <th>Clicks</th>
                                                <th>CTR</th>
                                                <th>Revenue</th>
                                                <th>eCPM</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- Metrics data will be populated dynamically -->
                                            <tr class="metrics-loading">
                                                <td colspan="6" class="text-center">
                                                    <i class="fa fa-spinner fa-spin"></i> Loading metrics data...
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row api-key-notice" style="margin-top: 20px; display: none;">
                            <div class="col-md-12">
                                <div class="alert alert-warning">
                                    <i class="fa fa-exclamation-triangle"></i>
                                    <strong>No API Key Configured:</strong> The data shown is placeholder data. To see actual performance metrics, please add your Adsterra API key in the configuration section above.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Campaign Calendar <span class="info-icon" data-tooltip-id="calendar-tooltip">i</span></h3>
                        <div class="box-tools">
                            <a href="{{ url('/admin/settings/ads-help#scheduling') }}" class="btn btn-xs btn-default" target="_blank" data-toggle="tooltip" title="View help for scheduling">
                                <i class="fa fa-question-circle"></i> Help
                            </a>
                            <button type="button" class="btn btn-sm btn-info" id="refresh-calendar">
                                <i class="fa fa-refresh"></i> Refresh Calendar
                            </button>
                        </div>
                    </div>
                    <div class="box-body">
                        <div id="campaigns-calendar-view"></div>
                        <div class="calendar-legend">
                            <div class="legend-item">
                                <div class="legend-color active"></div>
                                <div class="legend-label">Active</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color scheduled"></div>
                                <div class="legend-label">Scheduled</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color inactive"></div>
                                <div class="legend-label">Inactive</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color expired"></div>
                                <div class="legend-label">Expired</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Ad Campaigns <span class="info-icon" data-tooltip-id="campaigns-tooltip">i</span></h3>
                        <div class="box-tools">
                            <a href="{{ url('/admin/settings/ads-help#scheduling') }}" class="btn btn-xs btn-default" target="_blank" data-toggle="tooltip" title="View help for campaigns">
                                <i class="fa fa-question-circle"></i> Help
                            </a>
                            <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#newCampaignModal">
                                <i class="fa fa-plus"></i> Add New Campaign
                            </button>
                        </div>
                    </div>
                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Recurring</th>
                                    <th>Time of Day</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                                <!-- This would be populated with actual data in a real implementation -->
                                <tr>
                                    <td colspan="7" class="text-center">No ad campaigns configured yet.</td>
                                </tr>
                                <!-- Example row for demonstration -->
                                <tr>
                                    <td>Summer Sale</td>
                                    <td>May 22, 2025</td>
                                    <td>Jun 30, 2025</td>
                                    <td>Daily</td>
                                    <td>9am-5pm</td>
                                    <td><span class="label label-success">Active</span></td>
                                    <td>
                                        <button type="button" class="btn btn-xs btn-info">
                                            <i class="fa fa-calendar"></i> Schedule
                                        </button>
                                        <button type="button" class="btn btn-xs btn-default">
                                            <i class="fa fa-pencil"></i> Edit
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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

    <!-- New Placement Modal -->
    <div class="modal fade" id="newPlacementModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form action="" method="POST">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Add New Ad Placement</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="placement_name">Name <span class="info-icon" data-tooltip-id="placement-name-tooltip">i</span></label>
                            <input type="text" class="form-control" id="placement_name" name="placement_name" required>
                        </div>
                        <div class="form-group">
                            <label for="page_url">Page URL <span class="info-icon" data-tooltip-id="page-url-tooltip">i</span></label>
                            <input type="text" class="form-control" id="page_url" name="page_url" required>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="x_position">X Position <span class="info-icon" data-tooltip-id="position-tooltip">i</span></label>
                                    <input type="number" class="form-control" id="x_position" name="x_position" required>
                                    <p class="text-muted small">Can be set using the visual editor</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="y_position">Y Position <span class="info-icon" data-tooltip-id="position-tooltip">i</span></label>
                                    <input type="number" class="form-control" id="y_position" name="y_position" required>
                                    <p class="text-muted small">Can be set using the visual editor</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="width">Width <span class="info-icon" data-tooltip-id="size-tooltip">i</span></label>
                                    <input type="number" class="form-control" id="width" name="width" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="height">Height <span class="info-icon" data-tooltip-id="size-tooltip">i</span></label>
                                    <input type="number" class="form-control" id="height" name="height" required>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="device_targeting">Device Targeting <span class="info-icon" data-tooltip-id="device-targeting-tooltip">i</span></label>
                            <select class="form-control" id="device_targeting" name="device_targeting">
                                <option value="all">All Devices</option>
                                <option value="desktop">Desktop Only</option>
                                <option value="mobile">Mobile Only</option>
                                <option value="tablet">Tablet Only</option>
                                <option value="desktop,tablet">Desktop and Tablet</option>
                                <option value="mobile,tablet">Mobile and Tablet</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Status <span class="info-icon" data-tooltip-id="ad-placements-tooltip">i</span></label>
                            <div>
                                <label>
                                    <input type="checkbox" name="is_active" value="1" checked> Active
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <p class="text-info">
                                <i class="fa fa-info-circle"></i>
                                You can also create and position ad placements using the visual editor below.
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {{ csrf_field() }}
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" name="action" value="add_placement" class="btn btn-primary">Add Placement</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- New Variant Modal -->
    <div class="modal fade" id="newVariantModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form id="variant-form" action="" method="POST">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Add New Ad Variant</h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="variant_placement_id" name="placement_id">
                        <div class="form-group">
                            <label for="variant_name">Variant Name <span class="info-icon" data-tooltip-id="variant-tooltip">i</span></label>
                            <input type="text" class="form-control" id="variant_name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="ad_code">Ad Code <span class="info-icon" data-tooltip-id="variant-tooltip">i</span></label>
                            <textarea class="form-control" id="ad_code" name="ad_code" rows="6" required></textarea>
                            <p class="text-muted small">Enter the ad code for this variant.</p>
                        </div>
                        <div class="form-group">
                            <label for="variant_weight">Weight <span class="info-icon" data-tooltip-id="variant-tooltip">i</span></label>
                            <input type="range" class="form-control" id="variant_weight" name="weight" min="1" max="100" value="50">
                            <div class="weight-display text-center">50%</div>
                            <p class="text-muted small">Higher weight means this variant will be shown more frequently.</p>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="is_control" name="is_control" value="1"> Control Variant
                            </label>
                            <p class="text-muted small">The control variant is the baseline for A/B testing comparison.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {{ csrf_field() }}
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Variant</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Variant Modal -->
    <div class="modal fade" id="editVariantModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form id="edit-variant-form" action="" method="POST">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Edit Ad Variant</h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="edit_variant_id" name="variant_id">
                        <div class="form-group">
                            <label for="edit_variant_name">Variant Name</label>
                            <input type="text" class="form-control" id="edit_variant_name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_ad_code">Ad Code</label>
                            <textarea class="form-control" id="edit_ad_code" name="ad_code" rows="6" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit_variant_weight">Weight</label>
                            <input type="range" class="form-control" id="edit_variant_weight" name="weight" min="1" max="100" value="50">
                            <div class="edit-weight-display text-center">50%</div>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="edit_is_control" name="is_control" value="1"> Control Variant
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {{ csrf_field() }}
                        <button type="button" class="btn btn-danger pull-left delete-variant-btn">Delete Variant</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Variant</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Variant Performance Modal -->
    <div class="modal fade" id="variantPerformanceModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Variant Performance Comparison</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="variant-comparison-chart-container" style="position: relative; height: 300px;">
                                <canvas id="variant-comparison-chart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 20px;">
                        <div class="col-md-12">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover" id="variant-comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Variant</th>
                                            <th>Impressions</th>
                                            <th>Clicks</th>
                                            <th>CTR</th>
                                            <th>Revenue</th>
                                            <th>eCPM</th>
                                            <th>Compared to Control</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Variant comparison data will be populated dynamically -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 20px;">
                        <div class="col-md-12">
                            <div class="alert alert-info">
                                <strong>Recommendation:</strong> <span id="variant-recommendation">Collecting more data for a reliable recommendation.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success select-winner-btn" style="display: none;">Select Winner</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Schedule Modal -->
    <div class="modal fade" id="scheduleModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <form id="schedule-form" action="javascript:void(0);">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="scheduleModalLabel">Schedule Campaign</h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="schedule_placement_id" name="placement_id">
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="box box-primary">
                                    <div class="box-header with-border">
                                        <h3 class="box-title">Schedule Settings</h3>
                                    </div>
                                    <div class="box-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="start_date">Start Date <span class="info-icon" data-tooltip-id="schedule-tooltip">i</span></label>
                                                    <input type="text" class="form-control" id="start_date" name="start_date" placeholder="YYYY-MM-DD">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="start_time">Start Time</label>
                                                    <input type="text" class="form-control" id="start_time" name="start_time" placeholder="HH:MM">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="end_date">End Date</label>
                                                    <input type="text" class="form-control" id="end_date" name="end_date" placeholder="YYYY-MM-DD">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="end_time">End Time</label>
                                                    <input type="text" class="form-control" id="end_time" name="end_time" placeholder="HH:MM">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="recurring_schedule">Recurring Schedule</label>
                                            <select class="form-control" id="recurring_schedule" name="recurring_schedule[]" multiple>
                                                <option value="monday">Monday</option>
                                                <option value="tuesday">Tuesday</option>
                                                <option value="wednesday">Wednesday</option>
                                                <option value="thursday">Thursday</option>
                                                <option value="friday">Friday</option>
                                                <option value="saturday">Saturday</option>
                                                <option value="sunday">Sunday</option>
                                            </select>
                                            <p class="text-muted small">Select days of the week when this campaign should run. Leave empty to run every day.</p>
                                        </div>
                                        <div class="form-group">
                                            <label for="time_of_day">Time of Day Targeting</label>
                                            <select class="form-control" id="time_of_day" name="time_of_day[]" multiple>
                                                <!-- Hours will be populated by JavaScript -->
                                            </select>
                                            <p class="text-muted small">Select hours of the day when this campaign should run. Leave empty to run all day.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="box box-primary">
                                    <div class="box-header with-border">
                                        <h3 class="box-title">Calendar View</h3>
                                    </div>
                                    <div class="box-body">
                                        <div id="campaign-calendar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {{ csrf_field() }}
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" id="save-schedule" class="btn btn-primary">Save Schedule</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- New Campaign Modal -->
    <div class="modal fade" id="newCampaignModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form action="" method="POST">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Add New Ad Campaign</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="campaign_name">Name</label>
                            <input type="text" class="form-control" id="campaign_name" name="campaign_name" required>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="campaign_start_date">Start Date</label>
                                    <input type="text" class="form-control" id="campaign_start_date" name="start_date" placeholder="YYYY-MM-DD">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="campaign_end_date">End Date</label>
                                    <input type="text" class="form-control" id="campaign_end_date" name="end_date" placeholder="YYYY-MM-DD">
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Recurring Schedule</label>
                            <div class="checkbox">
                                <label><input type="checkbox" name="recurring_daily" value="1"> Daily</label>
                            </div>
                            <div class="checkbox">
                                <label><input type="checkbox" name="recurring_weekly" value="1"> Weekly</label>
                            </div>
                            <div class="checkbox">
                                <label><input type="checkbox" name="recurring_monthly" value="1"> Monthly</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="targeting_rules">Targeting Rules (JSON)</label>
                            <textarea class="form-control" id="targeting_rules" name="targeting_rules" rows="4"></textarea>
                            <p class="text-muted small">Enter targeting rules in JSON format. Leave empty for no specific targeting.</p>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <div>
                                <label>
                                    <input type="checkbox" name="is_active" value="1" checked> Active
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {{ csrf_field() }}
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" name="action" value="add_campaign" class="btn btn-primary">Add Campaign</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

<!-- Preview Modal -->
<div class="modal fade" id="previewModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Ad Placement Preview</h4>
            </div>
            <div class="modal-body">
                <div class="preview-device-selector text-center" style="margin-bottom: 15px;">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default active" data-device="desktop">
                            <i class="fa fa-desktop"></i> Desktop
                        </button>
                        <button type="button" class="btn btn-default" data-device="tablet">
                            <i class="fa fa-tablet"></i> Tablet
                        </button>
                        <button type="button" class="btn btn-default" data-device="mobile">
                            <i class="fa fa-mobile"></i> Mobile
                        </button>
                    </div>
                </div>
                <div class="preview-container-wrapper">
                    <div class="preview-device-view desktop-view" style="display: block; overflow: auto; text-align: center;">
                        <!-- Desktop preview content will be loaded here -->
                    </div>
                    <div class="preview-device-view tablet-view" style="display: none; overflow: auto; text-align: center;">
                        <!-- Tablet preview content will be loaded here -->
                    </div>
                    <div class="preview-device-view mobile-view" style="display: none; overflow: auto; text-align: center;">
                        <!-- Mobile preview content will be loaded here -->
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close Preview</button>
            </div>
        </div>
    </div>
</div>

@section('footer-scripts')
    @parent
    <script src="https://cdn.jsdelivr.net/npm/interactjs@1.10.11/dist/interact.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/daterangepicker@3.1.0/daterangepicker.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.9/dist/flatpickr.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daterangepicker@3.1.0/daterangepicker.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr@4.6.9/dist/flatpickr.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css">
    <link rel="stylesheet" href="{{ asset('css/admin/ab-testing.css') }}">
    <script src="{{ asset('js/admin/ad-manager.js') }}"></script>
    <script src="{{ asset('js/admin/metrics-manager.js') }}"></script>
    <script src="{{ asset('js/admin/ab-testing-manager.js') }}"></script>
    <script src="{{ asset('js/admin/schedule-manager.js') }}"></script>
    <script src="{{ asset('js/admin/ad-tooltips.js') }}"></script>
    
    <script>
        // Initialize tooltips
        $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
    <script>
        // Global AdManager initialization function
        function initializeAdManager() {
            const adManagerContainer = document.getElementById('ad-manager-container');
            if (!adManagerContainer) {
                console.error('AdManager: Container not found');
                return;
            }
            
            // Check if container is visible
            if (!$(adManagerContainer).is(':visible')) {
                console.warn('AdManager: Container is not visible, skipping initialization');
                return;
            }
            
            // Prevent multiple initializations
            if (window.adManager) {
                console.log('AdManager: Already initialized, skipping');
                return;
            }
            
            try {
                console.log('AdManager: Initializing new instance');
                // Store the adManager instance globally
                window.adManager = new AdManager(adManagerContainer);
                window.adManager.init();
                console.log('AdManager: Initialization complete');
            } catch (error) {
                console.error('AdManager: Initialization failed', error);
            }
        }
        
        $(document).ready(function() {
            // Toggle universal code textarea based on checkbox
            $('input[name="phoenixpanel:ads:universal_code_enabled"]').change(function() {
                if ($(this).is(':checked')) {
                    $('textarea[name="phoenixpanel:ads:universal_code"]').closest('.form-group').fadeIn();
                } else {
                    $('textarea[name="phoenixpanel:ads:universal_code"]').closest('.form-group').fadeOut();
                }
            }).trigger('change');
            
            // Toggle visual editor
            $('#toggle-visual-editor').click(function() {
                const container = $('#ad-manager-container');
                console.log('AdManager: Toggle button clicked, container visible:', container.is(':visible'));
                
                if (container.is(':visible')) {
                    container.hide();
                    $(this).html('<i class="fa fa-eye"></i> Show Visual Editor');
                    // Cleanup AdManager instance when hiding
                    if (window.adManager) {
                        console.log('AdManager: Hiding visual editor');
                        window.adManager = null;
                    }
                } else {
                    console.log('AdManager: Showing visual editor container...');
                    container.show();
                    $(this).html('<i class="fa fa-eye-slash"></i> Hide Visual Editor');
                    
                    // DIAGNOSTIC: Check dependencies before initialization
                    console.log('AdManager: Checking dependencies...');
                    console.log('AdManager: jQuery available:', typeof $ !== 'undefined');
                    console.log('AdManager: interact.js available:', typeof interact !== 'undefined');
                    console.log('AdManager: AdManager class available:', typeof AdManager !== 'undefined');
                    console.log('AdManager: Container element:', container[0]);
                    console.log('AdManager: Container display style:', container.css('display'));
                    
                    // Initialize AdManager when showing
                    console.log('AdManager: Showing visual editor, initializing...');
                    console.log('AdManager: Checking if initializeAdManager function exists:', typeof initializeAdManager);
                    console.log('AdManager: Checking window.initializeAdManager:', typeof window.initializeAdManager);
                    
                    // Add a small delay to ensure container is fully visible
                    setTimeout(function() {
                        console.log('AdManager: Delayed initialization starting...');
                        if (typeof initializeAdManager === 'function') {
                            initializeAdManager();
                        } else if (typeof window.initializeAdManager === 'function') {
                            window.initializeAdManager();
                        } else {
                            console.error('AdManager: initializeAdManager function not found in any scope');
                        }
                    }, 100);
                }
            });
            
            // Connect visual editor with form
            $('#newPlacementModal').on('show.bs.modal', function() {
                // Reset form fields
                $('#placement_name').val('Ad Placement ' + ($('.ad-placement').length + 1));
                $('#page_url').val(window.location.pathname);
                $('#x_position').val(0);
                $('#y_position').val(0);
                $('#width').val(300);
                $('#height').val(250);
                
                // Initialize A/B testing functionality
                if (typeof ABTestingManager !== 'undefined') {
                    ABTestingManager.init();
                }
            });
            
            // Add a button to use the visual editor from the modal
            const useVisualEditorBtn = $('<button type="button" class="btn btn-info" id="use-visual-editor">Use Visual Editor</button>');
            useVisualEditorBtn.insertBefore($('#newPlacementModal .modal-footer button:first'));
            
            // Handle the use visual editor button click
            $('#use-visual-editor').click(function() {
                // Hide the modal
                $('#newPlacementModal').modal('hide');
                
                // Show the visual editor if it's hidden
                if (!$('#ad-manager-container').is(':visible')) {
                    $('#toggle-visual-editor').click();
                }
                
                // Add a notification to guide the user
                const notification = $('<div class="alert alert-info" id="visual-editor-notification">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '<strong>Visual Editor Mode:</strong> Drag an ad template from the toolbox onto the page preview to create a new placement.' +
                    '</div>');
                
                // Remove any existing notification
                $('#visual-editor-notification').remove();
                
                // Add the notification before the visual editor
                notification.insertBefore($('#ad-manager-container'));
                
                // Auto-dismiss after 10 seconds
                setTimeout(function() {
                    notification.alert('close');
                }, 10000);
                
                // Add event listeners for placement events (using event delegation)
                $(document).on('adPlacementCreated', function(e) {
                    console.log('AdManager: Placement created event received', e.detail);
                    // Open the modal
                    $('#newPlacementModal').modal('show');
                    
                    // Update form fields with placement data
                    if (window.adManager) {
                        window.adManager.updateFormFields('#newPlacementModal form', e.detail);
                    }
                });
                
                $(document).on('adPlacementSelected', function(e) {
                    console.log('AdManager: Placement selected event received', e.detail);
                    // Update form fields with placement data
                    if (window.adManager) {
                        window.adManager.updateFormFields('#newPlacementModal form', e.detail);
                    }
                });
            });
            
            // Preview button functionality
            $('#preview-ad-placements').click(function() {
                // Get the ad manager instance
                const adManager = window.adManager;
                if (!adManager) {
                    alert('Ad manager not initialized. Please open the visual editor first.');
                    return;
                }
                
                // Show loading state
                const previewBtn = $(this);
                const originalHtml = previewBtn.html();
                previewBtn.html('<i class="fa fa-spinner fa-spin"></i> Loading...');
                previewBtn.prop('disabled', true);
                
                // Get current ad placements
                const placements = adManager.adPlacements;
                
                // Send to server for preview generation
                $.ajax({
                    url: '{{ route('admin.settings.ads.preview') }}',
                    type: 'POST',
                    data: {
                        placements: placements,
                        _token: '{{ csrf_token() }}'
                    },
                    success: function(response) {
                        // Reset button
                        previewBtn.html(originalHtml);
                        previewBtn.prop('disabled', false);
                        
                        if (response.success) {
                            // Load preview HTML into modal
                            $('.preview-device-view.desktop-view').html(response.preview.desktop);
                            $('.preview-device-view.tablet-view').html(response.preview.tablet);
                            $('.preview-device-view.mobile-view').html(response.preview.mobile);
                            
                            // Show the modal
                            $('#previewModal').modal('show');
                        } else {
                            alert('Failed to generate preview: ' + (response.message || 'Unknown error'));
                        }
                    },
                    error: function() {
                        // Reset button
                        previewBtn.html(originalHtml);
                        previewBtn.prop('disabled', false);
                        
                        alert('Failed to generate preview. Please try again.');
                    }
                });
            });
            
            // Preview modal device selector
            $('.preview-device-selector button').click(function() {
                const device = $(this).data('device');
                
                // Update active button
                $('.preview-device-selector button').removeClass('active');
                $(this).addClass('active');
                
                // Show selected device view
                $('.preview-device-view').hide();
                $(`.preview-device-view.${device}-view`).show();
            });
        });
        
        // Weight slider functionality
        $('#variant_weight').on('input', function() {
            $('.weight-display').text($(this).val() + '%');
        });
        
        $('#edit_variant_weight').on('input', function() {
            $('.edit-weight-display').text($(this).val() + '%');
        });
        
        // Variant form submission
        $('#variant-form').on('submit', function(e) {
            e.preventDefault();
            
            $.ajax({
                url: '{{ route('admin.settings.ads.variants.create') }}',
                type: 'POST',
                data: $(this).serialize(),
                success: function(response) {
                    if (response.success) {
                        $('#newVariantModal').modal('hide');
                        // Refresh the page or update the UI
                        alert('Variant created successfully');
                        location.reload();
                    } else {
                        alert('Failed to create variant: ' + response.message);
                    }
                },
                error: function() {
                    alert('An error occurred while creating the variant');
                }
            });
        });
        
        // Edit variant form submission
        $('#edit-variant-form').on('submit', function(e) {
            e.preventDefault();
            
            const variantId = $('#edit_variant_id').val();
            
            $.ajax({
                url: '/admin/settings/ads/variants/' + variantId,
                type: 'PATCH',
                data: $(this).serialize(),
                success: function(response) {
                    if (response.success) {
                        $('#editVariantModal').modal('hide');
                        // Refresh the page or update the UI
                        alert('Variant updated successfully');
                        location.reload();
                    } else {
                        alert('Failed to update variant: ' + response.message);
                    }
                },
                error: function() {
                    alert('An error occurred while updating the variant');
                }
            });
        });
        
        // Delete variant button
        $('.delete-variant-btn').on('click', function() {
            if (confirm('Are you sure you want to delete this variant?')) {
                const variantId = $('#edit_variant_id').val();
                
                $.ajax({
                    url: '/admin/settings/ads/variants/' + variantId,
                    type: 'DELETE',
                    data: {
                        _token: '{{ csrf_token() }}'
                    },
                    success: function(response) {
                        if (response.success) {
                            $('#editVariantModal').modal('hide');
                            // Refresh the page or update the UI
                            alert('Variant deleted successfully');
                            location.reload();
                        } else {
                            alert('Failed to delete variant: ' + response.message);
                        }
                    },
                    error: function() {
                        alert('An error occurred while deleting the variant');
                    }
                });
            }
        });
        
        // Select winner button
        $('.select-winner-btn').on('click', function() {
            const winnerId = $(this).data('winner-id');
            if (winnerId && confirm('Are you sure you want to select this variant as the winner?')) {
                // Implement winner selection logic
                alert('Winner selected! The winning variant will now be used for all traffic.');
                $('#variantPerformanceModal').modal('hide');
            }
        });
        
        // Initialize the calendar view for campaigns
        document.addEventListener('DOMContentLoaded', function() {
            const calendarEl = document.getElementById('campaigns-calendar-view');
            if (calendarEl) {
                const calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    },
                    events: [
                        // Example events
                        {
                            title: 'Banner Ad',
                            start: '2025-05-22',
                            end: '2025-06-30',
                            className: 'active-campaign'
                        },
                        {
                            title: 'Sidebar Ad',
                            start: '2025-06-01',
                            end: '2025-06-15',
                            className: 'scheduled-campaign'
                        },
                        {
                            title: 'Mobile Ad',
                            start: '2025-05-15',
                            end: '2025-05-20',
                            className: 'inactive-campaign'
                        }
                    ],
                    eventClick: function(info) {
                        // Open the schedule modal for the clicked event
                        // In a real implementation, this would fetch the placement data
                        alert('Clicked on: ' + info.event.title);
                    }
                });
                calendar.render();
            }
            
            // Initialize flatpickr for date inputs in the campaign modal
            flatpickr("#campaign_start_date", {
                enableTime: false,
                dateFormat: "Y-m-d"
            });
            
            flatpickr("#campaign_end_date", {
                enableTime: false,
                dateFormat: "Y-m-d"
            });
            
            // Refresh calendar button
            $('#refresh-calendar').click(function() {
                // In a real implementation, this would fetch updated data
                alert('Calendar refreshed');
            });
            
            // Initialize the schedule manager if the element exists
            if (document.getElementById('campaign-calendar')) {
                window.scheduleManager = new ScheduleManager();
                window.scheduleManager.init();
            }
            
            // Open schedule modal buttons
            $('.open-schedule-modal').click(function() {
                const placementId = $(this).data('placement-id');
                const placementName = $(this).data('placement-name');
                
                if (window.scheduleManager) {
                    window.scheduleManager.openScheduleModal(placementId, placementName);
                } else {
                    $('#scheduleModal').modal('show');
                    $('#schedule_placement_id').val(placementId);
                    $('#scheduleModalLabel').text('Schedule for ' + placementName);
                }
            });
        });
        
        // Global initialization function for external access
        window.initializeAdManager = initializeAdManager;
        
        // Auto-initialize if visual editor is already visible on page load
        $(document).ready(function() {
            console.log('AdManager: Document ready, checking AdManager class availability:', typeof AdManager);
            console.log('AdManager: Checking initializeAdManager function availability:', typeof initializeAdManager);
            const container = $('#ad-manager-container');
            if (container.is(':visible')) {
                console.log('AdManager: Container visible on page load, initializing...');
                if (typeof initializeAdManager === 'function') {
                    initializeAdManager();
                } else {
                    console.error('AdManager: initializeAdManager function not available on document ready');
                }
            }
        });

        // DIAGNOSTIC: Add form submission logging
        $(document).ready(function() {
            console.log('DIAGNOSTIC: Setting up form submission monitoring...');
            
            // Find the main settings form
            const settingsForm = $('form[action*="admin.settings.ads"]').first();
            console.log('DIAGNOSTIC: Found settings form:', settingsForm.length > 0);
            
            if (settingsForm.length > 0) {
                // Monitor form submission
                settingsForm.on('submit', function(e) {
                    console.log('DIAGNOSTIC: Form submission detected!');
                    console.log('DIAGNOSTIC: Form action:', $(this).attr('action'));
                    console.log('DIAGNOSTIC: Form method:', $(this).attr('method'));
                    console.log('DIAGNOSTIC: Form data:', $(this).serialize());
                    
                    // Check for _method field
                    const methodField = $(this).find('input[name="_method"]');
                    console.log('DIAGNOSTIC: _method field found:', methodField.length > 0);
                    if (methodField.length > 0) {
                        console.log('DIAGNOSTIC: _method value:', methodField.val());
                    }
                    
                    // Check for CSRF token
                    const csrfField = $(this).find('input[name="_token"]');
                    console.log('DIAGNOSTIC: CSRF token found:', csrfField.length > 0);
                    if (csrfField.length > 0) {
                        console.log('DIAGNOSTIC: CSRF token value:', csrfField.val().substring(0, 10) + '...');
                    }
                });
                
                // Monitor save button clicks
                settingsForm.find('button[type="submit"]').on('click', function(e) {
                    console.log('DIAGNOSTIC: Save button clicked!');
                    console.log('DIAGNOSTIC: Button name:', $(this).attr('name'));
                    console.log('DIAGNOSTIC: Button value:', $(this).attr('value'));
                });
            }
        });
    </script>
@endsection
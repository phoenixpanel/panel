@extends('layouts.admin')
@section('title')
    Ad Manager Help
@endsection

@section('content-header')
    <h1>Ad Manager Help<small>Comprehensive guide for using the Ad Manager.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.settings.ads') }}">Ad Settings</a></li>
        <li class="active">Help</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Ad Manager User Guide</h3>
                </div>
                <div class="box-body">
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li class="active"><a href="#basic-settings" data-toggle="tab">Basic Settings</a></li>
                            <li><a href="#visual-editor" data-toggle="tab">Visual Editor</a></li>
                            <li><a href="#ad-placements" data-toggle="tab">Ad Placements</a></li>
                            <li><a href="#preview" data-toggle="tab">Preview</a></li>
                            <li><a href="#metrics" data-toggle="tab">Metrics</a></li>
                            <li><a href="#ab-testing" data-toggle="tab">A/B Testing</a></li>
                            <li><a href="#scheduling" data-toggle="tab">Scheduling</a></li>
                        </ul>
                        <div class="tab-content">
                            <!-- Basic Settings -->
                            <div class="tab-pane active" id="basic-settings">
                                <h4>Basic Settings Configuration</h4>
                                <p>The Ad Manager allows you to integrate Adsterra advertisements into your PhoenixPanel installation.</p>
                                
                                <div class="callout callout-info">
                                    <h4>API Key Configuration</h4>
                                    <p>To use the full features of the Ad Manager, you need to configure your Adsterra API key:</p>
                                    <ol>
                                        <li>Sign in to your Adsterra account</li>
                                        <li>Navigate to the API section</li>
                                        <li>Generate or copy your API key</li>
                                        <li>Paste it in the API Key field in the Ad Manager settings</li>
                                    </ol>
                                    <p>With a valid API key, you'll be able to fetch real performance metrics and optimize your ad campaigns.</p>
                                </div>
                                
                                <div class="callout callout-info">
                                    <h4>Universal Ad Code</h4>
                                    <p>The Universal Ad Code option allows you to apply a single ad code across your entire panel:</p>
                                    <ol>
                                        <li>Enable the "Universal Ad Code" option</li>
                                        <li>Paste your Adsterra ad code in the text area</li>
                                        <li>Save your settings</li>
                                    </ol>
                                    <p>This is useful for simple implementations where you don't need granular control over ad placements.</p>
                                </div>
                                
                                <div class="alert alert-warning">
                                    <i class="fa fa-info-circle"></i> When Universal Ad Code is enabled, it takes precedence over individual ad placements.
                                </div>
                            </div>
                            
                            <!-- Visual Editor -->
                            <div class="tab-pane" id="visual-editor">
                                <h4>Using the Visual Editor</h4>
                                <p>The Visual Editor provides an intuitive way to position ad placements on your pages:</p>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Opening the Visual Editor</h4>
                                            <ol>
                                                <li>Click the "Toggle Visual Editor" button in the Visual Ad Placement Editor section</li>
                                                <li>The editor will display a representation of your site layout</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Creating Ad Placements</h4>
                                            <ol>
                                                <li>Drag an ad template from the toolbox on the left</li>
                                                <li>Drop it onto the desired position in the page preview</li>
                                                <li>The placement will be created and can be configured</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Adjusting Placements</h4>
                                            <ol>
                                                <li>Click on an existing placement to select it</li>
                                                <li>Drag it to reposition</li>
                                                <li>Use the handles to resize it</li>
                                                <li>The configuration panel will update with the placement's details</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Device View Switching</h4>
                                            <ol>
                                                <li>Use the device view buttons (Desktop, Tablet, Mobile) to switch between different device views</li>
                                                <li>This helps ensure your ad placements look good on all devices</li>
                                                <li>You can set device-specific targeting for each placement</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="fa fa-lightbulb-o"></i> <strong>Tip:</strong> The grid in the background helps with alignment. Placements will snap to the grid for precise positioning.
                                </div>
                            </div>
                            
                            <!-- Ad Placements -->
                            <div class="tab-pane" id="ad-placements">
                                <h4>Creating and Managing Ad Placements</h4>
                                <p>Ad placements define where ads appear on your site:</p>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Creating a New Placement</h4>
                                            <ol>
                                                <li>Click the "Add New Placement" button</li>
                                                <li>Fill in the placement details:
                                                    <ul>
                                                        <li><strong>Name:</strong> A descriptive name for the placement</li>
                                                        <li><strong>Page URL:</strong> The URL where the ad will appear</li>
                                                        <li><strong>Position:</strong> X and Y coordinates (can be set using the visual editor)</li>
                                                        <li><strong>Size:</strong> Width and height in pixels</li>
                                                        <li><strong>Device Targeting:</strong> Which devices should show this ad</li>
                                                    </ul>
                                                </li>
                                                <li>Click "Add Placement" to save</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Managing Existing Placements</h4>
                                            <ol>
                                                <li>All placements are listed in the Ad Placements table</li>
                                                <li>Click the "Edit" button to modify a placement</li>
                                                <li>Click the "Schedule" button to set up scheduling</li>
                                                <li>The status column shows whether a placement is active</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="callout callout-info">
                                    <h4>Adding Ad Variants</h4>
                                    <p>Each placement can have multiple variants for A/B testing:</p>
                                    <ol>
                                        <li>Select a placement and click "Add Variant"</li>
                                        <li>Provide a name for the variant</li>
                                        <li>Paste the ad code</li>
                                        <li>Set the weight (determines how often this variant is shown)</li>
                                        <li>Optionally mark it as a control variant for A/B testing</li>
                                    </ol>
                                </div>
                                
                                <div class="alert alert-warning">
                                    <i class="fa fa-info-circle"></i> At least one variant must be created for each placement for ads to display.
                                </div>
                            </div>
                            
                            <!-- Preview -->
                            <div class="tab-pane" id="preview">
                                <h4>Using the Preview Functionality</h4>
                                <p>The preview feature allows you to see how your ad placements will look before they go live:</p>
                                
                                <div class="callout callout-info">
                                    <h4>Generating a Preview</h4>
                                    <ol>
                                        <li>Set up your ad placements using the visual editor or manual configuration</li>
                                        <li>Click the "Preview Placements" button</li>
                                        <li>A modal will open showing a preview of your page with the ad placements</li>
                                    </ol>
                                </div>
                                
                                <div class="callout callout-info">
                                    <h4>Device-Specific Previews</h4>
                                    <ol>
                                        <li>In the preview modal, use the device selector buttons (Desktop, Tablet, Mobile)</li>
                                        <li>The preview will update to show how ads appear on different devices</li>
                                        <li>This helps ensure your ads are responsive and look good on all screen sizes</li>
                                    </ol>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="fa fa-lightbulb-o"></i> <strong>Tip:</strong> Use the preview feature regularly as you make changes to ensure your ad placements look as expected.
                                </div>
                            </div>
                            
                            <!-- Metrics -->
                            <div class="tab-pane" id="metrics">
                                <h4>Understanding the Metrics Dashboard</h4>
                                <p>The Metrics Dashboard provides insights into your ad performance:</p>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Viewing Performance Metrics</h4>
                                            <ol>
                                                <li>Navigate to the Performance Metrics section</li>
                                                <li>Select a date range from the dropdown</li>
                                                <li>Optionally filter by specific placement</li>
                                                <li>View the summary boxes showing:
                                                    <ul>
                                                        <li>Impressions: Number of times ads were displayed</li>
                                                        <li>Clicks: Number of clicks on ads</li>
                                                        <li>CTR: Click-through rate (percentage)</li>
                                                        <li>Revenue: Total earnings from ads</li>
                                                    </ul>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Analyzing Charts and Tables</h4>
                                            <ol>
                                                <li>The line chart shows trends over time</li>
                                                <li>The pie chart shows distribution of metrics</li>
                                                <li>The detailed table shows daily performance data</li>
                                                <li>Use these visualizations to identify patterns and optimize your ad strategy</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="callout callout-info">
                                    <h4>Custom Date Ranges</h4>
                                    <ol>
                                        <li>Select "Custom Range" from the date range dropdown</li>
                                        <li>Use the date picker to select specific start and end dates</li>
                                        <li>Click "Apply" to update the metrics</li>
                                    </ol>
                                </div>
                                
                                <div class="alert alert-warning">
                                    <i class="fa fa-info-circle"></i> A valid Adsterra API key is required to fetch real metrics. Without an API key, placeholder data will be shown.
                                </div>
                            </div>
                            
                            <!-- A/B Testing -->
                            <div class="tab-pane" id="ab-testing">
                                <h4>Setting Up and Analyzing A/B Tests</h4>
                                <p>A/B testing allows you to compare different ad variants to optimize performance:</p>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Creating A/B Test Variants</h4>
                                            <ol>
                                                <li>Select an ad placement</li>
                                                <li>Add at least two variants:
                                                    <ul>
                                                        <li>One marked as the "Control Variant" (baseline)</li>
                                                        <li>One or more test variants</li>
                                                    </ul>
                                                </li>
                                                <li>Set weights for each variant (determines traffic distribution)</li>
                                                <li>Save the variants</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Viewing Test Results</h4>
                                            <ol>
                                                <li>Click the "View Performance" button for a placement</li>
                                                <li>The variant comparison modal will show:
                                                    <ul>
                                                        <li>Performance metrics for each variant</li>
                                                        <li>Comparison to the control variant</li>
                                                        <li>Visual charts of performance differences</li>
                                                    </ul>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="callout callout-info">
                                    <h4>Selecting a Winner</h4>
                                    <ol>
                                        <li>Once enough data is collected (at least 1,000 impressions per variant)</li>
                                        <li>The system will provide a recommendation based on CTR and eCPM</li>
                                        <li>Click the "Select Winner" button to make that variant the primary one</li>
                                        <li>The winning variant will receive 100% of the traffic</li>
                                    </ol>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="fa fa-lightbulb-o"></i> <strong>Tip:</strong> For reliable results, allow each test to run for at least a week and collect sufficient data before making decisions.
                                </div>
                            </div>
                            
                            <!-- Scheduling -->
                            <div class="tab-pane" id="scheduling">
                                <h4>Scheduling Campaigns</h4>
                                <p>The scheduling feature allows you to control when ads are displayed:</p>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Setting Up a Schedule</h4>
                                            <ol>
                                                <li>Click the "Schedule" button for a placement</li>
                                                <li>Set the start and end dates</li>
                                                <li>Optionally set start and end times</li>
                                                <li>Select recurring days (e.g., weekdays only)</li>
                                                <li>Select time of day targeting (e.g., business hours only)</li>
                                                <li>Save the schedule</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="callout callout-info">
                                            <h4>Using the Calendar View</h4>
                                            <ol>
                                                <li>The calendar shows all scheduled campaigns</li>
                                                <li>Different colors indicate different status:
                                                    <ul>
                                                        <li>Green: Active campaigns</li>
                                                        <li>Blue: Scheduled campaigns</li>
                                                        <li>Gray: Inactive campaigns</li>
                                                        <li>Red: Expired campaigns</li>
                                                    </ul>
                                                </li>
                                                <li>Click on a calendar event to edit that schedule</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="callout callout-info">
                                    <h4>Advanced Scheduling Options</h4>
                                    <ol>
                                        <li><strong>Recurring Schedule:</strong> Set ads to run only on specific days of the week</li>
                                        <li><strong>Time of Day Targeting:</strong> Set ads to run only during specific hours</li>
                                        <li><strong>Drag and Drop:</strong> You can drag events on the calendar to change dates</li>
                                        <li><strong>Resize:</strong> You can resize events to change their duration</li>
                                    </ol>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="fa fa-lightbulb-o"></i> <strong>Tip:</strong> Use scheduling to run different ad campaigns during peak traffic hours or to coordinate with marketing campaigns.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    <a href="{{ route('admin.settings.ads') }}" class="btn btn-default">Return to Ad Settings</a>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        // Activate the tab based on hash in URL
        $(document).ready(function() {
            if (window.location.hash) {
                $('.nav-tabs a[href="' + window.location.hash + '"]').tab('show');
            }
            
            // Update hash when tab is clicked
            $('.nav-tabs a').on('shown.bs.tab', function (e) {
                window.location.hash = e.target.hash;
            });
        });
    </script>
@endsection
# Adsterra Ad Manager Implementation Plan

## Overview
This document outlines the implementation plan for adding a new "Ad Manager" tab to the admin settings interface at `/admin/settings`. This tab will provide comprehensive support for Adsterra's advertising system with advanced ad management capabilities.

## 1. Backend Components

### 1.1 Create a new controller for the Ad Manager tab
```php
// app/Http/Controllers/Admin/Settings/AdManagerController.php
```
This controller will handle:
- Displaying the Ad Manager interface
- Saving ad configuration settings
- API interactions with Adsterra

### 1.2 Create database migrations
```php
// database/migrations/yyyy_mm_dd_create_ad_placements_table.php
// database/migrations/yyyy_mm_dd_create_ad_campaigns_table.php
// database/migrations/yyyy_mm_dd_create_ad_metrics_table.php
```
These migrations will create tables for:
- Ad placements (position, size, page, device targeting)
- Ad campaigns (start/end dates, A/B test configurations)
- Ad performance metrics (impressions, clicks, revenue)

### 1.3 Create models
```php
// app/Models/AdPlacement.php
// app/Models/AdCampaign.php
// app/Models/AdMetric.php
```
These models will handle the relationships and business logic for the ad management system.

### 1.4 Create API service for Adsterra
```php
// app/Services/AdsterraApiService.php
```
This service will:
- Handle authentication with Adsterra API using the API key
- Fetch performance metrics
- Manage ad code generation

### 1.5 Update routes
```php
// routes/admin.php
```
Add a new route for the Ad Manager tab:
```php
Route::get('/admanager', [Admin\Settings\AdManagerController::class, 'index'])->name('admin.settings.admanager');
Route::patch('/admanager', [Admin\Settings\AdManagerController::class, 'update']);
Route::post('/admanager/preview', [Admin\Settings\AdManagerController::class, 'preview'])->name('admin.settings.admanager.preview');
Route::post('/admanager/metrics', [Admin\Settings\AdManagerController::class, 'fetchMetrics'])->name('admin.settings.admanager.metrics');
```

## 2. Frontend Components

### 2.1 Create the Ad Manager view
```php
// resources/views/admin/settings/admanager.blade.php
```
This view will extend the admin layout and include the settings navigation partial.

### 2.2 Update the navigation partial
```php
// resources/views/partials/admin/settings/nav.blade.php
```
Add the "Ad Manager" tab to the navigation menu.

### 2.3 Create JavaScript components for the visual editor
```javascript
// public/js/admin/ad-manager.js
```
This will include:
- Drag-and-drop functionality using a library like interact.js
- Visual page representation
- Ad placement configuration interface
- A/B testing configuration
- Preview functionality

## 3. Implementation Flow

The implementation will follow this sequence:
1. Create Database Migrations
2. Create Models
3. Create AdsterraApiService
4. Create AdManagerController
5. Update Routes
6. Create Ad Manager View
7. Update Navigation Partial
8. Create JavaScript Components
9. Implement Drag-and-Drop Interface
10. Implement A/B Testing
11. Implement Preview Functionality
12. Implement Metrics Dashboard
13. Test and Debug

## 4. Detailed Feature Implementation

### 4.1 Ad Placement Management
- Visual interface showing a representation of site pages
- Drag-and-drop functionality for placing ads
- Configuration panel for each ad placement:
  - Size (responsive options)
  - Device targeting (desktop, tablet, mobile)
  - Ad code (unique or universal)
  - A/B testing options

### 4.2 Adsterra API Integration
- API key configuration
- Metrics fetching and display
- Ad code generation and validation

### 4.3 A/B Testing System
- Create multiple variants for each placement
- Configure rotation rules (equal, weighted)
- Track performance metrics for each variant
- Automatic winner selection based on configurable goals

### 4.4 Preview System
- Generate preview of pages with ad placements
- Toggle between different device views (desktop, tablet, mobile)
- Visual indication of ad placements and sizes

### 4.5 Scheduling System
- Calendar interface for scheduling campaigns
- Start/end date configuration
- Time-of-day targeting options

## 5. Database Schema

The database will include tables for:
- AD_PLACEMENTS: Stores position, size, and targeting information
- AD_CAMPAIGNS: Manages scheduling and activation status
- AD_VARIANTS: Handles A/B testing configurations
- AD_METRICS: Tracks performance data
- AD_SETTINGS: Stores API keys and global settings

## 6. User Interface Sections

### 6.1 Settings Panel
- Adsterra API key configuration
- Universal code toggle and input
- Global settings for ad behavior

### 6.2 Visual Editor
- Page representation with drag-and-drop interface
- Device view selector (desktop, tablet, mobile)
- Ad placement configuration panel

### 6.3 Campaign Manager
- List of active and scheduled campaigns
- Calendar view for scheduling
- A/B testing configuration

### 6.4 Performance Dashboard
- Metrics overview (impressions, clicks, revenue)
- Performance comparison for A/B tests
- Historical data charts

## 7. Implementation Timeline

1. **Phase 1: Backend Foundation** (3-4 days)
   - Database migrations and models
   - Controller and route setup
   - Basic view structure

2. **Phase 2: Core UI Components** (4-5 days)
   - Navigation integration
   - Settings panel
   - Basic placement management

3. **Phase 3: Advanced Features** (5-7 days)
   - Visual drag-and-drop editor
   - A/B testing system
   - Preview functionality

4. **Phase 4: API Integration** (3-4 days)
   - Adsterra API service
   - Metrics dashboard
   - Performance tracking

5. **Phase 5: Testing and Refinement** (2-3 days)
   - Cross-browser testing
   - Mobile responsiveness
   - Performance optimization
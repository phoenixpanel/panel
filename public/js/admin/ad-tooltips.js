/**
 * PhoenixPanel Ad Manager Tooltips
 * 
 * This file handles the information tooltips for the Ad Manager settings.
 * It provides detailed explanations for each setting to help administrators
 * understand how to configure the Ad Manager.
 */

class AdManagerTooltips {
    constructor() {
        this.tooltipContainer = null;
        this.activeTooltip = null;
    }

    /**
     * Initialize the tooltips
     */
    init() {
        // Create tooltip container if it doesn't exist
        if (!document.getElementById('ad-tooltips-container')) {
            this.tooltipContainer = document.createElement('div');
            this.tooltipContainer.id = 'ad-tooltips-container';
            document.body.appendChild(this.tooltipContainer);
        } else {
            this.tooltipContainer = document.getElementById('ad-tooltips-container');
        }

        // Add tooltip styles
        this.addStyles();

        // Initialize tooltips
        this.setupTooltips();

        // Add click event listener to close tooltips when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activeTooltip && !e.target.classList.contains('info-icon') && 
                !this.activeTooltip.contains(e.target) && e.target !== this.activeTooltip) {
                this.hideAllTooltips();
            }
        });
    }

    /**
     * Add required CSS styles
     */
    addStyles() {
        if (document.getElementById('ad-tooltips-styles')) return;

        const styleElement = document.createElement('style');
        styleElement.id = 'ad-tooltips-styles';
        styleElement.textContent = `
            .info-icon {
                display: inline-block;
                width: 16px;
                height: 16px;
                background-color: #3498db;
                color: white;
                border-radius: 50%;
                text-align: center;
                line-height: 16px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                margin-left: 5px;
                vertical-align: middle;
                transition: background-color 0.2s;
            }
            
            .info-icon:hover {
                background-color: #2980b9;
            }
            
            .ad-tooltip {
                position: absolute;
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                max-width: 350px;
                z-index: 1050;
                display: none;
            }
            
            .ad-tooltip.active {
                display: block;
            }
            
            .ad-tooltip-header {
                margin: -15px -15px 10px -15px;
                padding: 10px 15px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ddd;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                font-weight: bold;
            }
            
            .ad-tooltip-content {
                font-size: 13px;
                line-height: 1.5;
            }
            
            .ad-tooltip-content p {
                margin-bottom: 10px;
            }
            
            .ad-tooltip-content ul, .ad-tooltip-content ol {
                margin-bottom: 10px;
                padding-left: 20px;
            }
            
            .ad-tooltip-content a {
                color: #3498db;
                text-decoration: none;
            }
            
            .ad-tooltip-content a:hover {
                text-decoration: underline;
            }
            
            .ad-tooltip-footer {
                margin: 10px -15px -15px -15px;
                padding: 10px 15px;
                background-color: #f5f5f5;
                border-top: 1px solid #ddd;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                font-size: 12px;
                text-align: right;
            }
            
            .ad-tooltip-close {
                background-color: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 3px;
                padding: 3px 8px;
                font-size: 12px;
                cursor: pointer;
            }
            
            .ad-tooltip-close:hover {
                background-color: #e5e5e5;
            }
            
            .ad-tooltip-arrow {
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
            }
            
            .ad-tooltip-arrow-top {
                bottom: 100%;
                left: 50%;
                margin-left: -8px;
                border-width: 0 8px 8px 8px;
                border-color: transparent transparent #f5f5f5 transparent;
            }
            
            .ad-tooltip-arrow-bottom {
                top: 100%;
                left: 50%;
                margin-left: -8px;
                border-width: 8px 8px 0 8px;
                border-color: #f5f5f5 transparent transparent transparent;
            }
            
            .ad-tooltip-arrow-left {
                right: 100%;
                top: 50%;
                margin-top: -8px;
                border-width: 8px 8px 8px 0;
                border-color: transparent #f5f5f5 transparent transparent;
            }
            
            .ad-tooltip-arrow-right {
                left: 100%;
                top: 50%;
                margin-top: -8px;
                border-width: 8px 0 8px 8px;
                border-color: transparent transparent transparent #f5f5f5;
            }
        `;
        document.head.appendChild(styleElement);
    }

    /**
     * Set up tooltips for all info icons
     */
    setupTooltips() {
        const infoIcons = document.querySelectorAll('.info-icon');
        infoIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const tooltipId = icon.getAttribute('data-tooltip-id');
                this.toggleTooltip(tooltipId, icon);
            });
        });
    }

    /**
     * Toggle a tooltip's visibility
     * @param {string} tooltipId - The ID of the tooltip to toggle
     * @param {HTMLElement} icon - The icon element that triggered the tooltip
     */
    toggleTooltip(tooltipId, icon) {
        // Hide all tooltips first
        this.hideAllTooltips();

        // Get or create the tooltip
        let tooltip = document.getElementById(tooltipId);
        if (!tooltip) {
            tooltip = this.createTooltip(tooltipId, icon);
        }

        // Position the tooltip
        this.positionTooltip(tooltip, icon);

        // Show the tooltip
        tooltip.classList.add('active');
        this.activeTooltip = tooltip;
    }

    /**
     * Create a tooltip element
     * @param {string} tooltipId - The ID for the tooltip
     * @param {HTMLElement} icon - The icon element that triggered the tooltip
     * @returns {HTMLElement} The created tooltip element
     */
    createTooltip(tooltipId, icon) {
        const tooltipContent = this.getTooltipContent(tooltipId);
        if (!tooltipContent) return null;

        const tooltip = document.createElement('div');
        tooltip.id = tooltipId;
        tooltip.className = 'ad-tooltip';
        tooltip.innerHTML = `
            <div class="ad-tooltip-header">${tooltipContent.title}</div>
            <div class="ad-tooltip-content">${tooltipContent.content}</div>
            <div class="ad-tooltip-footer">
                <button class="ad-tooltip-close">Close</button>
            </div>
            <div class="ad-tooltip-arrow"></div>
        `;

        // Add close button event
        tooltip.querySelector('.ad-tooltip-close').addEventListener('click', () => {
            this.hideAllTooltips();
        });

        this.tooltipContainer.appendChild(tooltip);
        return tooltip;
    }

    /**
     * Position a tooltip relative to its trigger icon
     * @param {HTMLElement} tooltip - The tooltip element
     * @param {HTMLElement} icon - The icon element that triggered the tooltip
     */
    positionTooltip(tooltip, icon) {
        const iconRect = icon.getBoundingClientRect();
        const tooltipWidth = 350; // Max width from CSS
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Default position (right of icon)
        let top = iconRect.top + window.scrollY;
        let left = iconRect.right + window.scrollX + 10;
        let arrowClass = 'ad-tooltip-arrow-left';
        
        // Check if tooltip would go off the right edge
        if (left + tooltipWidth > windowWidth) {
            // Position to the left of the icon
            left = iconRect.left + window.scrollX - tooltipWidth - 10;
            arrowClass = 'ad-tooltip-arrow-right';
            
            // If that would go off the left edge, position below
            if (left < 0) {
                left = Math.max(10, iconRect.left + window.scrollX - tooltipWidth/2 + iconRect.width/2);
                top = iconRect.bottom + window.scrollY + 10;
                arrowClass = 'ad-tooltip-arrow-top';
            }
        }
        
        // Make sure tooltip doesn't go off the bottom
        const estimatedHeight = 300; // Approximate height
        if (top + estimatedHeight > windowHeight + window.scrollY) {
            top = Math.max(10 + window.scrollY, iconRect.top + window.scrollY - estimatedHeight - 10);
            arrowClass = 'ad-tooltip-arrow-bottom';
        }
        
        // Apply position
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        
        // Update arrow
        const arrow = tooltip.querySelector('.ad-tooltip-arrow');
        arrow.className = 'ad-tooltip-arrow ' + arrowClass;
    }

    /**
     * Hide all tooltips
     */
    hideAllTooltips() {
        const tooltips = document.querySelectorAll('.ad-tooltip');
        tooltips.forEach(tooltip => {
            tooltip.classList.remove('active');
        });
        this.activeTooltip = null;
    }

    /**
     * Get content for a specific tooltip
     * @param {string} tooltipId - The ID of the tooltip
     * @returns {Object|null} Object with title and content, or null if not found
     */
    getTooltipContent(tooltipId) {
        const tooltipContents = {
            'api-key-tooltip': {
                title: 'Adsterra API Key',
                content: `
                    <p>The API key is required to connect to the Adsterra advertising platform and access their services programmatically.</p>
                    
                    <h4>How to obtain an API key:</h4>
                    <ol>
                        <li>Log in to your <a href="https://publishers.adsterra.com/login" target="_blank">Adsterra Publisher Account</a></li>
                        <li>Navigate to the "API" section in your dashboard</li>
                        <li>Click on "Generate API Key" if you don't already have one</li>
                        <li>Copy the generated key and paste it here</li>
                    </ol>
                    
                    <h4>Important notes:</h4>
                    <ul>
                        <li>Keep your API key secure and don't share it with others</li>
                        <li>Adsterra limits API requests to 100 per hour</li>
                        <li>The API key is used to fetch performance metrics and manage your ad placements</li>
                    </ul>
                    
                    <p>For more information, visit the <a href="https://publishers.adsterra.com/api-documentation" target="_blank">Adsterra API Documentation</a>.</p>
                `
            },
            'universal-code-tooltip': {
                title: 'Universal Ad Code',
                content: `
                    <p>Universal Ad Code allows you to apply a single ad implementation across your entire panel without configuring individual placements.</p>
                    
                    <h4>When to use Universal Ad Code:</h4>
                    <ul>
                        <li>When you want a simple, consistent ad implementation</li>
                        <li>When you're using Adsterra's auto-placement feature</li>
                        <li>When you don't need granular control over individual ad placements</li>
                    </ul>
                    
                    <h4>How it works:</h4>
                    <p>When enabled, the Universal Ad Code will be inserted into all pages of your panel. This code typically contains Adsterra's auto-placement script that automatically determines the best positions for ads.</p>
                    
                    <h4>Universal Code vs. Placement-specific Code:</h4>
                    <ul>
                        <li><strong>Universal Code:</strong> Simpler to implement, less control, may affect page performance</li>
                        <li><strong>Placement-specific Code:</strong> More control over ad positions, better for optimizing user experience, requires more configuration</li>
                    </ul>
                    
                    <p>Note: When Universal Ad Code is enabled, it takes precedence over individual ad placements.</p>
                `
            },
            'ad-placements-tooltip': {
                title: 'Ad Placements',
                content: `
                    <p>Ad Placements define specific locations on your site where advertisements will appear.</p>
                    
                    <h4>Key placement properties:</h4>
                    <ul>
                        <li><strong>Name:</strong> A descriptive identifier for the placement</li>
                        <li><strong>Page URL:</strong> The specific page where the ad will appear</li>
                        <li><strong>Position:</strong> X and Y coordinates on the page</li>
                        <li><strong>Size:</strong> Width and height in pixels</li>
                        <li><strong>Device Targeting:</strong> Which devices should display this ad</li>
                    </ul>
                    
                    <h4>Best practices:</h4>
                    <ul>
                        <li>Place ads where they'll be visible but not intrusive</li>
                        <li>Consider user experience when positioning ads</li>
                        <li>Use appropriate sizes for different page locations</li>
                        <li>Test different placements to optimize performance</li>
                    </ul>
                    
                    <p>You can create and manage placements using the visual editor or by manually configuring them.</p>
                `
            },
            'visual-editor-tooltip': {
                title: 'Visual Ad Placement Editor',
                content: `
                    <p>The Visual Editor provides an intuitive drag-and-drop interface for positioning ad placements on your site.</p>
                    
                    <h4>How to use:</h4>
                    <ol>
                        <li>Click "Toggle Visual Editor" to show the editor</li>
                        <li>Drag ad templates from the toolbox onto the page preview</li>
                        <li>Resize and position the placements as needed</li>
                        <li>Configure additional settings in the right panel</li>
                    </ol>
                    
                    <h4>Features:</h4>
                    <ul>
                        <li>Device view switching (Desktop, Tablet, Mobile)</li>
                        <li>Grid snapping for precise positioning</li>
                        <li>Real-time configuration updates</li>
                        <li>Preview functionality to see how ads will appear</li>
                    </ul>
                    
                    <p>The visual editor makes it easy to create a responsive ad layout that works well across all devices.</p>
                `
            },
            'metrics-tooltip': {
                title: 'Performance Metrics',
                content: `
                    <p>The Performance Metrics section provides insights into how your ads are performing.</p>
                    
                    <h4>Key metrics explained:</h4>
                    <ul>
                        <li><strong>Impressions:</strong> The number of times ads were displayed</li>
                        <li><strong>Clicks:</strong> The number of times users clicked on ads</li>
                        <li><strong>CTR (Click-Through Rate):</strong> The percentage of impressions that resulted in clicks</li>
                        <li><strong>Revenue:</strong> The total earnings from your ads</li>
                        <li><strong>eCPM:</strong> Effective Cost Per Mille (earnings per 1,000 impressions)</li>
                    </ul>
                    
                    <h4>Using the metrics dashboard:</h4>
                    <ul>
                        <li>Select different date ranges to analyze performance over time</li>
                        <li>Filter by specific placements to compare their effectiveness</li>
                        <li>Use the charts to identify trends and patterns</li>
                        <li>Review the detailed table for day-by-day performance</li>
                    </ul>
                    
                    <p>Note: A valid Adsterra API key is required to fetch real metrics data.</p>
                `
            },
            'calendar-tooltip': {
                title: 'Campaign Calendar',
                content: `
                    <p>The Campaign Calendar provides a visual overview of your scheduled ad campaigns.</p>
                    
                    <h4>Calendar features:</h4>
                    <ul>
                        <li>View all campaigns in a monthly, weekly, or daily format</li>
                        <li>Color-coded status indicators (active, scheduled, inactive, expired)</li>
                        <li>Click on events to edit campaign schedules</li>
                        <li>Drag and drop to reschedule campaigns</li>
                    </ul>
                    
                    <h4>Managing campaigns:</h4>
                    <ul>
                        <li>Plan campaigns in advance for special events or promotions</li>
                        <li>Coordinate multiple campaigns to avoid conflicts</li>
                        <li>Monitor active and upcoming campaigns at a glance</li>
                        <li>Quickly identify gaps in your ad schedule</li>
                    </ul>
                    
                    <p>The calendar helps you maintain an organized advertising strategy and ensures your ads run at optimal times.</p>
                `
            },
            'campaigns-tooltip': {
                title: 'Ad Campaigns',
                content: `
                    <p>Ad Campaigns allow you to group and schedule multiple ad placements for specific time periods.</p>
                    
                    <h4>Campaign properties:</h4>
                    <ul>
                        <li><strong>Name:</strong> A descriptive identifier for the campaign</li>
                        <li><strong>Start/End Dates:</strong> When the campaign will run</li>
                        <li><strong>Recurring:</strong> Whether the campaign repeats (daily, weekly, monthly)</li>
                        <li><strong>Time of Day:</strong> Specific hours when ads should display</li>
                        <li><strong>Targeting Rules:</strong> Additional criteria for when to show ads</li>
                    </ul>
                    
                    <h4>Campaign strategies:</h4>
                    <ul>
                        <li>Create seasonal campaigns for holidays or special events</li>
                        <li>Schedule different ad types based on time of day</li>
                        <li>Run promotional campaigns alongside regular ads</li>
                        <li>Test different campaign durations to optimize performance</li>
                    </ul>
                    
                    <p>Effective campaign management can significantly improve your ad revenue by showing the right ads at the right times.</p>
                `
            },
            'placement-name-tooltip': {
                title: 'Placement Name',
                content: `
                    <p>The name you assign to identify this specific ad placement.</p>
                    
                    <h4>Tips for naming placements:</h4>
                    <ul>
                        <li>Use descriptive names that indicate location (e.g., "Homepage Header Banner")</li>
                        <li>Include size information if relevant (e.g., "Sidebar 300x250")</li>
                        <li>Use consistent naming conventions for easier management</li>
                        <li>Consider including the ad type in the name (e.g., "Dashboard Leaderboard")</li>
                    </ul>
                    
                    <p>Good naming helps you quickly identify placements in reports and when managing multiple ads.</p>
                `
            },
            'page-url-tooltip': {
                title: 'Page URL',
                content: `
                    <p>The specific page or URL pattern where this ad placement will appear.</p>
                    
                    <h4>URL format options:</h4>
                    <ul>
                        <li><strong>Exact URL:</strong> e.g., "/dashboard" (matches only the dashboard page)</li>
                        <li><strong>Path prefix:</strong> e.g., "/server/" (matches all pages in the server section)</li>
                        <li><strong>Multiple URLs:</strong> Separate with commas for multiple specific pages</li>
                    </ul>
                    
                    <h4>Best practices:</h4>
                    <ul>
                        <li>Be specific to ensure ads appear only where intended</li>
                        <li>Consider user experience on different page types</li>
                        <li>Test ads on all specified pages to verify proper display</li>
                    </ul>
                    
                    <p>Targeting specific pages allows you to customize ad placements based on content and user intent.</p>
                `
            },
            'position-tooltip': {
                title: 'Position Coordinates',
                content: `
                    <p>The X and Y coordinates determine where the ad will be positioned on the page.</p>
                    
                    <h4>Understanding coordinates:</h4>
                    <ul>
                        <li><strong>X Position:</strong> Horizontal distance from the left edge of the container (in pixels)</li>
                        <li><strong>Y Position:</strong> Vertical distance from the top edge of the container (in pixels)</li>
                    </ul>
                    
                    <h4>Setting positions:</h4>
                    <ul>
                        <li>Use the visual editor for intuitive drag-and-drop positioning</li>
                        <li>Fine-tune coordinates manually for precise placement</li>
                        <li>Consider how position affects user experience and visibility</li>
                        <li>Test positions across different screen sizes</li>
                    </ul>
                    
                    <p>The grid in the visual editor helps with alignment and ensures consistent spacing.</p>
                `
            },
            'size-tooltip': {
                title: 'Ad Size',
                content: `
                    <p>The width and height dimensions of the ad placement in pixels.</p>
                    
                    <h4>Standard ad sizes:</h4>
                    <ul>
                        <li><strong>Banner (728×90):</strong> Horizontal banner, typically at the top of a page</li>
                        <li><strong>Leaderboard (970×90):</strong> Wide banner for desktop sites</li>
                        <li><strong>Medium Rectangle (300×250):</strong> Versatile format for in-content or sidebar</li>
                        <li><strong>Large Rectangle (336×280):</strong> Larger version with higher visibility</li>
                        <li><strong>Half Page (300×600):</strong> Tall format for sidebar placement</li>
                        <li><strong>Mobile Banner (320×50):</strong> Compact banner for mobile devices</li>
                    </ul>
                    
                    <h4>Size considerations:</h4>
                    <ul>
                        <li>Use standard sizes for better fill rates and higher revenue</li>
                        <li>Ensure sizes are appropriate for their placement location</li>
                        <li>Consider responsive sizing for different devices</li>
                    </ul>
                    
                    <p>For more information on standard ad sizes, visit the <a href="https://support.google.com/admanager/answer/1100453" target="_blank">IAB Ad Size Guidelines</a>.</p>
                `
            },
            'device-targeting-tooltip': {
                title: 'Device Targeting',
                content: `
                    <p>Device targeting allows you to specify which types of devices should display this ad placement.</p>
                    
                    <h4>Device options:</h4>
                    <ul>
                        <li><strong>All Devices:</strong> Ad will appear on desktop, tablet, and mobile</li>
                        <li><strong>Desktop Only:</strong> Ad will only appear on desktop computers</li>
                        <li><strong>Mobile Only:</strong> Ad will only appear on mobile phones</li>
                        <li><strong>Tablet Only:</strong> Ad will only appear on tablet devices</li>
                        <li><strong>Desktop and Tablet:</strong> Ad will appear on larger screens but not phones</li>
                        <li><strong>Mobile and Tablet:</strong> Ad will appear on smaller screens but not desktops</li>
                    </ul>
                    
                    <h4>Best practices:</h4>
                    <ul>
                        <li>Create device-specific ad placements for optimal user experience</li>
                        <li>Use appropriate ad sizes for each device type</li>
                        <li>Consider user behavior differences across devices</li>
                        <li>Test your ads on all targeted device types</li>
                    </ul>
                    
                    <p>Device targeting helps ensure your ads look good and perform well across all screen sizes.</p>
                `
            },
            'date-range-tooltip': {
                title: 'Date Range Selection',
                content: `
                    <p>The date range selector allows you to choose the time period for viewing performance metrics.</p>
                    
                    <h4>Available ranges:</h4>
                    <ul>
                        <li><strong>Today:</strong> Data for the current day</li>
                        <li><strong>Yesterday:</strong> Data for the previous day</li>
                        <li><strong>Last 7 Days:</strong> Data for the past week</li>
                        <li><strong>Last 30 Days:</strong> Data for the past month</li>
                        <li><strong>This Month:</strong> Data for the current calendar month</li>
                        <li><strong>Last Month:</strong> Data for the previous calendar month</li>
                        <li><strong>Custom Range:</strong> Select specific start and end dates</li>
                    </ul>
                    
                    <h4>Analysis tips:</h4>
                    <ul>
                        <li>Compare different time periods to identify trends</li>
                        <li>Look at longer periods (30+ days) for reliable performance patterns</li>
                        <li>Check recent data (last 7 days) to monitor current performance</li>
                        <li>Use custom ranges to analyze specific campaigns or events</li>
                    </ul>
                    
                    <p>Regular analysis of performance data helps optimize your ad strategy and maximize revenue.</p>
                `
            },
            'variant-tooltip': {
                title: 'Ad Variants',
                content: `
                    <p>Ad variants allow you to test different ad implementations for the same placement to determine which performs best.</p>
                    
                    <h4>A/B testing with variants:</h4>
                    <ul>
                        <li>Create multiple variants with different ad codes</li>
                        <li>Designate one variant as the "control" (baseline for comparison)</li>
                        <li>Set weight percentages to determine traffic distribution</li>
                        <li>Compare performance metrics to identify the best performer</li>
                        <li>Select a winner once sufficient data is collected</li>
                    </ul>
                    
                    <h4>Best practices:</h4>
                    <ul>
                        <li>Test only one variable at a time for clear results</li>
                        <li>Run tests for at least a week to account for daily variations</li>
                        <li>Ensure each variant receives at least 1,000 impressions</li>
                        <li>Consider both CTR and revenue when evaluating performance</li>
                    </ul>
                    
                    <p>A/B testing with variants is one of the most effective ways to optimize ad performance and increase revenue.</p>
                `
            },
            'schedule-tooltip': {
                title: 'Ad Scheduling',
                content: `
                    <p>Scheduling allows you to control when your ad placements are active and visible to users.</p>
                    
                    <h4>Scheduling options:</h4>
                    <ul>
                        <li><strong>Start/End Dates:</strong> The date range when the ad will run</li>
                        <li><strong>Start/End Times:</strong> Specific times of day for the ad to display</li>
                        <li><strong>Recurring Schedule:</strong> Specific days of the week (e.g., weekdays only)</li>
                        <li><strong>Time of Day Targeting:</strong> Specific hours (e.g., business hours only)</li>
                    </ul>
                    
                    <h4>Strategic scheduling:</h4>
                    <ul>
                        <li>Schedule ads during peak traffic hours for maximum impressions</li>
                        <li>Run different ad types based on time of day or day of week</li>
                        <li>Schedule special promotions around events or holidays</li>
                        <li>Use the calendar view to visualize your complete ad schedule</li>
                    </ul>
                    
                    <p>Effective scheduling ensures your ads run at optimal times and helps coordinate multiple campaigns.</p>
                `
            }
        };

        return tooltipContents[tooltipId] || null;
    }
}

// Initialize tooltips when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const adTooltips = new AdManagerTooltips();
    adTooltips.init();
});
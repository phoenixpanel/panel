/**
 * PhoenixPanel Ad Manager
 * 
 * This file handles the visual editor with drag-and-drop functionality
 * for the Ad Manager, allowing administrators to visually position
 * ad banners on site pages.
 */

// Initialize when document is ready - but only if container is visible
document.addEventListener('DOMContentLoaded', function() {
    console.log('AdManager: DOM loaded, checking for container...');
    
    // Check if the ad manager container exists
    const adManagerContainer = document.getElementById('ad-manager-container');
    if (!adManagerContainer) {
        console.log('AdManager: Container not found on DOM load');
        return;
    }

    // Only initialize if container is visible (not hidden by default)
    if (adManagerContainer.style.display !== 'none' &&
        window.getComputedStyle(adManagerContainer).display !== 'none') {
        console.log('AdManager: Container is visible, initializing...');
        // Initialize the Ad Manager
        const adManager = new AdManager(adManagerContainer);
        adManager.init();
        // Store globally for access from other scripts
        window.adManager = adManager;
    } else {
        console.log('AdManager: Container is hidden, skipping initialization');
    }
});

/**
 * Ad Manager Class
 * Handles the visual editor and drag-and-drop functionality
 */
class AdManager {
    /**
     * Constructor
     * @param {HTMLElement} container - The container element for the ad manager
     */
    constructor(container) {
        this.container = container;
        this.pagePreview = null;
        this.toolbox = null;
        this.configPanel = null;
        this.adPlacements = [];
        this.selectedPlacement = null;
        this.gridSize = 10; // Grid size in pixels for snapping
        this.currentView = 'desktop'; // Current device view (desktop, tablet, mobile)
        
        // Device view dimensions
        this.viewDimensions = {
            desktop: { width: 1200, height: 800 },
            tablet: { width: 768, height: 1024 },
            mobile: { width: 375, height: 667 }
        };
        
        // Preview mode flag
        this.previewMode = false;
        
        // A/B testing related properties
        this.showingVariant = null; // Currently showing variant in preview
        this.variantPreviewMode = false; // Whether we're in variant preview mode
    }

    /**
     * Initialize the Ad Manager
     */
    init() {
        console.log('AdManager: Starting initialization...');
        try {
            this.createLayout();
            this.setupToolbox();
            this.setupPagePreview();
            this.setupConfigPanel();
            this.setupDeviceViewSelector();
            this.setupEventListeners();
            this.loadExistingPlacements();
            this.setupPreviewButton();
            this.setupTooltips();
            
            // Initialize drag and drop after a short delay to ensure DOM is ready
            setTimeout(() => {
                this.initDragAndDrop();
                console.log('AdManager: Drag and drop initialized');
            }, 100);
            
            console.log('AdManager: Initialization completed successfully');
        } catch (error) {
            console.error('AdManager: Initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Set up help tooltips for complex features
     */
    setupTooltips() {
        // Create tooltip container if it doesn't exist
        if ($('#ad-manager-tooltips').length === 0) {
            $('body').append('<div id="ad-manager-tooltips" class="tooltip-container"></div>');
        }
        
        // Add tooltip styles
        const tooltipStyles = `
            .tooltip-container {
                position: absolute;
                background-color: #333;
                color: #fff;
                padding: 10px;
                border-radius: 4px;
                max-width: 300px;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                display: none;
                pointer-events: none;
            }
            
            .tooltip-container:after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #333 transparent transparent transparent;
            }
            
            .tooltip-trigger {
                cursor: help;
                margin-left: 5px;
                color: #007bff;
            }
        `;
        
        // Add styles to head if they don't exist
        if ($('#tooltip-styles').length === 0) {
            $('head').append(`<style id="tooltip-styles">${tooltipStyles}</style>`);
        }
    }

    /**
     * Create the basic layout for the ad manager
     */
    createLayout() {
        // Create the main layout container
        const layout = document.createElement('div');
        layout.className = 'ad-manager-layout';
        this.container.appendChild(layout);

        // Create the toolbox
        this.toolbox = document.createElement('div');
        this.toolbox.className = 'ad-manager-toolbox';
        this.toolbox.innerHTML = '<h4>Ad Placement Tools</h4>';
        layout.appendChild(this.toolbox);

        // Create the page preview
        const previewContainer = document.createElement('div');
        previewContainer.className = 'ad-manager-preview-container';
        layout.appendChild(previewContainer);

        // Device view selector
        const deviceSelector = document.createElement('div');
        deviceSelector.className = 'ad-manager-device-selector';
        deviceSelector.innerHTML = `
            <button type="button" class="btn btn-sm btn-default active" data-device="desktop">
                <i class="fa fa-desktop"></i> Desktop
            </button>
            <button type="button" class="btn btn-sm btn-default" data-device="tablet">
                <i class="fa fa-tablet"></i> Tablet
            </button>
            <button type="button" class="btn btn-sm btn-default" data-device="mobile">
                <i class="fa fa-mobile"></i> Mobile
            </button>
        `;
        previewContainer.appendChild(deviceSelector);

        // Page preview
        this.pagePreview = document.createElement('div');
        this.pagePreview.className = 'ad-manager-page-preview desktop-view';
        previewContainer.appendChild(this.pagePreview);

        // Create the configuration panel
        this.configPanel = document.createElement('div');
        this.configPanel.className = 'ad-manager-config-panel';
        this.configPanel.innerHTML = '<h4>Ad Configuration</h4><p>Select an ad placement to configure it.</p>';
        layout.appendChild(this.configPanel);

        // Add CSS styles
        this.addStyles();
    }

    /**
     * Add required CSS styles
     */
    addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .ad-manager-layout {
                display: flex;
                flex-wrap: wrap;
                margin: 0 -15px;
            }
            
            .ad-manager-toolbox {
                flex: 0 0 200px;
                padding: 15px;
                background-color: #f5f5f5;
                border-right: 1px solid #ddd;
                min-height: 600px;
            }
            
            .ad-manager-preview-container {
                flex: 1 1 auto;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .ad-manager-device-selector {
                margin-bottom: 15px;
                text-align: center;
            }
            
            .ad-manager-page-preview {
                position: relative;
                background-color: #fff;
                border: 1px solid #ddd;
                margin: 0 auto;
                overflow: hidden;
                transition: width 0.3s, height 0.3s;
            }
            
            .ad-manager-page-preview.desktop-view {
                width: 1200px;
                height: 800px;
                max-width: 100%;
                max-height: 80vh;
            }
            
            .ad-manager-page-preview.tablet-view {
                width: 768px;
                height: 1024px;
                max-width: 100%;
                max-height: 80vh;
            }
            
            .ad-manager-page-preview.mobile-view {
                width: 375px;
                height: 667px;
                max-width: 100%;
                max-height: 80vh;
            }
            
            .ad-manager-config-panel {
                flex: 0 0 300px;
                padding: 15px;
                background-color: #f5f5f5;
                border-left: 1px solid #ddd;
                min-height: 600px;
            }
            
            .ad-placement {
                position: absolute;
                background-color: rgba(0, 123, 255, 0.2);
                border: 2px solid #007bff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: move;
                z-index: 10;
                box-sizing: border-box;
            }
            
            .ad-placement.selected {
                border-color: #28a745;
                background-color: rgba(40, 167, 69, 0.2);
                z-index: 20;
            }
            
            .ad-placement-label {
                font-size: 12px;
                color: #333;
                text-align: center;
                pointer-events: none;
            }
            
            .ad-placement-template {
                margin: 10px 0;
                padding: 10px;
                background-color: #e9ecef;
                border: 1px solid #ced4da;
                border-radius: 4px;
                cursor: grab;
                text-align: center;
            }
            
            .ad-placement-template:hover {
                background-color: #dee2e6;
            }
            
            .ad-manager-grid {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
                background-size: 10px 10px;
                pointer-events: none;
            }
            
            .form-group-inline {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .form-group-inline .form-group {
                flex: 1;
            }
            
            /* Drag and drop visual feedback */
            .ad-placement-template:active {
                transform: scale(0.95);
                opacity: 0.8;
            }
            
            .ad-placement.dragging {
                opacity: 0.8;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            
            .ad-placement.resizing {
                box-shadow: 0 0 0 2px #007bff;
            }
            
            #dragging-template {
                pointer-events: none;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            
            /* Visual feedback for drop zones */
            .ad-manager-page-preview.drag-over {
                background-color: rgba(0, 123, 255, 0.1);
                border-color: #007bff;
            }
        `;
        document.head.appendChild(styleElement);
    }

    /**
     * Set up the toolbox with ad placement templates
     */
    setupToolbox() {
        // Common ad sizes
        const adSizes = [
            { name: 'Banner (728×90)', width: 728, height: 90, description: 'Standard banner ad, typically placed at the top of a page' },
            { name: 'Leaderboard (970×90)', width: 970, height: 90, description: 'Wide banner ad for desktop sites with more horizontal space' },
            { name: 'Medium Rectangle (300×250)', width: 300, height: 250, description: 'Versatile ad format that works well in-content or sidebar' },
            { name: 'Large Rectangle (336×280)', width: 336, height: 280, description: 'Larger version of the medium rectangle for higher visibility' },
            { name: 'Half Page (300×600)', width: 300, height: 600, description: 'Tall ad format with high visibility, good for sidebar placement' },
            { name: 'Mobile Banner (320×50)', width: 320, height: 50, description: 'Compact banner designed specifically for mobile devices' }
        ];

        // Create a template for each ad size
        adSizes.forEach(size => {
            const template = document.createElement('div');
            template.className = 'ad-placement-template';
            template.setAttribute('data-width', size.width);
            template.setAttribute('data-height', size.height);
            template.setAttribute('data-toggle', 'tooltip');
            template.setAttribute('title', size.description);
            template.innerHTML = `
                <div class="ad-placement-label">${size.name}</div>
                <div class="ad-placement-dimensions">${size.width}×${size.height}</div>
            `;
            this.toolbox.appendChild(template);
            
            // Initialize tooltip
            $(template).tooltip({
                container: '#ad-manager-tooltips',
                placement: 'right'
            });
        });

        // Add instructions
        const instructions = document.createElement('div');
        instructions.className = 'toolbox-instructions';
        instructions.innerHTML = `
            <p class="text-muted">
                Drag and drop ad templates onto the page preview.
                <i class="fa fa-question-circle tooltip-trigger"
                   data-toggle="tooltip"
                   title="Click and hold an ad template, then drag it to the desired position on the page preview. Release to place it."></i>
            </p>
        `;
        this.toolbox.appendChild(instructions);
        
        // Initialize tooltip
        $('.tooltip-trigger', instructions).tooltip({
            container: '#ad-manager-tooltips',
            placement: 'bottom'
        });
    }

    /**
     * Set up the page preview area
     */
    setupPagePreview() {
        // Add a grid to help with alignment
        const grid = document.createElement('div');
        grid.className = 'ad-manager-grid';
        this.pagePreview.appendChild(grid);

        // Add a mock page layout for visualization
        const mockLayout = document.createElement('div');
        mockLayout.className = 'mock-page-layout';
        mockLayout.innerHTML = `
            <div style="height: 60px; background-color: #343a40; margin-bottom: 20px;"></div>
            <div style="display: flex; gap: 20px;">
                <div style="flex: 0 0 200px; height: 600px; background-color: #f8f9fa;"></div>
                <div style="flex: 1; height: 1200px; background-color: #f8f9fa;"></div>
                <div style="flex: 0 0 250px; height: 400px; background-color: #f8f9fa;"></div>
            </div>
            <div style="height: 100px; background-color: #343a40; margin-top: 20px;"></div>
        `;
        this.pagePreview.appendChild(mockLayout);
    }

    /**
     * Set up the configuration panel
     */
    setupConfigPanel() {
        // This will be populated when an ad placement is selected
    }

    /**
     * Set up the device view selector
     */
    setupDeviceViewSelector() {
        const buttons = this.container.querySelectorAll('.ad-manager-device-selector button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update current view
                this.currentView = button.getAttribute('data-device');
                
                // Update preview class
                this.pagePreview.className = `ad-manager-page-preview ${this.currentView}-view`;
                
                // Update ad placements visibility based on device targeting
                this.updatePlacementsVisibility();
            });
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for clicks on the page preview to deselect placements
        this.pagePreview.addEventListener('click', (e) => {
            if (e.target === this.pagePreview || e.target.classList.contains('ad-manager-grid') || e.target.classList.contains('mock-page-layout')) {
                this.deselectAllPlacements();
            }
        });
    }

    /**
     * Initialize drag and drop functionality
     */
    initDragAndDrop() {
        const self = this;
        
        console.log('AdManager: Initializing drag and drop functionality...');
        
        // DIAGNOSTIC: Check interact.js availability
        console.log('AdManager: interact.js type:', typeof interact);
        console.log('AdManager: interact.js version:', interact ? interact.version : 'N/A');
        
        // DIAGNOSTIC: Check DOM elements
        const templates = document.querySelectorAll('.ad-placement-template');
        const placements = document.querySelectorAll('.ad-placement');
        console.log('AdManager: Found', templates.length, 'ad placement templates');
        console.log('AdManager: Found', placements.length, 'existing ad placements');
        console.log('AdManager: Toolbox element:', this.toolbox);
        console.log('AdManager: Page preview element:', this.pagePreview);
        
        // Clear any existing interact.js instances to prevent conflicts
        interact('.ad-placement-template').unset();
        interact('.ad-placement').unset();
        
        // Verify interact.js is loaded
        if (typeof interact === 'undefined') {
            console.error('AdManager: interact.js is not loaded - drag and drop will not work');
            console.error('AdManager: Please check if interact.js CDN is accessible');
            return;
        }
        
        console.log('AdManager: interact.js is available, proceeding with setup...');

        // Make toolbox items draggable
        console.log('AdManager: Setting up draggable for .ad-placement-template elements');
        const dragSetup = interact('.ad-placement-template').draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,
            onstart: function(event) {
                console.log('AdManager: Drag started for template');
                console.log('AdManager: Drag target:', event.target);
                console.log('AdManager: Target classes:', event.target.className);
                console.log('AdManager: Target data attributes:', {
                    width: event.target.getAttribute('data-width'),
                    height: event.target.getAttribute('data-height')
                });
                
                const target = event.target;
                
                // Get the original template's position
                const targetRect = target.getBoundingClientRect();
                
                // Create a clone of the template for dragging
                const clone = target.cloneNode(true);
                clone.id = 'dragging-template';
                clone.style.position = 'absolute';
                clone.style.zIndex = 1000;
                clone.style.width = target.offsetWidth + 'px';
                clone.style.height = target.offsetHeight + 'px';
                clone.style.opacity = '0.8';
                clone.style.pointerEvents = 'none';
                
                // Set initial position to match the original template's screen coordinates
                clone.style.left = targetRect.left + 'px';
                clone.style.top = targetRect.top + 'px';
                
                // Initialize data attributes for transform tracking
                clone.setAttribute('data-x', 0);
                clone.setAttribute('data-y', 0);
                
                // Store the initial mouse position relative to the clone
                const mouseX = event.clientX || event.pageX;
                const mouseY = event.clientY || event.pageY;
                clone.setAttribute('data-offset-x', mouseX - targetRect.left);
                clone.setAttribute('data-offset-y', mouseY - targetRect.top);
                
                document.body.appendChild(clone);
                
                console.log('AdManager: Clone created and positioned at:', {
                    left: targetRect.left,
                    top: targetRect.top,
                    width: target.offsetWidth,
                    height: target.offsetHeight,
                    mouseOffset: {
                        x: mouseX - targetRect.left,
                        y: mouseY - targetRect.top
                    }
                });
                
                // Store the clone as the drag element
                event.interaction.customElement = clone;
            },
            onmove: function(event) {
                const clone = event.interaction.customElement;
                
                // Get the current mouse position
                const mouseX = event.clientX || event.pageX;
                const mouseY = event.clientY || event.pageY;
                
                // Get the stored mouse offset from the clone's top-left corner
                const offsetX = parseFloat(clone.getAttribute('data-offset-x')) || 0;
                const offsetY = parseFloat(clone.getAttribute('data-offset-y')) || 0;
                
                // Position the clone so the mouse cursor is at the same relative position
                // as when the drag started
                clone.style.left = (mouseX - offsetX) + 'px';
                clone.style.top = (mouseY - offsetY) + 'px';
                
                // Clear any transform to avoid double positioning
                clone.style.transform = '';
                
                console.log('AdManager: Clone positioned at mouse:', {
                    mouseX,
                    mouseY,
                    cloneLeft: mouseX - offsetX,
                    cloneTop: mouseY - offsetY
                });
            },
            onend: function(event) {
                console.log('AdManager: Drag ended for template');
                const clone = event.interaction.customElement;
                
                try {
                    // Check if the drop was over the page preview
                    const previewRect = self.pagePreview.getBoundingClientRect();
                    const cloneRect = clone.getBoundingClientRect();
                    
                    console.log('AdManager: Drop detection analysis:');
                    console.log('  Preview rect:', {
                        left: previewRect.left,
                        top: previewRect.top,
                        right: previewRect.right,
                        bottom: previewRect.bottom,
                        width: previewRect.width,
                        height: previewRect.height
                    });
                    console.log('  Clone rect:', {
                        left: cloneRect.left,
                        top: cloneRect.top,
                        right: cloneRect.right,
                        bottom: cloneRect.bottom,
                        width: cloneRect.width,
                        height: cloneRect.height
                    });
                    console.log('  Clone transform data:', {
                        dataX: clone.getAttribute('data-x'),
                        dataY: clone.getAttribute('data-y'),
                        transform: clone.style.transform
                    });
                    
                    const isWithinBounds = (
                        cloneRect.left >= previewRect.left &&
                        cloneRect.right <= previewRect.right &&
                        cloneRect.top >= previewRect.top &&
                        cloneRect.bottom <= previewRect.bottom
                    );
                    
                    console.log('  Within bounds check:', {
                        leftOK: cloneRect.left >= previewRect.left,
                        rightOK: cloneRect.right <= previewRect.right,
                        topOK: cloneRect.top >= previewRect.top,
                        bottomOK: cloneRect.bottom <= previewRect.bottom,
                        overall: isWithinBounds
                    });
                    
                    if (isWithinBounds) {
                        // Calculate position relative to the page preview
                        let x = cloneRect.left - previewRect.left;
                        let y = cloneRect.top - previewRect.top;
                        
                        // Apply grid snapping to the drop position
                        const snappedX = Math.round(x / self.gridSize) * self.gridSize;
                        const snappedY = Math.round(y / self.gridSize) * self.gridSize;
                        
                        // Get the ad size from the template
                        const width = parseInt(event.target.getAttribute('data-width'));
                        const height = parseInt(event.target.getAttribute('data-height'));
                        
                        console.log('AdManager: Creating placement at:', {
                            originalX: x,
                            originalY: y,
                            snappedX,
                            snappedY,
                            width,
                            height
                        });
                        
                        // Create a new ad placement with snapped coordinates
                        self.createAdPlacement(snappedX, snappedY, width, height);
                    } else {
                        console.log('AdManager: Drop outside preview area, placement not created');
                    }
                } catch (error) {
                    console.error('AdManager: Error during drag end:', error);
                }
                
                // Remove the clone
                if (clone && clone.parentNode) {
                    document.body.removeChild(clone);
                }
            }
        });
        
        console.log('AdManager: Template draggable setup complete:', dragSetup);

        // Make existing ad placements draggable and resizable
        console.log('AdManager: Setting up draggable and resizable for .ad-placement elements');
        const placementSetup = interact('.ad-placement')
            .draggable({
                inertia: true,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    }),
                    interact.modifiers.snap({
                        targets: [
                            interact.snappers.grid({ x: this.gridSize, y: this.gridSize })
                        ],
                        range: 10,
                        relativePoints: [{ x: 0, y: 0 }]
                    })
                ],
                autoScroll: true,
                onmove: function(event) {
                    const target = event.target;
                    
                    // Update position
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    
                    // Snap to grid
                    const snappedX = Math.round(x / self.gridSize) * self.gridSize;
                    const snappedY = Math.round(y / self.gridSize) * self.gridSize;
                    
                    target.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
                    
                    target.setAttribute('data-x', snappedX);
                    target.setAttribute('data-y', snappedY);
                    
                    // Update form fields if this is the selected placement
                    if (target === self.selectedPlacement) {
                        self.updateConfigPanelPosition(snappedX, snappedY);
                    }
                },
                onend: function(event) {
                    const target = event.target;
                    const placementId = target.getAttribute('data-id');
                    const x = parseFloat(target.getAttribute('data-x')) || 0;
                    const y = parseFloat(target.getAttribute('data-y')) || 0;
                    
                    // Update the placement data
                    const placement = self.adPlacements.find(p => p.id === placementId);
                    if (placement) {
                        placement.x = x;
                        placement.y = y;
                    }
                }
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                modifiers: [
                    interact.modifiers.restrictSize({
                        min: { width: 50, height: 50 }
                    }),
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),
                    interact.modifiers.snap({
                        targets: [
                            interact.snappers.grid({ x: this.gridSize, y: this.gridSize })
                        ],
                        range: 10,
                        relativePoints: [{ x: 0, y: 0 }]
                    })
                ],
                inertia: true,
                onmove: function(event) {
                    const target = event.target;
                    
                    let x = parseFloat(target.getAttribute('data-x')) || 0;
                    let y = parseFloat(target.getAttribute('data-y')) || 0;
                    
                    // Update the element's width and height
                    const width = event.rect.width;
                    const height = event.rect.height;
                    
                    // Snap to grid
                    const snappedWidth = Math.round(width / self.gridSize) * self.gridSize;
                    const snappedHeight = Math.round(height / self.gridSize) * self.gridSize;
                    
                    target.style.width = snappedWidth + 'px';
                    target.style.height = snappedHeight + 'px';
                    
                    // Translate when resizing from top or left edges
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;
                    
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                    
                    // Update the label
                    const label = target.querySelector('.ad-placement-label');
                    if (label) {
                        label.textContent = `${snappedWidth}×${snappedHeight}`;
                    }
                    
                    // Update form fields if this is the selected placement
                    if (target === self.selectedPlacement) {
                        self.updateConfigPanelSize(snappedWidth, snappedHeight);
                    }
                },
                onend: function(event) {
                    const target = event.target;
                    const placementId = target.getAttribute('data-id');
                    const width = parseInt(target.style.width);
                    const height = parseInt(target.style.height);
                    
                    // Update the placement data
                    const placement = self.adPlacements.find(p => p.id === placementId);
                    if (placement) {
                        placement.width = width;
                        placement.height = height;
                    }
                }
            });
            
        console.log('AdManager: Placement draggable/resizable setup complete:', placementSetup);
        console.log('AdManager: Drag and drop initialization finished');
    }

    /**
     * Update form fields with placement data
     * This function can be called from outside the class to update form fields
     * @param {string} formSelector - The selector for the form
     * @param {Object} placementData - The placement data
     */
    updateFormFields(formSelector, placementData) {
        const form = document.querySelector(formSelector);
        if (!form) return;
        
        // Update form fields
        const nameField = form.querySelector('[name="placement_name"]');
        const xField = form.querySelector('[name="x_position"]');
        const yField = form.querySelector('[name="y_position"]');
        const widthField = form.querySelector('[name="width"]');
        const heightField = form.querySelector('[name="height"]');
        const deviceField = form.querySelector('[name="device_targeting"]');
        const activeField = form.querySelector('[name="is_active"]');
        
        if (nameField) nameField.value = placementData.name;
        if (xField) xField.value = placementData.x;
        if (yField) yField.value = placementData.y;
        if (widthField) widthField.value = placementData.width;
        if (heightField) heightField.value = placementData.height;
        
        // Update device targeting
        if (deviceField) {
            if (placementData.deviceTargeting.includes('desktop') &&
                placementData.deviceTargeting.includes('tablet') &&
                placementData.deviceTargeting.includes('mobile')) {
                deviceField.value = 'all';
            } else if (placementData.deviceTargeting.includes('desktop') &&
                       placementData.deviceTargeting.includes('tablet')) {
                deviceField.value = 'desktop,tablet';
            } else if (placementData.deviceTargeting.includes('mobile') &&
                       placementData.deviceTargeting.includes('tablet')) {
                deviceField.value = 'mobile,tablet';
            } else if (placementData.deviceTargeting.includes('desktop')) {
                deviceField.value = 'desktop';
            } else if (placementData.deviceTargeting.includes('tablet')) {
                deviceField.value = 'tablet';
            } else if (placementData.deviceTargeting.includes('mobile')) {
                deviceField.value = 'mobile';
            }
        }
        
        // Update active status
        if (activeField) {
            activeField.checked = placementData.isActive;
        }
    }

    /**
     * Load existing placements from the server
     */
    loadExistingPlacements() {
        // This would typically fetch data from the server
        // For now, we'll just initialize with an empty array
        this.adPlacements = [];
    }

    /**
     * Update placements visibility based on device targeting
     */
    updatePlacementsVisibility() {
        this.adPlacements.forEach(placementData => {
            const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${placementData.id}"]`);
            if (!placement) return;
            
            // Check if the current view is targeted
            const isTargeted = placementData.deviceTargeting.includes(this.currentView);
            
            // Update visibility
            placement.style.display = isTargeted ? 'flex' : 'none';
        });
    }

    /**
     * Update a placement's name
     * @param {string} id - Placement ID
     * @param {string} name - New name
     */
    updatePlacementName(id, name) {
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            placementData.name = name;
        }
    }

    /**
     * Update a placement's device targeting
     * @param {string} id - Placement ID
     * @param {string} device - Device type ('desktop', 'tablet', 'mobile')
     * @param {boolean} enabled - Whether the device is targeted
     */
    updatePlacementDeviceTargeting(id, device, enabled) {
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            if (enabled && !placementData.deviceTargeting.includes(device)) {
                placementData.deviceTargeting.push(device);
            } else if (!enabled) {
                placementData.deviceTargeting = placementData.deviceTargeting.filter(d => d !== device);
            }
            
            // Update visibility based on current view
            this.updatePlacementsVisibility();
        }
    }

    /**
     * Update a placement's active status
     * @param {string} id - Placement ID
     * @param {boolean} active - Whether the placement is active
     */
    updatePlacementActive(id, active) {
        // Find the placement element
        const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${id}"]`);
        if (!placement) return;
        
        // Update element
        if (active) {
            placement.style.opacity = '1';
        } else {
            placement.style.opacity = '0.5';
        }
        
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            placementData.isActive = active;
        }
    }

    /**
     * Update a placement's size
     * @param {string} id - Placement ID
     * @param {number|null} width - Width (null to keep current)
     * @param {number|null} height - Height (null to keep current)
     */
    updatePlacementSize(id, width, height) {
        // Find the placement element
        const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${id}"]`);
        if (!placement) return;
        
        // Get current size
        let currentWidth = parseInt(placement.style.width) || 0;
        let currentHeight = parseInt(placement.style.height) || 0;
        
        // Update size
        if (width !== null) currentWidth = width;
        if (height !== null) currentHeight = height;
        
        // Snap to grid
        const snappedWidth = Math.round(currentWidth / this.gridSize) * this.gridSize;
        const snappedHeight = Math.round(currentHeight / this.gridSize) * this.gridSize;
        
        // Update element
        placement.style.width = snappedWidth + 'px';
        placement.style.height = snappedHeight + 'px';
        
        // Update label
        const label = placement.querySelector('.ad-placement-label');
        if (label) {
            label.textContent = `${snappedWidth}×${snappedHeight}`;
        }
        
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            placementData.width = snappedWidth;
            placementData.height = snappedHeight;
        }
    }

    /**
     * Delete a placement
     * @param {string} id - Placement ID
     */
    deletePlacement(id) {
        // Find the placement element
        const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${id}"]`);
        if (!placement) return;
        
        // Remove element
        this.pagePreview.removeChild(placement);
        
        // Remove from data
        this.adPlacements = this.adPlacements.filter(p => p.id !== id);
        
        // Reset config panel
        this.deselectAllPlacements();
    }

/**
     * Create a new ad placement
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     */
    createAdPlacement(x, y, width, height) {
        try {
            console.log('AdManager: Creating new ad placement:', { x, y, width, height });
            
            // Generate a unique ID
            const id = 'ad-placement-' + Date.now();
            
            // x and y are already snapped to grid from the drag handler
            // No need to snap again here
            
            // Create the placement element
            const placement = document.createElement('div');
            placement.className = 'ad-placement';
            placement.setAttribute('data-id', id);
            placement.setAttribute('data-x', x);
            placement.setAttribute('data-y', y);
            placement.style.width = width + 'px';
            placement.style.height = height + 'px';
            placement.style.transform = `translate(${x}px, ${y}px)`;
            
            // Add a label
            const label = document.createElement('div');
            label.className = 'ad-placement-label';
            label.textContent = `${width}×${height}`;
            placement.appendChild(label);
            
            // Add to page preview
            this.pagePreview.appendChild(placement);
            
            // Store the placement data
            const placementData = {
                id,
                x: x,
                y: y,
                width,
                height,
                name: `Ad Placement ${this.adPlacements.length + 1}`,
                deviceTargeting: ['desktop', 'tablet', 'mobile'],
                isActive: true,
                variants: [] // Initialize with empty variants array
            };
            this.adPlacements.push(placementData);
            
            console.log('AdManager: Placement data stored:', placementData);
            
            // Add click event to select this placement
            placement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectPlacement(placement);
            });
            
            // Select the new placement
            this.selectPlacement(placement);
            
            // Reinitialize drag and drop for the new element
            setTimeout(() => {
                this.initDragAndDrop();
                console.log('AdManager: Drag and drop reinitialized for new placement');
            }, 50);
            
            // Dispatch custom event for placement creation
            const event = new CustomEvent('adPlacementCreated', {
                detail: placementData
            });
            document.dispatchEvent(event);
            
            console.log('AdManager: Ad placement created successfully');
            
        } catch (error) {
            console.error('AdManager: Error creating ad placement:', error);
            throw error;
        }
    }

    /**
     * Select an ad placement
     * @param {HTMLElement} placement - The placement element
     */
    selectPlacement(placement) {
        // Deselect all placements first
        this.deselectAllPlacements();
        
        // Add selected class
        placement.classList.add('selected');
        this.selectedPlacement = placement;
        
        // Get the placement data
        const placementId = placement.getAttribute('data-id');
        const placementData = this.adPlacements.find(p => p.id === placementId);
        
        if (placementData) {
            // Update the config panel
            this.updateConfigPanel(placementData);
            
            // Dispatch custom event for placement selection
            const event = new CustomEvent('adPlacementSelected', {
                detail: placementData
            });
            document.dispatchEvent(event);
        }
    }

    /**
     * Deselect all placements
     */
    deselectAllPlacements() {
        const placements = this.pagePreview.querySelectorAll('.ad-placement');
        placements.forEach(p => p.classList.remove('selected'));
        this.selectedPlacement = null;
        
        // Reset config panel
        this.configPanel.innerHTML = '<h4>Ad Configuration</h4><p>Select an ad placement to configure it.</p>';
    }

    /**
     * Update the configuration panel with placement data
     * @param {Object} placementData - The placement data
     */
    updateConfigPanel(placementData) {
        this.configPanel.innerHTML = `
            <h4>Ad Configuration</h4>
            <form id="ad-config-form">
                <div class="form-group">
                    <label for="placement-name">
                        Name
                        <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="A descriptive name to identify this ad placement"></i>
                    </label>
                    <input type="text" class="form-control" id="placement-name" value="${placementData.name}">
                </div>
                
                <div class="form-group-inline">
                    <div class="form-group">
                        <label for="placement-x">
                            X Position
                            <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="Horizontal position in pixels from the left edge"></i>
                        </label>
                        <input type="number" class="form-control" id="placement-x" value="${placementData.x}">
                    </div>
                    <div class="form-group">
                        <label for="placement-y">
                            Y Position
                            <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="Vertical position in pixels from the top edge"></i>
                        </label>
                        <input type="number" class="form-control" id="placement-y" value="${placementData.y}">
                    </div>
                </div>
                
                <div class="form-group-inline">
                    <div class="form-group">
                        <label for="placement-width">
                            Width
                            <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="Width of the ad in pixels"></i>
                        </label>
                        <input type="number" class="form-control" id="placement-width" value="${placementData.width}">
                    </div>
                    <div class="form-group">
                        <label for="placement-height">
                            Height
                            <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="Height of the ad in pixels"></i>
                        </label>
                        <input type="number" class="form-control" id="placement-height" value="${placementData.height}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>
                        Device Targeting
                        <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="Select which device types should display this ad"></i>
                    </label>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" id="target-desktop" ${placementData.deviceTargeting.includes('desktop') ? 'checked' : ''}>
                            Desktop
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" id="target-tablet" ${placementData.deviceTargeting.includes('tablet') ? 'checked' : ''}>
                            Tablet
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" id="target-mobile" ${placementData.deviceTargeting.includes('mobile') ? 'checked' : ''}>
                            Mobile
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" id="placement-active" ${placementData.isActive ? 'checked' : ''}>
                            Active
                            <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="When checked, this ad placement will be displayed on the site"></i>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <h5>
                        A/B Testing
                        <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="Create multiple variants to test different ad codes and compare performance"></i>
                    </h5>
                    <button type="button" class="btn btn-primary btn-sm add-variant-btn" data-placement-id="${placementData.id}">
                        <i class="fa fa-plus"></i> Add Variant
                    </button>
                    <button type="button" class="btn btn-info btn-sm view-variants-performance-btn" data-placement-id="${placementData.id}">
                        <i class="fa fa-bar-chart"></i> View Performance
                    </button>
                    <div class="variant-distribution" style="margin-top: 10px;">
                        <h6>
                            Variant Distribution
                            <i class="fa fa-question-circle tooltip-trigger" data-toggle="tooltip" title="Visual representation of traffic distribution between variants based on their weights"></i>
                        </h6>
                        <div class="progress" style="height: 30px;">
                            ${this.generateVariantDistributionBars(placementData.variants)}
                        </div>
                        <div class="variant-legend" style="margin-top: 5px; font-size: 12px;">
                            ${this.generateVariantLegend(placementData.variants)}
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <button type="button" class="btn btn-danger btn-sm" id="delete-placement">
                        <i class="fa fa-trash"></i> Delete Placement
                    </button>
                </div>
            </form>
        `;
        
        // Initialize tooltips after content is added to DOM
        setTimeout(() => {
            $('.tooltip-trigger', this.configPanel).tooltip({
                container: '#ad-manager-tooltips',
                placement: 'right'
            });
        }, 100);
        
        // Add event listeners to form fields
        const self = this;
        
        // Position and size inputs
        document.getElementById('placement-x').addEventListener('change', function() {
            const x = parseInt(this.value);
            self.updatePlacementPosition(placementData.id, x, null);
        });
        
        document.getElementById('placement-y').addEventListener('change', function() {
            const y = parseInt(this.value);
            self.updatePlacementPosition(placementData.id, null, y);
        });
        
        document.getElementById('placement-width').addEventListener('change', function() {
            const width = parseInt(this.value);
            self.updatePlacementSize(placementData.id, width, null);
        });
        
        document.getElementById('placement-height').addEventListener('change', function() {
            const height = parseInt(this.value);
            self.updatePlacementSize(placementData.id, null, height);
        });
        
        // Name input
        document.getElementById('placement-name').addEventListener('change', function() {
            const name = this.value;
            self.updatePlacementName(placementData.id, name);
        });
        
        // Device targeting checkboxes
        document.getElementById('target-desktop').addEventListener('change', function() {
            self.updatePlacementDeviceTargeting(placementData.id, 'desktop', this.checked);
        });
        
        document.getElementById('target-tablet').addEventListener('change', function() {
            self.updatePlacementDeviceTargeting(placementData.id, 'tablet', this.checked);
        });
        
        document.getElementById('target-mobile').addEventListener('change', function() {
            self.updatePlacementDeviceTargeting(placementData.id, 'mobile', this.checked);
        });
        
        // Active checkbox
        document.getElementById('placement-active').addEventListener('change', function() {
            self.updatePlacementActive(placementData.id, this.checked);
        });
        
        // Delete button
        document.getElementById('delete-placement').addEventListener('click', function() {
            self.deletePlacement(placementData.id);
        });
    }

    /**
     * Update the position fields in the config panel
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    updateConfigPanelPosition(x, y) {
        const xInput = document.getElementById('placement-x');
        const yInput = document.getElementById('placement-y');
        
        if (xInput) xInput.value = x;
        if (yInput) yInput.value = y;
    }

    /**
     * Update the size fields in the config panel
     * @param {number} width - Width
     * @param {number} height - Height
     */
    updateConfigPanelSize(width, height) {
        const widthInput = document.getElementById('placement-width');
        const heightInput = document.getElementById('placement-height');
        
        if (widthInput) widthInput.value = width;
        if (heightInput) heightInput.value = height;
    }

    /**
     * Update a placement's position
     * @param {string} id - Placement ID
     * @param {number|null} x - X position (null to keep current)
     * @param {number|null} y - Y position (null to keep current)
     */
    updatePlacementPosition(id, x, y) {
        // Find the placement element
        const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${id}"]`);
        if (!placement) return;
        
        // Get current position
        let currentX = parseFloat(placement.getAttribute('data-x')) || 0;
        let currentY = parseFloat(placement.getAttribute('data-y')) || 0;
        
        // Update position
        if (x !== null) currentX = x;
        if (y !== null) currentY = y;
        
        // Snap to grid
        const snappedX = Math.round(currentX / this.gridSize) * this.gridSize;
        const snappedY = Math.round(currentY / this.gridSize) * this.gridSize;
        
        // Update element
        placement.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
        placement.setAttribute('data-x', snappedX);
        placement.setAttribute('data-y', snappedY);
        
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            placementData.x = snappedX;
            placementData.y = snappedY;
        }
    }

    /**
     * Update a placement's size
     * @param {string} id - Placement ID
     * @param {number|null} width - Width (null to keep current)
     * @param {number|null} height - Height (null to keep current)
     */
    updatePlacementSize(id, width, height) {
        // Find the placement element
        const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${id}"]`);
        if (!placement) return;
        
        // Get current size
        let currentWidth = parseInt(placement.style.width) || 0;
        let currentHeight = parseInt(placement.style.height) || 0;
        
        // Update size
        if (width !== null) currentWidth = width;
        if (height !== null) currentHeight = height;
        
        // Snap to grid
        const snappedWidth = Math.round(currentWidth / this.gridSize) * this.gridSize;
        const snappedHeight = Math.round(currentHeight / this.gridSize) * this.gridSize;
        
        // Update element
        placement.style.width = snappedWidth + 'px';
        placement.style.height = snappedHeight + 'px';
        
        // Update label
        const label = placement.querySelector('.ad-placement-label');
        if (label) {
            label.textContent = `${snappedWidth}×${snappedHeight}`;
        }
        
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            placementData.width = snappedWidth;
            placementData.height = snappedHeight;
        }
    }

    /**
     * Update a placement's name
     * @param {string} id - Placement ID
     * @param {string} name - New name
     */
    updatePlacementName(id, name) {
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            placementData.name = name;
        }
    }

    /**
     * Update a placement's device targeting
     * @param {string} id - Placement ID
     * @param {string} device - Device type ('desktop', 'tablet', 'mobile')
     * @param {boolean} enabled - Whether the device is targeted
     */
    updatePlacementDeviceTargeting(id, device, enabled) {
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            if (enabled && !placementData.deviceTargeting.includes(device)) {
                placementData.deviceTargeting.push(device);
            } else if (!enabled) {
                placementData.deviceTargeting = placementData.deviceTargeting.filter(d => d !== device);
            }
            
            // Update visibility based on current view
            this.updatePlacementsVisibility();
        }
    }

    /**
     * Update a placement's active status
     * @param {string} id - Placement ID
     * @param {boolean} active - Whether the placement is active
     */
    updatePlacementActive(id, active) {
        // Find the placement element
        const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${id}"]`);
        if (!placement) return;
        
        // Update element
        if (active) {
            placement.style.opacity = '1';
        } else {
            placement.style.opacity = '0.5';
        }
        
        // Update placement data
        const placementData = this.adPlacements.find(p => p.id === id);
        if (placementData) {
            placementData.isActive = active;
        }
    }

    /**
     * Delete a placement
     * @param {string} id - Placement ID
     */
    deletePlacement(id) {
        // Find the placement element
        const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${id}"]`);
        if (!placement) return;
        
        // Remove element
        this.pagePreview.removeChild(placement);
        
        // Remove from data
        this.adPlacements = this.adPlacements.filter(p => p.id !== id);
        
        // Reset config panel
        this.deselectAllPlacements();
    }

    /**
     * Update placements visibility based on device targeting
     */
    updatePlacementsVisibility() {
        this.adPlacements.forEach(placementData => {
            const placement = this.pagePreview.querySelector(`.ad-placement[data-id="${placementData.id}"]`);
            if (!placement) return;
            
            // Check if the current view is targeted
            const isTargeted = placementData.deviceTargeting.includes(this.currentView);
            
            // Update visibility
            placement.style.display = isTargeted ? 'flex' : 'none';
        });
    }

    /**
     * Load existing placements from the server
     */
    loadExistingPlacements() {
        // This would typically fetch data from the server
        // For now, we'll just initialize with an empty array
        this.adPlacements = [];
    }
    
    /**
     * Set up the preview button functionality
     */
    setupPreviewButton() {
        // This is handled in the blade template with jQuery
        // The button triggers an AJAX request to the server
        // and displays the result in a modal
    }
    
    /**
     * Generate HTML for variant distribution bars
     * @param {Array} variants - Array of variants
     * @returns {string} HTML for progress bars
     */
    generateVariantDistributionBars(variants) {
        if (!variants || variants.length === 0) {
            return '<div class="progress-bar progress-bar-info" style="width: 100%">No variants</div>';
        }
        
        // Calculate total weight
        const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
        
        // Generate bars
        return variants.map((variant, index) => {
            const percentage = totalWeight > 0 ? (variant.weight / totalWeight) * 100 : 0;
            const colorClass = variant.is_control ? 'progress-bar-info' : `progress-bar-${['success', 'warning', 'danger', 'primary'][index % 4]}`;
            
            return `<div class="progress-bar ${colorClass}" style="width: ${percentage}%" title="${variant.name} (${percentage.toFixed(1)}%)">${percentage > 10 ? `${variant.name} ${percentage.toFixed(0)}%` : ''}</div>`;
        }).join('');
    }
    
    /**
     * Generate HTML for variant legend
     * @param {Array} variants - Array of variants
     * @returns {string} HTML for legend
     */
    generateVariantLegend(variants) {
        if (!variants || variants.length === 0) {
            return 'Create variants to start A/B testing';
        }
        
        return variants.map((variant, index) => {
            const colorClass = variant.is_control ? 'text-info' : `text-${['success', 'warning', 'danger', 'primary'][index % 4]}`;
            const controlBadge = variant.is_control ? ' <span class="label label-info">Control</span>' : '';
            
            return `<span class="${colorClass}"><i class="fa fa-square"></i> ${variant.name} (${variant.weight}%)${controlBadge}</span>`;
        }).join(' | ');
    }
    
    /**
     * Initialize metrics functionality
     * This is called from the ads.blade.php template
     */
    static initMetrics() {
        // Initialize metrics dashboard
        const metricsManager = new MetricsManager();
        metricsManager.init();
    }
    
    /**
     * Generate preview data for all ad placements
     * @returns {Array} Array of placement data objects
     */
    getPreviewData() {
        return this.adPlacements.map(placement => {
            return {
                id: placement.id,
                name: placement.name,
                x: placement.x,
                y: placement.y,
                width: placement.width,
                height: placement.height,
                deviceTargeting: placement.deviceTargeting,
                isActive: placement.isActive,
                variants: placement.variants || []
            };
        });
    }
    
    /**
     * Toggle variant preview mode
     * @param {boolean} enabled - Whether to enable variant preview mode
     * @param {Object} variant - The variant to preview (optional)
     */
    toggleVariantPreviewMode(enabled, variant = null) {
        this.variantPreviewMode = enabled;
        this.showingVariant = variant;
        
        if (enabled && variant) {
            // Update the preview to show the variant
            const placement = this.adPlacements.find(p => p.id === variant.placement_id);
            if (placement) {
                const placementElement = this.pagePreview.querySelector(`.ad-placement[data-id="${placement.id}"]`);
                if (placementElement) {
                    // Add variant preview class
                    placementElement.classList.add('variant-preview');
                    
                    // Update label to show variant name
                    const label = placementElement.querySelector('.ad-placement-label');
                    if (label) {
                        label.innerHTML = `${placement.name}<br>${placement.width}×${placement.height}<br>Variant: ${variant.name}`;
                    }
                }
            }
        } else {
            // Reset all placements to normal view
            const placements = this.pagePreview.querySelectorAll('.ad-placement');
            placements.forEach(p => {
                p.classList.remove('variant-preview');
                
                // Reset label
                const placementId = p.getAttribute('data-id');
                const placement = this.adPlacements.find(pl => pl.id === placementId);
                if (placement) {
                    const label = p.querySelector('.ad-placement-label');
                    if (label) {
                        label.innerHTML = `${placement.name}<br>${placement.width}×${placement.height}`;
                    }
                }
            });
        }
    }
    
    /**
     * Enter preview mode
     * This will show a representation of how the ads will appear on the site
     */
    enterPreviewMode() {
        this.previewMode = true;
        
        // Hide configuration elements
        this.toolbox.style.display = 'none';
        this.configPanel.style.display = 'none';
        
        // Adjust the page preview to take full width
        this.pagePreview.style.flex = '1 1 100%';
        
        // Disable dragging and resizing
        interact('.ad-placement').unset();
        
        // Update the UI to show we're in preview mode
        const placements = this.pagePreview.querySelectorAll('.ad-placement');
        placements.forEach(p => {
            p.style.cursor = 'default';
            p.classList.add('preview-mode');
        });
    }
    
    /**
     * Exit preview mode
     */
    exitPreviewMode() {
        this.previewMode = false;
        
        // Restore configuration elements
        this.toolbox.style.display = '';
        this.configPanel.style.display = '';
        
        // Restore the page preview size
        this.pagePreview.style.flex = '';
        
        // Re-enable dragging and resizing
        this.initDragAndDrop();
        
        // Update the UI
        const placements = this.pagePreview.querySelectorAll('.ad-placement');
        placements.forEach(p => {
            p.style.cursor = 'move';
            p.classList.remove('preview-mode');
        });
    }
}
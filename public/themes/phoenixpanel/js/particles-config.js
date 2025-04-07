/**
 * Phoenix Panel - Ember Particle Animation
 * Creates ember-like floating particles for the Phoenix theme
 */

class PhoenixParticles {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            containerId: options.containerId || 'particles-container',
            targetElement: options.targetElement || document.body,
            maxParticles: options.maxParticles || 30,
            emissionRate: options.emissionRate || 2, // particles per second
            minSize: options.minSize || 6,
            maxSize: options.maxSize || 16,
            minDuration: options.minDuration || 3, // seconds
            maxDuration: options.maxDuration || 6, // seconds
            minTravelDistance: options.minTravelDistance || -100, // pixels
            maxTravelDistance: options.maxTravelDistance || -300, // pixels
            minDrift: options.minDrift || -30, // horizontal drift in pixels
            maxDrift: options.maxDrift || 30,
            colors: options.colors || ['orange', 'yellow', 'red'],
            sizes: options.sizes || ['small', 'medium', 'large'],
            maxOpacity: options.maxOpacity || 0.8,
            enabled: options.enabled !== undefined ? options.enabled : true,
            emitFromBottom: options.emitFromBottom !== undefined ? options.emitFromBottom : true
        };

        this.particles = [];
        this.container = null;
        this.isRunning = false;
        this.animationFrameId = null;
        this.lastEmissionTime = 0;

        this.init();
    }

    init() {
        // Create container if it doesn't exist
        if (!document.getElementById(this.config.containerId)) {
            this.container = document.createElement('div');
            this.container.id = this.config.containerId;
            this.container.className = 'particles-container';
            this.config.targetElement.appendChild(this.container);
        } else {
            this.container = document.getElementById(this.config.containerId);
        }

        // Start animation if enabled
        if (this.config.enabled) {
            this.start();
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastEmissionTime = performance.now();
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    animate() {
        const now = performance.now();
        const elapsed = now - this.lastEmissionTime;
        
        // Emit new particles based on emission rate
        if (elapsed > (1000 / this.config.emissionRate)) {
            this.emitParticle();
            this.lastEmissionTime = now;
        }
        
        // Clean up finished particles
        this.particles = this.particles.filter(particle => {
            const element = document.getElementById(particle.id);
            if (element && performance.now() - particle.startTime < particle.duration) {
                return true;
            } else if (element) {
                element.remove();
                return false;
            }
            return false;
        });

        // Continue animation loop
        if (this.isRunning) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
    }

    emitParticle() {
        // Don't exceed max particles
        if (this.particles.length >= this.config.maxParticles) return;

        // Create a new particle
        const id = `ember-particle-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const element = document.createElement('div');
        element.id = id;
        
        // Random properties
        const size = this.config.sizes[Math.floor(Math.random() * this.config.sizes.length)];
        const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        const duration = this.getRandomBetween(this.config.minDuration, this.config.maxDuration);
        const travelDistance = this.getRandomBetween(this.config.minTravelDistance, this.config.maxTravelDistance);
        const drift = this.getRandomBetween(this.config.minDrift, this.config.maxDrift);
        const opacity = this.getRandomBetween(0.4, this.config.maxOpacity);
        
        // Set classes and styles
        element.className = `ember-particle ${size} ${color}`;
        element.style.setProperty('--duration', `${duration}s`);
        element.style.setProperty('--travel-distance', `${travelDistance}px`);
        element.style.setProperty('--drift', `${drift}px`);
        element.style.setProperty('--max-opacity', opacity);
        
        // Position the particle
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        
        let startX, startY;
        
        if (this.config.emitFromBottom) {
            // Emit from bottom of container
            startX = Math.random() * containerWidth;
            startY = containerHeight - 10; // Just above the bottom
        } else {
            // Emit from random position
            startX = Math.random() * containerWidth;
            startY = Math.random() * containerHeight;
        }
        
        element.style.left = `${startX}px`;
        element.style.bottom = `${startY}px`;
        
        // Add to DOM and track
        this.container.appendChild(element);
        this.particles.push({
            id,
            startTime: performance.now(),
            duration: duration * 1000 // convert to ms
        });
    }

    getRandomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    setEnabled(enabled) {
        this.config.enabled = enabled;
        if (enabled && !this.isRunning) {
            this.start();
        } else if (!enabled && this.isRunning) {
            this.stop();
        }
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Initialize particles on login page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    if (document.querySelector('.login-page')) {
        // Create particles container
        const loginBox = document.querySelector('.login-page');
        
        // Initialize with more particles and faster emission for login page
        window.phoenixParticles = new PhoenixParticles({
            targetElement: loginBox,
            maxParticles: 50,
            emissionRate: 3,
            minTravelDistance: -200,
            maxTravelDistance: -500,
            emitFromBottom: true
        });
    }
    
    // Add subtle particles to other pages if they have the .phoenix-particles class
    const otherParticleContainers = document.querySelectorAll('.phoenix-particles');
    otherParticleContainers.forEach((container, index) => {
        new PhoenixParticles({
            containerId: `particles-container-${index}`,
            targetElement: container,
            maxParticles: 15,
            emissionRate: 1,
            maxOpacity: 0.5,
            emitFromBottom: false
        });
    });
});
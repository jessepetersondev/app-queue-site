/**
 * Main application file for Counter App 5567
 * Handles UI initialization, event binding, and counter integration
 */

import Counter from './counter.js';

class CounterApp {
    constructor() {
        this.counter = null;
        this.elements = {};
        this.isInitialized = false;
        this.animationTimeouts = new Set();

        // Bind methods to preserve context
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.onCounterChange = this.onCounterChange.bind(this);
    }

    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) {
            console.warn('App already initialized');
            return;
        }

        try {
            this.cacheElements();
            this.initializeCounter();
            this.bindEvents();
            this.updateDisplay();
            this.isInitialized = true;

            console.log('Counter App 5567 initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application');
        }
    }

    /**
     * Cache DOM elements for efficient access
     */
    cacheElements() {
        const requiredElements = {
            counterValue: '#counter-value',
            incrementBtn: '#increment-btn',
            decrementBtn: '#decrement-btn',
            resetBtn: '#reset-btn',
            counterDisplay: '.counter-display'
        };

        for (const [key, selector] of Object.entries(requiredElements)) {
            const element = document.querySelector(selector);
            if (!element) {
                throw new Error(`Required element not found: ${selector}`);
            }
            this.elements[key] = element;
        }

        // Optional elements
        this.elements.appContainer = document.querySelector('.app-container');
        this.elements.counterSection = document.querySelector('.counter-section');
    }

    /**
     * Initialize the counter instance
     */
    initializeCounter() {
        this.counter = new Counter(0, {
            persistValue: true,
            validateBounds: true,
            enableHistory: true,
            minValue: Number.MIN_SAFE_INTEGER,
            maxValue: Number.MAX_SAFE_INTEGER
        });

        // Listen for counter changes
        this.counter.on('change', this.onCounterChange);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Button click events
        this.elements.incrementBtn.addEventListener('click', this.handleIncrement);
        this.elements.decrementBtn.addEventListener('click', this.handleDecrement);
        this.elements.resetBtn.addEventListener('click', this.handleReset);

        // Keyboard events
        document.addEventListener('keydown', this.handleKeydown);

        // Accessibility: Handle button activation with Enter/Space
        [this.elements.incrementBtn, this.elements.decrementBtn, this.elements.resetBtn]
            .forEach(button => {
                button.addEventListener('keydown', this.handleButtonKeydown.bind(this));
            });

        // Handle visibility change to prevent issues when tab is not active
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Handle beforeunload for cleanup
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    /**
     * Handle button keydown events for accessibility
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleButtonKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.target.click();
        }
    }

    /**
     * Handle global keydown events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeydown(event) {
        // Only handle if no input is focused
        if (document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
            case '+':
            case '=':
                event.preventDefault();
                this.handleIncrement();
                break;

            case 'ArrowDown':
            case '-':
            case '_':
                event.preventDefault();
                this.handleDecrement();
                break;

            case 'r':
            case 'R':
                if (event.ctrlKey || event.metaKey) {
                    return; // Allow browser refresh
                }
                event.preventDefault();
                this.handleReset();
                break;

            case '0':
                event.preventDefault();
                this.handleReset();
                break;
        }
    }

    /**
     * Handle increment button click
     */
    handleIncrement() {
        if (!this.counter) return;

        const newValue = this.counter.increment();
        this.animateButton(this.elements.incrementBtn);
        this.announceChange(`Incremented to ${newValue}`);
    }

    /**
     * Handle decrement button click
     */
    handleDecrement() {
        if (!this.counter) return;

        const newValue = this.counter.decrement();
        this.animateButton(this.elements.decrementBtn);
        this.announceChange(`Decremented to ${newValue}`);
    }

    /**
     * Handle reset button click
     */
    handleReset() {
        if (!this.counter) return;

        const newValue = this.counter.reset();
        this.animateButton(this.elements.resetBtn);
        this.animateCounter('pulse');
        this.announceChange(`Reset to ${newValue}`);
    }

    /**
     * Handle counter value changes
     * @param {object} changeData - Data about the change
     */
    onCounterChange(changeData) {
        this.updateDisplay();
        this.animateCounter('pulse');

        // Log for debugging
        console.log('Counter changed:', changeData);
    }

    /**
     * Update the display with current counter value
     */
    updateDisplay() {
        if (!this.counter || !this.elements.counterValue) return;

        const value = this.counter.getValue();

        // Add updating class for animation
        this.elements.counterValue.classList.add('updating');

        // Update text content
        this.elements.counterValue.textContent = value.toLocaleString();

        // Remove updating class after animation
        setTimeout(() => {
            this.elements.counterValue.classList.remove('updating');
        }, 150);

        // Update aria-label for screen readers
        this.elements.counterDisplay.setAttribute('aria-label', `Current counter value: ${value}`);
    }

    /**
     * Animate a button
     * @param {HTMLElement} button - Button element to animate
     */
    animateButton(button) {
        if (!button) return;

        button.classList.add('pulse');

        const timeout = setTimeout(() => {
            button.classList.remove('pulse');
            this.animationTimeouts.delete(timeout);
        }, 300);

        this.animationTimeouts.add(timeout);
    }

    /**
     * Animate the counter display
     * @param {string} animation - Animation class name
     */
    animateCounter(animation) {
        if (!this.elements.counterValue || !animation) return;

        this.elements.counterValue.classList.add(animation);

        const timeout = setTimeout(() => {
            this.elements.counterValue.classList.remove(animation);
            this.animationTimeouts.delete(timeout);
        }, 500);

        this.animationTimeouts.add(timeout);
    }

    /**
     * Announce changes to screen readers
     * @param {string} message - Message to announce
     */
    announceChange(message) {
        // Create a temporary element for screen reader announcement
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    /**
     * Handle visibility change events
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is now hidden - pause animations or heavy operations
            this.clearAnimations();
        } else {
            // Page is now visible - resume normal operation
            this.updateDisplay();
        }
    }

    /**
     * Clear all running animations
     */
    clearAnimations() {
        this.animationTimeouts.forEach(timeout => {
            clearTimeout(timeout);
        });
        this.animationTimeouts.clear();

        // Remove animation classes
        document.querySelectorAll('.pulse, .shake, .updating')
            .forEach(element => {
                element.classList.remove('pulse', 'shake', 'updating');
            });
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     */
    showError(message) {
        console.error(message);

        // Simple error display - could be enhanced with a proper modal
        if (this.elements.counterValue) {
            this.elements.counterValue.textContent = 'Error';
            this.elements.counterValue.style.color = 'var(--danger-color)';

            setTimeout(() => {
                this.elements.counterValue.style.color = '';
                this.updateDisplay();
            }, 2000);
        }
    }

    /**
     * Handle before page unload
     */
    handleBeforeUnload() {
        this.cleanup();
    }

    /**
     * Clean up resources and event listeners
     */
    cleanup() {
        // Clear animations
        this.clearAnimations();

        // Remove event listeners
        if (this.elements.incrementBtn) {
            this.elements.incrementBtn.removeEventListener('click', this.handleIncrement);
        }
        if (this.elements.decrementBtn) {
            this.elements.decrementBtn.removeEventListener('click', this.handleDecrement);
        }
        if (this.elements.resetBtn) {
            this.elements.resetBtn.removeEventListener('click', this.handleReset);
        }

        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);

        // Clean up counter
        if (this.counter) {
            this.counter.off('change', this.onCounterChange);
        }

        this.isInitialized = false;
        console.log('Counter App cleaned up');
    }

    /**
     * Get current app state for debugging
     * @returns {object} Current app state
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            counterValue: this.counter ? this.counter.getValue() : null,
            counterStats: this.counter ? this.counter.getStats() : null,
            activeAnimations: this.animationTimeouts.size
        };
    }

    /**
     * Reset the entire application
     */
    resetApp() {
        this.cleanup();

        // Clear any persisted data
        if (this.counter) {
            this.counter.destroy();
        }

        // Reinitialize
        this.init();

        console.log('Application reset complete');
    }
}

// Initialize app when DOM is ready
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.counterApp = new CounterApp();
            window.counterApp.init();
        });
    } else {
        window.counterApp = new CounterApp();
        window.counterApp.init();
    }
}

// Start the application
initializeApp();

// Export for testing or external access
export default CounterApp;
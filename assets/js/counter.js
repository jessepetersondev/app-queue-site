/**
 * Counter logic module
 * Handles counter state management with event emission and validation
 */

import { storage, STORAGE_KEYS } from './storage.js';

class Counter {
    constructor(initialValue = 0, options = {}) {
        this.value = initialValue;
        this.lastUpdated = new Date().toISOString();
        this.listeners = new Map();

        // Configuration options
        this.options = {
            minValue: options.minValue ?? Number.MIN_SAFE_INTEGER,
            maxValue: options.maxValue ?? Number.MAX_SAFE_INTEGER,
            persistValue: options.persistValue ?? true,
            validateBounds: options.validateBounds ?? true,
            enableHistory: options.enableHistory ?? false,
            maxHistoryLength: options.maxHistoryLength ?? 100,
            ...options
        };

        // Initialize history if enabled
        this.history = this.options.enableHistory ? [] : null;

        // Load persisted value if enabled
        if (this.options.persistValue) {
            this.loadPersistedValue();
        }

        // Validate initial value
        if (this.options.validateBounds) {
            this.value = this.clampValue(this.value);
        }

        // Add to history
        this.addToHistory('init', this.value, this.value);
    }

    /**
     * Load persisted counter value from storage
     */
    loadPersistedValue() {
        try {
            const persistedData = storage.load(STORAGE_KEYS.COUNTER_VALUE);
            if (persistedData && typeof persistedData === 'object') {
                this.value = typeof persistedData.value === 'number' ? persistedData.value : this.value;
                this.lastUpdated = persistedData.lastUpdated || this.lastUpdated;
            }
        } catch (error) {
            console.warn('Failed to load persisted counter value:', error.message);
        }
    }

    /**
     * Save current counter state to storage
     */
    saveValue() {
        if (!this.options.persistValue) {
            return false;
        }

        try {
            const dataToSave = {
                value: this.value,
                lastUpdated: this.lastUpdated,
                version: '1.0'
            };
            return storage.save(STORAGE_KEYS.COUNTER_VALUE, dataToSave);
        } catch (error) {
            console.error('Failed to save counter value:', error.message);
            return false;
        }
    }

    /**
     * Clamp value to configured bounds
     * @param {number} value - Value to clamp
     * @returns {number} Clamped value
     */
    clampValue(value) {
        return Math.max(this.options.minValue, Math.min(this.options.maxValue, value));
    }

    /**
     * Validate if a value is within bounds
     * @param {number} value - Value to validate
     * @returns {boolean} True if valid
     */
    isValidValue(value) {
        return typeof value === 'number' &&
               !isNaN(value) &&
               isFinite(value) &&
               value >= this.options.minValue &&
               value <= this.options.maxValue;
    }

    /**
     * Add entry to history if enabled
     * @param {string} action - The action performed
     * @param {number} oldValue - Previous value
     * @param {number} newValue - New value
     */
    addToHistory(action, oldValue, newValue) {
        if (!this.options.enableHistory || !this.history) {
            return;
        }

        const entry = {
            action,
            oldValue,
            newValue,
            timestamp: new Date().toISOString(),
            diff: newValue - oldValue
        };

        this.history.push(entry);

        // Maintain max history length
        if (this.history.length > this.options.maxHistoryLength) {
            this.history.shift();
        }

        // Persist history if storage is enabled
        if (this.options.persistValue) {
            storage.save(STORAGE_KEYS.COUNTER_HISTORY, this.history);
        }
    }

    /**
     * Update counter value and emit change event
     * @param {number} newValue - The new counter value
     * @param {string} action - The action that caused the change
     * @returns {number} The actual new value (after validation/clamping)
     */
    updateValue(newValue, action = 'update') {
        const oldValue = this.value;

        // Validate input
        if (typeof newValue !== 'number' || isNaN(newValue) || !isFinite(newValue)) {
            console.warn('Invalid counter value provided:', newValue);
            return this.value;
        }

        // Apply bounds checking if enabled
        if (this.options.validateBounds) {
            newValue = this.clampValue(newValue);
        }

        // Check if value actually changed
        if (newValue === this.value) {
            return this.value;
        }

        // Update state
        this.value = newValue;
        this.lastUpdated = new Date().toISOString();

        // Add to history
        this.addToHistory(action, oldValue, newValue);

        // Persist value
        this.saveValue();

        // Emit change event
        this.emit('change', {
            value: this.value,
            oldValue,
            action,
            timestamp: this.lastUpdated,
            diff: this.value - oldValue
        });

        return this.value;
    }

    /**
     * Get current counter value
     * @returns {number} Current counter value
     */
    getValue() {
        return this.value;
    }

    /**
     * Increment counter by specified amount
     * @param {number} amount - Amount to increment (default: 1)
     * @returns {number} New counter value
     */
    increment(amount = 1) {
        if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
            console.warn('Invalid increment amount:', amount);
            return this.value;
        }

        const newValue = this.value + amount;
        return this.updateValue(newValue, 'increment');
    }

    /**
     * Decrement counter by specified amount
     * @param {number} amount - Amount to decrement (default: 1)
     * @returns {number} New counter value
     */
    decrement(amount = 1) {
        if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
            console.warn('Invalid decrement amount:', amount);
            return this.value;
        }

        const newValue = this.value - amount;
        return this.updateValue(newValue, 'decrement');
    }

    /**
     * Reset counter to specified value
     * @param {number} value - Value to reset to (default: 0)
     * @returns {number} New counter value
     */
    reset(value = 0) {
        return this.updateValue(value, 'reset');
    }

    /**
     * Set counter to specific value
     * @param {number} value - New value
     * @returns {number} Actual new value
     */
    setValue(value) {
        return this.updateValue(value, 'set');
    }

    /**
     * Register event listener
     * @param {string} event - Event name ('change', 'error')
     * @param {function} callback - Callback function
     * @returns {function} Unsubscribe function
     */
    on(event, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event).add(callback);

        // Return unsubscribe function
        return () => {
            const eventListeners = this.listeners.get(event);
            if (eventListeners) {
                eventListeners.delete(callback);
                if (eventListeners.size === 0) {
                    this.listeners.delete(event);
                }
            }
        };
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {function} callback - Callback function to remove
     */
    off(event, callback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.delete(callback);
            if (eventListeners.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    /**
     * Emit event to all listeners
     * @param {string} event - Event name
     * @param {any} data - Event data
     */
    emit(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} event listener:`, error);
                }
            });
        }
    }

    /**
     * Get counter history (if enabled)
     * @returns {Array|null} History array or null if disabled
     */
    getHistory() {
        return this.history ? [...this.history] : null;
    }

    /**
     * Clear counter history
     * @returns {boolean} True if successful
     */
    clearHistory() {
        if (!this.history) {
            return false;
        }

        this.history.length = 0;

        if (this.options.persistValue) {
            storage.remove(STORAGE_KEYS.COUNTER_HISTORY);
        }

        return true;
    }

    /**
     * Get counter statistics
     * @returns {object} Statistics object
     */
    getStats() {
        const stats = {
            currentValue: this.value,
            lastUpdated: this.lastUpdated,
            minValue: this.options.minValue,
            maxValue: this.options.maxValue,
            historyEnabled: this.options.enableHistory,
            persistenceEnabled: this.options.persistValue
        };

        if (this.history) {
            stats.totalActions = this.history.length;
            stats.increments = this.history.filter(h => h.action === 'increment').length;
            stats.decrements = this.history.filter(h => h.action === 'decrement').length;
            stats.resets = this.history.filter(h => h.action === 'reset').length;
        }

        return stats;
    }

    /**
     * Export counter data
     * @returns {object} Exportable counter data
     */
    export() {
        return {
            value: this.value,
            lastUpdated: this.lastUpdated,
            options: this.options,
            history: this.history,
            stats: this.getStats()
        };
    }

    /**
     * Destroy counter instance and clean up
     */
    destroy() {
        // Clear all event listeners
        this.listeners.clear();

        // Clear history
        if (this.history) {
            this.history.length = 0;
        }

        // Remove persisted data if requested
        if (this.options.persistValue) {
            storage.remove(STORAGE_KEYS.COUNTER_VALUE);
            storage.remove(STORAGE_KEYS.COUNTER_HISTORY);
        }
    }
}

export default Counter;

// Export utility functions
export {
    Counter
};
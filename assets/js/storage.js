/**
 * Storage utility module for localStorage operations
 * Handles localStorage with graceful fallback for unsupported environments
 */

class StorageManager {
    constructor() {
        this.isSupported = this.checkLocalStorageSupport();
        this.prefix = 'counter-app-5567-';
    }

    /**
     * Check if localStorage is available and functional
     * @returns {boolean} True if localStorage is supported
     */
    checkLocalStorageSupport() {
        try {
            const testKey = '__localStorage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.warn('localStorage is not available:', error.message);
            return false;
        }
    }

    /**
     * Generate a prefixed key for localStorage
     * @param {string} key - The key to prefix
     * @returns {string} The prefixed key
     */
    getPrefixedKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Save a value to localStorage
     * @param {string} key - The storage key
     * @param {any} value - The value to store (will be JSON stringified)
     * @returns {boolean} True if successful, false otherwise
     */
    save(key, value) {
        if (!this.isSupported) {
            console.warn('localStorage not supported, unable to save data');
            return false;
        }

        try {
            const serializedValue = JSON.stringify({
                value: value,
                timestamp: new Date().toISOString(),
                version: '1.0'
            });
            localStorage.setItem(this.getPrefixedKey(key), serializedValue);
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error.message);
            return false;
        }
    }

    /**
     * Load a value from localStorage
     * @param {string} key - The storage key
     * @param {any} defaultValue - The default value if key doesn't exist
     * @returns {any} The stored value or default value
     */
    load(key, defaultValue = null) {
        if (!this.isSupported) {
            return defaultValue;
        }

        try {
            const item = localStorage.getItem(this.getPrefixedKey(key));

            if (item === null) {
                return defaultValue;
            }

            const parsed = JSON.parse(item);

            // Validate the stored data structure
            if (typeof parsed === 'object' && parsed !== null && 'value' in parsed) {
                return parsed.value;
            } else {
                // Handle legacy data or corrupted data
                console.warn('Invalid data structure in localStorage, returning default value');
                return defaultValue;
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error.message);
            return defaultValue;
        }
    }

    /**
     * Remove a specific key from localStorage
     * @param {string} key - The storage key to remove
     * @returns {boolean} True if successful, false otherwise
     */
    remove(key) {
        if (!this.isSupported) {
            return false;
        }

        try {
            localStorage.removeItem(this.getPrefixedKey(key));
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error.message);
            return false;
        }
    }

    /**
     * Clear all app-specific data from localStorage
     * @returns {boolean} True if successful, false otherwise
     */
    clear() {
        if (!this.isSupported) {
            return false;
        }

        try {
            const keysToRemove = [];

            // Find all keys with our prefix
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }

            // Remove all found keys
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });

            return true;
        } catch (error) {
            console.error('Failed to clear localStorage:', error.message);
            return false;
        }
    }

    /**
     * Get all app-specific keys from localStorage
     * @returns {string[]} Array of keys (without prefix)
     */
    getAllKeys() {
        if (!this.isSupported) {
            return [];
        }

        const keys = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keys.push(key.substring(this.prefix.length));
                }
            }
        } catch (error) {
            console.error('Failed to get keys from localStorage:', error.message);
        }

        return keys;
    }

    /**
     * Get information about localStorage usage
     * @returns {object} Storage usage information
     */
    getStorageInfo() {
        if (!this.isSupported) {
            return {
                supported: false,
                totalKeys: 0,
                appKeys: 0,
                estimatedSize: 0
            };
        }

        let estimatedSize = 0;
        let appKeys = 0;

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const value = localStorage.getItem(key);
                    estimatedSize += key.length + (value ? value.length : 0);

                    if (key.startsWith(this.prefix)) {
                        appKeys++;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to calculate storage info:', error.message);
        }

        return {
            supported: true,
            totalKeys: localStorage.length,
            appKeys: appKeys,
            estimatedSize: estimatedSize
        };
    }
}

// Create and export a singleton instance
export const storage = new StorageManager();

// Export the class for testing or custom instances
export { StorageManager };

// Storage key constants
export const STORAGE_KEYS = {
    COUNTER_VALUE: 'counter_value',
    COUNTER_HISTORY: 'counter_history',
    USER_PREFERENCES: 'user_preferences'
};
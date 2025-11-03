/**
 * Generic localStorage utility functions with error handling
 */

/**
 * Get an item from localStorage
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {*} The parsed value or default value
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Set an item in localStorage
 * @param {string} key - The localStorage key
 * @param {*} value - The value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 */
export const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Remove an item from localStorage
 * @param {string} key - The localStorage key
 * @returns {boolean} True if successful, false otherwise
 */
export const removeFromLocalStorage = key => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all localStorage
 * @returns {boolean} True if successful, false otherwise
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

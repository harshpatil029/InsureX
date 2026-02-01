// Utility functions for the application

/**
 * Converts a string to Title Case (capitalizes first letter of each word)
 * @param {string} str - The string to convert
 * @returns {string} The string in Title Case
 */
export const toTitleCase = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Extracts and formats username from email or username
 * If it's an email, extracts the part before @ and formats it
 * @param {string} identifier - Email or username
 * @returns {string} Formatted username
 */
export const formatUsername = (identifier) => {
    if (!identifier) return 'User';

    // If it's an email, extract the username part
    const username = identifier.includes('@')
        ? identifier.split('@')[0]
        : identifier;

    // Handle usernames with numbers or special characters
    // Convert camelCase or snake_case to Title Case
    const formatted = username
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to spaces
        .replace(/[_-]/g, ' ') // underscores and dashes to spaces
        .replace(/[0-9]+/g, '') // remove numbers
        .trim();

    return toTitleCase(formatted) || username;
};

/**
 * Formats currency to USD
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

/**
 * Formats date to readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Truncates text to specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

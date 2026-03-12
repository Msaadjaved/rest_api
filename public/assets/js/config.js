// public/assets/js/config.js
const API_CONFIG = {
    apiKey: 'test-api-my-key-2026',       // matches API_CONFIG.apiKey in api.js
    API_KEY: 'test-api-my-key-2026',      // keep for backward compat
    baseURL: window.location.origin,       // matches API_CONFIG.baseURL in api.js
    API_BASE_URL: window.location.origin,  // keep for backward compat
    ENDPOINTS: {
        USERS: '/api/users',
        CARS: '/api/cars',
        HEALTH: '/api/health'
    }
};

// Also make it available globally
window.API_CONFIG = API_CONFIG;

console.log('✅ API_CONFIG loaded with key:', API_CONFIG.apiKey);

// For module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
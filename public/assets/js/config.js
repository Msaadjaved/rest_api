// public/assets/js/config.js
const API_CONFIG = {
    API_KEY: 'test-api-my-key-2026',  // Put your actual API key here
    API_BASE_URL: window.location.origin,
    ENDPOINTS: {
        USERS: '/api/users',
        CARS: '/api/cars',
        HEALTH: '/api/health'
    }
};

// Also make it available globally
window.API_CONFIG = API_CONFIG;

console.log('✅ API_CONFIG loaded with key:', API_CONFIG.API_KEY);

// For module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
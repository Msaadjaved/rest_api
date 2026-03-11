// public/assets/js/config.js
window.config = {
    API_KEY: 'test-api-my-key-2026',  // Must match Render's env var
    API_BASE_URL: window.location.origin,
    ENDPOINTS: {
        USERS: '/api/users',
        CARS: '/api/cars',
        HEALTH: '/api/health'
    }
};
console.log('Config loaded with API key:', window.config.API_KEY);
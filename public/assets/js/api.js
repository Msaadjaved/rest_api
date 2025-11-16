// Centralized API request handler
const API = {
    /**
     * Make an API request
     * @param {string} endpoint - API endpoint (e.g., '/users' or '/users/1')
     * @param {object} options - Fetch options (method, body, etc.)
     * @returns {Promise} - Response data or error
     */
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_CONFIG.apiKey,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            // Handle 204 No Content (successful delete)
            if (response.status === 204) {
                return { success: true };
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Convenience methods
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// Export for use in other files
window.API = API;
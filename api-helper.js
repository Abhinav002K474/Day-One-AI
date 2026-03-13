/**
 * Frontend API Helper with Automatic Error Handling
 * 
 * This utility wraps fetch calls to provide:
 * - Automatic backend connection checks
 * - Clear error messages for users
 * - Retry logic for failed requests
 */

const API = {
    // Base configuration
    baseURL: '', // Relative paths work automatically

    /**
     * Enhanced fetch with error handling
     */
    async fetch(endpoint, options = {}) {
        try {
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || data.error || `Server returned ${response.status}`);
                }

                return data;
            } else {
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }
                return response;
            }

        } catch (error) {
            return this.handleError(error, endpoint);
        }
    },

    /**
     * Centralized error handling
     */
    handleError(error, endpoint) {
        console.error(`API Error [${endpoint}]:`, error);

        // Check if it's a network error (backend down)
        if (error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError') ||
            error.message.includes('ERR_CONNECTION_REFUSED')) {

            this.showBackendDownMessage();
            throw new Error('Backend server is not running. Please start the server.');
        }

        // Other errors
        throw error;
    },

    /**
     * Show user-friendly backend down message
     */
    showBackendDownMessage() {
        const existingModal = document.getElementById('backend-error-modal');
        if (existingModal) return; // Don't show multiple modals

        const modal = document.createElement('div');
        modal.id = 'backend-error-modal';
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            ">
                <div style="
                    background: #1e293b;
                    border: 2px solid #ef4444;
                    border-radius: 12px;
                    padding: 2rem;
                    max-width: 500px;
                    color: white;
                    font-family: 'Outfit', sans-serif;
                ">
                    <h2 style="color: #ef4444; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        ⚠️ Backend Server Not Running
                    </h2>
                    <p style="color: #cbd5e1; line-height: 1.6;">
                        The application cannot connect to the backend server. Please follow these steps:
                    </p>
                    <ol style="color: #94a3b8; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Open XAMPP and start <strong>MySQL</strong></li>
                        <li>Run <code style="background: #334155; padding: 2px 6px; border-radius: 4px;">START_BACKEND.bat</code></li>
                        <li>Wait for "SERVER RUNNING" message</li>
                        <li>Click "Retry" below</li>
                    </ol>
                    <div style="display: flex; gap: 10px; margin-top: 1.5rem;">
                        <button onclick="location.reload()" style="
                            flex: 1;
                            background: #3b82f6;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">
                            🔄 Retry
                        </button>
                        <button onclick="this.closest('#backend-error-modal').remove()" style="
                            background: #334155;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    /**
     * Check if backend is available
     */
    async checkHealth() {
        try {
            const response = await fetch('/health', { method: 'GET' });
            return response.ok;
        } catch {
            return false;
        }
    }
};

// Export for use in other scripts
window.API = API;

/**
 * USAGE EXAMPLES:
 * 
 * // Simple GET request
 * const data = await API.fetch('/api/student/assessments');
 * 
 * // POST request with body
 * const result = await API.fetch('/api/login', {
 *     method: 'POST',
 *     body: JSON.stringify({ email, password })
 * });
 * 
 * // Check backend health before heavy operations
 * if (await API.checkHealth()) {
 *     console.log('Backend is running');
 * }
 */

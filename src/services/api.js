// ================================================================================
// API SERVICE - Central HTTP Client Configuration
// ================================================================================
// This file creates and configures an axios instance for all API calls
// Handles authentication tokens, base URLs, and common error handling

import axios from 'axios';

// ================================================================================
// BASE CONFIGURATION
// ================================================================================

/**
 * Base URL for API
 * - Development: http://localhost:3000/api
 * - Production: Should be set via environment variable
 *
 * WHY: Centralized URL means we only change it in one place
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Create axios instance with default config
 *
 * WHAT THIS DOES:
 * - baseURL: All requests will prepend this URL
 * - withCredentials: Sends cookies with requests (needed for refresh token)
 * - headers: Default headers for all requests
 */
const api = axios.create({
    baseURL: API_BASE_URL,           // Base URL for all requests
    withCredentials: true,            // Send cookies (refresh token) automatically
    headers: {
        'Content-Type': 'application/json'  // Default to JSON
    }
});

// ================================================================================
// TOKEN MANAGEMENT
// ================================================================================

/**
 * Store access token in memory (NOT localStorage for security)
 *
 * WHY IN MEMORY:
 * - Prevents XSS attacks from stealing token
 * - Automatically cleared when user closes tab
 * - Refresh token in httpOnly cookie provides persistence
 */
let accessToken = null;

/**
 * Set access token for API requests
 * Called after login or token refresh
 *
 * @param {String} token - JWT access token from backend
 *
 * USAGE:
 * setAccessToken(loginResponse.data.accessToken)
 */
export const setAccessToken = (token) => {
    accessToken = token;
    // Token will be added to requests via interceptor below
};

/**
 * Get current access token
 *
 * @returns {String|null} Current token or null if not logged in
 *
 * USAGE:
 * const token = getAccessToken()
 * if (!token) redirect to login
 */
export const getAccessToken = () => accessToken;

/**
 * Clear access token (on logout)
 *
 * USAGE:
 * clearAccessToken()
 * // User is now logged out
 */
export const clearAccessToken = () => {
    accessToken = null;
};

// ================================================================================
// REQUEST INTERCEPTOR
// ================================================================================

/**
 * Intercept every request BEFORE it's sent
 * Add authentication token to Authorization header
 *
 * HOW IT WORKS:
 * 1. User makes API call: api.get('/protected')
 * 2. This interceptor runs BEFORE request is sent
 * 3. Adds "Authorization: Bearer <token>" header
 * 4. Request continues to backend
 */
api.interceptors.request.use(
    (config) => {
        // If we have an access token, add it to request
        if (accessToken) {
            // Add Authorization header with Bearer token
            // Backend expects: "Bearer eyJhbGciOiJIUzI1NiIs..."
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;  // Continue with modified request
    },
    (error) => {
        // Request setup failed somehow
        return Promise.reject(error);
    }
);

// ================================================================================
// RESPONSE INTERCEPTOR
// ================================================================================

/**
 * Intercept every response AFTER backend responds
 * Handle token expiration and automatic refresh
 *
 * HOW IT WORKS:
 * 1. Request is made to protected endpoint
 * 2. Backend responds with 401 (token expired)
 * 3. This interceptor catches the 401
 * 4. Automatically calls /auth/refresh to get new token
 * 5. Retries original request with new token
 * 6. User doesn't even notice token was refreshed!
 */
api.interceptors.response.use(
    (response) => {
        // Response is successful (2xx status)
        // Just return it as-is
        return response;
    },
    async (error) => {
        // Response is an error (4xx or 5xx status)

        const originalRequest = error.config;  // Store original request

        /**
         * HANDLE TOKEN EXPIRATION (401 Unauthorized)
         *
         * WHEN THIS HAPPENS:
         * - Access token expired (after 15 minutes)
         * - Backend returns 401
         * - We need to refresh token
         */
        if (error.response?.status === 401 && !originalRequest._retry) {
            // _retry flag prevents infinite loop
            // Without it: refresh fails → retry refresh → retry refresh → ...
            originalRequest._retry = true;

            try {
                /**
                 * STEP 1: REQUEST NEW ACCESS TOKEN
                 *
                 * POST /auth/refresh
                 * - Automatically sends refresh token cookie (withCredentials: true)
                 * - Backend verifies refresh token
                 * - Returns new access token
                 */
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},  // Empty body
                    { withCredentials: true }  // Send refresh token cookie
                );

                /**
                 * STEP 2: SAVE NEW TOKEN
                 *
                 * Backend response: { success: true, data: { accessToken: "..." } }
                 * Extract token and save it
                 */
                const newAccessToken = refreshResponse.data.data.accessToken;
                setAccessToken(newAccessToken);

                /**
                 * STEP 3: RETRY ORIGINAL REQUEST
                 *
                 * Update Authorization header with new token
                 * Retry the request that failed
                 */
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);  // Retry with new token

            } catch (refreshError) {
                /**
                 * REFRESH FAILED
                 *
                 * CAUSES:
                 * - Refresh token expired (after 7 days)
                 * - Refresh token invalid
                 * - User logged out
                 *
                 * ACTION:
                 * - Clear tokens
                 * - Redirect to login
                 */
                clearAccessToken();

                // Redirect to login page
                window.location.href = '/';  // Adjust to your login route

                return Promise.reject(refreshError);
            }
        }

        // Other errors (not 401) - just return them
        return Promise.reject(error);
    }
);

// ================================================================================
// EXPORT API INSTANCE
// ================================================================================

/**
 * Export configured axios instance
 *
 * USAGE IN OTHER FILES:
 *
 * import api from './services/api'
 *
 * // GET request
 * const users = await api.get('/admin/users')
 *
 * // POST request
 * const newUser = await api.post('/admin/users', { email, password })
 *
 * // Protected request (token added automatically)
 * const profile = await api.get('/auth/me')
 */
export default api;

// ================================================================================
// EXAMPLE USAGE
// ================================================================================

/**
 * COMPLETE AUTHENTICATION FLOW:
 *
 * // 1. User logs in
 * const response = await api.post('/auth/login', { email, password })
 * setAccessToken(response.data.data.accessToken)
 *
 * // 2. Access protected resource
 * const profile = await api.get('/auth/me')
 * // Token automatically added via interceptor
 *
 * // 3. Token expires after 15 minutes
 * const data = await api.get('/some/protected/route')
 * // Gets 401 → Automatically refreshes → Retries → Success!
 *
 * // 4. User logs out
 * await api.post('/auth/logout')
 * clearAccessToken()
 */
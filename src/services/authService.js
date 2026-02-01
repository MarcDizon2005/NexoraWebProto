// ================================================================================
// AUTH SERVICE - Authentication API Calls
// ================================================================================
// Handles all authentication-related API requests
// Uses the configured api instance from api.js

import api, { setAccessToken, clearAccessToken, getAccessToken } from './api';

// ================================================================================
// AUTHENTICATION FUNCTIONS
// ================================================================================

/**
 * REGISTER NEW USER
 * POST /auth/register
 *
 * @param {Object} userData - Registration data
 * @param {String} userData.email - User's email
 * @param {String} userData.password - User's password
 * @param {String} userData.role - User role (student/teacher)
 * @returns {Promise} Response with user data
 *
 * BACKEND EXPECTS:
 * {
 *   email: "student@school.edu",
 *   password: "SecurePass123!",
 *   role: "student"  // Optional, defaults to "student"
 * }
 *
 * BACKEND RETURNS:
 * {
 *   success: true,
 *   message: "Registration successful. Please check your email...",
 *   data: {
 *     user: {
 *       id: "uuid",
 *       email: "student@school.edu",
 *       roles: ["student"],
 *       isEmailVerified: false,
 *       status: "PENDING"
 *     }
 *   }
 * }
 *
 * FLOW:
 * 1. User fills registration form
 * 2. Frontend calls this function
 * 3. Backend creates account with PENDING status
 * 4. Backend sends OTP email
 * 5. Frontend redirects to email verification page
 */
export const register = async (userData) => {
    try {
        // Make POST request to /auth/register
        // api.post automatically adds base URL
        // Full URL: http://localhost:3000/api/auth/register
        const response = await api.post('/auth/register', {
            email: userData.email,        // User's email
            password: userData.password,  // Plain text password (backend will hash it)
            role: userData.role || 'student'  // Default to student if not provided
        });

        // Return the response data
        // response.data = { success: true, message: "...", data: { user: {...} } }
        return response.data;

    } catch (error) {
        // API call failed
        // error.response.data = { success: false, message: "Email already registered" }
        throw error.response?.data || { message: 'Registration failed' };
    }
};

/**
 * VERIFY EMAIL WITH OTP
 * POST /otp/verify
 *
 * @param {String} email - User's email
 * @param {String} code - 6-digit OTP code
 * @returns {Promise} Verification result
 *
 * BACKEND EXPECTS:
 * {
 *   email: "student@school.edu",
 *   code: "123456"
 * }
 *
 * BACKEND RETURNS:
 * {
 *   success: true,
 *   message: "Email verified successfully",
 *   data: {
 *     email: "student@school.edu",
 *     isVerified: true
 *   }
 * }
 *
 * WHAT HAPPENS:
 * - Backend verifies code matches
 * - Sets user.isEmailVerified = true
 * - Sets user.status = 'ACTIVE'
 * - User can now login
 */
export const verifyEmail = async (email, code) => {
    try {
        const response = await api.post('/otp/verify', {
            email,  // User's email
            code    // 6-digit code from email
        });

        return response.data;

    } catch (error) {
        // Common errors:
        // - "Invalid verification code"
        // - "Verification code has expired"
        // - "Too many attempts"
        throw error.response?.data || { message: 'Verification failed' };
    }
};

/**
 * RESEND OTP CODE
 * POST /otp/resend
 *
 * @param {String} email - User's email
 * @returns {Promise} Result with new expiration time
 *
 * USE CASE:
 * - User didn't receive code
 * - Code expired
 * - User entered wrong email
 *
 * BACKEND:
 * - Deletes old OTP
 * - Generates new OTP
 * - Sends new email
 */
export const resendOTP = async (email) => {
    try {
        const response = await api.post('/otp/resend', { email });
        return response.data;

    } catch (error) {
        throw error.response?.data || { message: 'Failed to resend code' };
    }
};

/**
 * LOGIN USER
 * POST /auth/login
 *
 * @param {String} email - User's email
 * @param {String} password - User's password
 * @returns {Promise} Response with user data and tokens
 *
 * BACKEND EXPECTS:
 * {
 *   email: "student@school.edu",
 *   password: "SecurePass123!"
 * }
 *
 * BACKEND RETURNS:
 * {
 *   success: true,
 *   message: "Login successful",
 *   data: {
 *     user: {
 *       id: "uuid",
 *       email: "student@school.edu",
 *       roles: ["student"],
 *       isEmailVerified: true
 *     },
 *     accessToken: "eyJhbGciOiJIUzI1NiIs..."
 *   }
 * }
 *
 * ALSO SETS:
 * - Cookie: refreshToken (httpOnly, secure)
 *
 * FLOW:
 * 1. User enters credentials
 * 2. Backend verifies email is verified
 * 3. Backend checks password hash
 * 4. Backend generates access token (15 min) and refresh token (7 days)
 * 5. Access token returned in JSON
 * 6. Refresh token set as httpOnly cookie
 * 7. Frontend saves access token in memory
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        // Extract access token from response
        const { accessToken, user } = response.data.data;

        // Save access token to memory
        // This will be added to all subsequent requests
        setAccessToken(accessToken);

        // Return user data
        return response.data;

    } catch (error) {
        // Common errors:
        // - "Invalid email or password"
        // - "Email not verified" → Redirect to verification
        // - "Account is suspended"
        throw error.response?.data || { message: 'Login failed' };
    }
};

/**
 * LOGOUT USER
 * POST /auth/logout
 *
 * @returns {Promise} Logout result
 *
 * WHAT IT DOES:
 * 1. Clears refresh token cookie (backend)
 * 2. Clears access token from memory (frontend)
 * 3. Redirects to login page
 */
export const logout = async () => {
    try {
        // Call backend logout endpoint
        // This clears the refresh token cookie
        await api.post('/auth/logout');

        // Clear access token from memory
        clearAccessToken();

        return { success: true };

    } catch (error) {
        // Even if backend call fails, still clear local token
        clearAccessToken();
        throw error.response?.data || { message: 'Logout failed' };
    }
};

/**
 * GET CURRENT USER
 * GET /auth/me
 *
 * @returns {Promise} Current user data
 *
 * USE CASE:
 * - Check if user is still logged in
 * - Get fresh user data
 * - Verify token is still valid
 *
 * REQUIRES:
 * - Valid access token in memory
 *
 * BACKEND RETURNS:
 * {
 *   success: true,
 *   data: {
 *     user: {
 *       userId: "uuid",
 *       email: "student@school.edu",
 *       roles: ["student"]
 *     }
 *   }
 * }
 */
export const getCurrentUser = async () => {
    try {
        // Check if we have a token first
        if (!getAccessToken()) {
            throw new Error('Not authenticated');
        }

        const response = await api.get('/auth/me');
        return response.data;

    } catch (error) {
        // Token expired or invalid
        clearAccessToken();
        throw error.response?.data || { message: 'Failed to get user' };
    }
};

/**
 * FORGOT PASSWORD
 * POST /auth/forgot-password
 *
 * @param {String} email - User's email
 * @returns {Promise} Result
 *
 * WHAT IT DOES:
 * - Sends OTP to email for password reset
 * - Returns same message even if email doesn't exist (security)
 */
export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;

    } catch (error) {
        throw error.response?.data || { message: 'Failed to send reset code' };
    }
};

/**
 * RESET PASSWORD
 * POST /auth/reset-password
 *
 * @param {String} email - User's email
 * @param {String} code - OTP code from email
 * @param {String} newPassword - New password
 * @returns {Promise} Result
 *
 * BACKEND EXPECTS:
 * {
 *   email: "student@school.edu",
 *   code: "123456",
 *   newPassword: "NewSecurePass123!"
 * }
 *
 * FLOW:
 * 1. User clicks "Forgot Password"
 * 2. Enters email → forgotPassword() → Receives OTP
 * 3. Enters code + new password → resetPassword()
 * 4. Backend verifies OTP
 * 5. Backend hashes new password
 * 6. Password updated
 * 7. User can login with new password
 */
export const resetPassword = async (email, code, newPassword) => {
    try {
        const response = await api.post('/auth/reset-password', {
            email,
            code,
            newPassword
        });

        return response.data;

    } catch (error) {
        throw error.response?.data || { message: 'Failed to reset password' };
    }
};

/**
 * REFRESH ACCESS TOKEN
 * POST /auth/refresh
 *
 * @returns {Promise} New access token
 *
 * NOTE: This is usually called automatically by the API interceptor
 * You rarely need to call this manually
 *
 * WHEN IT'S USED:
 * - Access token expires (after 15 min)
 * - API interceptor detects 401 response
 * - Automatically calls this function
 * - Gets new access token
 * - Retries original request
 */
export const refreshToken = async () => {
    try {
        // withCredentials: true automatically sends refresh token cookie
        const response = await api.post('/auth/refresh');

        const { accessToken } = response.data.data;
        setAccessToken(accessToken);

        return response.data;

    } catch (error) {
        // Refresh token expired or invalid
        // User must login again
        clearAccessToken();
        throw error.response?.data || { message: 'Session expired' };
    }
};

// ================================================================================
// AUTHENTICATION STATE HELPERS
// ================================================================================

/**
 * Check if user is authenticated
 *
 * @returns {Boolean} True if user has valid token
 *
 * USAGE:
 * if (isAuthenticated()) {
 *   // Show dashboard
 * } else {
 *   // Redirect to login
 * }
 */
export const isAuthenticated = () => {
    return getAccessToken() !== null;
};

/**
 * Get token for manual use (rare)
 *
 * @returns {String|null} Current access token
 *
 * NOTE: Usually you don't need this
 * The API interceptor adds token automatically
 */
export const getToken = () => {
    return getAccessToken();
};

// ================================================================================
// EXPORT ALL FUNCTIONS
// ================================================================================

export default {
    register,
    verifyEmail,
    resendOTP,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    refreshToken,
    isAuthenticated,
    getToken
};
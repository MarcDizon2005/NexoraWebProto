// ================================================================================
// AUTH CONTEXT - Global Authentication State
// ================================================================================
// Provides authentication state and functions to entire app
// Replaces mock user state in App.jsx with real backend integration

import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { toast } from 'sonner';

// ================================================================================
// CREATE CONTEXT
// ================================================================================

/**
 * AuthContext - Stores authentication state
 *
 * PROVIDES:
 * - user: Current user object or null
 * - loading: True while checking auth status
 * - login: Function to log in
 * - logout: Function to log out
 * - register: Function to register
 * - updateUser: Function to update user data
 */
const AuthContext = createContext(null);

// ================================================================================
// AUTH PROVIDER COMPONENT
// ================================================================================

/**
 * AuthProvider - Wraps app and provides auth state
 *
 * USAGE IN MAIN APP:
 *
 * import { AuthProvider } from './contexts/AuthContext'
 *
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {

    // ================================================================================
    // STATE
    // ================================================================================

    /**
     * user - Current authenticated user
     *
     * WHEN NULL: User is not logged in
     * WHEN OBJECT: User is logged in
     *
     * STRUCTURE:
     * {
     *   id: "uuid",
     *   email: "student@school.edu",
     *   firstName: "John",
     *   middleName: "M",
     *   lastName: "Doe",
     *   roles: ["student"],
     *   isEmailVerified: true
     * }
     */
    const [user, setUser] = useState(null);

    /**
     * loading - True while checking if user is logged in
     *
     * PREVENTS:
     * - Flash of login page while checking auth
     * - Race conditions on app load
     *
     * FLOW:
     * 1. App loads → loading = true
     * 2. Check if user has valid token
     * 3. If yes: Fetch user data → loading = false
     * 4. If no: Stay logged out → loading = false
     */
    const [loading, setLoading] = useState(true);

    // ================================================================================
    // INITIALIZATION - Check Auth on App Load
    // ================================================================================

    /**
     * useEffect runs once when app loads
     * Checks if user has valid token and fetches user data
     *
     * WHY:
     * - User might still be logged in from previous session
     * - Refresh token cookie persists across browser restarts
     * - Access token in memory is lost on refresh
     * - This restores the session
     */
    useEffect(() => {
        checkAuth();
    }, []); // Empty array = run once on mount

    /**
     * Check if user is authenticated
     * Called on app load
     */
    const checkAuth = async () => {
        try {
            // Check if we have a token
            if (authService.isAuthenticated()) {
                // Fetch current user data from backend
                // This validates token is still valid
                const response = await authService.getCurrentUser();

                // Set user data in state
                setUser(response.data.user);
            }
        } catch (error) {
            // Token invalid or expired
            // User is not logged in
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            // Done checking
            setLoading(false);
        }
    };

    // ================================================================================
    // AUTHENTICATION FUNCTIONS
    // ================================================================================

    /**
     * LOGIN
     *
     * @param {String} email - User's email
     * @param {String} password - User's password
     * @returns {Promise} Login result
     *
     * FLOW:
     * 1. Call backend login API
     * 2. Backend verifies credentials
     * 3. Backend returns user data + access token
     * 4. Save user to state
     * 5. Token automatically saved by authService
     * 6. User is now logged in
     */
    const login = async (email, password) => {
        try {
            // Call login API
            // authService.login automatically saves token
            const response = await authService.login(email, password);

            // Set user in state
            setUser(response.data.user);

            // Show success message
            toast.success('Login successful!');

            return response;

        } catch (error) {
            // Handle specific error cases

            // Email not verified
            if (error.code === 'EMAIL_NOT_VERIFIED') {
                toast.error('Please verify your email before logging in');
                throw error;
            }

            // Invalid credentials
            toast.error(error.message || 'Login failed');
            throw error;
        }
    };

    /**
     * REGISTER
     *
     * @param {Object} userData - Registration data
     * @returns {Promise} Registration result
     *
     * NOTE: Registration does NOT log user in
     * User must verify email first
     */
    const register = async (userData) => {
        try {
            const response = await authService.register(userData);

            toast.success('Registration successful! Please check your email.');

            return response;

        } catch (error) {
            toast.error(error.message || 'Registration failed');
            throw error;
        }
    };

    /**
     * LOGOUT
     *
     * FLOW:
     * 1. Call backend logout (clears refresh token cookie)
     * 2. Clear user from state
     * 3. Clear access token from memory
     * 4. Redirect to login page
     */
    const logout = async () => {
        try {
            // Call backend logout
            await authService.logout();

            // Clear user from state
            setUser(null);

            toast.info('Logged out successfully');

        } catch (error) {
            // Even if backend call fails, still log out locally
            setUser(null);
            console.error('Logout error:', error);
        }
    };

    /**
     * UPDATE USER
     *
     * @param {Object} updates - Fields to update
     *
     * USAGE:
     * updateUser({ firstName: "Jane", lastName: "Smith" })
     *
     * NOTE: This only updates local state
     * You still need to call the backend API to persist changes
     */
    const updateUser = (updates) => {
        setUser(prev => ({
            ...prev,
            ...updates
        }));
    };

    /**
     * VERIFY EMAIL
     *
     * @param {String} email - User's email
     * @param {String} code - OTP code
     * @returns {Promise} Verification result
     */
    const verifyEmail = async (email, code) => {
        try {
            const response = await authService.verifyEmail(email, code);

            toast.success('Email verified! You can now log in.');

            return response;

        } catch (error) {
            toast.error(error.message || 'Verification failed');
            throw error;
        }
    };

    /**
     * RESEND OTP
     *
     * @param {String} email - User's email
     * @returns {Promise} Resend result
     */
    const resendOTP = async (email) => {
        try {
            const response = await authService.resendOTP(email);

            toast.success('Verification code sent!');

            return response;

        } catch (error) {
            toast.error(error.message || 'Failed to send code');
            throw error;
        }
    };

    /**
     * FORGOT PASSWORD
     *
     * @param {String} email - User's email
     * @returns {Promise} Result
     */
    const forgotPassword = async (email) => {
        try {
            const response = await authService.forgotPassword(email);

            toast.success('Password reset code sent to your email');

            return response;

        } catch (error) {
            toast.error(error.message || 'Failed to send reset code');
            throw error;
        }
    };

    /**
     * RESET PASSWORD
     *
     * @param {String} email - User's email
     * @param {String} code - OTP code
     * @param {String} newPassword - New password
     * @returns {Promise} Result
     */
    const resetPassword = async (email, code, newPassword) => {
        try {
            const response = await authService.resetPassword(email, code, newPassword);

            toast.success('Password reset successful! You can now log in.');

            return response;

        } catch (error) {
            toast.error(error.message || 'Failed to reset password');
            throw error;
        }
    };

    // ================================================================================
    // CONTEXT VALUE
    // ================================================================================

    /**
     * Value provided to all components
     *
     * ACCESSIBLE VIA:
     * const { user, login, logout } = useAuth()
     */
    const value = {
        // State
        user,              // Current user object or null
        loading,           // True while checking auth status
        isAuthenticated: !!user,  // Boolean: is user logged in?

        // Functions
        login,             // Login function
        logout,            // Logout function
        register,          // Register function
        verifyEmail,       // Verify email function
        resendOTP,         // Resend OTP function
        forgotPassword,    // Forgot password function
        resetPassword,     // Reset password function
        updateUser,        // Update user in state
        checkAuth,         // Re-check auth status
    };

    // ================================================================================
    // RENDER
    // ================================================================================

    /**
     * Show loading screen while checking auth
     * Prevents flash of login page
     */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#dc2626] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    /**
     * Provide auth context to entire app
     */
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ================================================================================
// CUSTOM HOOK
// ================================================================================

/**
 * useAuth - Custom hook to access auth context
 *
 * USAGE:
 *
 * import { useAuth } from './contexts/AuthContext'
 *
 * function MyComponent() {
 *   const { user, login, logout } = useAuth()
 *
 *   if (!user) {
 *     return <div>Please log in</div>
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user.email}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   )
 * }
 */
export function useAuth() {
    const context = useContext(AuthContext);

    // Ensure hook is used inside AuthProvider
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}

// ================================================================================
// EXPORT
// ================================================================================

export default AuthContext;
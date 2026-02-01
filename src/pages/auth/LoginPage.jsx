// ================================================================================
// LOGIN PAGE - Real Backend Integration
// ================================================================================
// Updated to use real API calls instead of mock data
// ALL UI/DESIGN PRESERVED - Only logic changed

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

/**
 * LoginPage Component
 *
 * @param {String} role - User role attempting to login (student/teacher/admin)
 * @param {Function} onBack - Navigate back to splash screen
 * @param {Function} onForgotPassword - Navigate to forgot password page
 * @param {Function} onSignUp - Navigate to sign up page
 *
 * CHANGES FROM ORIGINAL:
 * - Uses useAuth() hook instead of prop function
 * - Actually calls backend API
 * - Handles real validation errors
 * - Shows loading states
 * - Handles email verification errors
 */
export function LoginPage({ role, onBack, onForgotPassword, onSignUp }) {

  // ================================================================================
  // HOOKS & STATE
  // ================================================================================

  /**
   * Get auth functions from context
   * Replaces: onLogin prop with real API call
   */
  const { login } = useAuth();

  /**
   * Form state - UNCHANGED from original
   * email: User's email input
   * password: User's password input
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Validation errors - UNCHANGED from original
   * Shows error messages under inputs
   */
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /**
   * Show/hide password - UNCHANGED from original
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Loading state - NEW
   * Shows loading spinner on button while API call in progress
   */
  const [isLoading, setIsLoading] = useState(false);

  // ================================================================================
  // VALIDATION FUNCTIONS - UNCHANGED from original
  // ================================================================================

  /**
   * Validate email format
   * Same validation as original
   */
  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|edu|ph|net|org|gov)$/i;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email with @domain (.com, .edu, .ph, .net, etc.)");
      return false;
    }
    setEmailError("");
    return true;
  };

  /**
   * Validate password
   * Backend does actual validation, but we check it's not empty
   *
   * NOTE: We removed strength validation on login
   * Backend checks the hash, not the strength
   */
  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // ================================================================================
  // INPUT HANDLERS - UNCHANGED from original
  // ================================================================================

  const handleEmailChange = (value) => {
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword(value);
  };

  // ================================================================================
  // FORM VALIDATION - UNCHANGED from original
  // ================================================================================

  const isFormValid = () => {
    return email && password && !emailError && !passwordError;
  };

  // ================================================================================
  // FORM SUBMISSION - UPDATED with real API call
  // ================================================================================

  /**
   * Handle form submission
   *
   * ORIGINAL:
   * - Called onLogin prop with email and password
   * - No error handling
   * - No loading states
   *
   * UPDATED:
   * - Calls real backend API via login() from useAuth
   * - Shows loading state
   * - Handles errors
   * - Handles email not verified case
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check - same as original
    if (!isFormValid()) {
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      /**
       * CALL BACKEND LOGIN API
       *
       * WHAT HAPPENS:
       * 1. authService.login() posts to /auth/login
       * 2. Backend verifies email is verified
       * 3. Backend checks password hash
       * 4. Backend generates tokens
       * 5. Access token returned, saved to memory
       * 6. Refresh token set as httpOnly cookie
       * 7. User data saved to AuthContext
       * 8. User is redirected to dashboard (handled in App.jsx)
       */
      await login(email, password);

      // Success! 
      // AuthContext will update user state
      // App.jsx will see user is logged in and redirect to dashboard
      // No need to manually redirect here

    } catch (error) {
      /**
       * HANDLE ERRORS
       *
       * POSSIBLE ERRORS:
       * 1. Invalid credentials (wrong email or password)
       * 2. Email not verified (user needs to verify)
       * 3. Account suspended
       * 4. Network error
       */

      // Email not verified error
      if (error.code === 'EMAIL_NOT_VERIFIED') {
        setEmailError('Please verify your email before logging in');
        // Could redirect to verification page
        // onEmailVerificationNeeded(email);
      }
      // Invalid credentials
      else if (error.message?.includes('Invalid')) {
        setPasswordError('Invalid email or password');
      }
      // Account suspended
      else if (error.message?.includes('suspended')) {
        setEmailError('Account suspended. Contact administrator.');
      }
      // Generic error
      else {
        setPasswordError(error.message || 'Login failed. Please try again.');
      }

    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  // ================================================================================
  // RENDER - UI UNCHANGED from original
  // ================================================================================

  /**
   * Get role display name
   * Same as original
   */
  const getRoleDisplayName = () => {
    if (role === "student") return "Student";
    if (role === "teacher") return "Teacher";
    if (role === "admin") return "Admin";
    return "";
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#374151] to-[#dc2626] flex flex-col items-center justify-center p-4">

        {/* Back Button - UNCHANGED */}
        <div className="absolute top-8 left-8">
          <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Login Card - UNCHANGED */}
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {getRoleDisplayName()} Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email Input - UNCHANGED */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    className={emailError ? "border-[#dc2626] focus-visible:ring-[#dc2626]" : ""}
                    disabled={isLoading}  // NEW: Disable while loading
                />
                {emailError && (
                    <p className="text-sm text-[#dc2626]">{emailError}</p>
                )}
              </div>

              {/* Password Input - UNCHANGED */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onBlur={() => validatePassword(password)}
                      className={
                        passwordError
                            ? "border-[#dc2626] focus-visible:ring-[#dc2626] pr-10"
                            : "pr-10"
                      }
                      disabled={isLoading}  // NEW: Disable while loading
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}  // NEW: Disable while loading
                  >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                    ) : (
                        <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                    <p className="text-sm text-[#dc2626]">{passwordError}</p>
                )}
              </div>

              {/* Login Button - UPDATED with loading state */}
              <Button
                  type="submit"
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                  disabled={!isFormValid() || isLoading}  // NEW: Disable while loading
              >
                {/* NEW: Show loading spinner or text */}
                {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </>
                ) : (
                    'Login'
                )}
              </Button>

              {/* Forgot Password Button - UNCHANGED */}
              <Button
                  type="button"
                  variant="link"
                  className="w-full text-[#dc2626]"
                  onClick={onForgotPassword}
                  disabled={isLoading}  // NEW: Disable while loading
              >
                Forgot password?
              </Button>

              {/* Sign Up Link - UNCHANGED */}
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={onSignUp}
                    className="text-[#dc2626] hover:underline"
                    disabled={isLoading}  // NEW: Disable while loading
                >
                  Sign up
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}

// ================================================================================
// SUMMARY OF CHANGES
// ================================================================================

/**
 * WHAT STAYED THE SAME:
 * ✓ All UI components (Card, Input, Button, etc.)
 * ✓ All styling and CSS classes
 * ✓ Email validation logic
 * ✓ Password visibility toggle
 * ✓ Form layout and structure
 * ✓ Error display
 *
 * WHAT CHANGED:
 * ✓ Removed onLogin prop, uses useAuth() instead
 * ✓ Added real API call to backend
 * ✓ Added loading state
 * ✓ Added error handling for different cases
 * ✓ Disabled inputs while loading
 * ✓ Shows loading spinner on button
 *
 * HOW IT NOW WORKS:
 * 1. User enters email and password
 * 2. Frontend validates format
 * 3. User clicks Login
 * 4. Shows loading spinner
 * 5. Calls POST /auth/login with credentials
 * 6. Backend verifies email is verified
 * 7. Backend checks password hash
 * 8. Backend returns access token + user data
 * 9. AuthContext saves user state
 * 10. App.jsx sees user is logged in
 * 11. Redirects to appropriate dashboard
 */
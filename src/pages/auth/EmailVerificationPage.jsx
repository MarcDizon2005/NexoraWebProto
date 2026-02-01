// ================================================================================
// EMAIL VERIFICATION PAGE - Real Backend Integration
// ================================================================================
// Verifies user email with 6-digit OTP code
// ALL UI PRESERVED - Only logic updated

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft } from "lucide-react";

/**
 * EmailVerificationPage Component
 *
 * @param {String} email - User's email (from registration)
 * @param {Function} onBack - Navigate back to signup
 * @param {Function} onVerify - Called after successful verification (no longer used, handled by context)
 *
 * BACKEND API:
 * POST /otp/verify
 * Body: { email, code }
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
 * CHANGES FROM ORIGINAL:
 * - Actually calls backend API
 * - Handles real OTP verification
 * - Can resend OTP
 * - Shows countdown timer
 * - Proper error handling
 */
export function EmailVerificationPage({ email, onBack }) {

  // ================================================================================
  // HOOKS & STATE
  // ================================================================================

  /**
   * Get auth functions from context
   */
  const { verifyEmail, resendOTP } = useAuth();

  /**
   * OTP code input
   * 6 digits (e.g., "123456")
   */
  const [code, setCode] = useState("");

  /**
   * Validation error
   */
  const [error, setError] = useState("");

  /**
   * Loading states
   */
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  /**
   * Success state
   * Shows success message after verification
   */
  const [isVerified, setIsVerified] = useState(false);

  /**
   * Resend cooldown timer
   * Prevents spamming resend button
   * Counts down from 60 seconds
   */
  const [resendCountdown, setResendCountdown] = useState(0);

  // ================================================================================
  // EFFECTS
  // ================================================================================

  /**
   * Countdown timer for resend button
   *
   * FLOW:
   * 1. User clicks resend
   * 2. setResendCountdown(60)
   * 3. This effect runs every second
   * 4. Decrements countdown
   * 5. At 0, stops and enables resend button
   */
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);

      // Cleanup timer on unmount
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // ================================================================================
  // VALIDATION
  // ================================================================================

  /**
   * Validate OTP code format
   *
   * RULES:
   * - Must be exactly 6 digits
   * - Only numbers allowed
   */
  const validateCode = (value) => {
    if (!value) {
      return "Verification code is required";
    }
    if (value.length !== 6) {
      return "Code must be 6 digits";
    }
    if (!/^\d{6}$/.test(value)) {
      return "Code must contain only numbers";
    }
    return "";
  };

  // ================================================================================
  // INPUT HANDLER
  // ================================================================================

  /**
   * Handle code input
   *
   * FEATURES:
   * - Only allows numbers
   * - Max 6 digits
   * - Validates on change
   */
  const handleCodeChange = (value) => {
    // Only allow numbers
    const numbersOnly = value.replace(/\D/g, '');

    // Max 6 digits
    const truncated = numbersOnly.slice(0, 6);

    setCode(truncated);

    // Validate
    const validationError = validateCode(truncated);
    setError(validationError);
  };

  // ================================================================================
  // VERIFICATION
  // ================================================================================

  /**
   * Handle verification submission
   *
   * FLOW:
   * 1. Validate code format
   * 2. Call POST /otp/verify
   * 3. Backend checks code matches
   * 4. Backend checks not expired
   * 5. Backend marks user as verified
   * 6. Backend activates account
   * 7. Show success message
   * 8. Redirect to login
   */
  const handleVerify = async (e) => {
    e.preventDefault();

    // Validate
    const validationError = validateCode(code);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      /**
       * CALL BACKEND VERIFICATION API
       *
       * POST /otp/verify
       * Body: { email, code }
       */
      await verifyEmail(email, code);

      // Success!
      setIsVerified(true);

      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/';  // Or use navigation
      }, 3000);

    } catch (error) {
      /**
       * HANDLE ERRORS
       *
       * POSSIBLE ERRORS:
       * 1. Invalid code
       * 2. Expired code
       * 3. Too many attempts
       * 4. User not found
       */

      if (error.message?.includes('Invalid')) {
        setError('Invalid verification code. Please try again.');
      } else if (error.message?.includes('expired')) {
        setError('Code has expired. Please request a new one.');
      } else if (error.message?.includes('attempts')) {
        setError('Too many failed attempts. Please request a new code.');
      } else {
        setError(error.message || 'Verification failed. Please try again.');
      }

    } finally {
      setIsVerifying(false);
    }
  };

  // ================================================================================
  // RESEND OTP
  // ================================================================================

  /**
   * Handle resend OTP request
   *
   * FLOW:
   * 1. Call POST /otp/resend
   * 2. Backend deletes old OTP
   * 3. Backend generates new OTP
   * 4. Backend sends email
   * 5. Start 60 second cooldown
   */
  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setCode("");  // Clear input

    try {
      /**
       * CALL BACKEND RESEND API
       *
       * POST /otp/resend
       * Body: { email }
       */
      await resendOTP(email);

      // Start cooldown (60 seconds)
      setResendCountdown(60);

    } catch (error) {
      setError(error.message || 'Failed to resend code. Please try again.');

    } finally {
      setIsResending(false);
    }
  };

  // ================================================================================
  // RENDER
  // ================================================================================

  /**
   * If verified, show success message
   */
  if (isVerified) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#374151] to-[#dc2626] flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-green-600">
                Email Verified! ✓
              </CardTitle>
              <CardDescription className="text-center">
                Your account has been activated
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Your email has been successfully verified.
                </p>
                <p className="text-sm text-gray-600">
                  Redirecting to login page...
                </p>
              </div>

              {/* Manual redirect button */}
              <Button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white"
              >
                Go to Login Now
              </Button>
            </CardContent>
          </Card>
        </div>
    );
  }

  /**
   * Show verification form
   */
  return (
      <div className="min-h-screen bg-gradient-to-br from-[#374151] to-[#dc2626] flex flex-col items-center justify-center p-4">

        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Verification Card */}
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code sent to your email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">

              {/* Display email */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Verification code sent to:
                </p>
                <p className="font-medium text-[#dc2626]">
                  {email}
                </p>
              </div>

              {/* Code Input */}
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                    id="code"
                    type="text"
                    inputMode="numeric"  // Shows number keyboard on mobile
                    placeholder="000000"
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className={`text-center text-2xl tracking-widest ${error ? "border-[#dc2626]" : ""}`}
                    maxLength={6}
                    disabled={isVerifying || isResending}
                    autoFocus  // Auto-focus for better UX
                />
                {error && (
                    <p className="text-sm text-[#dc2626]">{error}</p>
                )}

                {/* Helper text */}
                <p className="text-xs text-gray-500 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              {/* Verify Button */}
              <Button
                  type="submit"
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                  disabled={code.length !== 6 || isVerifying || isResending}
              >
                {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </>
                ) : (
                    'Verify Email'
                )}
              </Button>

              {/* Resend Code */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>

                {/* Resend button with countdown */}
                {resendCountdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend available in {resendCountdown}s
                    </p>
                ) : (
                    <Button
                        type="button"
                        variant="link"
                        className="text-[#dc2626]"
                        onClick={handleResend}
                        disabled={isVerifying || isResending}
                    >
                      {isResending ? 'Sending...' : 'Resend Code'}
                    </Button>
                )}
              </div>

              {/* Important notes */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> The code expires in 10 minutes. If you don't see the email, check your spam folder.
                </p>
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
 * ✓ All UI components and styling
 * ✓ Card layout
 * ✓ Back button
 * ✓ Input styling
 *
 * WHAT CHANGED:
 * ✓ Added real API integration:
 *   - Calls POST /otp/verify
 *   - Calls POST /otp/resend
 *
 * ✓ Added validation:
 *   - 6 digits required
 *   - Only numbers allowed
 *   - Real-time validation
 *
 * ✓ Added user feedback:
 *   - Loading states
 *   - Error messages
 *   - Success message
 *   - Auto-redirect after success
 *
 * ✓ Added resend functionality:
 *   - Resend OTP button
 *   - 60 second cooldown
 *   - Countdown timer display
 *
 * ✓ Better UX:
 *   - Number keyboard on mobile
 *   - Auto-focus code input
 *   - Max length enforcement
 *   - Code expiration notice
 *
 * HOW IT NOW WORKS:
 * 1. User registers account
 * 2. Redirected to this page with their email
 * 3. User receives email with 6-digit code
 * 4. User enters code
 * 5. Frontend validates format
 * 6. Calls POST /otp/verify with email + code
 * 7. Backend verifies code matches
 * 8. Backend checks not expired (<10 min)
 * 9. Backend activates account
 * 10. Shows success message
 * 11. Auto-redirects to login (or manual click)
 * 12. User can now login with their credentials
 *
 * ERROR HANDLING:
 * - Invalid code: "Please try again"
 * - Expired code: "Request a new one"
 * - Too many attempts: "Request a new code"
 * - Can resend code with cooldown
 */
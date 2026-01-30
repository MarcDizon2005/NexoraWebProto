import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

interface ForgotPasswordPageProps {
  onBack: () => void;
  onReset: (email: string, code: string, newPassword: string) => void;
}

export function ForgotPasswordPage({ onBack, onReset }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateEmail = (value: string) => {
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

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(value)) {
      setPasswordError("Must include 1 uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(value)) {
      setPasswordError("Must include 1 lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(value)) {
      setPasswordError("Must include 1 number");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError("Must include 1 special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (value !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code];
      pastedData.split('').forEach((digit, i) => {
        if (i < 6) newCode[i] = digit;
      });
      setCode(newCode);
    }
  };

  const handleSendCode = () => {
    if (validateEmail(email)) {
      setStep('verify');
      // Here you would trigger sending the verification code
      console.log("Sending verification code to:", email);
    }
  };

  const isCodeComplete = code.every(digit => digit !== "");
  const isPasswordValid = !passwordError && newPassword && !confirmPasswordError && confirmPassword;

  const handleSubmit = () => {
    if (isCodeComplete && isPasswordValid) {
      onReset(email, code.join(""), newPassword);
    }
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    validatePassword(value);
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    validateConfirmPassword(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dc2626] via-[#991b1b] to-[#374151] flex flex-col items-center justify-center p-4">
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

      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {step === 'email' 
              ? "Enter your email to receive a verification code"
              : "Enter the code and create a new password"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'email' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  className={emailError ? "border-[#dc2626]" : ""}
                />
                {emailError && (
                  <p className="text-sm text-[#dc2626]">{emailError}</p>
                )}
              </div>

              <Button
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                onClick={handleSendCode}
                disabled={!email || !!emailError}
              >
                Send Verification Code
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-center block">Verification Code</Label>
                <p className="text-sm text-muted-foreground text-center mb-2">
                  Code sent to {email}
                </p>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      disabled={!isCodeComplete}
                      className={passwordError ? "border-[#dc2626] pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={!isCodeComplete}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-[#dc2626]">{passwordError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Re-enter Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      disabled={!isCodeComplete}
                      className={confirmPasswordError ? "border-[#dc2626] pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={!isCodeComplete}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-sm text-[#dc2626]">{confirmPasswordError}</p>
                  )}
                  {!confirmPasswordError && confirmPassword && newPassword === confirmPassword && (
                    <p className="text-sm text-green-600">✓ Passwords match</p>
                  )}
                </div>
              </div>

              <Button
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                onClick={handleSubmit}
                disabled={!isCodeComplete || !isPasswordValid}
              >
                Reset Password
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

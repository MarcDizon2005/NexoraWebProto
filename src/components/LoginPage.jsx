import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export function LoginPage({ role, onBack, onLogin, onForgotPassword, onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(value)) {
      setPasswordError("Password must include at least 1 uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(value)) {
      setPasswordError("Password must include at least 1 lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(value)) {
      setPasswordError("Password must include at least 1 number");
      return false;
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
      setPasswordError("Password must include at least 1 special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword(value);
  };

  const isFormValid = () => {
    return email && password && !emailError && !passwordError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#374151] to-[#dc2626] flex flex-col items-center justify-center p-4">
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

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {role === "student" ? "Student" : role === "teacher" ? "Teacher" : "Admin"} Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
              {emailError && (
                <p className="text-sm text-[#dc2626]">{emailError}</p>
              )}
            </div>

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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

            <Button
              type="submit"
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white"
              disabled={!isFormValid()}
            >
              Login
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full text-[#dc2626]"
              onClick={onForgotPassword}
            >
              Forgot password?
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSignUp}
                className="text-[#dc2626] hover:underline"
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

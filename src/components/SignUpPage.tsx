import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

interface SignUpPageProps {
  role: 'student' | 'teacher' | 'admin';
  onBack: () => void;
  onSignUp: (data: SignUpData) => void;
  onLogin: () => void;
}

export interface SignUpData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
}

export function SignUpPage({ role, onBack, onSignUp, onLogin }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (value: string, field: string) => {
    if (!value && field !== 'middleName') {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
    }
    if (value && /[0-9!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Name cannot contain numbers or special characters";
    }
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|edu|ph|net|org|gov)$/i;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email with @domain (.com, .edu, .ph, .net, etc.)";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Must include 1 uppercase letter";
    }
    if (!/[a-z]/.test(value)) {
      return "Must include 1 lowercase letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Must include 1 number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Must include 1 special character";
    }
    return "";
  };

  const validateConfirmPassword = (value: string, password: string) => {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    let error = "";
    if (field === 'firstName' || field === 'middleName' || field === 'lastName') {
      error = validateName(value, field);
    } else if (field === 'email') {
      error = validateEmail(value);
    } else if (field === 'password') {
      error = validatePassword(value);
      // Also revalidate confirm password if it has a value
      if (formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
        }));
      }
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(value, formData.password);
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormValid = () => {
    const noErrors = Object.entries(errors).every(([key, value]) => {
      if (key === 'middleName') return true; // Middle name is optional
      return value === "";
    });
    
    const allFieldsFilled = formData.firstName && formData.lastName && 
      formData.email && formData.password && formData.confirmPassword;
    
    return noErrors && allFieldsFilled;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSignUp({
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role,
      });
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

      <Card className="w-full max-w-md shadow-lg my-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {role === 'student' ? 'Student' : role === 'teacher' ? 'Teacher' : 'Admin'} Sign Up
          </CardTitle>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                className={errors.firstName ? "border-[#dc2626]" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-[#dc2626]">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name (Optional)</Label>
              <Input
                id="middleName"
                placeholder="Michael"
                value={formData.middleName}
                onChange={(e) => handleFieldChange('middleName', e.target.value)}
                className={errors.middleName ? "border-[#dc2626]" : ""}
              />
              {errors.middleName && (
                <p className="text-sm text-[#dc2626]">{errors.middleName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                className={errors.lastName ? "border-[#dc2626]" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-[#dc2626]">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={errors.email ? "border-[#dc2626]" : ""}
              />
              {errors.email && (
                <p className="text-sm text-[#dc2626]">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  className={errors.password ? "border-[#dc2626] pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-[#dc2626]">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Re-enter Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? "border-[#dc2626] pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-[#dc2626]">{errors.confirmPassword}</p>
              )}
              {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-sm text-green-600">✓ Passwords match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white"
              disabled={!isFormValid()}
            >
              Sign Up
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLogin}
                className="text-[#dc2626] hover:underline"
              >
                Login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
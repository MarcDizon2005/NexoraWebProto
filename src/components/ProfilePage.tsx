import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { User, Camera, Eye, EyeOff, LogOut } from "lucide-react";

interface ProfilePageProps {
  userData: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    profilePicture?: string;
  };
  onSave: (data: ProfileFormData) => void;
  onCancel: () => void;
  onLogout: () => void;
}

export interface ProfileFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  profilePicture?: string;
  currentPassword?: string;
  newPassword?: string;
}

export function ProfilePage({ userData, onSave, onCancel, onLogout }: ProfilePageProps) {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    middleName: userData.middleName,
    lastName: userData.lastName,
    profilePicture: userData.profilePicture || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutDialog(false);
    onLogout();
  };

  const validateName = (value: string, field: string) => {
    if (!value && field !== 'middleName') {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
    }
    if (value && /[0-9!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Name cannot contain numbers or special characters";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value && isChangingPassword) {
      return "Password is required";
    }
    if (value && value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (value && !/[A-Z]/.test(value)) {
      return "Must include 1 uppercase letter";
    }
    if (value && !/[a-z]/.test(value)) {
      return "Must include 1 lowercase letter";
    }
    if (value && !/[0-9]/.test(value)) {
      return "Must include 1 number";
    }
    if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Must include 1 special character";
    }
    return "";
  };

  const validateConfirmPassword = (value: string) => {
    if (isChangingPassword && !value) {
      return "Please confirm your password";
    }
    if (value && value !== formData.newPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    let error = "";
    if (field === 'firstName' || field === 'middleName' || field === 'lastName') {
      error = validateName(value, field);
    } else if (field === 'newPassword') {
      error = validatePassword(value);
      if (formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: validateConfirmPassword(formData.confirmPassword)
        }));
      }
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(value);
    } else if (field === 'currentPassword') {
      error = value && !isChangingPassword ? "" : "";
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    const noNameErrors = !errors.firstName && !errors.lastName;
    const namesFilled = formData.firstName && formData.lastName;
    
    if (isChangingPassword) {
      const noPasswordErrors = !errors.currentPassword && !errors.newPassword && !errors.confirmPassword;
      const passwordsFilled = formData.currentPassword && formData.newPassword && formData.confirmPassword;
      return noNameErrors && namesFilled && noPasswordErrors && passwordsFilled;
    }
    
    return noNameErrors && namesFilled;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSave({
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        profilePicture: formData.profilePicture,
        currentPassword: isChangingPassword ? formData.currentPassword : undefined,
        newPassword: isChangingPassword ? formData.newPassword : undefined,
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Hello! {userData.firstName} {userData.lastName}</h1>
        <p className="text-muted-foreground">
          Manage your account information and security settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#dc2626] flex items-center justify-center overflow-hidden">
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <label 
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#dc2626] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#b91c1c] transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium">Upload a new photo</p>
              <p className="text-sm text-muted-foreground">JPG, PNG or GIF (max. 5MB)</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
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
                  value={formData.middleName}
                  onChange={(e) => handleFieldChange('middleName', e.target.value)}
                  className={errors.middleName ? "border-[#dc2626]" : ""}
                />
                {errors.middleName && (
                  <p className="text-sm text-[#dc2626]">{errors.middleName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
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
                value={userData.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                disabled
                className="bg-gray-100 cursor-not-allowed capitalize"
              />
              <p className="text-xs text-muted-foreground">Role cannot be changed</p>
            </div>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              {isChangingPassword ? "Enter your current password and create a new one" : "Change your password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isChangingPassword ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChangingPassword(true)}
                className="w-full"
              >
                Change Password
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={formData.currentPassword}
                      onChange={(e) => handleFieldChange('currentPassword', e.target.value)}
                      className={errors.currentPassword ? "border-[#dc2626] pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-[#dc2626]">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Create a new password"
                      value={formData.newPassword}
                      onChange={(e) => handleFieldChange('newPassword', e.target.value)}
                      className={errors.newPassword ? "border-[#dc2626] pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-[#dc2626]">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
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
                  {!errors.confirmPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                    <p className="text-sm text-green-600">✓ Passwords match</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setFormData(prev => ({
                      ...prev,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }));
                    setErrors(prev => ({
                      ...prev,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }));
                  }}
                  className="w-full"
                >
                  Cancel Password Change
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white"
            disabled={!isFormValid()}
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleLogoutClick}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </form>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your session and log you out of the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
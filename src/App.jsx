import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { EmailVerificationPage } from './components/EmailVerificationPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { DashboardLayout } from './components/DashboardLayout';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfilePage } from './components/ProfilePage';
import { NotificationsPage } from './components/NotificationsPage';
import { MessagesPage } from './components/MessagesPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [selectedRole, setSelectedRole] = useState('student');
  const [user, setUser] = useState(null);
  const [tempEmail, setTempEmail] = useState('');
  const [tempSignUpData, setTempSignUpData] = useState(null);

  // Mock user data
  const mockUsers = {
    student: {
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Doe',
      email: 'john.doe@student.edu',
      role: 'student',
    },
    teacher: {
      firstName: 'Sarah',
      middleName: 'Ann',
      lastName: 'Johnson',
      email: 'sarah.johnson@teacher.edu',
      role: 'teacher',
    },
    admin: {
      firstName: 'Admin',
      middleName: '',
      lastName: 'User',
      email: 'admin@nexora.edu',
      role: 'admin',
    },
  };

  // Navigation handlers
  const handleRoleSelection = (role, action) => {
    setSelectedRole(role);
    setCurrentPage(action);
  };

  const handleLogin = (email, password) => {
    console.log('Login attempt:', { email, password, role: selectedRole });
    setUser(mockUsers[selectedRole]);
    setCurrentPage('dashboard');
    toast.success('Login successful!');
  };

  const handleSignUp = (data) => {
    console.log('Sign up attempt:', data);
    setTempEmail(data.email);
    setTempSignUpData(data);
    setCurrentPage('emailVerification');
    toast.success('Verification code sent to your email!');
  };

  const handleEmailVerification = (code) => {
    console.log('Verification code:', code);

    if (tempSignUpData) {
      setUser({
        firstName: tempSignUpData.firstName,
        middleName: tempSignUpData.middleName,
        lastName: tempSignUpData.lastName,
        email: tempSignUpData.email,
        role: tempSignUpData.role,
      });
      setCurrentPage('login');
      toast.success('Email verified! Account created successfully.');
      setTempSignUpData(null);
      setTempEmail('');
    }
  };

  const handlePasswordReset = (email, code, newPassword) => {
    console.log('Password reset:', { email, code, newPassword });
    setCurrentPage('login');
    toast.success('Password reset successfully!');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('splash');
    toast.info('Logged out successfully');
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleProfileSave = (data) => {
    if (user) {
      setUser({
        ...user,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        profilePicture: data.profilePicture,
      });
      setCurrentPage('dashboard');
      toast.success('Profile updated successfully!');
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderDashboardContent = () => {
    if (!user) return null;

    if (currentPage === 'dashboard') {
      switch (user.role) {
        case 'student':
          return <StudentDashboard />;
        case 'teacher':
          return <TeacherDashboard />;
        case 'admin':
          return <AdminDashboard />;
        default:
          return <StudentDashboard />;
      }
    }

    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-4 capitalize">{currentPage}</h1>
          <div className="bg-white rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">
              This page is under development. Content for "{currentPage}" will be added here.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen onSelectRole={handleRoleSelection} />;

      case 'login':
        return (
          <LoginPage
            role={selectedRole}
            onBack={() => setCurrentPage('splash')}
            onLogin={handleLogin}
            onForgotPassword={() => setCurrentPage('forgotPassword')}
            onSignUp={() => setCurrentPage('signup')}
          />
        );

      case 'signup':
        return (
          <SignUpPage
            role={selectedRole}
            onBack={() => setCurrentPage('splash')}
            onSignUp={handleSignUp}
            onLogin={() => setCurrentPage('login')}
          />
        );

      case 'emailVerification':
        return (
          <EmailVerificationPage
            email={tempEmail}
            onBack={() => setCurrentPage('signup')}
            onVerify={handleEmailVerification}
          />
        );

      case 'forgotPassword':
        return (
          <ForgotPasswordPage
            onBack={() => setCurrentPage('login')}
            onReset={handlePasswordReset}
          />
        );

      case 'profile':
        return user ? (
          <DashboardLayout
            role={user.role}
            userName={`${user.firstName} ${user.lastName}`}
            currentPage="profile"
            onNavigate={handleNavigation}
            onProfile={handleProfileClick}
            onNotifications={() => setCurrentPage('notifications')}
            onMessages={() => setCurrentPage('messages')}
          >
            <ProfilePage
              userData={user}
              onSave={handleProfileSave}
              onCancel={() => setCurrentPage('dashboard')}
              onLogout={handleLogout}
            />
          </DashboardLayout>
        ) : null;

      case 'notifications':
      case 'messages':
      case 'dashboard':
      default:
        if (!user) return <SplashScreen onSelectRole={handleRoleSelection} />;

        return (
          <DashboardLayout
            role={user.role}
            userName={`${user.firstName} ${user.lastName}`}
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onProfile={handleProfileClick}
            onNotifications={() => setCurrentPage('notifications')}
            onMessages={() => setCurrentPage('messages')}
          >
            {renderDashboardContent()}
          </DashboardLayout>
        );
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;

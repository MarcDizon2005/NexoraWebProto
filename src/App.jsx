import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './hooks/useAuth'

import DashboardLayout from './layouts/DashboardLayout'

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const EmailVerificationPage = lazy(() => import('./pages/auth/EmailVerificationPage'))
const StudentDashboard = lazy(() => import('./pages/dashboard/StudentDashboard'))
const TeacherDashboard = lazy(() => import('./pages/dashboard/TeacherDashboard'))
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const SplashScreen = lazy(() => import('./components/SplashScreen'))

const PageLoader = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
)

function SplashWrapper() {
    const navigate = useNavigate()

    const handleSelectRole = (role, action) => {
        if (action === "login") {
            navigate("/login", { state: { role } })
        } else {
            navigate("/signup", { state: { role } })
        }
    }

    return <SplashScreen onSelectRole={handleSelectRole} />
}

function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="/splash" element={<SplashWrapper />} />

                <Route element={<DashboardLayout />}>
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/splash" replace />} />
            </Routes>
        </Suspense>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App

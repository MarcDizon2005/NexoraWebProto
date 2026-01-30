import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  role: 'student' | 'teacher' | 'admin';
  userName: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onProfile: () => void;
  onNotifications: () => void;
  onMessages: () => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  role,
  userName,
  currentPage,
  onNavigate,
  onProfile,
  onNotifications,
  onMessages,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <TopBar
        userName={userName}
        userRole={role}
        onProfile={onProfile}
        onNotifications={onNotifications}
        onMessages={onMessages}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          role={role}
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
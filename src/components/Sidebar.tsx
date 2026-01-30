import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart3,
  Calendar,
  FolderOpen,
  MessageCircle,
  Award,
  Settings,
  Users,
  Shield,
  FileBarChart,
  ScrollText,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  role: 'student' | 'teacher' | 'admin';
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationConfig = {
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: ClipboardList },
    { id: 'grades', label: 'Grades', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
    { id: 'discussions', label: 'Discussions', icon: MessageCircle },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  teacher: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'My Classes', icon: GraduationCap },
    { id: 'content', label: 'Course Content', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: ClipboardList },
    { id: 'gradebook', label: 'Gradebook', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'discussions', label: 'Discussions', icon: MessageCircle },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'logs', label: 'Logs', icon: ScrollText },
  ],
};

export function Sidebar({ role, currentPage, onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = navigationConfig[role];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-4 py-3 rounded-none hover:bg-[#374151] text-white",
                isActive && "bg-[#dc2626] hover:bg-[#dc2626]",
                isCollapsed && "justify-center px-2"
              )}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileOpen(false);
              }}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-white")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden text-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-[#1f2937] border-r border-[#374151] z-40 transition-transform md:hidden",
          "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-[#374151]">
          <h2 className="text-white text-xl">Menu</h2>
        </div>
        <SidebarContent />
      </aside>

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden md:block bg-[#1f2937] border-r border-[#374151] transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Collapse Toggle */}
          <div className="h-16 flex items-center justify-end px-4 border-b border-[#374151]">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#374151]"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}

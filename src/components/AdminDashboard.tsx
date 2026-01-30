import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Crown,
  GraduationCap,
  UserCircle
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

export function AdminDashboard() {
  const systemMetrics = [
    { id: 1, label: "Total Users", value: 1247, change: "+12%", icon: Users },
    { id: 2, label: "Active Courses", value: 45, change: "+3", icon: BookOpen },
    { id: 3, label: "System Uptime", value: "99.8%", change: "Stable", icon: Activity },
    { id: 4, label: "User Growth", value: "+156", change: "This month", icon: UserPlus },
  ];

  const sampleUsers = [
    // Principal (only 1 allowed)
    { 
      id: 1, 
      name: "Jeniffer Verzosa", 
      email: "jeniffer.verzosa@nexora.edu", 
      role: "Principal", 
      status: "Active",
      joinDate: "Jan 2023"
    },
    // Teachers
    { 
      id: 2, 
      name: "Prof. James Chen", 
      email: "james.chen@nexora.edu", 
      role: "Teacher", 
      status: "Active",
      joinDate: "Mar 2023"
    },
    { 
      id: 3, 
      name: "Dr. Sarah Johnson", 
      email: "sarah.johnson@nexora.edu", 
      role: "Teacher", 
      status: "Active",
      joinDate: "Feb 2023"
    },
    { 
      id: 4, 
      name: "Prof. Michael Brown", 
      email: "michael.brown@nexora.edu", 
      role: "Teacher", 
      status: "Active",
      joinDate: "Apr 2023"
    },
    { 
      id: 5, 
      name: "Dr. Emily Davis", 
      email: "emily.davis@nexora.edu", 
      role: "Teacher", 
      status: "Active",
      joinDate: "May 2023"
    },
    // Students
    { 
      id: 6, 
      name: "Marc Dustin Dizon", 
      email: "marc.dizon@student.nexora.edu", 
      role: "Student", 
      status: "Active",
      joinDate: "Aug 2024"
    },
    { 
      id: 7, 
      name: "Emma Wilson", 
      email: "emma.wilson@student.nexora.edu", 
      role: "Student", 
      status: "Active",
      joinDate: "Aug 2024"
    },
    { 
      id: 8, 
      name: "Liam Thompson", 
      email: "liam.thompson@student.nexora.edu", 
      role: "Student", 
      status: "Active",
      joinDate: "Sep 2024"
    },
    { 
      id: 9, 
      name: "Olivia Garcia", 
      email: "olivia.garcia@student.nexora.edu", 
      role: "Student", 
      status: "Active",
      joinDate: "Aug 2024"
    },
    { 
      id: 10, 
      name: "Noah Anderson", 
      email: "noah.anderson@student.nexora.edu", 
      role: "Student", 
      status: "Active",
      joinDate: "Sep 2024"
    },
  ];

  const getRoleIcon = (role: string) => {
    switch(role) {
      case "Principal":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "Teacher":
        return <GraduationCap className="w-4 h-4 text-[#dc2626]" />;
      case "Student":
        return <UserCircle className="w-4 h-4 text-[#374151]" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case "Principal":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Teacher":
        return "bg-red-100 text-red-800 border-red-300";
      case "Student":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const userBreakdown = [
    { role: "Students", count: 1050, percentage: 84, color: "#dc2626" },
    { role: "Teachers", count: 180, percentage: 14, color: "#374151" },
    { role: "Admins", count: 17, percentage: 2, color: "#6b7280" },
  ];

  const recentActivities = [
    { id: 1, action: "New course created", user: "Dr. Sarah Johnson", time: "2 minutes ago", type: "success" },
    { id: 2, action: "User account deactivated", user: "Admin Mike", time: "15 minutes ago", type: "warning" },
    { id: 3, action: "System backup completed", user: "System", time: "1 hour ago", type: "success" },
    { id: 4, action: "Failed login attempts detected", user: "Security", time: "2 hours ago", type: "error" },
    { id: 5, action: "New teacher account approved", user: "Admin Lisa", time: "3 hours ago", type: "success" },
  ];

  const courseStats = [
    { id: 1, name: "Computer Science", courses: 12, students: 450, growth: "+8%" },
    { id: 2, name: "Mathematics", courses: 8, students: 320, growth: "+5%" },
    { id: 3, name: "Physics", courses: 6, students: 180, growth: "+3%" },
    { id: 4, name: "Chemistry", courses: 5, students: 150, growth: "+2%" },
  ];

  const systemAlerts = [
    { id: 1, message: "Database backup scheduled for tonight", priority: "info" },
    { id: 2, message: "3 teacher accounts pending approval", priority: "warning" },
    { id: 3, message: "Server storage at 75% capacity", priority: "warning" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and management console
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* User Management List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Detailed user list by role (Principal, Teachers, Students)</CardDescription>
                </div>
                <Button className="bg-[#dc2626] hover:bg-[#b91c1c]">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm border-b">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Status</div>
                </div>
                
                {/* User Rows */}
                {sampleUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="grid grid-cols-12 gap-4 p-3 border-b hover:bg-gray-50 transition-colors items-center"
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">Joined {user.joinDate}</p>
                      </div>
                    </div>
                    <div className="col-span-4 text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="col-span-2">
                      <Badge 
                        variant="outline" 
                        className={getRoleBadgeColor(user.role)}
                      >
                        {user.role}
                        {user.role === "Principal" && (
                          <span className="ml-1 text-xs">(1/1)</span>
                        )}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary Footer */}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <p className="text-xs font-medium text-yellow-800">Principal</p>
                    </div>
                    <p className="text-lg font-bold text-yellow-900">1 <span className="text-xs font-normal">(Max: 1)</span></p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-red-600" />
                      <p className="text-xs font-medium text-red-800">Teachers</p>
                    </div>
                    <p className="text-lg font-bold text-red-900">4</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <UserCircle className="w-4 h-4 text-gray-600" />
                      <p className="text-xs font-medium text-gray-800">Students</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
              <CardDescription>Overview of courses by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseStats.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dept.courses} courses • {dept.students} students
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {dept.growth}
                      </span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2">
                    <div className="mt-1">
                      {activity.type === "success" && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {activity.type === "warning" && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                      {activity.type === "error" && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-[#dc2626] hover:bg-[#b91c1c]">
                Add New User
              </Button>
              <Button className="w-full" variant="outline">
                Create Course
              </Button>
              <Button className="w-full" variant="outline">
                View Reports
              </Button>
              <Button className="w-full" variant="outline">
                System Settings
              </Button>
              <Button className="w-full" variant="outline">
                View All Logs
              </Button>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.priority === "warning" 
                        ? "bg-orange-50 border-orange-500" 
                        : "bg-blue-50 border-blue-500"
                    }`}
                  >
                    <p className="text-sm">{alert.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Daily Active Users</span>
                <span className="text-sm font-medium">892</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Session Time</span>
                <span className="text-sm font-medium">45 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Course Completion</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Server Load</span>
                <span className="text-sm font-medium text-green-600">Normal</span>
              </div>
              <Button className="w-full mt-2" variant="outline" size="sm">
                View Full Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
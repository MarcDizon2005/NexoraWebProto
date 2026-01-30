import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Progress } from "./ui/progress";

export function TeacherDashboard() {
  const classes = [
    { id: 1, name: "CS101 - Introduction to Programming", students: 45, color: "#dc2626" },
    { id: 2, name: "CS201 - Data Structures", students: 38, color: "#dc2626" },
    { id: 3, name: "CS301 - Web Development", students: 52, color: "#dc2626" },
  ];

  const pendingSubmissions = [
    { id: 1, assignment: "Assignment 3: Sorting Algorithms", course: "CS201", pending: 12, total: 38 },
    { id: 2, assignment: "Quiz 2: OOP Concepts", course: "CS101", pending: 8, total: 45 },
    { id: 3, assignment: "Project: E-commerce Website", course: "CS301", pending: 15, total: 52 },
  ];

  const studentProgress = [
    { id: 1, name: "John Smith", course: "CS101", progress: 85, status: "On Track" },
    { id: 2, name: "Sarah Johnson", course: "CS201", progress: 92, status: "Excellent" },
    { id: 3, name: "Mike Davis", course: "CS301", progress: 65, status: "Needs Support" },
    { id: 4, name: "Emma Wilson", course: "CS101", progress: 78, status: "On Track" },
  ];

  const announcements = [
    { id: 1, title: "Midterm exam schedule posted", class: "CS101", date: "2 hours ago" },
    { id: 2, title: "New assignment materials uploaded", class: "CS201", date: "5 hours ago" },
    { id: 3, title: "Office hours changed for this week", class: "All Classes", date: "1 day ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-2">Welcome back, Teacher!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your classes and student activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">135</div>
            <p className="text-xs text-muted-foreground">Across 3 classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">Submissions to review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">Assignment completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Hours</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Class Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Class Overview</CardTitle>
              <CardDescription>Your active classes this semester</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">{cls.students} students enrolled</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Class
                    </Button>
                    <Button size="sm" className="bg-[#dc2626] hover:bg-[#b91c1c]">
                      Grade
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submissions to Grade */}
          <Card>
            <CardHeader>
              <CardTitle>Submissions to Grade</CardTitle>
              <CardDescription>Pending assignments and quizzes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{submission.assignment}</p>
                      <p className="text-sm text-muted-foreground">{submission.course}</p>
                    </div>
                    <Button size="sm" variant="outline">Grade</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(submission.total - submission.pending) / submission.total * 100} 
                      className="h-2"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {submission.total - submission.pending}/{submission.total}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Student Progress Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>Recent student performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentProgress.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.course}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {student.status === "Needs Support" ? (
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm">{student.progress}%</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.status === "Excellent" ? "bg-green-100 text-green-700" :
                        student.status === "On Track" ? "bg-blue-100 text-blue-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {student.status}
                      </span>
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
                Create Assignment
              </Button>
              <Button className="w-full" variant="outline">
                Schedule Quiz
              </Button>
              <Button className="w-full" variant="outline">
                Post Announcement
              </Button>
              <Button className="w-full" variant="outline">
                Upload Materials
              </Button>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="space-y-1">
                    <p className="text-sm font-medium">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {announcement.class} • {announcement.date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-sm font-medium text-[#dc2626]">9:00 AM</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">CS101 Lecture</p>
                    <p className="text-xs text-muted-foreground">Room 301</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-sm font-medium text-[#dc2626]">11:00 AM</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Office Hours</p>
                    <p className="text-xs text-muted-foreground">Office 205</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-sm font-medium text-[#dc2626]">2:00 PM</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">CS301 Lab</p>
                    <p className="text-xs text-muted-foreground">Computer Lab A</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { BookOpen, FileText, Clock, Award } from "lucide-react";
import { useState } from "react";

export function StudentDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const courses = [
    { id: 1, name: "Introduction to Computer Science", progress: 75, color: "#dc2626" },
    { id: 2, name: "Data Structures and Algorithms", progress: 60, color: "#dc2626" },
    { id: 3, name: "Web Development Fundamentals", progress: 90, color: "#dc2626" },
    { id: 4, name: "Database Management Systems", progress: 45, color: "#dc2626" },
  ];

  const upcomingDeadlines = [
    { id: 1, title: "CS101 - Assignment 3", dueDate: "Jan 30, 2026", type: "Assignment" },
    { id: 2, title: "DSA - Quiz 2", dueDate: "Feb 1, 2026", type: "Quiz" },
    { id: 3, title: "Web Dev - Final Project", dueDate: "Feb 5, 2026", type: "Project" },
  ];

  const announcements = [
    { id: 1, title: "Midterm Exam Schedule Released", date: "Jan 27, 2026", course: "All Courses" },
    { id: 2, title: "New Learning Materials Available", date: "Jan 26, 2026", course: "Web Development" },
    { id: 3, title: "Office Hours This Week", date: "Jan 25, 2026", course: "Data Structures" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-2">Welcome back, Student!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your courses today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Your progress in enrolled courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{course.name}</p>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground">{deadline.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#dc2626]">{deadline.dueDate}</p>
                      <Button size="sm" variant="outline" className="mt-1">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="space-y-1">
                    <p className="text-sm font-medium">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {announcement.course} • {announcement.date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

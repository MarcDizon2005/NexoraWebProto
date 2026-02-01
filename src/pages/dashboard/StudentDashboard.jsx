import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const StudentDashboard = () => {
  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5</p>
              <p className="text-gray-600">Active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p>
              <p className="text-gray-600">Pending assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">85%</p>
              <p className="text-gray-600">Overall performance</p>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default StudentDashboard

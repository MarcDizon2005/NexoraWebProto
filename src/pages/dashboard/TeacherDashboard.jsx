import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TeacherDashboard = () => {
  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">4</p>
              <p className="text-gray-600">Active classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">120</p>
              <p className="text-gray-600">Total students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">15</p>
              <p className="text-gray-600">Assignments to grade</p>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default TeacherDashboard

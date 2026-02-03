import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || user.email?.split('@')[0] || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <div className="text-sm self-center text-muted-foreground">
                  Role: <span className="font-semibold capitalize">{user?.roles?.[0]}</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}

export default ProfilePage

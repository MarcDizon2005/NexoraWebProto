import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

const TopBar = () => {
    const { user, logout } = useAuth()

    return (
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold">Welcome, {user?.name || 'User'}</h2>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={logout}>
                    Logout
                </Button>
            </div>
        </header>
    )
}

export default TopBar

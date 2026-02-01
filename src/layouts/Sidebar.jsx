import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/components/ui/utils'

const Sidebar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/student', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
  ]

  return (
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Nexora</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                      to={item.path}
                      className={cn(
                          'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                          location.pathname === item.path
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100'
                      )}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
            ))}
          </ul>
        </nav>
      </aside>
  )
}

export default Sidebar

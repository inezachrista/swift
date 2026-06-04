import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../services/api'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/staff', label: 'Staff' },
  { to: '/report', label: 'Report' },
]

export default function Layout({ children, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await api.logout()
    } catch {}
    onLogout()
    navigate('/')
  }

  const initials = user?.UserName?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-56 bg-gray-900 text-white z-50 flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="text-sm font-semibold">VRS</div>
          <div className="text-xs text-gray-500">Vehicle Rental System</div>
        </div>

        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm transition cursor-pointer ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-800 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded bg-gray-700 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm truncate">{user?.UserName}</div>
              <div className="text-xs text-gray-500">{user?.Role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-gray-500 hover:text-white text-left cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 text-xl p-1 cursor-pointer"
              aria-label="Open menu"
            >
              &#9776;
            </button>
            <h1 className="text-base font-semibold text-gray-900">Vehicle Rental System</h1>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
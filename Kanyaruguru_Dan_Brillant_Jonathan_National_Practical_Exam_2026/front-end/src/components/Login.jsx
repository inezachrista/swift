import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../services/api'

export default function Login({ onLogin, onCustomerLogin }) {
  const [tab, setTab] = useState('staff')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [custPassword, setCustPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.signedUp) setError('Account created. Sign in below.')
    if (location.state?.customerSignedUp) setError('Account created. Sign in below.')
  }, [location.state])

  async function handleStaffLogin(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('All fields are required.')
      return
    }
    setLoading(true)
    try {
      const data = await api.login({ UserName: username, Password: password })
      onLogin(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCustomerLogin(e) {
    e.preventDefault()
    setError('')
    if (!nationalId.trim() || !custPassword.trim()) {
      setError('All fields are required.')
      return
    }
    setLoading(true)
    try {
      const data = await api.customerLogin({ National_ID: nationalId, Password: custPassword })
      onCustomerLogin(data.customer)
      navigate('/my-account', { state: { customer: data.customer } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 w-full max-w-sm">
        <div className="text-center pt-6 pb-4 px-6">
          <h1 className="text-xl font-semibold text-gray-900">Vehicle Rental System</h1>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setTab('staff'); setError('') }}
            className={`flex-1 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px transition ${tab === 'staff' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Staff Login
          </button>
          <button
            onClick={() => { setTab('customer'); setError('') }}
            className={`flex-1 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px transition ${tab === 'customer' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Customer Login
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 text-red-600 px-3 py-2 text-sm border border-red-200">{error}</div>
        )}

        {tab === 'staff' ? (
          <form onSubmit={handleStaffLogin} className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500"
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white text-sm font-medium py-2 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              No account?{' '}
              <Link to="/signup" className="text-gray-900 underline underline-offset-2">Create one</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleCustomerLogin} className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500"
                placeholder="Enter your National ID"
                autoFocus
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={custPassword}
                onChange={(e) => setCustPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white text-sm font-medium py-2 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              No account?{' '}
              <Link to="/customer-signup" className="text-gray-900 underline underline-offset-2">Register here</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
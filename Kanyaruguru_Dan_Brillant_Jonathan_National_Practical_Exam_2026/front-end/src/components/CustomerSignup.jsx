import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function CustomerSignup() {
  const [form, setForm] = useState({ Full_Name: '', National_ID: '', Phone: '', Email: '', Address: '', Password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.Full_Name.trim() || !form.National_ID.trim() || !form.Phone.trim() || !form.Password.trim()) {
      setError('Full Name, National ID, Phone, and Password are required.')
      return
    }
    setLoading(true)
    try {
      await api.customerSignup(form)
      navigate('/', { state: { customerSignedUp: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Customer Registration</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account to manage reservations</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 px-3 py-2 text-sm mb-4 border border-red-200">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" value={form.Full_Name} onChange={(e) => setForm({ ...form, Full_Name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" placeholder="Enter your full name" autoFocus />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
            <input type="text" value={form.National_ID} onChange={(e) => setForm({ ...form, National_ID: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" placeholder="Enter your National ID" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input type="text" value={form.Phone} onChange={(e) => setForm({ ...form, Phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" placeholder="Enter your phone number" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.Email} onChange={(e) => setForm({ ...form, Email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" placeholder="Optional" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea rows={2} value={form.Address} onChange={(e) => setForm({ ...form, Address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500 resize-none" placeholder="Optional" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" value={form.Password} onChange={(e) => setForm({ ...form, Password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" placeholder="Choose a password" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white text-sm font-medium py-2 cursor-pointer">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-gray-900 underline underline-offset-2">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
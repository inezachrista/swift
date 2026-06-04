import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function CustomerDashboard({ customer, onLogout }) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.getMyReservations()
      .then(setReservations)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    try { await api.logout() } catch {}
    onLogout()
    navigate('/')
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-gray-900">{customer?.Full_Name}</span>
          <span className="text-xs text-gray-400 ml-2">ID: {customer?.National_ID}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer underline underline-offset-2"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">My Reservations</h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : reservations.length === 0 ? (
          <p className="text-gray-400 text-sm">No reservations found.</p>
        ) : (
          <div className="space-y-3">
            {reservations.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {r.VehicleBrand} {r.VehicleModel}
                    </p>
                    <p className="text-xs text-gray-400">{r.VehiclePlate}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 ${statusColors[r.Reservation_Status] || 'bg-gray-100 text-gray-600'}`}>
                    {r.Reservation_Status}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Start: {r.Start_Date ? r.Start_Date.split('T')[0] : '-'}</span>
                  <span>End: {r.End_Date ? r.End_Date.split('T')[0] : '-'}</span>
                </div>
                {r.Rental_Fee && (
                  <p className="text-xs text-gray-600 mt-2">Fee: ${Number(r.Rental_Fee).toLocaleString()}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
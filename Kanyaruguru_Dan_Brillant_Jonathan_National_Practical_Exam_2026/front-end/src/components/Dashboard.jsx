import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, vehicles: 0, reservations: 0, available: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [cust, veh, res] = await Promise.all([
          api.getCustomers(),
          api.getVehicles(),
          api.getReservations(),
        ])
        setStats({
          customers: cust.length,
          vehicles: veh.length,
          reservations: res.length,
          available: veh.filter((v) => v.Status === 'available').length,
        })
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading...</div>
  }

  const cards = [
    { label: 'Total Customers', value: stats.customers },
    { label: 'Total Vehicles', value: stats.vehicles },
    { label: 'Available Vehicles', value: stats.available },
    { label: 'Reservations', value: stats.reservations },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 p-5">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{card.label}</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Welcome</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Use the sidebar to manage customers, vehicles, and reservations.
        </p>
      </div>
    </div>
  )
}
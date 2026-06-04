import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import { useToast } from './Toast'

export default function Report() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debounceRef = useRef(null)
  const toast = useToast()
  const printRef = useRef(null)

  useEffect(() => {
    loadReport()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (search) {
        const q = search.toLowerCase()
        setData(prev => prev.filter(row =>
          Object.values(row).some(v =>
            String(v ?? '').toLowerCase().includes(q)
          )
        ))
      } else {
        loadReport()
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  async function loadReport() {
    setLoading(true)
    try {
      const result = await api.getReport()
      setData(result)
    } catch {
      toast('Failed to load report', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  const filtered = search
    ? data.filter(row =>
        Object.values(row).some(v =>
          String(v ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : data

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-800',
    not_started: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    returned: 'bg-green-100 text-green-800',
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Customer Vehicle Reservation & Rental Report</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search report..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500"
          />
          <button onClick={handlePrint} className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium cursor-pointer whitespace-nowrap">
            Print
          </button>
        </div>
      </div>

      <div ref={printRef} className="bg-white border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {search ? 'No records match your search.' : 'No records found.'}
          </div>
        ) : (
          <table className="w-full text-sm min-w-[1400px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <th className="text-left px-3 py-3">Customer</th>
                <th className="text-left px-3 py-3">National ID</th>
                <th className="text-left px-3 py-3">Phone</th>
                <th className="text-left px-3 py-3">Plate No.</th>
                <th className="text-left px-3 py-3">Brand</th>
                <th className="text-left px-3 py-3">Model</th>
                <th className="text-left px-3 py-3">Year</th>
                <th className="text-left px-3 py-3">Type</th>
                <th className="text-left px-3 py-3">Res. Date</th>
                <th className="text-left px-3 py-3">Start Date</th>
                <th className="text-left px-3 py-3">End Date</th>
                <th className="text-left px-3 py-3">Res. Status</th>
                <th className="text-left px-3 py-3">Rental Date</th>
                <th className="text-right px-3 py-3">Rental Fee</th>
                <th className="text-left px-3 py-3">Rental Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-3 text-gray-900 font-medium whitespace-nowrap">{row.CustomerName || '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.CustomerNationalID || '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.CustomerPhone || '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.VehiclePlate || '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.VehicleBrand || '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.VehicleModel || '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.VehicleYear || '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.VehicleType || '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.Reservation_Date ? row.Reservation_Date.split('T')[0] : '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.Start_Date ? row.Start_Date.split('T')[0] : '-'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.End_Date ? row.End_Date.split('T')[0] : '-'}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${statusColors[row.Reservation_Status] || 'bg-gray-100 text-gray-600'}`}>
                      {row.Reservation_Status || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.Rental_Date ? row.Rental_Date.split('T')[0] : '-'}</td>
                  <td className="px-3 py-3 text-gray-600 text-right whitespace-nowrap">
                    {row.Rental_Fee != null ? Number(row.Rental_Fee).toLocaleString() : '-'}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${statusColors[row.Rental_Status] || 'bg-gray-100 text-gray-600'}`}>
                      {row.Rental_Status || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-400 text-right">
        Total records: {filtered.length}
      </div>
    </div>
  )
}

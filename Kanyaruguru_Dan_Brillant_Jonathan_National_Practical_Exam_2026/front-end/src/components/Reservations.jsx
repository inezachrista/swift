import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import Modal from './Modal'
import { useToast } from './Toast'

const empty = { customer_id: '', vehicle_id: '', Start_Date: '', End_Date: '', Reservation_Date: '', Reservation_Status: 'pending' }

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [customers, setCustomers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const debounceRef = useRef(null)

  useEffect(() => {
    Promise.all([loadReservations(), loadCustomers(), loadVehicles()])
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { loadReservations(search) }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  async function loadReservations(s) {
    try {
      const data = await api.getReservations(s)
      setReservations(data)
    } catch {
      toast('Failed to load reservations', 'error')
    }
  }

  async function loadCustomers() {
    try {
      setCustomers(await api.getCustomers())
    } catch {}
  }

  async function loadVehicles() {
    try {
      setVehicles(await api.getVehicles())
    } catch {}
  }

  function openCreate() {
    setEditing(null)
    const today = new Date().toISOString().split('T')[0]
    setForm({ ...empty, Reservation_Date: today })
    setModalOpen(true)
  }

  function openEdit(r) {
    setEditing(r)
    setForm({
      customer_id: r.customer_id || '',
      vehicle_id: r.vehicle_id || '',
      Start_Date: r.Start_Date ? r.Start_Date.split('T')[0] : '',
      End_Date: r.End_Date ? r.End_Date.split('T')[0] : '',
      Reservation_Date: r.Reservation_Date ? r.Reservation_Date.split('T')[0] : '',
      Reservation_Status: r.Reservation_Status || 'pending',
    })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.customer_id || !form.vehicle_id || !form.Start_Date || !form.End_Date) {
      toast('Customer, Vehicle, Start Date, and End Date are required.', 'error')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await api.updateReservation(editing.id, form)
        toast('Reservation updated successfully', 'success')
      } else {
        await api.createReservation(form)
        toast('Reservation created successfully', 'success')
      }
      setModalOpen(false)
      await loadReservations()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this reservation?')) return
    try {
      await api.deleteReservation(id)
      toast('Reservation deleted successfully', 'success')
      await loadReservations()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Reservations</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500"
          />
          <button onClick={openCreate} className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium cursor-pointer whitespace-nowrap">
            + Add
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        {reservations.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {search ? 'No reservations match your search.' : 'No reservations yet.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Vehicle</th>
                <th className="text-left px-4 py-3">Start Date</th>
                <th className="text-left px-4 py-3">End Date</th>
                <th className="text-left px-4 py-3">Res. Date</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.id}</td>
                  <td className="px-4 py-3 text-gray-600">{r.CustomerName || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.VehiclePlate || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.Start_Date ? r.Start_Date.split('T')[0] : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.End_Date ? r.End_Date.split('T')[0] : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.Reservation_Date ? r.Reservation_Date.split('T')[0] : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${statusColors[r.Reservation_Status] || 'bg-gray-100 text-gray-600'}`}>
                      {r.Reservation_Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(r)} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2.5 py-1 text-xs font-medium cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 text-xs font-medium cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Reservation' : 'Add Reservation'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60 cursor-pointer">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
            <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500 bg-white">
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.Full_Name} ({c.National_ID})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle *</label>
            <select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500 bg-white">
              <option value="">Select vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.Brand} {v.Model} - {v.Plate_Number}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" value={form.Start_Date} onChange={(e) => setForm({ ...form, Start_Date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="date" value={form.End_Date} onChange={(e) => setForm({ ...form, End_Date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Res. Date</label>
              <input type="date" value={form.Reservation_Date} onChange={(e) => setForm({ ...form, Reservation_Date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.Reservation_Status} onChange={(e) => setForm({ ...form, Reservation_Status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500 bg-white">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}
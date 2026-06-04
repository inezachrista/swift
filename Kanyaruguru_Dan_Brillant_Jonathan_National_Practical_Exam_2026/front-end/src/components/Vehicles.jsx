import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import Modal from './Modal'
import { useToast } from './Toast'

const empty = { Plate_Number: '', Brand: '', Model: '', Year: '', Vehicle_Type: '', Purchase_Price: '', Status: 'available' }

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const debounceRef = useRef(null)

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { load(search) }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  async function load(s) {
    try {
      const data = await api.getVehicles(s)
      setVehicles(data)
    } catch {
      toast('Failed to load vehicles', 'error')
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(empty)
    setModalOpen(true)
  }

  function openEdit(v) {
    setEditing(v)
    setForm({
      Plate_Number: v.Plate_Number || '',
      Brand: v.Brand || '',
      Model: v.Model || '',
      Year: v.Year || '',
      Vehicle_Type: v.Vehicle_Type || '',
      Purchase_Price: v.Purchase_Price || '',
      Status: v.Status || 'available',
    })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.Plate_Number.trim() || !form.Brand.trim() || !form.Model.trim() || !form.Year || !form.Vehicle_Type.trim() || !form.Purchase_Price) {
      toast('All fields are required.', 'error')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await api.updateVehicle(editing.id, form)
        toast('Vehicle updated successfully', 'success')
      } else {
        await api.createVehicle(form)
        toast('Vehicle created successfully', 'success')
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this vehicle?')) return
    try {
      await api.deleteVehicle(id)
      toast('Vehicle deleted successfully', 'success')
      await load()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    rented: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-red-100 text-red-800',
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Vehicles</h2>
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
        {vehicles.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {search ? 'No vehicles match your search.' : 'No vehicles yet.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Plate #</th>
                <th className="text-left px-4 py-3">Brand</th>
                <th className="text-left px-4 py-3">Model</th>
                <th className="text-left px-4 py-3">Year</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{v.Plate_Number}</td>
                  <td className="px-4 py-3 text-gray-600">{v.Brand}</td>
                  <td className="px-4 py-3 text-gray-600">{v.Model}</td>
                  <td className="px-4 py-3 text-gray-600">{v.Year}</td>
                  <td className="px-4 py-3 text-gray-600">{v.Vehicle_Type}</td>
                  <td className="px-4 py-3 text-gray-600">{Number(v.Purchase_Price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${statusColors[v.Status] || 'bg-gray-100 text-gray-600'}`}>
                      {v.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(v)} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2.5 py-1 text-xs font-medium cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 text-xs font-medium cursor-pointer">Delete</button>
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
        title={editing ? 'Edit Vehicle' : 'Add Vehicle'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60 cursor-pointer">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
            <input type="text" value={form.Plate_Number} onChange={(e) => setForm({ ...form, Plate_Number: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <input type="text" value={form.Brand} onChange={(e) => setForm({ ...form, Brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
            <input type="text" value={form.Model} onChange={(e) => setForm({ ...form, Model: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
            <input type="number" value={form.Year} onChange={(e) => setForm({ ...form, Year: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select value={form.Vehicle_Type} onChange={(e) => setForm({ ...form, Vehicle_Type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500 bg-white">
              <option value="">Select type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
            <input type="number" step="0.01" value={form.Purchase_Price} onChange={(e) => setForm({ ...form, Purchase_Price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.Status} onChange={(e) => setForm({ ...form, Status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500 bg-white">
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}
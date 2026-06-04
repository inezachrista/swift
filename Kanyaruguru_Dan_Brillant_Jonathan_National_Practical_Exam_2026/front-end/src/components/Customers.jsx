import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import Modal from './Modal'
import { useToast } from './Toast'

const empty = { Full_Name: '', National_ID: '', Phone: '', Email: '', Address: '', Password: '' }

export default function Customers() {
  const [customers, setCustomers] = useState([])
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
      const data = await api.getCustomers(s)
      setCustomers(data)
    } catch {
      toast('Failed to load customers', 'error')
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(empty)
    setModalOpen(true)
  }

  function openEdit(c) {
    setEditing(c)
    setForm({ Full_Name: c.Full_Name || '', National_ID: c.National_ID || '', Phone: c.Phone || '', Email: c.Email || '', Address: c.Address || '', Password: '' })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.Full_Name.trim() || !form.National_ID.trim() || !form.Phone.trim()) {
      toast('Full Name, National ID, and Phone are required.', 'error')
      return
    }
    if (!editing && !form.Password) {
      toast('Password is required for new customers.', 'error')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const { Password, ...rest } = form
        await api.updateCustomer(editing.id, rest)
        toast('Customer updated successfully', 'success')
      } else {
        await api.createCustomer(form)
        toast('Customer created successfully', 'success')
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
    if (!window.confirm('Delete this customer?')) return
    try {
      await api.deleteCustomer(id)
      toast('Customer deleted successfully', 'success')
      await load()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
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
        {customers.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {search ? 'No customers match your search.' : 'No customers yet.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">National ID</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Address</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.Full_Name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.National_ID}</td>
                  <td className="px-4 py-3 text-gray-600">{c.Phone}</td>
                  <td className="px-4 py-3 text-gray-600">{c.Email || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{c.Address || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2.5 py-1 text-xs font-medium cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 text-xs font-medium cursor-pointer">Delete</button>
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
        title={editing ? 'Edit Customer' : 'Add Customer'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" value={form.Full_Name} onChange={(e) => setForm({ ...form, Full_Name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
            <input type="text" value={form.National_ID} onChange={(e) => setForm({ ...form, National_ID: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input type="text" value={form.Phone} onChange={(e) => setForm({ ...form, Phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.Email} onChange={(e) => setForm({ ...form, Email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea rows={2} value={form.Address} onChange={(e) => setForm({ ...form, Address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500 resize-none" />
          </div>
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" value={form.Password} onChange={(e) => setForm({ ...form, Password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
            </div>
          )}
        </form>
      </Modal>
    </div>
  )
}
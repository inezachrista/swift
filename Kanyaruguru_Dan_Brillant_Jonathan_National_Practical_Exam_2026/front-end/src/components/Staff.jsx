import { useState, useEffect } from 'react'
import api from '../services/api'
import Modal from './Modal'
import { useToast } from './Toast'

const empty = { UserName: '', Password: '', Role: 'staff' }

export default function Staff() {
  const [users, setUsers] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch {
      toast('Failed to load staff', 'error')
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(empty)
    setModalOpen(true)
  }

  function openEdit(u) {
    setEditing(u)
    setForm({ UserName: u.UserName || '', Role: u.Role || 'staff', Password: '' })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.UserName.trim()) {
      toast('Username is required.', 'error')
      return
    }
    if (!editing && !form.Password) {
      toast('Password is required.', 'error')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const { Password, ...rest } = form
        await api.updateUser(editing.id, rest)
        toast('Staff updated successfully', 'success')
      } else {
        await api.createUser(form)
        toast('Staff created successfully', 'success')
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
    if (!window.confirm('Delete this staff member?')) return
    try {
      await api.deleteUser(id)
      toast('Staff deleted successfully', 'success')
      await load()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    staff: 'bg-blue-100 text-blue-800',
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Staff</h2>
        <button onClick={openCreate} className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium cursor-pointer whitespace-nowrap">
          + Add Staff
        </button>
      </div>

      <div className="bg-white border border-gray-200">
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No staff members yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Username</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.UserName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${roleColors[u.Role] || 'bg-gray-100 text-gray-600'}`}>
                      {u.Role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2.5 py-1 text-xs font-medium cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 text-xs font-medium cursor-pointer">Delete</button>
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
        title={editing ? 'Edit Staff' : 'Add Staff'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input type="text" value={form.UserName} onChange={(e) => setForm({ ...form, UserName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
          </div>
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" value={form.Password} onChange={(e) => setForm({ ...form, Password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={form.Role} onChange={(e) => setForm({ ...form, Role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-500 bg-white">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}
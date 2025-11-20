import React, { useEffect, useState } from 'react'
import { API } from '../api'

export default function Users() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ nama: '', email: '', password: '', role: 'user' })

  // Modal konfirmasi tambah
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, setPending] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    const { data } = await API.get('/users')
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const onSubmitAdd = (e) => {
    e.preventDefault()
    if (!form.nama.trim() || !form.email.trim() || !form.password.trim()) {
      alert('Nama, Email, dan Password wajib diisi')
      return
    }
    setPending({ ...form })
    setConfirmOpen(true)
  }

  const doAddConfirmed = async () => {
    if (!pending) return
    setSubmitting(true)
    try {
      await API.post('/users', pending)
      setForm({ nama: '', email: '', password: '', role: 'user' })
      setConfirmOpen(false)
      setPending(null)
      await load()
    } catch (e) {
      alert(e?.response?.data?.message || 'Gagal menambah user')
    } finally {
      setSubmitting(false)
    }
  }

  const edit = async (id) => {
    const target = items.find(i => i.id === id)
    const nama = prompt('Nama:', target?.nama || '')
    const email = prompt('Email:', target?.email || '')
    const role = prompt('Role (user/admin):', target?.role || 'user')
    if (nama == null || email == null || role == null) return
    await API.put(`/users/${id}`, { nama, email, role })
    load()
  }

  const delItem = async (id) => {
    if (!window.confirm('Hapus user ini?')) return
    await API.delete(`/users/${id}`)
    load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Data Karyawan (Admin)
        </h2>

        {/* Form Tambah */}
        <form
          onSubmit={onSubmitAdd}
          className="bg-white rounded-lg shadow-md p-4 sm:p-5 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                placeholder="Nama"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                placeholder="Email"
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
            >
              Tambah
            </button>
          </div>
        </form>

        {/* Tabel Data */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Nama</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Email</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Role</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3 sm:p-4">
                    <span className="font-medium text-gray-800">
                      {u.nama}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-gray-700 break-all">
                    {u.email}
                  </td>
                  <td className="p-3 sm:p-4 text-gray-700 capitalize">
                    {u.role}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => edit(u.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => delItem(u.id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-gray-500 text-xs sm:text-sm text-center"
                  >
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Konfirmasi Tambah User */}
        {confirmOpen && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-15">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="p-5">
                <h2 className="text-lg sm:text-xl font-bold mb-5 text-gray-800">
                  Konfirmasi Tambah Karyawan
                </h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Nama</p>
                    <p className="px-3 py-2 bg-gray-50 border rounded-lg">
                      {pending?.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Email</p>
                    <p className="px-3 py-2 bg-gray-50 border rounded-lg break-all">
                      {pending?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Role</p>
                    <p className="px-3 py-2 bg-gray-50 border rounded-lg capitalize">
                      {pending?.role}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
                    onClick={() => { setConfirmOpen(false); setPending(null) }}
                    disabled={submitting}
                  >
                    Batal
                  </button>
                  <button
                    className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                    onClick={doAddConfirmed}
                    disabled={submitting}
                  >
                    {submitting ? 'Menyimpan…' : 'Konfirmasi & Tambah'}
                  </button>
                </div>

                <p className="text-[11px] text-gray-500 mt-4">
                  *Password tidak ditampilkan demi keamanan, tapi tetap disimpan
                  sesuai input.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

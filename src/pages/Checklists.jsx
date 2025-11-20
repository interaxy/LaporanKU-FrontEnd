import React, { useEffect, useState } from 'react'
import { API } from '../api'

export default function Checklists({ user }) {
  const [items, setItems] = useState([])
  const [tipe, setTipe] = useState('harian')
  const [file, setFile] = useState(null)
  const [filter, setFilter] = useState('all')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isAdmin = user?.role === 'admin'

  const load = async () => {
    const qs = filter === 'all' ? '' : `?tipe=${filter}`
    const { data } = await API.get(`/checklists${qs}`)
    setItems(data)
  }

  useEffect(() => { load() }, [filter])

  const onSubmitUpload = (e) => {
    e.preventDefault()
    if (!file) {
      alert('Pilih file terlebih dahulu')
      return
    }
    setConfirmOpen(true)
  }

  const doUploadConfirmed = async () => {
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('tipe', tipe)
      await API.post('/checklists', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setFile(null)
      setConfirmOpen(false)
      await load()
    } catch (e) {
      alert(e?.response?.data?.message || 'Gagal upload checklist')
    } finally {
      setSubmitting(false)
    }
  }

  const delItem = async (id) => {
    if (!confirm('Hapus file ini?')) return
    await API.delete(`/checklists/${id}`)
    load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Checklist</h2>

      {/* Filter Tabs – dibuat bisa scroll horizontal di mobile */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {['all', 'harian', 'mingguan', 'tahunan'].map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg border text-sm font-medium transition ${filter === v
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Form (Admin Only) */}
      {isAdmin && (
        <form
          onSubmit={onSubmitUpload}
          className="bg-white rounded-lg shadow-md p-5 mb-6 flex flex-col sm:flex-row flex-wrap gap-3"
        >
          <select
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-auto"
          >
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="tahunan">Tahunan</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1 min-w-[180px]"
          />

          <button
            type="submit"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Upload
          </button>
        </form>
      )}

      {/* Tabel Checklist */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-4 font-semibold text-gray-700">Tipe</th>
              <th className="p-4 font-semibold text-gray-700">Nama File</th>
              <th className="p-4 font-semibold text-gray-700">Tanggal Upload</th>
              {isAdmin && (
                <th className="p-4 font-semibold text-gray-700">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 capitalize text-gray-800">{c.tipe}</td>
                <td className="p-4">
                  <a
                    href={`http://localhost:5000${c.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {c.nama_file}
                  </a>
                </td>
                <td className="p-4 text-gray-700">
                  {new Date(c.uploaded_at).toLocaleString('id-ID')}
                </td>
                {isAdmin && (
                  <td className="p-4">
                    <button
                      onClick={() => delItem(c.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 4 : 3}
                  className="p-4 text-center text-gray-500"
                >
                  Belum ada data checklist.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Upload */}
      {confirmOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-15">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 sm:mx-auto">
            <div className="p-5">
              <h2 className="text-xl font-bold mb-5 text-gray-800">
                Konfirmasi Upload Checklist
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Jenis Checklist</p>
                  <p className="px-3 py-2 bg-gray-50 border rounded-lg capitalize">
                    {tipe}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Nama File</p>
                  <p className="px-3 py-2 bg-gray-50 border rounded-lg break-all">
                    {file?.name}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  onClick={() => setConfirmOpen(false)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                  onClick={doUploadConfirmed}
                  disabled={submitting}
                >
                  {submitting ? 'Mengunggah…' : 'Konfirmasi & Upload'}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                *Pastikan file sudah benar sebelum dikonfirmasi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

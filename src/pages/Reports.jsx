import React, { useEffect, useRef, useState } from 'react'
import { API } from '../api'
import jsPDF from 'jspdf'

// ikon/material
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'

// Helper UI untuk status badge
const BadgeStatus = ({ status }) => {
  const s = (status || '').toLowerCase()
  const style =
    s === 'selesai' || s === 'disetujui'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-yellow-100 text-yellow-700'
  const label =
    s === 'selesai' ? 'Selesai'
      : s === 'disetujui' ? 'Disetujui'
        : 'Draft'
  return (
    <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full ${style}`}>
      {label}
    </span>
  )
}

// Item Laporan dengan info lengkap (mirip Issues.jsx)
const ReportListItem = ({
  id,
  isi_laporan,
  tanggal,
  status,
  created_by_name,
  created_at,
  isAdmin,
  canEdit = false,
  onEdit,
  onDelete,
  onChangeStatus
}) => {
  const createdAtDate = created_at ? new Date(created_at) : null

  return (
    <div className="flex items-start justify-between p-3 sm:p-4 hover:bg-gray-50 border-b last:border-b-0">
      <div className="flex-1 pr-2 sm:pr-4">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
            {isi_laporan}
          </p>
          <BadgeStatus status={status} />
        </div>
        <p className="text-[11px] text-gray-500 mb-1">
          Tanggal: {new Date(tanggal).toLocaleDateString('id-ID')}
        </p>
        <p className="text-[10px] sm:text-[11px] text-gray-500">
          Dibuat oleh:{' '}
          <span className="font-medium">{created_by_name || '-'}</span>
          {createdAtDate && <> · {createdAtDate.toLocaleString('id-ID')}</>}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1 sm:gap-2 text-[11px] sm:text-xs ml-2 sm:ml-3">
        {canEdit && (
          <>
            <button
              onClick={() => onEdit(id)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              className="text-red-600 hover:underline"
            >
              Hapus
            </button>
          </>
        )}
        {/* Kalau mau aktifkan ubah status per item:
        {isAdmin && (
          <button
            onClick={() => onChangeStatus(id)}
            className="text-indigo-600 hover:underline"
          >
            Ubah Status
          </button>
        )} */}
      </div>
    </div>
  )
}

const CollapsibleSection = ({ title, totalCount, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-3 py-3 sm:px-4 sm:py-4 text-left focus:outline-none rounded-t-lg hover:bg-gray-50"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon && React.cloneElement(icon, { className: 'mr-3 text-blue-600' })}
          <span className="text-sm sm:text-lg font-semibold text-gray-800">{title}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs sm:text-sm text-gray-500 mr-2 sm:mr-3">
            Total: {totalCount} laporan
          </span>
          {isOpen ? (
            <KeyboardArrowUpIcon className="text-gray-600" fontSize="small" />
          ) : (
            <KeyboardArrowDownIcon className="text-gray-600" fontSize="small" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="border-t p-0">
          {children || <p className="p-4 text-sm text-gray-500">Tidak ada data.</p>}
        </div>
      )}
    </div>
  )
}

// Modal pilih laporan (selesai/approve)
const PickReportModal = ({ open, onClose, title, list, onSubmit, submitLabel = 'OK' }) => {
  const [selectedId, setSelectedId] = useState('')
  useEffect(() => { if (!open) setSelectedId('') }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-15">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-5">
          <h2 className="text-lg sm:text-xl font-bold mb-5 text-gray-800">{title}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Pilih Laporan (Draft)
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">-- Pilih --</option>
              {list.map(l => (
                <option key={l.id} value={l.id}>
                  {new Date(l.tanggal).toLocaleDateString('id-ID')} —{' '}
                  {l.isi_laporan.slice(0, 40)}
                  {l.isi_laporan.length > 40 ? '…' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2.5 mr-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              onClick={() => onSubmit(selectedId)}
              disabled={!selectedId}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal Ubah Status
const ChangeStatusModal = ({ open, onClose, report, onSubmit, isSubmitting }) => {
  const [statusValue, setStatusValue] = useState(report?.status || 'draft')

  useEffect(() => {
    if (open && report) {
      setStatusValue(report.status || 'draft')
    }
  }, [open, report])

  if (!open || !report) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-15">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-5">
          <h2 className="text-lg sm:text-xl font-bold mb-5 text-gray-800">
            Ubah Status Laporan
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            <span className="font-semibold">Laporan: </span>
            {report.isi_laporan}
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Baru
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="selesai">Selesai</option>
              <option value="disetujui">Disetujui</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-60"
              onClick={() => onSubmit(report.id, statusValue)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan…' : 'Simpan Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Komponen utama
export default function Reports({ user }) {
  const isAdmin = user?.role === 'admin'

  const [items, setItems] = useState([])
  const [isi, setIsi] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pdfRef = useRef(null)

  // modal
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false)
  const [selectedReportForStatus, setSelectedReportForStatus] = useState(null)
  const [changingStatus, setChangingStatus] = useState(false)

  // konfirmasi submit
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, setPending] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await API.get('/reports')
      setItems(data || [])
    } catch (e) {
      setError('Gagal memuat laporan')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  // submit dengan konfirmasi
  const onSubmitAdd = (e) => {
    e.preventDefault()
    if (!isi.trim()) {
      alert('Isi laporan wajib diisi')
      return
    }
    setPending({ isi_laporan: isi.trim(), tanggal: tanggal || undefined })
    setConfirmOpen(true)
  }

  const doAddConfirmed = async () => {
    if (!pending) return
    setSubmitting(true)
    try {
      const { data } = await API.post('/reports', pending)
      setItems(prev => [data, ...prev])
      setIsi(''); setTanggal('')
      setConfirmOpen(false); setPending(null)
    } catch {
      alert('Gagal menambah laporan')
    } finally {
      setSubmitting(false)
    }
  }

  // edit/hapus
  const update = async (id) => {
    const curr = items.find(i => i.id === id)

    // Cek ownership: hanya bisa edit laporan sendiri (kecuali admin)
    if (!isAdmin && curr?.user_id !== user?.id) {
      alert('Anda hanya bisa mengedit laporan milik sendiri')
      return
    }

    const newIsi = prompt('Ubah isi laporan:', curr?.isi_laporan || '')
    if (newIsi == null) return
    try {
      const { data } = await API.put(`/reports/${id}`, {
        isi_laporan: newIsi,
        tanggal: curr?.tanggal
      })
      setItems(items.map(i => i.id === id ? data : i))
    } catch {
      alert('Gagal update')
    }
  }

  const delItem = async (id) => {
    const curr = items.find(i => i.id === id)

    // Cek ownership: hanya bisa hapus laporan sendiri (kecuali admin)
    if (!isAdmin && curr?.user_id !== user?.id) {
      alert('Anda hanya bisa menghapus laporan milik sendiri')
      return
    }

    if (!window.confirm('Hapus laporan ini?')) return
    try {
      await API.delete(`/reports/${id}`)
      setItems(items.filter(i => i.id !== id))
    } catch {
      alert('Gagal hapus')
    }
  }

  // status actions
  const markComplete = async (id) => {
    try {
      await API.post(`/reports/${id}/complete`)
      await load()
      setShowCompleteModal(false)
    } catch {
      alert('Gagal menandai selesai')
    }
  }

  const approve = async (id) => {
    try {
      await API.post(`/reports/${id}/approve`)
      await load()
      setShowApproveModal(false)
    } catch (e) {
      alert(e?.response?.status === 403
        ? 'Hanya admin yang boleh menyetujui'
        : 'Gagal menyetujui')
    }
  }

  const openChangeStatusModal = (id) => {
    const report = items.find(i => i.id === id)
    if (report) {
      setSelectedReportForStatus(report)
      setShowChangeStatusModal(true)
    }
  }

  const doChangeStatus = async (id, newStatus) => {
    setChangingStatus(true)
    try {
      const { data } = await API.put(`/reports/${id}`, { status: newStatus })
      setItems(items.map(i => i.id === id ? data : i))
      setShowChangeStatusModal(false)
      setSelectedReportForStatus(null)
    } catch (e) {
      console.error(e)
      alert('Gagal mengubah status')
    } finally {
      setChangingStatus(false)
    }
  }

  // export PDF
  const exportPdf = async () => {
    const doc = new jsPDF()
    const el = pdfRef.current
    if (!el) return
    await doc.html(el, {
      x: 10,
      y: 10,
      width: 180,
      windowWidth: 800,
      callback: (d) => d.save('laporan.pdf')
    })
  }

  const drafts = items.filter(i => (i.status || 'draft').toLowerCase() === 'draft')
  const selesai = items.filter(i => (i.status || '').toLowerCase() === 'selesai')
  const disetujui = items.filter(i => (i.status || '').toLowerCase() === 'disetujui')

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Laporan Harian</h2>

        {/* Form tambah */}
        <form
          onSubmit={onSubmitAdd}
          className="bg-white rounded-lg shadow-md p-4 sm:p-5 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Isi Laporan
              </label>
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                rows={2}
                placeholder="Tuliskan laporan singkat..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
            >
              Tambah
            </button>

            <button
              type="button"
              onClick={() => setShowCompleteModal(true)}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow hover:bg-emerald-700 transition"
            >
              Tandai Selesai
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowApproveModal(true)}
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700 transition"
              >
                Laporan Disetujui
              </button>
            )}

            <button
              type="button"
              onClick={exportPdf}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-700 text-white text-sm font-medium shadow hover:bg-gray-800 transition"
            >
              Export PDF
            </button>
          </div>
        </form>

        {loading && <div className="text-sm text-gray-600 mb-3">Memuat...</div>}
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        {/* Panel ringkas */}
        <div className="mb-6">
          <CollapsibleSection
            title="Jumlah Laporan (Draft)"
            totalCount={drafts.length}
            icon={<FolderOpenIcon />}
            defaultOpen
          >
            {drafts.length > 0 ? (
              drafts.slice(0, 10).map(it => (
                <ReportListItem
                  key={it.id}
                  id={it.id}
                  isi_laporan={it.isi_laporan}
                  tanggal={it.tanggal}
                  status={it.status}
                  created_by_name={it.created_by_name}
                  created_at={it.created_at}
                  isAdmin={isAdmin}
                  canEdit={isAdmin || it.user_id === user?.id}
                  onEdit={update}
                  onDelete={delItem}
                  onChangeStatus={openChangeStatusModal}
                />
              ))
            ) : (
              <p className="p-4 text-sm text-gray-500">Tidak ada laporan.</p>
            )}
          </CollapsibleSection>

          {/* Laporan Selesai */}
          <CollapsibleSection
            title="Laporan Selesai"
            totalCount={selesai.length}
            icon={<CheckCircleOutlineIcon />}
          >
            {selesai.length > 0 ? (
              selesai.map(it => (
                <ReportListItem
                  key={it.id}
                  id={it.id}
                  isi_laporan={it.isi_laporan}
                  tanggal={it.tanggal}
                  status={it.status}
                  created_by_name={it.created_by_name}
                  created_at={it.created_at}
                  isAdmin={isAdmin}
                  canEdit={isAdmin || it.user_id === user?.id}
                  onEdit={update}
                  onDelete={delItem}
                  onChangeStatus={openChangeStatusModal}
                />
              ))
            ) : (
              <p className="p-4 text-sm text-gray-500">
                Tidak ada laporan selesai.
              </p>
            )}
          </CollapsibleSection>

          {/* Laporan Disetujui */}
          <CollapsibleSection
            title="Laporan yang Disetujui"
            totalCount={disetujui.length}
            icon={<ThumbUpOffAltIcon />}
          >
            {disetujui.length > 0 ? (
              disetujui.map(it => (
                <ReportListItem
                  key={it.id}
                  id={it.id}
                  isi_laporan={it.isi_laporan}
                  tanggal={it.tanggal}
                  status={it.status}
                  created_by_name={it.created_by_name}
                  created_at={it.created_at}
                  isAdmin={isAdmin}
                  canEdit={isAdmin || it.user_id === user?.id}
                  onEdit={update}
                  onDelete={delItem}
                  onChangeStatus={openChangeStatusModal}
                />
              ))
            ) : (
              <p className="p-4 text-sm text-gray-500">
                Tidak ada laporan disetujui.
              </p>
            )}
          </CollapsibleSection>
        </div>

        {/* Daftar Laporan (Semua Status) — untuk Export PDF */}
        {/* defaultOpen diganti tanpa komentar di dalam props biar JSX nggak error */}
        <CollapsibleSection
          title="Daftar Laporan (Semua Status)"
          totalCount={items.length}
          icon={<FolderOpenIcon />}
          defaultOpen
        >
          <div ref={pdfRef}>
            {items.map((it) => (
              <ReportListItem
                key={it.id}
                id={it.id}
                isi_laporan={it.isi_laporan}
                tanggal={it.tanggal}
                status={it.status}
                created_by_name={it.created_by_name}
                created_at={it.created_at}
                isAdmin={isAdmin}
                canEdit={isAdmin || it.user_id === user?.id}
                onEdit={update}
                onDelete={delItem}
                onChangeStatus={openChangeStatusModal}
              />
            ))}
            {items.length === 0 && (
              <div className="p-4 text-sm text-gray-500">Belum ada laporan.</div>
            )}
          </div>
        </CollapsibleSection>
      </div>

      {/* Modal Selesaikan */}
      <PickReportModal
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Tandai Laporan Selesai"
        list={drafts}
        onSubmit={markComplete}
        submitLabel="Tandai Selesai"
      />

      {/* Modal Setujui (admin saja) */}
      {isAdmin && (
        <PickReportModal
          open={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          title="Setujui Laporan"
          list={drafts}
          onSubmit={approve}
          submitLabel="Setujui"
        />
      )}

      {/* Modal Ubah Status */}
      <ChangeStatusModal
        open={showChangeStatusModal}
        onClose={() => setShowChangeStatusModal(false)}
        report={selectedReportForStatus}
        onSubmit={doChangeStatus}
        isSubmitting={changingStatus}
      />

      {/* Modal Konfirmasi Tambah */}
      {confirmOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-15">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-5">
              <h2 className="text-lg sm:text-xl font-bold mb-5 text-gray-800">
                Konfirmasi Laporan
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Tanggal</p>
                  <p className="px-3 py-2 bg-gray-50 border rounded-lg">
                    {pending?.tanggal
                      ? new Date(pending.tanggal).toLocaleDateString('id-ID')
                      : '— (otomatis hari ini)'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Isi Laporan</p>
                  <div className="px-3 py-2 bg-gray-50 border rounded-lg whitespace-pre-wrap">
                    {pending?.isi_laporan}
                  </div>
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
                  {submitting ? 'Menyimpan…' : 'Konfirmasi & Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

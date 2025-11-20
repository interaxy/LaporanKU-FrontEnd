import React, { useEffect, useMemo, useState } from 'react';
import { API } from '../api';

// mapping status & priority → label & badge
const STATUS_LABELS = {
  open: 'Baru',
  investigating: 'Dalam Investigasi',
  resolved: 'Selesai',
  closed: 'Ditutup',
};

const PRIORITY_LABELS = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
};

const statusBadgeClass = (s) => {
  switch (s) {
    case 'open':
      return 'bg-yellow-100 text-yellow-800';
    case 'investigating':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-emerald-100 text-emerald-800';
    case 'closed':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const priorityBadgeClass = (p) => {
  switch (p) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-orange-100 text-orange-700';
    case 'low':
      return 'bg-sky-100 text-sky-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Collapsible section
const CollapsibleSection = ({ title, count, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left rounded-t-lg hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          <span className="text-xs text-gray-500">({count} issue)</span>
        </div>
        <span className="text-gray-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="border-t border-gray-100">{children}</div>}
    </div>
  );
};

// List item
const IssueListItem = ({ issue, canManage, onChangeStatus, onDelete }) => {
  const createdAt = issue.created_at ? new Date(issue.created_at) : null;

  return (
    <div className="flex items-start justify-between px-4 py-3 border-b last:border-b-0 hover:bg-gray-50">
      <div className="flex-1 pr-4 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-gray-800 break-words">
            {issue.title}
          </p>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusBadgeClass(
              issue.status
            )}`}
          >
            {STATUS_LABELS[issue.status] || issue.status}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${priorityBadgeClass(
              issue.priority
            )}`}
          >
            {PRIORITY_LABELS[issue.priority] || issue.priority}
          </span>
        </div>
        {issue.description && (
          <p className="text-xs text-gray-700 mb-1 break-words">
            {issue.description}
          </p>
        )}
        <p className="text-[11px] text-gray-500">
          Dibuat oleh:{' '}
          <span className="font-medium">{issue.created_by_name || '-'}</span>
          {createdAt && <> · {createdAt.toLocaleString('id-ID')}</>}
        </p>
      </div>

      {canManage && (
        <div className="flex flex-col items-end gap-2 text-xs ml-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => onChangeStatus(issue)}
            className="text-blue-600 hover:underline"
          >
            Ubah Status
          </button>
          <button
            type="button"
            onClick={() => onDelete(issue)}
            className="text-red-600 hover:underline"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default function Issues({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // form tambah issue
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  // konfirmasi tambah
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // modal ubah status
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusValue, setStatusValue] = useState('open');
  const [changingStatus, setChangingStatus] = useState(false);

  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  const currentUserId = user?.id;

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await API.get('/issues');
      setItems(data);
    } catch (e) {
      console.error(e);
      setErr('Gagal memuat issue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // submit form tambah → buka modal konfirmasi
  const onSubmitAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Judul issue wajib diisi');
      return;
    }
    setPending({ ...form });
    setConfirmOpen(true);
  };

  const doAddConfirmed = async () => {
    if (!pending) return;
    setSubmitting(true);
    try {
      const { data } = await API.post('/issues', {
        title: pending.title,
        description: pending.description,
        priority: pending.priority,
      });
      setItems((prev) => [data, ...prev]);
      setForm({ title: '', description: '', priority: 'medium' });
      setPending(null);
      setConfirmOpen(false);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || 'Gagal menambah issue');
    } finally {
      setSubmitting(false);
    }
  };

  // MODAL UBAH STATUS
  const openStatusModal = (issue) => {
    setStatusTarget(issue);
    setStatusValue(issue.status || 'open');
    setStatusModalOpen(true);
  };

  const doChangeStatus = async () => {
    if (!statusTarget) return;
    setChangingStatus(true);
    try {
      const { data } = await API.put(`/issues/${statusTarget.id}`, {
        status: statusValue,
      });
      setItems((prev) => prev.map((it) => (it.id === statusTarget.id ? data : it)));
      setStatusModalOpen(false);
      setStatusTarget(null);
    } catch (e) {
      console.error(e);
      alert('Gagal mengubah status');
    } finally {
      setChangingStatus(false);
    }
  };

  const handleDelete = async (issue) => {
    if (!window.confirm(`Hapus issue "${issue.title}"?`)) return;
    try {
      await API.delete(`/issues/${issue.id}`);
      setItems((prev) => prev.filter((it) => it.id !== issue.id));
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus issue');
    }
  };

  // statistik
  const stats = useMemo(() => {
    const s = { open: 0, investigating: 0, resolved: 0, closed: 0 };
    items.forEach((it) => {
      if (s[it.status] !== undefined) s[it.status]++;
    });
    return s;
  }, [items]);

  // kelompokkan per status
  const openIssues = items.filter(
    (i) => i.status === 'open' || i.status === 'investigating'
  );
  const resolvedIssues = items.filter((i) => i.status === 'resolved');
  const closedIssues = items.filter((i) => i.status === 'closed');

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-sppa-gray-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER + KARTU STATISTIK */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Issue Tracking</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Issue Terbuka</p>
                <p className="text-2xl font-semibold text-gray-800">{stats.open}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dalam Investigasi</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats.investigating}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Selesai</p>
                <p className="text-2xl font-semibold text-gray-800">{stats.resolved}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ditutup</p>
                <p className="text-2xl font-semibold text-gray-800">{stats.closed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM TAMBAH ISSUE */}
        <form
          onSubmit={onSubmitAdd}
          className="bg-white rounded-lg shadow p-5 mb-6"
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Tambah Issue Baru
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Issue
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder="Contoh: Kebocoran pipa feedwater boiler 1"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioritas
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value }))
                }
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="Detail masalah, lokasi, kondisi, tindakan sementara, dsb."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
            >
              Tambah Issue
            </button>
          </div>
        </form>

        {/* LIST ISSUE */}
        {loading && (
          <div className="text-sm text-gray-600 mb-3">Memuat issue…</div>
        )}
        {err && <div className="text-sm text-red-600 mb-3">{err}</div>}

        <div>
          <CollapsibleSection
            title="Issue Terbuka & Dalam Investigasi"
            count={openIssues.length}
            defaultOpen
          >
            {openIssues.length > 0 ? (
              openIssues.map((it) => (
                <IssueListItem
                  key={it.id}
                  issue={it}
                  canManage={isAdmin || it.created_by_id === currentUserId}
                  onChangeStatus={openStatusModal}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="px-4 py-4 text-sm text-gray-500">
                Tidak ada issue terbuka.
              </p>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Issue Selesai"
            count={resolvedIssues.length}
            defaultOpen={false}
          >
            {resolvedIssues.length > 0 ? (
              resolvedIssues.map((it) => (
                <IssueListItem
                  key={it.id}
                  issue={it}
                  canManage={isAdmin || it.created_by_id === currentUserId}
                  onChangeStatus={openStatusModal}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="px-4 py-4 text-sm text-gray-500">
                Belum ada issue yang ditandai selesai.
              </p>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Issue Ditutup"
            count={closedIssues.length}
            defaultOpen={false}
          >
            {closedIssues.length > 0 ? (
              closedIssues.map((it) => (
                <IssueListItem
                  key={it.id}
                  issue={it}
                  canManage={isAdmin || it.created_by_id === currentUserId}
                  onChangeStatus={openStatusModal}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="px-4 py-4 text-sm text-gray-500">
                Tidak ada issue yang ditutup.
              </p>
            )}
          </CollapsibleSection>
        </div>
      </div>

      {/* MODAL KONFIRMASI TAMBAH ISSUE */}
      {confirmOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-15">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-5">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Konfirmasi Tambah Issue
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Judul</p>
                  <p className="px-3 py-2 bg-gray-50 border rounded-lg">
                    {pending?.title}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Prioritas</p>
                  <p className="px-3 py-2 bg-gray-50 border rounded-lg capitalize">
                    {PRIORITY_LABELS[pending?.priority] || pending?.priority}
                  </p>
                </div>
                {pending?.description && (
                  <div>
                    <p className="text-gray-500 mb-1">Deskripsi</p>
                    <p className="px-3 py-2 bg-gray-50 border rounded-lg whitespace-pre-wrap">
                      {pending.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                  onClick={() => {
                    setConfirmOpen(false);
                    setPending(null);
                  }}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-60"
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

      {/* MODAL UBAH STATUS ISSUE */}
      {statusModalOpen && statusTarget && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-15">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-5">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Ubah Status Issue
              </h3>

              <p className="text-sm text-gray-700 mb-3">
                <span className="font-semibold">Judul: </span>
                {statusTarget.title}
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
                  <option value="open">Baru (open)</option>
                  <option value="investigating">Dalam Investigasi</option>
                  <option value="resolved">Selesai</option>
                  <option value="closed">Ditutup</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                  onClick={() => {
                    setStatusModalOpen(false);
                    setStatusTarget(null);
                  }}
                  disabled={changingStatus}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-60"
                  onClick={doChangeStatus}
                  disabled={changingStatus}
                >
                  {changingStatus ? 'Menyimpan…' : 'Simpan Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

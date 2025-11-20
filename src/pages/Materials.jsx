// client/src/pages/Materials.jsx
import React, { useEffect, useState } from 'react';
import { API } from '../api';

const BAGIAN_OPTIONS = [
    'Boiler',
    'WWTP',
    'Water Treatment',
    'Air Compressor',
    'Genset',
    'Lainnya'
];

export default function Materials({ user }) {
    const [items, setItems] = useState([]);
    const [bagian, setBagian] = useState('Boiler');
    const [judul, setJudul] = useState('');
    const [file, setFile] = useState(null);

    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pending, setPending] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = user?.role === 'admin';

    const load = async () => {
        try {
            setLoading(true);
            const qs =
                filter === 'all'
                    ? ''
                    : `?bagian_utility=${encodeURIComponent(filter)}`;
            const { data } = await API.get(`/materials-utility${qs}`);
            setItems(data);
        } catch (e) {
            console.error(e);
            alert('Gagal memuat materi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const onSubmitUpload = (e) => {
        e.preventDefault();
        if (!bagian || !judul.trim() || !file) {
            alert('Bagian, judul, dan file wajib diisi');
            return;
        }
        setPending({ bagian_utility: bagian, judul, file });
        setConfirmOpen(true);
    };

    const doUploadConfirmed = async () => {
        if (!pending) return;
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('bagian_utility', pending.bagian_utility);
            fd.append('judul', pending.judul);
            fd.append('file', pending.file);

            await API.post('/materials-utility', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setBagian('Boiler');
            setJudul('');
            setFile(null);
            setConfirmOpen(false);
            setPending(null);
            await load();
        } catch (e) {
            console.error(e);
            alert(e?.response?.data?.message || 'Gagal mengunggah materi');
        } finally {
            setSubmitting(false);
        }
    };

    const delItem = async (id) => {
        if (!window.confirm('Hapus materi ini?')) return;
        try {
            await API.delete(`/materials-utility/${id}`);
            await load();
        } catch (e) {
            console.error(e);
            alert('Gagal menghapus materi');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Materi Utility</h2>

                {/* Filter Bagian Utility */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border ${filter === 'all'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        Semua
                    </button>
                    {BAGIAN_OPTIONS.map((b) => (
                        <button
                            key={b}
                            onClick={() => setFilter(b)}
                            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border ${filter === b
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {b}
                        </button>
                    ))}
                </div>

                {/* Form Upload – hanya admin */}
                {isAdmin && (
                    <form
                        onSubmit={onSubmitUpload}
                        className="bg-white rounded-lg shadow-md p-5 mb-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bagian Utility
                                </label>
                                <select
                                    value={bagian}
                                    onChange={(e) => setBagian(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                >
                                    {BAGIAN_OPTIONS.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Judul Materi
                                </label>
                                <input
                                    type="text"
                                    placeholder="Mis. SOP Start/Stop FBC Boiler"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    value={judul}
                                    onChange={(e) => setJudul(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    File
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2.5 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-none file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-5">
                            <button
                                type="submit"
                                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm shadow hover:bg-blue-700 transition"
                            >
                                Upload Materi
                            </button>
                        </div>
                    </form>
                )}

                {/* Tabel Materi */}
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full text-xs sm:text-sm">
                        <thead>
                            <tr className="text-left bg-gray-50">
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">
                                    Bagian
                                </th>
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">
                                    Judul
                                </th>
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">
                                    File
                                </th>
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">
                                    Tanggal Upload
                                </th>
                                {isAdmin && (
                                    <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">
                                        Aksi
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 5 : 4}
                                        className="p-4 text-gray-500"
                                    >
                                        Memuat data...
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                items.map((mat) => (
                                    <tr key={mat.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-gray-700 whitespace-nowrap">
                                            {mat.bagian_utility}
                                        </td>
                                        <td className="p-4 text-gray-800">
                                            <span className="block break-words">
                                                {mat.judul}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            <a
                                                href={`http://localhost:5000${mat.path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline break-all"
                                            >
                                                {mat.nama_file}
                                            </a>
                                        </td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">
                                            {mat.uploaded_at
                                                ? new Date(mat.uploaded_at).toLocaleString('id-ID')
                                                : '-'}
                                        </td>
                                        {isAdmin && (
                                            <td className="p-4">
                                                <button
                                                    onClick={() => delItem(mat.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}

                            {!loading && items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 5 : 4}
                                        className="p-4 text-gray-500"
                                    >
                                        Belum ada materi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal konfirmasi upload */}
                {confirmOpen && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-15">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                            <div className="p-5">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                    Konfirmasi Upload Materi
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">Bagian Utility</p>
                                        <p className="px-3 py-2 bg-gray-50 border rounded-lg">
                                            {pending?.bagian_utility}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Judul</p>
                                        <p className="px-3 py-2 bg-gray-50 border rounded-lg">
                                            {pending?.judul}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Nama File</p>
                                        <p className="px-3 py-2 bg-gray-50 border rounded-lg">
                                            {pending?.file?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
                                        onClick={() => {
                                            setConfirmOpen(false);
                                            setPending(null);
                                        }}
                                        disabled={submitting}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                                        onClick={doUploadConfirmed}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Mengunggah…' : 'Konfirmasi & Upload'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

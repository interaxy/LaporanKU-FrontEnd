import React, { useEffect, useState } from 'react'
import { API } from '../api'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import {
  MoreVert,
  AssignmentInd as PersonIcon,
  Assessment as ReportIcon,
  PlaylistAddCheck as ReportDoneIcon,
  FactCheck as ReportApprovedIcon,
  BugReport as IssueIcon,
} from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'

export default function Dashboard() {
  // STATE dari API
  const [cards, setCards] = useState({ total: 0, selesai: 0, disetujui: 0 })
  const [issues, setIssues] = useState({ total: 0, open: 0, closed: 0 })
  const [monthly, setMonthly] = useState([])        // [{name, jumlah}]
  const [comparison, setComparison] = useState({ this_month: 0, last_month: 0 })
  const [activity, setActivity] = useState([])      // [{id,user,count,size,color}]
  const [history, setHistory] = useState([])        // [{id,user,deskripsi,tanggal,status}]
  const [staff, setStaff] = useState([])            // [{id,nama,detail}]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // UI State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [itemCount, setItemCount] = useState(5)
  const [tempItemCount, setTempItemCount] = useState(5)

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        const { data } = await API.get('/dashboard')
        setCards(data.cards)
        setIssues(data.issues || { total: 0, open: 0, closed: 0 })
        setMonthly(data.monthly || [])
        setComparison(data.comparison || { this_month: 0, last_month: 0 })
        setActivity(data.activity || [])
        setHistory(data.history || [])
        setStaff(data.staff || [])
      } catch (e) {
        setError(e?.response?.data?.message || 'Gagal memuat dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleOpenDialog = (title) => {
    setDialogTitle(title)
    setTempItemCount(itemCount)
    setDialogOpen(true)
  }
  const handleCloseDialog = () => setDialogOpen(false)
  const handleSaveDialog = () => { setItemCount(tempItemCount); setDialogOpen(false) }

  const getLimited = (arr) => arr.slice(0, itemCount)

  const renderCustomizedLabel = (props) => {
    const { x, y, width, payload } = props
    if (payload && payload.highlighted && payload.highlightText) {
      return (
        <text
          x={x + width / 2}
          y={y - 10}
          fill="#555"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10px"
          fontWeight="bold"
        >
          {payload.highlightText}
        </text>
      )
    }
    return null
  }

  const persen = (a, bTotal) => {
    if (!bTotal || bTotal <= 0) return 0
    return Math.max(0, Math.min(100, (a / bTotal) * 100))
  }

  const persentaseBulanIni = persen(comparison.this_month, Math.max(comparison.this_month, 1))
  const persentaseBulanLalu = persen(comparison.last_month, Math.max(comparison.last_month, 1))

  if (loading) return <div className="p-4">Memuat dashboard…</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-sppa-gray-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        {/* Cards Row - 4 kolom (stack di HP) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Jumlah Laporan */}
          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ReportIcon fontSize="medium" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Jumlah Laporan</p>
              <p className="text-2xl font-semibold text-gray-800">{cards.total}</p>
            </div>
          </div>

          {/* Laporan Selesai */}
          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <ReportDoneIcon fontSize="medium" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Laporan Selesai</p>
              <p className="text-2xl font-semibold text-gray-800">{cards.selesai}</p>
            </div>
          </div>

          {/* Laporan Disetujui */}
          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <ReportApprovedIcon fontSize="medium" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Laporan Disetujui</p>
              <p className="text-2xl font-semibold text-gray-800">{cards.disetujui}</p>
            </div>
          </div>

          {/* Issues Summary */}
          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <IssueIcon fontSize="medium" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Issues</p>
              <p className="text-2xl font-semibold text-gray-800">{issues.total}</p>
              <p className="text-xs text-gray-400 mt-1">
                {issues.open} open, {issues.closed} closed
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ringkasan Chart */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Ringkasan 12 Bulan</h2>
              </div>
              <div className="w-full h-64 sm:h-72 md:h-80 min-w-0">
                {monthly && monthly.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthly}
                      margin={{ top: 30, right: 0, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        fontSize="12px"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        fontSize="12px"
                        allowDecimals={false}
                      />
                      <Bar dataKey="jumlah" radius={[4, 4, 0, 0]} barSize={25}>
                        {monthly.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#93C5FD" />
                        ))}
                        <LabelList
                          dataKey="highlightText"
                          content={renderCustomizedLabel}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    Belum ada data laporan bulanan.
                  </div>
                )}
              </div>
            </div>

            {/* Riwayat Laporan */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Riwayat Laporan</h2>
                <button
                  onClick={() => handleOpenDialog('Riwayat Laporan')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVert fontSize="small" />
                </button>
              </div>
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="min-w-full text-sm">
                  <tbody>
                    {getLimited(history).map((lap) => (
                      <tr
                        key={lap.id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-full mr-3 flex-shrink-0">
                              <PersonIcon fontSize="small" className="text-gray-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {lap.user}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">
                                {lap.deskripsi}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs sm:text-sm text-gray-600 text-right whitespace-nowrap">
                          {lap.tanggal}
                        </td>
                        <td className="py-3 px-2 text-xs text-gray-600 text-right hidden md:table-cell whitespace-nowrap capitalize">
                          {lap.status}
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-3 px-2 text-center text-sm text-gray-500">
                          Belum ada riwayat laporan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Aktivitas */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Aktivitas</h2>
              <div className="relative h-64 flex items-center justify-center overflow-hidden">
                {activity.length === 0 && (
                  <p className="text-sm text-gray-500">Belum ada data aktivitas.</p>
                )}
                {activity.map((item, idx) => {
                  let sizeClass =
                    item.size === 'large'
                      ? 'w-36 h-36 text-sm'
                      : item.size === 'medium'
                        ? 'w-28 h-28 text-xs'
                        : 'w-24 h-24 text-xs'
                  let positionClass =
                    idx === 0
                      ? 'z-10 transform scale-100'
                      : idx === 1
                        ? 'absolute top-[-20px] right-[10px] z-0 transform scale-90'
                        : 'absolute bottom-[-15px] left-[15px] z-0 transform scale-75'
                  return (
                    <div
                      key={item.id}
                      className={`${item.color} ${sizeClass} ${positionClass} rounded-full flex flex-col items-center justify-center text-black p-2 shadow-lg`}
                    >
                      <span className="font-bold block">{item.count} laporan</span>
                      <span className="text-xs block text-center break-words px-1">
                        {item.user}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Perbandingan (Bulan) */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Perbandingan (Bulan)</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Bulan ini ({comparison.this_month})
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${persentaseBulanIni}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Bulan lalu ({comparison.last_month})
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gray-700 h-2.5 rounded-full"
                      style={{ width: `${persentaseBulanLalu}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Karyawan (read-only) */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Data Karyawan</h2>
                <button
                  onClick={() => handleOpenDialog('Data Karyawan')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVert fontSize="small" />
                </button>
              </div>
              <div className="space-y-3">
                {getLimited(staff).map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="p-2 bg-gray-100 rounded-full mr-3 flex-shrink-0">
                        <PersonIcon fontSize="small" className="text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {k.nama}
                      </p>
                    </div>
                    <span className="text-xs capitalize text-gray-500 whitespace-nowrap">
                      {k.detail}
                    </span>
                  </div>
                ))}
                {staff.length === 0 && (
                  <p className="text-sm text-gray-500">Belum ada data karyawan.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dialog Pengaturan Jumlah Data */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="item-count-label">Jumlah Data</InputLabel>
              <Select
                labelId="item-count-label"
                value={tempItemCount}
                label="Jumlah Data"
                onChange={(e) => setTempItemCount(Number(e.target.value))}
              >
                {[3, 5, 10].map((count) => (
                  <MenuItem key={count} value={count}>
                    {count}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Batal</Button>
            <Button onClick={handleSaveDialog} variant="contained">
              Simpan
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../api'         // instance axios ke http://localhost:5000/api
import logo from '../assets/logo.png'

export default function Register() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [nama, setNama] = useState('')            // ganti "username" -> "nama" sesuai API backend
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfPassword, setShowConfPassword] = useState(false)
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMsg('')

        // validasi sederhana
        if (password !== confPassword) {
            setMsg('Konfirmasi kata sandi tidak cocok')
            return
        }
        if (password.length < 8) {
            setMsg('Kata sandi minimal 8 karakter')
            return
        }

        try {
            setLoading(true)
            // API backend expects: { nama, email, password, role? }
            await API.post('/auth/register', {
                nama,
                email,
                password,
                role: 'user'      // default user biasa; admin tetap buat via admin panel/SQL
            })

            // sukses → alihkan ke halaman login
            navigate('/login')
        } catch (error) {
            const serverMsg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'Pendaftaran gagal, coba lagi'
            setMsg(serverMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="LaporanKU Logo" className="h-12" />
                </div>

                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
                    Pendaftaran
                </h1>

                <form onSubmit={handleSubmit}>
                    {msg && <p className="mb-3 text-sm text-red-600">{msg}</p>}

                    {/* Email */}
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Nama (username tampilan) */}
                    <div className="mb-6">
                        <label htmlFor="nama" className="block text-sm text-gray-600 mb-2">
                            Nama
                        </label>
                        <input
                            type="text"
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-sm text-gray-600">
                                Kata Sandi
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-sm text-gray-500 flex items-center hover:text-blue-500 transition duration-300"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                            showPassword
                                                ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                                                : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                        }
                                    />
                                </svg>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-2">
                        <div className="flex justify-between items-center mb-2">
                            <label
                                htmlFor="confPassword"
                                className="block text-sm text-gray-600"
                            >
                                Konfirmasi Kata Sandi
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowConfPassword(!showConfPassword)}
                                className="text-sm text-gray-500 flex items-center hover:text-blue-500 transition duration-300"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                            showConfPassword
                                                ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                                                : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                        }
                                    />
                                </svg>
                                {showConfPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <input
                            type={showConfPassword ? 'text' : 'password'}
                            id="confPassword"
                            value={confPassword}
                            onChange={(e) => setConfPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Tips password */}
                    <div className="mb-8 space-y-2">
                        <div className="flex items-center text-xs text-gray-500">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mr-2" />
                            Minimal 8 karakter
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mr-2" />
                            Menggunakan angka 0-9
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mr-2" />
                            Disarankan huruf besar
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mr-2" />
                            Menggunakan simbol (@#$%)
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-60"
                    >
                        {loading ? 'Mendaftar...' : 'Daftar'}
                    </button>

                    {/* Terms */}
                    <p className="mt-4 mb-6 text-xs text-center text-gray-600">
                        By creating an account, you agree to the{' '}
                        <a href="#" className="text-gray-800">
                            Terms of use
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-gray-800">
                            Privacy Policy
                        </a>
                        .
                    </p>

                    {/* Link Login */}
                    <div className="text-center">
                        <p className="text-gray-700">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="font-semibold text-black">
                                Masuk
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

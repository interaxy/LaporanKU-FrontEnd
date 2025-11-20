import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../api'
import logoDefault from '../assets/logo.png' // ⬅️ pakai jika logoSrc tidak dikirim via props
// ⬇️ Jika kamu pakai Redux, buka komentar di bawah & pastikan authSlice ada
// import { useDispatch, useSelector } from 'react-redux'
// import { LoginUser, reset } from '../features/authSlice'

/**
 * Props:
 * - onLogin?: function(token, user)          // callback dari App untuk menyimpan token/user
 * - logoSrc?: string                         // optional, path logo (mis. '/logo.png' atau import)
 */
export default function Login({ onLogin, logoSrc }) {
  const navigate = useNavigate()
  // const dispatch = useDispatch()                     // (Redux) buka jika dipakai
  // const { user: reduxUser, isError, isSuccess, isLoading, message } = useSelector((s) => s.auth) // (Redux)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState('')
  const [isLoadingLocal, setIsLoadingLocal] = useState(false)

  // (Redux) Auto-navigate jika sukses via Redux
  // useEffect(() => {
  //   if (reduxUser || isSuccess) {
  //     navigate('/dashboard')
  //     dispatch(reset())
  //   }
  // }, [reduxUser, isSuccess, dispatch, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setIsLoadingLocal(true)
    try {
      // === Tanpa Redux: panggil API langsung ===
      const { data } = await API.post('/auth/login', { email, password })
      // jika parent menyediakan onLogin (seperti di App.jsx template kita), gunakan itu
      if (typeof onLogin === 'function') {
        onLogin(data.token, data.user)
      } else {
        // fallback: simpan ke localStorage & navigate
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      }

      // === Jika ingin pakai Redux, gunakan ini & hapus blok di atas ===
      // dispatch(LoginUser({ email, password }))
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    } finally {
      setIsLoadingLocal(false)
    }
  }

  // gabung status loading: kalau pakai Redux kamu bisa ganti jadi: const isLoading = isLoading || isLoadingLocal
  const isLoading = isLoadingLocal /* || isLoading */

  const logoToUse = logoSrc || logoDefault

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      {/* Card */}
      <div className="bg-white rounded-lg w-full max-w-md p-8 shadow-md">
        {/* Logo (opsional, tapi sekarang ada default) */}
        {logoToUse && (
          <div className="flex justify-center mb-6">
            <img src={logoToUse} alt="LaporanKU Logo" className="h-12" />
          </div>
        )}

        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Masuk Akun
        </h1>

        <form onSubmit={submit}>
          {(err /* || isError */) && (
            <p className="block text-sm text-red-600 mb-3">
              {err /* || message */}
            </p>
          )}

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password + toggle */}
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 mb-4 disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Masuk'}
          </button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-600 mb-6">
            By continuing, you agree to the{' '}
            <a
              href="#"
              className="text-gray-800 hover:text-blue-500 transition duration-300"
            >
              Terms of use
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="text-gray-800 hover:text-blue-500 transition duration-300"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>

        {/* Links bawah */}
        <div className="flex justify-between gap-4 text-sm">
          <Link
            to="/register"
            className="text-gray-800 hover:text-blue-500 transition duration-300 group"
          >
            Belum Punya Akun?
            <br />
            <span className="font-semibold group-hover:underline">
              Daftar di sini
            </span>
          </Link>
          <Link
            to="/forgot-password"
            className="text-gray-800 hover:text-blue-500 transition duration-300 hover:underline text-right"
          >
            Lupa Password?
          </Link>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import LandingPage from './components/LandingPage.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Sidebar from './components/Sidebar.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Reports from './pages/Reports.jsx'
import Users from './pages/Users.jsx'
import Checklists from './pages/Checklists.jsx'
import Issues from './pages/Issues.jsx'
import Materials from './pages/Materials.jsx'

import logo from './assets/logo.png'

function Layout({ children, user, onLogout }) {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar di kiri */}
      <div className="flex-shrink-0">
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* Area konten yang bisa di-scroll */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })

  const onLogin = (t, u) => {
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
    setToken(t)
    setUser(u)
    navigate('/dashboard')
  }

  const onLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const isAdmin = (user?.role || '').toLowerCase() === 'admin'

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/landingpage" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          token
            ? <Navigate to="/dashboard" />
            : <Login onLogin={onLogin} logoSrc={logo} />
        }
      />

      <Route
        path="/register"
        element={
          token
            ? <Navigate to="/dashboard" />
            : <Register />
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          token
            ? (
              <Layout user={user} onLogout={onLogout}>
                <Dashboard />
              </Layout>
            )
            : <Navigate to="/landingpage" />
        }
      />

      <Route
        path="/dashboard"
        element={
          token
            ? (
              <Layout user={user} onLogout={onLogout}>
                <Dashboard />
              </Layout>
            )
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/reports"
        element={
          token
            ? (
              <Layout user={user} onLogout={onLogout}>
                <Reports user={user} />
              </Layout>
            )
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/users"
        element={
          token && isAdmin
            ? (
              <Layout user={user} onLogout={onLogout}>
                <Users />
              </Layout>
            )
            : <Navigate to={token ? '/dashboard' : '/login'} />
        }
      />

      <Route
        path="/checklists"
        element={
          token
            ? (
              <Layout user={user} onLogout={onLogout}>
                <Checklists user={user} />
              </Layout>
            )
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/materials"
        element={
          token
            ? (
              <Layout user={user} onLogout={onLogout}>
                <Materials user={user} />
              </Layout>
            )
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/issues"
        element={
          token
            ? (
              <Layout user={user} onLogout={onLogout}>
                <Issues user={user} />
              </Layout>
            )
            : <Navigate to="/login" />
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={token ? '/dashboard' : '/landingpage'} />}
      />
    </Routes>
  )
}

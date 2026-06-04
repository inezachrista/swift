import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import api from './services/api'
import { ToastProvider } from './components/Toast'
import Login from './components/Login'
import Signup from './components/Signup'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Customers from './components/Customers'
import Vehicles from './components/Vehicles'
import Reservations from './components/Reservations'
import CustomerDashboard from './components/CustomerDashboard'
import CustomerSignup from './components/CustomerSignup'
import Staff from './components/Staff'
import Report from './components/Report'

function ProtectedRoute({ children, user }) {
  if (!user) return <Navigate to="/" replace />
  return children
}

function App() {
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    api.me()
      .then((data) => {
        if (data.user) setUser(data.user)
        if (data.customer) setCustomer(data.customer)
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  function handleLogin(userData) {
    setUser(userData)
    setCustomer(null)
  }

  function handleCustomerLogin(customerData) {
    setCustomer(customerData)
    setUser(null)
  }

  function handleLogout() {
    setUser(null)
    setCustomer(null)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> :
              customer ? <Navigate to="/my-account" replace /> :
              <Login onLogin={handleLogin} onCustomerLogin={handleCustomerLogin} />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
          <Route
            path="/my-account"
            element={
              customer ? <CustomerDashboard customer={customer} onLogout={handleLogout} /> :
              <Navigate to="/" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} onLogout={handleLogout}>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} onLogout={handleLogout}>
                  <Customers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} onLogout={handleLogout}>
                  <Vehicles />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} onLogout={handleLogout}>
                  <Reservations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} onLogout={handleLogout}>
                  <Staff />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} onLogout={handleLogout}>
                  <Report />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
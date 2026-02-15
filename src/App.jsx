import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { getBrand } from './core/brand'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Experience from './components/Experience'
import Testimonials from './components/Testimonials'
import Booking from './components/Booking'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Loader from './components/Loader'
import ServiceDetail from './components/ServiceDetail'
import StaffLogin from './components/StaffLogin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import WorkWithUs from './components/WorkWithUs'

// Erotic Brand - Lazy loaded for code splitting
const EroticApp = lazy(() => import('./erotic/EroticApp'))

// Staff Admin Pages
import AdminLayout from './pages/staff/AdminLayout'
import Reports from './pages/staff/Reports'
import CostsManagement from './pages/staff/CostsManagement'
import Reservations from './pages/staff/Reservations'
import Calendar from './pages/staff/Calendar'
import AssignedTask from './pages/staff/AssignedTask'
import ProfileSettings from './pages/staff/ProfileSettings'

// Administration Pages (Admin-only)
import AdministrationLayout from './pages/administration/AdministrationLayout'
import Reporting from './pages/administration/Reporting'
import StaticData from './pages/administration/StaticData'
import DailyData from './pages/administration/DailyData'
import DailyConfirmation from './pages/administration/DailyConfirmation'

import './App.css'

// Detect brand once at app initialization
const currentBrand = getBrand()

function HomePage({ setCursorVariant }) {
  return (
    <>
      <Hero setCursorVariant={setCursorVariant} />
      <Services setCursorVariant={setCursorVariant} />
      <About />
      <Experience />
      <Testimonials />
      <Booking setCursorVariant={setCursorVariant} />
    </>
  )
}

/**
 * CursorWrapper - Only shows custom cursor on non-staff routes
 */
function CursorWrapper({ variant }) {
  const location = useLocation()
  
  // Don't render cursor on staff/admin routes
  if (location.pathname.startsWith('/staff') || location.pathname.startsWith('/administration')) {
    return null
  }
  
  return <Cursor variant={variant} />
}

/**
 * NormalAppContent - The standard public UI (confessionbarcelona.com)
 */
function NormalAppContent({ loading, cursorVariant, setCursorVariant }) {
  return (
    <div className="app noise-overlay">
      <CursorWrapper variant={cursorVariant} />
      
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader key="loader" />
        ) : (
          <Routes>
            {/* Staff Login Route */}
            <Route path="/staff" element={<StaffLogin setCursorVariant={setCursorVariant} />} />

            {/* Staff Admin Routes - Protected, uses AdminLayout */}
            <Route
              path="/staff/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="reports" element={<Reports />} />
              <Route path="costs" element={<CostsManagement />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="assigned-task" element={<AssignedTask />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>

            {/* Administration Routes - Admin-only, uses AdministrationLayout */}
            <Route
              path="/administration/*"
              element={
                <AdminProtectedRoute>
                  <AdministrationLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="reporting" replace />} />
              <Route path="reporting" element={<Reporting />} />
              <Route path="static-data" element={<StaticData />} />
              <Route path="daily-data" element={<DailyData />} />
              <Route path="daily-confirmation" element={<DailyConfirmation />} />
            </Route>

            {/* Public Routes - With Navbar/Footer */}
            <Route 
              path="/*" 
              element={
                <motion.div
                  key="main"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Navbar setCursorVariant={setCursorVariant} />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage setCursorVariant={setCursorVariant} />} />
                      <Route path="/service/:serviceId" element={<ServiceDetail setCursorVariant={setCursorVariant} />} />
                      <Route path="/work-with-us" element={<WorkWithUs setCursorVariant={setCursorVariant} />} />
                    </Routes>
                  </main>
                  <Footer setCursorVariant={setCursorVariant} />
                </motion.div>
              }
            />
          </Routes>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * EroticAppContent - The erotic brand UI (confessionerotic.com)
 * Staff routes are shared between both brands
 */
function EroticAppContent({ loading, setCursorVariant }) {
  const location = useLocation()
  
  // Staff/Admin routes are shared between both brands
  const isStaffRoute = location.pathname.startsWith('/staff') || location.pathname.startsWith('/administration')
  
  if (isStaffRoute) {
    // Render staff routes without erotic styling
    return (
      <div className="app noise-overlay">
        <AnimatePresence mode="wait">
          {loading ? (
            <Loader key="loader" />
          ) : (
            <Routes>
              {/* Staff Login Route */}
              <Route path="/staff" element={<StaffLogin setCursorVariant={setCursorVariant} />} />

              {/* Staff Admin Routes - Protected, uses AdminLayout */}
              <Route
                path="/staff/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="reports" element={<Reports />} />
                <Route path="costs" element={<CostsManagement />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="assigned-task" element={<AssignedTask />} />
                <Route path="profile" element={<ProfileSettings />} />
              </Route>

              {/* Administration Routes - Admin-only, uses AdministrationLayout */}
              <Route
                path="/administration/*"
                element={
                  <AdminProtectedRoute>
                    <AdministrationLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<Navigate to="reporting" replace />} />
                <Route path="reporting" element={<Reporting />} />
                <Route path="static-data" element={<StaticData />} />
                <Route path="daily-data" element={<DailyData />} />
                <Route path="daily-confirmation" element={<DailyConfirmation />} />
              </Route>

              {/* Redirect any other route to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Render Erotic public UI
  return (
    <Suspense fallback={<Loader />}>
      <EroticApp />
    </Suspense>
  )
}

function AppContent() {
  const [loading, setLoading] = useState(true)
  const [cursorVariant, setCursorVariant] = useState('default')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Render based on brand
  if (currentBrand === 'erotic') {
    return <EroticAppContent loading={loading} setCursorVariant={setCursorVariant} />
  }

  return <NormalAppContent loading={loading} cursorVariant={cursorVariant} setCursorVariant={setCursorVariant} />
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BookingProvider>
          <Router>
            <AppContent />
          </Router>
        </BookingProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App

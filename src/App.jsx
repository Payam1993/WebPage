import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
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
import OurTeam from './components/OurTeam'

// Staff Admin Pages
import AdminLayout from './pages/staff/AdminLayout'
import Reports from './pages/staff/Reports'
import CostsManagement from './pages/staff/CostsManagement'
import Reservations from './pages/staff/Reservations'
import Calendar from './pages/staff/Calendar'
import ProfileSettings from './pages/staff/ProfileSettings'

// Administration Pages (Admin-only)
import AdministrationLayout from './pages/administration/AdministrationLayout'
import Reporting from './pages/administration/Reporting'
import StaticData from './pages/administration/StaticData'
import DailyData from './pages/administration/DailyData'
import DailyConfirmation from './pages/administration/DailyConfirmation'

import './App.css'

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

function AppContent() {
  const [loading, setLoading] = useState(true)
  const [cursorVariant, setCursorVariant] = useState('default')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

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
                      <Route path="/our-team" element={<OurTeam setCursorVariant={setCursorVariant} />} />
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

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App

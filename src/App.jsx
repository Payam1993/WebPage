import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
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
import WorkWithUs from './components/WorkWithUs'
import OurTeam from './components/OurTeam'

// Staff Admin Pages
import AdminLayout from './pages/staff/AdminLayout'
import Reports from './pages/staff/Reports'
import CostsManagement from './pages/staff/CostsManagement'
import Reservations from './pages/staff/Reservations'
import Calendar from './pages/staff/Calendar'
import ProfileSettings from './pages/staff/ProfileSettings'

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

function App() {
  const [loading, setLoading] = useState(true)
  const [cursorVariant, setCursorVariant] = useState('default')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <LanguageProvider>
      <Router>
        <div className="app noise-overlay">
          <Cursor variant={cursorVariant} />
          
          <AnimatePresence mode="wait">
            {loading ? (
              <Loader key="loader" />
            ) : (
              <Routes>
                {/* Staff Admin Routes - No Navbar/Footer, uses AdminLayout */}
                <Route 
                  path="/staff" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/staff/reports" replace />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="costs" element={<CostsManagement />} />
                  <Route path="reservations" element={<Reservations />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="profile" element={<ProfileSettings />} />
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
                          <Route path="/staff-login" element={<StaffLogin setCursorVariant={setCursorVariant} />} />
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
      </Router>
    </LanguageProvider>
  )
}

export default App

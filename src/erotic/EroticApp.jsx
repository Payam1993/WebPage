/**
 * Erotic Brand - Main App Component
 * 
 * Entry point for the erotic brand UI.
 * Only renders on confessionerotic.com hostname.
 * Reuses existing backend for booking functionality.
 */

import { useState, useEffect } from 'react'
import { EroticLanguageProvider } from './context/EroticLanguageContext'
import { EroticBookingProvider } from './context/EroticBookingContext'
import { Navbar, Hero, Footer, AgeVerification, Loader } from './components'
import { Services, About, Experience, Testimonials, Booking } from './sections'
import './styles/index.css'

const EroticApp = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAgeVerified, setIsAgeVerified] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')

  // Check for existing age verification in localStorage
  useEffect(() => {
    const verified = localStorage.getItem('erotic_age_verified')
    if (verified === 'true') {
      setIsAgeVerified(true)
    }
  }, [])

  // Handle loader completion
  const handleLoaderComplete = () => {
    setIsLoading(false)
  }

  // Handle age verification
  const handleAgeVerification = (verified) => {
    if (verified) {
      localStorage.setItem('erotic_age_verified', 'true')
      setIsAgeVerified(true)
    } else {
      // Redirect away from site
      window.location.href = 'https://google.com'
    }
  }

  return (
    <EroticLanguageProvider>
      <EroticBookingProvider>
        <div className="erotic-app">
          {/* Initial Loading Screen */}
          {isLoading && (
            <Loader onComplete={handleLoaderComplete} />
          )}

          {/* Age Verification Gate */}
          {!isLoading && !isAgeVerified && (
            <AgeVerification onVerify={handleAgeVerification} />
          )}

          {/* Main Content (only shown after age verification) */}
          {!isLoading && isAgeVerified && (
            <>
              <Navbar setCursorVariant={setCursorVariant} />
              
              <main className="erotic-main">
                <Hero setCursorVariant={setCursorVariant} />
                <Services setCursorVariant={setCursorVariant} />
                <About />
                <Experience />
                <Testimonials />
                <Booking />
              </main>
              
              <Footer setCursorVariant={setCursorVariant} />
            </>
          )}
        </div>
      </EroticBookingProvider>
    </EroticLanguageProvider>
  )
}

export default EroticApp

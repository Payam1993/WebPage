/**
 * Erotic Brand - Main App Component
 * Entry point for erotic brand UI on confessionerotic.com
 * Uses same backend as normal version for booking
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

  // Check for existing age verification
  useEffect(() => {
    const verified = localStorage.getItem('erotic_age_verified')
    if (verified === 'true') {
      setIsAgeVerified(true)
    }
  }, [])

  const handleLoaderComplete = () => {
    setIsLoading(false)
  }

  const handleAgeVerification = (verified) => {
    if (verified) {
      localStorage.setItem('erotic_age_verified', 'true')
      setIsAgeVerified(true)
    } else {
      window.location.href = 'https://google.com'
    }
  }

  return (
    <EroticLanguageProvider>
      <EroticBookingProvider>
        <div className="erotic-app">
          {/* Loading Screen */}
          {isLoading && (
            <Loader onComplete={handleLoaderComplete} />
          )}

          {/* Age Verification Gate */}
          {!isLoading && !isAgeVerified && (
            <AgeVerification onVerify={handleAgeVerification} />
          )}

          {/* Main Content */}
          {!isLoading && isAgeVerified && (
            <>
              <Navbar />
              <main>
                <Hero />
                <Services />
                <About />
                <Experience />
                <Testimonials />
                <Booking />
              </main>
              <Footer />
            </>
          )}
        </div>
      </EroticBookingProvider>
    </EroticLanguageProvider>
  )
}

export default EroticApp

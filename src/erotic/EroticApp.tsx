import React from 'react'
import { Layout } from './components'
import { Hero, Experience, Services, Contact } from './sections'
import './styles/erotic.css'

/**
 * EroticApp - Main entry component for the Erotic brand
 * 
 * This component is rendered when the hostname includes confessionerotic.com.
 * It provides a completely isolated UI from the normal public site.
 * 
 * Design: Dark luxury aesthetic with deep red accents and gold highlights.
 * Tone: Dominant, sensual, powerful - suggestive but non-explicit.
 */
const EroticApp: React.FC = () => {
  return (
    <div className="erotic-app">
      <Layout>
        <Hero />
        <Experience />
        <Services />
        <Contact />
      </Layout>
    </div>
  )
}

export default EroticApp

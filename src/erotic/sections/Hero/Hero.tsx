import React, { useEffect, useState } from 'react'
import './Hero.css'

/**
 * Hero - Full-screen hero section for the Erotic brand
 * 
 * Dark, atmospheric design with powerful messaging
 */
const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="erotic-hero">
      {/* Background Effects */}
      <div className="erotic-hero-bg">
        <div className="erotic-hero-gradient" />
        <div className="erotic-hero-vignette" />
        <div className="erotic-hero-particles" />
      </div>

      {/* Content */}
      <div className={`erotic-hero-content ${isVisible ? 'erotic-hero-content--visible' : ''}`}>
        <div className="erotic-container">
          {/* Preheading */}
          <p className="erotic-hero-preheading">
            <span className="erotic-hero-preheading-line" />
            Barcelona's Most Exclusive
            <span className="erotic-hero-preheading-line" />
          </p>

          {/* Main Heading */}
          <h1 className="erotic-hero-title">
            <span className="erotic-hero-title-main">Surrender to</span>
            <span className="erotic-hero-title-accent">Sensation</span>
          </h1>

          {/* Subheading */}
          <p className="erotic-hero-subtitle">
            An intimate sanctuary where desire meets artistry.
            <br />
            Experience the exquisite tension between control and release.
          </p>

          {/* CTA Buttons */}
          <div className="erotic-hero-cta">
            <button 
              className="erotic-btn erotic-btn-primary"
              onClick={() => scrollToSection('contact')}
            >
              Discover More
            </button>
            <button 
              className="erotic-btn erotic-btn-secondary"
              onClick={() => scrollToSection('services')}
            >
              Our Experiences
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="erotic-hero-scroll">
            <span className="erotic-hero-scroll-text">Explore</span>
            <div className="erotic-hero-scroll-line" />
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="erotic-hero-corner erotic-hero-corner--top-left" />
      <div className="erotic-hero-corner erotic-hero-corner--top-right" />
      <div className="erotic-hero-corner erotic-hero-corner--bottom-left" />
      <div className="erotic-hero-corner erotic-hero-corner--bottom-right" />
    </section>
  )
}

export default Hero

import React from 'react'
import './Services.css'

/**
 * Services - Services section for the Erotic brand
 * 
 * Showcases exclusive experiences with sophisticated presentation
 */
const Services: React.FC = () => {
  const services = [
    {
      number: '01',
      title: 'Sensual Awakening',
      subtitle: 'The Classic Journey',
      description: 'A masterful exploration of touch that awakens every nerve. Our signature experience designed to heighten awareness and deepen connection with your body.',
      duration: '90 min',
      highlight: 'Most Popular'
    },
    {
      number: '02',
      title: 'Tantric Immersion',
      subtitle: 'Ancient Wisdom',
      description: 'Drawing from centuries-old practices, this transformative session guides you through breathwork, energy circulation, and profound relaxation.',
      duration: '120 min',
      highlight: null
    },
    {
      number: '03',
      title: 'Dominance & Surrender',
      subtitle: 'Power Exchange',
      description: 'For those who crave the exquisite tension of control. A carefully choreographed dance of power, where trust becomes the ultimate intimacy.',
      duration: '90-120 min',
      highlight: 'Premium'
    },
    {
      number: '04',
      title: 'Couples Ceremony',
      subtitle: 'Shared Ecstasy',
      description: 'Reignite passion with your partner in a guided experience designed to deepen your bond and explore new dimensions of pleasure together.',
      duration: '150 min',
      highlight: null
    }
  ]

  return (
    <section id="services" className="erotic-services">
      {/* Background Accent */}
      <div className="erotic-services-bg-accent" />
      
      <div className="erotic-container">
        {/* Section Header */}
        <div className="erotic-services-header">
          <span className="erotic-services-label">Our Offerings</span>
          <h2 className="erotic-services-title">
            Exclusive <span className="erotic-accent-text">Experiences</span>
          </h2>
          <p className="erotic-services-subtitle">
            Each session is a journey into sensation, carefully crafted 
            to transcend the boundaries of ordinary pleasure.
          </p>
        </div>

        {/* Services List */}
        <div className="erotic-services-list">
          {services.map((service, index) => (
            <div key={index} className="erotic-service-item">
              <div className="erotic-service-number">{service.number}</div>
              <div className="erotic-service-content">
                <div className="erotic-service-header">
                  <div>
                    <h3 className="erotic-service-title">{service.title}</h3>
                    <span className="erotic-service-subtitle">{service.subtitle}</span>
                  </div>
                  <div className="erotic-service-meta">
                    {service.highlight && (
                      <span className="erotic-service-badge">{service.highlight}</span>
                    )}
                    <span className="erotic-service-duration">{service.duration}</span>
                  </div>
                </div>
                <p className="erotic-service-description">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="erotic-services-note">
          All experiences are customizable. Pricing discussed during consultation.
        </p>
      </div>
    </section>
  )
}

export default Services

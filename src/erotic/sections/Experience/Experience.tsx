import React from 'react'
import './Experience.css'

/**
 * Experience - About/Experience section for the Erotic brand
 * 
 * Describes the exclusive nature of the experience
 */
const Experience: React.FC = () => {
  const features = [
    {
      icon: '◆',
      title: 'Absolute Discretion',
      description: 'Your privacy is sacred. Every encounter exists only in the moment, protected by our unwavering commitment to confidentiality.'
    },
    {
      icon: '◇',
      title: 'Curated Excellence',
      description: 'Each practitioner is selected for their mastery of sensual arts, creating experiences that transcend the ordinary.'
    },
    {
      icon: '◈',
      title: 'Bespoke Encounters',
      description: 'No two sessions are alike. Every experience is tailored to your deepest desires and boundaries.'
    }
  ]

  return (
    <section id="experience" className="erotic-experience">
      <div className="erotic-container">
        {/* Section Header */}
        <div className="erotic-experience-header">
          <span className="erotic-experience-label">The Experience</span>
          <h2 className="erotic-experience-title">
            Beyond the <span className="erotic-accent-text">Ordinary</span>
          </h2>
          <p className="erotic-experience-subtitle">
            Step into a realm where sophistication meets sensuality. 
            Our sanctuary offers an escape from the mundane—a space where 
            your fantasies are honored, your boundaries respected, and your 
            pleasure paramount.
          </p>
        </div>

        {/* Features Grid */}
        <div className="erotic-experience-grid">
          {features.map((feature, index) => (
            <div key={index} className="erotic-experience-card">
              <span className="erotic-experience-card-icon">{feature.icon}</span>
              <h3 className="erotic-experience-card-title">{feature.title}</h3>
              <p className="erotic-experience-card-text">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="erotic-experience-quote">
          <div className="erotic-ornament">
            <span className="erotic-ornament-icon">✦</span>
          </div>
          <p>
            "The art of pleasure lies not in the act itself, 
            but in the anticipation, the tension, the exquisite 
            delay before release."
          </p>
        </blockquote>
      </div>
    </section>
  )
}

export default Experience

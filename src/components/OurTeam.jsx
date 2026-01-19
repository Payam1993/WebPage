import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { therapistsData } from '../data/therapists'
import { serviceTranslations } from '../data/services'
import './OurTeam.css'

const TherapistCard = ({ therapist, index, setCursorVariant, language, t }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-50px" })
  const navigate = useNavigate()
  
  const serviceTexts = serviceTranslations[language]
  
  const getSpecialtyNames = () => {
    return therapist.specialties.map(specialty => 
      serviceTexts[specialty]?.name || specialty
    )
  }

  const handleBookClick = () => {
    navigate(`/service/${therapist.specialties[0]}`)
  }

  return (
    <motion.div
      ref={cardRef}
      className="therapist-card"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      <div className="therapist-image-wrapper">
        <div className="therapist-image">
          <img src={therapist.image} alt={therapist.name} loading="lazy" />
        </div>
        <div className="therapist-experience">
          <span className="exp-number">{therapist.experience}</span>
          <span className="exp-text">{t.ourTeam?.experience || 'years experience'}</span>
        </div>
      </div>
      
      <div className="therapist-content">
        <h3 className="therapist-name">{therapist.name}</h3>
        
        <p className="therapist-bio">
          {therapist.bio[language] || therapist.bio.en}
        </p>
        
        <div className="therapist-details">
          <div className="detail-section">
            <h4>{t.ourTeam?.specialties || 'Specialties'}</h4>
            <div className="specialty-tags">
              {getSpecialtyNames().map((name, i) => (
                <span key={i} className="specialty-tag">{name}</span>
              ))}
            </div>
          </div>
          
          <div className="detail-section">
            <h4>{t.ourTeam?.certifications || 'Certifications'}</h4>
            <ul className="certification-list">
              {therapist.certifications.map((cert, i) => (
                <li key={i}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="detail-section languages-section">
            <h4>{t.ourTeam?.languages || 'Languages'}</h4>
            <p className="languages">{therapist.languages.join(' • ')}</p>
          </div>
        </div>
        
        <button 
          className="btn btn-primary book-therapist-btn"
          onClick={handleBookClick}
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          {t.ourTeam?.bookWith || 'Book with'} {therapist.name.split(' ')[0]}
        </button>
      </div>
    </motion.div>
  )
}

const OurTeam = ({ setCursorVariant }) => {
  const { language, t } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <div className="our-team-page">
      {/* Hero Section */}
      <section className="team-hero">
        <div className="team-hero-bg">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <motion.div 
            className="team-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              to="/" 
              className="back-link"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              {t.ourTeam?.backToHome || 'Back to Home'}
            </Link>
            <span className="section-overline">{t.nav?.ourTeam || 'Our Therapists'}</span>
            <h1>{t.ourTeam?.title || 'Our Professional Therapists'}</h1>
            <p className="team-hero-subtitle">{t.ourTeam?.subtitle || 'Meet the skilled hands behind your wellness journey'}</p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="team-intro" ref={sectionRef}>
        <div className="container">
          <motion.p 
            className="intro-text"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            {t.ourTeam?.intro || 'At Confession Barcelona, we take pride in our exceptional team of certified massage therapists.'}
          </motion.p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="team-grid-section">
        <div className="container">
          <div className="team-grid">
            {therapistsData.map((therapist, index) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                index={index}
                setCursorVariant={setCursorVariant}
                language={language}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="team-cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>{t.workWithUs?.interested || 'Interested in Joining Our Team?'}</h2>
            <p>{t.workWithUs?.subtitle || 'Become part of the Confession Barcelona family'}</p>
            <Link 
              to="/work-with-us" 
              className="btn btn-outline"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {t.nav?.workWithUs || 'Work With Us'}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default OurTeam


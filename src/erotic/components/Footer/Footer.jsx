/**
 * Erotic Brand - Footer Component
 * Based on Erotic_Project_Sample design
 */

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './Footer.css'

const Footer = ({ setCursorVariant }) => {
  const { t } = useEroticLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="erotic-footer">
      <div className="erotic-footer-top">
        <div className="erotic-container">
          <div className="erotic-footer-grid">
            <div className="erotic-footer-brand">
              <Link 
                to="/" 
                className="erotic-footer-logo"
                onMouseEnter={() => setCursorVariant?.('hover')}
                onMouseLeave={() => setCursorVariant?.('default')}
              >
                <span className="erotic-logo-main">Confession</span>
                <span className="erotic-logo-sub">Barcelona</span>
              </Link>
              <p className="erotic-footer-tagline">{t.footer.tagline}</p>
              <div className="erotic-footer-newsletter">
                <p>{t.footer.newsletter}</p>
                <form className="erotic-newsletter-form">
                  <input 
                    type="email" 
                    placeholder={t.booking.form.emailPlaceholder}
                    aria-label="Email for newsletter"
                  />
                  <button 
                    type="submit"
                    onMouseEnter={() => setCursorVariant?.('hover')}
                    onMouseLeave={() => setCursorVariant?.('default')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            <div className="erotic-footer-links">
              <div className="erotic-links-column">
                <h4>{t.footer.servicesTitle}</h4>
                <ul>
                  <li>
                    <a 
                      href="#services"
                      onMouseEnter={() => setCursorVariant?.('hover')}
                      onMouseLeave={() => setCursorVariant?.('default')}
                    >
                      Surrender Ritual
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#services"
                      onMouseEnter={() => setCursorVariant?.('hover')}
                      onMouseLeave={() => setCursorVariant?.('default')}
                    >
                      Discipline & Devotion
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#services"
                      onMouseEnter={() => setCursorVariant?.('hover')}
                      onMouseLeave={() => setCursorVariant?.('default')}
                    >
                      Velvet Chains
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#services"
                      onMouseEnter={() => setCursorVariant?.('hover')}
                      onMouseLeave={() => setCursorVariant?.('default')}
                    >
                      Dark Tantra
                    </a>
                  </li>
                </ul>
              </div>

              <div className="erotic-links-column">
                <h4>{t.footer.companyTitle}</h4>
                <ul>
                  {t.footer.company.map((item, index) => (
                    <li key={index}>
                      <a 
                        href={index < 2 ? "#about" : "#"}
                        onMouseEnter={() => setCursorVariant?.('hover')}
                        onMouseLeave={() => setCursorVariant?.('default')}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="erotic-links-column">
                <h4>{t.footer.supportTitle}</h4>
                <ul>
                  {t.footer.support.map((item, index) => (
                    <li key={index}>
                      <a 
                        href="#"
                        onMouseEnter={() => setCursorVariant?.('hover')}
                        onMouseLeave={() => setCursorVariant?.('default')}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="erotic-footer-bottom">
        <div className="erotic-container">
          <div className="erotic-footer-bottom-content">
            <p className="erotic-copyright">
              © {currentYear} Confession Barcelona. {t.footer.copyright}
            </p>
            
            <div className="erotic-footer-social">
              <a 
                href="#" 
                aria-label="Instagram"
                onMouseEnter={() => setCursorVariant?.('hover')}
                onMouseLeave={() => setCursorVariant?.('default')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="Facebook"
                onMouseEnter={() => setCursorVariant?.('hover')}
                onMouseLeave={() => setCursorVariant?.('default')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/34678902765" 
                aria-label="WhatsApp"
                onMouseEnter={() => setCursorVariant?.('hover')}
                onMouseLeave={() => setCursorVariant?.('default')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
              </a>
            </div>

            <p className="erotic-made-with">
              {t.footer.madeWith} <span className="erotic-heart">♥</span> {t.footer.inBarcelona}
            </p>
          </div>
        </div>
      </div>

      <motion.div 
        className="erotic-back-to-top"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <a 
          href="#"
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
          aria-label="Back to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </a>
      </motion.div>
    </footer>
  )
}

export default Footer

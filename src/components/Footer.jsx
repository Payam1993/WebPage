import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { servicesData, serviceTranslations } from '../data/services'
import './Footer.css'

const Footer = ({ setCursorVariant }) => {
  const { language, t } = useLanguage()
  const currentYear = new Date().getFullYear()
  
  const serviceTexts = serviceTranslations[language]
  const serviceNames = servicesData.slice(0, 4).map(service => serviceTexts[service.id]?.name || service.id)

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link 
                to="/" 
                className="footer-logo"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <span className="logo-main">Confession</span>
                <span className="logo-sub">Barcelona</span>
              </Link>
              <p className="footer-tagline">{t.footer.tagline}</p>
              <div className="footer-newsletter">
                <p>{t.footer.newsletter}</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder={t.booking.form.emailPlaceholder}
                    aria-label="Email for newsletter"
                  />
                  <button 
                    type="submit"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            <div className="footer-links">
              <div className="links-column">
                <h4>{t.footer.servicesTitle}</h4>
                <ul>
                  {serviceNames.map((name, index) => (
                    <li key={index}>
                      <a 
                        href="#services"
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4>{t.footer.companyTitle}</h4>
                <ul>
                  {t.footer.company.map((item, index) => (
                    <li key={index}>
                      <a 
                        href={index < 2 ? "#about" : "#"}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4>{t.footer.supportTitle}</h4>
                <ul>
                  {t.footer.support.map((item, index) => (
                    <li key={index}>
                      <a 
                        href="#"
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
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

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Confession Barcelona. {t.footer.copyright}
            </p>
            
            <div className="footer-social">
              <a 
                href="#" 
                aria-label="Instagram"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
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
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="Pinterest"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12c0-4 4-8 8-8"/>
                  <path d="M12 16c0 4-2 6-4 6"/>
                </svg>
              </a>
            </div>

            <p className="made-with">
              {t.footer.madeWith} <span className="heart">♥</span> {t.footer.inBarcelona}
            </p>
          </div>
        </div>
      </div>

      <motion.div 
        className="back-to-top"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <a 
          href="#"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
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

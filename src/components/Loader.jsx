import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { websiteHomeImageAPI, websiteImageAPI } from '../services/dataService'
import { WEBSITE_LOGO_SLOT } from '../utils/websiteImages'
import './Loader.css'

/** Built-in entrance mark — used when no WebsiteHomeImage slot=logo is uploaded */
const DefaultLogoSvg = () => (
  <svg viewBox="0 0 100 100" className="loader-symbol">
    <motion.circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="var(--color-gold)"
      strokeWidth="0.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    />
    <motion.path
      d="M50 20 C30 35, 30 65, 50 80 C70 65, 70 35, 50 20"
      fill="none"
      stroke="var(--color-terracotta)"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
    />
    <motion.circle
      cx="50"
      cy="50"
      r="5"
      fill="var(--color-gold)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    />
  </svg>
)

const Loader = () => {
  // Only set after the remote image has successfully decoded — SVG stays until then
  const [logoSrc, setLogoSrc] = useState(null)

  useEffect(() => {
    let cancelled = false
    let preload = null

    ;(async () => {
      try {
        const rows = await websiteHomeImageAPI.listPublic()
        const logoKey = (rows || []).find(
          (r) => r.slot === WEBSITE_LOGO_SLOT.id
        )?.imageKey
        if (!logoKey || cancelled) return

        const url = await websiteImageAPI.getUrl(logoKey)
        if (!url || cancelled) return

        // Preload so a slow/broken object never blanks the loader mark
        preload = new Image()
        preload.onload = () => {
          if (!cancelled) setLogoSrc(url)
        }
        preload.onerror = () => {
          // Keep default SVG (broken/missing S3 object)
          if (!cancelled) setLogoSrc(null)
        }
        preload.src = url
      } catch (err) {
        console.error('[Loader] logo load failed — using default SVG', err)
      }
    })()

    return () => {
      cancelled = true
      if (preload) {
        preload.onload = null
        preload.onerror = null
      }
    }
  }, [])

  return (
    <motion.div
      className="loader"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loader-content">
        <motion.div
          className="loader-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Lavin"
              className="loader-logo-img"
              onError={() => setLogoSrc(null)}
            />
          ) : (
            <DefaultLogoSvg />
          )}
        </motion.div>

        <motion.div
          className="loader-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="loader-title">Lavin</span>
        </motion.div>

        <motion.div
          className="loader-progress"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

export default Loader

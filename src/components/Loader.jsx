import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { websiteHomeImageAPI, websiteImageAPI } from '../services/dataService'
import { WEBSITE_LOGO_SLOT } from '../utils/websiteImages'
import './Loader.css'

const BRAND = 'Lavin'
const letters = BRAND.split('')

const letterContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.25,
    },
  },
}

const letterItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const Loader = () => {
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

        preload = new Image()
        preload.onload = () => {
          if (!cancelled) setLogoSrc(url)
        }
        preload.onerror = () => {
          if (!cancelled) setLogoSrc(null)
        }
        preload.src = url
      } catch (err) {
        console.error('[Loader] logo load failed — typographic mark only', err)
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
      transition={{ duration: 0.55, ease: 'easeInOut' }}
    >
      <div className="loader-atmosphere" aria-hidden="true" />

      <div className="loader-content">
        {logoSrc && (
          <motion.div
            className="loader-monogram"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={logoSrc}
              alt=""
              className="loader-logo-img"
              onError={() => setLogoSrc(null)}
            />
          </motion.div>
        )}

        <motion.h1
          className="loader-brand"
          variants={letterContainer}
          initial="hidden"
          animate="visible"
          aria-label={BRAND}
        >
          {letters.map((char, i) => (
            <motion.span key={`${char}-${i}`} className="loader-letter" variants={letterItem}>
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          className="loader-rule"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.p
          className="loader-tagline"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          Massage & Wellness
        </motion.p>

        <motion.div
          className="loader-progress"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

export default Loader

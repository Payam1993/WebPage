import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { websiteGalleryImageAPI, websiteImageAPI } from '../services/dataService'
import './Gallery.css'

const Gallery = () => {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-120px' })
  const [items, setItems] = useState([])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const rows = await websiteGalleryImageAPI.listPublic()
        const withUrls = await Promise.all(
          (rows || []).map(async (row) => {
            const url = await websiteImageAPI.getUrl(row.imageKey)
            if (!url) {
              console.error('[Gallery] getUrl returned null', {
                id: row.id,
                imageKey: row.imageKey,
              })
            }
            return { ...row, url }
          })
        )
        if (cancelled) return
        const ready = withUrls.filter((r) => r.url)
        if (withUrls.length > 0 && ready.length === 0) {
          console.error(
            '[Gallery] Metadata loaded but every image URL failed to resolve',
            withUrls.map((r) => r.imageKey)
          )
        }
        setItems(ready)
      } catch (err) {
        console.error('Gallery load failed:', err)
        if (!cancelled) setItems([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!lightbox) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  if (items.length === 0) {
    return null
  }

  return (
    <section id="gallery" className="gallery" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-overline">{t.gallery?.overline || 'Gallery'}</span>
          <h2>{t.gallery?.title}</h2>
          <p className="section-subtitle">{t.gallery?.subtitle}</p>
        </motion.div>

        <div className="gallery-grid">
          {items.map((item, index) => (
            <motion.button
              type="button"
              key={item.id}
              className="gallery-item"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.4) }}
              onClick={() => setLightbox(item)}
            >
              <img
                src={item.url}
                alt={t.gallery?.imageAlt || 'Confession Barcelona'}
                loading="lazy"
                decoding="async"
                onError={() => {
                  console.error('[Gallery] <img> failed to load', {
                    id: item.id,
                    imageKey: item.imageKey,
                    src: item.url,
                  })
                }}
              />
              <span className="gallery-item-veil" aria-hidden />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              ×
            </button>
            <motion.img
              src={lightbox.url}
              alt=""
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Gallery

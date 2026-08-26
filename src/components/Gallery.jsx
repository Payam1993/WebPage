import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { websiteGalleryImageAPI, websiteImageAPI } from '../services/dataService'
import './Gallery.css'

/**
 * Public homepage Gallery.
 * Always mounts <section id="gallery"> so the navbar anchor works.
 * Do not gate visibility on useInView — that left opacity at 0 when inView never flipped.
 */
const Gallery = () => {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const [items, setItems] = useState([])
  const [loadState, setLoadState] = useState({
    status: 'loading', // loading | ready | error
    totalRecords: 0,
    activeRecords: 0,
    resolvedUrls: 0,
    error: null,
  })
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const rows = await websiteGalleryImageAPI.listPublic()
        const list = rows || []
        console.info('[Gallery] public records', {
          count: list.length,
          items: list.map((r) => ({
            id: r.id,
            active: r.active,
            sortOrder: r.sortOrder,
            imageKey: r.imageKey,
          })),
        })

        const withUrls = await Promise.all(
          list.map(async (row) => {
            const url = await websiteImageAPI.getUrl(row.imageKey)
            if (!url) {
              console.error('[Gallery] getUrl returned null', {
                id: row.id,
                imageKey: row.imageKey,
              })
            } else {
              console.info('[Gallery] getUrl ok', {
                id: row.id,
                imageKey: row.imageKey,
                srcHost: (() => {
                  try {
                    return new URL(url).host
                  } catch {
                    return 'invalid-url'
                  }
                })(),
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
        setLoadState({
          status: 'ready',
          totalRecords: list.length,
          activeRecords: list.length,
          resolvedUrls: ready.length,
          error: null,
        })
      } catch (err) {
        console.error('Gallery load failed:', err)
        if (!cancelled) {
          setItems([])
          setLoadState({
            status: 'error',
            totalRecords: 0,
            activeRecords: 0,
            resolvedUrls: 0,
            error: err?.message || 'Gallery load failed',
          })
        }
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

  const title = t.gallery?.title || 'Galería'
  const showDebugEmpty =
    loadState.status !== 'loading' && items.length === 0

  return (
    <section id="gallery" className="gallery" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-overline">{t.gallery?.overline || 'Gallery'}</span>
          <h2>{title}</h2>
          <p className="section-subtitle">{t.gallery?.subtitle}</p>
        </motion.div>

        {loadState.status === 'loading' && (
          <p className="gallery-debug" aria-live="polite">
            Loading gallery…
          </p>
        )}

        {showDebugEmpty && (
          <p className="gallery-debug" aria-live="polite">
            Gallery loaded, {loadState.resolvedUrls} images
            {loadState.totalRecords > 0
              ? ` (${loadState.totalRecords} records, URLs failed to resolve)`
              : ''}
            {loadState.error ? ` — ${loadState.error}` : ''}
          </p>
        )}

        {items.length > 0 && (
          <div className="gallery-grid">
            {items.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                className="gallery-item"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.4) }}
                onClick={() => setLightbox(item)}
              >
                <img
                  src={item.url}
                  alt={t.gallery?.imageAlt || 'Lavin'}
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
        )}
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

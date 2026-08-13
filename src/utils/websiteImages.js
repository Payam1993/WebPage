/**
 * Website image helpers — S3 keys under website-images/*, client-side optimize.
 */

export const WEBSITE_HOME_SLOTS = [
  {
    id: 'about-primary',
    label: 'About — main image',
    fallback:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
  },
  {
    id: 'about-secondary',
    label: 'About — secondary image',
    fallback:
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
  },
]

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8 MB raw before optimize

export const validateImageFile = (file) => {
  if (!file) throw new Error('No file selected')
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Use JPEG, PNG, WebP, or GIF images only')
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image must be under 8 MB')
  }
  return true
}

/**
 * Resize/compress in-browser for web-friendly delivery.
 * @returns {Promise<File>}
 */
export const optimizeImageFile = (file, options = {}) => {
  const maxWidth = options.maxWidth ?? 1920
  const maxHeight = options.maxHeight ?? 1920
  const quality = options.quality ?? 0.82

  validateImageFile(file)

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const scale = Math.min(1, maxWidth / width, maxHeight / height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not process image'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not encode image'))
            return
          }
          const base = (file.name || 'image').replace(/\.[^.]+$/, '')
          const ext = outType === 'image/png' ? 'png' : 'jpg'
          resolve(new File([blob], `${base}.${ext}`, { type: outType }))
        },
        outType,
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image'))
    }
    img.src = url
  })
}

export const getHomeSlotFallback = (slotId) =>
  WEBSITE_HOME_SLOTS.find((s) => s.id === slotId)?.fallback || null

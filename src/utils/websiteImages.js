/**
 * Website image helpers — S3 keys under website-images/*, client-side optimize.
 *
 * Storage resource name must match amplify/storage/resource.ts (`confessionFiles`).
 */

export const WEBSITE_STORAGE_BUCKET = 'confessionFiles'

/** Entrance / loader logo — public fallback is the inline SVG in Loader.jsx */
export const WEBSITE_LOGO_SLOT = {
  id: 'logo',
  label: 'Logo — entrance / loader',
  fallback: null,
}

export const WEBSITE_HOME_SLOTS = [
  WEBSITE_LOGO_SLOT,
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

/** Homepage slots excluding the logo (About images, etc.) */
export const WEBSITE_HOME_CONTENT_SLOTS = WEBSITE_HOME_SLOTS.filter(
  (s) => s.id !== WEBSITE_LOGO_SLOT.id
)

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

      // Keep alpha for PNG/WebP (logos). Never force JPEG on those.
      const preferAlpha =
        file.type === 'image/png' || file.type === 'image/webp'
      const preferredType = preferAlpha
        ? file.type === 'image/webp'
          ? 'image/webp'
          : 'image/png'
        : 'image/jpeg'

      const finish = (blob, outType) => {
        if (!blob) {
          reject(new Error('Could not encode image'))
          return
        }
        const base = (file.name || 'image').replace(/\.[^.]+$/, '')
        const ext =
          outType === 'image/png' ? 'png' : outType === 'image/webp' ? 'webp' : 'jpg'
        resolve(new File([blob], `${base}.${ext}`, { type: outType }))
      }

      const encode = (outType) => {
        const q =
          outType === 'image/jpeg' || outType === 'image/webp' ? quality : undefined
        canvas.toBlob(
          (blob) => {
            if (!blob && outType === 'image/webp') {
              // Browser may not support WebP encode — keep transparency via PNG
              canvas.toBlob((pngBlob) => finish(pngBlob, 'image/png'), 'image/png')
              return
            }
            finish(blob, outType)
          },
          outType,
          q
        )
      }

      encode(preferredType)
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

/** True when value is already a usable browser URL (not an S3 object key). */
export const isDirectImageUrl = (value) =>
  typeof value === 'string' &&
  (value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:'))

/**
 * Resolve an Amplify Storage object key under website-images/* to a temporary URL.
 * Stores only keys in DynamoDB — never persist the returned URL.
 *
 * @param {string|null|undefined} imageKey e.g. website-images/gallery/123-photo.jpg
 * @returns {Promise<string|null>}
 */
export const resolveWebsiteImageUrl = async (imageKey) => {
  if (!imageKey) return null
  if (isDirectImageUrl(imageKey)) return imageKey

  const path = String(imageKey).replace(/^\//, '')
  if (!path.startsWith('website-images/')) {
    console.error('[websiteImage] Rejecting non website-images key:', path)
    return null
  }

  try {
    const { getUrl } = await import('aws-amplify/storage')
    // path API (Gen 2) — same pattern as roomPictureAPI; default bucket = confessionFiles
    const result = await getUrl({
      path,
      options: {
        expiresIn: 3600,
      },
    })
    const url = result?.url?.toString?.() || null
    if (!url) {
      console.error('[websiteImage] getUrl returned empty URL for', path)
      return null
    }
    return url
  } catch (error) {
    const message = error?.message || String(error)
    console.error('[websiteImage] getUrl failed', {
      path,
      name: error?.name,
      message,
      isIdentityForbidden: /access to identity/i.test(message),
      underlying: error?.underlyingError?.message || error?.cause?.message,
    })
    // Guest Identity ID conflict: clear and retry once (public Gallery + admin thumbs)
    if (/access to identity/i.test(message)) {
      try {
        const { clearCognitoIdentityIdCache } = await import('./cognitoIdentity')
        clearCognitoIdentityIdCache()
        const { Amplify } = await import('aws-amplify')
        await Amplify.Auth?.clearCredentials?.()
        const { getUrl } = await import('aws-amplify/storage')
        const retry = await getUrl({ path, options: { expiresIn: 3600 } })
        return retry?.url?.toString?.() || null
      } catch (retryError) {
        console.error('[websiteImage] getUrl retry after Identity clear failed', {
          path,
          message: retryError?.message,
        })
      }
    }
    return null
  }
}

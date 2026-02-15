/**
 * Brand Detection Utility
 * 
 * Determines which brand to render based on the current hostname.
 * This allows serving different UIs from the same codebase.
 */

export type Brand = 'erotic' | 'normal'

/**
 * Get the current brand based on hostname
 * 
 * @returns 'erotic' if hostname includes confessionerotic.com, 'normal' otherwise
 */
export const getBrand = (): Brand => {
  const hostname = window.location.hostname.toLowerCase()
  
  if (hostname.includes('confessionerotic.com')) {
    return 'erotic'
  }
  
  return 'normal'
}

/**
 * Check if current brand is erotic
 */
export const isEroticBrand = (): boolean => getBrand() === 'erotic'

/**
 * Check if current brand is normal
 */
export const isNormalBrand = (): boolean => getBrand() === 'normal'

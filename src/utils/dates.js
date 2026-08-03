/**
 * Local-date helpers (YYYY-MM-DD without UTC shift)
 */

export const toLocalDateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const parseLocalDateKey = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export const formatDisplayDate = (
  dateStr,
  options = { day: '2-digit', month: 'short', year: 'numeric' }
) => {
  const date = parseLocalDateKey(dateStr)
  if (!date) return '-'
  return date.toLocaleDateString('en-GB', options)
}

export const getTodayDate = () => toLocalDateKey(new Date())

export const getDateFromToday = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toLocalDateKey(date)
}

export const isWithinLastDays = (dateStr, days) => {
  const recordDate = parseLocalDateKey(dateStr)
  if (!recordDate) return false
  const cutoffDate = new Date()
  cutoffDate.setHours(0, 0, 0, 0)
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return recordDate >= cutoffDate
}

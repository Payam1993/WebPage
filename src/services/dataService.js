/**
 * Data Service - Amplify Data API wrapper
 * 
 * Provides CRUD operations for:
 * - Services (static)
 * - Costs (static)
 * - Staff (static)
 * - DailyService (daily entries)
 * - DailyCost (daily entries)
 */

import { generateClient } from 'aws-amplify/data'

// Initialize the Amplify Data client
let client = null

const getClient = () => {
  if (!client) {
    client = generateClient()
  }
  return client
}

// ============================================
// Services CRUD (Static Data)
// ============================================
export const serviceAPI = {
  async list() {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Service.list()
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing services:', error)
      throw error
    }
  },

  async create(serviceData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Service.create({
        serviceName: serviceData.serviceName,
        minutes: serviceData.minutes || null,
        fixedPrice: serviceData.fixedPrice || null,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating service:', error)
      throw error
    }
  },

  async update(id, serviceData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Service.update({
        id,
        serviceName: serviceData.serviceName,
        minutes: serviceData.minutes || null,
        fixedPrice: serviceData.fixedPrice || null,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.Service.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  },
}

// ============================================
// Costs CRUD (Static Data)
// ============================================
export const costAPI = {
  async list() {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Cost.list()
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing costs:', error)
      throw error
    }
  },

  async create(costData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Cost.create({
        costName: costData.costName,
        fixedPrice: costData.fixedPrice || null,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating cost:', error)
      throw error
    }
  },

  async update(id, costData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Cost.update({
        id,
        costName: costData.costName,
        fixedPrice: costData.fixedPrice || null,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating cost:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.Cost.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting cost:', error)
      throw error
    }
  },
}

// ============================================
// Staff CRUD (Static Data)
// ============================================
export const staffAPI = {
  async list() {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Staff.list()
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing staff:', error)
      throw error
    }
  },

  async create(staffData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Staff.create({
        staffName: staffData.staffName,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating staff:', error)
      throw error
    }
  },

  async update(id, staffData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Staff.update({
        id,
        staffName: staffData.staffName,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating staff:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.Staff.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting staff:', error)
      throw error
    }
  },
}

// ============================================
// DailyService CRUD (Daily Data)
// ============================================
export const dailyServiceAPI = {
  /**
   * List daily services, optionally filtered by date range
   * @param {string} fromDate - Start date (YYYY-MM-DD)
   * @param {string} toDate - End date (YYYY-MM-DD)
   */
  async list(fromDate = null, toDate = null) {
    try {
      const client = getClient()
      let result
      
      if (fromDate && toDate) {
        // Filter by date range
        result = await client.models.DailyService.list({
          filter: {
            date: {
              between: [fromDate, toDate]
            }
          }
        })
      } else if (fromDate) {
        // Filter by single date
        result = await client.models.DailyService.list({
          filter: {
            date: { eq: fromDate }
          }
        })
      } else {
        // No filter - get all
        result = await client.models.DailyService.list()
      }
      
      const { data, errors } = result
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing daily services:', error)
      throw error
    }
  },

  async create(serviceData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.DailyService.create({
        serviceId: serviceData.serviceId,
        staffId: serviceData.staffId,
        serviceName: serviceData.serviceName,
        staffName: serviceData.staffName,
        priceTotal: serviceData.priceTotal,
        staffProfit: serviceData.staffProfit,
        localBenefit: serviceData.localBenefit,
        date: serviceData.date,
        hourStart: serviceData.hourStart,
        hourFinish: serviceData.hourFinish,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating daily service:', error)
      throw error
    }
  },

  async update(id, serviceData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.DailyService.update({
        id,
        serviceId: serviceData.serviceId,
        staffId: serviceData.staffId,
        serviceName: serviceData.serviceName,
        staffName: serviceData.staffName,
        priceTotal: serviceData.priceTotal,
        staffProfit: serviceData.staffProfit,
        localBenefit: serviceData.localBenefit,
        date: serviceData.date,
        hourStart: serviceData.hourStart,
        hourFinish: serviceData.hourFinish,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating daily service:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.DailyService.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting daily service:', error)
      throw error
    }
  },
}

// ============================================
// DailyCost CRUD (Daily Data)
// ============================================
export const dailyCostAPI = {
  /**
   * List daily costs, optionally filtered by date range
   * @param {string} fromDate - Start date (YYYY-MM-DD)
   * @param {string} toDate - End date (YYYY-MM-DD)
   */
  async list(fromDate = null, toDate = null) {
    try {
      const client = getClient()
      let result
      
      if (fromDate && toDate) {
        // Filter by date range
        result = await client.models.DailyCost.list({
          filter: {
            date: {
              between: [fromDate, toDate]
            }
          }
        })
      } else if (fromDate) {
        // Filter by single date
        result = await client.models.DailyCost.list({
          filter: {
            date: { eq: fromDate }
          }
        })
      } else {
        // No filter - get all
        result = await client.models.DailyCost.list()
      }
      
      const { data, errors } = result
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing daily costs:', error)
      throw error
    }
  },

  async create(costData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.DailyCost.create({
        costId: costData.costId,
        costName: costData.costName,
        price: costData.price,
        reason: costData.reason || null,
        date: costData.date,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating daily cost:', error)
      throw error
    }
  },

  async update(id, costData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.DailyCost.update({
        id,
        costId: costData.costId,
        costName: costData.costName,
        price: costData.price,
        reason: costData.reason || null,
        date: costData.date,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating daily cost:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.DailyCost.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting daily cost:', error)
      throw error
    }
  },
}

// ============================================
// Booking CRUD (Staff Portal)
// ============================================
export const bookingAPI = {
  /**
   * List bookings, optionally filtered by date range
   * @param {string} fromDate - Start date (YYYY-MM-DD)
   * @param {string} toDate - End date (YYYY-MM-DD)
   */
  async list(fromDate = null, toDate = null) {
    try {
      const client = getClient()
      let result
      
      if (fromDate && toDate) {
        // Filter by date range
        result = await client.models.Booking.list({
          filter: {
            date: {
              between: [fromDate, toDate]
            }
          }
        })
      } else if (fromDate) {
        // Filter by single date
        result = await client.models.Booking.list({
          filter: {
            date: { eq: fromDate }
          }
        })
      } else {
        // No filter - get all
        result = await client.models.Booking.list()
      }
      
      const { data, errors } = result
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing bookings:', error)
      throw error
    }
  },

  /**
   * List confirmed bookings (status = Done) for calendar display
   * @param {string} fromDate - Start date (YYYY-MM-DD)
   * @param {string} toDate - End date (YYYY-MM-DD)
   */
  async listConfirmed(fromDate = null, toDate = null) {
    try {
      const client = getClient()
      let filter = { status: { eq: 'Done' } }
      
      if (fromDate && toDate) {
        filter = {
          and: [
            { status: { eq: 'Done' } },
            { date: { between: [fromDate, toDate] } }
          ]
        }
      } else if (fromDate) {
        filter = {
          and: [
            { status: { eq: 'Done' } },
            { date: { eq: fromDate } }
          ]
        }
      }
      
      const { data, errors } = await client.models.Booking.list({ filter })
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing confirmed bookings:', error)
      throw error
    }
  },

  async create(bookingData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Booking.create({
        clientName: bookingData.clientName,
        clientPhone: bookingData.clientPhone,
        therapistId: bookingData.therapistId || null,
        therapistName: bookingData.therapistName || null,
        date: bookingData.date,
        reservedTime: bookingData.reservedTime,
        durationMinutes: bookingData.durationMinutes,
        priceAgreement: bookingData.priceAgreement,
        status: bookingData.status || 'Pending',
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  },

  async update(id, bookingData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Booking.update({
        id,
        clientName: bookingData.clientName,
        clientPhone: bookingData.clientPhone,
        therapistId: bookingData.therapistId || null,
        therapistName: bookingData.therapistName || null,
        date: bookingData.date,
        reservedTime: bookingData.reservedTime,
        durationMinutes: bookingData.durationMinutes,
        priceAgreement: bookingData.priceAgreement,
        status: bookingData.status,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating booking:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.Booking.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  },
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if a date is within the last N days (including today)
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {number} days - Number of days to check
 * @returns {boolean}
 */
export const isWithinLastDays = (dateStr, days = 3) => {
  const recordDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const cutoffDate = new Date(today)
  cutoffDate.setDate(cutoffDate.getDate() - (days - 1))
  cutoffDate.setHours(0, 0, 0, 0)
  
  return recordDate >= cutoffDate
}

/**
 * Get today's date as YYYY-MM-DD string
 * @returns {string}
 */
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]
}

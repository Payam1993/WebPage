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
        lastName: staffData.lastName || null,
        email: staffData.email || null,
        phone: staffData.phone || null,
        gender: staffData.gender || null,
        yearsOfExperience: staffData.yearsOfExperience || null,
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
        lastName: staffData.lastName || null,
        email: staffData.email || null,
        phone: staffData.phone || null,
        gender: staffData.gender || null,
        yearsOfExperience: staffData.yearsOfExperience || null,
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
// Center CRUD (Local Configuration)
// ============================================
export const centerAPI = {
  async list() {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Center.list()
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing centers:', error)
      throw error
    }
  },

  async create(centerData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Center.create({
        centerName: centerData.centerName,
        referenceNumber: centerData.referenceNumber,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating center:', error)
      throw error
    }
  },

  async update(id, centerData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Center.update({
        id,
        centerName: centerData.centerName,
        referenceNumber: centerData.referenceNumber,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating center:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.Center.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting center:', error)
      throw error
    }
  },
}

// ============================================
// Room CRUD (Local Configuration)
// ============================================
export const roomAPI = {
  async list(centerId = null) {
    try {
      const client = getClient()
      const result = centerId
        ? await client.models.Room.list({ filter: { centerId: { eq: centerId } } })
        : await client.models.Room.list()
      const { data, errors } = result
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing rooms:', error)
      throw error
    }
  },

  async create(roomData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Room.create({
        roomName: roomData.roomName,
        referenceNumber: roomData.referenceNumber,
        centerId: roomData.centerId,
        centerName: roomData.centerName || null,
        pictureKey: roomData.pictureKey || null,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating room:', error)
      throw error
    }
  },

  async update(id, roomData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Room.update({
        id,
        roomName: roomData.roomName,
        referenceNumber: roomData.referenceNumber,
        centerId: roomData.centerId,
        centerName: roomData.centerName || null,
        pictureKey: roomData.pictureKey || null,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating room:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.Room.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting room:', error)
      throw error
    }
  },
}

/**
 * Upload / resolve room picture URLs via Amplify Storage
 */
export const roomPictureAPI = {
  async upload(file) {
    const { uploadData } = await import('aws-amplify/storage')
    const safeName = (file.name || 'room').replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `room-pictures/${Date.now()}-${safeName}`
    await uploadData({
      path,
      data: file,
      options: { contentType: file.type || 'image/jpeg' },
    }).result
    return path
  },

  async getUrl(pictureKey) {
    if (!pictureKey) return null
    if (pictureKey.startsWith('data:') || pictureKey.startsWith('http')) {
      return pictureKey
    }
    try {
      const { getUrl } = await import('aws-amplify/storage')
      const result = await getUrl({ path: pictureKey })
      return result.url.toString()
    } catch (error) {
      console.error('Error getting room picture URL:', error)
      return null
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

/**
 * Build Amplify list filter for bookings
 * @param {{ fromDate?: string|null, toDate?: string|null, therapistId?: string|null, status?: string|null }} options
 */
const buildBookingFilter = ({
  fromDate = null,
  toDate = null,
  therapistId = null,
  status = null,
  centerId = null,
  roomId = null,
} = {}) => {
  const conditions = []

  if (status) {
    conditions.push({ status: { eq: status } })
  }

  if (fromDate && toDate) {
    conditions.push({ date: { between: [fromDate, toDate] } })
  } else if (fromDate) {
    conditions.push({ date: { eq: fromDate } })
  }

  if (therapistId) {
    conditions.push({ therapistId: { eq: therapistId } })
  }

  if (centerId) {
    conditions.push({ centerId: { eq: centerId } })
  }

  if (roomId) {
    conditions.push({ roomId: { eq: roomId } })
  }

  if (conditions.length === 0) return undefined
  if (conditions.length === 1) return conditions[0]
  return { and: conditions }
}

/**
 * Resolve Staff record by Cognito login email (case-insensitive)
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export const resolveStaffByEmail = async (email) => {
  if (!email) return null
  try {
    const staffList = await staffAPI.list()
    const normalized = email.trim().toLowerCase()
    return staffList.find((s) => s.email?.trim().toLowerCase() === normalized) || null
  } catch (error) {
    console.error('Error resolving staff by email:', error)
    return null
  }
}

export const bookingAPI = {
  /**
   * List bookings, optionally filtered by date range, therapist, center, room
   * @param {string} fromDate - Start date (YYYY-MM-DD)
   * @param {string} toDate - End date (YYYY-MM-DD)
   * @param {{ therapistId?: string|null, centerId?: string|null, roomId?: string|null }} options
   */
  async list(fromDate = null, toDate = null, options = {}) {
    try {
      const client = getClient()
      const filter = buildBookingFilter({
        fromDate,
        toDate,
        therapistId: options.therapistId || null,
        centerId: options.centerId || null,
        roomId: options.roomId || null,
      })

      const result = filter
        ? await client.models.Booking.list({ filter })
        : await client.models.Booking.list()

      const { data, errors } = result
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing bookings:', error)
      throw error
    }
  },

  /**
   * List pending bookings (status = Pending) for calendar display
   * Only Pending reservations appear in the calendar
   * @param {string} fromDate - Start date (YYYY-MM-DD)
   * @param {string} toDate - End date (YYYY-MM-DD)
   * @param {{ therapistId?: string|null, centerId?: string|null, roomId?: string|null }} options
   */
  async listPending(fromDate = null, toDate = null, options = {}) {
    try {
      const client = getClient()
      const filter = buildBookingFilter({
        fromDate,
        toDate,
        therapistId: options.therapistId || null,
        centerId: options.centerId || null,
        roomId: options.roomId || null,
        status: 'Pending',
      })

      const { data, errors } = await client.models.Booking.list({ filter })
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing pending bookings:', error)
      throw error
    }
  },

  async create(bookingData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.Booking.create({
        clientName: bookingData.clientName,
        clientPhone: bookingData.clientPhone,
        serviceId: bookingData.serviceId || null,
        serviceName: bookingData.serviceName || null,
        therapistId: bookingData.therapistId || null,
        therapistName: bookingData.therapistName || null,
        centerId: bookingData.centerId || null,
        centerName: bookingData.centerName || null,
        roomId: bookingData.roomId || null,
        roomName: bookingData.roomName || null,
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
        serviceId: bookingData.serviceId || null,
        serviceName: bookingData.serviceName || null,
        therapistId: bookingData.therapistId || null,
        therapistName: bookingData.therapistName || null,
        centerId: bookingData.centerId || null,
        centerName: bookingData.centerName || null,
        roomId: bookingData.roomId || null,
        roomName: bookingData.roomName || null,
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
// NotConfirmedReservation CRUD (Public Booking Requests)
// ============================================
export const notConfirmedReservationAPI = {
  /**
   * List not confirmed reservations, optionally filtered by date range
   * @param {string} fromDate - Start date (YYYY-MM-DD)
   * @param {string} toDate - End date (YYYY-MM-DD)
   */
  async list(fromDate = null, toDate = null) {
    try {
      const client = getClient()
      let filter = { status: { eq: 'NotConfirmed' } }
      
      if (fromDate && toDate) {
        filter = {
          and: [
            { status: { eq: 'NotConfirmed' } },
            { date: { between: [fromDate, toDate] } }
          ]
        }
      } else if (fromDate) {
        filter = {
          and: [
            { status: { eq: 'NotConfirmed' } },
            { date: { eq: fromDate } }
          ]
        }
      }
      
      const { data, errors } = await client.models.NotConfirmedReservation.list({ filter })
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing not confirmed reservations:', error)
      throw error
    }
  },

  async create(reservationData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.NotConfirmedReservation.create({
        clientName: reservationData.clientName,
        clientPhone: reservationData.clientPhone,
        serviceId: reservationData.serviceId,
        serviceName: reservationData.serviceName,
        centerId: reservationData.centerId || null,
        centerName: reservationData.centerName || null,
        roomId: reservationData.roomId || null,
        roomName: reservationData.roomName || null,
        date: reservationData.date,
        reservedTime: reservationData.reservedTime,
        durationMinutes: reservationData.durationMinutes,
        status: 'NotConfirmed',
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating not confirmed reservation:', error)
      throw error
    }
  },

  async update(id, reservationData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.NotConfirmedReservation.update({
        id,
        clientName: reservationData.clientName,
        clientPhone: reservationData.clientPhone,
        serviceId: reservationData.serviceId,
        serviceName: reservationData.serviceName,
        centerId: reservationData.centerId || null,
        centerName: reservationData.centerName || null,
        roomId: reservationData.roomId || null,
        roomName: reservationData.roomName || null,
        date: reservationData.date,
        reservedTime: reservationData.reservedTime,
        durationMinutes: reservationData.durationMinutes,
        status: reservationData.status || 'NotConfirmed',
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error updating not confirmed reservation:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.NotConfirmedReservation.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting not confirmed reservation:', error)
      throw error
    }
  },

  /**
   * Confirm a reservation: create Booking and delete NotConfirmedReservation
   */
  async confirm(notConfirmedReservation, additionalData = {}) {
    try {
      // Create the confirmed booking
      const bookingData = {
        clientName: notConfirmedReservation.clientName,
        clientPhone: notConfirmedReservation.clientPhone,
        serviceId: notConfirmedReservation.serviceId,
        serviceName: notConfirmedReservation.serviceName,
        therapistId: additionalData.therapistId || null,
        therapistName: additionalData.therapistName || null,
        centerId: additionalData.centerId ?? notConfirmedReservation.centerId ?? null,
        centerName: additionalData.centerName ?? notConfirmedReservation.centerName ?? null,
        roomId: additionalData.roomId ?? notConfirmedReservation.roomId ?? null,
        roomName: additionalData.roomName ?? notConfirmedReservation.roomName ?? null,
        date: notConfirmedReservation.date,
        reservedTime: notConfirmedReservation.reservedTime,
        durationMinutes: notConfirmedReservation.durationMinutes,
        priceAgreement: additionalData.priceAgreement || 0,
        status: 'Pending',
      }
      
      const newBooking = await bookingAPI.create(bookingData)
      
      // Delete the not confirmed reservation
      await this.delete(notConfirmedReservation.id)
      
      return newBooking
    } catch (error) {
      console.error('Error confirming reservation:', error)
      throw error
    }
  },
}

// ============================================
// Public API (for unauthenticated users)
// ============================================
export const publicAPI = {
  /**
   * Create a public booking request (guest access)
   */
  async createBookingRequest(reservationData) {
    try {
      // Use API key auth for public access
      const client = generateClient({ authMode: 'apiKey' })
      const { data, errors } = await client.models.NotConfirmedReservation.create({
        clientName: reservationData.clientName,
        clientPhone: reservationData.clientPhone,
        serviceId: reservationData.serviceId,
        serviceName: reservationData.serviceName,
        centerId: reservationData.centerId || null,
        centerName: reservationData.centerName || null,
        roomId: reservationData.roomId || null,
        roomName: reservationData.roomName || null,
        date: reservationData.date,
        reservedTime: reservationData.reservedTime,
        durationMinutes: reservationData.durationMinutes,
        status: 'NotConfirmed',
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating public booking request:', error)
      throw error
    }
  },

  /**
   * Create a public staff / work-with-us application (guest access)
   */
  async createStaffApplication(applicationData) {
    try {
      const client = generateClient({ authMode: 'apiKey' })
      const { data, errors } = await client.models.StaffApplication.create({
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        gender: applicationData.gender,
        yearsOfExperience: applicationData.yearsOfExperience,
        explanation: applicationData.explanation || null,
        status: 'Pending',
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating staff application:', error)
      throw error
    }
  },

  /**
   * Get available services (guest access)
   */
  async getServices() {
    try {
      const client = generateClient({ authMode: 'apiKey' })
      const { data, errors } = await client.models.Service.list()
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  },

  /**
   * Get centers (guest access)
   */
  async getCenters() {
    try {
      const client = generateClient({ authMode: 'apiKey' })
      const { data, errors } = await client.models.Center.list()
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error fetching centers:', error)
      throw error
    }
  },

  /**
   * Get rooms (guest access), optionally filtered by center
   */
  async getRooms(centerId = null) {
    try {
      const client = generateClient({ authMode: 'apiKey' })
      const result = centerId
        ? await client.models.Room.list({ filter: { centerId: { eq: centerId } } })
        : await client.models.Room.list()
      const { data, errors } = result
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error fetching rooms:', error)
      throw error
    }
  },
}

// ============================================
// StaffApplication CRUD (Work With Us requests)
// ============================================
export const staffApplicationAPI = {
  /**
   * List pending staff applications
   */
  async listPending() {
    try {
      const client = getClient()
      const { data, errors } = await client.models.StaffApplication.list({
        filter: { status: { eq: 'Pending' } },
      })
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing staff applications:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.StaffApplication.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting staff application:', error)
      throw error
    }
  },

  /**
   * Confirm application: create Staff record and remove the application
   */
  async confirm(application) {
    try {
      const newStaff = await staffAPI.create({
        staffName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        gender: application.gender,
        yearsOfExperience: application.yearsOfExperience,
      })
      await this.delete(application.id)
      return newStaff
    } catch (error) {
      console.error('Error confirming staff application:', error)
      throw error
    }
  },

  /**
   * Decline application: remove it
   */
  async decline(id) {
    return this.delete(id)
  },
}

// ============================================
// NotConfirmedCost CRUD (Staff Cost Submissions)
// ============================================
export const notConfirmedCostAPI = {
  /**
   * List not confirmed costs (status = NotConfirmed)
   */
  async list() {
    try {
      const client = getClient()
      const { data, errors } = await client.models.NotConfirmedCost.list({
        filter: { status: { eq: 'NotConfirmed' } }
      })
      if (errors) throw new Error(errors[0].message)
      return data || []
    } catch (error) {
      console.error('Error listing not confirmed costs:', error)
      throw error
    }
  },

  /**
   * Create a new not confirmed cost
   */
  async create(costData) {
    try {
      const client = getClient()
      const { data, errors } = await client.models.NotConfirmedCost.create({
        costName: costData.costName,
        price: costData.price,
        date: costData.date,
        reason: costData.reason || null,
        status: 'NotConfirmed',
        submittedBy: costData.submittedBy || null,
      })
      if (errors) throw new Error(errors[0].message)
      return data
    } catch (error) {
      console.error('Error creating not confirmed cost:', error)
      throw error
    }
  },

  /**
   * Delete a not confirmed cost
   */
  async delete(id) {
    try {
      const client = getClient()
      const { errors } = await client.models.NotConfirmedCost.delete({ id })
      if (errors) throw new Error(errors[0].message)
      return true
    } catch (error) {
      console.error('Error deleting not confirmed cost:', error)
      throw error
    }
  },

  /**
   * Confirm a cost: create DailyCost and delete NotConfirmedCost
   * Only admins can call this
   */
  async confirm(notConfirmedCost) {
    try {
      // First, we need to find or create a matching Cost ID (static cost type)
      // For simplicity, we'll use the cost name directly and set costId as empty
      // In a real implementation, you might want to link to an existing Cost record
      
      // Create the confirmed daily cost
      const dailyCostData = {
        costId: '', // Will be set later or left empty
        costName: notConfirmedCost.costName,
        price: notConfirmedCost.price,
        date: notConfirmedCost.date,
        reason: notConfirmedCost.reason,
      }
      
      const newDailyCost = await dailyCostAPI.create(dailyCostData)
      
      // Delete the not confirmed cost
      await this.delete(notConfirmedCost.id)
      
      return newDailyCost
    } catch (error) {
      console.error('Error confirming cost:', error)
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

/**
 * Get a date N days from today as YYYY-MM-DD string
 * @param {number} days - Number of days to add (can be negative)
 * @returns {string}
 */
export const getDateFromToday = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

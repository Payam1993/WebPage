import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AvailabilityCalendar from '../components/AvailabilityCalendar'
import '../components/AvailabilityCalendar.css'
import {
  staffBookingLinkAPI,
  publicAPI,
} from '../services/dataService'
import {
  toBusyIntervals,
  getSlotConflictReasons,
  pickFreeRoomId,
  getAvailableSlots,
} from '../utils/availability'

/**
 * Public page: /book-link/:token
 * Customer books against staff availability (+ optional fixed room or any room)
 * Central rules: therapist cannot double-book; room cannot hold two services.
 */
const StaffLinkBooking = () => {
  const { token } = useParams()
  const [link, setLink] = useState(null)
  const [services, setServices] = useState([])
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    serviceName: '',
    roomId: '',
    roomName: '',
    durationMinutes: 60,
    date: '',
    reservedTime: '',
  })

  useEffect(() => {
    loadLink()
  }, [token])

  const loadLink = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const found = await staffBookingLinkAPI.getByToken(token)
      if (!found) {
        setLoadError('This booking link is invalid or has been deactivated.')
        setLink(null)
        return
      }
      setLink(found)
      const [servicesResult, roomsData] = await Promise.all([
        publicAPI.getServices({
          centerId: found.centerId || undefined,
          distinct: true,
        }),
        publicAPI.getRooms(found.centerId),
      ])
      setServices(servicesResult || [])
      setRooms(roomsData || [])
      if (found.roomId) {
        setFormData((prev) => ({
          ...prev,
          roomId: found.roomId,
          roomName: found.roomName || '',
        }))
      }
    } catch (err) {
      setLoadError(err.message || 'Unable to load booking link')
    } finally {
      setIsLoading(false)
    }
  }

  const roomsForCenter = rooms.filter((r) => !link?.centerId || r.centerId === link.centerId)
  const effectiveRoomId = link?.roomId || formData.roomId || ''
  const roomIds = link?.roomId
    ? [link.roomId]
    : roomsForCenter.map((r) => r.id)

  const handleServiceChange = (serviceId) => {
    const service = services.find((s) => s.id === serviceId)
    setFormData({
      ...formData,
      serviceId,
      serviceName: service?.serviceName || '',
      durationMinutes: service?.minutes || formData.durationMinutes || 60,
      reservedTime: '',
    })
  }

  const handleRoomChange = (roomId) => {
    const room = roomsForCenter.find((r) => r.id === roomId)
    setFormData({
      ...formData,
      roomId,
      roomName: room?.roomName || '',
      reservedTime: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    if (!formData.clientName.trim()) {
      setSubmitError('Name is required')
      return
    }
    if (!formData.clientPhone.trim()) {
      setSubmitError('Phone is required')
      return
    }
    if (!formData.serviceId) {
      setSubmitError('Please select a service')
      return
    }
    if (!formData.date || !formData.reservedTime) {
      setSubmitError('Please select an available date and time')
      return
    }

    setIsSubmitting(true)
    try {
      const busyRaw = await publicAPI.listBusySlots({
        fromDate: formData.date,
        toDate: formData.date,
        centerId: link.centerId || null,
        therapistId: link.therapistId || null,
      })
      const busyIntervals = toBusyIntervals(busyRaw)

      let roomId = link?.roomId || formData.roomId || null
      let roomName = link?.roomId ? link.roomName : formData.roomName || null

      if (!roomId) {
        const freeId = pickFreeRoomId({
          dateKey: formData.date,
          startTime: formData.reservedTime,
          durationMinutes: formData.durationMinutes,
          busyIntervals,
          roomIds,
        })
        if (!freeId) {
          throw new Error('No room is free at this time. Please choose another slot.')
        }
        const room = roomsForCenter.find((r) => r.id === freeId)
        roomId = freeId
        roomName = room?.roomName || 'Assigned room'
      }

      const stillAvailable = getAvailableSlots({
        dateKey: formData.date,
        durationMinutes: formData.durationMinutes,
        busyIntervals,
        roomId,
        roomIds,
        therapistId: link.therapistId,
      }).includes(formData.reservedTime.substring(0, 5))

      if (!stillAvailable) {
        const reasons = getSlotConflictReasons({
          dateKey: formData.date,
          startTime: formData.reservedTime,
          durationMinutes: formData.durationMinutes,
          busyIntervals,
          roomId,
          therapistId: link.therapistId,
        })
        throw new Error(
          reasons[0] || 'This time is no longer available. Please pick another slot.'
        )
      }

      await publicAPI.createBookingRequest({
        clientName: formData.clientName.trim(),
        clientPhone: formData.clientPhone.trim(),
        serviceId: formData.serviceId,
        serviceName: formData.serviceName,
        centerId: link.centerId,
        centerName: link.centerName,
        roomId,
        roomName,
        therapistId: link.therapistId,
        therapistName: link.therapistName,
        date: formData.date,
        reservedTime: formData.reservedTime,
        durationMinutes: formData.durationMinutes,
        bookingSource: 'StaffLink',
      })
      setSuccess(true)
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div style={pageStyle}>
        <p>Loading booking link…</p>
      </div>
    )
  }

  if (loadError || !link) {
    return (
      <div style={pageStyle}>
        <h1 style={{ fontFamily: 'Georgia, serif' }}>Booking unavailable</h1>
        <p>{loadError || 'Link not found'}</p>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  if (success) {
    return (
      <div style={pageStyle}>
        <h1 style={{ fontFamily: 'Georgia, serif' }}>Request sent</h1>
        <p>
          Thank you. Your reservation request with {link.therapistName} was submitted and will be
          confirmed shortly.
        </p>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'left' }}>
        <p style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 12, opacity: 0.6 }}>
          Confession Barcelona
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', margin: '8px 0 4px' }}>
          Book with {link.therapistName}
        </h1>
        <p style={{ color: '#555', marginBottom: 24 }}>
          {link.centerName || 'Center'}
          {link.roomId ? ` · ${link.roomName}` : ' · Any available room'}
        </p>

        <form onSubmit={handleSubmit}>
          {submitError && (
            <div
              style={{
                padding: 12,
                marginBottom: 16,
                background: '#fef2f2',
                color: '#dc2626',
                borderRadius: 8,
              }}
            >
              {submitError}
            </div>
          )}

          <label style={labelStyle}>Your name *</label>
          <input
            style={inputStyle}
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
          />

          <label style={labelStyle}>Phone *</label>
          <input
            style={inputStyle}
            type="tel"
            value={formData.clientPhone}
            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
            required
          />

          <label style={labelStyle}>Service *</label>
          <select
            style={inputStyle}
            value={formData.serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
            required
          >
            <option value="">Select service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.serviceName}
              </option>
            ))}
          </select>

          {!link.roomId && roomsForCenter.length > 1 && (
            <>
              <label style={labelStyle}>Room (optional — leave empty for any)</label>
              <select
                style={inputStyle}
                value={formData.roomId}
                onChange={(e) => handleRoomChange(e.target.value)}
              >
                <option value="">Any room</option>
                {roomsForCenter.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roomName}
                  </option>
                ))}
              </select>
            </>
          )}

          <label style={labelStyle}>Duration</label>
          <select
            style={inputStyle}
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                durationMinutes: parseInt(e.target.value, 10),
                reservedTime: '',
              })
            }
          >
            {[30, 45, 60, 75, 90, 120].map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>

          <label style={labelStyle}>Availability *</label>
          <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#666' }}>
            Times already booked for this therapist or room are hidden.
          </p>
          <AvailabilityCalendar
            centerId={link.centerId || ''}
            roomId={effectiveRoomId}
            roomIds={roomIds}
            therapistId={link.therapistId}
            durationMinutes={formData.durationMinutes}
            selectedDate={formData.date}
            selectedTime={formData.reservedTime}
            onSelectDate={(date) => setFormData((prev) => ({ ...prev, date, reservedTime: '' }))}
            onSelectTime={(time) => setFormData((prev) => ({ ...prev, reservedTime: time }))}
            authMode="public"
          />

          <button
            type="submit"
            disabled={isSubmitting || !formData.date || !formData.reservedTime}
            style={{
              marginTop: 24,
              width: '100%',
              padding: '14px 20px',
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {isSubmitting ? 'Sending…' : 'Request booking'}
          </button>
        </form>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  padding: '48px 24px',
  background: 'linear-gradient(180deg, #f7f5f2 0%, #ebe6df 100%)',
  color: '#1a1a1a',
  textAlign: 'center',
}

const labelStyle = {
  display: 'block',
  marginTop: 16,
  marginBottom: 6,
  fontSize: '0.875rem',
  fontWeight: 500,
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: '1rem',
  boxSizing: 'border-box',
}

export default StaffLinkBooking

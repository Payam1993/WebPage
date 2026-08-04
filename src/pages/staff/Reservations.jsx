import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  PageHeader,
  Grid,
  Input,
  Select,
  Modal,
  ConfirmDialog,
  Icons,
  EmptyState,
  LoadingState,
} from '../../components/admin/ui'
import { bookingAPI, staffAPI, serviceAPI, centerAPI, roomAPI, getTodayDate, getDateFromToday, formatDisplayDate, notConfirmedReservationAPI } from '../../services/dataService'
import { useAuth } from '../../context/AuthContext'
import AvailabilityCalendar from '../../components/AvailabilityCalendar'
import '../../components/AvailabilityCalendar.css'
import { toBusyIntervals, getSlotConflictReasons } from '../../utils/availability'

/**
 * Reservations - Manage client bookings and reservations
 * Admin: global view of all bookings + public not-confirmed requests
 * Users: individual view of bookings assigned to their Staff profile
 */
const Reservations = () => {
  const { isAdmin, isUser, staffProfile, userEmail, isLoading: authLoading } = useAuth()
  const isIndividualView = isUser
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookings, setBookings] = useState([])
  const [staffList, setStaffList] = useState([])
  const [servicesList, setServicesList] = useState([])
  const [centersList, setCentersList] = useState([])
  const [roomsList, setRoomsList] = useState([])
  const [filterCenterId, setFilterCenterId] = useState('')
  const [filterRoomId, setFilterRoomId] = useState('')
  
  // Not confirmed reservations
  const [notConfirmedList, setNotConfirmedList] = useState([])
  const [isLoadingNotConfirmed, setIsLoadingNotConfirmed] = useState(false)
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null })
  const [confirmFormData, setConfirmFormData] = useState({})
  const [isConfirming, setIsConfirming] = useState(false)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [legalAccepted, setLegalAccepted] = useState(false)

  const staffDisplayName = [
    staffProfile?.staffName,
    staffProfile?.lastName,
  ].filter(Boolean).join(' ') || userEmail || 'Staff'

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null })
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter states - default to showing today + next 7 days
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState({
    fromDate: getTodayDate(),
    toDate: getDateFromToday(7), // Show next 7 days by default
  })
  const [appliedFilter, setAppliedFilter] = useState({
    fromDate: getTodayDate(),
    toDate: getDateFromToday(7), // Show next 7 days by default
  })

  // Load data on mount and when filter / auth context changes
  useEffect(() => {
    loadStaticData()
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (isAdmin) {
      loadNotConfirmedReservations()
    } else {
      setNotConfirmedList([])
    }
  }, [authLoading, isAdmin])

  useEffect(() => {
    if (authLoading) return
    loadBookings()
  }, [appliedFilter.fromDate, appliedFilter.toDate, authLoading, isIndividualView, staffProfile?.id, filterCenterId, filterRoomId])

  // Auto-refresh not confirmed reservations every 30 seconds (admin only)
  useEffect(() => {
    if (!isAdmin) return undefined
    const intervalId = setInterval(() => {
      loadNotConfirmedReservations()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [isAdmin])

  const loadStaticData = async () => {
    try {
      const [staffData, servicesData, centersData, roomsData] = await Promise.all([
        staffAPI.list(),
        serviceAPI.list(),
        centerAPI.list(),
        roomAPI.list(),
      ])
      setStaffList(staffData)
      setServicesList(servicesData)
      setCentersList(centersData)
      setRoomsList(roomsData)
    } catch (err) {
      console.error('Error loading static data:', err)
    }
  }

  const loadNotConfirmedReservations = async () => {
    setIsLoadingNotConfirmed(true)
    try {
      const data = await notConfirmedReservationAPI.list()
      // Sort by date ascending (oldest first)
      data.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return a.reservedTime.localeCompare(b.reservedTime)
      })
      setNotConfirmedList(data)
    } catch (err) {
      console.error('Error loading not confirmed reservations:', err)
    } finally {
      setIsLoadingNotConfirmed(false)
    }
  }

  const loadBookings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (isIndividualView && !staffProfile?.id) {
        setBookings([])
        return
      }

      const { fromDate, toDate } = appliedFilter
      const filterOptions = {
        ...(isIndividualView && staffProfile?.id ? { therapistId: staffProfile.id } : {}),
        ...(filterCenterId ? { centerId: filterCenterId } : {}),
        ...(filterRoomId ? { roomId: filterRoomId } : {}),
      }
      const data = await bookingAPI.list(fromDate, toDate, filterOptions)
      // Sort by date descending, then by time descending
      data.sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date)
        return b.reservedTime.localeCompare(a.reservedTime)
      })
      setBookings(data)
    } catch (err) {
      setError(err.message || 'Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyFilter = () => {
    setAppliedFilter({ ...dateFilter })
  }

  const handleResetFilter = () => {
    const today = getTodayDate()
    const nextWeek = getDateFromToday(7)
    setDateFilter({ fromDate: today, toDate: nextWeek })
    setAppliedFilter({ fromDate: today, toDate: nextWeek })
  }

  const handleOpenModal = (item = null) => {
    setLegalAccepted(false)
    if (item) {
      setEditingItem(item)
      setFormData({ ...item })
      setLegalAccepted(true)
    } else {
      setEditingItem(null)
      const defaultCenter = centersList.length === 1 ? centersList[0] : null
      setFormData({
        date: getTodayDate(),
        status: 'Pending',
        durationMinutes: 60,
        priceAgreement: 0,
        clientPhone: '',
        ...(defaultCenter
          ? { centerId: defaultCenter.id, centerName: defaultCenter.centerName }
          : {}),
        ...((isIndividualView && staffProfile)
          ? {
              therapistId: staffProfile.id,
              therapistName: staffDisplayName,
            }
          : {}),
      })
    }
    setShowModal(true)
    setError(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({})
    setLegalAccepted(false)
    setError(null)
  }

  const handleServiceSelect = (serviceId) => {
    const service = servicesList.find(s => s.id === serviceId)
    setFormData({
      ...formData,
      serviceId,
      serviceName: service?.serviceName || '',
    })
  }

  const handleTherapistSelect = (staffId) => {
    const staff = staffList.find(s => s.id === staffId)
    setFormData({
      ...formData,
      therapistId: staffId,
      therapistName: staff?.staffName || '',
    })
  }

  const handleCenterSelect = (centerId) => {
    const center = centersList.find((c) => c.id === centerId)
    setFormData({
      ...formData,
      centerId,
      centerName: center?.centerName || '',
      roomId: '',
      roomName: '',
    })
  }

  const handleRoomSelect = (roomId) => {
    const room = roomsList.find((r) => r.id === roomId)
    const roomPrice =
      room?.roomPrice != null && room.roomPrice !== ''
        ? Number(room.roomPrice)
        : null
    setFormData({
      ...formData,
      roomId,
      roomName: room?.roomName || '',
      reservedTime: '',
      ...(roomPrice != null ? { priceAgreement: roomPrice } : {}),
      ...(room?.centerId && !formData.centerId
        ? {
            centerId: room.centerId,
            centerName: room.centerName || centersList.find((c) => c.id === room.centerId)?.centerName || '',
          }
        : {}),
    })
  }

  const handleCenterFilterChange = (centerId) => {
    setFilterCenterId(centerId)
    if (centerId && filterRoomId) {
      const room = roomsList.find((r) => r.id === filterRoomId)
      if (room && room.centerId !== centerId) {
        setFilterRoomId('')
      }
    }
  }

  // Confirm modal handlers
  const handleOpenConfirmModal = (item) => {
    setConfirmModal({ open: true, item })
    setConfirmFormData({
      therapistId: '',
      therapistName: '',
      priceAgreement: item.serviceName ? 
        (servicesList.find(s => s.id === item.serviceId)?.fixedPrice || 0) : 0,
    })
  }

  const handleCloseConfirmModal = () => {
    setConfirmModal({ open: false, item: null })
    setConfirmFormData({})
  }

  const handleConfirmTherapistSelect = (staffId) => {
    const staff = staffList.find(s => s.id === staffId)
    setConfirmFormData({
      ...confirmFormData,
      therapistId: staffId,
      therapistName: staff?.staffName || '',
    })
  }

  const handleConfirmReservation = async () => {
    setIsConfirming(true)
    try {
      const bookingDate = confirmModal.item.date
      
      // Confirm the reservation (creates Booking, deletes NotConfirmedReservation)
      await notConfirmedReservationAPI.confirm(confirmModal.item, {
        therapistId: confirmFormData.therapistId,
        therapistName: confirmFormData.therapistName,
        priceAgreement: confirmFormData.priceAgreement || 0,
      })
      
      // Remove from not confirmed list immediately (optimistic update)
      setNotConfirmedList(prev => prev.filter(item => item.id !== confirmModal.item.id))
      
      // Check if the confirmed booking falls within the current filter range
      const isInCurrentRange = !appliedFilter.fromDate || !appliedFilter.toDate || 
        (bookingDate >= appliedFilter.fromDate && bookingDate <= appliedFilter.toDate)
      
      if (isInCurrentRange) {
        // Booking is in current filter range, reload to show it
        await loadBookings()
      } else {
        // Booking is outside current filter - expand filter to show the booking
        const newFromDate = bookingDate < (appliedFilter.fromDate || bookingDate) ? bookingDate : appliedFilter.fromDate
        const newToDate = bookingDate > (appliedFilter.toDate || bookingDate) ? bookingDate : appliedFilter.toDate
        setDateFilter({ fromDate: newFromDate, toDate: newToDate })
        setAppliedFilter({ fromDate: newFromDate, toDate: newToDate })
        // useEffect will trigger loadBookings
      }
      
      handleCloseConfirmModal()
    } catch (err) {
      setError(err.message || 'Failed to confirm reservation')
      // Reload to ensure state is consistent
      await loadNotConfirmedReservations()
    } finally {
      setIsConfirming(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      if (!formData.clientName?.trim()) throw new Error('Client Name is required')
      if (!formData.date) throw new Error('Date is required')
      if (!formData.reservedTime) throw new Error('Please select an available time from the calendar')
      if (!formData.durationMinutes) throw new Error('Duration is required')
      if (isIndividualView && !formData.roomId) {
        throw new Error('Room selection is required')
      }
      if (isIndividualView && !legalAccepted) {
        throw new Error('You must accept the local massage license declaration')
      }
      if (formData.priceAgreement == null || formData.priceAgreement === '') {
        throw new Error('Price Agreement is required')
      }
      if (!formData.status) throw new Error('Status is required')

      const payload = {
        ...formData,
        clientPhone: formData.clientPhone?.trim() || null,
        priceAgreement: Number(formData.priceAgreement) || 0,
        ...(isIndividualView && staffProfile
          ? {
              therapistId: staffProfile.id,
              therapistName: staffDisplayName,
            }
          : {}),
      }

      // Central calendar conflict check (therapist + room) before create/update
      if (!editingItem || editingItem.status === 'Pending') {
        const [dayBookings, pending] = await Promise.all([
          bookingAPI.list(formData.date, formData.date, {
            ...(formData.centerId ? { centerId: formData.centerId } : {}),
          }),
          notConfirmedReservationAPI.list(formData.date, formData.date),
        ])
        const therapistBookings = payload.therapistId
          ? await bookingAPI.list(formData.date, formData.date, {
              therapistId: payload.therapistId,
            })
          : []
        const byId = new Map()
        ;[...dayBookings, ...therapistBookings].forEach((b) => {
          if (b?.id && b.id !== editingItem?.id) byId.set(b.id, b)
        })
        const busyIntervals = toBusyIntervals([
          ...byId.values(),
          ...pending.filter(
            (p) =>
              (!formData.centerId || p.centerId === formData.centerId) ||
              (payload.therapistId && p.therapistId === payload.therapistId)
          ),
        ])
        const reasons = getSlotConflictReasons({
          dateKey: formData.date,
          startTime: formData.reservedTime,
          durationMinutes: formData.durationMinutes,
          busyIntervals,
          roomId: formData.roomId || null,
          therapistId: payload.therapistId || null,
        })
        if (reasons.length) {
          throw new Error(reasons[0])
        }
      }

      if (editingItem) {
        await bookingAPI.update(editingItem.id, payload)
      } else {
        await bookingAPI.create(payload)
      }
      
      await loadBookings()
      handleCloseModal()
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (item) => {
    setDeleteConfirm({ open: true, item })
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await bookingAPI.delete(deleteConfirm.item.id)
      await loadBookings()
      setDeleteConfirm({ open: false, item: null })
    } catch (err) {
      setError(err.message || 'Failed to delete')
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter bookings by status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const matchesSearch = 
      booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.therapistName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Status counts
  const statusCounts = {
    all: bookings.length,
    Done: bookings.filter(b => b.status === 'Done').length,
    Pending: bookings.filter(b => b.status === 'Pending').length,
    Canceled: bookings.filter(b => b.status === 'Canceled').length,
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Done': return 'success'
      case 'Pending': return 'warning'
      case 'Canceled': return 'danger'
      default: return 'neutral'
    }
  }

  // Format time for display
  const formatTime = (timeStr) => {
    if (!timeStr) return '-'
    return timeStr.substring(0, 5) // HH:MM
  }

  // Format date for display (local YYYY-MM-DD, no UTC shift)
  const formatDate = (dateStr) => formatDisplayDate(dateStr)

  // Calculate end time
  const getEndTime = (startTime, durationMinutes) => {
    if (!startTime || !durationMinutes) return ''
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + durationMinutes
    const endHours = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  // Staff options for dropdown
  const staffOptions = staffList.map(s => ({
    value: s.id,
    label: s.staffName,
  }))

  // Service options for dropdown - only show service name
  const serviceOptions = servicesList.map(s => ({
    value: s.id,
    label: s.serviceName,
  }))

  const centerFilterOptions = [
    { value: '', label: 'All Centers' },
    ...centersList.map((c) => ({
      value: c.id,
      label: `${c.centerName}${c.referenceNumber ? ` (${c.referenceNumber})` : ''}`,
    })),
  ]

  const roomFilterOptions = [
    { value: '', label: 'All Rooms' },
    ...roomsList
      .filter((r) => !filterCenterId || r.centerId === filterCenterId)
      .map((r) => ({
        value: r.id,
        label: `${r.roomName}${r.referenceNumber ? ` (${r.referenceNumber})` : ''}`,
      })),
  ]

  const centerFormOptions = centersList.map((c) => ({
    value: c.id,
    label: `${c.centerName}${c.referenceNumber ? ` (${c.referenceNumber})` : ''}`,
  }))

  const roomFormOptions = roomsList
    .filter((r) => !formData.centerId || r.centerId === formData.centerId)
    .map((r) => {
      const priceLabel =
        r.roomPrice != null && r.roomPrice !== ''
          ? ` · €${Number(r.roomPrice).toFixed(2)}`
          : ' · custom price'
      return {
        value: r.id,
        label: `${r.roomName}${r.referenceNumber ? ` (${r.referenceNumber})` : ''}${priceLabel}`,
      }
    })

  // Duration options
  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' },
    { value: 75, label: '75 minutes' },
    { value: 90, label: '90 minutes' },
    { value: 120, label: '120 minutes' },
  ]

  // Status options
  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Done', label: 'Done' },
    { value: 'Canceled', label: 'Canceled' },
  ]

  return (
    <div>
      <PageHeader 
        title={isIndividualView ? 'My Reservations' : 'Reservations'}
        subtitle={
          isIndividualView
            ? 'Manage and view your assigned client bookings'
            : 'Manage and view all client bookings'
        }
        actions={
          <Button icon={<Icons.Plus />} onClick={() => handleOpenModal()}>
            New Booking
          </Button>
        }
      />

      {/* Date Filter */}
      <Card style={{ marginBottom: '16px' }}>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
            <Input
              label="From Date"
              type="date"
              value={dateFilter.fromDate}
              onChange={(e) => setDateFilter({ ...dateFilter, fromDate: e.target.value })}
              containerClassName="ui-mb-0"
              style={{ width: '160px' }}
            />
            <Input
              label="To Date"
              type="date"
              value={dateFilter.toDate}
              onChange={(e) => setDateFilter({ ...dateFilter, toDate: e.target.value })}
              containerClassName="ui-mb-0"
              style={{ width: '160px' }}
            />
            <Select
              label="Center"
              options={centerFilterOptions}
              value={filterCenterId}
              onChange={(e) => handleCenterFilterChange(e.target.value)}
              containerClassName="ui-mb-0"
              style={{ width: '180px' }}
            />
            <Select
              label="Room"
              options={roomFilterOptions}
              value={filterRoomId}
              onChange={(e) => setFilterRoomId(e.target.value)}
              containerClassName="ui-mb-0"
              style={{ width: '180px' }}
            />
            <Button onClick={handleApplyFilter} size="small">
              <Icons.Search /> Search
            </Button>
            <Button variant="secondary" onClick={handleResetFilter} size="small">
              This Week
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                setDateFilter({ fromDate: '', toDate: '' })
                setAppliedFilter({ fromDate: '', toDate: '' })
              }} 
              size="small"
            >
              Show All
            </Button>
            <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
              Showing: {!appliedFilter.fromDate && !appliedFilter.toDate
                ? 'All bookings'
                : appliedFilter.fromDate === appliedFilter.toDate 
                  ? formatDate(appliedFilter.fromDate)
                  : `${formatDate(appliedFilter.fromDate)} - ${formatDate(appliedFilter.toDate)}`
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Filters & Search */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setFilterStatus(status)}
              >
                {status === 'all' ? 'All' : status} ({count})
              </Button>
            ))}
          </div>
          
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              type="text"
              placeholder="Search by client name, phone, or therapist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              containerClassName="ui-mb-0"
            />
          </div>
        </div>
      </Card>

      {/* Bookings List */}
      <Card padding={false}>
        <CardHeader style={{ padding: '20px 24px', margin: 0, borderBottom: '1px solid var(--ui-border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <CardTitle subtitle={`${filteredBookings.length} bookings found`}>
              Booking List
            </CardTitle>
            <Button 
              variant="secondary" 
              size="small" 
              onClick={loadBookings}
              loading={isLoading}
            >
              <Icons.Refresh /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState text="Loading bookings..." />
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              icon={<Icons.Calendar />}
              title="No reservations found"
              description="No bookings match your current filters"
              action={
                <Button icon={<Icons.Plus />} onClick={() => handleOpenModal()}>
                  New Booking
                </Button>
              }
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Badge variant={booking.date === getTodayDate() ? 'info' : 'neutral'} size="small">
                          {formatDate(booking.date)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: '0.875rem' }}>
                          {formatTime(booking.reservedTime)}
                          <span style={{ color: 'var(--ui-text-muted)', margin: '0 4px' }}>-</span>
                          {getEndTime(booking.reservedTime, booking.durationMinutes)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div style={{ fontWeight: 500 }}>{booking.clientName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>
                            {booking.clientPhone || 'No phone'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.serviceName ? (
                          <Badge variant="info" size="small">{booking.serviceName}</Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{booking.therapistName || '-'}</TableCell>
                      <TableCell style={{ fontSize: '0.875rem' }}>{booking.centerName || '-'}</TableCell>
                      <TableCell style={{ fontSize: '0.875rem' }}>{booking.roomName || '-'}</TableCell>
                      <TableCell>{booking.durationMinutes} min</TableCell>
                      <TableCell style={{ textAlign: 'right', fontWeight: 500 }}>
                        €{booking.priceAgreement?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <Button variant="icon" size="small" onClick={() => handleOpenModal(booking)} title="Edit booking">
                            <Icons.Edit />
                          </Button>
                          <Button variant="icon" size="small" className="ui-btn-icon-danger" onClick={() => handleDeleteClick(booking)} title="Delete booking">
                            <Icons.Trash />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New/Edit Booking Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Booking' : 'New Booking'}
        subtitle={
          isIndividualView
            ? 'Book with room availability from the general calendar'
            : editingItem
              ? 'Update booking details'
              : 'Create a new client reservation'
        }
        size="large"
      >
        {error && (
          <div style={{ 
            padding: '12px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#dc2626',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {isIndividualView ? (
          <>
            <Grid cols={2} gap="default">
              <Input
                label="Client Name *"
                placeholder="Enter client name"
                value={formData.clientName || ''}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
              <Input
                label="Client Phone"
                placeholder="Optional"
                value={formData.clientPhone || ''}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              />
              <Select
                label="Duration *"
                options={durationOptions}
                value={formData.durationMinutes || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  durationMinutes: parseInt(e.target.value),
                  reservedTime: '',
                })}
              />
              {centersList.length > 1 && (
                <Select
                  label="Center"
                  options={centerFormOptions}
                  placeholder="Select center"
                  value={formData.centerId || ''}
                  onChange={(e) => handleCenterSelect(e.target.value)}
                />
              )}
              <Select
                label="Room *"
                options={roomFormOptions}
                placeholder="Select room"
                value={formData.roomId || ''}
                onChange={(e) => handleRoomSelect(e.target.value)}
              />
              <Input
                label="Therapist / Staff"
                value={formData.therapistName || staffDisplayName}
                readOnly
                disabled
              />
              {roomsList.find((r) => r.id === formData.roomId)?.roomPrice == null && (
                <Input
                  label="Price Agreement (€) *"
                  type="number"
                  step="0.01"
                  placeholder="Custom room price"
                  value={formData.priceAgreement ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceAgreement: e.target.value === '' ? 0 : parseFloat(e.target.value),
                    })
                  }
                />
              )}
            </Grid>

            <div style={{ marginTop: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.9375rem' }}>
                Select date & time *
              </div>
              <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: 'var(--ui-text-muted)' }}>
                Connected to the general calendar — free slots depend on room availability
                {formData.roomName ? ` for ${formData.roomName}` : '. Select a room first for accurate slots.'}
              </p>
              <div className="availability-calendar--admin">
                <AvailabilityCalendar
                  centerId={formData.centerId || ''}
                  roomId={formData.roomId || ''}
                  roomIds={
                    formData.roomId
                      ? [formData.roomId]
                      : roomsList
                          .filter((r) => !formData.centerId || r.centerId === formData.centerId)
                          .map((r) => r.id)
                  }
                  durationMinutes={formData.durationMinutes || 60}
                  selectedDate={formData.date || ''}
                  selectedTime={formData.reservedTime || ''}
                  onSelectDate={(date) => setFormData((prev) => ({ ...prev, date, reservedTime: '' }))}
                  onSelectTime={(time) => setFormData((prev) => ({ ...prev, reservedTime: time }))}
                  authMode="staff"
                  therapistId={isIndividualView ? staffProfile?.id || '' : ''}
                />
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginTop: '20px',
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid var(--ui-border)',
                background: 'var(--ui-bg)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            >
              <input
                type="checkbox"
                checked={legalAccepted}
                onChange={(e) => setLegalAccepted(e.target.checked)}
                style={{ marginTop: 3, flexShrink: 0 }}
              />
              <span>
                <strong>Legal license confirmation *</strong>
                <br />
                I accept the local license compliance: this booking is for massage services only
                and is not erotic in nature. / Acepto el cumplimiento legal de la licencia del local:
                se trata de masajes y nada erótico.
              </span>
            </label>
          </>
        ) : (
          <>
            <Grid cols={2} gap="default">
              <Input
                label="Client Name *"
                placeholder="Enter client name"
                value={formData.clientName || ''}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
              <Input
                label="Client Phone"
                placeholder="Optional"
                value={formData.clientPhone || ''}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              />
              <Select
                label="Service"
                options={serviceOptions}
                placeholder="Select service (optional)"
                value={formData.serviceId || ''}
                onChange={(e) => handleServiceSelect(e.target.value)}
              />
              <Select
                label="Therapist"
                options={staffOptions}
                placeholder="Select therapist (optional)"
                value={formData.therapistId || ''}
                onChange={(e) => handleTherapistSelect(e.target.value)}
              />
              <Select
                label="Center"
                options={centerFormOptions}
                placeholder="Select center"
                value={formData.centerId || ''}
                onChange={(e) => handleCenterSelect(e.target.value)}
              />
              <Select
                label="Room (optional)"
                options={roomFormOptions}
                placeholder="Select room (optional)"
                value={formData.roomId || ''}
                onChange={(e) => handleRoomSelect(e.target.value)}
              />
              <Select
                label="Duration *"
                options={durationOptions}
                value={formData.durationMinutes || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  durationMinutes: parseInt(e.target.value),
                  reservedTime: '',
                })}
              />
              <Input
                label="Price Agreement (€) *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.priceAgreement ?? ''}
                onChange={(e) => setFormData({ ...formData, priceAgreement: e.target.value ? parseFloat(e.target.value) : 0 })}
              />
              <Select
                label="Status *"
                options={statusOptions}
                value={formData.status || 'Pending'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
            </Grid>

            <div style={{ marginTop: '16px' }} className="availability-calendar--admin">
              <AvailabilityCalendar
                centerId={formData.centerId || ''}
                roomId={formData.roomId || ''}
                roomIds={roomsList
                  .filter((r) => !formData.centerId || r.centerId === formData.centerId)
                  .map((r) => r.id)}
                durationMinutes={formData.durationMinutes || 60}
                selectedDate={formData.date || ''}
                selectedTime={formData.reservedTime || ''}
                onSelectDate={(date) => setFormData((prev) => ({ ...prev, date, reservedTime: '' }))}
                onSelectTime={(time) => setFormData((prev) => ({ ...prev, reservedTime: time }))}
                authMode="staff"
              />
            </div>
          </>
        )}

        <div style={{ display: 'none' }}>
          <Input label="Date *" type="date" value={formData.date || ''} readOnly />
          <Input label="Reserved Time *" type="time" value={formData.reservedTime || ''} readOnly />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={isSaving}>
            {editingItem ? 'Update Booking' : 'Create Booking'}
          </Button>
        </div>
      </Modal>

      {/* Not Confirmed Reservations Section - admin (global) only */}
      {isAdmin && (
      <Card style={{ marginTop: '32px' }}>
        <CardHeader style={{ paddingBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <CardTitle subtitle={`${notConfirmedList.length} pending requests from public website (auto-refreshes every 30s)`}>
              Not Confirmed Reservations
            </CardTitle>
            <Button 
              variant="secondary" 
              size="small" 
              onClick={loadNotConfirmedReservations}
              loading={isLoadingNotConfirmed}
            >
              <Icons.Refresh /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingNotConfirmed ? (
            <LoadingState text="Loading booking requests..." />
          ) : notConfirmedList.length === 0 ? (
            <EmptyState
              icon={<Icons.Calendar />}
              title="No pending booking requests"
              description="Booking requests from the public website will appear here"
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notConfirmedList.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <Badge variant={reservation.date === getTodayDate() ? 'info' : 'neutral'} size="small">
                          {formatDate(reservation.date)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: '0.875rem' }}>
                          {formatTime(reservation.reservedTime)}
                          <span style={{ color: 'var(--ui-text-muted)', margin: '0 4px' }}>-</span>
                          {getEndTime(reservation.reservedTime, reservation.durationMinutes)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div style={{ fontWeight: 500 }}>{reservation.clientName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>{reservation.clientPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="info" size="small">{reservation.serviceName}</Badge>
                      </TableCell>
                      <TableCell>{reservation.durationMinutes} min</TableCell>
                      <TableCell style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>
                        {reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString('en-GB') : '-'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <Button 
                          variant="success" 
                          size="small" 
                          onClick={() => handleOpenConfirmModal(reservation)}
                        >
                          <Icons.Check /> Confirm
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Confirm Reservation Modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={handleCloseConfirmModal}
        title="Confirm Reservation"
        subtitle="Assign therapist and set price to create booking"
        size="default"
      >
        {confirmModal.item && (
          <>
            <div style={{ 
              background: 'var(--ui-bg)', 
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--ui-text-muted)' }}>Client:</span>{' '}
                  <strong>{confirmModal.item.clientName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--ui-text-muted)' }}>Phone:</span>{' '}
                  {confirmModal.item.clientPhone}
                </div>
                <div>
                  <span style={{ color: 'var(--ui-text-muted)' }}>Date:</span>{' '}
                  {formatDate(confirmModal.item.date)}
                </div>
                <div>
                  <span style={{ color: 'var(--ui-text-muted)' }}>Time:</span>{' '}
                  {formatTime(confirmModal.item.reservedTime)} ({confirmModal.item.durationMinutes} min)
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--ui-text-muted)' }}>Service:</span>{' '}
                  <Badge variant="info" size="small">{confirmModal.item.serviceName}</Badge>
                </div>
              </div>
            </div>

            <Grid cols={2} gap="default">
              <Select
                label="Assign Therapist"
                options={staffOptions}
                placeholder="Select therapist (optional)"
                value={confirmFormData.therapistId || ''}
                onChange={(e) => handleConfirmTherapistSelect(e.target.value)}
              />
              <Input
                label="Price Agreement (€) *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={confirmFormData.priceAgreement || ''}
                onChange={(e) => setConfirmFormData({ 
                  ...confirmFormData, 
                  priceAgreement: e.target.value ? parseFloat(e.target.value) : null 
                })}
              />
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <Button variant="secondary" onClick={handleCloseConfirmModal}>
                Cancel
              </Button>
              <Button onClick={handleConfirmReservation} loading={isConfirming}>
                <Icons.Check /> Confirm Booking
              </Button>
            </div>
          </>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message={`Are you sure you want to delete the booking for "${deleteConfirm.item?.clientName}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  )
}

export default Reservations

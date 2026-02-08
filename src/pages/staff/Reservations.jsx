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
import { bookingAPI, staffAPI, serviceAPI, getTodayDate, notConfirmedReservationAPI } from '../../services/dataService'

/**
 * Reservations - Manage client bookings and reservations
 * Staff Portal feature with modal form for creating/editing bookings
 * Includes Not Confirmed Reservations section for public booking requests
 */
const Reservations = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookings, setBookings] = useState([])
  const [staffList, setStaffList] = useState([])
  const [servicesList, setServicesList] = useState([])
  
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

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null })
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState({
    fromDate: getTodayDate(),
    toDate: getTodayDate(),
  })
  const [appliedFilter, setAppliedFilter] = useState({
    fromDate: getTodayDate(),
    toDate: getTodayDate(),
  })

  // Load data on mount and when filter changes
  useEffect(() => {
    loadStaticData()
    loadNotConfirmedReservations()
  }, [])

  useEffect(() => {
    loadBookings()
  }, [appliedFilter])

  const loadStaticData = async () => {
    try {
      const [staffData, servicesData] = await Promise.all([
        staffAPI.list(),
        serviceAPI.list(),
      ])
      setStaffList(staffData)
      setServicesList(servicesData)
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
      const { fromDate, toDate } = appliedFilter
      const data = await bookingAPI.list(fromDate, toDate)
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
    setDateFilter({ fromDate: today, toDate: today })
    setAppliedFilter({ fromDate: today, toDate: today })
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({ ...item })
    } else {
      setEditingItem(null)
      setFormData({
        date: getTodayDate(),
        status: 'Pending',
        durationMinutes: 60,
      })
    }
    setShowModal(true)
    setError(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({})
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
      
      await notConfirmedReservationAPI.confirm(confirmModal.item, {
        therapistId: confirmFormData.therapistId,
        therapistName: confirmFormData.therapistName,
        priceAgreement: confirmFormData.priceAgreement || 0,
      })
      
      // Update the filter to show the booking's date so the user can see the confirmed booking
      setDateFilter({ fromDate: bookingDate, toDate: bookingDate })
      setAppliedFilter({ fromDate: bookingDate, toDate: bookingDate })
      
      await loadNotConfirmedReservations()
      handleCloseConfirmModal()
    } catch (err) {
      setError(err.message || 'Failed to confirm reservation')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      // Validate required fields
      if (!formData.clientName?.trim()) throw new Error('Client Name is required')
      if (!formData.clientPhone?.trim()) throw new Error('Client Phone is required')
      if (!formData.date) throw new Error('Date is required')
      if (!formData.reservedTime) throw new Error('Reserved Time is required')
      if (!formData.durationMinutes) throw new Error('Duration is required')
      if (!formData.priceAgreement && formData.priceAgreement !== 0) throw new Error('Price Agreement is required')
      if (!formData.status) throw new Error('Status is required')

      if (editingItem) {
        await bookingAPI.update(editingItem.id, formData)
      } else {
        await bookingAPI.create(formData)
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

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

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

  // Service options for dropdown
  const serviceOptions = servicesList.map(s => ({
    value: s.id,
    label: s.serviceName + (s.fixedPrice ? ` - €${s.fixedPrice.toFixed(2)}` : ''),
  }))

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
        title="Reservations"
        subtitle="Manage and view all client bookings"
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
            <Button onClick={handleApplyFilter} size="small">
              <Icons.Search /> Search
            </Button>
            <Button variant="secondary" onClick={handleResetFilter} size="small">
              Today
            </Button>
            <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
              Showing: {appliedFilter.fromDate === appliedFilter.toDate 
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
        <CardHeader>
          <CardTitle subtitle={`${filteredBookings.length} bookings found`}>
            Booking List
          </CardTitle>
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
                          <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>{booking.clientPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.serviceName ? (
                          <Badge variant="info" size="small">{booking.serviceName}</Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{booking.therapistName || '-'}</TableCell>
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <Button variant="ghost" size="small" onClick={() => handleOpenModal(booking)}>
                            <Icons.Edit />
                          </Button>
                          <Button variant="ghost" size="small" onClick={() => handleDeleteClick(booking)}>
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
        subtitle={editingItem ? 'Update booking details' : 'Create a new client reservation'}
        size="default"
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
        
        <Grid cols={2} gap="default">
          <Input
            label="Client Name *"
            placeholder="Enter client name"
            value={formData.clientName || ''}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          />
          <Input
            label="Client Phone *"
            placeholder="+34 612 345 678"
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
          <Input
            label="Date *"
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label="Reserved Time *"
            type="time"
            value={formData.reservedTime || ''}
            onChange={(e) => setFormData({ ...formData, reservedTime: e.target.value })}
          />
          <Select
            label="Duration *"
            options={durationOptions}
            value={formData.durationMinutes || ''}
            onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
          />
          <Input
            label="Price Agreement (€) *"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.priceAgreement || ''}
            onChange={(e) => setFormData({ ...formData, priceAgreement: e.target.value ? parseFloat(e.target.value) : null })}
          />
          <Select
            label="Status *"
            options={statusOptions}
            value={formData.status || 'Pending'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </Grid>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={isSaving}>
            {editingItem ? 'Update Booking' : 'Create Booking'}
          </Button>
        </div>
      </Modal>

      {/* Not Confirmed Reservations Section */}
      <Card style={{ marginTop: '32px' }}>
        <CardHeader>
          <CardTitle subtitle={`${notConfirmedList.length} pending requests from public website`}>
            Not Confirmed Reservations
          </CardTitle>
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
                          variant="primary" 
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

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  PageHeader,
  Icons,
  LoadingState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  EmptyState,
  Modal,
  Input,
} from '../../components/admin/ui'
import { bookingAPI, formatDisplayDate, getTodayDate, getDateFromToday } from '../../services/dataService'
import { useAuth } from '../../context/AuthContext'
import { timeToMinutes, minutesToTime } from '../../utils/availability'

/**
 * To Do — booked services for the current role
 * Users: own pending bookings only
 * Admin / Mini Admin: all staff pending bookings
 */
const Todo = () => {
  const { isUser, staffProfile, isLoading: authLoading } = useAuth()
  const isIndividualView = isUser
  const [todoBookings, setTodoBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState({ open: false, item: null })
  const [cancelReason, setCancelReason] = useState('')
  const [isCanceling, setIsCanceling] = useState(false)
  const [cancelError, setCancelError] = useState(null)

  const getEndTime = (startTime, durationMinutes) => {
    if (!startTime) return ''
    return minutesToTime(timeToMinutes(startTime) + (Number(durationMinutes) || 60))
  }

  const loadTodo = useCallback(async () => {
    setIsLoading(true)
    try {
      if (isIndividualView && !staffProfile?.id) {
        setTodoBookings([])
        return
      }
      const from = getTodayDate()
      const to = getDateFromToday(60)
      const filterOptions = {
        ...(isIndividualView && staffProfile?.id ? { therapistId: staffProfile.id } : {}),
      }
      const data = await bookingAPI.listPending(from, to, filterOptions)
      data.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return (a.reservedTime || '').localeCompare(b.reservedTime || '')
      })
      setTodoBookings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [isIndividualView, staffProfile?.id])

  useEffect(() => {
    if (authLoading) return
    loadTodo()
  }, [authLoading, loadTodo])

  const openCancel = (item) => {
    setCancelModal({ open: true, item })
    setCancelReason('')
    setCancelError(null)
  }

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      setCancelError('Please explain the reason for canceling')
      return
    }
    setIsCanceling(true)
    setCancelError(null)
    try {
      await bookingAPI.cancel(cancelModal.item, cancelReason.trim())
      setCancelModal({ open: false, item: null })
      await loadTodo()
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel')
    } finally {
      setIsCanceling(false)
    }
  }

  if (authLoading) {
    return <LoadingState text="Loading..." />
  }

  if (isIndividualView && !staffProfile?.id) {
    return (
      <EmptyState
        icon={<Icons.Users />}
        title="Staff profile required"
        description="Link your Cognito email to a Staff record to see your booked services."
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="To Do"
        subtitle={
          isIndividualView
            ? 'Services booked for you (pending)'
            : 'All staff booked services (pending)'
        }
        actions={
          <Button variant="secondary" size="small" onClick={loadTodo}>
            <Icons.Search /> Refresh
          </Button>
        }
      />

      <Card padding={false}>
        <CardHeader>
          <CardTitle subtitle={`${todoBookings.length} pending service(s)`}>
            Booked services
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState text="Loading to-do list..." />
          ) : todoBookings.length === 0 ? (
            <EmptyState
              title="Nothing to do"
              description="No pending reservations in the next 60 days"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>Finish</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todoBookings.map((b) => {
                  const start = b.reservedTime?.substring(0, 5) || '-'
                  const finish = getEndTime(start, b.durationMinutes)
                  return (
                    <TableRow key={b.id}>
                      <TableCell>{b.therapistName || '-'}</TableCell>
                      <TableCell>
                        <div style={{ fontWeight: 500 }}>{b.clientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>
                          {b.clientPhone || 'No phone'}
                        </div>
                      </TableCell>
                      <TableCell>{b.serviceName || '-'}</TableCell>
                      <TableCell>{formatDisplayDate(b.date)}</TableCell>
                      <TableCell>{b.durationMinutes || 60} min</TableCell>
                      <TableCell>{start}</TableCell>
                      <TableCell>{finish}</TableCell>
                      <TableCell>{b.roomName || '-'}</TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <Button variant="danger" size="small" onClick={() => openCancel(b)}>
                          Cancel service
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, item: null })}
        title="Cancel service"
        subtitle="Are you sure you want to cancel this reservation?"
        size="default"
      >
        {cancelModal.item && (
          <div style={{ marginBottom: 16, fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
            <Badge variant="warning">Pending</Badge>{' '}
            <strong>{cancelModal.item.clientName}</strong> · {formatDisplayDate(cancelModal.item.date)} ·{' '}
            {cancelModal.item.reservedTime?.substring(0, 5)}
            {cancelModal.item.serviceName ? ` · ${cancelModal.item.serviceName}` : ''}
          </div>
        )}
        {cancelError && (
          <div
            style={{
              padding: 12,
              marginBottom: 12,
              background: 'rgba(239,68,68,0.1)',
              color: '#dc2626',
              borderRadius: 8,
              fontSize: '0.875rem',
            }}
          >
            {cancelError}
          </div>
        )}
        <Input
          label="Reason for cancel *"
          placeholder="Explain why this service is canceled"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Button variant="secondary" onClick={() => setCancelModal({ open: false, item: null })}>
            No, keep it
          </Button>
          <Button variant="danger" loading={isCanceling} onClick={handleCancelConfirm}>
            Yes, cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Todo

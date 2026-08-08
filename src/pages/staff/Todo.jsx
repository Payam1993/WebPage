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
import { staffT as t } from '../../i18n/staffEs'

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
      setCancelError(t.todo.cancelReasonRequired)
      return
    }
    setIsCanceling(true)
    setCancelError(null)
    try {
      await bookingAPI.cancel(cancelModal.item, cancelReason.trim())
      setCancelModal({ open: false, item: null })
      await loadTodo()
    } catch (err) {
      setCancelError(err.message || t.todo.cancelFailed)
    } finally {
      setIsCanceling(false)
    }
  }

  if (authLoading) {
    return <LoadingState text={t.common.loading} />
  }

  if (isIndividualView && !staffProfile?.id) {
    return (
      <EmptyState
        icon={<Icons.Users />}
        title={t.todo.profileRequired}
        description={t.todo.profileRequiredDesc}
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={t.todo.title}
        subtitle={
          isIndividualView
            ? t.todo.subtitleUser
            : t.todo.subtitleAdmin
        }
        actions={
          <Button variant="secondary" size="small" onClick={loadTodo}>
            <Icons.Search /> {t.common.refresh}
          </Button>
        }
      />

      <Card padding={false}>
        <CardHeader>
          <CardTitle subtitle={`${todoBookings.length} ${t.todo.pendingCount}`}>
            {t.todo.bookedServices}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState text={t.todo.loading} />
          ) : todoBookings.length === 0 ? (
            <EmptyState
              title={t.todo.nothing}
              description={t.todo.nothingDesc}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.therapist}</TableHead>
                  <TableHead>{t.common.client}</TableHead>
                  <TableHead>{t.common.service}</TableHead>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.common.duration}</TableHead>
                  <TableHead>{t.todo.start}</TableHead>
                  <TableHead>{t.todo.finish}</TableHead>
                  <TableHead>{t.common.room}</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>{t.common.actions}</TableHead>
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
                          {b.clientPhone || t.common.noPhone}
                        </div>
                      </TableCell>
                      <TableCell>{b.serviceName || '-'}</TableCell>
                      <TableCell>{formatDisplayDate(b.date)}</TableCell>
                      <TableCell>{b.durationMinutes || 60} {t.common.min}</TableCell>
                      <TableCell>{start}</TableCell>
                      <TableCell>{finish}</TableCell>
                      <TableCell>{b.roomName || '-'}</TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <Button variant="danger" size="small" onClick={() => openCancel(b)}>
                          {t.todo.cancelService}
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
        title={t.todo.cancelTitle}
        subtitle={t.todo.cancelSubtitle}
        size="default"
      >
        {cancelModal.item && (
          <div style={{ marginBottom: 16, fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
            <Badge variant="warning">{t.status.pending}</Badge>{' '}
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
          label={t.todo.cancelReason}
          placeholder={t.todo.cancelReasonPlaceholder}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Button variant="secondary" onClick={() => setCancelModal({ open: false, item: null })}>
            {t.todo.keepIt}
          </Button>
          <Button variant="danger" loading={isCanceling} onClick={handleCancelConfirm}>
            {t.todo.yesCancel}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Todo

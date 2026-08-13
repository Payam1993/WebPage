import { useState, useEffect, useCallback, useMemo } from 'react'
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
  EmptyState,
  LoadingState,
  Icons,
  Modal,
  Input,
  Select,
} from '../../components/admin/ui'
import {
  bookingAPI,
  staffAPI,
  roomAPI,
  notConfirmedReservationAPI,
  notConfirmedCostAPI,
  formatDisplayDate,
  getBookingLocalPayment,
  getBookingTotalPayment,
} from '../../services/dataService'
import {
  isAwaitingServiceConfirm,
  isPaymentPending,
  getBookingEndTime,
  isPublicWebRequest,
} from '../../utils/bookingStatus'
import {
  toBusyIntervals,
  getSlotConflictReasons,
  isRoomBlocked,
  timeToMinutes,
} from '../../utils/availability'
import { bookingErrorMessage } from '../../utils/bookingErrors'
import { useAuth } from '../../context/AuthContext'
import { staffT as t } from '../../i18n/staffEs'

/**
 * Pending Confirmations — Mini Admin / Admin
 * - Public website reservation requests (not staff-link — those go to the owning User)
 * - Staff cost submissions
 * - Past bookings awaiting service confirmation
 * - Payments awaiting approval (all confirmed reservations)
 */
const PendingConfirmations = () => {
  const { isAdmin, isMiniAdmin } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [pendingReservations, setPendingReservations] = useState([])
  const [pendingCosts, setPendingCosts] = useState([])
  const [awaitingService, setAwaitingService] = useState([])
  const [awaitingPayment, setAwaitingPayment] = useState([])
  const [staffList, setStaffList] = useState([])
  const [roomsList, setRoomsList] = useState([])
  const [dayBusy, setDayBusy] = useState([])
  const [error, setError] = useState(null)
  const [confirmItem, setConfirmItem] = useState(null)
  const [confirmForm, setConfirmForm] = useState({
    totalPayment: '',
    localPayment: '',
    therapistId: '',
    therapistName: '',
    roomId: '',
    roomName: '',
    centerId: '',
    centerName: '',
  })
  const [confirmError, setConfirmError] = useState(null)
  const [conflictReasons, setConflictReasons] = useState([])

  const loadAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [reservations, costs, bookings, staff, rooms] = await Promise.all([
        notConfirmedReservationAPI.list(),
        notConfirmedCostAPI.list(),
        bookingAPI.list(),
        staffAPI.list(),
        roomAPI.list(),
      ])
      setPendingReservations((reservations || []).filter((r) => isPublicWebRequest(r)))
      setPendingCosts(costs || [])
      setAwaitingService((bookings || []).filter((b) => isAwaitingServiceConfirm(b)))
      setAwaitingPayment((bookings || []).filter((b) => isPaymentPending(b)))
      setStaffList(staff || [])
      setRoomsList(rooms || [])
    } catch (err) {
      console.error(err)
      setError(err.message || t.pending.failedLoad)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
    const id = setInterval(loadAll, 30000)
    return () => clearInterval(id)
  }, [loadAll])

  const runAction = async (id, fn) => {
    setActionId(id)
    try {
      await fn()
      await loadAll()
    } catch (err) {
      alert(bookingErrorMessage(err, t.bookingErrors))
    } finally {
      setActionId(null)
    }
  }

  const centerRooms = useMemo(() => {
    if (!confirmItem) return []
    return (roomsList || []).filter(
      (r) => !confirmItem.centerId || !r.centerId || r.centerId === confirmItem.centerId
    )
  }, [roomsList, confirmItem])

  const computeConflicts = (form, item, busy) => {
    if (!item?.date || !item?.reservedTime) return []
    return getSlotConflictReasons({
      dateKey: item.date,
      startTime: item.reservedTime,
      durationMinutes: item.durationMinutes,
      busyIntervals: busy,
      roomId: form.roomId || null,
      therapistId: form.therapistId || null,
    })
  }

  const roomOptions = useMemo(() => {
    if (!confirmItem) return []
    const start = timeToMinutes(confirmItem.reservedTime)
    const end = start + (Number(confirmItem.durationMinutes) || 60)
    return centerRooms.map((r) => {
      const occupied = isRoomBlocked(dayBusy, r.id, start, end)
      return {
        value: r.id,
        label: occupied
          ? `${r.roomName} — ${t.pending.roomOccupied}`
          : `${r.roomName} — ${t.pending.roomAvailable}`,
        disabled: occupied,
      }
    })
  }, [centerRooms, confirmItem, dayBusy])

  const staffOptions = useMemo(
    () =>
      (staffList || []).map((s) => ({
        value: s.id,
        label: [s.staffName, s.lastName].filter(Boolean).join(' ') || s.staffName,
      })),
    [staffList]
  )

  const openConfirmModal = async (item) => {
    setConfirmItem(item)
    const initial = {
      totalPayment: '',
      localPayment: '',
      therapistId: item.therapistId || '',
      therapistName: item.therapistName || '',
      roomId: item.roomId || '',
      roomName: item.roomName || '',
      centerId: item.centerId || '',
      centerName: item.centerName || '',
    }
    setConfirmForm(initial)
    setConfirmError(null)
    setConflictReasons([])
    try {
      const [dayBookings, pending] = await Promise.all([
        bookingAPI.list(item.date, item.date, {
          ...(item.centerId ? { centerId: item.centerId } : {}),
        }),
        notConfirmedReservationAPI.list(item.date, item.date),
      ])
      const busy = toBusyIntervals([
        ...(dayBookings || []),
        ...(pending || []).filter((p) => p.id !== item.id),
      ])
      setDayBusy(busy)
      setConflictReasons(computeConflicts(initial, item, busy))
    } catch (err) {
      console.error(err)
      setDayBusy([])
    }
  }

  const closeConfirmModal = () => {
    setConfirmItem(null)
    setConfirmForm({
      totalPayment: '',
      localPayment: '',
      therapistId: '',
      therapistName: '',
      roomId: '',
      roomName: '',
      centerId: '',
      centerName: '',
    })
    setConfirmError(null)
    setConflictReasons([])
    setDayBusy([])
  }

  const handleTherapistChange = (staffId) => {
    const staff = staffList.find((s) => s.id === staffId)
    const next = {
      ...confirmForm,
      therapistId: staffId,
      therapistName: staff
        ? [staff.staffName, staff.lastName].filter(Boolean).join(' ')
        : '',
    }
    setConfirmForm(next)
    setConflictReasons(computeConflicts(next, confirmItem, dayBusy))
    setConfirmError(null)
  }

  const handleRoomChange = (roomId) => {
    const room = roomsList.find((r) => r.id === roomId)
    const next = {
      ...confirmForm,
      roomId,
      roomName: room?.roomName || '',
      centerId: room?.centerId || confirmForm.centerId || confirmItem?.centerId || '',
      centerName: room?.centerName || confirmForm.centerName || confirmItem?.centerName || '',
    }
    setConfirmForm(next)
    setConflictReasons(computeConflicts(next, confirmItem, dayBusy))
    setConfirmError(null)
  }

  const canConfirm =
    !!confirmForm.therapistId &&
    !!confirmForm.roomId &&
    conflictReasons.length === 0 &&
    confirmForm.localPayment !== '' &&
    confirmForm.localPayment != null &&
    !Number.isNaN(Number(confirmForm.localPayment))

  const handleConfirmReservation = async () => {
    if (!confirmForm.therapistId) {
      setConfirmError(t.bookingErrors.THERAPIST_REQUIRED)
      return
    }
    if (!confirmForm.roomId) {
      setConfirmError(t.bookingErrors.ROOM_REQUIRED)
      return
    }
    if (conflictReasons.length) {
      setConfirmError(conflictReasons[0])
      return
    }
    if (
      confirmForm.localPayment === '' ||
      confirmForm.localPayment == null ||
      Number.isNaN(Number(confirmForm.localPayment))
    ) {
      setConfirmError(t.reservations.localPaymentRequiredError)
      return
    }
    if (!isPublicWebRequest(confirmItem)) {
      setConfirmError(t.pending.staffLinkMustConfirmByUser)
      return
    }
    const id = confirmItem.id
    setActionId(id)
    setConfirmError(null)
    try {
      await notConfirmedReservationAPI.confirm(confirmItem, {
        therapistId: confirmForm.therapistId,
        therapistName: confirmForm.therapistName,
        roomId: confirmForm.roomId,
        roomName: confirmForm.roomName,
        centerId: confirmForm.centerId || confirmItem.centerId,
        centerName: confirmForm.centerName || confirmItem.centerName,
        totalPayment:
          confirmForm.totalPayment === '' || confirmForm.totalPayment == null
            ? null
            : Number(confirmForm.totalPayment),
        localPayment: Number(confirmForm.localPayment),
        priceAgreement: Number(confirmForm.localPayment),
        bookingSource: 'PublicWeb',
      })
      closeConfirmModal()
      await loadAll()
    } catch (err) {
      if (err?.errorCode === 'ALREADY_CONFIRMED') {
        closeConfirmModal()
        await loadAll()
        return
      }
      setConfirmError(bookingErrorMessage(err, t.bookingErrors))
    } finally {
      setActionId(null)
    }
  }

  if (!isAdmin && !isMiniAdmin) {
    return (
      <EmptyState
        icon={<Icons.Users />}
        title={t.common.accessDenied}
        description={t.pending.accessDeniedDesc}
      />
    )
  }

  if (isLoading) {
    return <LoadingState text={t.pending.loading} />
  }

  return (
    <div>
      <PageHeader
        title={t.pending.title}
        subtitle={t.pending.subtitle}
        actions={
          <Button variant="secondary" size="small" onClick={loadAll}>
            {t.common.refresh}
          </Button>
        }
      />

      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: 'rgba(239,68,68,0.1)', color: '#dc2626', borderRadius: 8 }}>
          {error}
        </div>
      )}

      {/* Public booking requests */}
      <Card padding={false} style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle={`${pendingReservations.length} ${t.pending.awaitingConfirmation}`}>
            {t.pending.reservationRequests}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReservations.length === 0 ? (
            <EmptyState
              title={t.pending.noReservationRequests}
              description={t.pending.noReservationRequestsDesc}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.common.time}</TableHead>
                  <TableHead>{t.common.client}</TableHead>
                  <TableHead>{t.common.service}</TableHead>
                  <TableHead>{t.common.center} / {t.common.room}</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReservations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDisplayDate(item.date)}</TableCell>
                    <TableCell>{item.reservedTime?.substring(0, 5)}</TableCell>
                    <TableCell>
                      <div style={{ fontWeight: 500 }}>{item.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>{item.clientPhone}</div>
                    </TableCell>
                    <TableCell>{item.serviceName}</TableCell>
                    <TableCell style={{ fontSize: '0.875rem' }}>
                      {item.centerName || '-'}{item.roomName ? ` / ${item.roomName}` : ''}
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => openConfirmModal(item)}
                      >
                        {t.pending.confirmReservation}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Service realized */}
      <Card padding={false} style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle={`${awaitingService.length} ${t.pending.slotsFinished}`}>
            {t.pending.serviceConfirmation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingService.length === 0 ? (
            <EmptyState
              title={t.pending.noServicesWaiting}
              description={t.pending.noServicesWaitingDesc}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.pending.hours}</TableHead>
                  <TableHead>{t.pending.staff}</TableHead>
                  <TableHead>{t.common.room}</TableHead>
                  <TableHead>{t.common.client}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awaitingService.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDisplayDate(item.date)}</TableCell>
                    <TableCell>
                      {item.reservedTime?.substring(0, 5)} – {getBookingEndTime(item)}
                    </TableCell>
                    <TableCell>{item.therapistName || '-'}</TableCell>
                    <TableCell>{item.roomName || '-'}</TableCell>
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell><Badge variant="warning">{t.pending.pendingServiceConfirm}</Badge></TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Button
                        variant="success"
                        size="small"
                        loading={actionId === item.id}
                        onClick={() =>
                          runAction(item.id, () => bookingAPI.confirmServiceDone(item))
                        }
                      >
                        {t.pending.confirmServiceDone}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment approval */}
      <Card padding={false} style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle={`${awaitingPayment.length} ${t.pending.staffPaymentsToApprove}`}>
            {t.pending.paymentApproval}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingPayment.length === 0 ? (
            <EmptyState
              title={t.pending.noPaymentsPending}
              description={t.pending.noPaymentsPendingDesc}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.pending.staff}</TableHead>
                  <TableHead>{t.common.room}</TableHead>
                  <TableHead>{t.common.client}</TableHead>
                  <TableHead>{t.reservations.totalPayment}</TableHead>
                  <TableHead>{t.reservations.localPayment}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awaitingPayment.map((item) => {
                  const totalPay = getBookingTotalPayment(item)
                  const localPay = getBookingLocalPayment(item)
                  return (
                  <TableRow key={item.id}>
                    <TableCell>{formatDisplayDate(item.date)}</TableCell>
                    <TableCell>{item.therapistName || '-'}</TableCell>
                    <TableCell>{item.roomName || '-'}</TableCell>
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell>{totalPay != null ? `€${Number(totalPay).toFixed(2)}` : '—'}</TableCell>
                    <TableCell>€{Number(localPay).toFixed(2)}</TableCell>
                    <TableCell><Badge variant="info">{t.pending.paymentPending}</Badge></TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Button
                        variant="success"
                        size="small"
                        loading={actionId === item.id}
                        onClick={() =>
                          runAction(item.id, () => bookingAPI.approvePayment(item))
                        }
                      >
                        {t.pending.approvePayment}
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

      {/* Cost submissions */}
      <Card padding={false}>
        <CardHeader>
          <CardTitle subtitle={`${pendingCosts.length} ${t.pending.costSubmissions}`}>
            {t.pending.costConfirmations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingCosts.length === 0 ? (
            <EmptyState
              title={t.pending.noPendingCosts}
              description={t.pending.noPendingCostsDesc}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.costs.costName}</TableHead>
                  <TableHead>{t.common.price}</TableHead>
                  <TableHead>{t.costs.reason}</TableHead>
                  <TableHead>{t.pending.submittedBy}</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCosts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDisplayDate(item.date)}</TableCell>
                    <TableCell>{item.costName}</TableCell>
                    <TableCell>€{(item.price || 0).toFixed(2)}</TableCell>
                    <TableCell style={{ fontSize: '0.875rem' }}>{item.reason || '-'}</TableCell>
                    <TableCell>{item.submittedBy || '-'}</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Button
                        variant="success"
                        size="small"
                        loading={actionId === item.id}
                        onClick={() =>
                          runAction(item.id, () => notConfirmedCostAPI.confirm(item))
                        }
                      >
                        {t.pending.confirmCost}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={!!confirmItem}
        onClose={closeConfirmModal}
        title={t.pending.confirmReservation}
        subtitle={
          confirmItem
            ? `${confirmItem.clientName} · ${formatDisplayDate(confirmItem.date)} · ${confirmItem.reservedTime?.substring(0, 5) || ''}`
            : ''
        }
      >
        {confirmError && (
          <div
            style={{
              padding: 12,
              marginBottom: 16,
              background: 'rgba(239,68,68,0.1)',
              color: '#dc2626',
              borderRadius: 8,
            }}
          >
            {confirmError}
          </div>
        )}

        <Select
          label={t.pending.assignTherapistRequired}
          options={staffOptions}
          placeholder={t.pending.selectTherapistRequired}
          value={confirmForm.therapistId || ''}
          onChange={(e) => handleTherapistChange(e.target.value)}
        />
        <Select
          label={t.pending.assignRoomRequired}
          options={roomOptions}
          placeholder={t.pending.selectRoomRequired}
          value={confirmForm.roomId || ''}
          onChange={(e) => handleRoomChange(e.target.value)}
        />

        {conflictReasons.length > 0 && (
          <div
            style={{
              padding: 12,
              marginBottom: 16,
              background: 'rgba(239,68,68,0.08)',
              color: '#dc2626',
              borderRadius: 8,
              fontSize: '0.875rem',
            }}
          >
            {conflictReasons.map((r) => (
              <div key={r}>{r}</div>
            ))}
            <div style={{ marginTop: 6 }}>{t.pending.conflictHint}</div>
          </div>
        )}

        <Input
          label={t.reservations.totalPaymentOptional}
          type="number"
          min="0"
          step="0.01"
          value={confirmForm.totalPayment}
          onChange={(e) =>
            setConfirmForm({
              ...confirmForm,
              totalPayment: e.target.value === '' ? '' : e.target.value,
            })
          }
          placeholder={t.reservations.totalPaymentHint}
        />
        <Input
          label={t.reservations.localPaymentRequired}
          type="number"
          min="0"
          step="0.01"
          value={confirmForm.localPayment}
          onChange={(e) =>
            setConfirmForm({
              ...confirmForm,
              localPayment: e.target.value === '' ? '' : e.target.value,
            })
          }
          placeholder={t.reservations.localPaymentHint}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <Button variant="secondary" onClick={closeConfirmModal}>
            {t.common.cancel}
          </Button>
          <Button
            variant="success"
            loading={actionId === confirmItem?.id}
            disabled={!canConfirm}
            onClick={handleConfirmReservation}
          >
            {t.pending.confirmReservation}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default PendingConfirmations

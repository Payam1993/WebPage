import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  StatCard,
  PageHeader,
  Grid,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Icons,
  EmptyState,
  LoadingState,
} from '../../components/admin/ui'
import {
  bookingAPI,
  roomAPI,
  getTodayDate,
  formatDisplayDate,
} from '../../services/dataService'
import {
  getBookingEndTime,
  isAwaitingServiceConfirm,
  isPaymentPending,
  isTodayBooking,
} from '../../utils/bookingStatus'
import { staffT as t } from '../../i18n/staffEs'

/**
 * Mini Admin dashboard — all-staff overview, room cards, daily plan, confirm flow
 */
const MiniAdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState(null)
  const today = getTodayDate()

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [allBookings, roomList] = await Promise.all([
        bookingAPI.list(),
        roomAPI.list(),
      ])
      setBookings(allBookings || [])
      setRooms(roomList || [])
    } catch (err) {
      console.error(err)
      setError(err.message || t.miniAdmin.failedLoad)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 60000)
    return () => clearInterval(id)
  }, [loadData])

  const runAction = async (id, fn) => {
    setActionId(id)
    try {
      await fn()
      await loadData()
    } catch (err) {
      alert(err.message || t.miniAdmin.actionFailed)
    } finally {
      setActionId(null)
    }
  }

  const stats = useMemo(() => {
    const total = bookings.length
    const pending = bookings.filter((b) => b.status === 'Pending').length
    const paymentPending = bookings.filter((b) => isPaymentPending(b)).length
    return { total, pending, paymentPending }
  }, [bookings])

  const roomCards = useMemo(() => {
    return (rooms || []).map((room) => {
      const count = bookings.filter(
        (b) => b.roomId === room.id || (!b.roomId && b.roomName === room.roomName)
      ).length
      return {
        id: room.id,
        name: room.roomName,
        center: room.centerName,
        reference: room.referenceNumber,
        count,
      }
    })
  }, [rooms, bookings])

  const dailyPlan = useMemo(() => {
    return bookings
      .filter((b) => isTodayBooking(b) && b.status !== 'Canceled')
      .slice()
      .sort((a, b) => (a.reservedTime || '').localeCompare(b.reservedTime || ''))
      .map((b) => ({
        id: b.id,
        start: b.reservedTime?.substring(0, 5) || '-',
        finish: getBookingEndTime(b),
        staff: b.therapistName || t.common.unassigned,
        room: b.roomName || '-',
        client: b.clientName,
        status: b.status,
      }))
  }, [bookings])

  const awaitingService = useMemo(
    () => bookings.filter((b) => isAwaitingServiceConfirm(b)),
    [bookings]
  )

  const awaitingPayment = useMemo(
    () => bookings.filter((b) => isPaymentPending(b)),
    [bookings]
  )

  if (isLoading) {
    return <LoadingState text={t.miniAdmin.loading} />
  }

  return (
    <div>
      <PageHeader
        title={t.miniAdmin.title}
        subtitle={t.miniAdmin.subtitle}
        actions={
          <Button variant="secondary" size="small" onClick={loadData}>
            {t.common.refresh}
          </Button>
        }
      />

      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: 'rgba(239,68,68,0.1)', color: '#dc2626', borderRadius: 8 }}>
          {error}
        </div>
      )}

      <Grid cols={3} gap="default" style={{ marginBottom: 24 }}>
        <StatCard
          title={t.miniAdmin.staffPendingPayments}
          value={String(stats.paymentPending)}
          icon={<Icons.DollarSign />}
          subtitle={t.miniAdmin.awaitingPaymentApproval}
        />
        <StatCard
          title={t.miniAdmin.totalReservations}
          value={String(stats.total)}
          icon={<Icons.Calendar />}
          subtitle={t.miniAdmin.allStaff}
        />
        <StatCard
          title={t.miniAdmin.pendingReservations}
          value={String(stats.pending)}
          icon={<Icons.Clock />}
          subtitle={t.miniAdmin.allStaffNotDone}
        />
      </Grid>

      {/* Room cards — names live from Room table */}
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle={t.miniAdmin.reservationsByRoomSubtitle}>
            {t.miniAdmin.reservationsByRoom}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {roomCards.length === 0 ? (
            <EmptyState title={t.miniAdmin.noRooms} description={t.miniAdmin.noRoomsDesc} />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 16,
              }}
            >
              {roomCards.map((room) => (
                <div
                  key={room.id}
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid var(--ui-border)',
                    background: 'var(--ui-bg)',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>
                    {room.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)', marginBottom: 12 }}>
                    {room.center || '—'}
                    {room.reference ? ` · ${room.reference}` : ''}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ui-primary)' }}>
                    {room.count}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>
                    {t.miniAdmin.reservations}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily planning */}
      <Card padding={false} style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle={`${t.miniAdmin.today} · ${formatDisplayDate(today)}`}>
            {t.miniAdmin.dailyPlanning}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyPlan.length === 0 ? (
            <EmptyState
              title={t.miniAdmin.noReservationsToday}
              description={t.miniAdmin.noReservationsTodayDesc}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.miniAdmin.hourStart}</TableHead>
                  <TableHead>{t.miniAdmin.hourFinish}</TableHead>
                  <TableHead>{t.miniAdmin.staffName}</TableHead>
                  <TableHead>{t.miniAdmin.roomReserved}</TableHead>
                  <TableHead>{t.common.client}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyPlan.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.start}</TableCell>
                    <TableCell>{row.finish}</TableCell>
                    <TableCell>{row.staff}</TableCell>
                    <TableCell>{row.room}</TableCell>
                    <TableCell>{row.client}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'Done' ? 'success' : 'warning'}>
                        {t.statusLabel[row.status] || row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Past slots → confirm service */}
      <Card padding={false} style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle={t.miniAdmin.pendingServiceConfirmSubtitle}>
            {t.miniAdmin.pendingServiceConfirmTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingService.length === 0 ? (
            <EmptyState
              title={t.miniAdmin.nothingToConfirm}
              description={t.miniAdmin.nothingToConfirmDesc}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.miniAdmin.hours}</TableHead>
                  <TableHead>{t.miniAdmin.staff}</TableHead>
                  <TableHead>{t.common.room}</TableHead>
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
                    <TableCell>
                      <Badge variant="warning">{t.miniAdmin.pendingToConfirm}</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Button
                        variant="success"
                        size="small"
                        loading={actionId === item.id}
                        onClick={() =>
                          runAction(item.id, () => bookingAPI.confirmServiceDone(item))
                        }
                      >
                        {t.miniAdmin.confirmServiceDone}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* After service confirm → approve payment */}
      <Card padding={false}>
        <CardHeader>
          <CardTitle subtitle={t.miniAdmin.paymentApprovedSubtitle}>
            {t.miniAdmin.paymentApprovedQueue}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingPayment.length === 0 ? (
            <EmptyState
              title={t.miniAdmin.noPaymentsWaiting}
              description={t.miniAdmin.noPaymentsWaitingDesc}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.miniAdmin.staff}</TableHead>
                  <TableHead>{t.common.room}</TableHead>
                  <TableHead>{t.miniAdmin.amount}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awaitingPayment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDisplayDate(item.date)}</TableCell>
                    <TableCell>{item.therapistName || '-'}</TableCell>
                    <TableCell>{item.roomName || '-'}</TableCell>
                    <TableCell>€{(item.priceAgreement || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="info">{t.miniAdmin.paymentPending}</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Button
                        variant="success"
                        size="small"
                        loading={actionId === item.id}
                        onClick={() =>
                          runAction(item.id, () => bookingAPI.approvePayment(item))
                        }
                      >
                        {t.miniAdmin.approvePayment}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MiniAdminDashboard

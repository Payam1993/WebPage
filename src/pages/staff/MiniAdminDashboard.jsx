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
      setError(err.message || 'Failed to load dashboard')
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
      alert(err.message || 'Action failed')
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
        staff: b.therapistName || 'Unassigned',
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
    return <LoadingState text="Loading mini admin dashboard..." />
  }

  return (
    <div>
      <PageHeader
        title="Mini Admin Dashboard"
        subtitle="Staff payments, reservations overview, room activity, and daily planning"
        actions={
          <Button variant="secondary" size="small" onClick={loadData}>
            Refresh
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
          title="Staff pending payments"
          value={String(stats.paymentPending)}
          icon={<Icons.DollarSign />}
          subtitle="Awaiting payment approval"
        />
        <StatCard
          title="Total reservations"
          value={String(stats.total)}
          icon={<Icons.Calendar />}
          subtitle="All staff"
        />
        <StatCard
          title="Pending reservations"
          value={String(stats.pending)}
          icon={<Icons.Clock />}
          subtitle="All staff — not yet done"
        />
      </Grid>

      {/* Room cards — names live from Room table */}
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle="Counts follow Room records — rename a room and the card label updates">
            Reservations by room
          </CardTitle>
        </CardHeader>
        <CardContent>
          {roomCards.length === 0 ? (
            <EmptyState title="No rooms yet" description="Create rooms in Local Configuration" />
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
                    reservations
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
          <CardTitle subtitle={`Today · ${formatDisplayDate(today)}`}>
            Daily planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyPlan.length === 0 ? (
            <EmptyState title="No reservations today" description="Today’s schedule will appear here" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hour start</TableHead>
                  <TableHead>Hour finish</TableHead>
                  <TableHead>Staff name</TableHead>
                  <TableHead>Room reserved</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
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
                        {row.status}
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
          <CardTitle subtitle="End time passed — confirm the service was realized">
            Reserved rooms · pending service confirm
          </CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingService.length === 0 ? (
            <EmptyState title="Nothing to confirm" description="Finished slots awaiting confirmation appear here" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
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
                      <Badge variant="warning">Pending to confirm</Badge>
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
                        Confirm service done
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
          <CardTitle subtitle="Service confirmed — approve staff payment">
            Payment approved queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingPayment.length === 0 ? (
            <EmptyState title="No payments waiting" description="After service confirm, payments appear here" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
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
                      <Badge variant="info">Payment pending</Badge>
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
                        Approve payment
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

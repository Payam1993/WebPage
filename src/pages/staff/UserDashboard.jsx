import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatCard,
  PageHeader,
  Grid,
  Icons,
  EmptyState,
  LoadingState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from '../../components/admin/ui'
import { bookingAPI, formatDisplayDate, getTodayDate, getDateFromToday } from '../../services/dataService'
import { isPaymentPending } from '../../utils/bookingStatus'
import { minutesToTime, timeToMinutes } from '../../utils/availability'
import { useAuth } from '../../context/AuthContext'

/**
 * User (staff) individual dashboard — own stats, To Do (booked services), promotions
 */
const UserDashboard = () => {
  const { staffProfile, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState([])

  const loadData = useCallback(async () => {
    if (!staffProfile?.id) {
      setBookings([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const data = await bookingAPI.list(undefined, undefined, {
        therapistId: staffProfile.id,
      })
      setBookings(data || [])
    } catch (err) {
      console.error(err)
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }, [staffProfile?.id])

  useEffect(() => {
    if (authLoading) return
    loadData()
  }, [authLoading, loadData])

  const stats = useMemo(() => {
    const total = bookings.length
    const pending = bookings.filter((b) => b.status === 'Pending').length
    const completed = bookings.filter((b) => b.status === 'Done').length
    const paymentPending = bookings.filter((b) => isPaymentPending(b)).length
    return { total, pending, completed, paymentPending }
  }, [bookings])

  const todoBookings = useMemo(() => {
    const from = getTodayDate()
    const to = getDateFromToday(60)
    return bookings
      .filter((b) => b.status === 'Pending' && b.date >= from && b.date <= to)
      .slice()
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return (a.reservedTime || '').localeCompare(b.reservedTime || '')
      })
  }, [bookings])

  const getEndTime = (startTime, durationMinutes) => {
    if (!startTime) return '-'
    return minutesToTime(timeToMinutes(startTime) + (Number(durationMinutes) || 60))
  }

  if (authLoading || isLoading) {
    return <LoadingState text="Loading your dashboard..." />
  }

  if (!staffProfile?.id) {
    return (
      <EmptyState
        icon={<Icons.Users />}
        title="Staff profile not linked"
        description="Your Cognito email is not linked to a Staff record. Ask an admin to add your email on the Staff page."
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="My Dashboard"
        subtitle={`Personal overview for ${staffProfile.staffName || 'your account'}`}
      />

      <Grid cols={4} gap="default" style={{ marginBottom: 24 }}>
        <StatCard
          title="Total reservations"
          value={String(stats.total)}
          icon={<Icons.Calendar />}
          subtitle="Your bookings"
        />
        <StatCard
          title="Pending reservations"
          value={String(stats.pending)}
          icon={<Icons.Clock />}
          subtitle="Not yet completed"
        />
        <StatCard
          title="Completed services"
          value={String(stats.completed)}
          icon={<Icons.Check />}
          subtitle="Marked done"
        />
        <StatCard
          title="Payment pending"
          value={String(stats.paymentPending)}
          icon={<Icons.DollarSign />}
          subtitle="Awaiting approval"
        />
      </Grid>

      <Card padding={false} style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle="Services booked for you (pending)">
            To Do
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todoBookings.length === 0 ? (
            <EmptyState
              title="No booked services yet"
              description="Pending services assigned to you will appear here"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>Finish</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todoBookings.map((b) => {
                  const start = b.reservedTime?.substring(0, 5) || '-'
                  return (
                    <TableRow key={b.id}>
                      <TableCell>{b.clientName}</TableCell>
                      <TableCell>{b.serviceName || '-'}</TableCell>
                      <TableCell>{formatDisplayDate(b.date)}</TableCell>
                      <TableCell>{b.durationMinutes || 60} min</TableCell>
                      <TableCell>{start}</TableCell>
                      <TableCell>{getEndTime(start, b.durationMinutes)}</TableCell>
                      <TableCell>{b.roomName || '-'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
          <div style={{ marginTop: 16 }}>
            <Link to="/staff/calendar" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="small">
                Open calendar & cancel
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle subtitle="Offers linked to your account">
            Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            style={{
              padding: '32px 24px',
              textAlign: 'center',
              color: 'var(--ui-text-muted)',
              background: 'var(--ui-bg)',
              borderRadius: 12,
              border: '1px dashed var(--ui-border)',
            }}
          >
            No Promotion is associated to you
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDashboard

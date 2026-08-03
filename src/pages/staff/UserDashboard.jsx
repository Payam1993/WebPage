import { useState, useEffect, useCallback, useMemo } from 'react'
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
} from '../../components/admin/ui'
import { bookingAPI } from '../../services/dataService'
import { isPaymentPending } from '../../utils/bookingStatus'
import { useAuth } from '../../context/AuthContext'

/**
 * User (staff) individual dashboard — own stats + promotions placeholder
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

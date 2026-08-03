import { useState, useEffect, useCallback } from 'react'
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
} from '../../components/admin/ui'
import {
  bookingAPI,
  notConfirmedReservationAPI,
  notConfirmedCostAPI,
  formatDisplayDate,
} from '../../services/dataService'
import {
  isAwaitingServiceConfirm,
  isPaymentPending,
  getBookingEndTime,
} from '../../utils/bookingStatus'
import { useAuth } from '../../context/AuthContext'

/**
 * Pending Confirmations — Mini Admin / Admin
 * - Public reservation requests
 * - Staff cost submissions
 * - Past bookings awaiting service confirmation
 * - Done services awaiting payment approval
 */
const PendingConfirmations = () => {
  const { isAdmin, isMiniAdmin } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [pendingReservations, setPendingReservations] = useState([])
  const [pendingCosts, setPendingCosts] = useState([])
  const [awaitingService, setAwaitingService] = useState([])
  const [awaitingPayment, setAwaitingPayment] = useState([])
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [reservations, costs, bookings] = await Promise.all([
        notConfirmedReservationAPI.list(),
        notConfirmedCostAPI.list(),
        bookingAPI.list(),
      ])
      setPendingReservations(reservations || [])
      setPendingCosts(costs || [])
      setAwaitingService((bookings || []).filter((b) => isAwaitingServiceConfirm(b)))
      setAwaitingPayment((bookings || []).filter((b) => isPaymentPending(b)))
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to load pending items')
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
      alert(err.message || 'Action failed')
    } finally {
      setActionId(null)
    }
  }

  if (!isAdmin && !isMiniAdmin) {
    return (
      <EmptyState
        icon={<Icons.Users />}
        title="Access denied"
        description="Only Mini Admin and Admin can manage pending confirmations."
      />
    )
  }

  if (isLoading) {
    return <LoadingState text="Loading pending confirmations..." />
  }

  return (
    <div>
      <PageHeader
        title="Pending Confirmations"
        subtitle="Confirm reservations, services realized, staff payments, and cost submissions"
        actions={
          <Button variant="secondary" size="small" onClick={loadAll}>
            Refresh
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
          <CardTitle subtitle={`${pendingReservations.length} awaiting confirmation`}>
            Reservation requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReservations.length === 0 ? (
            <EmptyState title="No pending reservation requests" description="Public booking requests will appear here" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Center / Room</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
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
                        loading={actionId === item.id}
                        onClick={() =>
                          runAction(item.id, () =>
                            notConfirmedReservationAPI.confirm(item, {
                              priceAgreement: 0,
                            })
                          )
                        }
                      >
                        Confirm reservation
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
          <CardTitle subtitle={`${awaitingService.length} slots finished — confirm service was realized`}>
            Service confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingService.length === 0 ? (
            <EmptyState title="No services waiting confirmation" description="When a reservation end time passes, it appears here" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Client</TableHead>
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
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell><Badge variant="warning">Pending service confirm</Badge></TableCell>
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

      {/* Payment approval */}
      <Card padding={false} style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle={`${awaitingPayment.length} staff payments to approve`}>
            Payment approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingPayment.length === 0 ? (
            <EmptyState title="No payments pending" description="After service is confirmed done, payments appear here for approval" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Client</TableHead>
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
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell>€{(item.priceAgreement || 0).toFixed(2)}</TableCell>
                    <TableCell><Badge variant="info">Payment pending</Badge></TableCell>
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

      {/* Cost submissions */}
      <Card padding={false}>
        <CardHeader>
          <CardTitle subtitle={`${pendingCosts.length} cost submissions`}>
            Cost confirmations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingCosts.length === 0 ? (
            <EmptyState title="No pending costs" description="Staff cost submissions appear here" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Submitted by</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
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
                        Confirm cost
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

export default PendingConfirmations

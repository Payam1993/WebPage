import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  StatCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  PageHeader,
  Grid,
  Icons,
  EmptyState,
} from '../../components/admin/ui'

/**
 * Reports - Dashboard overview with stats and recent activity
 */
const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Sample data - replace with real data from your API
  const stats = [
    { 
      title: 'Total Bookings', 
      value: '147', 
      icon: <Icons.Calendar />,
      trend: '+12%',
      trendDirection: 'up',
      subtitle: 'vs last week'
    },
    { 
      title: 'Revenue', 
      value: '€12,450', 
      icon: <Icons.DollarSign />,
      trend: '+8%',
      trendDirection: 'up',
      subtitle: 'vs last week'
    },
    { 
      title: 'New Clients', 
      value: '23', 
      icon: <Icons.Users />,
      trend: '+15%',
      trendDirection: 'up',
      subtitle: 'vs last week'
    },
    { 
      title: 'Avg. Rating', 
      value: '4.8', 
      icon: <Icons.Star />,
      trend: '+0.2',
      trendDirection: 'up',
      subtitle: 'vs last week'
    },
  ]

  const recentBookings = [
    { id: 1, client: 'Maria Garcia', service: 'Deep Tissue Massage', date: '2026-01-20', time: '10:00', status: 'confirmed', amount: '€85' },
    { id: 2, client: 'John Smith', service: 'Swedish Massage', date: '2026-01-20', time: '11:30', status: 'pending', amount: '€70' },
    { id: 3, client: 'Anna Johnson', service: 'Hot Stone Therapy', date: '2026-01-19', time: '14:00', status: 'confirmed', amount: '€95' },
    { id: 4, client: 'Carlos Rodriguez', service: 'Aromatherapy', date: '2026-01-19', time: '16:00', status: 'confirmed', amount: '€80' },
    { id: 5, client: 'Emma Wilson', service: 'Couples Massage', date: '2026-01-18', time: '13:00', status: 'cancelled', amount: '€150' },
  ]

  const todayCosts = [
    { id: 1, category: 'Supplies', description: 'Massage oils', amount: '€45.50' },
    { id: 2, category: 'Utilities', description: 'Water bill', amount: '€32.00' },
    { id: 3, category: 'Marketing', description: 'Social ads', amount: '€50.00' },
  ]

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'danger'
      default: return 'neutral'
    }
  }

  return (
    <div>
      <PageHeader 
        title="Dashboard"
        subtitle="Overview of your business performance and recent activity"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            {['today', 'week', 'month', 'year'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setSelectedPeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
        }
      />

      {/* Stats Grid */}
      <Grid cols={4} gap="default" style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            subtitle={stat.subtitle}
          />
        ))}
      </Grid>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Bookings */}
        <Card padding={false}>
          <CardHeader
            actions={
              <Button variant="ghost" size="small">
                View All
              </Button>
            }
          >
            <CardTitle subtitle="Today's scheduled services">
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <span style={{ fontWeight: 500 }}>{booking.client}</span>
                      </TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>
                        <span style={{ color: 'var(--ui-text-muted)' }}>
                          {new Date(booking.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {booking.time}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ fontWeight: 500 }}>{booking.amount}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                icon={<Icons.Calendar />}
                title="No bookings yet"
                description="Your recent bookings will appear here"
              />
            )}
          </CardContent>
        </Card>

        {/* Today's Costs */}
        <Card padding={false}>
          <CardHeader
            actions={
              <Button variant="ghost" size="small" icon={<Icons.Plus />}>
                Add
              </Button>
            }
          >
            <CardTitle subtitle="Recent expenses">
              Today's Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayCosts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px 16px' }}>
                {todayCosts.map((cost) => (
                  <div 
                    key={cost.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'var(--ui-bg)',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--ui-text)' }}>
                        {cost.description}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)', marginTop: '2px' }}>
                        {cost.category}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--ui-text)' }}>
                      {cost.amount}
                    </div>
                  </div>
                ))}
                
                {/* Total */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderTop: '1px solid var(--ui-border)',
                    marginTop: '4px',
                  }}
                >
                  <span style={{ fontWeight: 500, color: 'var(--ui-text-muted)' }}>Total</span>
                  <span style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--ui-text)' }}>
                    €127.50
                  </span>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<Icons.DollarSign />}
                title="No costs recorded"
                description="Add your first expense"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>Staff Benefit (40%)</span>
                <span style={{ fontWeight: 500 }}>€4,980</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>Local Benefit (60%)</span>
                <span style={{ fontWeight: 500 }}>€7,470</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--ui-border-light)' }}>
                <span style={{ fontWeight: 500 }}>Total Revenue</span>
                <span style={{ fontWeight: 600, color: 'var(--ui-success)' }}>€12,450</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Deep Tissue', count: 45, percent: 31 },
                { name: 'Swedish', count: 38, percent: 26 },
                { name: 'Hot Stone', count: 29, percent: 20 },
              ].map((service, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.875rem' }}>{service.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>{service.count}</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--ui-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${service.percent}%`, background: 'var(--ui-primary)', borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>Revenue</span>
                <span style={{ fontWeight: 500, color: 'var(--ui-success)' }}>+€12,450</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>Costs</span>
                <span style={{ fontWeight: 500, color: 'var(--ui-danger)' }}>-€1,104.50</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--ui-border-light)' }}>
                <span style={{ fontWeight: 500 }}>Net Profit</span>
                <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--ui-success)' }}>€11,345.50</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Reports

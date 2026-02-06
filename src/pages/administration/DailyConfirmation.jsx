import { useState } from 'react'
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
  Icons,
  StatCard,
  EmptyState,
} from '../../components/admin/ui'

/**
 * DailyConfirmation - Review and confirm daily registered data
 */
const DailyConfirmation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Sample data for pending confirmation
  const pendingDays = [
    { 
      date: '2026-01-20', 
      services: 5, 
      revenue: 425, 
      costs: 77.50, 
      status: 'pending',
      entries: [
        { type: 'service', description: 'Deep Tissue - Maria Garcia', staff: 'Luciana', amount: 85 },
        { type: 'service', description: 'Swedish - John Smith', staff: 'Sadey', amount: 70 },
        { type: 'service', description: 'Hot Stone - Anna Johnson', staff: 'Luciana', amount: 95 },
        { type: 'service', description: 'Aromatherapy - Carlos Rodriguez', staff: 'Sadey', amount: 80 },
        { type: 'service', description: 'Couples - Emma Wilson', staff: 'Both', amount: 95 },
        { type: 'cost', description: 'Massage oils', category: 'Supplies', amount: -45.50 },
        { type: 'cost', description: 'Water bill', category: 'Utilities', amount: -32.00 },
      ]
    },
    { 
      date: '2026-01-19', 
      services: 4, 
      revenue: 340, 
      costs: 55.00, 
      status: 'pending',
      entries: []
    },
  ]

  const confirmedDays = [
    { date: '2026-01-18', services: 6, revenue: 510, costs: 89.00, status: 'confirmed' },
    { date: '2026-01-17', services: 5, revenue: 425, costs: 45.00, status: 'confirmed' },
  ]

  const [expandedDay, setExpandedDay] = useState(null)

  return (
    <div>
      <PageHeader 
        title="Daily Confirmation"
        subtitle="Review and confirm daily registered data"
      />

      {/* Summary Stats */}
      <Grid cols={3} gap="default" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Pending Confirmation"
          value={pendingDays.length}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />
        <StatCard
          title="Confirmed This Month"
          value={confirmedDays.length}
          icon={<Icons.Check />}
        />
        <StatCard
          title="Pending Revenue"
          value={`€${pendingDays.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}`}
          icon={<Icons.DollarSign />}
        />
      </Grid>

      {/* Pending Confirmation */}
      <Card padding={false} style={{ marginBottom: '24px' }}>
        <CardHeader>
          <CardTitle subtitle="Days requiring review and confirmation">
            Pending Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingDays.length === 0 ? (
            <EmptyState
              icon={<Icons.Check />}
              title="All caught up!"
              description="No pending confirmations at this time"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Costs</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDays.map((day) => (
                  <>
                    <TableRow key={day.date}>
                      <TableCell>
                        <span style={{ fontWeight: 500 }}>
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </TableCell>
                      <TableCell>{day.services}</TableCell>
                      <TableCell style={{ color: 'var(--ui-success)' }}>€{day.revenue.toFixed(2)}</TableCell>
                      <TableCell style={{ color: 'var(--ui-danger)' }}>€{day.costs.toFixed(2)}</TableCell>
                      <TableCell style={{ fontWeight: 500 }}>€{(day.revenue - day.costs).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="warning">Pending</Badge>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <Button 
                            variant="ghost" 
                            size="small"
                            onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
                          >
                            {expandedDay === day.date ? 'Hide' : 'Review'}
                          </Button>
                          <Button size="small">
                            Confirm
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedDay === day.date && day.entries.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={7} style={{ background: 'var(--ui-bg)', padding: '16px' }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '12px' }}>
                            Entries for {new Date(day.date).toLocaleDateString()}
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Staff/Category</TableHead>
                                <TableHead style={{ textAlign: 'right' }}>Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {day.entries.map((entry, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>
                                    <Badge variant={entry.type === 'service' ? 'success' : 'danger'}>
                                      {entry.type === 'service' ? 'Service' : 'Cost'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{entry.description}</TableCell>
                                  <TableCell style={{ color: 'var(--ui-text-muted)' }}>
                                    {entry.staff || entry.category}
                                  </TableCell>
                                  <TableCell style={{ 
                                    textAlign: 'right', 
                                    fontWeight: 500,
                                    color: entry.amount > 0 ? 'var(--ui-success)' : 'var(--ui-danger)'
                                  }}>
                                    {entry.amount > 0 ? '+' : ''}€{Math.abs(entry.amount).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recently Confirmed */}
      <Card padding={false}>
        <CardHeader>
          <CardTitle subtitle="Previously confirmed entries">
            Recently Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Costs</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {confirmedDays.map((day) => (
                <TableRow key={day.date}>
                  <TableCell>
                    <span style={{ fontWeight: 500 }}>
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </TableCell>
                  <TableCell>{day.services}</TableCell>
                  <TableCell>€{day.revenue.toFixed(2)}</TableCell>
                  <TableCell>€{day.costs.toFixed(2)}</TableCell>
                  <TableCell style={{ fontWeight: 500 }}>€{(day.revenue - day.costs).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="success">Confirmed</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default DailyConfirmation

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
  Input,
  Icons,
  EmptyState,
} from '../../components/admin/ui'

/**
 * Reservations - Manage client bookings and reservations
 */
const Reservations = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Sample data - replace with real data from your API
  const reservations = [
    { 
      id: 1, 
      client: 'Maria Garcia', 
      email: 'maria@email.com',
      phone: '+34 612 345 678',
      service: 'Deep Tissue Massage', 
      therapist: 'Luciana',
      date: '2026-01-20',
      time: '10:00',
      duration: '60 min',
      status: 'confirmed',
      notes: 'First visit, mentioned back pain'
    },
    { 
      id: 2, 
      client: 'John Smith', 
      email: 'john@email.com',
      phone: '+34 623 456 789',
      service: 'Swedish Massage', 
      therapist: 'Sadey',
      date: '2026-01-20',
      time: '14:00',
      duration: '90 min',
      status: 'pending',
      notes: ''
    },
    { 
      id: 3, 
      client: 'Anna Johnson', 
      email: 'anna@email.com',
      phone: '+34 634 567 890',
      service: 'Hot Stone Therapy', 
      therapist: 'Luciana',
      date: '2026-01-21',
      time: '11:00',
      duration: '75 min',
      status: 'confirmed',
      notes: 'Regular client, prefers room 2'
    },
    { 
      id: 4, 
      client: 'Carlos Rodriguez', 
      email: 'carlos@email.com',
      phone: '+34 645 678 901',
      service: 'Aromatherapy', 
      therapist: 'Sadey',
      date: '2026-01-21',
      time: '16:00',
      duration: '60 min',
      status: 'confirmed',
      notes: ''
    },
    { 
      id: 5, 
      client: 'Emma Wilson', 
      email: 'emma@email.com',
      phone: '+34 656 789 012',
      service: 'Couples Massage', 
      therapist: 'Luciana & Sadey',
      date: '2026-01-22',
      time: '15:00',
      duration: '90 min',
      status: 'cancelled',
      notes: 'Cancelled due to travel'
    },
  ]

  const filteredReservations = reservations.filter(res => {
    const matchesStatus = filterStatus === 'all' || res.status === filterStatus
    const matchesSearch = res.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.service.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

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
        title="Reservations"
        subtitle="Manage and view all client bookings"
        actions={
          <Button icon={<Icons.Plus />}>
            New Booking
          </Button>
        }
      />

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </Button>
            ))}
          </div>
          
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              type="text"
              placeholder="Search by client or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              containerClassName="ui-mb-0"
            />
          </div>
        </div>
      </Card>

      {/* Reservations List */}
      <Card padding={false}>
        <CardHeader
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" size="small">
                Export
              </Button>
            </div>
          }
        >
          <CardTitle subtitle={`${filteredReservations.length} bookings found`}>
            Booking List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReservations.length === 0 ? (
            <EmptyState
              icon={<Icons.Calendar />}
              title="No reservations found"
              description="No bookings match your current filters"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{res.client}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>{res.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{res.service}</TableCell>
                    <TableCell>{res.therapist}</TableCell>
                    <TableCell>
                      <div>
                        <div>{new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>{res.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{res.duration}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(res.status)}>
                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Button variant="ghost" size="small">
                          View
                        </Button>
                        <Button variant="ghost" size="small">
                          <Icons.Edit />
                        </Button>
                      </div>
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

export default Reservations

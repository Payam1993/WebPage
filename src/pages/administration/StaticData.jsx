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
  Select,
  Icons,
  EmptyState,
} from '../../components/admin/ui'

/**
 * StaticData - CRUD for Services, Cost Types, and Staff
 */
const StaticData = () => {
  const [activeTab, setActiveTab] = useState('services')

  // Sample data
  const services = [
    { id: 1, name: 'Deep Tissue Massage', duration: 60, price: 85, active: true },
    { id: 2, name: 'Swedish Massage', duration: 60, price: 70, active: true },
    { id: 3, name: 'Hot Stone Therapy', duration: 75, price: 95, active: true },
    { id: 4, name: 'Aromatherapy', duration: 60, price: 80, active: true },
    { id: 5, name: 'Couples Massage', duration: 90, price: 150, active: true },
  ]

  const costTypes = [
    { id: 1, name: 'Supplies', description: 'Massage oils, lotions, towels', active: true },
    { id: 2, name: 'Utilities', description: 'Electricity, water, internet', active: true },
    { id: 3, name: 'Staff', description: 'Training, uniforms', active: true },
    { id: 4, name: 'Maintenance', description: 'Equipment repair, cleaning', active: true },
    { id: 5, name: 'Marketing', description: 'Ads, promotions', active: true },
  ]

  const staff = [
    { id: 1, name: 'Luciana', email: 'luciana@confession.com', role: 'Therapist', benefitRate: 40, active: true },
    { id: 2, name: 'Sadey', email: 'sadey@confession.com', role: 'Therapist', benefitRate: 40, active: true },
  ]

  const tabs = [
    { id: 'services', label: 'Services' },
    { id: 'cost-types', label: 'Cost Types' },
    { id: 'staff', label: 'Staff' },
  ]

  return (
    <div>
      <PageHeader 
        title="Static Data Registration"
        subtitle="Manage services, cost types, and staff information"
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'secondary'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <Card padding={false}>
          <CardHeader
            actions={
              <Button icon={<Icons.Plus />} size="small">
                Add Service
              </Button>
            }
          >
            <CardTitle subtitle="Manage available services and pricing">
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell><span style={{ fontWeight: 500 }}>{service.name}</span></TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell>€{service.price}</TableCell>
                    <TableCell>
                      <Badge variant={service.active ? 'success' : 'neutral'}>
                        {service.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Button variant="ghost" size="small"><Icons.Edit /></Button>
                        <Button variant="ghost" size="small"><Icons.Trash /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Cost Types Tab */}
      {activeTab === 'cost-types' && (
        <Card padding={false}>
          <CardHeader
            actions={
              <Button icon={<Icons.Plus />} size="small">
                Add Cost Type
              </Button>
            }
          >
            <CardTitle subtitle="Manage expense categories">
              Cost Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell><span style={{ fontWeight: 500 }}>{type.name}</span></TableCell>
                    <TableCell style={{ color: 'var(--ui-text-muted)' }}>{type.description}</TableCell>
                    <TableCell>
                      <Badge variant={type.active ? 'success' : 'neutral'}>
                        {type.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Button variant="ghost" size="small"><Icons.Edit /></Button>
                        <Button variant="ghost" size="small"><Icons.Trash /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <Card padding={false}>
          <CardHeader
            actions={
              <Button icon={<Icons.Plus />} size="small">
                Add Staff Member
              </Button>
            }
          >
            <CardTitle subtitle="Manage staff members and benefit rates">
              Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Benefit Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell><span style={{ fontWeight: 500 }}>{member.name}</span></TableCell>
                    <TableCell style={{ color: 'var(--ui-text-muted)' }}>{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.benefitRate}%</TableCell>
                    <TableCell>
                      <Badge variant={member.active ? 'success' : 'neutral'}>
                        {member.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Button variant="ghost" size="small"><Icons.Edit /></Button>
                        <Button variant="ghost" size="small"><Icons.Trash /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StaticData

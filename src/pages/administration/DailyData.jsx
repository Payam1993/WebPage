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
  StatCard,
} from '../../components/admin/ui'

/**
 * DailyData - Daily entry forms for sold services and costs
 */
const DailyData = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showCostForm, setShowCostForm] = useState(false)

  // Sample data for today
  const soldServices = [
    { id: 1, service: 'Deep Tissue Massage', staff: 'Luciana', client: 'Maria Garcia', amount: 85 },
    { id: 2, service: 'Swedish Massage', staff: 'Sadey', client: 'John Smith', amount: 70 },
    { id: 3, service: 'Hot Stone Therapy', staff: 'Luciana', client: 'Anna Johnson', amount: 95 },
  ]

  const dailyCosts = [
    { id: 1, category: 'Supplies', description: 'Massage oils', amount: 45.50 },
    { id: 2, category: 'Utilities', description: 'Water bill', amount: 32.00 },
  ]

  const totalRevenue = soldServices.reduce((sum, s) => sum + s.amount, 0)
  const totalCosts = dailyCosts.reduce((sum, c) => sum + c.amount, 0)

  const serviceOptions = [
    { value: 'deep-tissue', label: 'Deep Tissue Massage - €85' },
    { value: 'swedish', label: 'Swedish Massage - €70' },
    { value: 'hot-stone', label: 'Hot Stone Therapy - €95' },
    { value: 'aromatherapy', label: 'Aromatherapy - €80' },
    { value: 'couples', label: 'Couples Massage - €150' },
  ]

  const staffOptions = [
    { value: 'luciana', label: 'Luciana' },
    { value: 'sadey', label: 'Sadey' },
  ]

  const costTypeOptions = [
    { value: 'supplies', label: 'Supplies' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'staff', label: 'Staff' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'marketing', label: 'Marketing' },
  ]

  return (
    <div>
      <PageHeader 
        title="Daily Data Registration"
        subtitle="Register sold services and daily costs"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              containerClassName="ui-mb-0"
            />
          </div>
        }
      />

      {/* Daily Totals */}
      <Grid cols={3} gap="default" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Today's Revenue"
          value={`€${totalRevenue.toFixed(2)}`}
          icon={<Icons.DollarSign />}
        />
        <StatCard
          title="Today's Costs"
          value={`€${totalCosts.toFixed(2)}`}
          icon={<Icons.FileText />}
        />
        <StatCard
          title="Net Today"
          value={`€${(totalRevenue - totalCosts).toFixed(2)}`}
          icon={<Icons.TrendingUp />}
        />
      </Grid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Sold Services */}
        <Card padding={false}>
          <CardHeader
            actions={
              <Button 
                icon={<Icons.Plus />} 
                size="small"
                onClick={() => setShowServiceForm(!showServiceForm)}
              >
                Add Service
              </Button>
            }
          >
            <CardTitle subtitle={`${soldServices.length} services sold`}>
              Sold Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showServiceForm && (
              <div style={{ 
                padding: '16px', 
                background: 'var(--ui-bg)', 
                borderRadius: '8px',
                marginBottom: '16px' 
              }}>
                <Grid cols={2} gap="default">
                  <Select
                    label="Service"
                    options={serviceOptions}
                    placeholder="Select service"
                  />
                  <Select
                    label="Staff Member"
                    options={staffOptions}
                    placeholder="Select staff"
                  />
                  <Input
                    label="Client Name"
                    placeholder="Enter client name"
                  />
                  <Input
                    label="Amount (€)"
                    type="number"
                    placeholder="0.00"
                  />
                </Grid>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                  <Button variant="secondary" onClick={() => setShowServiceForm(false)}>Cancel</Button>
                  <Button>Save</Button>
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soldServices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><span style={{ fontWeight: 500 }}>{item.service}</span></TableCell>
                    <TableCell>{item.staff}</TableCell>
                    <TableCell style={{ color: 'var(--ui-text-muted)' }}>{item.client}</TableCell>
                    <TableCell style={{ textAlign: 'right', fontWeight: 500 }}>€{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              padding: '16px',
              borderTop: '1px solid var(--ui-border)',
              background: 'var(--ui-bg)'
            }}>
              <span style={{ fontWeight: 600 }}>Total: €{totalRevenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Daily Costs */}
        <Card padding={false}>
          <CardHeader
            actions={
              <Button 
                icon={<Icons.Plus />} 
                size="small"
                onClick={() => setShowCostForm(!showCostForm)}
              >
                Add Cost
              </Button>
            }
          >
            <CardTitle subtitle={`${dailyCosts.length} expenses recorded`}>
              Daily Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showCostForm && (
              <div style={{ 
                padding: '16px', 
                background: 'var(--ui-bg)', 
                borderRadius: '8px',
                marginBottom: '16px' 
              }}>
                <Grid cols={2} gap="default">
                  <Select
                    label="Category"
                    options={costTypeOptions}
                    placeholder="Select category"
                  />
                  <Input
                    label="Amount (€)"
                    type="number"
                    placeholder="0.00"
                  />
                </Grid>
                <Input
                  label="Description"
                  placeholder="Enter description"
                  containerClassName="ui-mt-md"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                  <Button variant="secondary" onClick={() => setShowCostForm(false)}>Cancel</Button>
                  <Button>Save</Button>
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyCosts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><Badge variant="neutral">{item.category}</Badge></TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell style={{ textAlign: 'right', fontWeight: 500 }}>€{item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              padding: '16px',
              borderTop: '1px solid var(--ui-border)',
              background: 'var(--ui-bg)'
            }}>
              <span style={{ fontWeight: 600 }}>Total: €{totalCosts.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DailyData

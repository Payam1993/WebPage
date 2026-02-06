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
  Input,
  Select,
  Icons,
  EmptyState,
  Divider,
} from '../../components/admin/ui'

/**
 * CostsManagement - Manage business costs and expenses
 */
const CostsManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCost, setNewCost] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  })

  // Sample data - replace with real data from your API
  const costs = [
    { id: 1, category: 'Supplies', description: 'Massage oils and lotions', amount: 245.50, date: '2026-01-18' },
    { id: 2, category: 'Utilities', description: 'Electricity bill', amount: 189.00, date: '2026-01-15' },
    { id: 3, category: 'Staff', description: 'Training materials', amount: 150.00, date: '2026-01-12' },
    { id: 4, category: 'Maintenance', description: 'Equipment repair', amount: 320.00, date: '2026-01-10' },
    { id: 5, category: 'Marketing', description: 'Social media ads', amount: 200.00, date: '2026-01-08' },
  ]

  const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0)

  const costsByCategory = costs.reduce((acc, cost) => {
    acc[cost.category] = (acc[cost.category] || 0) + cost.amount
    return acc
  }, {})

  const categoryOptions = [
    { value: 'Supplies', label: 'Supplies' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Other', label: 'Other' },
  ]

  const getCategoryColor = (category) => {
    const colors = {
      'Supplies': 'info',
      'Utilities': 'warning',
      'Staff': 'success',
      'Maintenance': 'danger',
      'Marketing': 'neutral',
      'Other': 'neutral',
    }
    return colors[category] || 'neutral'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('New cost:', newCost)
    setShowAddForm(false)
    setNewCost({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <div>
      <PageHeader 
        title="Costs Management"
        subtitle="Track and manage your business expenses"
        actions={
          <Button 
            icon={<Icons.Plus />}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add Expense
          </Button>
        }
      />

      {/* Add Expense Form */}
      {showAddForm && (
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle subtitle="Enter the expense details below">
              New Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid cols={4} gap="default">
                <Select
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select category"
                  value={newCost.category}
                  onChange={(e) => setNewCost({ ...newCost, category: e.target.value })}
                  required
                />
                <Input
                  label="Description"
                  type="text"
                  placeholder="Enter description"
                  value={newCost.description}
                  onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
                  required
                />
                <Input
                  label="Amount (€)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newCost.amount}
                  onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
                  required
                />
                <Input
                  label="Date"
                  type="date"
                  value={newCost.date}
                  onChange={(e) => setNewCost({ ...newCost, date: e.target.value })}
                  required
                />
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Expense
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <Grid cols={4} gap="default" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Total This Month"
          value={`€${totalCosts.toFixed(2)}`}
          icon={<Icons.DollarSign />}
          trend="-5%"
          trendDirection="down"
          subtitle="vs last month"
        />
        {Object.entries(costsByCategory).slice(0, 3).map(([category, amount]) => (
          <StatCard
            key={category}
            title={category}
            value={`€${amount.toFixed(2)}`}
            icon={<Icons.TrendingUp />}
          />
        ))}
      </Grid>

      {/* Costs Table */}
      <Card padding={false}>
        <CardHeader
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" size="small">
                Export
              </Button>
              <Button variant="ghost" size="small">
                Filter
              </Button>
            </div>
          }
        >
          <CardTitle subtitle={`${costs.length} expenses recorded`}>
            Expense Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {costs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Amount</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell>
                      <span style={{ color: 'var(--ui-text-muted)' }}>
                        {new Date(cost.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCategoryColor(cost.category)}>
                        {cost.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span style={{ fontWeight: 500 }}>{cost.description}</span>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 600 }}>€{cost.amount.toFixed(2)}</span>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Button variant="ghost" size="small">
                          <Icons.Edit />
                        </Button>
                        <Button variant="ghost" size="small">
                          <Icons.Trash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={<Icons.FileText />}
              title="No expenses recorded"
              description="Start tracking your business expenses by adding your first entry."
              action={
                <Button onClick={() => setShowAddForm(true)} icon={<Icons.Plus />}>
                  Add Expense
                </Button>
              }
            />
          )}
        </CardContent>

        {/* Table Footer with Total */}
        {costs.length > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid var(--ui-border)',
            background: 'var(--ui-bg)',
          }}>
            <span style={{ marginRight: '24px', color: 'var(--ui-text-muted)' }}>
              Total Expenses:
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              €{totalCosts.toFixed(2)}
            </span>
          </div>
        )}
      </Card>
    </div>
  )
}

export default CostsManagement

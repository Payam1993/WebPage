import { useState, useEffect } from 'react'
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
  Modal,
  Icons,
  EmptyState,
  LoadingState,
} from '../../components/admin/ui'
import { notConfirmedCostAPI, dailyCostAPI, getTodayDate } from '../../services/dataService'
import { useAuth } from '../../context/AuthContext'

/**
 * CostsManagement - Staff can submit costs, Admin can confirm them
 * 
 * - Staff: Add costs (saved to NotConfirmedCost table)
 * - Admin: Confirm costs (moves to DailyCost table in Administration)
 */
const CostsManagement = () => {
  const { isAdmin } = useAuth()
  
  // State
  const [costs, setCosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    costName: '',
    price: '',
    date: getTodayDate(),
    reason: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isConfirming, setIsConfirming] = useState(null) // ID of cost being confirmed

  // Load costs on mount
  useEffect(() => {
    loadCosts()
  }, [])

  const loadCosts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await notConfirmedCostAPI.list()
      // Sort by date descending
      data.sort((a, b) => b.date.localeCompare(a.date))
      setCosts(data)
    } catch (err) {
      setError(err.message || 'Failed to load costs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      costName: '',
      price: '',
      date: getTodayDate(),
      reason: '',
    })
    setShowModal(true)
    setError(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      costName: '',
      price: '',
      date: getTodayDate(),
      reason: '',
    })
    setError(null)
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setError(null)
    try {
      // Validate required fields
      if (!formData.costName?.trim()) throw new Error('Cost Name is required')
      if (!formData.price || formData.price <= 0) throw new Error('Price is required and must be greater than 0')
      if (!formData.date) throw new Error('Date is required')

      await notConfirmedCostAPI.create({
        costName: formData.costName.trim(),
        price: parseFloat(formData.price),
        date: formData.date,
        reason: formData.reason?.trim() || null,
      })

      await loadCosts()
      handleCloseModal()
    } catch (err) {
      setError(err.message || 'Failed to save cost')
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirm = async (cost) => {
    if (!isAdmin) return
    
    setIsConfirming(cost.id)
    try {
      await notConfirmedCostAPI.confirm(cost)
      // Remove from local state
      setCosts(prev => prev.filter(c => c.id !== cost.id))
    } catch (err) {
      setError(err.message || 'Failed to confirm cost')
    } finally {
      setIsConfirming(null)
    }
  }

  const handleDelete = async (cost) => {
    if (!window.confirm(`Are you sure you want to delete "${cost.costName}"?`)) return
    
    try {
      await notConfirmedCostAPI.delete(cost.id)
      setCosts(prev => prev.filter(c => c.id !== cost.id))
    } catch (err) {
      setError(err.message || 'Failed to delete cost')
    }
  }

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Calculate total
  const totalCosts = costs.reduce((sum, cost) => sum + (cost.price || 0), 0)

  return (
    <div>
      <PageHeader 
        title="Costs Management"
        subtitle="Submit business expenses for admin approval"
        actions={
          <Button 
            icon={<Icons.Plus />}
            onClick={handleOpenModal}
          >
            Add New Cost
          </Button>
        }
      />

      {/* Error Display */}
      {error && (
        <Card style={{ marginBottom: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#dc2626' }}>
              <Icons.X />
              <span>{error}</span>
              <Button variant="ghost" size="small" onClick={() => setError(null)} style={{ marginLeft: 'auto' }}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Costs Table */}
      <Card padding={false}>
        <CardHeader style={{ padding: '20px 24px', margin: 0, borderBottom: '1px solid var(--ui-border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <CardTitle subtitle={`${costs.length} pending costs awaiting approval`}>
              Pending Costs
            </CardTitle>
            <Button 
              variant="secondary" 
              size="small" 
              onClick={loadCosts}
              loading={isLoading}
            >
              <Icons.Refresh /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState text="Loading costs..." />
          ) : costs.length === 0 ? (
            <EmptyState
              icon={<Icons.FileText />}
              title="No pending costs"
              description="All submitted costs have been processed, or no costs have been submitted yet."
              action={
                <Button onClick={handleOpenModal} icon={<Icons.Plus />}>
                  Add New Cost
                </Button>
              }
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost Name</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Price</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costs.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>
                        <Badge variant={cost.date === getTodayDate() ? 'info' : 'neutral'} size="small">
                          {formatDate(cost.date)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span style={{ fontWeight: 600 }}>{cost.costName}</span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>
                          {cost.reason || '-'}
                        </span>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 600, color: 'var(--ui-danger)' }}>
                          €{cost.price?.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          {isAdmin ? (
                            <Button 
                              variant="success" 
                              size="small"
                              onClick={() => handleConfirm(cost)}
                              loading={isConfirming === cost.id}
                              disabled={isConfirming !== null}
                            >
                              <Icons.Check /> Confirm
                            </Button>
                          ) : (
                            <Button 
                              variant="secondary" 
                              size="small"
                              disabled
                              title="Only administrators can confirm costs"
                              style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                              <Icons.Check /> Pending Approval
                            </Button>
                          )}
                          <Button 
                            variant="icon" 
                            size="small" 
                            className="ui-btn-icon-danger"
                            onClick={() => handleDelete(cost)}
                            title="Delete cost"
                          >
                            <Icons.Trash />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
            borderRadius: '0 0 16px 16px',
          }}>
            <span style={{ marginRight: '24px', color: 'var(--ui-text-muted)', fontWeight: 500 }}>
              Total Pending:
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ui-danger)' }}>
              €{totalCosts.toFixed(2)}
            </span>
          </div>
        )}
      </Card>

      {/* Info Note for non-admins */}
      {!isAdmin && (
        <Card style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1))' }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'rgba(59, 130, 246, 0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--ui-primary)',
                flexShrink: 0,
              }}>
                <Icons.Info />
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>How it works</h4>
                <p style={{ margin: 0, color: 'var(--ui-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Submit your business expenses using the "Add New Cost" button. 
                  An administrator will review and confirm your submissions. 
                  Once confirmed, the cost will be recorded in the daily expense report.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Cost Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Add New Cost"
        subtitle="Submit a business expense for approval"
        size="default"
      >
        <Grid cols={2} gap="default">
          <Input
            label="Cost Name *"
            type="text"
            placeholder="e.g., Office Supplies"
            value={formData.costName}
            onChange={(e) => setFormData({ ...formData, costName: e.target.value })}
          />
          <Input
            label="Price (€) *"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <Input
            label="Date *"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label="Reason (optional)"
            type="text"
            placeholder="Brief description or reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </Grid>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSaving}>
            <Icons.Plus /> Submit Cost
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default CostsManagement

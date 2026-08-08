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
  Select,
  Modal,
  Icons,
  EmptyState,
  LoadingState,
} from '../../components/admin/ui'
import { notConfirmedCostAPI, costAPI, getTodayDate } from '../../services/dataService'
import { useAuth } from '../../context/AuthContext'
import { staffT as t } from '../../i18n/staffEs'

/**
 * CostsManagement - Staff can submit costs, Admin can confirm them
 * 
 * - Staff: Add costs (saved to NotConfirmedCost table)
 * - Admin: Confirm costs (moves to DailyCost table in Administration)
 */
const CostsManagement = () => {
  const { isAdmin, isMiniAdmin } = useAuth()
  const canConfirm = isAdmin || isMiniAdmin
  
  // State
  const [costs, setCosts] = useState([])
  const [costTypes, setCostTypes] = useState([]) // Static cost types from Master Data
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    costId: '',
    costName: '',
    price: '',
    date: getTodayDate(),
    reason: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isConfirming, setIsConfirming] = useState(null) // ID of cost being confirmed

  // Load costs and cost types on mount
  useEffect(() => {
    loadCosts()
    loadCostTypes()
  }, [])

  // Load static cost types from Master Data (Administration)
  const loadCostTypes = async () => {
    try {
      const data = await costAPI.list()
      setCostTypes(data)
    } catch (err) {
      console.error('Error loading cost types:', err)
    }
  }

  // Convert cost types to dropdown options
  const costTypeOptions = costTypes.map(ct => ({
    value: ct.id,
    label: ct.costName,
  }))

  const loadCosts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await notConfirmedCostAPI.list()
      // Sort by date descending
      data.sort((a, b) => b.date.localeCompare(a.date))
      setCosts(data)
    } catch (err) {
      setError(err.message || t.costs.failedLoad)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      costId: '',
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
      costId: '',
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
      if (!formData.costId) throw new Error(t.costs.selectCostName)
      if (!formData.price || formData.price <= 0) throw new Error(t.costs.priceRequiredError)
      if (!formData.date) throw new Error(t.costs.dateRequiredError)

      await notConfirmedCostAPI.create({
        costName: formData.costName,
        price: parseFloat(formData.price),
        date: formData.date,
        reason: formData.reason?.trim() || null,
      })

      await loadCosts()
      handleCloseModal()
    } catch (err) {
      setError(err.message || t.costs.failedSave)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirm = async (cost) => {
    if (!canConfirm) return
    
    setIsConfirming(cost.id)
    try {
      await notConfirmedCostAPI.confirm(cost)
      // Remove from local state
      setCosts(prev => prev.filter(c => c.id !== cost.id))
    } catch (err) {
      setError(err.message || t.costs.failedConfirm)
    } finally {
      setIsConfirming(null)
    }
  }

  const handleDelete = async (cost) => {
    if (!window.confirm(`${t.costs.deleteConfirm} "${cost.costName}"?`)) return
    
    try {
      await notConfirmedCostAPI.delete(cost.id)
      setCosts(prev => prev.filter(c => c.id !== cost.id))
    } catch (err) {
      setError(err.message || t.costs.failedDelete)
    }
  }

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
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
        title={t.costs.title}
        subtitle={
          canConfirm
            ? t.costs.subtitleConfirm
            : t.costs.subtitleSubmit
        }
        actions={
          <Button 
            icon={<Icons.Plus />}
            onClick={handleOpenModal}
          >
            {t.costs.addNew}
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
                {t.costs.dismiss}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Costs Table */}
      <Card padding={false}>
        <CardHeader style={{ padding: '20px 24px', margin: 0, borderBottom: '1px solid var(--ui-border-light)' }}>
          <div className="portal-card-header-row">
            <CardTitle subtitle={`${costs.length} ${t.costs.pendingSubtitle}`}>
              {t.costs.pendingCosts}
            </CardTitle>
            <Button 
              variant="secondary" 
              size="small" 
              onClick={loadCosts}
              loading={isLoading}
            >
              <Icons.Refresh /> {t.common.refresh}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState text={t.costs.loading} />
          ) : costs.length === 0 ? (
            <EmptyState
              icon={<Icons.FileText />}
              title={t.costs.noPending}
              description={t.costs.noPendingDesc}
              action={
                <Button onClick={handleOpenModal} icon={<Icons.Plus />}>
                  {t.costs.addNew}
                </Button>
              }
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.common.date}</TableHead>
                    <TableHead>{t.costs.costName}</TableHead>
                    <TableHead>{t.costs.reason}</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>{t.common.price}</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>{t.common.actions}</TableHead>
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
                          {canConfirm ? (
                            <Button 
                              variant="success" 
                              size="small"
                              onClick={() => handleConfirm(cost)}
                              loading={isConfirming === cost.id}
                              disabled={isConfirming !== null}
                            >
                              <Icons.Check /> {t.common.confirm}
                            </Button>
                          ) : (
                            <Button 
                              variant="secondary" 
                              size="small"
                              disabled
                              title={t.costs.onlyAdminsConfirm}
                              style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                              <Icons.Check /> {t.costs.pendingApproval}
                            </Button>
                          )}
                          <Button 
                            variant="icon" 
                            size="small" 
                            className="ui-btn-icon-danger"
                            onClick={() => handleDelete(cost)}
                            title={t.costs.deleteCost}
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
              {t.costs.totalPending}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ui-danger)' }}>
              €{totalCosts.toFixed(2)}
            </span>
          </div>
        )}
      </Card>

      {/* Info Note for users who cannot confirm */}
      {!canConfirm && (
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
                <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>{t.costs.howItWorks}</h4>
                <p style={{ margin: 0, color: 'var(--ui-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {t.costs.howItWorksDesc}
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
        title={t.costs.modalTitle}
        subtitle={t.costs.modalSubtitle}
        size="default"
      >
        <Grid cols={2} gap="default">
          <Select
            label={t.costs.costNameRequired}
            options={costTypeOptions}
            placeholder={t.costs.selectCostType}
            value={formData.costId}
            onChange={(e) => {
              const selectedCost = costTypes.find(ct => ct.id === e.target.value)
              setFormData({ 
                ...formData, 
                costId: e.target.value,
                costName: selectedCost?.costName || '',
                // Auto-fill price if the cost type has a fixed price
                price: selectedCost?.fixedPrice ? selectedCost.fixedPrice.toString() : formData.price,
              })
            }}
          />
          <Input
            label={t.costs.priceRequired}
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <Input
            label={t.costs.dateRequired}
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label={t.costs.reasonOptional}
            type="text"
            placeholder={t.costs.reasonPlaceholder}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </Grid>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} loading={isSaving}>
            <Icons.Plus /> {t.costs.submitCost}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default CostsManagement

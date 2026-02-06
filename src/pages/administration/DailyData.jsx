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
  ConfirmDialog,
  ClickableCard,
  Icons,
  EmptyState,
  LoadingState,
} from '../../components/admin/ui'
import { 
  serviceAPI, 
  costAPI, 
  staffAPI, 
  dailyServiceAPI, 
  dailyCostAPI,
  isWithinLastDays,
  getTodayDate,
} from '../../services/dataService'

/**
 * DailyData - Daily entry registration for services and costs
 * Card-based layout with modals for CRUD operations
 */
const DailyData = () => {
  const [activeModal, setActiveModal] = useState(null) // 'services' | 'costs' | null
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Static data for dropdowns
  const [staticServices, setStaticServices] = useState([])
  const [staticCosts, setStaticCosts] = useState([])
  const [staticStaff, setStaticStaff] = useState([])

  // Daily data
  const [dailyServices, setDailyServices] = useState([])
  const [dailyCosts, setDailyCosts] = useState([])

  // Date filter states
  const [dateFilter, setDateFilter] = useState({
    fromDate: getTodayDate(),
    toDate: getTodayDate(),
  })
  const [appliedFilter, setAppliedFilter] = useState({
    fromDate: getTodayDate(),
    toDate: getTodayDate(),
  })

  // Form states
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null, type: null })
  const [isDeleting, setIsDeleting] = useState(false)

  // Load static data on mount
  useEffect(() => {
    loadStaticData()
  }, [])

  // Load daily data when modal opens or filter changes
  useEffect(() => {
    if (activeModal) {
      loadDailyData(activeModal)
    }
  }, [activeModal, appliedFilter])

  const loadStaticData = async () => {
    try {
      const [servicesData, costsData, staffData] = await Promise.all([
        serviceAPI.list(),
        costAPI.list(),
        staffAPI.list(),
      ])
      setStaticServices(servicesData)
      setStaticCosts(costsData)
      setStaticStaff(staffData)
    } catch (err) {
      console.error('Error loading static data:', err)
    }
  }

  const loadDailyData = async (type) => {
    setIsLoading(true)
    setError(null)
    try {
      const { fromDate, toDate } = appliedFilter
      if (type === 'services') {
        const data = await dailyServiceAPI.list(fromDate, toDate)
        // Sort by date descending, then by hourStart descending
        data.sort((a, b) => {
          if (a.date !== b.date) return b.date.localeCompare(a.date)
          return b.hourStart.localeCompare(a.hourStart)
        })
        setDailyServices(data)
      } else if (type === 'costs') {
        const data = await dailyCostAPI.list(fromDate, toDate)
        // Sort by date descending
        data.sort((a, b) => b.date.localeCompare(a.date))
        setDailyCosts(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyFilter = () => {
    setAppliedFilter({ ...dateFilter })
  }

  const handleResetFilter = () => {
    const today = getTodayDate()
    setDateFilter({ fromDate: today, toDate: today })
    setAppliedFilter({ fromDate: today, toDate: today })
  }

  const handleOpenModal = (type) => {
    setActiveModal(type)
    setEditingItem(null)
    setFormData({ date: getTodayDate() })
    setError(null)
    // Reset filter to today when opening modal
    const today = getTodayDate()
    setDateFilter({ fromDate: today, toDate: today })
    setAppliedFilter({ fromDate: today, toDate: today })
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    setEditingItem(null)
    setFormData({})
    setError(null)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({ ...item })
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setFormData({ date: getTodayDate() })
  }

  const handleServiceSelect = (serviceId) => {
    const service = staticServices.find(s => s.id === serviceId)
    setFormData({
      ...formData,
      serviceId,
      serviceName: service?.serviceName || '',
    })
  }

  const handleStaffSelect = (staffId) => {
    const staff = staticStaff.find(s => s.id === staffId)
    setFormData({
      ...formData,
      staffId,
      staffName: staff?.staffName || '',
    })
  }

  const handleCostSelect = (costId) => {
    const cost = staticCosts.find(c => c.id === costId)
    setFormData({
      ...formData,
      costId,
      costName: cost?.costName || '',
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      if (activeModal === 'services') {
        // Validate required fields
        if (!formData.serviceId) throw new Error('Service is required')
        if (!formData.staffId) throw new Error('Staff is required')
        if (!formData.priceTotal && formData.priceTotal !== 0) throw new Error('Price Total is required')
        if (!formData.staffProfit && formData.staffProfit !== 0) throw new Error('Staff Profit is required')
        if (!formData.localBenefit && formData.localBenefit !== 0) throw new Error('Local Benefit is required')
        if (!formData.date) throw new Error('Date is required')
        if (!formData.hourStart) throw new Error('Hour Start is required')
        if (!formData.hourFinish) throw new Error('Hour Finish is required')

        if (editingItem) {
          await dailyServiceAPI.update(editingItem.id, formData)
        } else {
          await dailyServiceAPI.create(formData)
        }
        await loadDailyData('services')
      } else if (activeModal === 'costs') {
        // Validate required fields
        if (!formData.costId) throw new Error('Cost is required')
        if (!formData.price && formData.price !== 0) throw new Error('Price is required')
        if (!formData.date) throw new Error('Date is required')

        if (editingItem) {
          await dailyCostAPI.update(editingItem.id, formData)
        } else {
          await dailyCostAPI.create(formData)
        }
        await loadDailyData('costs')
      }
      setEditingItem(null)
      setFormData({ date: getTodayDate() })
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (item, type) => {
    setDeleteConfirm({ open: true, item, type })
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const { item, type } = deleteConfirm
      if (type === 'services') {
        await dailyServiceAPI.delete(item.id)
        await loadDailyData('services')
      } else if (type === 'costs') {
        await dailyCostAPI.delete(item.id)
        await loadDailyData('costs')
      }
      setDeleteConfirm({ open: false, item: null, type: null })
    } catch (err) {
      setError(err.message || 'Failed to delete')
    } finally {
      setIsDeleting(false)
    }
  }

  // Check if edit/delete is allowed (within last 3 days)
  const canEditDelete = (dateStr) => isWithinLastDays(dateStr, 3)

  // Format time for display
  const formatTime = (timeStr) => {
    if (!timeStr) return '-'
    return timeStr.substring(0, 5) // HH:MM
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const cardItems = [
    {
      id: 'services',
      title: 'Daily Services',
      subtitle: 'Record services provided each day',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      ),
    },
    {
      id: 'costs',
      title: 'Daily Costs',
      subtitle: 'Record daily expenses and costs',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
          <path d="M12 18V6"/>
        </svg>
      ),
    },
  ]

  // Generate service options for dropdown
  const serviceOptions = staticServices.map(s => ({
    value: s.id,
    label: s.serviceName + (s.fixedPrice ? ` - €${s.fixedPrice.toFixed(2)}` : ''),
  }))

  // Generate staff options for dropdown
  const staffOptions = staticStaff.map(s => ({
    value: s.id,
    label: s.staffName,
  }))

  // Generate cost options for dropdown
  const costOptions = staticCosts.map(c => ({
    value: c.id,
    label: c.costName + (c.fixedPrice ? ` - €${c.fixedPrice.toFixed(2)}` : ''),
  }))

  // Date filter component
  const DateFilterSection = () => (
    <Card style={{ marginBottom: '16px' }}>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
          <Input
            label="From Date"
            type="date"
            value={dateFilter.fromDate}
            onChange={(e) => setDateFilter({ ...dateFilter, fromDate: e.target.value })}
            containerClassName="ui-mb-0"
            style={{ width: '160px' }}
          />
          <Input
            label="To Date"
            type="date"
            value={dateFilter.toDate}
            onChange={(e) => setDateFilter({ ...dateFilter, toDate: e.target.value })}
            containerClassName="ui-mb-0"
            style={{ width: '160px' }}
          />
          <Button onClick={handleApplyFilter} size="small">
            <Icons.Search /> Search
          </Button>
          <Button variant="secondary" onClick={handleResetFilter} size="small">
            Today
          </Button>
          <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
            Showing: {appliedFilter.fromDate === appliedFilter.toDate 
              ? formatDate(appliedFilter.fromDate)
              : `${formatDate(appliedFilter.fromDate)} - ${formatDate(appliedFilter.toDate)}`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <PageHeader 
        title="Daily Entry"
        subtitle="Record daily services and costs"
      />

      {/* Two Cards Grid */}
      <Grid cols={2} gap="large">
        {cardItems.map((item) => (
          <ClickableCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            onClick={() => handleOpenModal(item.id)}
          />
        ))}
      </Grid>

      {/* Daily Services Modal */}
      <Modal
        isOpen={activeModal === 'services'}
        onClose={handleCloseModal}
        title="Daily Services"
        subtitle="Record and manage daily service entries"
        size="large"
      >
        {/* Date Filter */}
        <DateFilterSection />

        {/* Add/Edit Form */}
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Service Entry' : 'Add New Service Entry'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div style={{ 
                padding: '12px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#dc2626',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}
            <Grid cols={2} gap="default">
              <Select
                label="Service *"
                options={serviceOptions}
                placeholder="Select service"
                value={formData.serviceId || ''}
                onChange={(e) => handleServiceSelect(e.target.value)}
              />
              <Select
                label="Staff *"
                options={staffOptions}
                placeholder="Select staff"
                value={formData.staffId || ''}
                onChange={(e) => handleStaffSelect(e.target.value)}
              />
              <Input
                label="Price Total (€) *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.priceTotal || ''}
                onChange={(e) => setFormData({ ...formData, priceTotal: e.target.value ? parseFloat(e.target.value) : null })}
              />
              <Input
                label="Staff Profit (€) *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.staffProfit || ''}
                onChange={(e) => setFormData({ ...formData, staffProfit: e.target.value ? parseFloat(e.target.value) : null })}
              />
              <Input
                label="Local Benefit (€) *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.localBenefit || ''}
                onChange={(e) => setFormData({ ...formData, localBenefit: e.target.value ? parseFloat(e.target.value) : null })}
              />
              <Input
                label="Date *"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <Input
                label="Hour Start *"
                type="time"
                value={formData.hourStart || ''}
                onChange={(e) => setFormData({ ...formData, hourStart: e.target.value })}
              />
              <Input
                label="Hour Finish *"
                type="time"
                value={formData.hourFinish || ''}
                onChange={(e) => setFormData({ ...formData, hourFinish: e.target.value })}
              />
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              {editingItem && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} loading={isSaving}>
                {editingItem ? 'Update Entry' : 'Add Entry'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services List */}
        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle={`${dailyServices.length} entries found`}>
              Service Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState text="Loading services..." />
            ) : dailyServices.length === 0 ? (
              <EmptyState
                icon={<Icons.FileText />}
                title="No services for this period"
                description="Add your first service entry using the form above"
              />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead style={{ textAlign: 'right' }}>Total</TableHead>
                      <TableHead style={{ textAlign: 'right' }}>Staff</TableHead>
                      <TableHead style={{ textAlign: 'right' }}>Local</TableHead>
                      <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyServices.map((item) => {
                      const editable = canEditDelete(item.date)
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge variant={item.date === getTodayDate() ? 'info' : 'neutral'} size="small">
                              {formatDate(item.date)}
                            </Badge>
                          </TableCell>
                          <TableCell style={{ fontSize: '0.8125rem', color: 'var(--ui-text-muted)' }}>
                            {formatTime(item.hourStart)} - {formatTime(item.hourFinish)}
                          </TableCell>
                          <TableCell><span style={{ fontWeight: 500 }}>{item.serviceName}</span></TableCell>
                          <TableCell>{item.staffName}</TableCell>
                          <TableCell style={{ textAlign: 'right', fontWeight: 500 }}>
                            €{item.priceTotal?.toFixed(2)}
                          </TableCell>
                          <TableCell style={{ textAlign: 'right', color: 'var(--ui-success)' }}>
                            €{item.staffProfit?.toFixed(2)}
                          </TableCell>
                          <TableCell style={{ textAlign: 'right', color: 'var(--ui-primary)' }}>
                            €{item.localBenefit?.toFixed(2)}
                          </TableCell>
                          <TableCell style={{ textAlign: 'right' }}>
                            {editable ? (
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                                <Button variant="ghost" size="small" onClick={() => handleEdit(item)}>
                                  <Icons.Edit />
                                </Button>
                                <Button variant="ghost" size="small" onClick={() => handleDeleteClick(item, 'services')}>
                                  <Icons.Trash />
                                </Button>
                              </div>
                            ) : (
                              <span 
                                style={{ fontSize: '0.75rem', color: 'var(--ui-text-light)' }}
                                title="Editing is only allowed for the last 3 days"
                              >
                                Locked
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Modal>

      {/* Daily Costs Modal */}
      <Modal
        isOpen={activeModal === 'costs'}
        onClose={handleCloseModal}
        title="Daily Costs"
        subtitle="Record and manage daily cost entries"
        size="large"
      >
        {/* Date Filter */}
        <DateFilterSection />

        {/* Add/Edit Form */}
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Cost Entry' : 'Add New Cost Entry'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div style={{ 
                padding: '12px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#dc2626',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}
            <Grid cols={2} gap="default">
              <Select
                label="Cost Type *"
                options={costOptions}
                placeholder="Select cost type"
                value={formData.costId || ''}
                onChange={(e) => handleCostSelect(e.target.value)}
              />
              <Input
                label="Price (€) *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : null })}
              />
              <Input
                label="Date *"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <Input
                label="Reason (optional)"
                placeholder="Enter reason or description"
                value={formData.reason || ''}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              {editingItem && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} loading={isSaving}>
                {editingItem ? 'Update Entry' : 'Add Entry'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Costs List */}
        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle={`${dailyCosts.length} entries found`}>
              Cost Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState text="Loading costs..." />
            ) : dailyCosts.length === 0 ? (
              <EmptyState
                icon={<Icons.DollarSign />}
                title="No costs for this period"
                description="Add your first cost entry using the form above"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Price</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCosts.map((item) => {
                    const editable = canEditDelete(item.date)
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant={item.date === getTodayDate() ? 'info' : 'neutral'} size="small">
                            {formatDate(item.date)}
                          </Badge>
                        </TableCell>
                        <TableCell><span style={{ fontWeight: 500 }}>{item.costName}</span></TableCell>
                        <TableCell style={{ color: 'var(--ui-text-muted)' }}>{item.reason || '-'}</TableCell>
                        <TableCell style={{ textAlign: 'right', fontWeight: 500, color: 'var(--ui-danger)' }}>
                          €{item.price?.toFixed(2)}
                        </TableCell>
                        <TableCell style={{ textAlign: 'right' }}>
                          {editable ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                              <Button variant="ghost" size="small" onClick={() => handleEdit(item)}>
                                <Icons.Edit />
                              </Button>
                              <Button variant="ghost" size="small" onClick={() => handleDeleteClick(item, 'costs')}>
                                <Icons.Trash />
                              </Button>
                            </div>
                          ) : (
                            <span 
                              style={{ fontSize: '0.75rem', color: 'var(--ui-text-light)' }}
                              title="Editing is only allowed for the last 3 days"
                            >
                              Locked
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, item: null, type: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Entry"
        message={`Are you sure you want to delete this ${
          deleteConfirm.type === 'services' ? 'service' : 'cost'
        } entry? This action cannot be undone.`}
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  )
}

export default DailyData

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
import { serviceAPI, costAPI, staffAPI, centerAPI, roomAPI, roomPictureAPI } from '../../services/dataService'

const RoomPictureThumb = ({ pictureKey }) => {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (!pictureKey) {
      setUrl(null)
      return
    }
    let cancelled = false
    roomPictureAPI.getUrl(pictureKey).then((resolved) => {
      if (!cancelled) setUrl(resolved)
    })
    return () => { cancelled = true }
  }, [pictureKey])

  if (!pictureKey) return '-'
  if (url) {
    return (
      <img
        src={url}
        alt=""
        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
      />
    )
  }
  return <span style={{ fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>Has picture</span>
}

/**
 * StaticData - CRUD for Services, Cost Types, Staff, Centers, and Rooms
 * Card-based layout with modals for management
 */
const StaticData = () => {
  const [activeModal, setActiveModal] = useState(null) // 'services' | 'costs' | 'staff' | 'centers' | 'rooms' | null
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Data states
  const [services, setServices] = useState([])
  const [costs, setCosts] = useState([])
  const [staff, setStaff] = useState([])
  const [centers, setCenters] = useState([])
  const [rooms, setRooms] = useState([])

  // Room picture upload
  const [roomPictureFile, setRoomPictureFile] = useState(null)
  const [roomPicturePreview, setRoomPicturePreview] = useState(null)

  // Form states
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null, type: null })
  const [isDeleting, setIsDeleting] = useState(false)

  // Load data when modal opens
  useEffect(() => {
    if (activeModal) {
      loadData(activeModal)
    }
  }, [activeModal])

  const clearRoomPicture = () => {
    setRoomPictureFile(null)
    setRoomPicturePreview(null)
  }

  const loadData = async (type) => {
    setIsLoading(true)
    setError(null)
    try {
      switch (type) {
        case 'services':
          const servicesData = await serviceAPI.list()
          setServices(servicesData)
          break
        case 'costs':
          const costsData = await costAPI.list()
          setCosts(costsData)
          break
        case 'staff':
          const staffData = await staffAPI.list()
          setStaff(staffData)
          break
        case 'centers':
          const centersData = await centerAPI.list()
          setCenters(centersData)
          break
        case 'rooms':
          const [roomsData, centersForRooms] = await Promise.all([
            roomAPI.list(),
            centerAPI.list(),
          ])
          setRooms(roomsData)
          setCenters(centersForRooms)
          break
      }
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (type) => {
    setActiveModal(type)
    setEditingItem(null)
    setFormData({})
    clearRoomPicture()
    setError(null)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    setEditingItem(null)
    setFormData({})
    clearRoomPicture()
    setError(null)
  }

  const handleEdit = async (item) => {
    setEditingItem(item)
    setFormData({ ...item })
    clearRoomPicture()
    if (activeModal === 'rooms' && item.pictureKey) {
      const url = await roomPictureAPI.getUrl(item.pictureKey)
      if (url) setRoomPicturePreview(url)
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setFormData({})
    clearRoomPicture()
  }

  const handleRoomPictureChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setRoomPictureFile(file)
    setRoomPicturePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      if (activeModal === 'services') {
        if (!formData.serviceName?.trim()) {
          throw new Error('Service Name is required')
        }
        if (editingItem) {
          await serviceAPI.update(editingItem.id, formData)
        } else {
          await serviceAPI.create(formData)
        }
        await loadData('services')
      } else if (activeModal === 'costs') {
        if (!formData.costName?.trim()) {
          throw new Error('Cost Name is required')
        }
        if (editingItem) {
          await costAPI.update(editingItem.id, formData)
        } else {
          await costAPI.create(formData)
        }
        await loadData('costs')
      } else if (activeModal === 'staff') {
        if (!formData.staffName?.trim()) {
          throw new Error('Staff Name is required')
        }
        if (editingItem) {
          await staffAPI.update(editingItem.id, formData)
        } else {
          await staffAPI.create(formData)
        }
        await loadData('staff')
      } else if (activeModal === 'centers') {
        if (!formData.centerName?.trim()) {
          throw new Error('Center Name is required')
        }
        if (!formData.referenceNumber?.trim()) {
          throw new Error('Center Reference Number is required')
        }
        if (editingItem) {
          await centerAPI.update(editingItem.id, formData)
        } else {
          await centerAPI.create(formData)
        }
        await loadData('centers')
      } else if (activeModal === 'rooms') {
        if (!formData.roomName?.trim()) {
          throw new Error('Room Name is required')
        }
        if (!formData.referenceNumber?.trim()) {
          throw new Error('Room Reference Number is required')
        }
        if (!formData.centerId) {
          throw new Error('Associated Center is required')
        }
        const center = centers.find(c => c.id === formData.centerId)
        let pictureKey = formData.pictureKey || null
        if (roomPictureFile) {
          pictureKey = await roomPictureAPI.upload(roomPictureFile)
        }
        const roomPayload = {
          ...formData,
          centerName: center?.centerName,
          pictureKey,
        }
        if (editingItem) {
          await roomAPI.update(editingItem.id, roomPayload)
        } else {
          await roomAPI.create(roomPayload)
        }
        await loadData('rooms')
      }
      setEditingItem(null)
      setFormData({})
      clearRoomPicture()
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
        await serviceAPI.delete(item.id)
        await loadData('services')
      } else if (type === 'costs') {
        await costAPI.delete(item.id)
        await loadData('costs')
      } else if (type === 'staff') {
        await staffAPI.delete(item.id)
        await loadData('staff')
      } else if (type === 'centers') {
        await centerAPI.delete(item.id)
        await loadData('centers')
      } else if (type === 'rooms') {
        await roomAPI.delete(item.id)
        await loadData('rooms')
      }
      setDeleteConfirm({ open: false, item: null, type: null })
    } catch (err) {
      setError(err.message || 'Failed to delete')
    } finally {
      setIsDeleting(false)
    }
  }

  const centerOptions = centers.map((c) => ({
    value: c.id,
    label: `${c.centerName} (${c.referenceNumber})`,
  }))

  const cardItems = [
    {
      id: 'services',
      title: 'Services',
      subtitle: 'Manage massage services and pricing',
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
      title: 'Costs',
      subtitle: 'Manage expense categories',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
          <path d="M12 18V6"/>
        </svg>
      ),
    },
    {
      id: 'staff',
      title: 'Staff',
      subtitle: 'Manage staff members',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      id: 'centers',
      title: 'Centers',
      subtitle: 'Manage physical locations',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 21h18"/>
          <path d="M5 21V7l7-4 7 4v14"/>
          <path d="M9 21v-6h6v6"/>
          <path d="M9 9h.01"/>
          <path d="M15 9h.01"/>
          <path d="M9 13h.01"/>
          <path d="M15 13h.01"/>
        </svg>
      ),
    },
    {
      id: 'rooms',
      title: 'Rooms',
      subtitle: 'Manage rooms within centers',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 21h18"/>
          <path d="M5 21V9l7-4v16"/>
          <path d="M19 21V9l-7-4"/>
          <path d="M9 21v-4h4v4"/>
          <path d="M10 12h2"/>
        </svg>
      ),
    },
  ]

  return (
    <div>
      <PageHeader 
        title="Local Configuration"
        subtitle="Manage services, costs, staff, centers, and rooms"
      />

      <Grid cols={3} gap="large">
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

      {/* Services Modal */}
      <Modal
        isOpen={activeModal === 'services'}
        onClose={handleCloseModal}
        title="Services"
        subtitle="Manage massage services and pricing"
        size="large"
      >
        {/* Add/Edit Form */}
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Service' : 'Add New Service'}
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
            <Grid cols={3} gap="default">
              <Input
                label="Service Name *"
                placeholder="e.g., Deep Tissue Massage"
                value={formData.serviceName || ''}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              />
              <Input
                label="Minutes"
                type="number"
                placeholder="e.g., 60"
                value={formData.minutes || ''}
                onChange={(e) => setFormData({ ...formData, minutes: e.target.value ? parseInt(e.target.value) : null })}
              />
              <Input
                label="Fixed Price (€)"
                type="number"
                step="0.01"
                placeholder="e.g., 85.00"
                value={formData.fixedPrice || ''}
                onChange={(e) => setFormData({ ...formData, fixedPrice: e.target.value ? parseFloat(e.target.value) : null })}
              />
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              {editingItem && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} loading={isSaving}>
                {editingItem ? 'Update Service' : 'Add Service'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services List */}
        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle={`${services.length} services registered`}>
              All Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState text="Loading services..." />
            ) : services.length === 0 ? (
              <EmptyState
                icon={<Icons.FileText />}
                title="No services yet"
                description="Add your first service using the form above"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell><span style={{ fontWeight: 500 }}>{service.serviceName}</span></TableCell>
                      <TableCell>{service.minutes ? `${service.minutes} min` : '-'}</TableCell>
                      <TableCell>{service.fixedPrice ? `€${service.fixedPrice.toFixed(2)}` : '-'}</TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <Button variant="ghost" size="small" onClick={() => handleEdit(service)}>
                            <Icons.Edit />
                          </Button>
                          <Button variant="ghost" size="small" onClick={() => handleDeleteClick(service, 'services')}>
                            <Icons.Trash />
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
      </Modal>

      {/* Costs Modal */}
      <Modal
        isOpen={activeModal === 'costs'}
        onClose={handleCloseModal}
        title="Costs"
        subtitle="Manage expense categories"
        size="large"
      >
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Cost' : 'Add New Cost'}
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
              <Input
                label="Cost Name *"
                placeholder="e.g., Supplies"
                value={formData.costName || ''}
                onChange={(e) => setFormData({ ...formData, costName: e.target.value })}
              />
              <Input
                label="Fixed Price (€)"
                type="number"
                step="0.01"
                placeholder="e.g., 50.00"
                value={formData.fixedPrice || ''}
                onChange={(e) => setFormData({ ...formData, fixedPrice: e.target.value ? parseFloat(e.target.value) : null })}
              />
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              {editingItem && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} loading={isSaving}>
                {editingItem ? 'Update Cost' : 'Add Cost'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle={`${costs.length} cost types registered`}>
              All Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState text="Loading costs..." />
            ) : costs.length === 0 ? (
              <EmptyState
                icon={<Icons.DollarSign />}
                title="No costs yet"
                description="Add your first cost type using the form above"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cost Name</TableHead>
                    <TableHead>Fixed Price</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costs.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell><span style={{ fontWeight: 500 }}>{cost.costName}</span></TableCell>
                      <TableCell>{cost.fixedPrice ? `€${cost.fixedPrice.toFixed(2)}` : '-'}</TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <Button variant="ghost" size="small" onClick={() => handleEdit(cost)}>
                            <Icons.Edit />
                          </Button>
                          <Button variant="ghost" size="small" onClick={() => handleDeleteClick(cost, 'costs')}>
                            <Icons.Trash />
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
      </Modal>

      {/* Staff Modal */}
      <Modal
        isOpen={activeModal === 'staff'}
        onClose={handleCloseModal}
        title="Staff"
        subtitle="Manage staff members"
        size="large"
      >
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Staff Member' : 'Add New Staff Member'}
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
            <Input
              label="Staff Name *"
              placeholder="e.g., Maria"
              value={formData.staffName || ''}
              onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Email"
                type="email"
                placeholder="e.g., maria@example.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="e.g., +34 612 345 678"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              {editingItem && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} loading={isSaving}>
                {editingItem ? 'Update Staff' : 'Add Staff'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle={`${staff.length} staff members registered`}>
              All Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState text="Loading staff..." />
            ) : staff.length === 0 ? (
              <EmptyState
                icon={<Icons.Users />}
                title="No staff yet"
                description="Add your first staff member using the form above"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell><span style={{ fontWeight: 500 }}>{member.staffName}</span></TableCell>
                      <TableCell style={{ fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
                        {member.email || '-'}
                      </TableCell>
                      <TableCell style={{ fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
                        {member.phone || '-'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <Button variant="ghost" size="small" onClick={() => handleEdit(member)}>
                            <Icons.Edit />
                          </Button>
                          <Button variant="ghost" size="small" onClick={() => handleDeleteClick(member, 'staff')}>
                            <Icons.Trash />
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
      </Modal>

      {/* Centers Modal */}
      <Modal
        isOpen={activeModal === 'centers'}
        onClose={handleCloseModal}
        title="Centers"
        subtitle="Manage physical locations"
        size="large"
      >
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Center' : 'Add New Center'}
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
              <Input
                label="Center Name *"
                placeholder="e.g., Downtown Studio"
                value={formData.centerName || ''}
                onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
              />
              <Input
                label="Center Reference Number *"
                placeholder="e.g., CTR-001"
                value={formData.referenceNumber || ''}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              />
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              {editingItem && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} loading={isSaving}>
                {editingItem ? 'Update Center' : 'Add Center'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle={`${centers.length} centers registered`}>
              All Centers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState text="Loading centers..." />
            ) : centers.length === 0 ? (
              <EmptyState
                icon={<Icons.FileText />}
                title="No centers yet"
                description="Add your first center using the form above"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Center Name</TableHead>
                    <TableHead>Reference Number</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centers.map((center) => (
                    <TableRow key={center.id}>
                      <TableCell><span style={{ fontWeight: 500 }}>{center.centerName}</span></TableCell>
                      <TableCell>{center.referenceNumber || '-'}</TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <Button variant="ghost" size="small" onClick={() => handleEdit(center)}>
                            <Icons.Edit />
                          </Button>
                          <Button variant="ghost" size="small" onClick={() => handleDeleteClick(center, 'centers')}>
                            <Icons.Trash />
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
      </Modal>

      {/* Rooms Modal */}
      <Modal
        isOpen={activeModal === 'rooms'}
        onClose={handleCloseModal}
        title="Rooms"
        subtitle="Manage rooms within centers"
        size="large"
      >
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Room' : 'Add New Room'}
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
              <Input
                label="Room Name *"
                placeholder="e.g., Room A"
                value={formData.roomName || ''}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
              />
              <Input
                label="Room Reference Number *"
                placeholder="e.g., RM-001"
                value={formData.referenceNumber || ''}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              />
              <Select
                label="Associated Center *"
                options={centerOptions}
                placeholder="Select center"
                value={formData.centerId || ''}
                onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
              />
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>
                  Room Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRoomPictureChange}
                  style={{ fontSize: '0.875rem' }}
                />
                {(roomPicturePreview || formData.pictureKey) && (
                  <div style={{ marginTop: '12px' }}>
                    {roomPicturePreview ? (
                      <img
                        src={roomPicturePreview}
                        alt="Room preview"
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <RoomPictureThumb pictureKey={formData.pictureKey} />
                    )}
                  </div>
                )}
              </div>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              {editingItem && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} loading={isSaving}>
                {editingItem ? 'Update Room' : 'Add Room'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle={`${rooms.length} rooms registered`}>
              All Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState text="Loading rooms..." />
            ) : rooms.length === 0 ? (
              <EmptyState
                icon={<Icons.FileText />}
                title="No rooms yet"
                description="Add your first room using the form above"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Picture</TableHead>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Reference Number</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <RoomPictureThumb pictureKey={room.pictureKey} />
                      </TableCell>
                      <TableCell><span style={{ fontWeight: 500 }}>{room.roomName}</span></TableCell>
                      <TableCell>{room.referenceNumber || '-'}</TableCell>
                      <TableCell>{room.centerName || '-'}</TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <Button variant="ghost" size="small" onClick={() => handleEdit(room)}>
                            <Icons.Edit />
                          </Button>
                          <Button variant="ghost" size="small" onClick={() => handleDeleteClick(room, 'rooms')}>
                            <Icons.Trash />
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
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, item: null, type: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message={`Are you sure you want to delete "${
          deleteConfirm.item?.serviceName || 
          deleteConfirm.item?.costName || 
          deleteConfirm.item?.staffName || 
          deleteConfirm.item?.centerName ||
          deleteConfirm.item?.roomName ||
          'this item'
        }"? This action cannot be undone.`}
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  )
}

export default StaticData

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
  Input,
  Select,
  Modal,
  ConfirmDialog,
  Icons,
  EmptyState,
  LoadingState,
} from '../../components/admin/ui'
import { staffAPI, staffApplicationAPI } from '../../services/dataService'
import './StaffManagement.css'

const GENDER_OPTIONS = [
  { value: 'Man', label: 'Man' },
  { value: 'Female', label: 'Female' },
  { value: 'Others', label: 'Others' },
]

const EXPERIENCE_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '5+', label: 'More than 5' },
]

/**
 * StaffManagement - Admin page for Work With Us requests and confirmed staff
 * Tabs: New Requests | Staffs
 */
const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('requests')

  // Applications (New Requests)
  const [applications, setApplications] = useState([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // Confirmed staff
  const [staff, setStaff] = useState([])
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [staffForm, setStaffForm] = useState({})
  const [isSavingStaff, setIsSavingStaff] = useState(false)
  const [staffError, setStaffError] = useState(null)

  // Confirm / decline dialogs
  const [confirmDialog, setConfirmDialog] = useState({ open: false, item: null })
  const [declineDialog, setDeclineDialog] = useState({ open: false, item: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadApplications()
    loadStaff()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (activeTab === 'requests') {
        loadApplications()
      }
    }, 30000)
    return () => clearInterval(intervalId)
  }, [activeTab])

  const loadApplications = async () => {
    setIsLoadingRequests(true)
    try {
      const data = await staffApplicationAPI.listPending()
      data.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      setApplications(data)
    } catch (err) {
      console.error('Error loading applications:', err)
    } finally {
      setIsLoadingRequests(false)
    }
  }

  const loadStaff = async () => {
    setIsLoadingStaff(true)
    try {
      const data = await staffAPI.list()
      data.sort((a, b) => (a.staffName || '').localeCompare(b.staffName || ''))
      setStaff(data)
    } catch (err) {
      console.error('Error loading staff:', err)
    } finally {
      setIsLoadingStaff(false)
    }
  }

  const handleConfirm = async () => {
    if (!confirmDialog.item) return
    setActionLoadingId(confirmDialog.item.id)
    try {
      await staffApplicationAPI.confirm(confirmDialog.item)
      setConfirmDialog({ open: false, item: null })
      await Promise.all([loadApplications(), loadStaff()])
      setActiveTab('staffs')
    } catch (err) {
      console.error('Error confirming application:', err)
      alert(err.message || 'Failed to confirm application')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDecline = async () => {
    if (!declineDialog.item) return
    setActionLoadingId(declineDialog.item.id)
    try {
      await staffApplicationAPI.decline(declineDialog.item.id)
      setDeclineDialog({ open: false, item: null })
      await loadApplications()
    } catch (err) {
      console.error('Error declining application:', err)
      alert(err.message || 'Failed to decline application')
    } finally {
      setActionLoadingId(null)
    }
  }

  const openAddStaff = () => {
    setEditingStaff(null)
    setStaffForm({})
    setStaffError(null)
    setShowStaffModal(true)
  }

  const openEditStaff = (member) => {
    setEditingStaff(member)
    setStaffForm({
      staffName: member.staffName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      phone: member.phone || '',
      gender: member.gender || '',
      yearsOfExperience: member.yearsOfExperience || '',
    })
    setStaffError(null)
    setShowStaffModal(true)
  }

  const handleSaveStaff = async () => {
    if (!staffForm.staffName?.trim()) {
      setStaffError('Name is required')
      return
    }
    setIsSavingStaff(true)
    setStaffError(null)
    try {
      if (editingStaff) {
        await staffAPI.update(editingStaff.id, staffForm)
      } else {
        await staffAPI.create(staffForm)
      }
      setShowStaffModal(false)
      await loadStaff()
    } catch (err) {
      setStaffError(err.message || 'Failed to save staff member')
    } finally {
      setIsSavingStaff(false)
    }
  }

  const handleDeleteStaff = async () => {
    if (!deleteDialog.item) return
    setIsDeleting(true)
    try {
      await staffAPI.delete(deleteDialog.item.id)
      setDeleteDialog({ open: false, item: null })
      await loadStaff()
    } catch (err) {
      console.error('Error deleting staff:', err)
      alert(err.message || 'Failed to delete staff member')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatExperience = (value) => {
    if (!value) return '-'
    if (value === '5+') return 'More than 5'
    return value
  }

  const fullName = (first, last) => [first, last].filter(Boolean).join(' ') || '-'

  return (
    <div className="staff-management">
      <PageHeader
        title="Staff"
        subtitle="Review new applications and manage confirmed staff members"
      />

      <div className="staff-tabs">
        <button
          type="button"
          className={`staff-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          New Requests
          {applications.length > 0 && (
            <span className="staff-tab-badge">{applications.length}</span>
          )}
        </button>
        <button
          type="button"
          className={`staff-tab ${activeTab === 'staffs' ? 'active' : ''}`}
          onClick={() => setActiveTab('staffs')}
        >
          Staffs
          <span className="staff-tab-count">{staff.length}</span>
        </button>
      </div>

      {activeTab === 'requests' && (
        <Card padding={false}>
          <CardHeader
            actions={
              <Button variant="secondary" size="small" onClick={loadApplications}>
                Refresh
              </Button>
            }
          >
            <CardTitle subtitle={`${applications.length} pending application${applications.length === 1 ? '' : 's'}`}>
              New Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <LoadingState text="Loading requests..." />
            ) : applications.length === 0 ? (
              <EmptyState
                icon={<Icons.Users />}
                title="No new requests"
                description="Applications from the Work With Us page will appear here"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Explanation</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <span style={{ fontWeight: 500 }}>
                          {fullName(app.firstName, app.lastName)}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: '0.875rem' }}>{app.email}</TableCell>
                      <TableCell style={{ fontSize: '0.875rem' }}>{app.phone}</TableCell>
                      <TableCell>
                        <Badge variant="neutral">{app.gender || '-'}</Badge>
                      </TableCell>
                      <TableCell>{formatExperience(app.yearsOfExperience)}</TableCell>
                      <TableCell style={{ maxWidth: 220, fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
                        {app.explanation || '-'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <Button
                            variant="success"
                            size="small"
                            loading={actionLoadingId === app.id}
                            onClick={() => setConfirmDialog({ open: true, item: app })}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            disabled={actionLoadingId === app.id}
                            onClick={() => setDeclineDialog({ open: true, item: app })}
                          >
                            Decline
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
      )}

      {activeTab === 'staffs' && (
        <Card padding={false}>
          <CardHeader
            actions={
              <Button onClick={openAddStaff} icon={<Icons.Plus />}>
                Add Staff
              </Button>
            }
          >
            <CardTitle subtitle={`${staff.length} staff member${staff.length === 1 ? '' : 's'}`}>
              Staffs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStaff ? (
              <LoadingState text="Loading staff..." />
            ) : staff.length === 0 ? (
              <EmptyState
                icon={<Icons.Users />}
                title="No staff yet"
                description="Confirmed applications and manually added staff will appear here"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <span style={{ fontWeight: 500 }}>{member.staffName}</span>
                      </TableCell>
                      <TableCell>{member.lastName || '-'}</TableCell>
                      <TableCell style={{ fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
                        {member.email || '-'}
                      </TableCell>
                      <TableCell style={{ fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
                        {member.phone || '-'}
                      </TableCell>
                      <TableCell>{member.gender || '-'}</TableCell>
                      <TableCell>{formatExperience(member.yearsOfExperience)}</TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <Button variant="ghost" size="small" onClick={() => openEditStaff(member)}>
                            <Icons.Edit />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => setDeleteDialog({ open: true, item: member })}
                          >
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
      )}

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        title={editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
        subtitle="Staff details"
        size="default"
      >
        {staffError && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            {staffError}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Name *"
            placeholder="First name"
            value={staffForm.staffName || ''}
            onChange={(e) => setStaffForm({ ...staffForm, staffName: e.target.value })}
          />
          <Input
            label="Last Name"
            placeholder="Last name"
            value={staffForm.lastName || ''}
            onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={staffForm.email || ''}
            onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+34 ..."
            value={staffForm.phone || ''}
            onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Gender"
            placeholder="Select gender"
            options={GENDER_OPTIONS}
            value={staffForm.gender || ''}
            onChange={(e) => setStaffForm({ ...staffForm, gender: e.target.value })}
          />
          <Select
            label="Years of Experience"
            placeholder="Select experience"
            options={EXPERIENCE_OPTIONS}
            value={staffForm.yearsOfExperience || ''}
            onChange={(e) => setStaffForm({ ...staffForm, yearsOfExperience: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => setShowStaffModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveStaff} loading={isSavingStaff}>
            {editingStaff ? 'Update Staff' : 'Add Staff'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, item: null })}
        onConfirm={handleConfirm}
        title="Confirm Application"
        message={`Confirm ${fullName(confirmDialog.item?.firstName, confirmDialog.item?.lastName)} and move them to Staffs?`}
        confirmText="Confirm"
        variant="success"
        loading={!!actionLoadingId}
      />

      <ConfirmDialog
        isOpen={declineDialog.open}
        onClose={() => setDeclineDialog({ open: false, item: null })}
        onConfirm={handleDecline}
        title="Decline Application"
        message={`Decline and remove the application from ${fullName(declineDialog.item?.firstName, declineDialog.item?.lastName)}? This cannot be undone.`}
        confirmText="Decline"
        loading={!!actionLoadingId}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
        onConfirm={handleDeleteStaff}
        title="Delete Staff"
        message={`Are you sure you want to delete "${fullName(deleteDialog.item?.staffName, deleteDialog.item?.lastName)}"? This cannot be undone.`}
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  )
}

export default StaffManagement

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  PageHeader,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  EmptyState,
  LoadingState,
  Icons,
} from '../../components/admin/ui'
import { staffBookingLinkAPI, centerAPI, roomAPI } from '../../services/dataService'
import { useAuth } from '../../context/AuthContext'

/**
 * Create Link — staff generate shareable booking URLs for customers
 */
const CreateLink = () => {
  const { staffProfile, userEmail, isUser, isAdmin } = useAuth()
  const [links, setLinks] = useState([])
  const [centers, setCenters] = useState([])
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [form, setForm] = useState({
    centerId: '',
    roomId: '', // '' = any room
  })

  const staffName = [staffProfile?.staffName, staffProfile?.lastName].filter(Boolean).join(' ') || userEmail || 'Staff'

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [centersData, roomsData, linksData] = await Promise.all([
        centerAPI.list(),
        roomAPI.list(),
        staffBookingLinkAPI.list(isUser && staffProfile?.id ? staffProfile.id : null),
      ])
      setCenters(centersData)
      setRooms(roomsData)
      const mine =
        isUser && staffProfile?.id
          ? (linksData || []).filter((l) => l.therapistId === staffProfile.id)
          : linksData || []
      setLinks(mine.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')))
      if (centersData.length === 1) {
        setForm((prev) => ({ ...prev, centerId: prev.centerId || centersData[0].id }))
      }
    } catch (err) {
      setError(err.message || 'Failed to load links')
    } finally {
      setIsLoading(false)
    }
  }, [isUser, staffProfile?.id])

  useEffect(() => {
    load()
  }, [load])

  const centerOptions = centers.map((c) => ({
    value: c.id,
    label: `${c.centerName}${c.referenceNumber ? ` (${c.referenceNumber})` : ''}`,
  }))

  const roomOptions = [
    { value: '', label: 'Any room' },
    ...rooms
      .filter((r) => !form.centerId || r.centerId === form.centerId)
      .map((r) => ({
        value: r.id,
        label: r.roomName,
      })),
  ]

  const buildPublicUrl = (token) => `${window.location.origin}/book-link/${token}`

  const handleCreate = async () => {
    if (!staffProfile?.id) {
      setError('Your Cognito email must be linked to a Staff profile to create links')
      return
    }
    if (!form.centerId) {
      setError('Select a center')
      return
    }
    setIsCreating(true)
    setError(null)
    try {
      const center = centers.find((c) => c.id === form.centerId)
      const room = form.roomId ? rooms.find((r) => r.id === form.roomId) : null
      await staffBookingLinkAPI.create({
        therapistId: staffProfile.id,
        therapistName: staffName,
        centerId: form.centerId,
        centerName: center?.centerName || null,
        roomId: form.roomId || null,
        roomName: room ? room.roomName : 'Any room',
        active: true,
      })
      await load()
    } catch (err) {
      setError(err.message || 'Failed to create link')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopy = async (link) => {
    const url = buildPublicUrl(link.token)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(link.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  const handleDeactivate = async (link) => {
    try {
      await staffBookingLinkAPI.deactivate(link.id)
      await load()
    } catch (err) {
      setError(err.message || 'Failed to deactivate')
    }
  }

  if (!isUser && !isAdmin) {
    return (
      <EmptyState
        title="Access denied"
        description="Create Link is available for staff Users and Admins."
      />
    )
  }

  if (!staffProfile?.id) {
    return (
      <EmptyState
        icon={<Icons.Users />}
        title="Staff profile required"
        description="Ask an admin to add your email on the Staff page before creating booking links."
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="Create Link"
        subtitle="Generate a booking link for your customers based on your availability and room choice"
      />

      {error && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            background: 'rgba(239,68,68,0.1)',
            color: '#dc2626',
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle subtitle={`Therapist: ${staffName}`}>New booking link</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Select
              label="Center *"
              options={centerOptions}
              placeholder="Select center"
              value={form.centerId}
              onChange={(e) => setForm({ ...form, centerId: e.target.value, roomId: '' })}
            />
            <Select
              label="Room"
              options={roomOptions}
              value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            />
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '0.8125rem', color: 'var(--ui-text-muted)' }}>
            Choose <strong>Any room</strong> if the room does not matter — customers will book any free room at the center,
            still blocked when you (the therapist) are already booked.
          </p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCreate} loading={isCreating} icon={<Icons.Plus />}>
              Create link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card padding={false}>
        <CardHeader>
          <CardTitle subtitle={`${links.length} link(s)`}>Your links</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState text="Loading links..." />
          ) : links.length === 0 ? (
            <EmptyState title="No links yet" description="Create a link to share with customers" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Center</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <Badge variant={link.active ? 'success' : 'neutral'}>
                        {link.active ? 'Active' : 'Off'}
                      </Badge>
                    </TableCell>
                    <TableCell>{link.centerName || '-'}</TableCell>
                    <TableCell>{link.roomName || 'Any room'}</TableCell>
                    <TableCell style={{ fontSize: '0.75rem', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {buildPublicUrl(link.token)}
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Button variant="secondary" size="small" onClick={() => handleCopy(link)}>
                          {copiedId === link.id ? 'Copied' : 'Copy'}
                        </Button>
                        {link.active && (
                          <Button variant="ghost" size="small" onClick={() => handleDeactivate(link)}>
                            Deactivate
                          </Button>
                        )}
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

export default CreateLink

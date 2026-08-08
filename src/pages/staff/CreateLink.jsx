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
import { staffT as t } from '../../i18n/staffEs'

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
      setError(err.message || t.createLink.failedLoad)
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
    { value: '', label: t.createLink.anyRoomShort },
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
      setError(t.createLink.profileRequiredCreate)
      return
    }
    if (!form.centerId) {
      setError(t.createLink.selectCenterError)
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
      setError(err.message || t.createLink.failedCreate)
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
      window.prompt(t.createLink.copyPrompt, url)
    }
  }

  const handleDeactivate = async (link) => {
    try {
      await staffBookingLinkAPI.deactivate(link.id)
      await load()
    } catch (err) {
      setError(err.message || t.createLink.failedDeactivate)
    }
  }

  const displayRoomName = (roomName) => {
    if (!roomName || roomName === 'Any room') return t.createLink.anyRoomShort
    return roomName
  }

  if (!isUser && !isAdmin) {
    return (
      <EmptyState
        title={t.common.accessDenied}
        description={t.createLink.accessDeniedDesc}
      />
    )
  }

  if (!staffProfile?.id) {
    return (
      <EmptyState
        icon={<Icons.Users />}
        title={t.todo.profileRequired}
        description={t.createLink.profileRequiredDesc}
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={t.createLink.title}
        subtitle={t.createLink.subtitleLong}
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
          <CardTitle subtitle={`${t.createLink.therapistLabel}: ${staffName}`}>
            {t.createLink.newBookingLink}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Select
              label={t.createLink.centerRequired}
              options={centerOptions}
              placeholder={t.createLink.selectCenter}
              value={form.centerId}
              onChange={(e) => setForm({ ...form, centerId: e.target.value, roomId: '' })}
            />
            <Select
              label={t.common.room}
              options={roomOptions}
              value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            />
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '0.8125rem', color: 'var(--ui-text-muted)' }}>
            {t.createLink.hintAnyRoom}
          </p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCreate} loading={isCreating} icon={<Icons.Plus />}>
              {t.createLink.title}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card padding={false}>
        <CardHeader>
          <CardTitle subtitle={`${links.length} ${t.createLink.linksCount}`}>
            {t.createLink.yourLinks}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState text={t.createLink.loading} />
          ) : links.length === 0 ? (
            <EmptyState title={t.createLink.noLinks} description={t.createLink.noLinksDesc} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead>{t.common.center}</TableHead>
                  <TableHead>{t.common.room}</TableHead>
                  <TableHead>{t.common.link}</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <Badge variant={link.active ? 'success' : 'neutral'}>
                        {link.active ? t.createLink.active : t.createLink.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>{link.centerName || '-'}</TableCell>
                    <TableCell>{displayRoomName(link.roomName)}</TableCell>
                    <TableCell style={{ fontSize: '0.75rem', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {buildPublicUrl(link.token)}
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Button variant="secondary" size="small" onClick={() => handleCopy(link)}>
                          {copiedId === link.id ? t.createLink.copied : t.createLink.copy}
                        </Button>
                        {link.active && (
                          <Button variant="ghost" size="small" onClick={() => handleDeactivate(link)}>
                            {t.createLink.deactivate}
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

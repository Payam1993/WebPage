import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  PageHeader,
  Icons,
  EmptyState,
  LoadingState,
  ConfirmDialog,
  Badge,
} from '../../components/admin/ui'
import {
  websiteImageAPI,
  websiteHomeImageAPI,
  websiteServiceImageAPI,
  websiteGalleryImageAPI,
} from '../../services/dataService'
import { servicesData, serviceTranslations } from '../../data/services'
import {
  WEBSITE_HOME_CONTENT_SLOTS,
  WEBSITE_LOGO_SLOT,
} from '../../utils/websiteImages'
import { useAuth } from '../../context/AuthContext'
import './WebsiteContent.css'

const Thumb = ({ imageKey, fallback, alt = '' }) => {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    let cancelled = false
    if (!imageKey) {
      setUrl(fallback || null)
      return undefined
    }
    websiteImageAPI
      .getUrl(imageKey)
      .then((resolved) => {
        if (!cancelled) setUrl(resolved || fallback || null)
      })
      .catch((err) => {
        console.error('[WebsiteContent] thumb getUrl failed', imageKey, err)
        if (!cancelled) setUrl(fallback || null)
      })
    return () => {
      cancelled = true
    }
  }, [imageKey, fallback])

  if (!url) {
    return <div className="wc-thumb wc-thumb-empty">No image</div>
  }
  return (
    <img
      className="wc-thumb"
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => {
        console.error('[WebsiteContent] thumb <img> failed to load', { imageKey, url })
      }}
    />
  )
}

/**
 * Website Content — Admin_Confession only (also behind AdminProtectedRoute).
 * Uses the same AuthContext session as the rest of Administration / Staff portal.
 * Do not introduce a separate auth check that races AuthProvider boot.
 */
const WebsiteContent = () => {
  const { isAdmin, isLoading: authLoading, groups, user } = useAuth()
  const [tab, setTab] = useState('home') // home | services | gallery
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyKey, setBusyKey] = useState(null)

  const [homeRows, setHomeRows] = useState([])
  const [serviceRows, setServiceRows] = useState([])
  const [galleryRows, setGalleryRows] = useState([])

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, kind: null, item: null })
  const fileRefs = useRef({})

  const loadAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [home, services, gallery] = await Promise.all([
        websiteHomeImageAPI.list(),
        websiteServiceImageAPI.list(),
        websiteGalleryImageAPI.list(),
      ])
      setHomeRows(home || [])
      setServiceRows(services || [])
      setGalleryRows(gallery || [])
    } catch (err) {
      console.error('[WebsiteContent] load failed', {
        message: err?.message,
        name: err?.name,
        groups,
        hasUser: !!user,
      })
      setError(err.message || 'Failed to load website content')
    } finally {
      setIsLoading(false)
    }
  }, [groups, user])

  useEffect(() => {
    // Match Reservations/Calendar: wait for AuthProvider before Data calls.
    // AdminProtectedRoute already verified Admin_Confession via JWT cognito:groups.
    if (authLoading) return
    if (!isAdmin) return
    loadAll()
  }, [authLoading, isAdmin, loadAll])

  if (authLoading) {
    return <LoadingState text="Checking authorization…" />
  }

  if (!isAdmin) {
    return (
      <EmptyState
        icon={<Icons.Users />}
        title="Access denied"
        description="Website Content is only available to Admin_Confession."
      />
    )
  }

  const homeBySlot = Object.fromEntries(homeRows.map((r) => [r.slot, r]))
  const serviceById = Object.fromEntries(serviceRows.map((r) => [r.serviceId, r]))

  const runBusy = async (key, fn) => {
    setBusyKey(key)
    setError(null)
    try {
      await fn()
      await loadAll()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Action failed')
    } finally {
      setBusyKey(null)
    }
  }

  const pickFile = (key) => {
    const input = fileRefs.current[key]
    if (input) {
      input.value = ''
      input.click()
    }
  }

  const onHomeFile = (slot, file) => {
    if (!file) return
    runBusy(`home-${slot}`, async () => {
      const key =
        slot === WEBSITE_LOGO_SLOT.id
          ? await websiteImageAPI.uploadHomeLogo(file)
          : await websiteImageAPI.uploadHome(file)
      await websiteHomeImageAPI.save(slot, key)
    })
  }

  const onServiceFile = (serviceId, file) => {
    if (!file) return
    runBusy(`svc-${serviceId}`, async () => {
      const key = await websiteImageAPI.uploadService(file)
      await websiteServiceImageAPI.save(serviceId, key)
    })
  }

  const onGalleryFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    runBusy('gallery-upload', async () => {
      let nextOrder =
        galleryRows.reduce((max, r) => Math.max(max, r.sortOrder ?? 0), -1) + 1
      for (const file of files) {
        const key = await websiteImageAPI.uploadGallery(file)
        await websiteGalleryImageAPI.create(key, nextOrder)
        nextOrder += 1
      }
    })
  }

  const moveGallery = (index, direction) => {
    const next = [...galleryRows]
    const j = index + direction
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    runBusy('gallery-reorder', async () => {
      await websiteGalleryImageAPI.reorder(next.map((r) => r.id))
    })
  }

  const confirmDelete = async () => {
    const { kind, item } = deleteConfirm
    setDeleteConfirm({ open: false, kind: null, item: null })
    if (!kind || !item) return
    if (kind === 'home') {
      await runBusy(`home-${item.slot}`, () => websiteHomeImageAPI.clear(item.slot))
    } else if (kind === 'service') {
      await runBusy(`svc-${item.serviceId}`, () =>
        websiteServiceImageAPI.clear(item.serviceId)
      )
    } else if (kind === 'gallery') {
      await runBusy(`gal-${item.id}`, () => websiteGalleryImageAPI.delete(item))
    }
  }

  return (
    <div className="website-content">
      <PageHeader
        title="Website Content"
        subtitle="Manage homepage, service, and gallery images (Amplify Storage)"
        actions={
          <Button variant="secondary" size="small" onClick={loadAll} loading={isLoading}>
            Refresh
          </Button>
        }
      />

      {error && (
        <div className="wc-error">{error}</div>
      )}

      <div className="wc-tabs">
        {[
          { id: 'home', label: 'Homepage' },
          { id: 'services', label: 'Services' },
          { id: 'gallery', label: 'Gallery' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`wc-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState text="Loading website content…" />
      ) : (
        <>
          {tab === 'home' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle subtitle="Shown in the public entrance loader. Animation timing is unchanged — only the image source is managed here.">
                    Logo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const slot = WEBSITE_LOGO_SLOT
                    const row = homeBySlot[slot.id]
                    const inputKey = `home-${slot.id}`
                    return (
                      <div className="wc-list">
                        <div className="wc-row">
                          <Thumb
                            imageKey={row?.imageKey}
                            fallback={null}
                            alt={slot.label}
                          />
                          <div className="wc-row-meta">
                            <div className="wc-row-title">{slot.label}</div>
                            <div className="wc-row-sub">
                              Slot: <code>{slot.id}</code>
                              {row?.imageKey ? (
                                <>
                                  {' '}
                                  · <code className="wc-key">{row.imageKey}</code>
                                </>
                              ) : (
                                ' · using built-in animated SVG until you upload'
                              )}
                            </div>
                          </div>
                          <div className="wc-row-actions">
                            <input
                              ref={(el) => {
                                fileRefs.current[inputKey] = el
                              }}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              hidden
                              onChange={(e) =>
                                onHomeFile(slot.id, e.target.files?.[0])
                              }
                            />
                            <Button
                              size="small"
                              loading={busyKey === inputKey}
                              onClick={() => pickFile(inputKey)}
                            >
                              {row ? 'Replace Logo' : 'Upload Logo'}
                            </Button>
                            {row && (
                              <Button
                                size="small"
                                variant="danger"
                                onClick={() =>
                                  setDeleteConfirm({
                                    open: true,
                                    kind: 'home',
                                    item: { slot: slot.id },
                                  })
                                }
                              >
                                Remove Logo
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle subtitle="Named slots used on the public homepage">
                    Homepage image slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="wc-list">
                    {WEBSITE_HOME_CONTENT_SLOTS.map((slot) => {
                      const row = homeBySlot[slot.id]
                      const inputKey = `home-${slot.id}`
                      return (
                        <div key={slot.id} className="wc-row">
                          <Thumb
                            imageKey={row?.imageKey}
                            fallback={slot.fallback}
                            alt={slot.label}
                          />
                          <div className="wc-row-meta">
                            <div className="wc-row-title">{slot.label}</div>
                            <div className="wc-row-sub">
                              Slot: <code>{slot.id}</code>
                              {row?.imageKey ? (
                                <>
                                  {' '}
                                  · <code className="wc-key">{row.imageKey}</code>
                                </>
                              ) : (
                                ' · using fallback until you upload'
                              )}
                            </div>
                          </div>
                          <div className="wc-row-actions">
                            <input
                              ref={(el) => {
                                fileRefs.current[inputKey] = el
                              }}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              hidden
                              onChange={(e) =>
                                onHomeFile(slot.id, e.target.files?.[0])
                              }
                            />
                            <Button
                              size="small"
                              loading={busyKey === inputKey}
                              onClick={() => pickFile(inputKey)}
                            >
                              {row ? 'Replace' : 'Upload'}
                            </Button>
                            {row && (
                              <Button
                                size="small"
                                variant="danger"
                                onClick={() =>
                                  setDeleteConfirm({
                                    open: true,
                                    kind: 'home',
                                    item: { slot: slot.id },
                                  })
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === 'services' && (
            <Card>
              <CardHeader>
                <CardTitle subtitle="Linked by service id from the public services catalog">
                  Service images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="wc-list">
                  {servicesData.map((svc) => {
                    const row = serviceById[svc.id]
                    const name =
                      serviceTranslations.es?.[svc.id]?.name ||
                      serviceTranslations.en?.[svc.id]?.name ||
                      svc.id
                    const inputKey = `svc-${svc.id}`
                    return (
                      <div key={svc.id} className="wc-row">
                        <Thumb
                          imageKey={row?.imageKey}
                          fallback={svc.image}
                          alt={name}
                        />
                        <div className="wc-row-meta">
                          <div className="wc-row-title">{name}</div>
                          <div className="wc-row-sub">
                            serviceId: <code>{svc.id}</code>
                            {row?.imageKey ? (
                              <>
                                {' '}
                                · <code className="wc-key">{row.imageKey}</code>
                              </>
                            ) : (
                              ' · fallback Unsplash until upload'
                            )}
                          </div>
                        </div>
                        <div className="wc-row-actions">
                          <input
                            ref={(el) => {
                              fileRefs.current[inputKey] = el
                            }}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            hidden
                            onChange={(e) => onServiceFile(svc.id, e.target.files?.[0])}
                          />
                          <Button
                            size="small"
                            loading={busyKey === inputKey}
                            onClick={() => pickFile(inputKey)}
                          >
                            {row ? 'Replace' : 'Upload'}
                          </Button>
                          {row && (
                            <Button
                              size="small"
                              variant="danger"
                              onClick={() =>
                                setDeleteConfirm({
                                  open: true,
                                  kind: 'service',
                                  item: { serviceId: svc.id },
                                })
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {tab === 'gallery' && (
            <Card>
              <CardHeader>
                <CardTitle subtitle="Order is stored in DynamoDB (sortOrder), not filenames">
                  Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="wc-gallery-toolbar">
                  <input
                    ref={(el) => {
                      fileRefs.current['gallery-multi'] = el
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    hidden
                    onChange={(e) => onGalleryFiles(e.target.files)}
                  />
                  <Button
                    loading={busyKey === 'gallery-upload'}
                    onClick={() => pickFile('gallery-multi')}
                  >
                    Upload images
                  </Button>
                </div>

                {galleryRows.length === 0 ? (
                  <EmptyState
                    title="No gallery images"
                    description="Upload one or more photos for the public Gallery section"
                  />
                ) : (
                  <div className="wc-list">
                    {galleryRows.map((item, index) => (
                      <div key={item.id} className="wc-row">
                        <Thumb imageKey={item.imageKey} alt={`Gallery ${index + 1}`} />
                        <div className="wc-row-meta">
                          <div className="wc-row-title">
                            Position {index + 1}
                            {index === 0 && (
                              <Badge variant="info" size="small" style={{ marginLeft: 8 }}>
                                First
                              </Badge>
                            )}
                            {item.active === false && (
                              <Badge variant="neutral" size="small" style={{ marginLeft: 8 }}>
                                Hidden
                              </Badge>
                            )}
                          </div>
                          <div className="wc-row-sub">
                            <code className="wc-key">{item.imageKey}</code>
                          </div>
                        </div>
                        <div className="wc-row-actions">
                          <Button
                            size="small"
                            variant="secondary"
                            disabled={index === 0 || busyKey === 'gallery-reorder'}
                            onClick={() => moveGallery(index, -1)}
                          >
                            ↑
                          </Button>
                          <Button
                            size="small"
                            variant="secondary"
                            disabled={
                              index === galleryRows.length - 1 ||
                              busyKey === 'gallery-reorder'
                            }
                            onClick={() => moveGallery(index, 1)}
                          >
                            ↓
                          </Button>
                          <Button
                            size="small"
                            variant="secondary"
                            loading={busyKey === `gal-toggle-${item.id}`}
                            onClick={() =>
                              runBusy(`gal-toggle-${item.id}`, () =>
                                websiteGalleryImageAPI.update(item.id, {
                                  active: item.active === false,
                                })
                              )
                            }
                          >
                            {item.active === false ? 'Enable' : 'Disable'}
                          </Button>
                          <Button
                            size="small"
                            variant="danger"
                            onClick={() =>
                              setDeleteConfirm({ open: true, kind: 'gallery', item })
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, kind: null, item: null })}
        onConfirm={confirmDelete}
        title="Remove image"
        message="Remove this image from the website? The file will be deleted from storage when possible."
        confirmText="Remove"
      />
    </div>
  )
}

export default WebsiteContent

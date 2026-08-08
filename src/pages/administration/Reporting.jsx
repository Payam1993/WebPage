import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
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
  Icons,
  EmptyState,
  LoadingState,
} from '../../components/admin/ui'
import {
  bookingAPI,
  dailyCostAPI,
  businessKpiAPI,
  getBookingLocalPayment,
  getBookingTotalPayment,
  getTodayDate,
  getDateFromToday,
  formatDisplayDate,
} from '../../services/dataService'

const formatEuro = (n) =>
  `€${Number(n || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/**
 * Reporting — live admin analytics from costs + local payments
 */
const Reporting = () => {
  const [fromDate, setFromDate] = useState(getDateFromToday(-30))
  const [toDate, setToDate] = useState(getTodayDate())
  const [applied, setApplied] = useState({
    fromDate: getDateFromToday(-30),
    toDate: getTodayDate(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookings, setBookings] = useState([])
  const [costs, setCosts] = useState([])
  const [kpi, setKpi] = useState(null)

  const loadReport = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [bookingsData, costsData, kpiData] = await Promise.all([
        bookingAPI.list(applied.fromDate, applied.toDate),
        dailyCostAPI.list(applied.fromDate, applied.toDate),
        businessKpiAPI.get().catch(() => null),
      ])
      setBookings(bookingsData || [])
      setCosts(costsData || [])
      setKpi(kpiData)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error al cargar el informe')
    } finally {
      setIsLoading(false)
    }
  }, [applied.fromDate, applied.toDate])

  useEffect(() => {
    loadReport()
  }, [loadReport])

  const handleGenerate = () => {
    setApplied({ fromDate, toDate })
  }

  const summary = useMemo(() => {
    const activeBookings = (bookings || []).filter((b) => b.status !== 'Canceled')
    const ingresosLocal = activeBookings.reduce((sum, b) => sum + getBookingLocalPayment(b), 0)
    const ingresosTotal = activeBookings.reduce((sum, b) => {
      const total = getBookingTotalPayment(b)
      return sum + (total != null ? Number(total) : 0)
    }, 0)
    const totalCosts = (costs || []).reduce((sum, c) => sum + (Number(c.price) || 0), 0)
    const net = ingresosLocal - totalCosts
    return {
      ingresosLocal,
      ingresosTotal,
      totalCosts,
      net,
      bookingCount: activeBookings.length,
      costCount: (costs || []).length,
    }
  }, [bookings, costs])

  const costsByCategory = useMemo(() => {
    const map = new Map()
    for (const c of costs || []) {
      const key = c.costName || 'Sin categoría'
      const prev = map.get(key) || { name: key, count: 0, total: 0 }
      prev.count += 1
      prev.total += Number(c.price) || 0
      map.set(key, prev)
    }
    const rows = [...map.values()].sort((a, b) => b.total - a.total)
    const grand = rows.reduce((s, r) => s + r.total, 0) || 1
    return rows.map((r) => ({
      ...r,
      pct: (r.total / grand) * 100,
    }))
  }, [costs])

  const localByDay = useMemo(() => {
    const map = new Map()
    for (const b of bookings || []) {
      if (b.status === 'Canceled') continue
      const day = b.date
      const prev = map.get(day) || { date: day, count: 0, local: 0, total: 0 }
      prev.count += 1
      prev.local += getBookingLocalPayment(b)
      const tot = getBookingTotalPayment(b)
      if (tot != null) prev.total += Number(tot)
      map.set(day, prev)
    }
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date))
  }, [bookings])

  const dailyTarget = kpi?.dailyTargetKpi != null ? Number(kpi.dailyTargetKpi) : null
  const dailySafe = kpi?.dailySafeKpi != null ? Number(kpi.dailySafeKpi) : null

  return (
    <div>
      <PageHeader
        title="Informes"
        subtitle="Ingresos por pagos locales y costes confirmados"
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              containerClassName="ui-mb-0"
              style={{ width: '150px' }}
            />
            <span style={{ color: 'var(--ui-text-muted)' }}>a</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              containerClassName="ui-mb-0"
              style={{ width: '150px' }}
            />
            <Button onClick={handleGenerate} loading={isLoading}>
              Generar informe
            </Button>
          </div>
        }
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

      {isLoading ? (
        <LoadingState text="Cargando informe…" />
      ) : (
        <>
          <Grid cols={4} gap="default" style={{ marginBottom: 24 }}>
            <StatCard
              title="Ingresos locales"
              value={formatEuro(summary.ingresosLocal)}
              icon={<Icons.TrendingUp />}
              subtitle={`${summary.bookingCount} reservas · pagos locales`}
            />
            <StatCard
              title="Pago total clientes"
              value={formatEuro(summary.ingresosTotal)}
              icon={<Icons.DollarSign />}
              subtitle="Suma de pagos totales (si se informaron)"
            />
            <StatCard
              title="Costes"
              value={formatEuro(summary.totalCosts)}
              icon={<Icons.FileText />}
              subtitle={`${summary.costCount} costes confirmados`}
            />
            <StatCard
              title="Resultado neto"
              value={formatEuro(summary.net)}
              icon={<Icons.Star />}
              subtitle="Ingresos locales − costes"
            />
          </Grid>

          <Grid cols={2} gap="default" style={{ marginBottom: 24 }}>
            <Card>
              <CardHeader>
                <CardTitle subtitle="Definidos en Configuración local">KPI diarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)', marginBottom: 4 }}>
                      Daily target KPI
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                      {dailyTarget != null ? formatEuro(dailyTarget) : '—'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)', marginTop: 4 }}>
                      Objetivo de pago local del día
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)', marginBottom: 4 }}>
                      Daily safe KPI
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                      {dailySafe != null ? formatEuro(dailySafe) : '—'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)', marginTop: 4 }}>
                      Mínimo para cubrir costes
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle subtitle={`${formatDisplayDate(applied.fromDate)} → ${formatDisplayDate(applied.toDate)}`}>
                  Periodo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ margin: 0, color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>
                  Los costes incluyen los confirmados por Admin / Mini Admin. Los ingresos locales
                  suman el <strong>pago local</strong> de cada reserva (no cancelada).
                </p>
              </CardContent>
            </Card>
          </Grid>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <Card padding={false}>
              <CardHeader>
                <CardTitle subtitle="Pagos locales por día">Por día</CardTitle>
              </CardHeader>
              <CardContent>
                {localByDay.length === 0 ? (
                  <EmptyState title="Sin reservas" description="No hay pagos locales en este periodo" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>Reservas</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>Pago local</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>vs KPI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localByDay.map((row) => {
                        const vsSafe =
                          dailySafe != null
                            ? row.local >= dailySafe
                              ? 'Seguro'
                              : 'Bajo safe'
                            : '—'
                        const vsTarget =
                          dailyTarget != null
                            ? row.local >= dailyTarget
                              ? ' · Objetivo OK'
                              : ' · Bajo target'
                            : ''
                        return (
                          <TableRow key={row.date}>
                            <TableCell>{formatDisplayDate(row.date)}</TableCell>
                            <TableCell style={{ textAlign: 'right' }}>{row.count}</TableCell>
                            <TableCell style={{ textAlign: 'right', fontWeight: 500 }}>
                              {formatEuro(row.local)}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right', fontSize: '0.8125rem' }}>
                              {vsSafe}
                              {vsTarget}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card padding={false}>
              <CardHeader>
                <CardTitle subtitle="Costes confirmados por categoría">Por tipo de coste</CardTitle>
              </CardHeader>
              <CardContent>
                {costsByCategory.length === 0 ? (
                  <EmptyState title="Sin costes" description="No hay costes confirmados en este periodo" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoría</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>Cantidad</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>Total</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>% costes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costsByCategory.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell>
                            <span style={{ fontWeight: 500 }}>{row.name}</span>
                          </TableCell>
                          <TableCell style={{ textAlign: 'right' }}>{row.count}</TableCell>
                          <TableCell style={{ textAlign: 'right' }}>{formatEuro(row.total)}</TableCell>
                          <TableCell style={{ textAlign: 'right' }}>{row.pct.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default Reporting

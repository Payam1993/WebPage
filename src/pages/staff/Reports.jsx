import { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  StatCard,
  PageHeader,
  Grid,
  Icons,
  LoadingState,
} from '../../components/admin/ui'
import { bookingAPI, getDateFromToday } from '../../services/dataService'

/**
 * Simple Line Chart Component for Reservations
 */
const ReservationsLineChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingState text="Loading chart data..." />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ui-text-muted)' }}>
        No reservation data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.count), 1)
  const chartHeight = 250
  const chartWidth = 800
  const padding = { top: 20, right: 30, bottom: 50, left: 50 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * innerWidth
    const y = padding.top + innerHeight - (d.count / maxValue) * innerHeight
    return { x, y, ...d }
  })

  // Create SVG path for the line
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  // Create area path (filled area under the line)
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || padding.left} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`

  // Y-axis ticks
  const yTicks = [0, Math.ceil(maxValue / 4), Math.ceil(maxValue / 2), Math.ceil(maxValue * 3 / 4), maxValue]

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', minWidth: '500px', height: '300px' }}>
        {/* Grid lines */}
        {yTicks.map((tick, i) => {
          const y = padding.top + innerHeight - (tick / maxValue) * innerHeight
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="var(--ui-border-light)"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--ui-text-muted)"
              >
                {tick}
              </text>
            </g>
          )
        })}

        {/* Area under the line */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          opacity="0.3"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--ui-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--ui-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--ui-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill="white"
              stroke="var(--ui-primary)"
              strokeWidth="3"
              style={{ cursor: 'pointer' }}
            />
            {/* X-axis labels */}
            <text
              x={p.x}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize="10"
              fill="var(--ui-text-muted)"
              style={{ fontWeight: 500 }}
            >
              {p.label}
            </text>
            {/* Value label on hover area */}
            <title>{`${p.fullDate}: ${p.count} reservations`}</title>
          </g>
        ))}

        {/* Y-axis label */}
        <text
          x={15}
          y={chartHeight / 2}
          textAnchor="middle"
          fontSize="11"
          fill="var(--ui-text-muted)"
          transform={`rotate(-90, 15, ${chartHeight / 2})`}
        >
          Reservations
        </text>
      </svg>
    </div>
  )
}

/**
 * Reports - Dashboard overview with stats and recent activity
 */
const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load bookings data
  useEffect(() => {
    loadBookingsData()
  }, [selectedPeriod])

  const loadBookingsData = async () => {
    setIsLoading(true)
    try {
      // Calculate date range based on selected period
      let fromDate, toDate
      const today = new Date().toISOString().split('T')[0]
      
      switch (selectedPeriod) {
        case 'today':
          fromDate = today
          toDate = today
          break
        case 'week':
          fromDate = getDateFromToday(-6)
          toDate = today
          break
        case 'month':
          fromDate = getDateFromToday(-29)
          toDate = today
          break
        case 'year':
          fromDate = getDateFromToday(-364)
          toDate = today
          break
        default:
          fromDate = getDateFromToday(-6)
          toDate = today
      }

      const data = await bookingAPI.list(fromDate, toDate)
      setBookings(data)
    } catch (err) {
      console.error('Error loading bookings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate chart data - group bookings by date
  const chartData = useMemo(() => {
    if (!bookings.length) return []

    // Group by date
    const countsByDate = {}
    bookings.forEach(booking => {
      if (booking.date) {
        countsByDate[booking.date] = (countsByDate[booking.date] || 0) + 1
      }
    })

    // Get date range for display
    let days = 7
    switch (selectedPeriod) {
      case 'today': days = 1; break
      case 'week': days = 7; break
      case 'month': days = 30; break
      case 'year': days = 12; break // Show monthly for year view
    }

    if (selectedPeriod === 'year') {
      // Group by month for year view
      const monthCounts = {}
      bookings.forEach(booking => {
        if (booking.date) {
          const month = booking.date.substring(0, 7) // YYYY-MM
          monthCounts[month] = (monthCounts[month] || 0) + 1
        }
      })

      // Generate last 12 months
      const result = []
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = date.toISOString().substring(0, 7)
        const monthLabel = date.toLocaleDateString('en-US', { month: 'short' })
        result.push({
          date: monthKey,
          label: monthLabel,
          fullDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          count: monthCounts[monthKey] || 0
        })
      }
      return result
    }

    // Generate data for each day in the range
    const result = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
      result.push({
        date: dateStr,
        label: days <= 7 ? dayLabel : date.getDate().toString(),
        fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        count: countsByDate[dateStr] || 0
      })
    }
    return result
  }, [bookings, selectedPeriod])

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalBookings = bookings.length
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length
    const completedBookings = bookings.filter(b => b.status === 'Done').length
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.priceAgreement || 0), 0)

    return [
      { 
        title: 'Total Bookings', 
        value: totalBookings.toString(), 
        icon: <Icons.Calendar />,
        subtitle: `${selectedPeriod === 'today' ? 'Today' : `Last ${selectedPeriod}`}`
      },
      { 
        title: 'Pending', 
        value: pendingBookings.toString(), 
        icon: <Icons.Clock />,
        subtitle: 'Awaiting completion'
      },
      { 
        title: 'Completed', 
        value: completedBookings.toString(), 
        icon: <Icons.Check />,
        subtitle: 'Successfully done'
      },
      { 
        title: 'Revenue', 
        value: `€${totalRevenue.toFixed(0)}`, 
        icon: <Icons.DollarSign />,
        subtitle: 'Total earnings'
      },
    ]
  }, [bookings, selectedPeriod])

  return (
    <div>
      <PageHeader 
        title="Dashboard"
        subtitle="Overview of your business performance and recent activity"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            {['today', 'week', 'month', 'year'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setSelectedPeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
        }
      />

      {/* Stats Grid */}
      <Grid cols={4} gap="default" style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            subtitle={stat.subtitle}
          />
        ))}
      </Grid>

      {/* Reservations Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle subtitle={`Number of reservations ${selectedPeriod === 'today' ? 'today' : `over the last ${selectedPeriod}`}`}>
            Reservations Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationsLineChart data={chartData} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>Staff Benefit (40%)</span>
                <span style={{ fontWeight: 500 }}>€4,980</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>Local Benefit (60%)</span>
                <span style={{ fontWeight: 500 }}>€7,470</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--ui-border-light)' }}>
                <span style={{ fontWeight: 500 }}>Total Revenue</span>
                <span style={{ fontWeight: 600, color: 'var(--ui-success)' }}>€12,450</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Deep Tissue', count: 45, percent: 31 },
                { name: 'Swedish', count: 38, percent: 26 },
                { name: 'Hot Stone', count: 29, percent: 20 },
              ].map((service, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.875rem' }}>{service.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ui-text-muted)' }}>{service.count}</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--ui-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${service.percent}%`, background: 'var(--ui-primary)', borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>Revenue</span>
                <span style={{ fontWeight: 500, color: 'var(--ui-success)' }}>+€12,450</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>Costs</span>
                <span style={{ fontWeight: 500, color: 'var(--ui-danger)' }}>-€1,104.50</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--ui-border-light)' }}>
                <span style={{ fontWeight: 500 }}>Net Profit</span>
                <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--ui-success)' }}>€11,345.50</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Reports

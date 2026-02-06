import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
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
} from '../../components/admin/ui'

/**
 * Reporting - Admin reporting page with date range controls and summary data
 */
const Reporting = () => {
  return (
    <div>
      <PageHeader 
        title="Reporting"
        subtitle="View comprehensive reports and analytics"
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Input
              type="date"
              defaultValue="2026-01-01"
              containerClassName="ui-mb-0"
              style={{ width: '150px' }}
            />
            <span style={{ color: 'var(--ui-text-muted)' }}>to</span>
            <Input
              type="date"
              defaultValue="2026-01-31"
              containerClassName="ui-mb-0"
              style={{ width: '150px' }}
            />
            <Button>Generate Report</Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <Grid cols={5} gap="default" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Total Revenue"
          value="€48,750"
          icon={<Icons.DollarSign />}
          trend="+12%"
          trendDirection="up"
        />
        <StatCard
          title="Staff Benefit"
          value="€19,500"
          icon={<Icons.Users />}
          subtitle="40% of revenue"
        />
        <StatCard
          title="Local Benefit"
          value="€29,250"
          icon={<Icons.TrendingUp />}
          subtitle="60% of revenue"
        />
        <StatCard
          title="Total Costs"
          value="€4,250"
          icon={<Icons.FileText />}
          trend="-5%"
          trendDirection="down"
        />
        <StatCard
          title="Net Profit"
          value="€44,500"
          icon={<Icons.Star />}
          trend="+15%"
          trendDirection="up"
        />
      </Grid>

      {/* Breakdown Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* By Staff */}
        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle="Revenue breakdown by staff member">
              By Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Services</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Revenue</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Benefit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><span style={{ fontWeight: 500 }}>Luciana</span></TableCell>
                  <TableCell style={{ textAlign: 'right' }}>78</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>€26,520</TableCell>
                  <TableCell style={{ textAlign: 'right', color: 'var(--ui-success)' }}>€10,608</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><span style={{ fontWeight: 500 }}>Sadey</span></TableCell>
                  <TableCell style={{ textAlign: 'right' }}>65</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>€22,230</TableCell>
                  <TableCell style={{ textAlign: 'right', color: 'var(--ui-success)' }}>€8,892</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* By Service */}
        <Card padding={false}>
          <CardHeader>
            <CardTitle subtitle="Revenue breakdown by service type">
              By Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Count</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><span style={{ fontWeight: 500 }}>Deep Tissue Massage</span></TableCell>
                  <TableCell style={{ textAlign: 'right' }}>45</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>€15,300</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><span style={{ fontWeight: 500 }}>Swedish Massage</span></TableCell>
                  <TableCell style={{ textAlign: 'right' }}>38</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>€11,400</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><span style={{ fontWeight: 500 }}>Hot Stone Therapy</span></TableCell>
                  <TableCell style={{ textAlign: 'right' }}>32</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>€12,800</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><span style={{ fontWeight: 500 }}>Couples Massage</span></TableCell>
                  <TableCell style={{ textAlign: 'right' }}>28</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>€9,250</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* By Cost Type */}
      <Card padding={false}>
        <CardHeader
          actions={
            <Button variant="ghost" size="small">
              Export CSV
            </Button>
          }
        >
          <CardTitle subtitle="Expense breakdown by category">
            By Cost Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Count</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Total Amount</TableHead>
                <TableHead style={{ textAlign: 'right' }}>% of Costs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><Badge variant="info">Supplies</Badge></TableCell>
                <TableCell style={{ textAlign: 'right' }}>24</TableCell>
                <TableCell style={{ textAlign: 'right' }}>€1,450</TableCell>
                <TableCell style={{ textAlign: 'right' }}>34.1%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="warning">Utilities</Badge></TableCell>
                <TableCell style={{ textAlign: 'right' }}>4</TableCell>
                <TableCell style={{ textAlign: 'right' }}>€890</TableCell>
                <TableCell style={{ textAlign: 'right' }}>20.9%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="success">Staff</Badge></TableCell>
                <TableCell style={{ textAlign: 'right' }}>8</TableCell>
                <TableCell style={{ textAlign: 'right' }}>€720</TableCell>
                <TableCell style={{ textAlign: 'right' }}>16.9%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="danger">Maintenance</Badge></TableCell>
                <TableCell style={{ textAlign: 'right' }}>6</TableCell>
                <TableCell style={{ textAlign: 'right' }}>€650</TableCell>
                <TableCell style={{ textAlign: 'right' }}>15.3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="neutral">Marketing</Badge></TableCell>
                <TableCell style={{ textAlign: 'right' }}>12</TableCell>
                <TableCell style={{ textAlign: 'right' }}>€540</TableCell>
                <TableCell style={{ textAlign: 'right' }}>12.7%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reporting

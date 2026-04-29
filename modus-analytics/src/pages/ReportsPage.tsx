import { useState } from 'react'
import {
  ModusWcCard,
  ModusWcTypography,
  ModusWcIcon,
  ModusWcButton,
  ModusWcBadge,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import {
  CHART_TOOLTIP_STYLE,
  AXIS_STROKE,
  GRID_STROKE,
} from '../components/chartTokens'

const reportActivity = [
  { month: 'Oct', completed: 4, scheduled: 2, failed: 0 },
  { month: 'Nov', completed: 5, scheduled: 3, failed: 1 },
  { month: 'Dec', completed: 3, scheduled: 2, failed: 0 },
  { month: 'Jan', completed: 6, scheduled: 4, failed: 1 },
  { month: 'Feb', completed: 7, scheduled: 3, failed: 0 },
  { month: 'Mar', completed: 6, scheduled: 5, failed: 2 },
  { month: 'Apr', completed: 5, scheduled: 2, failed: 1 },
]

interface Report {
  id: string
  name: string
  type: string
  status: 'completed' | 'running' | 'scheduled' | 'failed'
  owner: string
  lastRun: string
  rows: string
}

const allReports: Report[] = [
  { id: 'R001', name: 'Monthly Traffic Summary', type: 'Traffic', status: 'completed', owner: 'Alex J.', lastRun: 'Apr 19, 2026', rows: '12,840' },
  { id: 'R002', name: 'Conversion Funnel Analysis', type: 'Conversion', status: 'completed', owner: 'Maria S.', lastRun: 'Apr 18, 2026', rows: '5,219' },
  { id: 'R003', name: 'SEO Keyword Performance', type: 'SEO', status: 'running', owner: 'Alex J.', lastRun: 'Apr 20, 2026', rows: '—' },
  { id: 'R004', name: 'Paid Campaign ROI', type: 'Ads', status: 'scheduled', owner: 'Tom W.', lastRun: 'Apr 17, 2026', rows: '3,450' },
  { id: 'R005', name: 'User Retention Cohorts', type: 'Retention', status: 'completed', owner: 'Maria S.', lastRun: 'Apr 15, 2026', rows: '28,100' },
  { id: 'R006', name: 'Mobile App Metrics', type: 'App', status: 'failed', owner: 'Lee C.', lastRun: 'Apr 14, 2026', rows: '—' },
  { id: 'R007', name: 'Email Campaign Open Rates', type: 'Email', status: 'completed', owner: 'Tom W.', lastRun: 'Apr 13, 2026', rows: '1,204' },
  { id: 'R008', name: 'Geographic Distribution', type: 'Traffic', status: 'scheduled', owner: 'Alex J.', lastRun: 'Apr 12, 2026', rows: '9,870' },
]

const statusColor: Record<Report['status'], 'success' | 'primary' | 'warning' | 'danger'> = {
  completed: 'success',
  running: 'primary',
  scheduled: 'warning',
  failed: 'danger',
}

export default function ReportsPage() {
  const [search, setSearch] = useState('')

  const filtered = allReports.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Page hero */}
      <section aria-label="Page header">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) max-content',
            width: '100%',
            minWidth: 0,
            alignItems: 'start',
            gap: '1rem',
          }}
        >
          <div className="flex flex-col gap-1">
            <ModusWcTypography hierarchy="h1" size="2xl" weight="bold" label="Reports" />
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
              label={`${allReports.length} reports — ${allReports.filter((r) => r.status === 'running').length} running`}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <ModusWcButton variant="filled" color="primary" size="sm">
              New Report
            </ModusWcButton>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Report statistics">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '0.75rem',
            alignItems: 'stretch',
          }}
        >
          {[
            { label: 'Total', value: allReports.length.toString(), icon: 'master_data', color: 'var(--modus-wc-color-primary)' },
            { label: 'Completed', value: allReports.filter((r) => r.status === 'completed').length.toString(), icon: 'check_circle', color: '#0e9f6e' },
            { label: 'Scheduled', value: allReports.filter((r) => r.status === 'scheduled').length.toString(), icon: 'calendar', color: '#e3a008' },
            { label: 'Failed', value: allReports.filter((r) => r.status === 'failed').length.toString(), icon: 'error', color: '#e02424' },
          ].map((stat) => (
            <ModusWcCard key={stat.label} bordered={false} padding="compact">
              <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
                <ModusWcIcon name={stat.icon} decorative />
                <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label={stat.label} />
              </div>
              <ModusWcTypography
                hierarchy="p"
                size="2xl"
                weight="bold"
                label={stat.value}
              />
            </ModusWcCard>
          ))}
        </div>
      </section>

      {/* Report activity line chart */}
      <section aria-label="Report activity trend">
        <ModusWcCard bordered={false} padding="compact">
          <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
            <ModusWcIcon name="bar_graph" decorative />
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Report Activity (6 months)" />
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportActivity} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="month"
                  stroke={AXIS_STROKE}
                  tick={{ fontSize: 11, fill: 'var(--modus-wc-color-base-content-low-contrast)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke={AXIS_STROKE}
                  tick={{ fontSize: 11, fill: 'var(--modus-wc-color-base-content-low-contrast)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--modus-wc-color-base-content)' }} />
                <ReferenceLine y={0} stroke={GRID_STROKE} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="var(--modus-wc-color-success)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--modus-wc-color-base-100)', stroke: 'var(--modus-wc-color-success)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="scheduled"
                  name="Scheduled"
                  stroke="var(--modus-wc-color-warning)"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ fill: 'var(--modus-wc-color-base-100)', stroke: 'var(--modus-wc-color-warning)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="failed"
                  name="Failed"
                  stroke="var(--modus-wc-color-error)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--modus-wc-color-base-100)', stroke: 'var(--modus-wc-color-error)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ModusWcCard>
      </section>

      {/* Reports table */}
      <section aria-label="Reports list">
        <ModusWcCard bordered={false} padding="compact">
          <div slot="title" className="flex w-full min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <ModusWcIcon name="master_data" decorative />
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="All Reports" />
            </div>
            <div style={{ width: '220px' }}>
              <ModusWcTextInput
                placeholder="Search reports…"
                value={search}
                size="sm"
                bordered={false}
                onInputChange={(e: CustomEvent) => {
                  setSearch(e.detail?.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem',
                color: 'var(--modus-wc-color-base-content)',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid var(--modus-wc-color-base-200)',
                    background: 'var(--modus-wc-color-base-200)',
                  }}
                >
                  {['ID', 'Name', 'Type', 'Status', 'Owner', 'Last Run', 'Rows', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--modus-wc-color-base-content-low-contrast)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                      No reports match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: '1px solid var(--modus-wc-color-base-200)',
                        background: i % 2 === 0 ? 'transparent' : 'var(--modus-wc-color-base-page)',
                      }}
                    >
                      <td style={{ padding: '0.625rem 0.75rem', color: 'var(--modus-wc-color-base-content-low-contrast)', whiteSpace: 'nowrap' }}>
                        {r.id}
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', fontWeight: 500 }}>{r.name}</td>
                      <td style={{ padding: '0.625rem 0.75rem', whiteSpace: 'nowrap' }}>
                        <ModusWcBadge color="tertiary" size="sm">{r.type}</ModusWcBadge>
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', whiteSpace: 'nowrap' }}>
                        <ModusWcBadge color={statusColor[r.status]} size="sm">
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </ModusWcBadge>
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', whiteSpace: 'nowrap' }}>{r.owner}</td>
                      <td style={{ padding: '0.625rem 0.75rem', whiteSpace: 'nowrap', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                        {r.lastRun}
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', textAlign: 'right', whiteSpace: 'nowrap' }}>{r.rows}</td>
                      <td style={{ padding: '0.625rem 0.75rem', whiteSpace: 'nowrap' }}>
                        <div className="flex items-center gap-1">
                          <ModusWcButton variant="borderless" color="tertiary" size="xs" shape="square" aria-label="Download report">
                            <ModusWcIcon name="download" decorative />
                          </ModusWcButton>
                          <ModusWcButton variant="borderless" color="tertiary" size="xs" shape="square" aria-label="More options">
                            <ModusWcIcon name="more_vertical" decorative />
                          </ModusWcButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div slot="footer" style={{ paddingInline: 'var(--modus-wc-spacing-md)', paddingTop: 'var(--modus-wc-spacing-md)', paddingBottom: 'var(--modus-wc-spacing-md)' }}>
            <ModusWcTypography
              hierarchy="p"
              size="xs"
              customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
              label={`Showing ${filtered.length} of ${allReports.length} reports`}
            />
          </div>
        </ModusWcCard>
      </section>
    </>
  )
}

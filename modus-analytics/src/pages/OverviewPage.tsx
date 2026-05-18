import {
  ModusWcCard,
  ModusWcTypography,
  ModusWcIcon,
  ModusWcBadge,
  ModusWcButton,
  ModusWcDivider,
} from '@trimble-oss/moduswebcomponents-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  CHART_COLORS,
  CHART_TOOLTIP_STYLE,
  AXIS_STROKE,
  GRID_STROKE,
} from '../components/chartTokens'

interface KpiCardProps {
  icon: string
  label: string
  value: string
  delta: string
  positive: boolean
  sparkData: number[]
}

function KpiCard({ icon, label, value, delta, positive, sparkData }: KpiCardProps) {
  const maxVal = Math.max(...sparkData)
  return (
    <ModusWcCard bordered={false} padding="compact">
      <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
        <ModusWcIcon name={icon} decorative size="md" />
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label={label} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-3">
          <ModusWcTypography
            hierarchy="p"
            size="3xl"
            weight="bold"
            label={value}
          />
          <ModusWcBadge
            size="sm"
            color={positive ? 'success' : 'danger'}
            aria-label={`${positive ? 'Up' : 'Down'} ${delta}`}
          >
            {positive ? '↑' : '↓'} {delta}
          </ModusWcBadge>
        </div>
        {/* Spark bars */}
        <div className="flex items-end gap-0.5 h-10 pt-1">
          {sparkData.map((v, i) => (
            <div
              key={i}
              className="spark-bar"
              style={{ height: `${Math.round((v / maxVal) * 100)}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <ModusWcTypography
          hierarchy="p"
          size="xs"
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
          label="vs. last 7 days"
        />
      </div>
    </ModusWcCard>
  )
}

interface ChannelRowProps {
  channel: string
  sessions: number
  pct: number
  color: string
}

function ChannelRow({ channel, sessions, pct, color }: ChannelRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <ModusWcTypography hierarchy="p" size="sm" label={channel} />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          weight="semibold"
          label={`${pct}%`}
        />
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${channel}: ${pct}%`}
        />
      </div>
      <ModusWcTypography
        hierarchy="p"
        size="xs"
        customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
        label={`${sessions.toLocaleString()} sessions`}
      />
    </div>
  )
}

// --- chart data ---
const sessionsTrend = [
  { day: 'Apr 7',  sessions: 2410, users: 1820 },
  { day: 'Apr 8',  sessions: 2850, users: 2100 },
  { day: 'Apr 9',  sessions: 2600, users: 1950 },
  { day: 'Apr 10', sessions: 3120, users: 2380 },
  { day: 'Apr 11', sessions: 2980, users: 2200 },
  { day: 'Apr 12', sessions: 3450, users: 2560 },
  { day: 'Apr 13', sessions: 3200, users: 2420 },
  { day: 'Apr 14', sessions: 2700, users: 2050 },
  { day: 'Apr 15', sessions: 2900, users: 2180 },
  { day: 'Apr 16', sessions: 3380, users: 2540 },
  { day: 'Apr 17', sessions: 3600, users: 2700 },
  { day: 'Apr 18', sessions: 3820, users: 2880 },
  { day: 'Apr 19', sessions: 4100, users: 3050 },
  { day: 'Apr 20', sessions: 3940, users: 2960 },
]

const pieData = [
  { name: 'Organic', value: 39 },
  { name: 'Direct', value: 25 },
  { name: 'Social', value: 18 },
  { name: 'Referral', value: 11 },
  { name: 'Email', value: 7 },
]

const kpiData: KpiCardProps[] = [
  {
    icon: 'person',
    label: 'Active Users',
    value: '24,581',
    delta: '12%',
    positive: true,
    sparkData: [40, 55, 48, 62, 70, 58, 75, 82, 68, 90, 85, 95, 88, 100],
  },
  {
    icon: 'bar_graph',
    label: 'Sessions',
    value: '87,420',
    delta: '8.3%',
    positive: true,
    sparkData: [60, 72, 65, 80, 76, 88, 79, 92, 85, 95, 89, 100, 94, 98],
  },
  {
    icon: 'notifications',
    label: 'Bounce Rate',
    value: '34.2%',
    delta: '2.1%',
    positive: false,
    sparkData: [50, 45, 52, 48, 55, 42, 50, 46, 40, 44, 38, 42, 36, 35],
  },
  {
    icon: 'calendar',
    label: 'Avg Duration',
    value: '3m 42s',
    delta: '5.7%',
    positive: true,
    sparkData: [30, 35, 42, 38, 45, 50, 48, 55, 60, 58, 65, 62, 70, 75],
  },
]

const channelData: ChannelRowProps[] = [
  { channel: 'Organic Search', sessions: 34210, pct: 39, color: 'var(--modus-wc-color-primary)' },
  { channel: 'Direct', sessions: 22180, pct: 25, color: '#0e9f6e' },
  { channel: 'Social Media', sessions: 15340, pct: 18, color: '#e3a008' },
  { channel: 'Referral', sessions: 9870, pct: 11, color: '#9061f9' },
  { channel: 'Email', sessions: 5820, pct: 7, color: '#e02424' },
]

export default function OverviewPage() {
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
            <ModusWcTypography hierarchy="h1" size="2xl" weight="bold" label="Overview" />
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
              label="Analytics summary — last 30 days"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <ModusWcButton variant="outlined" color="tertiary" size="sm">
              Export
            </ModusWcButton>
            <ModusWcButton variant="filled" color="primary" size="sm">
              New Report
            </ModusWcButton>
          </div>
        </div>
      </section>

      {/* KPI band */}
      <section aria-label="Key metrics">
        <div className="flex flex-col gap-3">
          <ModusWcTypography hierarchy="h2" size="lg" weight="semibold" label="Key Metrics" />
          <div
            className="kpi-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '0.75rem',
              alignItems: 'stretch',
            }}
          >
            {kpiData.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>
        </div>
      </section>

      {/* Charts row */}
      <section aria-label="Charts">
        <div className="flex flex-col gap-3">
          <ModusWcTypography hierarchy="h2" size="lg" weight="semibold" label="Trends" />
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '0.75rem' }}>

            {/* Sessions & Users area chart */}
            <ModusWcCard bordered={false} padding="compact">
              <div slot="title" className="flex w-full min-w-0 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <ModusWcIcon name="bar_graph" decorative />
                  <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Sessions & Users" />
                </div>
                <ModusWcButton variant="borderless" color="tertiary" size="xs">14d</ModusWcButton>
              </div>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sessionsTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--modus-wc-color-primary)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--modus-wc-color-primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--modus-wc-color-success)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--modus-wc-color-success)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                    <XAxis
                      dataKey="day"
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
                    />
                    <Tooltip {...CHART_TOOLTIP_STYLE} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: 'var(--modus-wc-color-base-content)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      name="Sessions"
                      stroke="var(--modus-wc-color-primary)"
                      strokeWidth={2}
                      fill="url(#gradSessions)"
                      dot={{ fill: 'var(--modus-wc-color-base-100)', stroke: 'var(--modus-wc-color-primary)', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="Users"
                      stroke="var(--modus-wc-color-success)"
                      strokeWidth={2}
                      fill="url(#gradUsers)"
                      dot={{ fill: 'var(--modus-wc-color-base-100)', stroke: 'var(--modus-wc-color-success)', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ModusWcCard>

            {/* Traffic sources pie */}
            <ModusWcCard bordered={false} padding="compact">
              <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
                <ModusWcIcon name="master_data" decorative />
                <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Traffic Sources" />
              </div>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius="42%"
                      outerRadius="68%"
                      paddingAngle={3}
                      dataKey="value"
                      stroke="var(--modus-wc-color-base-100)"
                      strokeWidth={2}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Share']} />
                    <Legend
                      iconSize={10}
                      wrapperStyle={{ fontSize: 11, color: 'var(--modus-wc-color-base-content)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ModusWcCard>

          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section aria-label="Recent activity">
        <ModusWcCard bordered={false} padding="compact">
          <div slot="title" className="flex w-full min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <ModusWcIcon name="calendar" decorative />
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Recent Activity" />
            </div>
            <ModusWcButton variant="borderless" color="tertiary" size="xs">
              View all
            </ModusWcButton>
          </div>
          <div className="flex flex-col gap-1">
            {[
              { time: '2 min ago', event: 'New user signup', type: 'success' },
              { time: '14 min ago', event: 'Campaign "Spring25" launched', type: 'primary' },
              { time: '1 hr ago', event: 'Report exported by alex@trimble.com', type: 'tertiary' },
              { time: '3 hr ago', event: 'API rate limit warning (78%)', type: 'warning' },
              { time: '5 hr ago', event: 'Weekly digest delivered to 1,204 subscribers', type: 'tertiary' },
            ].map((item, i) => (
              <div key={i}>
                {i > 0 && <ModusWcDivider />}
                <div className="flex items-center gap-3 py-2">
                  <ModusWcBadge color={item.type as 'success' | 'primary' | 'tertiary' | 'warning'} size="sm">
                    {item.type === 'success' ? 'New' : item.type === 'warning' ? 'Warn' : 'Info'}
                  </ModusWcBadge>
                  <ModusWcTypography hierarchy="p" size="sm" label={item.event} customClass="flex-1 min-w-0" />
                  <ModusWcTypography
                    hierarchy="p"
                    size="xs"
                    customClass="text-[var(--modus-wc-color-base-content-low-contrast)] flex-shrink-0"
                    label={item.time}
                  />
                </div>
              </div>
            ))}
          </div>
        </ModusWcCard>
      </section>
    </>
  )
}

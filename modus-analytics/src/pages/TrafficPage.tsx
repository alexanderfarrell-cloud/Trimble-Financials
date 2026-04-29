import {
  ModusWcCard,
  ModusWcTypography,
  ModusWcIcon,
  ModusWcButton,
  ModusWcBadge,
  ModusWcTabs,
} from '@trimble-oss/moduswebcomponents-react'
import { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import {
  CHART_COLORS,
  CHART_TOOLTIP_STYLE,
  AXIS_STROKE,
  GRID_STROKE,
} from '../components/chartTokens'

const tabsList = [
  { id: 'channels', label: 'Channels' },
  { id: 'devices', label: 'Devices' },
  { id: 'geo', label: 'Geography' },
]

interface BarRowProps {
  label: string
  value: number
  max: number
  pct: string
  color: string
}

function BarRow({ label, value, max, pct, color }: BarRowProps) {
  const width = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-3 py-2">
      <div style={{ width: '120px', flexShrink: 0 }}>
        <ModusWcTypography hierarchy="p" size="sm" label={label} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${width}%`, background: color }}
            role="progressbar"
            aria-valuenow={width}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${label}: ${pct}`}
          />
        </div>
      </div>
      <div style={{ width: '60px', textAlign: 'right', flexShrink: 0 }}>
        <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label={pct} />
      </div>
      <div style={{ width: '80px', textAlign: 'right', flexShrink: 0 }}>
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
          label={value.toLocaleString()}
        />
      </div>
    </div>
  )
}

// --- chart data ---
const trendData = [
  { week: 'Mar W1', organic: 7200, direct: 4800, social: 3100 },
  { week: 'Mar W2', organic: 7800, direct: 5200, social: 3400 },
  { week: 'Mar W3', organic: 8100, direct: 5600, social: 3600 },
  { week: 'Mar W4', organic: 7600, direct: 5100, social: 3200 },
  { week: 'Apr W1', organic: 8500, direct: 5800, social: 3900 },
  { week: 'Apr W2', organic: 9200, direct: 6100, social: 4200 },
  { week: 'Apr W3', organic: 9800, direct: 6400, social: 4500 },
]

const deviceData = [
  { name: 'Desktop', value: 51300 },
  { name: 'Mobile', value: 29610 },
  { name: 'Tablet', value: 6510 },
]

const channelRows: BarRowProps[] = [
  { label: 'Organic Search', value: 34210, max: 34210, pct: '39.1%', color: 'var(--modus-wc-color-primary)' },
  { label: 'Direct', value: 22180, max: 34210, pct: '25.4%', color: '#0e9f6e' },
  { label: 'Social Media', value: 15340, max: 34210, pct: '17.5%', color: '#e3a008' },
  { label: 'Referral', value: 9870, max: 34210, pct: '11.3%', color: '#9061f9' },
  { label: 'Email', value: 5820, max: 34210, pct: '6.7%', color: '#e02424' },
]

const deviceRows: BarRowProps[] = [
  { label: 'Desktop', value: 51300, max: 87420, pct: '58.7%', color: 'var(--modus-wc-color-primary)' },
  { label: 'Mobile', value: 29610, max: 87420, pct: '33.9%', color: '#0e9f6e' },
  { label: 'Tablet', value: 6510, max: 87420, pct: '7.4%', color: '#e3a008' },
]

const geoRows: BarRowProps[] = [
  { label: 'United States', value: 38420, max: 87420, pct: '43.9%', color: 'var(--modus-wc-color-primary)' },
  { label: 'United Kingdom', value: 12180, max: 87420, pct: '13.9%', color: '#0e9f6e' },
  { label: 'Germany', value: 8960, max: 87420, pct: '10.2%', color: '#e3a008' },
  { label: 'Canada', value: 7430, max: 87420, pct: '8.5%', color: '#9061f9' },
  { label: 'Australia', value: 5210, max: 87420, pct: '6.0%', color: '#e02424' },
  { label: 'Other', value: 15220, max: 87420, pct: '17.5%', color: 'var(--modus-wc-color-base-content-low-contrast)' },
]

const tabRows: Record<string, BarRowProps[]> = {
  channels: channelRows,
  devices: deviceRows,
  geo: geoRows,
}

export default function TrafficPage() {
  const [activeTab, setActiveTab] = useState(0)
  const activeTabId = tabsList[activeTab]?.id ?? 'channels'

  return (
    <>
      {/* Page hero */}
      <section aria-label="Page header">
        <div className="flex flex-col gap-1">
          <ModusWcTypography hierarchy="h1" size="2xl" weight="bold" label="Traffic Sources" />
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
            label="Where your visitors are coming from"
          />
        </div>
      </section>

      {/* Summary cards */}
      <section aria-label="Traffic summary">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '0.75rem',
            alignItems: 'stretch',
          }}
        >
          {[
            { icon: 'bar_graph', label: 'Total Sessions', value: '87,420', badge: '+8.3%', positive: true },
            { icon: 'person', label: 'New Visitors', value: '14,862', badge: '+15.1%', positive: true },
            { icon: 'home', label: 'Returning', value: '9,719', badge: '-3.2%', positive: false },
          ].map((card) => (
            <ModusWcCard key={card.label} bordered={false} padding="compact">
              <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
                <ModusWcIcon name={card.icon} decorative />
                <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label={card.label} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <ModusWcTypography hierarchy="p" size="2xl" weight="bold" label={card.value} />
                <ModusWcBadge
                  size="sm"
                  color={card.positive ? 'success' : 'danger'}
                  aria-label={card.badge}
                >
                  {card.badge}
                </ModusWcBadge>
              </div>
            </ModusWcCard>
          ))}
        </div>
      </section>

      {/* Tabs breakdown */}
      <section aria-label="Traffic breakdown">
        <div className="flex flex-col gap-3">
          <ModusWcTabs
            tabs={tabsList.map((t) => ({ id: t.id, label: t.label }))}
            activeTabIndex={activeTab}
            onTabChange={(e: CustomEvent<{ newTab: number }>) =>
              setActiveTab(e.detail.newTab)
            }
          />
          <ModusWcCard bordered={false} padding="compact">
            <div slot="title" className="flex w-full min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <ModusWcIcon name="bar_graph" decorative />
                <ModusWcTypography
                  hierarchy="h4"
                  size="md"
                  weight="semibold"
                  label={tabsList[activeTab]?.label ?? 'Breakdown'}
                />
              </div>
              <ModusWcButton variant="borderless" color="tertiary" size="xs">
                Export
              </ModusWcButton>
            </div>
            <div
              role="tabpanel"
              aria-label={`${tabsList[activeTab]?.label} breakdown`}
              className="flex flex-col"
            >
              {/* Column headers */}
              <div className="flex items-center gap-3 pb-2" style={{ borderBottom: '1px solid var(--modus-wc-color-base-200)' }}>
                <div style={{ width: '120px', flexShrink: 0 }}>
                  <ModusWcTypography
                    hierarchy="p"
                    size="xs"
                    weight="semibold"
                    customClass="text-[var(--modus-wc-color-base-content-low-contrast)] uppercase tracking-wider"
                    label="Source"
                  />
                </div>
                <div className="flex-1" />
                <div style={{ width: '60px', textAlign: 'right', flexShrink: 0 }}>
                  <ModusWcTypography
                    hierarchy="p"
                    size="xs"
                    weight="semibold"
                    customClass="text-[var(--modus-wc-color-base-content-low-contrast)] uppercase tracking-wider"
                    label="Share"
                  />
                </div>
                <div style={{ width: '80px', textAlign: 'right', flexShrink: 0 }}>
                  <ModusWcTypography
                    hierarchy="p"
                    size="xs"
                    weight="semibold"
                    customClass="text-[var(--modus-wc-color-base-content-low-contrast)] uppercase tracking-wider"
                    label="Sessions"
                  />
                </div>
              </div>
              {tabRows[activeTabId]?.map((row) => (
                <BarRow key={row.label} {...row} />
              ))}
            </div>
          </ModusWcCard>
        </div>
      </section>

      {/* Charts row: stacked bar + device line */}
      <section aria-label="Traffic charts">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '0.75rem' }}>

          {/* Weekly channel stacked bar */}
          <ModusWcCard bordered={false} padding="compact">
            <div slot="title" className="flex w-full min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <ModusWcIcon name="bar_graph" decorative />
                <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Weekly by Channel" />
              </div>
              <ModusWcButton variant="borderless" color="tertiary" size="xs">7 wks</ModusWcButton>
            </div>
            <div style={{ width: '100%', height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis
                    dataKey="week"
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
                  <Legend wrapperStyle={{ fontSize: 12, color: 'var(--modus-wc-color-base-content)' }} />
                  <Bar dataKey="organic" name="Organic" stackId="a" fill={CHART_COLORS[0]} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="direct" name="Direct" stackId="a" fill={CHART_COLORS[2]} />
                  <Bar dataKey="social" name="Social" stackId="a" fill={CHART_COLORS[1]} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ModusWcCard>

          {/* Device sessions line */}
          <ModusWcCard bordered={false} padding="compact">
            <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
              <ModusWcIcon name="settings" decorative />
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Device Split" />
            </div>
            <div style={{ width: '100%', height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deviceData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                  <XAxis
                    type="number"
                    stroke={AXIS_STROKE}
                    tick={{ fontSize: 11, fill: 'var(--modus-wc-color-base-content-low-contrast)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke={AXIS_STROKE}
                    tick={{ fontSize: 12, fill: 'var(--modus-wc-color-base-content)' }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [Number(v).toLocaleString(), 'Sessions']} />
                  <Bar dataKey="value" name="Sessions" radius={[0, 4, 4, 0]}>
                    {deviceData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ModusWcCard>

        </div>
      </section>
    </>
  )
}

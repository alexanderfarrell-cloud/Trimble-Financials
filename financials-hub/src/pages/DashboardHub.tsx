import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ModusWcIcon, ModusWcDropdownMenu, ModusWcMenuItem } from '@trimble-oss/moduswebcomponents-react'
import { AddButton } from '../components/AddButton'
import { usePeriodsContext } from '../context/PeriodsContext'
import { getPendingClosePeriods } from '../data/periods'

function MeatballMenu() {
  return (
    <button
      aria-label="More options"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px 6px',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        flexShrink: 0,
        color: 'var(--modus-wc-color-base-content-low-contrast)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--modus-wc-color-base-100)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', display: 'block' }} />
      ))}
    </button>
  )
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function fmt(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(0)}K`
    : `$${n}`
}

// ─── Recent Jobs data ─────────────────────────────────────────────────────────

const RECENT_JOBS = [
  {
    id: 'PRJ-2024-0051',
    name: 'Downtown Tower — Phase 2',
    customer: 'Meridian Construction Group',
    location: 'Portland, OR',
    startDate: 'Jan 8, 2024',
    endDate: 'Nov 30, 2025',
    contractValue: 4_200_000,
    spentPct: 68,
    status: 'Active' as const,
  },
  {
    id: 'PRJ-2024-0048',
    name: 'Highway 89 Bridge Expansion',
    customer: 'State Dept. of Transportation',
    location: 'Salem, OR',
    startDate: 'Mar 1, 2024',
    endDate: 'Sep 15, 2026',
    contractValue: 8_500_000,
    spentPct: 42,
    status: 'Active' as const,
  },
  {
    id: 'PRJ-2023-0038',
    name: 'Airport Terminal Renovation',
    customer: 'Regional Airport Authority',
    location: 'Hillsboro, OR',
    startDate: 'Oct 1, 2023',
    endDate: 'Apr 30, 2026',
    contractValue: 12_300_000,
    spentPct: 77,
    status: 'Active' as const,
  },
]


function progColor(pct: number) {
  if (pct >= 90) return 'var(--modus-wc-color-danger, #da212c)'
  if (pct >= 75) return 'var(--modus-wc-color-warning, #fbad26)'
  return 'var(--modus-wc-color-primary)'
}

// ─── Recent Expenses data ─────────────────────────────────────────────────────

const EXPENSE_CATEGORY_COLOR: Record<string, string> = {
  Labor:         'var(--modus-wc-color-primary)',
  Materials:     '#e07b16',
  Equipment:     'var(--modus-wc-color-success, #006638)',
  Subcontractor: '#8b5cf6',
  Travel:        'var(--modus-wc-color-warning, #fbad26)',
  Other:         'var(--modus-wc-color-base-content-low-contrast)',
}


const RECENT_EXPENSES = [
  {
    id: 'EXP-2025-0312',
    date: 'May 2, 2025',
    description: 'Structural steel delivery — downtown site',
    jobName: 'Downtown Tower — Phase 2',
    category: 'Materials',
    amount: 84_500,
    submittedBy: 'Sarah Chen',
    status: 'Approved' as const,
  },
  {
    id: 'EXP-2025-0311',
    date: 'May 1, 2025',
    description: 'Concrete pour — bridge deck phase 3',
    jobName: 'Highway 89 Bridge Expansion',
    category: 'Subcontractor',
    amount: 52_300,
    submittedBy: 'Marcus Rivera',
    status: 'Pending' as const,
  },
  {
    id: 'EXP-2025-0310',
    date: 'Apr 30, 2025',
    description: 'Crane rental — tower crane May-Jun',
    jobName: 'Downtown Tower — Phase 2',
    category: 'Equipment',
    amount: 18_900,
    submittedBy: 'Sarah Chen',
    status: 'Approved' as const,
  },
]

// ─── Recent Billing data ──────────────────────────────────────────────────────


const RECENT_INVOICES = [
  {
    id: 'INV-2025-0142',
    jobName: 'Downtown Tower — Phase 2',
    customer: 'Meridian Construction Group',
    amount: 234_500,
    dueDate: 'May 15, 2025',
    status: 'Overdue' as const,
  },
  {
    id: 'INV-2025-0141',
    jobName: 'Highway 89 Bridge Expansion',
    customer: 'State Dept. of Transportation',
    amount: 580_000,
    dueDate: 'May 20, 2025',
    status: 'Pending' as const,
  },
  {
    id: 'INV-2025-0140',
    jobName: 'Lakeside Residential Complex',
    customer: 'Summit Development Corp',
    amount: 95_000,
    dueDate: 'May 25, 2025',
    status: 'Approved' as const,
  },
]

// ─── Widget shell ─────────────────────────────────────────────────────────────

function Widget({
  icon, title, viewAllPath, children,
}: {
  icon: string
  title: string
  viewAllPath: string
  children: React.ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      border: '1px solid var(--modus-wc-color-base-200)',
      borderRadius: 8, overflow: 'hidden',
      background: 'var(--modus-wc-color-base-page)',
    }}>
      {/* Widget header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--modus-wc-color-base-200)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ModusWcIcon name={icon} size="sm" decorative />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)' }}>
            {title}
          </span>
        </div>
        <button
          onClick={() => navigate(viewAllPath)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--modus-wc-color-primary)', fontFamily: 'inherit',
            padding: '2px 0',
          }}
        >
          View All
        </button>
      </div>
      {/* Widget body */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

function WidgetRow({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      padding: '0.75rem 1rem',
      borderBottom: last ? 'none' : '1px solid var(--modus-wc-color-base-200)',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {children}
    </div>
  )
}

// ─── Recent Jobs widget ───────────────────────────────────────────────────────

function RecentJobsWidget() {
  return (
    <Widget icon="assignment" title="Recent Jobs" viewAllPath="/jobs">
      {RECENT_JOBS.map((job, i) => (
        <WidgetRow key={job.id} last={i === RECENT_JOBS.length - 1}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content)', lineHeight: 1.3 }}>
              {job.name}
            </span>
            <MeatballMenu />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            <ModusWcIcon name="location" size="xs" decorative />
            <span style={{ fontSize: '0.72rem' }}>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            <ModusWcIcon name="calendar" size="xs" decorative />
            <span style={{ fontSize: '0.72rem' }}>{job.startDate} – {job.endDate}</span>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>Progress</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: progColor(job.spentPct) }}>{job.spentPct}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'var(--modus-wc-color-base-200)' }}>
              <div style={{ height: '100%', borderRadius: 2, width: `${job.spentPct}%`, background: progColor(job.spentPct) }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>Contract Value</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)' }}>{fmt(job.contractValue)}</span>
          </div>
        </WidgetRow>
      ))}
    </Widget>
  )
}

// ─── Recent Expenses widget ───────────────────────────────────────────────────

function RecentExpensesWidget() {
  return (
    <Widget icon="credit_card" title="Recent Expenses" viewAllPath="/expenses">
      {RECENT_EXPENSES.map((exp, i) => (
        <WidgetRow key={exp.id} last={i === RECENT_EXPENSES.length - 1}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content)', lineHeight: 1.3, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {exp.description}
            </span>
            <MeatballMenu />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: EXPENSE_CATEGORY_COLOR[exp.category], flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
              {exp.category} · {exp.date}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            <ModusWcIcon name="person" size="xs" decorative />
            <span style={{ fontSize: '0.72rem' }}>{exp.submittedBy} · {exp.jobName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>Amount</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)' }}>{fmt(exp.amount)}</span>
          </div>
        </WidgetRow>
      ))}
    </Widget>
  )
}

// ─── Recent Billing widget ────────────────────────────────────────────────────

function RecentBillingWidget() {
  return (
    <Widget icon="receipt" title="Recent Billing" viewAllPath="/billing">
      {RECENT_INVOICES.map((inv, i) => (
        <WidgetRow key={inv.id} last={i === RECENT_INVOICES.length - 1}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {inv.jobName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)', marginTop: 1 }}>
                {inv.customer}
              </div>
            </div>
            <MeatballMenu />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--modus-wc-color-base-content-low-contrast)', marginTop: 2 }}>
            <ModusWcIcon name="calendar" size="xs" decorative />
            <span style={{ fontSize: '0.72rem' }}>Due {inv.dueDate}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--modus-wc-color-base-300)' }}>·</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>{inv.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>Amount</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)' }}>${inv.amount.toLocaleString()}</span>
          </div>
        </WidgetRow>
      ))}
    </Widget>
  )
}

// ─── Strategic KPIs ───────────────────────────────────────────────────────────

const ACTIVE_JOBS = RECENT_JOBS // all are Active in sample data
const TOTAL_CONTRACT  = ACTIVE_JOBS.reduce((s, j) => s + j.contractValue, 0)
const TOTAL_COST      = ACTIVE_JOBS.reduce((s, j) => s + j.contractValue * (j.spentPct / 100) * 0.82, 0)
const GROSS_MARGIN    = ((TOTAL_CONTRACT - TOTAL_COST) / TOTAL_CONTRACT) * 100
const OUTSTANDING_AR  = RECENT_INVOICES
  .filter((i) => i.status === 'Overdue' || i.status === 'Pending')
  .reduce((s, i) => s + i.amount, 0)
const JOBS_AT_RISK    = RECENT_JOBS.filter((j) => j.spentPct >= 75).length

const STAT_CARDS = [
  {
    label: 'Active Contract Value',
    value: `$${(TOTAL_CONTRACT / 1_000_000).toFixed(1)}M`,
    sub: `${ACTIVE_JOBS.length} active jobs`,
    color: 'var(--modus-wc-color-base-content)',
    icon: 'trending_up',
  },
  {
    label: 'Gross Margin',
    value: `${GROSS_MARGIN.toFixed(1)}%`,
    sub: 'Across active portfolio',
    color: GROSS_MARGIN >= 15
      ? 'var(--modus-wc-color-success, #006638)'
      : 'var(--modus-wc-color-warning, #fbad26)',
    icon: 'bar_chart',
  },
  {
    label: 'Outstanding AR',
    value: `$${(OUTSTANDING_AR / 1_000).toFixed(0)}K`,
    sub: `${RECENT_INVOICES.filter((i) => i.status === 'Overdue' || i.status === 'Pending').length} unpaid invoices`,
    color: OUTSTANDING_AR > 500_000
      ? 'var(--modus-wc-color-danger, #da212c)'
      : 'var(--modus-wc-color-warning, #fbad26)',
    icon: 'account_balance',
  },
  {
    label: 'Jobs At Risk',
    value: String(JOBS_AT_RISK),
    sub: JOBS_AT_RISK === 0 ? 'All jobs on track' : `≥75% budget consumed`,
    color: JOBS_AT_RISK === 0
      ? 'var(--modus-wc-color-success, #006638)'
      : JOBS_AT_RISK >= 2
      ? 'var(--modus-wc-color-danger, #da212c)'
      : 'var(--modus-wc-color-warning, #fbad26)',
    icon: 'warning',
  },
]

// ─── DashboardHub ─────────────────────────────────────────────────────────────

function TodoActionDropdown({
  primaryLabel, primaryPath, secondaryLabel, secondaryPath, color: _color = 'danger',
}: {
  primaryLabel: string; primaryPath: string
  secondaryLabel: string; secondaryPath: string
  color?: 'primary' | 'secondary' | 'danger' | 'warning'
}) {
  const navigate = useNavigate()
  const close = (e: Event) => {
    const el = (e.target as HTMLElement).closest('modus-wc-dropdown-menu') as HTMLElement & { menuVisible: boolean }
    if (el) el.menuVisible = false
  }
  return (
    <ModusWcDropdownMenu
      buttonAriaLabel="Choose action"
      buttonColor="primary"
      buttonSize="sm"
      buttonVariant="outlined"
      buttonShape="ellipse"
      menuBordered
      menuOffset={6}
      menuPlacement="bottom-end"
      menuSize="sm"
    >
      <div slot="button" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '0.8125rem', fontWeight: 600 }}>{primaryLabel}</span>
        <ModusWcIcon name="expand_more" size="xs" decorative />
      </div>
      <div slot="menu">
        <ModusWcMenuItem
          label={primaryLabel}
          value="primary"
          onItemSelect={(e: Event) => { close(e); navigate(primaryPath) }}
        />
        <ModusWcMenuItem
          label={secondaryLabel}
          value="secondary"
          onItemSelect={(e: Event) => { close(e); navigate(secondaryPath) }}
        />
      </div>
    </ModusWcDropdownMenu>
  )
}

function TodoSection() {
  const navigate = useNavigate()
  const { periods } = usePeriodsContext()
  // const [showExtra, setShowExtra] = useState(false)
  const all = getPendingClosePeriods(periods)
  const visible = all.slice(0, 1)
  if (!visible.length) return null
  return (
    <div style={{
      border: '1px solid var(--modus-wc-color-base-200)',
      borderRadius: 8,
      overflow: 'hidden',
      background: 'var(--modus-wc-color-base-page)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--modus-wc-color-base-200)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ModusWcIcon name="check_circle" size="sm" decorative />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)' }}>To Do</span>
        </div>
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setShowExtra(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'inherit', padding: '2px 0', textDecoration: 'underline' }}
          >
            {showExtra ? 'Hide extra' : 'Show extra'}
          </button>
        </div> */}
      </div>

      {/* Extra cards — hidden for MVP */}
      {false && (
        <>
          {/* Upcoming close reminder — friendly tone */}
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--modus-wc-color-base-200)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--modus-wc-color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ModusWcIcon name="calendar_today" size="xs" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
                May is coming to a close
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                Review your open items and close the period when you're ready to lock your books.
              </div>
            </div>
            <button
              onClick={() => navigate('/periods')}
              style={{ padding: '0.3rem 0.75rem', borderRadius: 99, border: '1px solid var(--modus-wc-color-primary)', background: 'transparent', color: 'var(--modus-wc-color-primary)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
            >
              Review period
            </button>
          </div>
          {/* Job costing warning card — minimal */}
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--modus-wc-color-base-200)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 18%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ModusWcIcon name="warning" size="xs" decorative style={{ color: '#7a5200' } as React.CSSProperties} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
                May 2026 is ending soon
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                $156,800 outstanding. Collect before May 31 or the income rolls into next month.
              </div>
            </div>
            <TodoActionDropdown
              primaryLabel="Review invoices"
              primaryPath="/billing"
              secondaryLabel="Close Period"
              secondaryPath="/periods/close?id=2026-05"
              color="warning"
            />
          </div>
          {/* Single-job missing expenses spotlight */}
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--modus-wc-color-base-200)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 18%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ModusWcIcon name="assignment" size="xs" decorative style={{ color: '#7a5200' } as React.CSSProperties} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
                Riverside Commons — no expenses logged this month
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                $12,000 budgeted but nothing recorded yet. Did work happen that wasn't logged?
              </div>
            </div>
            <TodoActionDropdown
              primaryLabel="Check job"
              primaryPath="/jobs"
              secondaryLabel="Close Period"
              secondaryPath="/periods/close?id=2026-05"
              color="warning"
            />
          </div>
          {/* Summary — multiple jobs with no expenses */}
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--modus-wc-color-base-200)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 18%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ModusWcIcon name="list" size="xs" decorative style={{ color: '#7a5200' } as React.CSSProperties} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
                3 active jobs have no expenses logged this month
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                $28,500 budgeted across these jobs. Worth a quick check before May closes.
              </div>
            </div>
            <TodoActionDropdown
              primaryLabel="Review jobs"
              primaryPath="/jobs"
              secondaryLabel="Close Period"
              secondaryPath="/periods/close?id=2026-05"
              color="warning"
            />
          </div>
        </>
      )}

      {/* MVP card — single period-close row */}
      {visible.map((p) => (
        <div
          key={p.id}
          style={{
            padding: '0.75rem 1rem',
            borderBottom: 'none',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ModusWcIcon name="calendar_today" size="xs" decorative style={{ color: '#7a5200' } as React.CSSProperties} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
              {p.label} is ending soon
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
              Want to close and lock your books for this period?
            </div>
          </div>
          <button
            onClick={() => navigate(`/periods/close?id=${p.id}`)}
            style={{ padding: '0.3rem 0.75rem', borderRadius: 99, border: '1px solid var(--modus-wc-color-primary)', background: 'transparent', color: 'var(--modus-wc-color-primary)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
          >
            Close now
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Getting Started dashboard (manual entry path) ────────────────────────────

const GETTING_STARTED_TASKS: {
  id: string
  icon: string
  label: string
  badge: string
  badgeVariant: 'pending' | 'optional'
  description: string
  route: string | null
}[] = [
  { id: 'job',      icon: 'assignment',  label: 'Add Job',           badge: 'Pending',  badgeVariant: 'pending',  description: 'Add a new job or complete your existing draft to start building your main dashboard.', route: '/jobs/new' },
  { id: 'customer', icon: 'contacts',    label: 'Add Customer',      badge: 'Pending',  badgeVariant: 'pending',  description: 'Add a new customer to start associating jobs and billings.', route: '/customers' },
  { id: 'users',    icon: 'group',       label: 'Add Users',         badge: 'Optional', badgeVariant: 'optional', description: "Add new users and assign licenses to them inside Trimble's Admin Console.", route: null },
  { id: 'billing',  icon: 'receipt',     label: 'Add Billing',       badge: 'Pending',  badgeVariant: 'pending',  description: 'Add a new billing or complete your existing draft to start building your main dashboard.', route: '/billing' },
  { id: 'expense',  icon: 'credit_card', label: 'Record an Expense', badge: 'Pending',  badgeVariant: 'pending',  description: 'Add a new expense or complete your existing draft to start building your main dashboard.', route: '/expenses' },
]

function GettingStartedDashboard() {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = React.useState(
    () => localStorage.getItem('getting-started-dismissed') === 'true'
  )
  const [activeTab, setActiveTab] = React.useState<'recent' | 'insights'>('recent')

  const handleDismiss = () => {
    localStorage.setItem('getting-started-dismissed', 'true')
    setDismissed(true)
  }

  const handleReset = () => {
    localStorage.removeItem('onboarding-path')
    localStorage.removeItem('getting-started-dismissed')
    window.location.href = '/onboarding'
  }

  return (
    <div className="hub-page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ margin: '0 0 2px', fontSize: '1.375rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif' }}>
            Hello, Alex!
          </h1>
        </div>
        <AddButton />
      </div>

      {/* Welcome hero */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 4 }}>
            Welcome to Trimble Financials
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            You run the job. We'll run the numbers.
          </div>
        </div>
        <div style={{ width: 72, height: 72, borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%', background: 'color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ModusWcIcon name="account_balance" size="md" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom: 0 }}>
        {(['recent', 'insights'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? ' tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'recent' && (
        <>
          {!dismissed ? (
            /* Getting Started card */
            <div style={{ border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 10, background: 'var(--modus-wc-color-base-page)', overflow: 'hidden' }}>
              {/* Card header */}
              <div style={{ padding: '1rem 1.25rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--modus-wc-color-base-content)' }}>
                  Getting Started
                </span>
                <button
                  onClick={handleDismiss}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '0.8125rem', color: 'var(--modus-wc-color-primary)', padding: 0, textDecoration: 'underline' }}
                >
                  Skip seeing this
                </button>
              </div>

              {/* Progress bar */}
              <div style={{ padding: '0 1.25rem 1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)', marginBottom: 6, fontFamily: 'Open Sans, sans-serif' }}>
                  Let's get you setup to start using Financials Go
                </div>
                <div className="prog-track" style={{ height: 6 }}>
                  <div className="prog-fill" style={{ width: '0%' }} />
                </div>
              </div>

              {/* Task rows */}
              <div style={{ borderTop: '1px solid var(--modus-wc-color-base-200)' }}>
                {GETTING_STARTED_TASKS.map((task, i) => (
                  <button
                    key={task.id}
                    onClick={() => task.route && navigate(task.route)}
                    disabled={!task.route}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      width: '100%',
                      padding: '0.875rem 1.25rem',
                      background: 'none',
                      border: 'none',
                      borderBottom: i < GETTING_STARTED_TASKS.length - 1 ? '1px solid var(--modus-wc-color-base-200)' : 'none',
                      cursor: task.route ? 'pointer' : 'default',
                      textAlign: 'left',
                      fontFamily: 'Open Sans, sans-serif',
                    }}
                    onMouseEnter={(e) => { if (task.route) e.currentTarget.style.background = 'var(--modus-wc-color-base-100)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                  >
                    {/* Icon */}
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--modus-wc-color-base-100)', border: '1px solid var(--modus-wc-color-base-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ModusWcIcon name={task.icon} size="sm" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties} />
                    </div>

                    {/* Label + description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)' }}>
                          {task.label}
                        </span>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          borderRadius: 4,
                          padding: '1px 7px',
                          border: task.badgeVariant === 'pending'
                            ? '1px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 60%, transparent)'
                            : '1px solid var(--modus-wc-color-base-200)',
                          background: task.badgeVariant === 'pending'
                            ? 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 12%, transparent)'
                            : 'var(--modus-wc-color-base-100)',
                          color: task.badgeVariant === 'pending'
                            ? '#7a5200'
                            : 'var(--modus-wc-color-base-content-low-contrast)',
                        }}>
                          {task.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.5 }}>
                        {task.description}
                      </div>
                    </div>

                    {/* Chevron */}
                    {task.route && (
                      <ModusWcIcon name="chevron_right" size="sm" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)', flexShrink: 0 } as React.CSSProperties} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Empty state after skip */
            <div className="empty-state" style={{ paddingTop: '4rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--modus-wc-color-base-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ModusWcIcon name="dashboard" size="md" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)' }}>
                Your dashboard is empty
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', maxWidth: 300 }}>
                Add a job, customer, or billing to start seeing data here.
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'insights' && (
        <div className="empty-state" style={{ paddingTop: '4rem' }}>
          <ModusWcIcon name="bar_chart" size="lg" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties} />
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)' }}>
            No insights yet
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', maxWidth: 300 }}>
            Insights will appear once you've added jobs, billings, and expenses.
          </div>
        </div>
      )}

      {/* Demo reset */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
        <button
          onClick={handleReset}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}
        >
          <ModusWcIcon name="refresh" size="xs" decorative />
          Reset demo
        </button>
      </div>
    </div>
  )
}

function ImportBanner() {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = React.useState(
    () => localStorage.getItem('import-banner-dismissed') === 'true'
  )

  if (dismissed) return null

  return (
    <div style={{
      border: '1.5px solid color-mix(in srgb, var(--modus-wc-color-primary) 40%, transparent)',
      borderRadius: 10,
      padding: '1rem 1.25rem',
      background: 'color-mix(in srgb, var(--modus-wc-color-primary) 5%, transparent)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'color-mix(in srgb, var(--modus-wc-color-primary) 12%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <ModusWcIcon name="import_export" size="sm" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
          Bring in your existing data
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
          Import customers, vendors, jobs, or expenses from a CSV or spreadsheet to get started faster.
        </div>
      </div>
        <button
        onClick={() => navigate('/onboarding')}
        style={{
          padding: '0.4375rem 1rem',
          borderRadius: 99,
          border: 'none',
          background: 'var(--modus-wc-color-primary)',
          color: '#fff',
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '0.8125rem',
          fontWeight: 700,
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <ModusWcIcon name="upload_file" size="xs" decorative />
        Import data
      </button>
      <button
        onClick={() => { localStorage.setItem('import-banner-dismissed', 'true'); setDismissed(true) }}
        aria-label="Dismiss"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: 'var(--modus-wc-color-base-content-low-contrast)', display: 'flex', flexShrink: 0 }}
      >
        <ModusWcIcon name="close" size="xs" decorative />
      </button>
    </div>
  )
}

export default function DashboardHub() {
  const onboardingPath = localStorage.getItem('onboarding-path')
  if (onboardingPath === 'manual') {
    return <GettingStartedDashboard />
  }

  return (
    <div className="hub-page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 className="hub-title" style={{ marginBottom: 2 }}>
            <ModusWcIcon name="dashboard" size="md" decorative />
            Dashboard
          </h1>
          <span style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            Welcome back, Alex Johnson
          </span>
        </div>
        <AddButton />
      </div>

      {/* Import banner — dismissible */}
      <ImportBanner />

      {/* Strategic KPI stat cards */}
      <div className="kpi-row">
        {STAT_CARDS.map(({ label, value, sub, color, icon }) => (
          <div key={label} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="kpi-label">{label}</span>
              <ModusWcIcon name={icon} size="sm" decorative
                style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties}
              />
            </div>
            <span className="kpi-value" style={{ color, fontSize: '1.35rem' }}>{value}</span>
            <span className="kpi-sub">{sub}</span>
          </div>
        ))}
      </div>

      {/* To-Do: period-close reminders */}
      <TodoSection />

      {/* Widgets grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        alignItems: 'start',
      }}>
        <RecentJobsWidget />
        <RecentExpensesWidget />
        <RecentBillingWidget />
      </div>
    </div>
  )
}

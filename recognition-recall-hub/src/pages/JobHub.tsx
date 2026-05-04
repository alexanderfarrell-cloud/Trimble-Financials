import { useState } from 'react'
import { ModusWcBadge, ModusWcIcon, ModusWcButton } from '@trimble-oss/moduswebcomponents-react'
import JobDetail, { type HubJob } from './JobDetail'

const JOBS: HubJob[] = [
  {
    id: 'PRJ-2024-0051',
    name: 'Downtown Tower — Phase 2',
    customer: 'Meridian Construction Group',
    status: 'Active',
    contractValue: 4_200_000,
    spentPct: 68,
    pm: 'Sarah Chen',
    startDate: 'Jan 8, 2024',
    endDate: 'Nov 30, 2025',
    location: 'Portland, OR',
    costToDate: 2_856_000,
    projectedCost: 4_100_000,
    billedToDate: 3_024_000,
    collections: 2_890_000,
  },
  {
    id: 'PRJ-2024-0048',
    name: 'Highway 89 Bridge Expansion',
    customer: 'State Dept. of Transportation',
    status: 'Active',
    contractValue: 8_500_000,
    spentPct: 42,
    pm: 'Marcus Rivera',
    startDate: 'Mar 1, 2024',
    endDate: 'Sep 15, 2026',
    location: 'Salem, OR',
    costToDate: 3_570_000,
    projectedCost: 8_200_000,
    billedToDate: 3_400_000,
    collections: 3_100_000,
  },
  {
    id: 'PRJ-2024-0044',
    name: 'Lakeside Residential Complex',
    customer: 'Summit Development Corp',
    status: 'On Hold',
    contractValue: 2_100_000,
    spentPct: 31,
    pm: 'Jamie Torres',
    startDate: 'May 15, 2024',
    endDate: 'Aug 31, 2025',
    location: 'Lake Oswego, OR',
    costToDate: 651_000,
    projectedCost: 2_050_000,
    billedToDate: 630_000,
    collections: 580_000,
  },
  {
    id: 'PRJ-2023-0038',
    name: 'Airport Terminal Renovation',
    customer: 'Regional Airport Authority',
    status: 'Active',
    contractValue: 12_300_000,
    spentPct: 77,
    pm: 'Sarah Chen',
    startDate: 'Oct 1, 2023',
    endDate: 'Apr 30, 2026',
    location: 'Hillsboro, OR',
    costToDate: 9_471_000,
    projectedCost: 11_900_000,
    billedToDate: 9_225_000,
    collections: 8_800_000,
  },
  {
    id: 'PRJ-2023-0031',
    name: 'Industrial Park — Phase 1',
    customer: 'Pacific Industrial LLC',
    status: 'Completed',
    contractValue: 5_800_000,
    spentPct: 99,
    pm: 'Derek Yamamoto',
    startDate: 'Jun 1, 2023',
    endDate: 'Mar 31, 2025',
    location: 'Tualatin, OR',
    costToDate: 5_742_000,
    projectedCost: 5_742_000,
    billedToDate: 5_800_000,
    collections: 5_800_000,
  },
  {
    id: 'PRJ-2025-0067',
    name: 'Riverfront Mixed-Use Development',
    customer: 'Summit Development Corp',
    status: 'Draft',
    contractValue: 9_400_000,
    spentPct: 0,
    pm: 'Jamie Torres',
    startDate: 'TBD',
    endDate: 'TBD',
    location: 'Portland, OR',
    costToDate: 0,
    projectedCost: 9_400_000,
    billedToDate: 0,
    collections: 0,
  },
  {
    id: 'PRJ-2025-0065',
    name: 'Westside Office Campus — Phase 1',
    customer: 'Meridian Construction Group',
    status: 'Draft',
    contractValue: 6_100_000,
    spentPct: 0,
    pm: 'Sarah Chen',
    startDate: 'TBD',
    endDate: 'TBD',
    location: 'Beaverton, OR',
    costToDate: 0,
    projectedCost: 6_100_000,
    billedToDate: 0,
    collections: 0,
  },
]

const STATUS_COLOR: Record<HubJob['status'], 'success' | 'warning' | 'secondary' | 'primary'> = {
  Active: 'success',
  'On Hold': 'warning',
  Completed: 'secondary',
  Pending: 'primary',
  Draft: 'secondary',
}

type JobTab = 'All' | 'Active' | 'On Hold' | 'Completed' | 'Draft'
const JOB_TABS: JobTab[] = ['All', 'Active', 'On Hold', 'Draft', 'Completed']

type SortKey = 'name' | 'contractValue' | 'spentPct'
type SortDir  = 'asc' | 'desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name',          label: 'Name' },
  { key: 'contractValue', label: 'Contract Value' },
  { key: 'spentPct',      label: '% Spent' },
]

function fmt(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${(n / 1_000).toFixed(0)}K`
}

function progColor(pct: number) {
  if (pct >= 90) return 'var(--modus-wc-color-danger, #da212c)'
  if (pct >= 75) return 'var(--modus-wc-color-warning, #fbad26)'
  return 'var(--modus-wc-color-primary)'
}

// ─── Job card ─────────────────────────────────────────────────────────────────

function JobCard({ job, onClick }: { job: HubJob; onClick: () => void }) {
  const variance      = job.contractValue - job.projectedCost
  const variancePos   = variance >= 0

  return (
    <div
      className="vendor-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ cursor: 'pointer', gap: '0.875rem' }}
    >
      {/* Header row */}
      <div className="vendor-card-header" style={{ alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div className="vendor-card-name" style={{ marginBottom: 2 }}>{job.name}</div>
          <div className="vendor-card-specialty">{job.customer}</div>
        </div>
        <ModusWcBadge color={STATUS_COLOR[job.status]} size="sm" text={job.status} />
      </div>

      {/* Meta */}
      <div className="vendor-card-meta">
        <div className="vendor-card-row">
          <ModusWcIcon name="person" size="sm" decorative />
          {job.pm}
        </div>
        <div className="vendor-card-row">
          <ModusWcIcon name="location" size="sm" decorative />
          {job.location}
        </div>
        <div className="vendor-card-row">
          <ModusWcIcon name="calendar" size="sm" decorative />
          {job.startDate} – {job.endDate}
        </div>
      </div>

      {/* Budget progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            Budget consumed
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: progColor(job.spentPct) }}>
            {job.spentPct}%
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--modus-wc-color-base-200)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(job.spentPct, 100)}%`, background: progColor(job.spentPct), transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Financial stats */}
      <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--modus-wc-color-base-200)', paddingTop: '0.625rem' }}>
        {[
          { label: 'Contract',  value: fmt(job.contractValue) },
          { label: 'Cost To Date', value: fmt(job.costToDate) },
          { label: 'Variance',  value: (variancePos ? '+' : '') + fmt(variance), color: variancePos ? 'var(--modus-wc-color-success, #006638)' : 'var(--modus-wc-color-danger, #da212c)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
              {label}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: color ?? 'var(--modus-wc-color-base-content)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Open detail cue */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: -4 }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-primary)', fontWeight: 600 }}>View details</span>
        <ModusWcIcon name="chevron_right" size="sm" decorative />
      </div>
    </div>
  )
}

// ─── JobHub ───────────────────────────────────────────────────────────────────

export default function JobHub() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch]         = useState('')
  const [sortKey, setSortKey]       = useState<SortKey>('name')
  const [sortDir, setSortDir]       = useState<SortDir>('asc')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeTab, setActiveTab]   = useState<JobTab>('All')

  const selectedJob = JOBS.find((j) => j.id === selectedId) ?? null

  const tabCount: Record<JobTab, number> = {
    All: JOBS.length,
    Active: JOBS.filter((j) => j.status === 'Active').length,
    'On Hold': JOBS.filter((j) => j.status === 'On Hold').length,
    Completed: JOBS.filter((j) => j.status === 'Completed').length,
    Draft: JOBS.filter((j) => j.status === 'Draft').length,
  }

  const filtered = JOBS
    .filter((j) => activeTab === 'All' || j.status === activeTab)
    .filter((j) =>
      !search ||
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.customer.toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'name') return a.name.localeCompare(b.name) * mul
      return (a[sortKey] - b[sortKey]) * mul
    })

  // ── Detail view ──────────────────────────────────────────────────────────
  if (selectedJob) {
    return (
      <div className="hub-page">
        {/* Back nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <ModusWcButton
            size="sm"
            variant="borderless"
            color="secondary"
            onButtonClick={() => setSelectedId(null)}
          >
            <ModusWcIcon slot="start" name="arrow_left" size="sm" decorative />
            All Jobs
          </ModusWcButton>
          <span style={{ color: 'var(--modus-wc-color-base-300)', fontSize: '1rem' }}>/</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content)', fontWeight: 600 }}>
            {selectedJob.name}
          </span>
        </div>

        <JobDetail key={selectedJob.id} job={selectedJob} />
      </div>
    )
  }

  // ── Grid view ─────────────────────────────────────────────────────────────
  return (
    <div className="hub-page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h1 className="hub-title">
          <ModusWcIcon name="assignment" size="md" decorative />
          Jobs
        </h1>
        <span className="text-muted">{filtered.length} of {JOBS.length} jobs</span>
      </div>

      {/* Status tabs */}
      <div className="tab-bar">
        {JOB_TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? ' tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className={`tab-count${activeTab === tab ? ' tab-count--active' : ''}`}>
              {tabCount[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Search + sort toolbar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            <ModusWcIcon name="search" size="sm" decorative />
          </span>
          <input
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.4rem 0.5rem 0.4rem 2rem',
              border: '1px solid var(--modus-wc-color-base-200)',
              borderRadius: 6,
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '0.8125rem',
              background: 'var(--modus-wc-color-base-100)',
              color: 'var(--modus-wc-color-base-content)',
              outline: 'none',
            }}
          />
        </div>

        {/* Sort/filter button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setFilterOpen((o) => !o)}
            aria-label="Sort and filter"
            aria-expanded={filterOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '0.4rem 0.6rem',
              border: filterOpen ? '1px solid var(--modus-wc-color-primary)' : '1px solid var(--modus-wc-color-base-200)',
              borderRadius: 6,
              background: filterOpen ? 'color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)' : 'var(--modus-wc-color-base-100)',
              color: filterOpen ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-content)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            <ModusWcIcon name="filter_list" size="sm" decorative />
          </button>

          {filterOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                zIndex: 50,
                background: 'var(--modus-wc-color-base-page)',
                border: '1px solid var(--modus-wc-color-base-200)',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                padding: '0.75rem',
                minWidth: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                  Sort by
                </span>
                {SORT_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
                      else { setSortKey(key); setSortDir('asc') }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 5,
                      border: 'none',
                      background: sortKey === key ? 'color-mix(in srgb, var(--modus-wc-color-primary) 10%, transparent)' : 'transparent',
                      color: sortKey === key ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-content)',
                      fontFamily: 'inherit',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: sortKey === key ? 600 : 400,
                    }}
                  >
                    {label}
                    {sortKey === key && (
                      <ModusWcIcon name={sortDir === 'asc' ? 'sort_ascending' : 'sort_descending'} size="sm" decorative />
                    )}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, paddingTop: 4, borderTop: '1px solid var(--modus-wc-color-base-200)' }}>
                {(['asc', 'desc'] as SortDir[]).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => setSortDir(dir)}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      borderRadius: 5,
                      border: '1px solid',
                      borderColor: sortDir === dir ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-200)',
                      background: sortDir === dir ? 'var(--modus-wc-color-primary)' : 'transparent',
                      color: sortDir === dir ? '#fff' : 'var(--modus-wc-color-base-content)',
                      fontFamily: 'inherit',
                      fontSize: '0.75rem',
                      fontWeight: sortDir === dir ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {dir === 'asc' ? '↑ Asc' : '↓ Desc'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card grid */}
      {filtered.length > 0 ? (
        <div className="card-grid">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => setSelectedId(job.id)} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <ModusWcIcon name="search" size="lg" decorative />
          <span>No jobs match "{search}"</span>
        </div>
      )}
    </div>
  )
}

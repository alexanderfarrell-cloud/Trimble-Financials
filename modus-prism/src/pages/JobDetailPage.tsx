import React, { useState } from 'react'
import {
  ModusWcCard,
  ModusWcTypography,
  ModusWcIcon,
  ModusWcBadge,
  ModusWcButton,
  ModusWcCheckbox,
} from '@trimble-oss/moduswebcomponents-react'

export type Iteration = 1 | 2 | 3 | 4 | 5

// ─── Milestone types ─────────────────────────────────────────────────────────

interface MilestoneData {
  id: string
  name: string
  budgetPct: number       // cumulative % of total budget at this gate
  budgetAmount: number    // dollar amount at this gate
  targetDate: string      // display string e.g. "May 22"
  targetDatePct: number   // % of total job duration at which this deadline falls
  isCompleted: boolean
  completedDate?: string
}

type HealthState = 'on-track' | 'at-risk' | 'over-budget' | 'ahead'
type TickState = 'upcoming' | 'completed' | 'missed-mild' | 'missed-severe'

// ─── Job data ───────────────────────────────────────────────────────────────

const JOB = {
  name: 'Landscape Job #1',
  type: 'AI',
  customer: 'Alisson Earhart',
  lifecycleLabel: 'Estimated Job Lifecycle',
  startDate: 'May 18, 2026',
  endDate: 'June 29, 2026',
  percentComplete: 6.6,
  revenue: {
    current: 690.0,
    estimate: 5232.5,
    currentMargin: 390.0,
    estimateMargin: 682.5,
  },
  cashflow: {
    margin: 690.0,
    upcomingIncome: 690.0,
    upcomingExpense: 0.0,
  },
  costDistribution: {
    totalActual: 300.0,
    totalEstimate: 4550.0,
    categories: [
      { label: 'Material', actual: 300, estimate: 1500 },
      { label: 'Labor', actual: 0, estimate: 3050 },
      { label: 'Subcontract', actual: 0, estimate: 0 },
      { label: 'Equipment', actual: 0, estimate: 0 },
      { label: 'Other', actual: 0, estimate: 0 },
    ],
  },
}

// ─── Budget bar constants ────────────────────────────────────────────────────

const TOTAL_BUDGET = JOB.revenue.estimate       // $5,232.50
const ACTUAL_SPEND = JOB.costDistribution.totalActual  // $300.00
const SPEND_PCT    = JOB.percentComplete        // 6.6 — authoritative from job record

// ─── Timeline constants (fixed demo dates) ───────────────────────────────────
// Job: May 18 → Jun 29 = 42 days. Demo "today" = May 22 (day 4).
// targetDatePct = days from start / 42 × 100

const TOTAL_DAYS     = 42
const DAYS_ELAPSED   = 4    // May 18 → May 22
const DAYS_REMAINING = 38
const TIME_PCT       = parseFloat(((DAYS_ELAPSED / TOTAL_DAYS) * 100).toFixed(2))  // 9.52

const INITIAL_MILESTONES: MilestoneData[] = [
  {
    id: 'm1',
    name: 'Site Clearing',
    budgetPct: 5,
    budgetAmount: TOTAL_BUDGET * 0.05,
    targetDate: 'May 22',
    targetDatePct: parseFloat(((4  / TOTAL_DAYS) * 100).toFixed(2)),  // 9.52
    isCompleted: false,
  },
  {
    id: 'm2',
    name: 'Hardscape',
    budgetPct: 38,
    budgetAmount: TOTAL_BUDGET * 0.38,
    targetDate: 'Jun 5',
    targetDatePct: parseFloat(((18 / TOTAL_DAYS) * 100).toFixed(2)),  // 42.86
    isCompleted: false,
  },
  {
    id: 'm3',
    name: 'Planting & Irrigation',
    budgetPct: 72,
    budgetAmount: TOTAL_BUDGET * 0.72,
    targetDate: 'Jun 19',
    targetDatePct: parseFloat(((32 / TOTAL_DAYS) * 100).toFixed(2)),  // 76.19
    isCompleted: false,
  },
  {
    id: 'm4',
    name: 'Final Grade & Seed',
    budgetPct: 92,
    budgetAmount: TOTAL_BUDGET * 0.92,
    targetDate: 'Jun 27',
    targetDatePct: parseFloat(((40 / TOTAL_DAYS) * 100).toFixed(2)),  // 95.24
    isCompleted: false,
  },
]

// ─── Health & tick logic ─────────────────────────────────────────────────────

function computeHealth(spendPct: number, milestones: MilestoneData[]): HealthState {
  const progressPct = milestones
    .filter(m => m.isCompleted)
    .reduce((sum, m) => sum + m.budgetPct, 0)

  const maxOverrun = milestones
    .filter(m => !m.isCompleted && spendPct >= m.budgetPct)
    .reduce((max, m) => Math.max(max, spendPct - m.budgetPct), 0)

  if (maxOverrun > 10) return 'over-budget'
  if (maxOverrun > 0)  return 'at-risk'

  const gap = spendPct - progressPct
  if (gap < -10) return 'ahead'
  if (gap <= 5)  return 'on-track'
  if (gap <= 20) return 'at-risk'
  return 'over-budget'
}

function getTickState(milestone: MilestoneData, spendPct: number): TickState {
  if (milestone.isCompleted) return 'completed'
  if (spendPct >= milestone.budgetPct) {
    return (spendPct - milestone.budgetPct) > 10 ? 'missed-severe' : 'missed-mild'
  }
  return 'upcoming'
}

const HEALTH_FILL_CLASS: Record<HealthState, string> = {
  'on-track':    'budget-fill-primary',
  'at-risk':     'budget-fill-warning',
  'over-budget': 'budget-fill-danger',
  'ahead':       'budget-fill-success',
}

const HEALTH_LABEL: Record<HealthState, string> = {
  'on-track':    'On Track',
  'at-risk':     'At Risk',
  'over-budget': 'Over Budget',
  'ahead':       'Ahead of Schedule',
}

const TICK_COLOR: Record<TickState, string> = {
  upcoming:        'var(--modus-wc-color-base-300, #b0b8c1)',
  completed:       'var(--modus-wc-color-success, #006638)',
  'missed-mild':   'var(--modus-wc-color-warning, #fbad26)',
  'missed-severe': 'var(--modus-wc-color-danger,  #da212c)',
}

// ─── Utilities ──────────────────────────────────────────────────────────────

function fmt(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// ─── AI insight helper ────────────────────────────────────────────────────────

function computeAiInsight(health: HealthState, milestones: MilestoneData[], timePct: number): string {
  const overdueCount = milestones.filter(m => !m.isCompleted && timePct >= m.targetDatePct).length
  if (health === 'over-budget') {
    return 'AI: Spending pace may miss Final Grade & Seed budget gate'
  }
  if (health === 'at-risk' && overdueCount > 0) {
    return `AI: ${overdueCount} milestone${overdueCount !== 1 ? 's' : ''} past target date — consider scope review`
  }
  if (health === 'at-risk') {
    return 'AI: Spend rate approaching next milestone threshold'
  }
  return 'AI: Budget pace aligned with schedule'
}

// ─── Milestone tick ──────────────────────────────────────────────────────────

interface MilestoneTickProps {
  milestone: MilestoneData
  isHovered: boolean
  onHover: (id: string | null) => void
  onToggle: (id: string) => void
  // Budget mode
  mode?: 'budget'
  spendPct: number
  actualSpend: number
  // Schedule mode (pass mode="schedule" + timePct)
  timePct?: number
}

function MilestoneTick({
  milestone,
  isHovered,
  onHover,
  onToggle,
  mode = 'budget',
  spendPct,
  actualSpend,
  timePct = 0,
}: MilestoneTickProps) {
  const isSchedule = mode === 'schedule'

  // Position on bar and tick state differ by mode
  const posPct = isSchedule ? milestone.targetDatePct : milestone.budgetPct
  const state: TickState = isSchedule
    ? (() => {
        if (milestone.isCompleted) return 'completed'
        const overrun = timePct - milestone.targetDatePct
        if (overrun >= 0) return overrun > 10 ? 'missed-severe' : 'missed-mild'
        return 'upcoming'
      })()
    : getTickState(milestone, spendPct)

  const color   = TICK_COLOR[state]
  const dotFill = state === 'upcoming' ? 'transparent' : color

  // Tooltip edge alignment
  const tooltipStyle: React.CSSProperties =
    posPct < 25
      ? { left: 0, transform: 'none' }
      : posPct > 75
      ? { right: 0, left: 'auto', transform: 'none' }
      : { left: '50%', transform: 'translateX(-50%)' }

  // Schedule tooltip: deadline-focused
  function ScheduleTooltip() {
    const daysDiff = Math.round(((timePct - milestone.targetDatePct) / 100) * TOTAL_DAYS)
    const timeStatus =
      daysDiff === 0
        ? 'Due today'
        : daysDiff > 0
        ? `${daysDiff} day${daysDiff !== 1 ? 's' : ''} overdue`
        : `In ${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? 's' : ''}`
    const isLate = daysDiff >= 0 && !milestone.isCompleted
    return (
      <div className="milestone-tooltip" style={tooltipStyle}>
        <div className="milestone-tooltip-name">{milestone.name}</div>
        <div className="milestone-tooltip-row">
          <span className="milestone-tooltip-label">Deadline</span>
          <span className="milestone-tooltip-value">{milestone.targetDate}</span>
        </div>
        <div className="milestone-tooltip-row">
          <span className="milestone-tooltip-label">Time status</span>
          <span className={`milestone-tooltip-value ${isLate ? 'tooltip-over' : 'tooltip-under'}`}>
            {milestone.isCompleted ? 'Completed' : timeStatus}
          </span>
        </div>
        <div className="milestone-tooltip-row">
          <span className="milestone-tooltip-label">Budget gate</span>
          <span className="milestone-tooltip-value">
            {milestone.budgetPct}%&nbsp;·&nbsp;{fmt(milestone.budgetAmount)}
          </span>
        </div>
        <div className="milestone-tooltip-action">
          {milestone.isCompleted ? 'Click to undo completion' : 'Click to mark complete'}
        </div>
      </div>
    )
  }

  // Budget tooltip: spend-focused
  function BudgetTooltip() {
    const phaseOver = actualSpend > milestone.budgetAmount
    const delta     = Math.abs(actualSpend - milestone.budgetAmount)
    return (
      <div className="milestone-tooltip" style={tooltipStyle}>
        <div className="milestone-tooltip-name">{milestone.name}</div>
        <div className="milestone-tooltip-row">
          <span className="milestone-tooltip-label">Phase budget</span>
          <span className="milestone-tooltip-value">
            {fmt(milestone.budgetAmount)}&nbsp;({milestone.budgetPct}% of total)
          </span>
        </div>
        <div className="milestone-tooltip-row">
          <span className="milestone-tooltip-label">
            {phaseOver ? 'Overspent by' : 'Remaining'}
          </span>
          <span className={`milestone-tooltip-value ${phaseOver ? 'tooltip-over' : 'tooltip-under'}`}>
            {phaseOver ? `+${fmt(delta)}` : fmt(delta)}
          </span>
        </div>
        <div className="milestone-tooltip-row">
          <span className="milestone-tooltip-label">Status</span>
          <span className="milestone-tooltip-value">
            {milestone.isCompleted
              ? `Completed${milestone.completedDate ? ` ${milestone.completedDate}` : ''}`
              : `In progress · due ${milestone.targetDate}`}
          </span>
        </div>
        <div className="milestone-tooltip-action">
          {milestone.isCompleted ? 'Click to undo completion' : 'Click to mark complete'}
        </div>
      </div>
    )
  }

  return (
    <div
      className="milestone-tick-container"
      style={{ left: `${posPct}%` }}
      onMouseEnter={() => onHover(milestone.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onToggle(milestone.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(milestone.id)}
      aria-label={`${milestone.name} — ${state === 'completed' ? 'mark incomplete' : 'mark complete'}`}
    >
      {isHovered && (isSchedule ? <ScheduleTooltip /> : <BudgetTooltip />)}

      <div className="milestone-dot" style={{ background: dotFill, borderColor: color }}>
        {state === 'completed' && <span className="milestone-dot-icon">✓</span>}
        {(state === 'missed-mild' || state === 'missed-severe') && (
          <span className="milestone-dot-icon">!</span>
        )}
      </div>

      <div className="milestone-tick-line" style={{ background: color }} />
    </div>
  )
}

// ─── Budget bar ───────────────────────────────────────────────────────────────

interface BudgetBarProps {
  spendPct: number
  actualSpend: number
  milestones: MilestoneData[]
  onToggleMilestone: (id: string) => void
  showMilestones?: boolean
  aiInsight?: string
}

function BudgetBar({ spendPct, actualSpend, milestones, onToggleMilestone, showMilestones = true, aiInsight }: BudgetBarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const health         = computeHealth(spendPct, milestones)
  const completedCount = milestones.filter(m => m.isCompleted).length

  const healthColor: Record<HealthState, string> = {
    'on-track':    'var(--modus-wc-color-primary)',
    'at-risk':     'var(--modus-wc-color-warning, #fbad26)',
    'over-budget': 'var(--modus-wc-color-danger, #da212c)',
    'ahead':       'var(--modus-wc-color-success, #006638)',
  }

  return (
    <div className="budget-bar-outer">
      {/* Milestone name labels row — only when mapping is on */}
      {showMilestones && (
        <div className="budget-bar-label-row" aria-hidden="true">
          {milestones.map(m => {
            const state = getTickState(m, spendPct)
            return (
              <span
                key={m.id}
                className="milestone-name-label"
                style={{ left: `${m.budgetPct}%`, color: TICK_COLOR[state] }}
              >
                {m.name}
              </span>
            )
          })}
        </div>
      )}

      {/* Track + ticks */}
      <div className="budget-bar-track-wrap">
        <div
          className={`budget-bar-fill ${HEALTH_FILL_CLASS[health]}`}
          style={{ width: `${spendPct}%` }}
        />
        {showMilestones && milestones.map(m => (
          <MilestoneTick
            key={m.id}
            milestone={m}
            spendPct={spendPct}
            actualSpend={actualSpend}
            isHovered={hoveredId === m.id}
            onHover={setHoveredId}
            onToggle={onToggleMilestone}
          />
        ))}
      </div>

      {/* Summary line */}
      <div className="budget-bar-summary">
        <span>{spendPct.toFixed(1)}% spent</span>
        {showMilestones && (
          <>
            <span className="budget-bar-dot">·</span>
            <span>{completedCount} of {milestones.length} milestones complete</span>
          </>
        )}
        <span className="budget-bar-dot">·</span>
        <span
          className="budget-bar-health"
          style={{ color: healthColor[health] }}
        >
          {(health === 'at-risk' || health === 'over-budget') && '⚠ '}
          {HEALTH_LABEL[health]}
        </span>
        {aiInsight && (
          <>
            <span className="budget-bar-dot">·</span>
            <span className="budget-bar-ai-insight">{aiInsight}</span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Timeline bar ────────────────────────────────────────────────────────────

interface TimeBarProps {
  milestones: MilestoneData[]
  timePct: number
  daysIn: number
  daysRemaining: number
  onToggleMilestone: (id: string) => void
}

function TimeBar({ milestones, timePct, daysIn, daysRemaining, onToggleMilestone }: TimeBarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const completedCount = milestones.filter(m => m.isCompleted).length

  // Overdue = deadline reached but not signed off
  const overdueNames = milestones
    .filter(m => !m.isCompleted && timePct >= m.targetDatePct)
    .map(m => m.name)

  const deadlineMsg =
    overdueNames.length === 1
      ? `⚠ ${overdueNames[0]} due today`
      : overdueNames.length > 1
      ? `⚠ ${overdueNames.length} deadlines reached`
      : null

  return (
    <div className="budget-bar-outer">
      {/* Milestone name labels above the track at their timeline positions */}
      <div className="budget-bar-label-row" aria-hidden="true">
        {milestones.map(m => {
          const isOverdue = !m.isCompleted && timePct >= m.targetDatePct
          const color = m.isCompleted
            ? TICK_COLOR.completed
            : isOverdue
            ? TICK_COLOR['missed-mild']
            : TICK_COLOR.upcoming
          return (
            <span
              key={m.id}
              className="milestone-name-label"
              style={{ left: `${m.targetDatePct}%`, color }}
            >
              {m.name}
            </span>
          )
        })}
      </div>

      {/* Track — elapsed fill + milestone ticks + today needle */}
      <div className="budget-bar-track-wrap">
        <div
          className="budget-bar-fill budget-fill-time"
          style={{ width: `${timePct}%` }}
        />

        {/* Milestone ticks in schedule mode — interactive, at targetDatePct positions */}
        {milestones.map(m => (
          <MilestoneTick
            key={m.id}
            milestone={m}
            mode="schedule"
            timePct={timePct}
            spendPct={0}
            actualSpend={0}
            isHovered={hoveredId === m.id}
            onHover={setHoveredId}
            onToggle={onToggleMilestone}
          />
        ))}

      </div>

      {/* Summary line */}
      <div className="budget-bar-summary">
        <span>{daysIn} day{daysIn !== 1 ? 's' : ''} in</span>
        <span className="budget-bar-dot">·</span>
        <span>{completedCount} of {milestones.length} milestones complete</span>
        {deadlineMsg && (
          <>
            <span className="budget-bar-dot">·</span>
            <span
              className="budget-bar-health"
              style={{ color: 'var(--modus-wc-color-warning, #fbad26)' }}
            >
              {deadlineMsg}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Dual-axis wrapper (iteration 3+) ────────────────────────────────────────

interface DualAxisBudgetBarProps {
  spendPct: number
  actualSpend: number
  milestones: MilestoneData[]
  onToggleMilestone: (id: string) => void
  timePct: number
  daysIn: number
  daysRemaining: number
  showInsight?: boolean
}

function DualAxisBudgetBar({
  spendPct,
  actualSpend,
  milestones,
  onToggleMilestone,
  timePct,
  daysIn,
  daysRemaining,
  showInsight = false,
}: DualAxisBudgetBarProps) {
  const health    = computeHealth(spendPct, milestones)
  const aiInsight = showInsight ? computeAiInsight(health, milestones, timePct) : undefined
  return (
    <div className="dual-axis-wrap">
      {/* Budget row — clean fill bar, health color, no milestone ticks */}
      <div className="dual-axis-row dual-axis-row--bare">
        <span className="dual-axis-label">Budget</span>
        <BudgetBar
          spendPct={spendPct}
          actualSpend={actualSpend}
          milestones={milestones}
          onToggleMilestone={onToggleMilestone}
          showMilestones={false}
          aiInsight={aiInsight}
        />
      </div>

      {/* Schedule row — milestone ticks at deadline positions, check-off here */}
      <div className="dual-axis-row">
        <span className="dual-axis-label">Schedule</span>
        <TimeBar
          milestones={milestones}
          timePct={timePct}
          daysIn={daysIn}
          daysRemaining={daysRemaining}
          onToggleMilestone={onToggleMilestone}
        />
      </div>
    </div>
  )
}

// ─── Milestone list panel (iteration 4+) ─────────────────────────────────────

interface MilestoneListPanelProps {
  milestones: MilestoneData[]
  timePct: number
  onToggle: (id: string) => void
  onManage: () => void
}

function MilestoneListPanel({ milestones, timePct, onToggle, onManage }: MilestoneListPanelProps) {
  return (
    <div className="milestone-list">
      <div className="milestone-list-title-row">
        <span className="milestone-list-title">Milestones</span>
        <ModusWcButton
          size="sm"
          variant="borderless"
          color="secondary"
          onButtonClick={onManage}
        >
          Manage
        </ModusWcButton>
      </div>
      <div className="milestone-list-header">
        <span />
        <span>Milestone</span>
        <span>Target</span>
        <span>Budget gate</span>
        <span>Status</span>
      </div>
      {milestones.map(m => {
        const isOverdue = !m.isCompleted && timePct >= m.targetDatePct
        const badgeColor: 'success' | 'danger' | 'secondary' = m.isCompleted
          ? 'success'
          : isOverdue
          ? 'danger'
          : 'secondary'
        const badgeVariant: 'filled' | 'outlined' = m.isCompleted || isOverdue ? 'filled' : 'outlined'
        const statusLabel = m.isCompleted ? 'Completed' : isOverdue ? 'Overdue' : 'Upcoming'
        return (
          <div key={m.id} className={`milestone-list-row${m.isCompleted ? ' milestone-list-row--done' : ''}`}>
            <div className="milestone-list-check">
              <ModusWcCheckbox
                value={m.isCompleted}
                size="sm"
                aria-label={`Mark ${m.name} ${m.isCompleted ? 'incomplete' : 'complete'}`}
                onInputChange={() => onToggle(m.id)}
              />
            </div>
            <span className="milestone-list-name">{m.name}</span>
            <span className="milestone-list-date">{m.targetDate}</span>
            <span className="milestone-list-budget">{fmt(m.budgetAmount)}</span>
            <div className="milestone-list-badge">
              <ModusWcBadge color={badgeColor} variant={badgeVariant} size="sm">
                {statusLabel}
              </ModusWcBadge>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Milestone side panel (iteration 4+) ─────────────────────────────────────

interface MilestoneSidePanelProps {
  milestones: MilestoneData[]
  timePct: number
  onClose: () => void
  onToggle: (id: string) => void
  onUpdateName: (id: string, name: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

function MilestoneSidePanel({
  milestones,
  timePct,
  onClose,
  onToggle,
  onUpdateName,
  onDelete,
  onAdd,
}: MilestoneSidePanelProps) {
  return (
    <>
      <div className="milestone-panel-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="milestone-side-panel" role="dialog" aria-label="Manage Milestones">
        <div className="milestone-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModusWcIcon name="flag" decorative />
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Manage Milestones" />
          </div>
          <ModusWcButton
            size="sm"
            variant="borderless"
            color="tertiary"
            shape="square"
            aria-label="Close panel"
            onButtonClick={onClose}
          >
            <ModusWcIcon name="close" size="sm" decorative />
          </ModusWcButton>
        </div>

        <div className="milestone-panel-body">
          {milestones.map(m => {
            const isOverdue = !m.isCompleted && timePct >= m.targetDatePct
            return (
              <div key={m.id} className="milestone-panel-row">
                <div className="milestone-panel-row-top">
                  <ModusWcCheckbox
                    value={m.isCompleted}
                    size="sm"
                    aria-label={`Mark ${m.name} ${m.isCompleted ? 'incomplete' : 'complete'}`}
                    onInputChange={() => onToggle(m.id)}
                  />
                  <input
                    className="milestone-panel-name-input"
                    value={m.name}
                    onChange={e => onUpdateName(m.id, e.target.value)}
                    aria-label="Milestone name"
                  />
                  <ModusWcButton
                    size="sm"
                    variant="borderless"
                    color="tertiary"
                    shape="square"
                    aria-label={`Delete ${m.name}`}
                    onButtonClick={() => onDelete(m.id)}
                  >
                    <ModusWcIcon name="delete" size="sm" decorative />
                  </ModusWcButton>
                </div>
                <div className="milestone-panel-row-meta">
                  <span className="milestone-panel-meta-item">
                    <span className="milestone-panel-meta-label">Target&nbsp;</span>
                    {m.targetDate || '—'}
                  </span>
                  <span className="milestone-panel-meta-item">
                    <span className="milestone-panel-meta-label">Budget&nbsp;</span>
                    {fmt(m.budgetAmount)}&nbsp;({m.budgetPct}%)
                  </span>
                  {isOverdue && (
                    <span className="milestone-panel-overdue">⚠ Overdue</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="milestone-panel-footer">
          <ModusWcButton
            size="sm"
            variant="outlined"
            color="secondary"
            onButtonClick={onAdd}
          >
            Add Milestone
          </ModusWcButton>
        </div>
      </div>
    </>
  )
}

// ─── Shared primitives ──────────────────────────────────────────────────────

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="rev-track">
      <div className="rev-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── Revenue & Margin card ──────────────────────────────────────────────────

function RevenueMarginCard({ iteration }: { iteration: Iteration }) {
  const { revenue } = JOB
  void iteration // future iterations will modify this card

  return (
    <ModusWcCard bordered={false} padding="compact">
      <div slot="title" className="flex w-full items-center justify-between gap-2">
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Revenue & Margin" />
        <span className="badge-to-date">To Date</span>
      </div>

      <div className="flex flex-col gap-3 pt-1">
        {/* Revenue row */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex flex-col">
              <span className="label-muted">Current Revenue:</span>
              <span className="amount-current">{fmt(revenue.current)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="label-muted">Estimate Revenue:</span>
              <span className="amount-secondary">{fmt(revenue.estimate)}</span>
            </div>
          </div>
          <ProgressBar value={revenue.current} max={revenue.estimate} />
        </div>

        {/* Margin row */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex flex-col">
              <span className="label-muted">Current Margin:</span>
              <span className="amount-current">{fmt(revenue.currentMargin)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="label-muted">Estimate Margin:</span>
              <span className="amount-secondary">{fmt(revenue.estimateMargin)}</span>
            </div>
          </div>
          <ProgressBar value={revenue.currentMargin} max={revenue.estimateMargin} />
        </div>
      </div>
    </ModusWcCard>
  )
}

// ─── Chart helpers ───────────────────────────────────────────────────────────

function getNiceTicks(max: number, targetCount = 10) {
  if (max === 0) return { ticks: [0], niceMax: 0 }
  const rawStep = max / targetCount
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const niceStep = Math.ceil(rawStep / magnitude) * magnitude
  const niceMax = Math.ceil(max / niceStep) * niceStep
  const ticks: number[] = []
  for (let v = 0; v <= niceMax + niceStep * 0.01; v += niceStep) {
    ticks.push(Math.round(v))
  }
  return { ticks, niceMax }
}

function fmtTick(n: number) {
  return n >= 1000 ? n.toLocaleString() : String(n)
}

// ─── Job Cost Distribution card ─────────────────────────────────────────────

const LABEL_W = 76  // px — y-axis label column width
const ROW_H   = 36  // px — height of each category row

function CostDistributionCard({ iteration }: { iteration: Iteration }) {
  const { costDistribution } = JOB
  void iteration

  const { ticks, niceMax } = getNiceTicks(costDistribution.totalEstimate)
  const totalRows = costDistribution.categories.length
  const chartH = totalRows * ROW_H

  return (
    <ModusWcCard bordered={false} padding="compact">
      <div slot="title" className="flex w-full items-center justify-between gap-2">
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Job Cost Distribution" />
        <span className="badge-to-date">To Date</span>
      </div>

      <div className="flex flex-col gap-3 pt-1">
        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="legend-dot-actual" />
            <span className="label-body">Total Actual</span>
            <span className="label-value">{fmt(costDistribution.totalActual)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="legend-dot-estimate" />
            <span className="label-body">Total Estimate</span>
            <span className="label-value">{fmt(costDistribution.totalEstimate)}</span>
          </div>
        </div>

        {/* Chart: y-labels + bar area */}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>

          {/* Y-axis label column */}
          <div style={{ width: LABEL_W, flexShrink: 0 }}>
            {costDistribution.categories.map((cat) => (
              <div
                key={cat.label}
                style={{
                  height: ROW_H,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 8,
                  fontSize: '0.72rem',
                  color: 'var(--modus-wc-color-base-content-low-contrast)',
                }}
              >
                {cat.label}
              </div>
            ))}
            {/* spacer to align with x-axis row */}
            <div style={{ height: 20 }} />
          </div>

          {/* Bar + axis area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Bar rows + grid lines */}
            <div style={{ position: 'relative', height: chartH }}>
              {/* Vertical grid lines */}
              {ticks.map((tick) => (
                <div
                  key={tick}
                  style={{
                    position: 'absolute',
                    left: niceMax > 0 ? `${(tick / niceMax) * 100}%` : '0%',
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: 'var(--modus-wc-color-base-200)',
                  }}
                />
              ))}

              {/* Bars */}
              {costDistribution.categories.map((cat) => {
                const actualPct  = niceMax > 0 ? Math.min(100, (cat.actual   / niceMax) * 100) : 0
                const estimatePct = niceMax > 0 ? Math.min(100, (cat.estimate / niceMax) * 100) : 0
                return (
                  <div
                    key={cat.label}
                    style={{
                      height: ROW_H,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: 3,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Actual bar */}
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--modus-wc-color-primary)', width: cat.actual > 0 ? `${actualPct}%` : 0 }} />
                    {/* Estimate bar */}
                    <div style={{ height: 8, borderRadius: 4, background: '#e07b16', width: cat.estimate > 0 ? `${estimatePct}%` : 0 }} />
                  </div>
                )
              })}
            </div>

            {/* X-axis line */}
            <div style={{ height: 1, background: 'var(--modus-wc-color-base-200)' }} />

            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {ticks.map((tick) => (
                <span
                  key={tick}
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--modus-wc-color-base-content-low-contrast)',
                    lineHeight: 1,
                  }}
                >
                  {fmtTick(tick)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModusWcCard>
  )
}

// ─── Upcoming Cashflow card ──────────────────────────────────────────────────

function CashflowCard({ iteration }: { iteration: Iteration }) {
  const { cashflow } = JOB
  const incomePct = cashflow.upcomingIncome > 0 ? 100 : 0
  void iteration

  return (
    <ModusWcCard bordered={false} padding="compact">
      <div slot="title" className="flex w-full items-center justify-between gap-2">
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Upcoming Cashflow" />
        <span className="badge-to-date">To Date</span>
      </div>

      <div className="flex flex-col gap-3 pt-1">
        {/* Margin */}
        <div className="flex items-center justify-between gap-2">
          <span className="label-body">Margin</span>
          <div className="flex items-center gap-2">
            <span className="amount-secondary">{fmt(cashflow.margin)}</span>
            <span className="badge-success">
              <ModusWcIcon name="check" size="xs" decorative />
            </span>
          </div>
        </div>

        <div className="card-row-divider" />

        {/* Upcoming Income */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="link-text">Upcoming Income</span>
            <span className="amount-secondary">{fmt(cashflow.upcomingIncome)}</span>
          </div>
          <div className="cashflow-track">
            <div className="cashflow-fill" style={{ width: `${incomePct}%` }} />
          </div>
        </div>

        <div className="card-row-divider" />

        {/* Upcoming Expense */}
        <div className="flex items-center justify-between gap-2">
          <span className="link-text">Upcoming Expense</span>
          <span className="amount-secondary">{fmt(cashflow.upcomingExpense)}</span>
        </div>
      </div>
    </ModusWcCard>
  )
}

// ─── Placeholder tabs ────────────────────────────────────────────────────────

function TransactionsTab() {
  return (
    <ModusWcCard bordered={false} padding="compact">
      <div slot="title" className="flex w-full items-center justify-start gap-2">
        <ModusWcIcon name="receipt" decorative />
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Transactions" />
      </div>
      <div style={{ padding: '2rem 0', textAlign: 'center' }}>
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          label="No transactions to display."
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
        />
      </div>
    </ModusWcCard>
  )
}

function ContractTab() {
  return (
    <ModusWcCard bordered={false} padding="compact">
      <div slot="title" className="flex w-full items-center justify-start gap-2">
        <ModusWcIcon name="description" decorative />
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Contract" />
      </div>
      <div style={{ padding: '2rem 0', textAlign: 'center' }}>
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          label="No contract information available."
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
        />
      </div>
    </ModusWcCard>
  )
}

// ─── Overview tab ────────────────────────────────────────────────────────────

function OverviewTab({ iteration }: { iteration: Iteration }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr minmax(0, 420px)',
          gap: '0.75rem',
          alignItems: 'start',
        }}
      >
        <div className="flex flex-col gap-3">
          <RevenueMarginCard iteration={iteration} />
          <CostDistributionCard iteration={iteration} />
        </div>
        <CashflowCard iteration={iteration} />
      </div>
    </div>
  )
}

// ─── Tab config ──────────────────────────────────────────────────────────────

type Tab = 'overview' | 'transactions' | 'contract'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'transactions', label: 'Transactions', icon: 'receipt' },
  { id: 'contract', label: 'Contract', icon: 'description' },
]

// ─── JobDetailPage ───────────────────────────────────────────────────────────

export default function JobDetailPage({ iteration }: { iteration: Iteration }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [milestones, setMilestones] = useState<MilestoneData[]>(INITIAL_MILESTONES)
  const [panelOpen, setPanelOpen] = useState(false)

  const toggleMilestone = (id: string) => {
    setMilestones(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              isCompleted: !m.isCompleted,
              completedDate: !m.isCompleted
                ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : undefined,
            }
          : m
      )
    )
  }

  const updateMilestoneName = (id: string, name: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, name } : m))
  }

  const deleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id))
  }

  const addMilestone = () => {
    setMilestones(prev => [
      ...prev,
      {
        id: `m${Date.now()}`,
        name: 'New Milestone',
        budgetPct: 0,
        budgetAmount: 0,
        targetDate: '',
        targetDatePct: 0,
        isCompleted: false,
      },
    ])
  }

  return (
    <div className="prism-page">
      {/* Job Header */}
      <div className="job-header">
        <ModusWcTypography hierarchy="h1" size="xl" weight="bold" label={JOB.name} />
        <div style={{ marginTop: '2px', marginBottom: '10px' }}>
          <ModusWcTypography
            hierarchy="p"
            size="md"
            weight="semibold"
            label={JOB.customer}
            customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <ModusWcTypography
            hierarchy="p"
            size="xs"
            label={JOB.lifecycleLabel}
            customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
          />
          <div style={{ marginTop: '2px' }}>
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              weight="semibold"
              label={`${JOB.startDate} - ${JOB.endDate}`}
            />
          </div>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <ModusWcTypography
            hierarchy="p"
            size="xs"
            label="Budget Consumed"
            customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
          />
          <div style={{ marginTop: '6px' }}>
            {iteration >= 3 ? (
              <DualAxisBudgetBar
                spendPct={SPEND_PCT}
                actualSpend={ACTUAL_SPEND}
                milestones={milestones}
                onToggleMilestone={toggleMilestone}
                timePct={TIME_PCT}
                daysIn={DAYS_ELAPSED}
                daysRemaining={DAYS_REMAINING}
                showInsight={iteration >= 4}
              />
            ) : (
              <BudgetBar
                spendPct={SPEND_PCT}
                actualSpend={ACTUAL_SPEND}
                milestones={milestones}
                onToggleMilestone={toggleMilestone}
                showMilestones={iteration >= 2}
              />
            )}
            {iteration >= 4 && (
              <MilestoneListPanel
                milestones={milestones}
                timePct={TIME_PCT}
                onToggle={toggleMilestone}
                onManage={() => setPanelOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
          >
            <ModusWcIcon name={tab.icon} size="sm" decorative />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewTab iteration={iteration} />}
      {activeTab === 'transactions' && <TransactionsTab />}
      {activeTab === 'contract' && <ContractTab />}

      {/* Back link */}
      <div style={{ marginTop: '1.5rem' }}>
        <span className="back-link">Back</span>
      </div>

      {/* Milestone side panel — portal-like, renders outside the page flow */}
      {iteration >= 4 && panelOpen && (
        <MilestoneSidePanel
          milestones={milestones}
          timePct={TIME_PCT}
          onClose={() => setPanelOpen(false)}
          onToggle={toggleMilestone}
          onUpdateName={updateMilestoneName}
          onDelete={deleteMilestone}
          onAdd={addMilestone}
        />
      )}
    </div>
  )
}

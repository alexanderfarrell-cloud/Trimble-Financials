import { useNavigate } from "react-router-dom"
import { ModusWcIcon, ModusWcButton, ModusWcTypography } from "@trimble-oss/moduswebcomponents-react"
import { usePeriodsContext } from "../context/PeriodsContext"
import type { FiscalPeriod } from "../data/periods"

function MonthCard({ period }: { period: FiscalPeriod }) {
  const navigate = useNavigate()
  const isClosed = period.status === "closed"
  const monthShort = period.label.split(" ")[0]
  return (
    <div style={{
      border: `1px solid ${isClosed ? "var(--modus-wc-color-base-200)" : "var(--modus-wc-color-base-200)"}`,
      borderRadius: 10,
      padding: "1rem",
      background: isClosed ? "var(--modus-wc-color-base-100)" : "var(--modus-wc-color-base-page)",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--modus-wc-color-base-content)" }}>{monthShort}</span>
        <span style={{
          display: "inline-flex", alignItems: "center", padding: "2px 8px",
          borderRadius: 99, fontSize: "0.65rem", fontWeight: 700,
          background: isClosed ? "var(--modus-wc-color-base-200)" : "color-mix(in srgb, var(--modus-wc-color-success, #006638) 12%, transparent)",
          color: isClosed ? "var(--modus-wc-color-base-content-low-contrast)" : "var(--modus-wc-color-success, #006638)",
        }}>
          {isClosed ? "Closed" : "Open"}
        </span>
      </div>
      <span style={{ fontSize: "0.7rem", color: "var(--modus-wc-color-base-content-low-contrast)", lineHeight: 1.4 }}>
        {period.startDate.slice(5).replace("-", "/")} – {period.endDate.slice(5).replace("-", "/")}
      </span>
      <ModusWcButton
        onButtonClick={() => navigate(isClosed ? `/periods/reopen?id=${period.id}` : `/periods/close?id=${period.id}`)}
        variant="outlined"
        color="primary"
        size="sm"
        fullWidth
        className="month-card-action"
      >
        {isClosed ? "Reopen" : "Close"}
      </ModusWcButton>
    </div>
  )
}

export default function PeriodWorkspacePage() {
  const navigate = useNavigate()
  const { periods } = usePeriodsContext()
  const today = new Date()
  const openCount = periods.filter((p) => p.status === "open").length
  const closedCount = periods.filter((p) => p.status === "closed").length
  const currentPeriod = periods.find((p) => new Date(p.startDate) <= today && new Date(p.endDate) >= today)
  const years = [...new Set(periods.map((p) => p.year))].sort()

  return (
    <div className="hub-page">
      <div style={{ flexShrink: 0 }}>
        <div className="hub-title">
          <ModusWcIcon name="calendar_today" size="md" decorative />
          <ModusWcTypography hierarchy="h1" customClass="hub-title-text" label="Fiscal Periods" />
        </div>
      </div>

      <ModusWcTypography
        hierarchy="p"
        customClass="period-intro"
        label="Close months to lock your books. Reopen them any time to make corrections."
      />

      <div className="kpi-row">
        <div className="kpi-card">
          <ModusWcTypography hierarchy="p" size="xs" weight="bold" customClass="kpi-label" label="Current Period" />
          <span className="kpi-value" style={{ fontSize: "1.1rem" }}>{currentPeriod?.label ?? "—"}</span>
          <span className="kpi-sub">Active accounting month</span>
        </div>
        <div className="kpi-card">
          <ModusWcTypography hierarchy="p" size="xs" weight="bold" customClass="kpi-label" label="Open Periods" />
          <span className="kpi-value kpi-value--success">{openCount}</span>
          <span className="kpi-sub">Transactions allowed</span>
        </div>
        <div className="kpi-card">
          <ModusWcTypography hierarchy="p" size="xs" weight="bold" customClass="kpi-label" label="Closed Periods" />
          <span className="kpi-value">{closedCount}</span>
          <span className="kpi-sub">Locked from changes</span>
        </div>
      </div>

      {years.map((year) => (
        <div key={year}>
          <ModusWcTypography hierarchy="h2" customClass="period-year-heading" label={String(year)} />
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {periods.filter((p) => p.year === year).map((period) => (
              <MonthCard key={period.id} period={period} />
            ))}
          </div>
        </div>
      ))}

      <div style={{ paddingTop: "0.5rem" }}>
        <ModusWcButton
          onButtonClick={() => navigate('/accounting')}
          variant="borderless"
          color="primary"
          size="sm"
          customClass="link-underline"
        >
          Back to Accounting
        </ModusWcButton>
      </div>
    </div>
  )
}
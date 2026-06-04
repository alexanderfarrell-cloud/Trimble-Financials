import React from "react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ModusWcIcon, ModusWcButton, ModusWcTypography } from "@trimble-oss/moduswebcomponents-react"
import { usePeriodsContext } from "../context/PeriodsContext"
import type { FiscalPeriod } from "../data/periods"

function CalendarUnlockIllustration() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <div style={{ width: 200, height: 200, borderRadius: "40% 60% 45% 55% / 55% 45% 60% 40%", background: "color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <ModusWcIcon name="calendar_today" size="lg" decorative style={{ color: "var(--modus-wc-color-primary)", opacity: 0.9 } as React.CSSProperties} />
            <ModusWcIcon name="lock_open" size="md" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />
          </div>
        </div>
      </div>
    </div>
  )
}

function WizardShell({
  title, question, illustration, children, onCancel, onNext, nextLabel = "→", nextDisabled = false, showBack = false, onBack,
}: {
  title: string; question: string; illustration: React.ReactNode; children: React.ReactNode
  onCancel: () => void; onNext: () => void; nextLabel?: string; nextDisabled?: boolean
  showBack?: boolean; onBack?: () => void
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--modus-wc-color-base-page)" }}>
      <div className="wizard-header" style={{ borderBottom: "1px solid var(--modus-wc-color-base-200)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--modus-wc-color-base-content)", marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--modus-wc-color-base-content-low-contrast)" }}>{question}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ModusWcIcon name="lock_open" size="sm" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />
          </div>
          <ModusWcButton onButtonClick={onCancel} aria-label="Close" variant="borderless" color="secondary" shape="square" size="sm">
            <ModusWcIcon name="close" size="sm" decorative />
          </ModusWcButton>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", gap: 0, overflow: "hidden" }}>
        <div className="wizard-content" style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>{children}</div>
        <div className="wizard-illustration-panel" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          {illustration}
        </div>
      </div>

      <div className="wizard-footer" style={{ borderTop: "1px solid var(--modus-wc-color-base-200)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 16 }}>
          {showBack && (
            <ModusWcButton onButtonClick={onBack} variant="borderless" color="primary" size="sm" customClass="link-underline">Back</ModusWcButton>
          )}
        </div>
        {nextLabel === "→" ? (
          <ModusWcButton
            onButtonClick={onNext}
            disabled={nextDisabled}
            color="primary"
            shape="circle"
            size="lg"
            aria-label="Next"
          >
            <ModusWcIcon name="arrow_forward" size="sm" decorative />
          </ModusWcButton>
        ) : (
          <ModusWcButton
            onButtonClick={onNext}
            disabled={nextDisabled}
            color="primary"
            shape="ellipse"
          >
            <ModusWcIcon slot="start" name="lock_open" size="xs" decorative />
            {nextLabel}
          </ModusWcButton>
        )}
      </div>
    </div>
  )
}

function PeriodPickerCard({ period, selected, onClick }: { period: FiscalPeriod; selected: boolean; onClick: () => void }) {
  return (
    <ModusWcButton
      onButtonClick={onClick}
      variant="borderless"
      color="secondary"
      className={`period-picker-host${selected ? " is-selected" : ""}`}
    >
      <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--modus-wc-color-base-content)" }}>{period.label.split(" ")[0]}</span>
      <span style={{ fontSize: "0.72rem", color: "var(--modus-wc-color-base-content-low-contrast)" }}>{period.year}</span>
      {selected && <ModusWcIcon name="check_circle" size="xs" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />}
    </ModusWcButton>
  )
}

export default function ReopenPeriodWizard() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { periods, reopenPeriod } = usePeriodsContext()
  const closedPeriods = periods.filter((p) => p.status === "closed")
  const preselect = params.get("id")
  const [step, setStep] = useState(preselect ? 2 : 1)
  const [selectedId, setSelectedId] = useState<string>(preselect ?? closedPeriods[0]?.id ?? "")
  const [showConfirm, setShowConfirm] = useState(false)
  const selected = periods.find((p) => p.id === selectedId) ?? null

  const cancel = () => navigate("/periods")

  if (step === 3) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", gap: "1.5rem", padding: "3rem", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "color-mix(in srgb, var(--modus-wc-color-primary) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ModusWcIcon name="lock_open" size="lg" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />
        </div>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--modus-wc-color-base-content)", marginBottom: 8 }}>
            {selected?.label} is now open
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--modus-wc-color-base-content-low-contrast)", maxWidth: 380 }}>
            {selected?.label} is now unlocked. Any new or edited transactions will automatically update your current balances.
          </div>
        </div>
        <ModusWcButton onButtonClick={() => navigate("/periods")} color="primary" shape="ellipse">
          Done
        </ModusWcButton>
      </div>
    )
  }

  if (step === 2) {
    return (
      <>
        {showConfirm && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reopen-confirm-title"
            style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}
          >
            <div style={{ background: "var(--modus-wc-color-base-page)", borderRadius: 14, padding: "2rem", maxWidth: 400, width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb, var(--modus-wc-color-primary) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ModusWcIcon name="lock_open" size="sm" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />
                </div>
                <div id="reopen-confirm-title" style={{ fontWeight: 700, fontSize: "1rem", color: "var(--modus-wc-color-base-content)" }}>
                  Reopen {selected?.label}?
                </div>
              </div>
              <ModusWcTypography hierarchy="p" customClass="wizard-body--muted" label="">
                This will unlock <strong>{selected?.label}</strong>. Your other months stay safely locked. You can close it again at any time.
              </ModusWcTypography>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <ModusWcButton
                  onButtonClick={() => setShowConfirm(false)}
                  variant="outlined"
                  color="secondary"
                  shape="ellipse"
                >
                  Cancel
                </ModusWcButton>
                <ModusWcButton
                  onButtonClick={() => { if (selected) { reopenPeriod(selected.id); setShowConfirm(false); setStep(3) } }}
                  color="primary"
                  shape="ellipse"
                >
                  <ModusWcIcon slot="start" name="lock_open" size="xs" decorative />
                  Yes, Reopen Period
                </ModusWcButton>
              </div>
            </div>
          </div>
        )}
        <WizardShell
        title="Reopen a Period"
        question={`Reopen ${selected?.label ?? "this period"}?`}
        illustration={<CalendarUnlockIllustration />}
        onCancel={cancel}
        onNext={() => setShowConfirm(true)}
        nextLabel="Reopen Period"
        showBack
        onBack={cancel}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 440 }}>
          <div style={{ background: "var(--modus-wc-color-base-100)", borderRadius: 10, padding: "1.25rem", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "color-mix(in srgb, var(--modus-wc-color-primary) 10%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ModusWcIcon name="calendar_today" size="sm" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--modus-wc-color-base-content)" }}>{selected?.label}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--modus-wc-color-base-content-low-contrast)" }}>{selected?.startDate} to {selected?.endDate}</div>
            </div>
          </div>

          <ModusWcTypography hierarchy="p" customClass="wizard-body" label="">
            Unlocking this period will allow transactions in <strong>{selected?.label}</strong> to be created and edited again.
          </ModusWcTypography>

          <div style={{ background: "color-mix(in srgb, var(--modus-wc-color-primary) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--modus-wc-color-primary) 20%, transparent)", borderRadius: 10, padding: "1rem", display: "flex", gap: 12 }}>
            <ModusWcIcon name="info" size="sm" decorative style={{ color: "var(--modus-wc-color-primary)", flexShrink: 0, marginTop: 2 } as React.CSSProperties} />
            <div style={{ fontSize: "0.8125rem", color: "var(--modus-wc-color-base-content)" }}>
              This will only unlock <strong>{selected?.label}</strong>. Your other months will remain safely locked. Any new or edited transactions will automatically update your current balances.
            </div>
          </div>

          <ModusWcTypography hierarchy="p" customClass="wizard-body--muted" label="You can close this period again at any time." />
        </div>
        </WizardShell>
      </>
    )
  }

  return (
    <WizardShell
      title="Reopen a Period"
      question="Which month do you want to reopen?"
      illustration={<CalendarUnlockIllustration />}
      onCancel={cancel}
      onNext={() => setStep(2)}
      nextDisabled={!selectedId}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <ModusWcTypography hierarchy="p" customClass="wizard-intro" label="Select the closed month you want to re-open for corrections." />
        {[2025, 2026].map((year) => {
          const rows = closedPeriods.filter((p) => p.year === year)
          if (!rows.length) return null
          return (
            <div key={year}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--modus-wc-color-base-content-low-contrast)", marginBottom: "0.5rem" }}>{year}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.625rem" }}>
                {rows.map((p) => (
                  <PeriodPickerCard key={p.id} period={p} selected={selectedId === p.id} onClick={() => setSelectedId(p.id)} />
                ))}
              </div>
            </div>
          )
        })}
        {!closedPeriods.length && (
          <div style={{ color: "var(--modus-wc-color-base-content-low-contrast)", fontSize: "0.875rem" }}>No closed periods found.</div>
        )}
      </div>
    </WizardShell>
  )
}
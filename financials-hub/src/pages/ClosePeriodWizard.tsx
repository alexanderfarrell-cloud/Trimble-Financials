import React from "react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ModusWcIcon, ModusWcButton, ModusWcTypography } from "@trimble-oss/moduswebcomponents-react"
import { usePeriodsContext } from "../context/PeriodsContext"
import type { FiscalPeriod } from "../data/periods"


function CalendarLockIllustration({ open = false }: { open?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <div style={{ width: 200, height: 200, borderRadius: "60% 40% 55% 45% / 45% 55% 45% 55%", background: "color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <ModusWcIcon name="calendar_today" size="lg" decorative style={{ color: "var(--modus-wc-color-primary)", opacity: 0.9 } as React.CSSProperties} />
            <ModusWcIcon name={open ? "lock_open" : "lock"} size="md" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />
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
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <ModusWcIcon name="lock" size="sm" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />
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
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
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
            <ModusWcIcon slot="start" name="lock" size="xs" decorative />
            Close Period
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

export default function ClosePeriodWizard() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { periods, closePeriod } = usePeriodsContext()
  const openPeriods = periods.filter((p) => p.status === "open")
  const preselect = params.get("id")
  const [step, setStep] = useState(preselect ? 2 : 1)
  const [selectedId, setSelectedId] = useState<string>(preselect ?? openPeriods[0]?.id ?? "")
  const [showConfirm, setShowConfirm] = useState(false)
  const selected = periods.find((p) => p.id === selectedId) ?? null

  const cancel = () => navigate("/periods")

  const handleConfirmClose = () => {
    if (selected) { closePeriod(selected.id); setShowConfirm(false); setStep(3) }
  }

  if (step === 3) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", gap: "1.5rem", padding: "3rem", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "color-mix(in srgb, var(--modus-wc-color-success, #006638) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ModusWcIcon name="check_circle" size="lg" decorative style={{ color: "var(--modus-wc-color-success, #006638)" } as React.CSSProperties} />
        </div>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--modus-wc-color-base-content)", marginBottom: 8 }}>
            {selected?.label} is now closed
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--modus-wc-color-base-content-low-contrast)", maxWidth: 380 }}>
            Your books for {selected?.label} are locked. No transactions can be created, edited, or deleted in this period.
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
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div style={{ background: "var(--modus-wc-color-base-page)", borderRadius: 16, padding: "2rem", maxWidth: 420, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", position: "relative" }}>
              <ModusWcButton
                onButtonClick={() => setShowConfirm(false)}
                aria-label="Cancel"
                variant="outlined"
                color="secondary"
                shape="circle"
                size="sm"
                style={{ position: "absolute", top: 16, right: 16 } as React.CSSProperties}
              >
                <ModusWcIcon name="close" size="xs" decorative />
              </ModusWcButton>
              <div style={{ fontWeight: 300, fontSize: "1.125rem", color: "var(--modus-wc-color-base-content)", marginBottom: "0.75rem" }}>
                Close {selected?.label}?
              </div>
              <ModusWcTypography hierarchy="p" customClass="wizard-modal-body" label="">
                Locks all transactions in <strong style={{ color: "var(--modus-wc-color-base-content)", fontWeight: 600 }}>{selected?.label}</strong>. You can reopen it later if needed.
              </ModusWcTypography>
              <ModusWcTypography hierarchy="p" customClass="wizard-modal-reminder" label="">
                <strong style={{ color: "var(--modus-wc-color-base-content)", fontWeight: 600 }}>Reminder:</strong> unpaid and uncollected invoices in this period will be rolled over to the next period if they are not collected or paid.
              </ModusWcTypography>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <ModusWcButton
                  onButtonClick={() => setShowConfirm(false)}
                  variant="filled"
                  color="secondary"
                  shape="ellipse"
                >
                  Cancel
                </ModusWcButton>
                <ModusWcButton
                  onButtonClick={handleConfirmClose}
                  color="primary"
                  shape="ellipse"
                >
                  <ModusWcIcon slot="start" name="lock" size="xs" decorative />
                  Yes, Close Period
                </ModusWcButton>
              </div>
            </div>
          </div>
        )}
        <WizardShell
          title="Close a Period"
          question={`Ready to close ${selected?.label ?? "this period"}?`}
          illustration={<CalendarLockIllustration />}
          onCancel={cancel}
          onNext={() => setShowConfirm(true)}
          nextLabel="Close Period"
          showBack
          onBack={() => navigate("/periods")}
        >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 440 }}>
          <div style={{ background: "var(--modus-wc-color-base-page)", border: "1px solid var(--modus-wc-color-base-200)", borderRadius: 10, padding: "1.25rem", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "color-mix(in srgb, var(--modus-wc-color-primary) 10%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ModusWcIcon name="calendar_today" size="sm" decorative style={{ color: "var(--modus-wc-color-primary)" } as React.CSSProperties} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--modus-wc-color-base-content)" }}>{selected?.label}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--modus-wc-color-base-content-low-contrast)" }}>{selected?.startDate} to {selected?.endDate}</div>
            </div>
          </div>

          <ModusWcTypography hierarchy="p" customClass="wizard-body" label="">
            Closing this period will <strong>lock all transactions</strong> in {selected?.label}. Nothing can be created, edited, or deleted in a closed period.
          </ModusWcTypography>

          {(selected?.id === "2025-05" || selected?.id === "2025-06") && (
            <div style={{
              borderRadius: 10,
              border: "1.5px solid color-mix(in srgb, var(--modus-wc-color-danger, #da212c) 35%, transparent)",
              background: "color-mix(in srgb, var(--modus-wc-color-danger, #da212c) 8%, transparent)",
              padding: "1.25rem 1.25rem 1.25rem 1rem",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb, var(--modus-wc-color-danger, #da212c) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <ModusWcIcon name="warning" size="sm" decorative style={{ color: "var(--modus-wc-color-danger, #da212c)" } as React.CSSProperties} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--modus-wc-color-danger, #da212c)", marginBottom: 6 }}>
                  You have open transactions
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--modus-wc-color-base-content)", lineHeight: 1.6 }}>
                  Some invoices or payments are still open. Closing now will lock the books as-is. You can reopen this period later if corrections are needed.
                </div>
              </div>
            </div>
          )}

          <ModusWcTypography hierarchy="p" customClass="wizard-body--muted" label="You can reopen this period any time if corrections are needed." />
        </div>
      </WizardShell>
      </>
    )
  }

  return (
    <WizardShell
      title="Close a Period"
      question="Which month are you closing?"
      illustration={<CalendarLockIllustration />}
      onCancel={cancel}
      onNext={() => setStep(2)}
      nextDisabled={!selectedId}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <ModusWcTypography hierarchy="p" customClass="wizard-intro" label="Select the month you want to close. Only open periods are shown." />
        {[2025, 2026].map((year) => {
          const rows = openPeriods.filter((p) => p.year === year)
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
      </div>
    </WizardShell>
  )
}
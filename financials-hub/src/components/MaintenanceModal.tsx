import React from "react"
import { ModusWcIcon } from "@trimble-oss/moduswebcomponents-react"

export const MAINTENANCE_DATE = "Thursday, July 24, 2026"
export const MAINTENANCE_TIME = "11:00 PM – 3:00 AM ET"
export const MAINTENANCE_DURATION = "4 hours"
// ISO date string used for date comparisons — update alongside MAINTENANCE_DATE

type Props = {
  open: boolean
  onDismiss: () => void
}

export function MaintenanceModal({ open, onDismiss }: Props) {
  if (!open) return null

  const handleDismiss = onDismiss

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "var(--modus-wc-color-base-page)",
          borderRadius: 16,
          padding: "2rem",
          maxWidth: 440,
          width: "100%",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        {/* Title */}
        <div style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--modus-wc-color-base-content)", marginBottom: "1rem" }}>
          Scheduled Maintenance
        </div>

        {/* Intro copy */}
        <p
          style={{
            margin: "0 0 0.75rem",
            fontSize: "0.9375rem",
            color: "var(--modus-wc-color-base-content-low-contrast)",
            lineHeight: 1.6,
          }}
        >
          We'll be performing scheduled maintenance on{" "}
          <strong style={{ color: "var(--modus-wc-color-base-content)" }}>
            {MAINTENANCE_DATE}
          </strong>{" "}
          from{" "}
          <strong style={{ color: "var(--modus-wc-color-base-content)" }}>
            {MAINTENANCE_TIME}
          </strong>
          .
        </p>

        {/* Warning block */}
        <div
          style={{
            margin: "0 0 0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            border: "1.5px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 50%, transparent)",
            background: "color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 10%, transparent)",
            fontSize: "0.875rem",
            color: "var(--modus-wc-color-base-content)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#7a5200" }}>During this window</strong>, the system will be
          temporarily unavailable while our engineers apply critical updates. We expect the outage
          to last approximately{" "}
          <strong style={{ color: "var(--modus-wc-color-base-content)" }}>{MAINTENANCE_DURATION}</strong>.
        </div>

        {/* Closing line */}
        <p
          style={{
            margin: "0 0 1.5rem",
            fontSize: "0.875rem",
            color: "var(--modus-wc-color-base-content-low-contrast)",
            lineHeight: 1.6,
          }}
        >
          Access will be restored as soon as maintenance is complete. We apologize for any
          inconvenience and appreciate your patience.
        </p>

        {/* Action */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleDismiss}
            style={{
              padding: "0.625rem 1.75rem",
              borderRadius: 99,
              border: "none",
              background: "var(--modus-wc-color-primary)",
              color: "#fff",
              fontFamily: "Open Sans, sans-serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

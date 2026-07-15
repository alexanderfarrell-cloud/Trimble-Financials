import React from "react"
import { ModusWcIcon } from "@trimble-oss/moduswebcomponents-react"
import { MAINTENANCE_DATE, MAINTENANCE_TIME } from "./MaintenanceModal"

const BANNER_STORAGE_KEY = "maintenance-banner-2026-07-24-dismissed"

type Props = {
  open: boolean
  onDismiss: () => void
}

export function MaintenanceBanner({ open, onDismiss }: Props) {
  if (!open) return null

  const label = "Maintenance tomorrow"
  const message = `Scheduled maintenance tomorrow, ${MAINTENANCE_DATE}, from ${MAINTENANCE_TIME}. The system will be temporarily unavailable.`

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0.625rem 1rem",
        background: "color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 12%, transparent)",
        borderBottom: "1.5px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 40%, transparent)",
        fontFamily: "Open Sans, sans-serif",
        fontSize: "0.8125rem",
        lineHeight: 1.5,
      }}
    >
      <ModusWcIcon
        name="build"
        size="xs"
        decorative
        style={{ color: "#7a5200", flexShrink: 0 } as React.CSSProperties}
      />
      <span style={{ fontWeight: 700, color: "#7a5200", flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "var(--modus-wc-color-base-content)", flex: 1 }}>{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss maintenance banner"
        style={{
          display: "flex",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          borderRadius: 4,
          color: "var(--modus-wc-color-base-content-low-contrast)",
          flexShrink: 0,
        }}
      >
        <ModusWcIcon name="close" size="xs" decorative />
      </button>
    </div>
  )
}

export { BANNER_STORAGE_KEY }

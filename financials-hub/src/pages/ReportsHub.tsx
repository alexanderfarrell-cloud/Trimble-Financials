import { useNavigate } from 'react-router-dom'
import React from 'react'
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'

const REPORT_ITEMS = [
  {
    title: 'GL Detail Report',
    subtitle: 'Account-level debits, credits, and journal line detail',
    icon: 'receipt',
    path: '/reports/gl-detail',
  },
] as const

export default function ReportsHub() {
  const navigate = useNavigate()

  return (
    <div className="hub-page">
      <h1 className="hub-title">
        <ModusWcIcon name="bar_chart" size="md" decorative />
        Reports
      </h1>

      <div className="reports-hub-list">
        {REPORT_ITEMS.map((item) => (
          <button
            key={item.path}
            type="button"
            className="reports-hub-item"
            onClick={() => navigate(item.path)}
          >
            <div className="reports-hub-item__icon">
              <ModusWcIcon
                name={item.icon}
                size="sm"
                decorative
                style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties}
              />
            </div>
            <div className="reports-hub-item__text">
              <div className="reports-hub-item__title">{item.title}</div>
              <div className="reports-hub-item__subtitle">{item.subtitle}</div>
            </div>
            <ModusWcIcon
              name="chevron_right"
              size="sm"
              decorative
              style={{ color: 'var(--modus-wc-color-base-content-low-contrast)', flexShrink: 0 } as React.CSSProperties}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

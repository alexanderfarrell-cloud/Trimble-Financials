import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ModusWcIcon, ModusWcButton, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

interface AccountingItem {
  icon: string
  iconColor: string
  iconBg: string
  title: string
  subtitle: string
  path?: string
}

const ITEMS: AccountingItem[] = [
  {
    icon: 'calendar_today',
    iconColor: 'var(--modus-wc-color-primary)',
    iconBg: 'color-mix(in srgb, var(--modus-wc-color-primary) 10%, transparent)',
    title: 'Fiscal Periods',
    subtitle: 'Manage and close your accounting periods',
    path: '/periods',
  },
  {
    icon: 'edit',
    iconColor: 'var(--modus-wc-color-base-content-low-contrast)',
    iconBg: 'var(--modus-wc-color-base-200)',
    title: 'Journal Entries',
    subtitle: 'Manual transactions that adjust account balances',
  },
  {
    icon: 'credit_card',
    iconColor: 'var(--modus-wc-color-base-content-low-contrast)',
    iconBg: 'var(--modus-wc-color-base-200)',
    title: 'Credit and Bank Accounts',
    subtitle: 'Link your credit or bank account',
  },
]

function AccountingIllustration() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: 200 }}>
      <div style={{ width: 220, height: 220, borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%', background: 'color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: 'color-mix(in srgb, var(--modus-wc-color-primary) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ModusWcIcon name="account_balance" size="lg" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'color-mix(in srgb, var(--modus-wc-color-primary) 20%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ModusWcIcon name="receipt" size="xs" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
            </div>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'color-mix(in srgb, var(--modus-wc-color-primary) 20%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ModusWcIcon name="calendar_today" size="xs" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountingHub() {
  const navigate = useNavigate()

  return (
    <div className="hub-page">
      <div className="hub-title">
        <ModusWcIcon name="account_balance" size="md" decorative />
        <ModusWcTypography hierarchy="h1" customClass="hub-title-text" label="Accounting Hub" />
      </div>

      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flex: 1 }}>
        {/* Card list */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {ITEMS.map((item) => {
            const active = !!item.path
            return (
              <ModusWcButton
                key={item.title}
                onButtonClick={() => item.path && navigate(item.path)}
                disabled={!active}
                variant="borderless"
                color="secondary"
                customClass="accounting-item"
                className="accounting-item"
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ModusWcIcon name={item.icon} size="sm" decorative style={{ color: item.iconColor } as React.CSSProperties} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>{item.subtitle}</div>
                </div>
                {active && (
                  <ModusWcIcon name="chevron_right" size="sm" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)', flexShrink: 0 } as React.CSSProperties} />
                )}
                {!active && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: 'var(--modus-wc-color-base-200)', color: 'var(--modus-wc-color-base-content-low-contrast)', flexShrink: 0 }}>
                    Coming soon
                  </span>
                )}
              </ModusWcButton>
            )
          })}
        </div>

        {/* Illustration — hidden on narrow viewports */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="accounting-illustration">
          <AccountingIllustration />
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'

type SetupPath = 'import' | 'manual'

const PATHS: {
  id: SetupPath
  label: string
  tag?: string
  icon: string
  description: string
  helperText: string
}[] = [
  {
    id: 'import',
    label: 'Import Data',
    tag: 'recommended',
    icon: 'import_export',
    description: 'Bring in your opening balances from a previous accounting system.',
    helperText:
      'Choose this if you have existing customers, jobs, vendors, or financial records in a spreadsheet or another accounting system.',
  },
  {
    id: 'manual',
    label: 'Start Fresh',
    icon: 'edit',
    description: 'Build your records from scratch.',
    helperText:
      'Choose this if you are a new business with no existing records to bring in and want to set up Trimble Financials from the ground up.',
  },
]

function ManualEntryConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'var(--modus-wc-color-base-page)', borderRadius: 16, padding: '1.75rem', maxWidth: 440, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'color-mix(in srgb, var(--modus-wc-color-danger, #da212c) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ModusWcIcon name="warning" size="sm" decorative style={{ color: 'var(--modus-wc-color-danger, #da212c)' } as React.CSSProperties} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 4 }}>
              This choice is permanent
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.6 }}>
              Once you start fresh, you will not be able to import data from a previous accounting system. This cannot be undone.
            </div>
          </div>
        </div>

        {/* Consequence list */}
        <div style={{ background: 'color-mix(in srgb, var(--modus-wc-color-danger, #da212c) 6%, transparent)', border: '1.5px solid color-mix(in srgb, var(--modus-wc-color-danger, #da212c) 30%, transparent)', borderRadius: 8, padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'You will not be able to import customers, vendors, or jobs from a spreadsheet.',
            'Your opening balances cannot be bulk-imported from a previous system.',
            'All historical data must be entered manually, one record at a time.',
          ].map((line, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <ModusWcIcon name="close" size="xs" decorative style={{ color: 'var(--modus-wc-color-danger, #da212c)', flexShrink: 0, marginTop: 2 } as React.CSSProperties} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', lineHeight: 1.5 }}>{line}</span>
            </div>
          ))}
        </div>

        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.5 }}>
          If you have existing data in a spreadsheet or another accounting system, we strongly recommend choosing <strong style={{ color: 'var(--modus-wc-color-base-content)' }}>Import Data</strong> instead.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{ padding: '0.5rem 1.25rem', borderRadius: 99, border: '1.5px solid var(--modus-wc-color-base-200)', background: 'transparent', color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: '0.5rem 1.5rem', borderRadius: 99, border: 'none', background: 'var(--modus-wc-color-danger, #da212c)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ModusWcIcon name="edit" size="xs" decorative />
            Yes, start fresh
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingSetup() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<SetupPath | null>(null)
  const [showManualConfirm, setShowManualConfirm] = useState(false)

  const handleContinue = () => {
    if (!selected) return
    if (selected === 'manual') {
      setShowManualConfirm(true)
      return
    }
    localStorage.setItem('onboarding-path', 'import')
    navigate('/onboarding/import')
  }

  const handleManualConfirmed = () => {
    localStorage.setItem('onboarding-path', 'manual')
    navigate('/')
  }

  return (
    <>
    {showManualConfirm && (
      <ManualEntryConfirmModal
        onConfirm={handleManualConfirmed}
        onCancel={() => setShowManualConfirm(false)}
      />
    )}
    <div className="hub-page" style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.375rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif' }}>
            Welcome to Trimble Financials
          </h1>
          <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif' }}>
            You run the job. We'll run the numbers.
          </p>
        </div>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'color-mix(in srgb, var(--modus-wc-color-primary) 10%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <ModusWcIcon name="account_balance" size="md" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
        </div>
      </div>

      {/* Section heading */}
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif' }}>
          How would you like to get started?
        </p>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif' }}>
          Select a setup method. You won't be able to change this later.
        </p>
      </div>

      {/* Path options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {PATHS.map((path) => (
          <button
            key={path.id}
            onClick={() => setSelected(path.id)}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: 10,
              padding: '1rem 1.25rem',
              border: selected === path.id
                ? '2px solid var(--modus-wc-color-primary)'
                : '1px solid var(--modus-wc-color-base-200)',
              background: selected === path.id
                ? 'color-mix(in srgb, var(--modus-wc-color-primary) 5%, transparent)'
                : 'var(--modus-wc-color-base-page)',
              fontFamily: 'Open Sans, sans-serif',
              transition: 'border 0.15s, background 0.15s',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Radio indicator */}
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: selected === path.id
                ? '6px solid var(--modus-wc-color-primary)'
                : '2px solid var(--modus-wc-color-base-200)',
              flexShrink: 0,
              marginTop: 2,
              transition: 'border 0.15s',
              boxSizing: 'border-box',
            }} />

            {/* Icon */}
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: selected === path.id
                ? 'color-mix(in srgb, var(--modus-wc-color-primary) 12%, transparent)'
                : 'var(--modus-wc-color-base-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ModusWcIcon
                name={path.icon}
                size="sm"
                decorative
                style={{ color: selected === path.id ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties}
              />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)' }}>
                  {path.label}
                </span>
                {path.tag && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--modus-wc-color-primary)',
                    background: 'color-mix(in srgb, var(--modus-wc-color-primary) 10%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--modus-wc-color-primary) 30%, transparent)',
                    borderRadius: 4,
                    padding: '1px 6px',
                  }}>
                    {path.tag}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 6 }}>
                {path.description}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.5 }}>
                {path.helperText}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleContinue}
          disabled={!selected}
          style={{
            padding: '0.625rem 1.75rem',
            borderRadius: 99,
            border: 'none',
            background: selected ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-200)',
            color: selected ? '#fff' : 'var(--modus-wc-color-base-content-low-contrast)',
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '0.9375rem',
            fontWeight: 700,
            cursor: selected ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 0.15s',
          }}
        >
          Get Started
          <ModusWcIcon name="arrow_forward" size="xs" decorative />
        </button>
      </div>
    </div>
    </>
  )
}

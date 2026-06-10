import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'

const ADD_ITEMS = [
  { label: 'Add Job',      icon: 'assignment',  path: '/jobs' },
  { label: 'Add Billing',  icon: 'receipt',     path: '/billing' },
  { label: 'Add Customer', icon: 'contacts',    path: '/customers' },
  { label: 'Add Expense',  icon: 'credit_card', path: '/expenses' },
  { label: 'Add Vendor',   icon: 'business',    path: '/vendors' },
]

export function AddButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        aria-label="Add"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 99, cursor: 'pointer',
          border: 'none',
          background: 'var(--modus-wc-color-primary)',
          color: '#fff',
          fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600,
        }}
      >
        <ModusWcIcon name="add" size="sm" decorative />
        Add
        <ModusWcIcon name="expand_more" size="sm" decorative />
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            zIndex: 100, background: 'var(--modus-wc-color-base-page)',
            border: '1px solid var(--modus-wc-color-base-200)',
            borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            padding: '0.375rem 0', minWidth: 180,
            display: 'flex', flexDirection: 'column',
          }}
        >
          {ADD_ITEMS.map(({ label, icon, path }) => (
            <button
              key={label}
              role="menuitem"
              onClick={() => { setOpen(false); navigate(path) }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.55rem 1rem', textAlign: 'left',
                fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem',
                color: 'var(--modus-wc-color-base-content)',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--modus-wc-color-base-100)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <ModusWcIcon name={icon} size="sm" decorative />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId = 'bank-accounts' | 'customers' | 'jobs' | 'vendors' | 'trial-balance'
type SubPhase = 'intro' | 'upload' | 'review' | 'summary'

interface ReviewColumn { key: string; label: string; align?: 'right' }
interface ReviewRow    { [key: string]: string }

interface ImportStepDef {
  id: StepId
  label: string
  icon: string
  description: string
  reviewColumns: ReviewColumn[]
  reviewRows: ReviewRow[]
}

// ─── Step data (same dummy data as v1) ───────────────────────────────────────

const STEPS: ImportStepDef[] = [
  {
    id: 'bank-accounts',
    label: 'Bank and Credit Accounts',
    icon: 'account_balance',
    description: 'Import your bank and credit card accounts with opening balances.',
    reviewColumns: [
      { key: 'name',    label: 'Account Name' },
      { key: 'type',    label: 'Type' },
      { key: 'number',  label: 'Acct #' },
      { key: 'balance', label: 'Opening Balance', align: 'right' },
    ],
    reviewRows: [
      { name: 'Business Checking',   type: 'Bank',   number: '••••4821', balance: '$12,450.00'  },
      { name: 'Business Savings',    type: 'Bank',   number: '••••3309', balance: '$8,200.00'   },
      { name: 'Mastercard Business', type: 'Credit', number: '••••7714', balance: '-$3,400.00'  },
      { name: 'Line of Credit',      type: 'Credit', number: '••••1102', balance: '-$6,000.00'  },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'contacts',
    description: 'Import your customer list with contact information.',
    reviewColumns: [
      { key: 'id',      label: 'Customer ID' },
      { key: 'company', label: 'Company' },
      { key: 'contact', label: 'Contact' },
      { key: 'email',   label: 'Email' },
      { key: 'balance', label: 'Open Balance', align: 'right' },
    ],
    reviewRows: [
      { id: 'DD111', company: 'Downtown Dev LLC',      contact: 'Dana Dawson', email: 'dana@dddev.com',       balance: '$4,800.00'  },
      { id: 'MR202', company: 'Meridian Group',        contact: 'Ray Ortega',  email: 'ray@meridian.com',     balance: '$12,250.00' },
      { id: 'SS303', company: 'Summit Structures',     contact: 'Sam Sloane',  email: 'ssloane@summit.com',   balance: '$0.00'      },
      { id: 'HC404', company: 'Harbor Creek Partners', contact: 'Lena Park',   email: 'lena@harborcreek.com', balance: '$7,500.00'  },
    ],
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: 'assignment',
    description: 'Import existing jobs with contract values and dates.',
    reviewColumns: [
      { key: 'name',     label: 'Job Name' },
      { key: 'customer', label: 'Customer' },
      { key: 'value',    label: 'Contract Value', align: 'right' },
      { key: 'start',    label: 'Start' },
      { key: 'status',   label: 'Status' },
    ],
    reviewRows: [
      { name: 'Downtown Tower — Phase 2', customer: 'Meridian Group',        value: '$4,200,000', start: 'Jan 8, 2024',  status: 'Active'  },
      { name: 'Harbor Walk Renovation',   customer: 'Harbor Creek Partners', value: '$890,000',   start: 'Mar 1, 2025',  status: 'Active'  },
      { name: 'North Campus Landscaping', customer: 'Downtown Dev LLC',      value: '$320,000',   start: 'Jun 15, 2025', status: 'Pending' },
      { name: 'Summit Office Build-Out',  customer: 'Summit Structures',     value: '$1,150,000', start: 'Sep 1, 2025',  status: 'Active'  },
    ],
  },
  {
    id: 'vendors',
    label: 'Vendors',
    icon: 'business',
    description: 'Import vendors and outstanding payable balances.',
    reviewColumns: [
      { key: 'id',      label: 'Vendor ID' },
      { key: 'company', label: 'Company' },
      { key: 'contact', label: 'Contact' },
      { key: 'terms',   label: 'Terms' },
      { key: 'balance', label: 'Open Balance', align: 'right' },
    ],
    reviewRows: [
      { id: 'V001', company: 'Pacific Supply Co',  contact: 'Pat Williams', terms: 'Net 30', balance: '$3,200.00' },
      { id: 'V002', company: 'Iron Works Inc',     contact: 'Irene Kovacs', terms: 'Net 45', balance: '$1,800.00' },
      { id: 'V003', company: 'ProBuild Materials', contact: 'Marco Bell',   terms: 'Net 15', balance: '$5,400.00' },
      { id: 'V004', company: 'Cascade Electrical', contact: 'Dina Watts',   terms: 'Net 30', balance: '$0.00'     },
    ],
  },
  {
    id: 'trial-balance',
    label: 'Trial Balance',
    icon: 'balance',
    description: 'Import your chart of accounts with opening debit and credit balances.',
    reviewColumns: [
      { key: 'account',  label: 'Account' },
      { key: 'category', label: 'Category' },
      { key: 'debit',    label: 'Debit',  align: 'right' },
      { key: 'credit',   label: 'Credit', align: 'right' },
    ],
    reviewRows: [
      { account: 'Business Checking',   category: 'Asset',     debit: '$12,450.00', credit: '—'          },
      { account: 'Business Savings',    category: 'Asset',     debit: '$8,200.00',  credit: '—'          },
      { account: 'Accounts Receivable', category: 'Asset',     debit: '$24,550.00', credit: '—'          },
      { account: 'Accounts Payable',    category: 'Liability', debit: '—',          credit: '$10,400.00' },
      { account: 'Loan Payable',        category: 'Liability', debit: '—',          credit: '$32,705.00' },
      { account: 'Retained Earnings',   category: 'Equity',    debit: '—',          credit: '$1,000.00'  },
    ],
  },
]

const TB_DEBIT_TOTAL  = 45_200.00
const TB_CREDIT_TOTAL = 44_105.00
const TB_DIFF         = TB_DEBIT_TOTAL - TB_CREDIT_TOTAL

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

function loadProgress(): StepId[] {
  try { return JSON.parse(localStorage.getItem('import-completed-steps') || '[]') } catch { return [] }
}
function saveProgress(steps: StepId[]) {
  localStorage.setItem('import-completed-steps', JSON.stringify(steps))
}

// ─── Step popover ─────────────────────────────────────────────────────────────

function StepPopover({
  currentIndex,
  completedSteps,
  onClose,
}: {
  currentIndex: number
  completedSteps: StepId[]
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--modus-wc-color-base-page)',
        border: '1px solid var(--modus-wc-color-base-200)',
        borderRadius: 10,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.14)',
        minWidth: 260,
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      {STEPS.map((step, i) => {
        const done    = completedSteps.includes(step.id)
        const current = i === currentIndex && !done
        const upcoming = !done && !current

        return (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0.75rem 1rem',
              background: current ? 'color-mix(in srgb, var(--modus-wc-color-primary) 6%, transparent)' : 'transparent',
              borderBottom: i < STEPS.length - 1 ? '1px solid var(--modus-wc-color-base-200)' : 'none',
            }}
          >
            {/* Step indicator */}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: done
                ? 'var(--modus-wc-color-success, #006638)'
                : current
                ? 'var(--modus-wc-color-primary)'
                : 'var(--modus-wc-color-base-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {done ? (
                <ModusWcIcon name="check" size="xs" decorative style={{ color: '#fff' } as React.CSSProperties} />
              ) : (
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, fontFamily: 'Open Sans, sans-serif', color: current ? '#fff' : 'var(--modus-wc-color-base-content-low-contrast)' }}>
                  {i + 1}
                </span>
              )}
            </div>

            {/* Label */}
            <span style={{
              flex: 1,
              fontSize: '0.875rem',
              fontWeight: current ? 700 : 400,
              color: upcoming ? 'var(--modus-wc-color-base-content-low-contrast)' : 'var(--modus-wc-color-base-content)',
              fontFamily: 'Open Sans, sans-serif',
            }}>
              {step.label}
            </span>

            {/* Status */}
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              fontFamily: 'Open Sans, sans-serif',
              color: done
                ? 'var(--modus-wc-color-success, #006638)'
                : current
                ? 'var(--modus-wc-color-primary)'
                : 'var(--modus-wc-color-base-content-low-contrast)',
            }}>
              {done ? 'Completed' : current ? 'Current' : 'Upcoming'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Intro screen ─────────────────────────────────────────────────────────────

function IntroScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 560 }}>
      <div>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif' }}>
          What you'll need
        </h2>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.6 }}>
          You'll import 5 files in order. Each step builds on the last, so have these ready before you begin.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {STEPS.map((step, i) => (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0.875rem 1rem',
              border: '1px solid var(--modus-wc-color-base-200)',
              borderRadius: 10,
              background: 'var(--modus-wc-color-base-page)',
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--modus-wc-color-base-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif' }}>
                {i + 1}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
                {step.label}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.5 }}>
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--modus-wc-color-base-100)', borderRadius: 8, padding: '0.875rem 1rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <ModusWcIcon name="info" size="sm" decorative style={{ color: 'var(--modus-wc-color-primary)', flexShrink: 0, marginTop: 1 } as React.CSSProperties} />
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.55 }}>
          Steps must be completed in order. Your progress is saved so you can come back if you need to locate a file.
        </p>
      </div>
    </div>
  )
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

function BottomNav({
  stepIndex,
  completedSteps,
  ctaLabel,
  ctaDisabled,
  onBack,
  onCta,
  hideStepIndicator = false,
}: {
  stepIndex: number
  completedSteps: StepId[]
  ctaLabel: string
  ctaDisabled?: boolean
  onBack: () => void
  onCta: () => void
  hideStepIndicator?: boolean
}) {
  const [showPopover, setShowPopover] = useState(false)

  return (
    <div style={{ position: 'relative', borderTop: '1px solid var(--modus-wc-color-base-200)', background: 'var(--modus-wc-color-base-page)', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      {/* Back */}
      <button
        onClick={onBack}
        aria-label="Back"
        style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--modus-wc-color-base-content)', color: 'var(--modus-wc-color-base-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <ModusWcIcon name="arrow_back" size="sm" decorative />
      </button>

      {/* Step indicator + popover anchor */}
      <div style={{ position: 'relative' }}>
        {!hideStepIndicator && (
          <button
            onClick={() => setShowPopover((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.4375rem 1rem', borderRadius: 99, border: '1.5px solid var(--modus-wc-color-base-200)', background: 'var(--modus-wc-color-base-page)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content)', cursor: 'pointer' }}
          >
            Step {stepIndex + 1} of {STEPS.length}
            <ModusWcIcon name={showPopover ? 'expand_more' : 'expand_less'} size="xs" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties} />
          </button>
        )}

        {showPopover && !hideStepIndicator && (
          <StepPopover
            currentIndex={stepIndex}
            completedSteps={completedSteps}
            onClose={() => setShowPopover(false)}
          />
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onCta}
        disabled={ctaDisabled}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.625rem 1.5rem', borderRadius: 99, border: 'none', background: ctaDisabled ? 'var(--modus-wc-color-base-200)' : 'var(--modus-wc-color-primary)', color: ctaDisabled ? 'var(--modus-wc-color-base-content-low-contrast)' : '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: ctaDisabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
      >
        {ctaLabel}
        <ModusWcIcon name="arrow_forward" size="xs" decorative />
      </button>
    </div>
  )
}

// ─── Upload screen ────────────────────────────────────────────────────────────

function UploadScreen({
  step,
  fileName,
  onFileChange,
}: {
  step: ImportStepDef
  fileName: string | null
  onFileChange: (n: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFileChange(f.name)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 560 }}>
      <p style={{ margin: 0, fontSize: '1rem', color: 'var(--modus-wc-color-base-content)', lineHeight: 1.6 }}>
        {step.description}
      </p>
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
          How to import your {step.label.toLowerCase()}
        </p>
        <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            <><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--modus-wc-color-primary)' }}>Download this sample CSV</a> and fill it in with your data.</>,
            'Save as .csv or .xlsx.',
            'Upload your file below.',
          ].map((item, i) => (
            <li key={i} style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content)', lineHeight: 1.6 }}>{item}</li>
          ))}
        </ol>
      </div>

      {step.id === 'trial-balance' && (
        <div style={{ borderRadius: 8, border: '1.5px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 50%, transparent)', background: 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 8%, transparent)', padding: '0.875rem 1rem', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <ModusWcIcon name="info" size="sm" decorative style={{ color: '#7a5200', flexShrink: 0, marginTop: 1 } as React.CSSProperties} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#7a5200', marginBottom: 4 }}>Debit and credit balance check</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', lineHeight: 1.5 }}>
              We'll check that your total debits equal your total credits after you review your data.
            </div>
          </div>
        </div>
      )}

      {!fileName ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{ border: `2px dashed ${dragging ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-200)'}`, borderRadius: 10, padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', background: dragging ? 'color-mix(in srgb, var(--modus-wc-color-primary) 4%, transparent)' : 'var(--modus-wc-color-base-page)', transition: 'border-color 0.15s, background 0.15s', textAlign: 'center' }}
          >
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--modus-wc-color-base-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ModusWcIcon name="upload_file" size="md" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content)', marginBottom: 4 }}>Drag files here</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                or <span style={{ color: 'var(--modus-wc-color-primary)', textDecoration: 'underline' }}>browse to upload</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--modus-wc-color-base-content-low-contrast)', marginTop: 6 }}>.csv, .xlsx, .xls — max 10 MB</div>
            </div>
            <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileChange(f.name) }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--modus-wc-color-base-200)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--modus-wc-color-base-200)' }} />
          </div>
          <button
            onClick={() => onFileChange(`sample-${step.id}.csv`)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.625rem 1rem', borderRadius: 8, border: '1.5px solid color-mix(in srgb, var(--modus-wc-color-primary) 40%, transparent)', background: 'color-mix(in srgb, var(--modus-wc-color-primary) 4%, transparent)', color: 'var(--modus-wc-color-primary)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <ModusWcIcon name="table_view" size="xs" decorative />
            Use sample data
          </button>
        </div>
      ) : (
        <div style={{ border: '2px solid var(--modus-wc-color-success, #006638)', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 14, background: 'color-mix(in srgb, var(--modus-wc-color-success, #006638) 5%, transparent)' }}>
          <ModusWcIcon name="check_circle" size="md" decorative style={{ color: 'var(--modus-wc-color-success, #006638)', flexShrink: 0 } as React.CSSProperties} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>File ready — click Continue to review</div>
          </div>
          <button onClick={() => onFileChange(null)} aria-label="Remove file" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: 'var(--modus-wc-color-base-content-low-contrast)', display: 'flex' }}>
            <ModusWcIcon name="close" size="xs" decorative />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Review screen ────────────────────────────────────────────────────────────

function ReviewScreen({ step }: { step: ImportStepDef }) {
  const count = step.reviewRows.length
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)' }}>
        <strong>{count} {count === 1 ? 'record' : 'records'} detected.</strong>{' '}
        <span style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
          Please review them below and then click Next to continue.
        </span>
      </p>

      <div style={{ border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 8, overflow: 'auto' }}>
        <table className="data-table" style={{ minWidth: '100%' }}>
          <thead>
            <tr style={{ background: 'var(--modus-wc-color-base-100)' }}>
              {step.reviewColumns.map((col) => (
                <th key={col.key} style={{ textAlign: col.align === 'right' ? 'right' : 'left' }}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {step.reviewRows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 1 ? 'var(--modus-wc-color-base-100)' : 'var(--modus-wc-color-base-page)' }}>
                {step.reviewColumns.map((col) => (
                  <td key={col.key} className={col.align === 'right' ? 'amount' : ''}>
                    {row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
        Your data will be reviewed and confirmed on the final summary screen before anything is imported.
      </p>
    </div>
  )
}

// ─── Summary screen ───────────────────────────────────────────────────────────

function SummaryScreen({
  onFixReupload,
  autoBalanceAccepted,
  onAutoBalanceAccept,
}: {
  onFixReupload: () => void
  autoBalanceAccepted: boolean
  onAutoBalanceAccept: () => void
}) {
  const [showJournal, setShowJournal] = useState(false)
  const totalRecords = STEPS.reduce((sum, s) => sum + s.reviewRows.length, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 640 }}>
      <div>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif' }}>
          Review your import
        </h2>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.6 }}>
          All 5 files are ready. Review the summary below then click Import All to commit your data.
        </p>
      </div>

      {/* Step summary table */}
      <div style={{ border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 10, overflow: 'hidden' }}>
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0.875rem 1rem', borderBottom: i < STEPS.length - 1 ? '1px solid var(--modus-wc-color-base-200)' : 'none', background: 'var(--modus-wc-color-base-page)' }}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--modus-wc-color-success, #006638)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ModusWcIcon name="check" size="xs" decorative style={{ color: '#fff' } as React.CSSProperties} />
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif' }}>
              {s.label}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif', whiteSpace: 'nowrap' }}>
              {s.reviewRows.length} records
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--modus-wc-color-base-100)', borderTop: '1px solid var(--modus-wc-color-base-200)' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif' }}>Total records</span>
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif' }}>{totalRecords}</span>
        </div>
      </div>

      {/* Balance check — accepted state */}
      {autoBalanceAccepted ? (
        <div style={{ border: '1.5px solid color-mix(in srgb, var(--modus-wc-color-success, #006638) 40%, transparent)', borderRadius: 10, padding: '1rem', display: 'flex', alignItems: 'center', gap: 12, background: 'color-mix(in srgb, var(--modus-wc-color-success, #006638) 5%, transparent)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--modus-wc-color-success, #006638)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ModusWcIcon name="check" size="xs" decorative style={{ color: '#fff' } as React.CSSProperties} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>Auto-balance accepted</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.5 }}>
              A journal entry of <strong>{fmt(TB_DIFF)}</strong> to Retained Earnings will be created on import.
            </div>
          </div>
          <button
            onClick={onFixReupload}
            style={{ background: 'none', border: 'none', padding: '3px 8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif', borderRadius: 4, whiteSpace: 'nowrap' }}
          >
            Re-upload instead
          </button>
        </div>
      ) : (
        /* Balance check — inline warning */
        <div style={{ border: '1.5px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 50%, transparent)', borderRadius: 10, overflow: 'hidden', background: 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 5%, transparent)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '1rem', borderBottom: '1px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 30%, transparent)' }}>
            <ModusWcIcon name="warning" size="sm" decorative style={{ color: '#7a5200', flexShrink: 0, marginTop: 1 } as React.CSSProperties} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#7a5200', marginBottom: 3 }}>Trial balance discrepancy</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', lineHeight: 1.5 }}>
                Your debits and credits don't balance. Choose an option below before importing.
              </div>
            </div>
          </div>

          {/* Debit / credit summary */}
          <div style={{ background: 'var(--modus-wc-color-base-page)' }}>
            {[
              { label: 'Total Debits',  value: fmt(TB_DEBIT_TOTAL),  highlight: false },
              { label: 'Total Credits', value: fmt(TB_CREDIT_TOTAL), highlight: false },
              { label: 'Difference',    value: fmt(TB_DIFF),         highlight: true  },
            ].map(({ label, value, highlight }, i) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5625rem 1rem', borderBottom: i < 2 ? '1px solid var(--modus-wc-color-base-200)' : 'none', background: highlight ? 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 8%, transparent)' : 'transparent' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>{label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: highlight ? '#7a5200' : 'var(--modus-wc-color-base-content)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Auto-balance expander */}
          <div style={{ borderTop: '1px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 30%, transparent)' }}>
            <button
              onClick={() => setShowJournal((v) => !v)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', gap: 8 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ModusWcIcon name="auto_fix_high" size="xs" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--modus-wc-color-primary)' }}>View auto-balance adjustment</span>
              </span>
              <ModusWcIcon name={showJournal ? 'expand_less' : 'expand_more'} size="xs" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties} />
            </button>
            {showJournal && (
              <div style={{ borderTop: '1px solid var(--modus-wc-color-base-200)', background: 'var(--modus-wc-color-base-page)', padding: '0 0 0.75rem' }}>
                <div style={{ padding: '0.625rem 1rem 0.375rem', fontSize: '0.75rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                  Trimble will create the following journal entry to balance your books:
                </div>
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr style={{ background: 'var(--modus-wc-color-base-100)' }}>
                      {['Date', 'Account', 'Description', 'Debit', 'Credit'].map((h) => (
                        <th key={h} style={{ textAlign: h === 'Debit' || h === 'Credit' ? 'right' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Jul 14, 2026</td>
                      <td>Retained Earnings</td>
                      <td>Opening balance adjustment</td>
                      <td className="amount">—</td>
                      <td className="amount">{fmt(TB_DIFF)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 30%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            <button
              onClick={onFixReupload}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <ModusWcIcon name="upload_file" size="xs" decorative />
              Fix and re-upload
            </button>
            <button
              onClick={onAutoBalanceAccept}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 1.25rem', borderRadius: 99, border: 'none', background: 'var(--modus-wc-color-primary)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <ModusWcIcon name="auto_fix_high" size="xs" decorative />
              Apply auto-balance
            </button>
          </div>
        </div>
      )}

      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.55 }}>
        {autoBalanceAccepted
          ? <>Clicking <strong style={{ color: 'var(--modus-wc-color-base-content)' }}>Import All</strong> will add all records and apply the auto-balance journal entry. This action can be undone within 24 hours from Settings.</>
          : <>Resolve the trial balance discrepancy above to enable <strong style={{ color: 'var(--modus-wc-color-base-content)' }}>Import All</strong>.</>
        }
      </p>
    </div>
  )
}

// ─── Final confirm modal ──────────────────────────────────────────────────────

function ConfirmAllModal({
  autoBalanceAccepted,
  onConfirm,
  onCancel,
}: {
  autoBalanceAccepted: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const totalRecords = STEPS.reduce((sum, s) => sum + s.reviewRows.length, 0)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'var(--modus-wc-color-base-page)', borderRadius: 16, padding: '1.75rem', maxWidth: 420, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 4 }}>Import all data?</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.6 }}>
            You're about to import <strong style={{ color: 'var(--modus-wc-color-base-content)' }}>{totalRecords} records</strong> across 5 datasets into Trimble Financials.
          </div>
        </div>

        <div style={{ background: 'var(--modus-wc-color-base-100)', border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 8, overflow: 'hidden' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', borderBottom: i < STEPS.length - 1 ? '1px solid var(--modus-wc-color-base-200)' : 'none' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)' }}>{s.label}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content-low-contrast)' }}>{s.reviewRows.length} records</span>
            </div>
          ))}
        </div>

        {autoBalanceAccepted && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--modus-wc-color-primary) 30%, transparent)', background: 'color-mix(in srgb, var(--modus-wc-color-primary) 5%, transparent)' }}>
            <ModusWcIcon name="auto_fix_high" size="xs" decorative style={{ color: 'var(--modus-wc-color-primary)', flexShrink: 0, marginTop: 2 } as React.CSSProperties} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', lineHeight: 1.5 }}>
              An auto-balance journal entry of <strong>{fmt(TB_DIFF)}</strong> to Retained Earnings will also be created.
            </span>
          </div>
        )}

        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
          This action can be undone within 24 hours from Settings.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '0.5rem 1.25rem', borderRadius: 99, border: '1.5px solid var(--modus-wc-color-base-200)', background: 'transparent', color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '0.5rem 1.5rem', borderRadius: 99, border: 'none', background: 'var(--modus-wc-color-primary)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>Import All</button>
        </div>
      </div>
    </div>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ onDone }: { onDone: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1.5rem', padding: '3rem', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'color-mix(in srgb, var(--modus-wc-color-success, #006638) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ModusWcIcon name="check_circle" size="lg" decorative style={{ color: 'var(--modus-wc-color-success, #006638)' } as React.CSSProperties} />
      </div>
      <div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', marginBottom: 8 }}>All data imported</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)', maxWidth: 360, lineHeight: 1.6 }}>
          Your opening balances, customers, jobs, vendors, and trial balance are now in Trimble Financials.
        </div>
      </div>
      <button onClick={onDone} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1.5rem', borderRadius: 99, border: '1px solid var(--modus-wc-color-base-200)', background: 'none', color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
        <ModusWcIcon name="refresh" size="xs" decorative />
        Reset demo
      </button>
    </div>
  )
}

// ─── ImportWizardV2 ───────────────────────────────────────────────────────────

export default function ImportWizardV2() {
  const navigate = useNavigate()

  const [stepIndex,       setStepIndex]       = useState(0)
  const [subPhase,        setSubPhase]         = useState<SubPhase>('intro')
  const [fileName,        setFileName]         = useState<string | null>(null)
  const [completedSteps,  setCompletedSteps]   = useState<StepId[]>(loadProgress)
  const [showFinalConfirm,    setShowFinalConfirm]    = useState(false)
  const [autoBalanceAccepted, setAutoBalanceAccepted] = useState(false)
  const [done,                setDone]                = useState(false)

  const step = STEPS[stepIndex]

  const markComplete = (id: StepId) => {
    const updated = [...completedSteps, id]
    setCompletedSteps(updated)
    saveProgress(updated)
  }

  const advance = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1)
      setSubPhase('upload')
      setFileName(null)
    } else {
      setSubPhase('summary')
    }
  }

  const handleBack = () => {
    if (subPhase === 'intro') {
      navigate('/onboarding')
    } else if (subPhase === 'summary') {
      setStepIndex(STEPS.length - 1)
      setSubPhase('review')
    } else if (subPhase === 'review') {
      setSubPhase('upload')
    } else if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
      setSubPhase('review')
    } else {
      setSubPhase('intro')
    }
  }

  const handleCta = () => {
    if (subPhase === 'intro') {
      setSubPhase('upload')
    } else if (subPhase === 'upload') {
      setSubPhase('review')
    } else if (subPhase === 'review') {
      markComplete(step.id)
      advance()
    } else {
      setShowFinalConfirm(true)
    }
  }

  const handleFixReupload = () => {
    const tbIndex = STEPS.findIndex((s) => s.id === 'trial-balance')
    setStepIndex(tbIndex)
    setSubPhase('upload')
    setFileName(null)
    setAutoBalanceAccepted(false)
  }

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--modus-wc-color-base-page)' }}>
        <SuccessScreen onDone={() => {
          localStorage.removeItem('onboarding-path')
          localStorage.removeItem('import-completed-steps')
          navigate('/onboarding')
        }} />
      </div>
    )
  }

  const ctaLabel    = subPhase === 'intro'   ? "Let's get started"
                    : subPhase === 'upload'  ? 'Continue'
                    : subPhase === 'review'  ? (stepIndex < STEPS.length - 1 ? 'Next' : 'Review summary')
                    : 'Import All'
  const ctaDisabled = (subPhase === 'upload' && !fileName)
                   || (subPhase === 'summary' && !autoBalanceAccepted)

  return (
    <>
      {showFinalConfirm && (
        <ConfirmAllModal
          autoBalanceAccepted={autoBalanceAccepted}
          onConfirm={() => { setShowFinalConfirm(false); setDone(true) }}
          onCancel={() => setShowFinalConfirm(false)}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--modus-wc-color-base-page)' }}>
        {/* Header */}
        <div className="wizard-header" style={{ borderBottom: '1px solid var(--modus-wc-color-base-200)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
              {subPhase === 'intro' ? 'Import Data' : subPhase === 'summary' ? 'Import Data' : step.label}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
              {subPhase === 'intro'   ? '5 steps · takes about 10 minutes'
               : subPhase === 'upload'  ? 'Upload your file'
               : subPhase === 'review'  ? 'Review your data'
               : 'Final review before import'}
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--modus-wc-color-base-content-low-contrast)', display: 'flex', flexShrink: 0 }}
          >
            <ModusWcIcon name="close" size="sm" decorative />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {subPhase === 'intro' ? (
            <IntroScreen />
          ) : subPhase === 'upload' ? (
            <UploadScreen step={step} fileName={fileName} onFileChange={setFileName} />
          ) : subPhase === 'review' ? (
            <ReviewScreen step={step} />
          ) : (
            <SummaryScreen
              onFixReupload={handleFixReupload}
              autoBalanceAccepted={autoBalanceAccepted}
              onAutoBalanceAccept={() => setAutoBalanceAccepted(true)}
            />
          )}
        </div>

        {/* Bottom nav */}
        <BottomNav
          stepIndex={stepIndex}
          completedSteps={completedSteps}
          ctaLabel={ctaLabel}
          ctaDisabled={ctaDisabled}
          onBack={handleBack}
          onCta={handleCta}
          hideStepIndicator={subPhase === 'intro' || subPhase === 'summary'}
        />
      </div>
    </>
  )
}


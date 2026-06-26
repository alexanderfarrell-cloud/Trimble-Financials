import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId = 'bank-accounts' | 'customers' | 'jobs' | 'vendors' | 'trial-balance'
type Phase = 'checklist' | 'upload' | 'review'

interface ReviewColumn { key: string; label: string; align?: 'right' }
interface ReviewRow { [key: string]: string }

interface ImportStepDef {
  id: StepId
  label: string
  icon: string
  description: string
  templateCols: string[]
  reviewColumns: ReviewColumn[]
  reviewRows: ReviewRow[]
}

// ─── Step definitions & sample data ──────────────────────────────────────────

const STEPS: ImportStepDef[] = [
  {
    id: 'bank-accounts',
    label: 'Bank and Credit Accounts',
    icon: 'account_balance',
    description: 'Import your bank and credit card accounts with opening balances.',
    templateCols: ['Account Name', 'Account Type', 'Account Number (last 4)', 'Opening Balance'],
    reviewColumns: [
      { key: 'name', label: 'Account Name' },
      { key: 'type', label: 'Type' },
      { key: 'number', label: 'Acct #' },
      { key: 'balance', label: 'Opening Balance', align: 'right' },
    ],
    reviewRows: [
      { name: 'Business Checking', type: 'Bank', number: '••••4821', balance: '$12,450.00' },
      { name: 'Business Savings',  type: 'Bank', number: '••••3309', balance: '$8,200.00'  },
      { name: 'Mastercard Business', type: 'Credit', number: '••••7714', balance: '-$3,400.00' },
      { name: 'Line of Credit', type: 'Credit', number: '••••1102', balance: '-$6,000.00' },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'contacts',
    description: 'Import your customer list with contact information.',
    templateCols: ['Customer ID', 'Company Name', 'Contact Name', 'Email', 'Phone', 'Open Balance'],
    reviewColumns: [
      { key: 'id',      label: 'Customer ID' },
      { key: 'company', label: 'Company' },
      { key: 'contact', label: 'Contact' },
      { key: 'email',   label: 'Email' },
      { key: 'balance', label: 'Open Balance', align: 'right' },
    ],
    reviewRows: [
      { id: 'DD111', company: 'Downtown Dev LLC',        contact: 'Dana Dawson',  email: 'dana@dddev.com',       balance: '$4,800.00'  },
      { id: 'MR202', company: 'Meridian Group',          contact: 'Ray Ortega',   email: 'ray@meridian.com',     balance: '$12,250.00' },
      { id: 'SS303', company: 'Summit Structures',       contact: 'Sam Sloane',   email: 'ssloane@summit.com',   balance: '$0.00'      },
      { id: 'HC404', company: 'Harbor Creek Partners',   contact: 'Lena Park',    email: 'lena@harborcreek.com', balance: '$7,500.00'  },
    ],
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: 'assignment',
    description: 'Import existing jobs with contract values and dates.',
    templateCols: ['Job Name', 'Customer ID', 'Contract Value', 'Start Date', 'End Date', 'Status'],
    reviewColumns: [
      { key: 'name',     label: 'Job Name' },
      { key: 'customer', label: 'Customer' },
      { key: 'value',    label: 'Contract Value', align: 'right' },
      { key: 'start',    label: 'Start' },
      { key: 'status',   label: 'Status' },
    ],
    reviewRows: [
      { name: 'Downtown Tower — Phase 2',    customer: 'Meridian Group',        value: '$4,200,000', start: 'Jan 8, 2024',   status: 'Active'   },
      { name: 'Harbor Walk Renovation',      customer: 'Harbor Creek Partners', value: '$890,000',   start: 'Mar 1, 2025',   status: 'Active'   },
      { name: 'North Campus Landscaping',    customer: 'Downtown Dev LLC',      value: '$320,000',   start: 'Jun 15, 2025',  status: 'Pending'  },
      { name: 'Summit Office Build-Out',     customer: 'Summit Structures',     value: '$1,150,000', start: 'Sep 1, 2025',   status: 'Active'   },
    ],
  },
  {
    id: 'vendors',
    label: 'Vendors',
    icon: 'business',
    description: 'Import vendors and outstanding payable balances.',
    templateCols: ['Vendor ID', 'Company Name', 'Contact Name', 'Email', 'Payment Terms', 'Open Balance'],
    reviewColumns: [
      { key: 'id',      label: 'Vendor ID' },
      { key: 'company', label: 'Company' },
      { key: 'contact', label: 'Contact' },
      { key: 'terms',   label: 'Terms' },
      { key: 'balance', label: 'Open Balance', align: 'right' },
    ],
    reviewRows: [
      { id: 'V001', company: 'Pacific Supply Co',    contact: 'Pat Williams',  terms: 'Net 30', balance: '$3,200.00'  },
      { id: 'V002', company: 'Iron Works Inc',       contact: 'Irene Kovacs',  terms: 'Net 45', balance: '$1,800.00'  },
      { id: 'V003', company: 'ProBuild Materials',   contact: 'Marco Bell',    terms: 'Net 15', balance: '$5,400.00'  },
      { id: 'V004', company: 'Cascade Electrical',   contact: 'Dina Watts',    terms: 'Net 30', balance: '$0.00'      },
    ],
  },
  {
    id: 'trial-balance',
    label: 'Trial Balance',
    icon: 'balance',
    description: 'Import your chart of accounts with opening debit and credit balances.',
    templateCols: ['Account Name', 'Account Category', 'Debit', 'Credit'],
    reviewColumns: [
      { key: 'account',  label: 'Account' },
      { key: 'category', label: 'Category' },
      { key: 'debit',    label: 'Debit',  align: 'right' },
      { key: 'credit',   label: 'Credit', align: 'right' },
    ],
    reviewRows: [
      { account: 'Business Checking',       category: 'Asset',     debit: '$12,450.00', credit: '—'          },
      { account: 'Business Savings',        category: 'Asset',     debit: '$8,200.00',  credit: '—'          },
      { account: 'Accounts Receivable',     category: 'Asset',     debit: '$24,550.00', credit: '—'          },
      { account: 'Accounts Payable',        category: 'Liability', debit: '—',          credit: '$10,400.00' },
      { account: 'Loan Payable',            category: 'Liability', debit: '—',          credit: '$32,705.00' },
      { account: 'Retained Earnings',       category: 'Equity',    debit: '—',          credit: '$1,000.00'  },
    ],
  },
]

const STEP_ORDER: StepId[] = ['bank-accounts', 'customers', 'jobs', 'vendors', 'trial-balance']

// Trial Balance totals (used in balance modal)
const TB_DEBIT_TOTAL  = 45_200.00
const TB_CREDIT_TOTAL = 44_105.00
const TB_DIFF         = TB_DEBIT_TOTAL - TB_CREDIT_TOTAL // $1,095.00


const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

// ─── Wizard shell ─────────────────────────────────────────────────────────────

function WizardShell({
  title,
  subtitle,
  illustration,
  children,
  onClose,
  footer,
}: {
  title: string
  subtitle: string
  illustration?: React.ReactNode
  children: React.ReactNode
  onClose: () => void
  footer: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--modus-wc-color-base-page)' }}>
      {/* Header */}
      <div className="wizard-header" style={{ borderBottom: '1px solid var(--modus-wc-color-base-200)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
            {title}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            {subtitle}
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--modus-wc-color-base-content-low-contrast)', display: 'flex', flexShrink: 0 }}>
          <ModusWcIcon name="close" size="sm" decorative />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div className="wizard-content" style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          {children}
        </div>
        {illustration && (
          <div className="wizard-illustration-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            {illustration}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="wizard-footer" style={{ borderTop: '1px solid var(--modus-wc-color-base-200)' }}>
        {footer}
      </div>
    </div>
  )
}

// ─── Illustration blob ────────────────────────────────────────────────────────

function Illustration({ icon }: { icon: string }) {
  return (
    <div style={{ width: 160, height: 160, borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%', background: 'color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ModusWcIcon name={icon} size="lg" decorative style={{ color: 'var(--modus-wc-color-primary)', opacity: 0.9 } as React.CSSProperties} />
    </div>
  )
}

// ─── Checklist view ───────────────────────────────────────────────────────────

function ChecklistView({
  completedSteps,
  onStartStep,
  onClose,
}: {
  completedSteps: StepId[]
  onStartStep: (id: StepId) => void
  onClose: () => void
}) {
  const navigate = useNavigate()
  const nextAvailable = STEP_ORDER.find((s) => !completedSteps.includes(s)) ?? null
  const allDone = completedSteps.length === STEP_ORDER.length

  return (
    <WizardShell
      title="Import Data"
      subtitle="Select the type of data to import"
      illustration={<Illustration icon="import_export" />}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif' }}>
              {completedSteps.length} of {STEP_ORDER.length} complete
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('onboarding-path')
                localStorage.removeItem('import-completed-steps')
                navigate('/onboarding')
              }}
              title="Reset demo state"
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}
            >
              <ModusWcIcon name="refresh" size="xs" decorative />
              Reset demo
            </button>
          </div>
          {allDone && (
            <button
              onClick={onClose}
              style={{ padding: '0.5rem 1.5rem', borderRadius: 99, border: 'none', background: 'var(--modus-wc-color-primary)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <ModusWcIcon name="check_circle" size="xs" decorative />
              Done — Go to Dashboard
            </button>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 4 }}>
          <div className="prog-track" style={{ height: 4 }}>
            <div className="prog-fill" style={{ width: `${(completedSteps.length / STEP_ORDER.length) * 100}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {STEPS.map((step, i) => {
          const done      = completedSteps.includes(step.id)
          const available = step.id === nextAvailable
          const locked    = !done && !available

          return (
            <div
              key={step.id}
              style={{
                borderRadius: 10,
                padding: '0.875rem 1rem',
                border: done
                  ? '1.5px solid color-mix(in srgb, var(--modus-wc-color-success, #006638) 35%, transparent)'
                  : available
                  ? '1.5px solid color-mix(in srgb, var(--modus-wc-color-primary) 40%, transparent)'
                  : '1px solid var(--modus-wc-color-base-200)',
                background: done
                  ? 'color-mix(in srgb, var(--modus-wc-color-success, #006638) 4%, transparent)'
                  : available
                  ? 'color-mix(in srgb, var(--modus-wc-color-primary) 3%, transparent)'
                  : 'var(--modus-wc-color-base-100)',
                opacity: locked ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              {/* Step number / status */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: done
                  ? 'var(--modus-wc-color-success, #006638)'
                  : available
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
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Open Sans, sans-serif', color: available ? '#fff' : 'var(--modus-wc-color-base-content-low-contrast)' }}>
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Icon */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: done
                  ? 'color-mix(in srgb, var(--modus-wc-color-success, #006638) 10%, transparent)'
                  : available
                  ? 'color-mix(in srgb, var(--modus-wc-color-primary) 10%, transparent)'
                  : 'var(--modus-wc-color-base-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <ModusWcIcon
                  name={step.icon}
                  size="sm"
                  decorative
                  style={{ color: done ? 'var(--modus-wc-color-success, #006638)' : available ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties}
                />
              </div>

              {/* Label */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 2 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                  {done ? 'Imported successfully' : step.description}
                </div>
              </div>

              {/* Action */}
              {done && (
                <span style={{ fontSize: '0.75rem', color: 'var(--modus-wc-color-success, #006638)', fontWeight: 600, flexShrink: 0, fontFamily: 'Open Sans, sans-serif' }}>
                  Complete
                </span>
              )}
              {available && (
                <button
                  onClick={() => onStartStep(step.id)}
                  style={{
                    padding: '0.375rem 1rem',
                    borderRadius: 99,
                    border: 'none',
                    background: 'var(--modus-wc-color-primary)',
                    color: '#fff',
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {completedSteps.length === 0 && i === 0 ? 'Start' : 'Import'}
                  <ModusWcIcon name="arrow_forward" size="xs" decorative />
                </button>
              )}
              {locked && (
                <ModusWcIcon name="lock" size="sm" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)', flexShrink: 0 } as React.CSSProperties} />
              )}
            </div>
          )
        })}
      </div>
    </WizardShell>
  )
}

// ─── Upload view ──────────────────────────────────────────────────────────────

function UploadView({
  step,
  fileName,
  onFileChange,
  onBack,
  onNext,
}: {
  step: ImportStepDef
  fileName: string | null
  onFileChange: (name: string | null) => void
  onBack: () => void
  onNext: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFileChange(f.name)
  }

  return (
    <WizardShell
      title="Import Data"
      subtitle={step.label}
      illustration={<Illustration icon="upload_file" />}
      onClose={onBack}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', color: 'var(--modus-wc-color-primary)', textDecoration: 'underline', padding: 0 }}>
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!fileName}
            style={{ padding: '0.625rem 1.5rem', borderRadius: 99, border: 'none', background: fileName ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-200)', color: fileName ? '#fff' : 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: fileName ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
          >
            Review data
            <ModusWcIcon name="arrow_forward" size="xs" decorative />
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 520 }}>
        {/* Instructions */}
        <div>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            How to import your {step.label.toLowerCase()}
          </p>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              <>Start with a template. <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--modus-wc-color-primary)' }}>Download this sample CSV</a></>,
              'Fill in the template in Excel or Google Sheets with your data.',
              'Upload your file below and confirm the data on the next screen.',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content)', lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ol>
        </div>

        {/* Trial Balance notice */}
        {step.id === 'trial-balance' && (
          <div style={{ borderRadius: 8, border: '1.5px solid color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 50%, transparent)', background: 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 8%, transparent)', padding: '0.875rem 1rem', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <ModusWcIcon name="info" size="sm" decorative style={{ color: '#7a5200', flexShrink: 0, marginTop: 1 } as React.CSSProperties} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#7a5200', marginBottom: 4 }}>Debit and credit balance check</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)', lineHeight: 1.5 }}>
                After you review your data, we'll check that your total debits equal your total credits. If there's a discrepancy, we'll help you resolve it before completing your import.
              </div>
            </div>
          </div>
        )}

        {/* Drop zone / file attached */}
        {!fileName ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{ border: `2px dashed ${dragging ? 'var(--modus-wc-color-primary)' : 'var(--modus-wc-color-base-200)'}`, borderRadius: 10, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', background: dragging ? 'color-mix(in srgb, var(--modus-wc-color-primary) 4%, transparent)' : 'var(--modus-wc-color-base-page)', transition: 'border-color 0.15s, background 0.15s', textAlign: 'center' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--modus-wc-color-base-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

            {/* Sample data shortcut */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--modus-wc-color-base-200)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--modus-wc-color-base-content-low-contrast)', fontFamily: 'Open Sans, sans-serif', whiteSpace: 'nowrap' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--modus-wc-color-base-200)' }} />
            </div>
            <button
              onClick={() => onFileChange(`sample-${step.id}.csv`)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.625rem 1rem', borderRadius: 8, border: '1.5px solid color-mix(in srgb, var(--modus-wc-color-primary) 40%, transparent)', background: 'color-mix(in srgb, var(--modus-wc-color-primary) 4%, transparent)', color: 'var(--modus-wc-color-primary)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
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
              <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>File ready — click Review data to continue</div>
            </div>
            <button onClick={() => onFileChange(null)} aria-label="Remove file" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: 'var(--modus-wc-color-base-content-low-contrast)', display: 'flex' }}>
              <ModusWcIcon name="close" size="xs" decorative />
            </button>
          </div>
        )}
      </div>
    </WizardShell>
  )
}

// ─── Review view ──────────────────────────────────────────────────────────────

function ImportConfirmModal({
  step,
  onConfirm,
  onCancel,
}: {
  step: ImportStepDef
  onConfirm: () => void
  onCancel: () => void
}) {
  const count = step.reviewRows.length
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'var(--modus-wc-color-base-page)', borderRadius: 16, padding: '1.75rem', maxWidth: 420, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 4 }}>
            Import {step.label}?
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.6 }}>
            You're about to import <strong style={{ color: 'var(--modus-wc-color-base-content)' }}>{count} {count === 1 ? 'record' : 'records'}</strong> into Trimble Financials. Please confirm you've reviewed the data above.
          </div>
        </div>
        <div style={{ background: 'var(--modus-wc-color-base-100)', border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 8, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>Records to import</span>
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)' }}>{count}</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.5 }}>
          This action can be undone within 24 hours from Settings.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '0.5rem 1.25rem', borderRadius: 99, border: '1.5px solid var(--modus-wc-color-base-200)', background: 'transparent', color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding: '0.5rem 1.5rem', borderRadius: 99, border: 'none', background: 'var(--modus-wc-color-primary)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
            Confirm Import
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewView({
  step,
  onBack,
  onImport,
}: {
  step: ImportStepDef
  onBack: () => void
  onImport: () => void
}) {
  const count = step.reviewRows.length
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
    {showConfirm && (
      <ImportConfirmModal
        step={step}
        onConfirm={() => { setShowConfirm(false); onImport() }}
        onCancel={() => setShowConfirm(false)}
      />
    )}
    <WizardShell
      title="Import Data"
      subtitle={step.label}
      onClose={onBack}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', color: 'var(--modus-wc-color-primary)', textDecoration: 'underline', padding: 0 }}>
            Back
          </button>
          <button onClick={() => setShowConfirm(true)} style={{ padding: '0.625rem 1.75rem', borderRadius: 99, border: 'none', background: 'var(--modus-wc-color-primary)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModusWcIcon name="upload_file" size="xs" decorative />
            Import
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--modus-wc-color-base-content)' }}>
          <strong>{count} {count === 1 ? 'line' : 'lines'} imported.</strong>{' '}
          <span style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
            Please review them below and then click Import.
          </span>
        </p>

        {/* Data table */}
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
          Importing will add these records to your Trimble Financials account. This action can be undone within 24 hours from Settings.
        </p>
      </div>
    </WizardShell>
    </>
  )
}

// ─── Balance modal ─────────────────────────────────────────────────────────────

function BalanceModal({
  onFixManually,
  onAutoBalance,
}: {
  onFixManually: () => void
  onAutoBalance: () => void
}) {
  const [showJournalPreview, setShowJournalPreview] = useState(false)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'var(--modus-wc-color-base-page)', borderRadius: 16, padding: '1.75rem', maxWidth: 460, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ModusWcIcon name="balance" size="sm" decorative style={{ color: '#7a5200' } as React.CSSProperties} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--modus-wc-color-base-content)', marginBottom: 4 }}>
              Debits and credits don't balance
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)', lineHeight: 1.55 }}>
              Your trial balance has a discrepancy. All accounts must balance before your books are complete.
            </div>
          </div>
        </div>

        {/* Totals summary */}
        <div style={{ background: 'var(--modus-wc-color-base-100)', border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { label: 'Total Debits',  value: fmt(TB_DEBIT_TOTAL),  muted: false },
            { label: 'Total Credits', value: fmt(TB_CREDIT_TOTAL), muted: false },
            { label: 'Difference',    value: fmt(TB_DIFF),         muted: false, highlight: true },
          ].map(({ label, value, highlight }, i) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 1rem', borderBottom: i < 2 ? '1px solid var(--modus-wc-color-base-200)' : 'none', background: highlight ? 'color-mix(in srgb, var(--modus-wc-color-warning, #fbad26) 8%, transparent)' : 'transparent' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>{label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: highlight ? '#7a5200' : 'var(--modus-wc-color-base-content)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Auto-balance preview toggle */}
        <div style={{ border: '1px solid var(--modus-wc-color-base-200)', borderRadius: 8, overflow: 'hidden' }}>
          <button
            onClick={() => setShowJournalPreview((v) => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--modus-wc-color-base-page)', border: 'none', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', gap: 8 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ModusWcIcon name="auto_fix_high" size="xs" decorative style={{ color: 'var(--modus-wc-color-primary)' } as React.CSSProperties} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--modus-wc-color-primary)' }}>
                View auto-balance adjustment
              </span>
            </span>
            <ModusWcIcon name={showJournalPreview ? 'expand_less' : 'expand_more'} size="xs" decorative style={{ color: 'var(--modus-wc-color-base-content-low-contrast)' } as React.CSSProperties} />
          </button>

          {showJournalPreview && (
            <div style={{ padding: '0 0 0.75rem', borderTop: '1px solid var(--modus-wc-color-base-200)' }}>
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
                    <td>Jun 25, 2026</td>
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
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onFixManually}
            style={{ padding: '0.5rem 1.25rem', borderRadius: 99, border: '1.5px solid var(--modus-wc-color-base-200)', background: 'transparent', color: 'var(--modus-wc-color-base-content)', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Fix and re-upload
          </button>
          <button
            onClick={onAutoBalance}
            style={{ padding: '0.5rem 1.5rem', borderRadius: 99, border: 'none', background: 'var(--modus-wc-color-primary)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ModusWcIcon name="auto_fix_high" size="xs" decorative />
            Apply auto-balance
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ImportWizard ─────────────────────────────────────────────────────────────

function loadCompletedSteps(): StepId[] {
  try {
    return JSON.parse(localStorage.getItem('import-completed-steps') || '[]')
  } catch {
    return []
  }
}

function saveCompletedSteps(steps: StepId[]) {
  localStorage.setItem('import-completed-steps', JSON.stringify(steps))
}

export default function ImportWizard() {
  const navigate = useNavigate()

  const [completedSteps, setCompletedSteps] = useState<StepId[]>(loadCompletedSteps)
  const [phase, setPhase]       = useState<Phase>('checklist')
  const [activeStepId, setActiveStepId] = useState<StepId | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [showBalanceModal, setShowBalanceModal] = useState(false)

  const activeStep = STEPS.find((s) => s.id === activeStepId) ?? null

  const markComplete = (id: StepId) => {
    const updated = [...completedSteps, id]
    setCompletedSteps(updated)
    saveCompletedSteps(updated)
  }

  const handleStartStep = (id: StepId) => {
    setActiveStepId(id)
    setFileName(null)
    setPhase('upload')
  }

  const handleUploadNext = () => setPhase('review')

  const handleImport = () => {
    if (activeStepId === 'trial-balance') {
      setShowBalanceModal(true)
    } else {
      markComplete(activeStepId!)
      setPhase('checklist')
      setActiveStepId(null)
    }
  }

  const handleBalanceFixManually = () => {
    setShowBalanceModal(false)
    setFileName(null)
    setPhase('upload')
  }

  const handleAutoBalance = () => {
    setShowBalanceModal(false)
    markComplete('trial-balance')
    setPhase('checklist')
    setActiveStepId(null)
  }

  const handleClose = () => navigate('/')

  return (
    <>
      {phase === 'checklist' && (
        <ChecklistView
          completedSteps={completedSteps}
          onStartStep={handleStartStep}
          onClose={handleClose}
        />
      )}

      {phase === 'upload' && activeStep && (
        <UploadView
          step={activeStep}
          fileName={fileName}
          onFileChange={(n) => setFileName(n)}
          onBack={() => setPhase('checklist')}
          onNext={handleUploadNext}
        />
      )}

      {phase === 'review' && activeStep && (
        <ReviewView
          step={activeStep}
          onBack={() => setPhase('upload')}
          onImport={handleImport}
        />
      )}

      {showBalanceModal && (
        <BalanceModal
          onFixManually={handleBalanceFixManually}
          onAutoBalance={handleAutoBalance}
        />
      )}
    </>
  )
}

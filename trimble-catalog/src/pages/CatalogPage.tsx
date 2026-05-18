import { useState, useRef, useEffect, useCallback } from 'react'
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'
import { APPS, CATEGORIES, ROLES, type SoftwareApp, type Category } from '../data/apps'

// ─── Request modal ─────────────────────────────────────────────────────────────

interface RequestModalProps {
  app: SoftwareApp
  onClose: () => void
  onSubmit: (appId: string) => void
}

function RequestModal({ app, onClose, onSubmit }: RequestModalProps) {
  const [forUser, setForUser] = useState('Alex Johnson (me)')
  const [manager, setManager] = useState('')
  const [urgency, setUrgency] = useState('standard')
  const [justification, setJustification] = useState('')
  const [step, setStep] = useState<'form' | 'success'>('form')

  const isValid = justification.trim() !== '' && manager.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setStep('success')
    onSubmit(app.id)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {step === 'form' ? (
          <>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <div
                  className="app-card-logo"
                  style={{ width: 40, height: 40, fontSize: '0.875rem', background: app.logoColor }}
                >
                  {app.logoInitials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--modus-wc-color-base-content)' }}>
                    Request Access
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                    {app.name} · {app.vendor}
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={onClose} aria-label="Close">
                <ModusWcIcon name="close" size="sm" decorative />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Cost callout */}
                {app.annualCostPerUser !== null && app.annualCostPerUser > 0 && (
                  <div style={{
                    background: 'color-mix(in srgb, var(--modus-wc-color-primary) 8%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--modus-wc-color-primary) 25%, transparent)',
                    borderRadius: 8,
                    padding: '0.75rem',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}>
                    <ModusWcIcon name="info" size="sm" decorative
                      style={{ color: 'var(--modus-wc-color-primary)', flexShrink: 0, marginTop: 1 } as React.CSSProperties}
                    />
                    <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)' }}>
                      <strong>Annual cost:</strong> ${app.annualCostPerUser.toLocaleString()}/user/year.
                      {' '}Manager approval is required for this license.
                    </div>
                  </div>
                )}

                {app.annualCostPerUser === 0 && (
                  <div style={{
                    background: 'color-mix(in srgb, var(--modus-wc-color-success, #006638) 8%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--modus-wc-color-success, #006638) 20%, transparent)',
                    borderRadius: 8,
                    padding: '0.75rem',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                    <ModusWcIcon name="check_circle" size="sm" decorative
                      style={{ color: 'var(--modus-wc-color-success, #006638)', flexShrink: 0 } as React.CSSProperties}
                    />
                    <div style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content)' }}>
                      <strong>Free license</strong> — no manager approval required.
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label className="form-label form-label-req">Who is this for?</label>
                  <input
                    className="form-input"
                    value={forUser}
                    onChange={(e) => setForUser(e.target.value)}
                    placeholder="Search for a user"
                    required
                  />
                  <span className="form-hint">Request on behalf of someone else by searching their name.</span>
                </div>

                <div className="form-field">
                  <label className="form-label form-label-req">Requester's manager</label>
                  <input
                    className="form-input"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="Search for a manager"
                    required
                    list="manager-suggestions"
                  />
                  <datalist id="manager-suggestions">
                    <option value="Sarah Mitchell" />
                    <option value="David Nguyen" />
                    <option value="Rachel Torres" />
                    <option value="James Okafor" />
                    <option value="Linda Park" />
                  </datalist>
                  <span className="form-hint">Your manager will be notified and must approve this request.</span>
                </div>

                <div className="form-field">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    <option value="standard">Standard (2–5 business days)</option>
                    <option value="urgent">Urgent (next business day)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label form-label-req">Business justification</label>
                  <textarea
                    className="form-textarea"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder={`Why do you need ${app.name}? Briefly describe your use case…`}
                    required
                  />
                  <span className="form-hint">Helps speed up approval. E.g. "Need for the Q3 campaign design work."</span>
                </div>

                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--modus-wc-color-base-content-low-contrast)',
                  padding: '0.5rem 0',
                }}>
                  By submitting, your request will be routed to <strong>it_support@trimble.com</strong> and{' '}
                  {manager.trim() ? <strong>{manager}</strong> : 'your manager'} for approval.
                  You will receive an email confirmation.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
                >
                  <ModusWcIcon name="send" size="xs" decorative />
                  Submit Request
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="success-icon">
              <ModusWcIcon name="check_circle" size="md" decorative />
            </div>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)', marginBottom: 6 }}>
                Request submitted!
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--modus-wc-color-base-content-low-contrast)', maxWidth: 320 }}>
                Your request for <strong>{app.name}</strong> has been sent for approval. You'll hear back within 2–5 business days.
              </div>
            </div>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── App Card ──────────────────────────────────────────────────────────────────

function AppCard({ app, onRequest }: { app: SoftwareApp; onRequest: (app: SoftwareApp) => void }) {
  const isActive = app.status === 'active'
  const isPending = app.status === 'requested'
  const costLabel = app.annualCostPerUser === null
    ? 'Shared / IT-managed'
    : app.annualCostPerUser === 0
      ? 'Free'
      : `$${app.annualCostPerUser}/user/yr`

  return (
    <div className="app-card" role="button" tabIndex={0} onClick={() => onRequest(app)}>
      {app.isFeatured && <div className="app-card-featured-strip" />}
      {isActive && <div className="app-card-active-badge" title="You have this license" />}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div
          className="app-card-logo"
          style={{ background: app.logoColor }}
        >
          {app.logoInitials}
        </div>
        <div>
          <div className="app-card-name">{app.name}</div>
          <div className="app-card-vendor">{app.vendor}</div>
        </div>
      </div>

      <div className="app-card-desc">{app.description}</div>

      <div className="app-card-footer">
        <div className="app-card-cost">{costLabel}</div>
        {isActive ? (
          <span className="badge badge-success">Active</span>
        ) : isPending ? (
          <span className="badge badge-warning">Requested</span>
        ) : (
          <button
            className="btn-primary"
            style={{ padding: '3px 10px', fontSize: '0.72rem', borderRadius: 99 }}
            onClick={(e) => { e.stopPropagation(); onRequest(app) }}
          >
            Request
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Filter Panel ──────────────────────────────────────────────────────────────

interface FilterState {
  categories: Set<Category>
  myApps: boolean
}

interface FilterPanelProps {
  filters: FilterState
  onChange: (f: FilterState) => void
  apps: SoftwareApp[]
}

function FilterPanel({ filters, onChange, apps }: FilterPanelProps) {
  const toggleCategory = (cat: Category) => {
    const next = new Set(filters.categories)
    if (next.has(cat)) next.delete(cat)
    else next.add(cat)
    onChange({ ...filters, categories: next })
  }

  const countForCat = (cat: Category) => apps.filter((a) => a.category === cat).length

  return (
    <aside className="filter-panel">
      <div className="filter-section">
        <div className="filter-section-title">Usage</div>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.myApps}
            onChange={() => onChange({ ...filters, myApps: !filters.myApps })}
          />
          My Apps
          <span className="filter-option-count">{apps.filter((a) => a.status === 'active').length}</span>
        </label>
      </div>

      <div className="filter-section">
        <div className="filter-section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          Category
          {filters.categories.size > 0 && (
            <button
              style={{ fontSize: '0.65rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--modus-wc-color-primary)', padding: 0 }}
              onClick={() => onChange({ ...filters, categories: new Set() })}
            >
              Clear
            </button>
          )}
        </div>
        {CATEGORIES.map((cat) => (
          <label key={cat} className="filter-option">
            <input
              type="checkbox"
              checked={filters.categories.has(cat)}
              onChange={() => toggleCategory(cat)}
            />
            {cat}
            <span className="filter-option-count">{countForCat(cat)}</span>
          </label>
        ))}
      </div>
    </aside>
  )
}

// ─── CatalogPage ───────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterState>({ categories: new Set(), myApps: false })
  const [activeRole, setActiveRole] = useState<string | null>(null)
  const [requestApp, setRequestApp] = useState<SoftwareApp | null>(null)
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set())
  const searchRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSubmit = useCallback((appId: string) => {
    setSubmittedIds((prev) => new Set([...prev, appId]))
  }, [])

  const filtered = APPS.filter((app) => {
    if (filters.myApps && app.status !== 'active') return false
    if (filters.categories.size > 0 && !filters.categories.has(app.category)) return false
    if (activeRole && !app.roles?.includes(activeRole)) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      app.name.toLowerCase().includes(q) ||
      app.vendor.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q) ||
      app.subcategories.some((s) => s.toLowerCase().includes(q))
    )
  })

  const appWithStatus = filtered.map((a) =>
    submittedIds.has(a.id) ? { ...a, status: 'requested' as const } : a
  )

  // Featured apps first, then alphabetical
  const sorted = [...appWithStatus].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1
    return a.name.localeCompare(b.name)
  })

  const popularRoles = ROLES.slice(0, 6)

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      {/* Page header + search */}
      <div className="page-header" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--modus-wc-color-base-200)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 className="page-title">
              <ModusWcIcon name="apps" size="md" decorative />
              Software Catalog
            </h1>
            <p className="page-subtitle">Browse and request software licenses · {APPS.length} applications</p>
          </div>
        </div>

        {/* Natural language search */}
        <div className="search-bar" style={{ maxWidth: 640 }}>
          <div className="search-bar-icon">
            <ModusWcIcon name="search" size="sm" decorative />
          </div>
          <input
            ref={searchRef}
            className="search-input"
            placeholder='What do you need? Try "design tools", "Python IDE", or "screen recording"…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search software catalog"
          />
        </div>

        {/* Role quick-filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            My role:
          </span>
          <button
            className={`role-pill${activeRole === null ? ' role-pill-active' : ''}`}
            onClick={() => setActiveRole(null)}
          >
            All
          </button>
          {popularRoles.map((role) => (
            <button
              key={role}
              className={`role-pill${activeRole === role ? ' role-pill-active' : ''}`}
              onClick={() => setActiveRole(activeRole === role ? null : role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-layout">
        {/* Filter sidebar */}
        <FilterPanel filters={filters} onChange={setFilters} apps={APPS} />

        {/* Main grid */}
        <div className="catalog-main">
          <div className="results-bar">
            <span className="results-count">
              {sorted.length === APPS.length
                ? `All ${sorted.length} applications`
                : `${sorted.length} of ${APPS.length} applications`}
            </span>
            {(filters.categories.size > 0 || filters.myApps || activeRole || search) && (
              <button
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                onClick={() => {
                  setSearch('')
                  setFilters({ categories: new Set(), myApps: false })
                  setActiveRole(null)
                }}
              >
                Clear all filters
              </button>
            )}
          </div>

          {sorted.length === 0 ? (
            <div className="empty-state">
              <ModusWcIcon name="search" size="lg" decorative />
              <div className="empty-state-title">No applications found</div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Try a different search term or clear your filters.
              </p>
              <button className="btn-primary" onClick={() => {
                setSearch(''); setFilters({ categories: new Set(), myApps: false }); setActiveRole(null)
              }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="app-grid">
              {sorted.map((app) => (
                <AppCard key={app.id} app={app} onRequest={setRequestApp} />
              ))}
            </div>
          )}
        </div>
      </div>

      {requestApp && (
        <RequestModal
          app={requestApp}
          onClose={() => setRequestApp(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

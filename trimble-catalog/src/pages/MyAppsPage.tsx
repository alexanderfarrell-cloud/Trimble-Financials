import { useState } from 'react'
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'
import { APPS } from '../data/apps'

const MY_APPS = APPS.filter((a) => a.status === 'active')

const RENEWAL_DATES: Record<string, string> = {
  '1password':         'Dec 31, 2026',
  'canva':             'Sep 15, 2026',
  'cursor':            'Jan 20, 2027',
  'docker':            'Mar 1, 2027',
  'figma':             'Jun 30, 2026',
  'grammarly':         'Nov 1, 2026',
  'jetbrains-webstorm':'Feb 28, 2027',
  'lucid-suite':       'Aug 31, 2026',
  'microsoft-365':     'Dec 31, 2026',
  'pluralsight':       'Jul 1, 2026',
  'postman':           'N/A — Free',
}

const isExpiringSoon = (dateStr: string) => {
  if (dateStr.startsWith('N/A')) return false
  const d = new Date(dateStr)
  const diff = d.getTime() - Date.now()
  return diff > 0 && diff < 1000 * 60 * 60 * 24 * 90 // 90 days
}

export default function MyAppsPage() {
  const [search, setSearch] = useState('')

  const filtered = MY_APPS.filter((a) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return a.name.toLowerCase().includes(q) || a.vendor.toLowerCase().includes(q)
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <ModusWcIcon name="check_circle" size="md" decorative />
          My Apps
        </h1>
        <p className="page-subtitle">Software licenses assigned to your account · {MY_APPS.length} active</p>
      </div>

      <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search */}
        <div className="search-bar" style={{ maxWidth: 400 }}>
          <div className="search-bar-icon">
            <ModusWcIcon name="search" size="sm" decorative />
          </div>
          <input
            className="search-input"
            placeholder="Search your apps…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Apps table */}
        <div className="section-card">
          <div className="section-card-header">
            <span className="section-card-title">{filtered.length} applications</span>
            <a href="/" style={{ fontSize: '0.8125rem', color: 'var(--modus-wc-color-primary)', textDecoration: 'none' }}>
              Browse catalog →
            </a>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <ModusWcIcon name="search" size="lg" decorative />
              <div className="empty-state-title">No matching apps</div>
            </div>
          ) : (
            <div>
              {/* Header row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 140px 140px 100px',
                gap: '1rem',
                padding: '0.5rem 1rem',
                borderBottom: '1px solid var(--modus-wc-color-base-200)',
                background: 'var(--modus-wc-color-base-100)',
              }}>
                {['Application', 'Category', 'Renewal', 'License'].map((col) => (
                  <span key={col} style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                    {col}
                  </span>
                ))}
              </div>

              {filtered.map((app) => {
                const renewal = RENEWAL_DATES[app.id] ?? 'N/A'
                const expiring = isExpiringSoon(renewal)
                return (
                  <div
                    key={app.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 140px 140px 100px',
                      gap: '1rem',
                      alignItems: 'center',
                    }}
                    className="app-list-row"
                  >
                    {/* App name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="app-list-logo" style={{ background: app.logoColor }}>
                        {app.logoInitials}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content)' }}>
                          {app.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                          {app.vendor}
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <span className="chip">{app.category}</span>

                    {/* Renewal */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {expiring && (
                        <ModusWcIcon name="warning" size="xs" decorative
                          style={{ color: 'var(--modus-wc-color-warning, #fbad26)' } as React.CSSProperties}
                        />
                      )}
                      <span style={{
                        fontSize: '0.8125rem',
                        color: expiring ? '#7a5200' : 'var(--modus-wc-color-base-content)',
                        fontWeight: expiring ? 600 : 400,
                      }}>
                        {renewal}
                      </span>
                    </div>

                    {/* License type */}
                    <span className={`badge ${app.licenseType === 'Enterprise' ? 'badge-secondary' : 'badge-primary'}`}>
                      {app.licenseType}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p style={{ fontSize: '0.75rem', color: 'var(--modus-wc-color-base-content-low-contrast)', margin: 0 }}>
          Need a license removed? Contact <a href="mailto:software_licensing@trimble.com" style={{ color: 'var(--modus-wc-color-primary)' }}>software_licensing@trimble.com</a>
        </p>
      </div>
    </div>
  )
}

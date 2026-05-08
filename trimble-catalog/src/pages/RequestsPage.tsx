import { useState } from 'react'
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'
import { useNavigate } from 'react-router-dom'

type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed'

interface LicenseRequest {
  id: string
  appName: string
  vendor: string
  logoInitials: string
  logoColor: string
  requestedDate: string
  status: RequestStatus
  requestedFor: string
  note?: string
  cost: number | null
}

const SAMPLE_REQUESTS: LicenseRequest[] = [
  {
    id: 'r1',
    appName: 'Figma',
    vendor: 'Figma',
    logoInitials: 'Fi',
    logoColor: '#F24E1E',
    requestedDate: 'Apr 22, 2026',
    status: 'completed',
    requestedFor: 'Alex Johnson',
    cost: 144,
    note: 'Design system work for Q2 product launch.',
  },
  {
    id: 'r2',
    appName: 'Cursor',
    vendor: 'Anysphere',
    logoInitials: 'Cu',
    logoColor: '#1a1a1a',
    requestedDate: 'Apr 10, 2026',
    status: 'completed',
    requestedFor: 'Alex Johnson',
    cost: 240,
    note: 'AI code editor for frontend development.',
  },
  {
    id: 'r3',
    appName: 'Pluralsight',
    vendor: 'Pluralsight',
    logoInitials: 'Pl',
    logoColor: '#F15B2A',
    requestedDate: 'Mar 5, 2026',
    status: 'completed',
    requestedFor: 'Alex Johnson',
    cost: 449,
    note: 'Cloud architecture learning path.',
  },
  {
    id: 'r4',
    appName: 'Adobe Creative Cloud',
    vendor: 'Adobe',
    logoInitials: 'Ae',
    logoColor: '#FF0000',
    requestedDate: 'May 1, 2026',
    status: 'pending',
    requestedFor: 'Alex Johnson',
    cost: 840,
    note: 'Video editing for product demos.',
  },
  {
    id: 'r5',
    appName: 'JetBrains All Products',
    vendor: 'JetBrains',
    logoInitials: 'JB',
    logoColor: '#000000',
    requestedDate: 'Apr 30, 2026',
    status: 'rejected',
    requestedFor: 'Alex Johnson',
    cost: 779,
    note: 'Requested full bundle but individual IDE approved instead.',
  },
]

const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Active',
}

const STATUS_BADGE: Record<RequestStatus, string> = {
  pending: 'badge-warning',
  approved: 'badge-primary',
  rejected: 'badge-secondary',
  completed: 'badge-success',
}

const STATUS_ICON: Record<RequestStatus, string> = {
  pending: 'pending',
  approved: 'check_circle',
  rejected: 'cancel',
  completed: 'check_circle',
}

export default function RequestsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')

  const displayed = SAMPLE_REQUESTS.filter((r) => filter === 'all' || r.status === filter)

  const counts: Record<string, number> = { all: SAMPLE_REQUESTS.length }
  for (const r of SAMPLE_REQUESTS) counts[r.status] = (counts[r.status] ?? 0) + 1

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <ModusWcIcon name="description" size="md" decorative />
          My Requests
        </h1>
        <p className="page-subtitle">License requests you have submitted</p>
      </div>

      <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Status tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', 'pending', 'completed', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              className={`role-pill${filter === s ? ' role-pill-active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
              {counts[s] != null && (
                <span style={{ marginLeft: 5, fontSize: '0.65rem', opacity: 0.75 }}>({counts[s]})</span>
              )}
            </button>
          ))}
        </div>

        {/* Requests list */}
        <div className="section-card">
          {displayed.length === 0 ? (
            <div className="empty-state">
              <ModusWcIcon name="description" size="lg" decorative />
              <div className="empty-state-title">No requests</div>
            </div>
          ) : (
            displayed.map((req) => (
              <div key={req.id} className="request-row">
                {/* Logo */}
                <div className="app-list-logo" style={{ background: req.logoColor }}>
                  {req.logoInitials}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)' }}>
                      {req.appName}
                    </span>
                    <span className={`badge ${STATUS_BADGE[req.status]}`} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <ModusWcIcon name={STATUS_ICON[req.status]} size="xs" decorative />
                      {STATUS_LABEL[req.status]}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--modus-wc-color-base-content-low-contrast)', marginTop: 2 }}>
                    {req.vendor} · Requested {req.requestedDate}
                    {req.note && ` · "${req.note}"`}
                  </div>
                </div>

                {/* Cost */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--modus-wc-color-base-content)' }}>
                    {req.cost === null ? 'Shared' : req.cost === 0 ? 'Free' : `$${req.cost}/yr`}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>per user</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
          <button className="btn-primary" onClick={() => navigate('/')}>
            <ModusWcIcon name="add" size="xs" decorative />
            Browse catalog to request more
          </button>
        </div>
      </div>
    </div>
  )
}

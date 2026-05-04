import { useState } from 'react'
import { ModusWcBadge, ModusWcIcon } from '@trimble-oss/moduswebcomponents-react'

type CustomerType = 'General Contractor' | 'Government' | 'Developer' | 'Owner'
type CustomerStatus = 'Active' | 'Draft'

interface LinkedJob {
  id: string
  name: string
  status: string
  contractValue: number
}

interface Customer {
  id: string
  name: string
  type: CustomerType
  status: CustomerStatus
  contact: string
  title: string
  email: string
  phone: string
  city: string
  activeJobs: number
  totalContractValue: number
  ytdBilled: number
  jobs: LinkedJob[]
}

const CUSTOMERS: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Meridian Construction Group',
    type: 'General Contractor',
    status: 'Active',
    contact: 'David Park',
    title: 'VP of Finance',
    email: 'dpark@meridian-cg.com',
    phone: '(503) 555-0182',
    city: 'Portland, OR',
    activeJobs: 3,
    totalContractValue: 14_500_000,
    ytdBilled: 3_024_000,
    jobs: [
      { id: 'PRJ-2024-0051', name: 'Downtown Tower — Phase 2', status: 'Active', contractValue: 4_200_000 },
      { id: 'PRJ-2023-0027', name: 'Pearl District Lofts', status: 'Completed', contractValue: 3_800_000 },
      { id: 'PRJ-2025-0061', name: 'Eastside Mixed-Use', status: 'Active', contractValue: 6_500_000 },
    ],
  },
  {
    id: 'CUS-002',
    name: 'State Dept. of Transportation',
    type: 'Government',
    status: 'Active',
    contact: 'Lisa Nakamura',
    title: 'Project Director',
    email: 'lnakamura@odot.state.or.us',
    phone: '(503) 986-3400',
    city: 'Salem, OR',
    activeJobs: 1,
    totalContractValue: 8_500_000,
    ytdBilled: 3_400_000,
    jobs: [
      { id: 'PRJ-2024-0048', name: 'Highway 89 Bridge Expansion', status: 'Active', contractValue: 8_500_000 },
    ],
  },
  {
    id: 'CUS-003',
    name: 'Summit Development Corp',
    type: 'Developer',
    status: 'Active',
    contact: 'Rachel Thompson',
    title: 'Development Manager',
    email: 'rthompson@summitdev.com',
    phone: '(503) 555-0244',
    city: 'Lake Oswego, OR',
    activeJobs: 2,
    totalContractValue: 7_300_000,
    ytdBilled: 630_000,
    jobs: [
      { id: 'PRJ-2024-0044', name: 'Lakeside Residential Complex', status: 'On Hold', contractValue: 2_100_000 },
      { id: 'PRJ-2025-0058', name: 'Summit Ridge Townhomes', status: 'Active', contractValue: 5_200_000 },
    ],
  },
  {
    id: 'CUS-004',
    name: 'Regional Airport Authority',
    type: 'Government',
    status: 'Active',
    contact: 'Greg Halvorsen',
    title: 'Capital Projects Manager',
    email: 'ghalvorsen@raa.gov',
    phone: '(503) 555-0315',
    city: 'Hillsboro, OR',
    activeJobs: 1,
    totalContractValue: 12_300_000,
    ytdBilled: 9_225_000,
    jobs: [
      { id: 'PRJ-2023-0038', name: 'Airport Terminal Renovation', status: 'Active', contractValue: 12_300_000 },
    ],
  },
  {
    id: 'CUS-005',
    name: 'Pacific Industrial LLC',
    type: 'Owner',
    status: 'Active',
    contact: 'Tony Reeves',
    title: 'Facilities Director',
    email: 'treeves@pacindustrial.com',
    phone: '(503) 555-0421',
    city: 'Tualatin, OR',
    activeJobs: 0,
    totalContractValue: 5_800_000,
    ytdBilled: 5_800_000,
    jobs: [
      { id: 'PRJ-2023-0031', name: 'Industrial Park — Phase 1', status: 'Completed', contractValue: 5_800_000 },
    ],
  },
  {
    id: 'CUS-006',
    name: 'Cascadia Health Systems',
    type: 'Owner',
    status: 'Draft',
    contact: 'Amanda Hsu',
    title: 'Director of Facilities',
    email: 'ahsu@cascadiahealth.org',
    phone: '(503) 555-0537',
    city: 'Portland, OR',
    activeJobs: 0,
    totalContractValue: 0,
    ytdBilled: 0,
    jobs: [],
  },
  {
    id: 'CUS-007',
    name: 'Metro Transit Authority',
    type: 'Government',
    status: 'Draft',
    contact: 'James Olara',
    title: 'Capital Planning Lead',
    email: 'jolara@metrota.gov',
    phone: '(503) 555-0648',
    city: 'Portland, OR',
    activeJobs: 0,
    totalContractValue: 0,
    ytdBilled: 0,
    jobs: [],
  },
]

const TYPE_COLOR: Record<CustomerType, 'primary' | 'secondary' | 'success' | 'warning'> = {
  'General Contractor': 'primary',
  Government: 'secondary',
  Developer: 'success',
  Owner: 'warning',
}

const JOB_STATUS_COLOR: Record<string, 'success' | 'warning' | 'secondary' | 'primary'> = {
  Active: 'success',
  'On Hold': 'warning',
  Completed: 'secondary',
  Pending: 'primary',
}

function fmt(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${(n / 1_000).toFixed(0)}K`
}

type CustTab = 'All' | 'Active' | 'Draft'
const CUST_TABS: CustTab[] = ['All', 'Active', 'Draft']

export default function CustomerHub() {
  const [activeTab, setActiveTab] = useState<CustTab>('All')
  const [selectedId, setSelectedId] = useState<string>(CUSTOMERS[0].id)

  const visibleCustomers = CUSTOMERS.filter(
    (c) => activeTab === 'All' || c.status === activeTab
  )
  const customer = CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0]

  const tabCount: Record<CustTab, number> = {
    All: CUSTOMERS.length,
    Active: CUSTOMERS.filter((c) => c.status === 'Active').length,
    Draft: CUSTOMERS.filter((c) => c.status === 'Draft').length,
  }

  const collectionRate = customer.ytdBilled > 0
    ? Math.round((customer.ytdBilled / customer.totalContractValue) * 100)
    : 0

  return (
    <div className="hub-page" style={{ height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="hub-title">
          <ModusWcIcon name="contacts" size="md" decorative />
          Customers
        </h1>
        <span className="text-muted">{visibleCustomers.length} of {CUSTOMERS.length} customers</span>
      </div>

      {/* List + Detail */}
      <div className="list-detail" style={{ flex: 1, minHeight: 0 }}>
        {/* Customer list */}
        <div className="list-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div className="tab-bar" style={{ flexShrink: 0 }}>
            {CUST_TABS.map((tab) => (
              <button
                key={tab}
                className={`tab-btn${activeTab === tab ? ' tab-btn--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className={`tab-count${activeTab === tab ? ' tab-count--active' : ''}`}>
                  {tabCount[tab]}
                </span>
              </button>
            ))}
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
          {visibleCustomers.map((c) => (
            <div
              key={c.id}
              className={`list-item${c.id === selectedId ? ' list-item--selected' : ''}`}
              onClick={() => setSelectedId(c.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedId(c.id)}
            >
              <div className="list-item-row">
                <span className="list-item-title">{c.name}</span>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {c.status === 'Draft' && <ModusWcBadge color="secondary" size="sm" text="Draft" />}
                  <ModusWcBadge color={TYPE_COLOR[c.type]} size="sm" text={c.type} />
                </div>
              </div>
              <span className="list-item-sub">{c.contact} · {c.city}</span>
              <div className="list-item-row" style={{ marginTop: 4 }}>
                <span className="text-muted">
                  {c.activeJobs > 0 ? `${c.activeJobs} active job${c.activeJobs !== 1 ? 's' : ''}` : 'No active jobs'}
                </span>
                <span className="text-strong text-body">{c.totalContractValue > 0 ? fmt(c.totalContractValue) : '—'}</span>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Customer detail */}
        <div className="detail-panel">
          {/* Contact card */}
          <div className="section-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <ModusWcBadge color={TYPE_COLOR[customer.type]} size="sm" text={customer.type} />
                  <span className="text-muted">{customer.id}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--modus-wc-color-base-content)' }}>
                  {customer.name}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--modus-wc-color-base-content-low-contrast)' }}>
                  {customer.city}
                </p>
              </div>
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
              <p className="section-card-title">
                <ModusWcIcon name="person" size="sm" decorative />
                Primary Contact
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Name', value: customer.contact },
                  { label: 'Title', value: customer.title },
                  { label: 'Email', value: customer.email },
                  { label: 'Phone', value: customer.phone },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="kpi-label">{label}</span>
                    <span className="text-body">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="kpi-row">
            <div className="kpi-card">
              <span className="kpi-label">Total Contract Value</span>
              <span className="kpi-value">{fmt(customer.totalContractValue)}</span>
              <span className="kpi-sub">{customer.jobs.length} total job{customer.jobs.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Billed YTD</span>
              <span className="kpi-value kpi-value--primary">{fmt(customer.ytdBilled)}</span>
              <span className="kpi-sub">{collectionRate}% of total</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Active Jobs</span>
              <span className={`kpi-value${customer.activeJobs === 0 ? ' kpi-value--warning' : ''}`}>
                {customer.activeJobs}
              </span>
              <span className="kpi-sub">
                {customer.jobs.filter((j) => j.status === 'Completed').length} completed
              </span>
            </div>
          </div>

          {/* Linked jobs */}
          <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
            <p className="section-card-title" style={{ padding: '0.75rem 1rem 0' }}>
              <ModusWcIcon name="assignment" size="sm" decorative />
              Jobs
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Name</th>
                    <th style={{ textAlign: 'right' }}>Contract Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.jobs.map((job) => (
                    <tr key={job.id}>
                      <td><span className="text-muted">{job.id}</span></td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--modus-wc-color-base-content)' }}>
                          {job.name}
                        </span>
                      </td>
                      <td className="amount">{fmt(job.contractValue)}</td>
                      <td>
                        <ModusWcBadge
                          color={JOB_STATUS_COLOR[job.status] ?? 'secondary'}
                          size="sm"
                          text={job.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

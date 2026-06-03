import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import {
  ModusWcNavbar,
  ModusWcThemeProvider,
  ModusWcTypography,
  ModusWcCard,
  ModusWcButton,
  ModusWcIcon,
} from '@trimble-oss/moduswebcomponents-react'

// ── Mockup index page ─────────────────────────────────────────────────────────

interface MockupEntry {
  id: string
  title: string
  description: string
  route: string
  status: 'ready' | 'wip'
}

const MOCKUPS: MockupEntry[] = [
  // Add new mockups here:
  // { id: 'example', title: 'Example Mockup', description: 'What this explores', route: '/example', status: 'wip' },
]

function MockupsIndex() {
  const navigate = useNavigate()

  return (
    <div className="hub-page" style={{ maxWidth: '860px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="Mockups" />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          label="Standalone design explorations using Modus. Add new pages in App.tsx and register them in MOCKUPS."
          customClass="text-muted"
        />
      </div>

      {MOCKUPS.length === 0 ? (
        <ModusWcCard bordered={false} padding="comfortable">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '3rem 2rem',
              color: 'var(--modus-wc-color-base-content-low-contrast)',
              textAlign: 'center',
            }}
          >
            <ModusWcIcon name="design_services" decorative />
            <ModusWcTypography hierarchy="p" size="md" weight="semibold" label="No mockups yet" />
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              label="Add a new page component and register it in the MOCKUPS array in App.tsx."
            />
          </div>
        </ModusWcCard>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {MOCKUPS.map((m) => (
            <ModusWcCard key={m.id} bordered={false} padding="compact">
              <div
                slot="title"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
              >
                <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label={m.title} />
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    background:
                      m.status === 'ready'
                        ? 'var(--modus-wc-color-success)'
                        : 'var(--modus-wc-color-base-200)',
                    color:
                      m.status === 'ready'
                        ? '#fff'
                        : 'var(--modus-wc-color-base-content-low-contrast)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {m.status === 'ready' ? 'Ready' : 'WIP'}
                </span>
              </div>
              <ModusWcTypography hierarchy="p" size="sm" label={m.description} />
              <div slot="footer" style={{ paddingTop: '0.75rem' }}>
                <ModusWcButton
                  size="sm"
                  color="primary"
                  variant="outlined"
                  onButtonClick={() => navigate(m.route)}
                >
                  Open
                </ModusWcButton>
              </div>
            </ModusWcCard>
          ))}
        </div>
      )}
    </div>
  )
}

// ── App shell ─────────────────────────────────────────────────────────────────

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isIndex = location.pathname === '/'

  return (
    <ModusWcThemeProvider>
      <div className="app-shell">
        <ModusWcNavbar
          onMainMenuOpenChange={() => {}}
          visibility={{ mainMenu: false, apps: false, search: false, searchInput: false, notifications: false, help: false }}
        >
          <div slot="start" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!isIndex && (
              <ModusWcButton
                size="md"
                variant="borderless"
                color="secondary"
                onButtonClick={() => navigate('/')}
                aria-label="Back to mockups"
              >
                <ModusWcIcon name="arrow_back" decorative />
              </ModusWcButton>
            )}
            <ModusWcTypography hierarchy="p" size="md" weight="semibold" label="Prism Mockups" />
          </div>
        </ModusWcNavbar>

        <div className="app-body">
          <main id="main-content">
            <Routes>
              <Route path="/" element={<MockupsIndex />} />
              {/* Register new mockup routes here */}
            </Routes>
          </main>
        </div>
      </div>
    </ModusWcThemeProvider>
  )
}

import { useState } from 'react'
import { ModusWcThemeProvider, ModusWcNavbar } from '@trimble-oss/moduswebcomponents-react'
import JobDetailPage, { type Iteration } from './pages/JobDetailPage'

const ITERATIONS: { value: Iteration; label: string }[] = [
  { value: 1, label: 'v1 — Baseline' },
  { value: 2, label: 'v2' },
  { value: 3, label: 'v3' },
  { value: 4, label: 'v4' },
  { value: 5, label: 'v5' },
]

export default function App() {
  const [iteration, setIteration] = useState<Iteration>(1)

  return (
    <ModusWcThemeProvider>
      <div className="app-shell">
        {/* ── Navbar ────────────────────────────────────── */}
        <ModusWcNavbar
          mainMenuOpen={false}
          visibility={{
            logo: true,
            mainMenu: false,
            apps: true,
            search: false,
            searchInput: false,
            notifications: true,
            help: true,
            user: true,
            ai: false,
          }}
          customClass="sticky top-0 z-[120]"
          onAppsClick={() => {}}
          onNotificationsClick={() => {}}
          onHelpClick={() => {}}
        >
          {/* App name */}
          <span slot="start">
            <span
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--modus-wc-color-base-content)',
                paddingLeft: '0.5rem',
              }}
            >
              Prism
            </span>
          </span>

          {/* Iteration switcher */}
          <span slot="end">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingRight: '0.75rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--modus-wc-color-base-content-low-contrast)',
                  whiteSpace: 'nowrap',
                }}
              >
                Iteration
              </span>
              <select
                value={iteration}
                onChange={(e) => setIteration(Number(e.target.value) as Iteration)}
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--modus-wc-color-base-200)',
                  background: 'var(--modus-wc-color-base-100)',
                  color: 'var(--modus-wc-color-primary)',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '140px',
                }}
              >
                {ITERATIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </span>
        </ModusWcNavbar>

        {/* ── Main content ──────────────────────────────── */}
        <main id="main-content">
          <JobDetailPage key={iteration} iteration={iteration} />
        </main>
      </div>
    </ModusWcThemeProvider>
  )
}

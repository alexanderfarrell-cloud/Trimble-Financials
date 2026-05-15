import { useState, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import {
  ModusWcThemeProvider,
  ModusWcNavbar,
  ModusWcSideNavigation,
  ModusWcMenu,
  ModusWcMenuItem,
  ModusWcIcon,
} from '@trimble-oss/moduswebcomponents-react'
import { useMediaQuery } from './hooks/useMediaQuery'
import DashboardHub from './pages/DashboardHub'
import JobHub from './pages/JobHub'
import NewJobPage from './pages/NewJobPage'
import BillingHub from './pages/BillingHub'
import CustomerHub from './pages/CustomerHub'
import ExpenseHub from './pages/ExpenseHub'
import VendorHub from './pages/VendorHub'
import PeriodWorkspacePage from './pages/PeriodWorkspacePage'
import ClosePeriodWizard from './pages/ClosePeriodWizard'
import ReopenPeriodWizard from './pages/ReopenPeriodWizard'
import { PeriodsProvider } from './context/PeriodsContext'

const SIDENAV_MAX_WIDTH = '256px'
const SIDENAV_MIN_WIDTH = '4rem'
const NAVBAR_HEIGHT = 56

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/jobs', label: 'Jobs', icon: 'assignment' },
  { path: '/billing', label: 'Billing', icon: 'receipt' },
  { path: '/customers', label: 'Customers', icon: 'contacts' },
  { path: '/expenses', label: 'Expenses', icon: 'credit_card' },
  { path: '/vendors', label: 'Vendors', icon: 'business' },
  { path: '/periods', label: 'Periods', icon: 'calendar_today' },
] as const

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isXl = useMediaQuery('(min-width: 1280px)')

  const [sideNavExpanded, setSideNavExpanded] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches
  )

  // Sync expanded default with XL breakpoint crossing
  useEffect(() => {
    setSideNavExpanded(isXl)
  }, [isXl])

  // Guarantee correct main-content margin on first paint and state changes (double rAF)
  useLayoutEffect(() => {
    if (!isDesktop) return
    let outer: number
    let inner: number
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const main = document.getElementById('main-content')
        if (main) {
          main.style.marginLeft = sideNavExpanded ? SIDENAV_MAX_WIDTH : SIDENAV_MIN_WIDTH
        }
      })
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [isDesktop, sideNavExpanded])

  // Clear inline margin on mobile so CSS margin-left: 0 !important takes effect
  useEffect(() => {
    if (!isDesktop) {
      const main = document.getElementById('main-content')
      if (main) main.style.marginLeft = ''
    }
  }, [isDesktop])

  const handleExpandedChange = (e: Event) => {
    setSideNavExpanded((e as CustomEvent<boolean>).detail)
  }

  const handleMainMenuOpenChange = (e: Event) => {
    setSideNavExpanded((e as CustomEvent<boolean>).detail)
  }

  return (
    <ModusWcThemeProvider>
      <div className="app-shell">
        {/* ── Navbar ──────────────────────────────────────────────────── */}
        <ModusWcNavbar
          appTitle="Prism"
          mainMenuOpen={sideNavExpanded}
          onMainMenuOpenChange={handleMainMenuOpenChange}
          visibility={{
            logo: true,
            mainMenu: true,
            apps: false,
            search: false,
            searchInput: false,
            notifications: true,
            help: true,
            user: true,
            ai: false,
          }}
          userCard={{
            name: 'Alex Johnson',
            email: 'ajohnson@trimble.com',
            avatarAlt: 'AJ',
          }}
          customClass="sticky top-0"
          style={{ zIndex: 120 } as React.CSSProperties}
          onNotificationsClick={() => {}}
          onHelpClick={() => {}}
        />

        {/* ── Body row ────────────────────────────────────────────────── */}
        <div className="app-body">
          {/* Fixed side rail */}
          <div
            className={`rail-wrapper${!isDesktop && sideNavExpanded ? ' rail-expanded' : ''}`}
            style={{
              top: NAVBAR_HEIGHT,
              height: `calc(100dvh - ${NAVBAR_HEIGHT}px)`,
              zIndex: 130,
            }}
          >
            <ModusWcSideNavigation
              expanded={sideNavExpanded}
              mode={isDesktop ? 'push' : 'overlay'}
              maxWidth={SIDENAV_MAX_WIDTH}
              targetContent="#main-content"
              collapseOnClickOutside={!isDesktop}
              onExpandedChange={handleExpandedChange}
              style={{ height: '100%' } as React.CSSProperties}
            >
              <ModusWcMenu size="lg">
                {NAV_ITEMS.map(({ path, label, icon }) => (
                  <ModusWcMenuItem
                    key={path}
                    label={label}
                    selected={location.pathname === path}
                    onItemSelect={() => navigate(path)}
                  >
                    <ModusWcIcon
                      slot="start-icon"
                      name={icon}
                      size="md"
                      decorative
                    />
                  </ModusWcMenuItem>
                ))}
              </ModusWcMenu>
            </ModusWcSideNavigation>
          </div>

          {/* Main scrollable area */}
          <main id="main-content">
            <PeriodsProvider>
              <Routes>
                <Route path="/" element={<DashboardHub />} />
                <Route path="/jobs" element={<JobHub />} />
                <Route path="/jobs/new" element={<NewJobPage />} />
                <Route path="/billing" element={<BillingHub />} />
                <Route path="/customers" element={<CustomerHub />} />
                <Route path="/expenses" element={<ExpenseHub />} />
                <Route path="/vendors" element={<VendorHub />} />
                <Route path="/periods" element={<PeriodWorkspacePage />} />
                <Route path="/periods/close" element={<ClosePeriodWizard />} />
                <Route path="/periods/reopen" element={<ReopenPeriodWizard />} />
              </Routes>
            </PeriodsProvider>
          </main>
        </div>
      </div>
    </ModusWcThemeProvider>
  )
}

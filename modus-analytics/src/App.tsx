import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import {
  ModusWcThemeProvider,
  ModusWcNavbar,
  ModusWcSideNavigation,
  ModusWcMenu,
  ModusWcMenuItem,
  ModusWcIcon,
} from '@trimble-oss/moduswebcomponents-react'

import OverviewPage from './pages/OverviewPage'
import TrafficPage from './pages/TrafficPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

type Page = 'overview' | 'traffic' | 'reports' | 'settings'

const SIDENAV_MAX_WIDTH = '256px'
const SIDENAV_MIN_WIDTH = '4rem'
const NAVBAR_HEIGHT = 56

const navItems: { value: Page; label: string; icon: string }[] = [
  { value: 'overview', label: 'Overview', icon: 'home' },
  { value: 'traffic', label: 'Traffic', icon: 'bar_graph' },
  { value: 'reports', label: 'Reports', icon: 'master_data' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isXl = useMediaQuery('(min-width: 1280px)')

  // XL: default expanded; below XL: collapsed
  const [sideNavExpanded, setSideNavExpanded] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1280px)').matches
      : false
  )

  const [activePage, setActivePage] = useState<Page>('overview')

  // Sync expanded when crossing XL breakpoint
  useEffect(() => {
    setSideNavExpanded(isXl)
  }, [isXl])

  // Required: double-rAF nudge for expanded-push first paint
  const rafRef = useRef<number | null>(null)
  useLayoutEffect(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    if (isDesktop && sideNavExpanded) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          const main = document.getElementById('main-content')
          if (main) main.style.marginLeft = SIDENAV_MAX_WIDTH
        })
      })
    } else if (isDesktop && !sideNavExpanded) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          const main = document.getElementById('main-content')
          if (main) main.style.marginLeft = SIDENAV_MIN_WIDTH
        })
      })
    }
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [isDesktop, sideNavExpanded])

  const handleMainMenuOpenChange = useCallback((e: CustomEvent<boolean>) => {
    setSideNavExpanded(e.detail)
  }, [])

  const handleExpandedChange = useCallback((e: CustomEvent<boolean>) => {
    setSideNavExpanded(e.detail)
  }, [])

  const handleItemSelect = useCallback((e: CustomEvent<{ value: string }>) => {
    const val = e.detail?.value as Page
    if (val) setActivePage(val)
  }, [])

  const railWrapperClass = [
    'side-rail-wrapper',
    !isDesktop && sideNavExpanded ? 'open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ModusWcThemeProvider>
      <div className="app-shell">
        {/* Sticky top navbar */}
        <ModusWcNavbar
          customClass="sticky top-0 z-[120] flex-shrink-0"
          mainMenuOpen={sideNavExpanded}
          visibility={{
            logo: true,
            mainMenu: true,
            apps: true,
            search: true,
            searchInput: false,
            notifications: true,
            help: true,
            user: true,
            ai: false,
          }}
          userCard={{
            name: 'Alex Johnson',
            email: 'alex.johnson@trimble.com',
            avatarSrc: '',
            avatarAlt: 'Alex Johnson',
          }}
          onMainMenuOpenChange={handleMainMenuOpenChange as EventListener}
        />

        {/* App body: fixed rail + scrollable main */}
        <div className="app-body-row">
          {/* Fixed side rail wrapper */}
          <div
            className={railWrapperClass}
            style={{
              top: NAVBAR_HEIGHT,
              height: `calc(100dvh - ${NAVBAR_HEIGHT}px)`,
            }}
          >
            <ModusWcSideNavigation
              expanded={sideNavExpanded}
              maxWidth={SIDENAV_MAX_WIDTH}
              mode={isDesktop ? 'push' : 'overlay'}
              targetContent="#main-content"
              collapseOnClickOutside={!isDesktop}
              onExpandedChange={handleExpandedChange as EventListener}
            >
              <ModusWcMenu size="lg">
                {navItems.map((item) => (
                  <ModusWcMenuItem
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    selected={activePage === item.value}
                    onItemSelect={handleItemSelect as EventListener}
                  >
                    <ModusWcIcon
                      slot="start-icon"
                      name={item.icon}
                      size="md"
                      decorative
                    />
                  </ModusWcMenuItem>
                ))}
              </ModusWcMenu>
            </ModusWcSideNavigation>
          </div>

          {/* Main scrollable content */}
          <main id="main-content">
            <div key={activePage} className="page-main">
              {activePage === 'overview' && <OverviewPage />}
              {activePage === 'traffic' && <TrafficPage />}
              {activePage === 'reports' && <ReportsPage />}
              {activePage === 'settings' && <SettingsPage />}
            </div>
          </main>
        </div>
      </div>
    </ModusWcThemeProvider>
  )
}

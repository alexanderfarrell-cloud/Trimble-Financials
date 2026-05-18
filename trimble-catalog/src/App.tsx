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
import CatalogPage from './pages/CatalogPage'
import MyAppsPage from './pages/MyAppsPage'
import RequestsPage from './pages/RequestsPage'

const SIDENAV_MAX_WIDTH = '220px'
const SIDENAV_MIN_WIDTH = '4rem'
const NAVBAR_HEIGHT = 56

const NAV_ITEMS = [
  { path: '/',         label: 'Catalog',     icon: 'apps' },
  { path: '/my-apps',  label: 'My Apps',     icon: 'check_circle' },
  { path: '/requests', label: 'My Requests', icon: 'description' },
] as const

export default function App() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isXl      = useMediaQuery('(min-width: 1280px)')

  const [sideNavExpanded, setSideNavExpanded] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches
  )

  useEffect(() => { setSideNavExpanded(isXl) }, [isXl])

  useLayoutEffect(() => {
    if (!isDesktop) return
    let outer: number
    let inner: number
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const main = document.getElementById('main-content')
        if (main) main.style.marginLeft = sideNavExpanded ? SIDENAV_MAX_WIDTH : SIDENAV_MIN_WIDTH
      })
    })
    return () => { cancelAnimationFrame(outer); cancelAnimationFrame(inner) }
  }, [isDesktop, sideNavExpanded])

  useEffect(() => {
    if (!isDesktop) {
      const main = document.getElementById('main-content')
      if (main) main.style.marginLeft = ''
    }
  }, [isDesktop])

  return (
    <ModusWcThemeProvider>
      <div className="app-shell">
        <ModusWcNavbar
          appTitle="Software Catalog"
          mainMenuOpen={sideNavExpanded}
          onMainMenuOpenChange={(e) => setSideNavExpanded((e as CustomEvent<boolean>).detail)}
          visibility={{
            logo: true, mainMenu: true, apps: false,
            search: false, searchInput: false,
            notifications: true, help: true, user: true, ai: false,
          }}
          userCard={{ name: 'Alex Johnson', email: 'ajohnson@trimble.com', avatarAlt: 'AJ' }}
          customClass="sticky top-0"
          style={{ zIndex: 120 } as React.CSSProperties}
          onNotificationsClick={() => {}}
          onHelpClick={() => {}}
        />

        <div className="app-body">
          <div
            className={`rail-wrapper${!isDesktop && sideNavExpanded ? ' rail-expanded' : ''}`}
            style={{ top: NAVBAR_HEIGHT, height: `calc(100dvh - ${NAVBAR_HEIGHT}px)`, zIndex: 130 }}
          >
            <ModusWcSideNavigation
              expanded={sideNavExpanded}
              mode={isDesktop ? 'push' : 'overlay'}
              maxWidth={SIDENAV_MAX_WIDTH}
              targetContent="#main-content"
              collapseOnClickOutside={!isDesktop}
              onExpandedChange={(e) => setSideNavExpanded((e as CustomEvent<boolean>).detail)}
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
                    <ModusWcIcon slot="start-icon" name={icon} size="md" decorative />
                  </ModusWcMenuItem>
                ))}
              </ModusWcMenu>
            </ModusWcSideNavigation>
          </div>

          <main id="main-content">
            <Routes>
              <Route path="/"         element={<CatalogPage />} />
              <Route path="/my-apps"  element={<MyAppsPage />} />
              <Route path="/requests" element={<RequestsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ModusWcThemeProvider>
  )
}

import { useState } from 'react'
import {
  ModusWcCard,
  ModusWcTypography,
  ModusWcIcon,
  ModusWcButton,
  ModusWcSwitch,
  ModusWcSelect,
  ModusWcTextInput,
  ModusWcDivider,
} from '@trimble-oss/moduswebcomponents-react'

export default function SettingsPage() {
  const [emailReports, setEmailReports] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [dataRetention, setDataRetention] = useState('90')
  const [timezone, setTimezone] = useState('utc')
  const [displayName, setDisplayName] = useState('Alex Johnson')
  const [email, setEmail] = useState('alex.johnson@trimble.com')

  return (
    <>
      {/* Page hero */}
      <section aria-label="Page header">
        <div className="flex flex-col gap-1">
          <ModusWcTypography hierarchy="h1" size="2xl" weight="bold" label="Settings" />
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
            label="Manage your account and application preferences"
          />
        </div>
      </section>

      {/* Profile card */}
      <section aria-label="Profile settings">
        <ModusWcCard bordered={false} padding="compact">
          <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
            <ModusWcIcon name="person" decorative />
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Profile" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="display-name"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--modus-wc-color-base-content-low-contrast)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Display Name
              </label>
              <ModusWcTextInput
                inputId="display-name"
                value={displayName}
                bordered={false}
                onInputChange={(e: CustomEvent) =>
                  setDisplayName(e.detail?.target?.value ?? '')
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email-input"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--modus-wc-color-base-content-low-contrast)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Email
              </label>
              <ModusWcTextInput
                inputId="email-input"
                value={email}
                type="email"
                bordered={false}
                onInputChange={(e: CustomEvent) =>
                  setEmail(e.detail?.target?.value ?? '')
                }
              />
            </div>
          </div>

          <div
            slot="footer"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              paddingInline: 'var(--modus-wc-spacing-md)',
              paddingTop: 'var(--modus-wc-spacing-md)',
              paddingBottom: 'var(--modus-wc-spacing-md)',
            }}
          >
            <ModusWcButton variant="outlined" color="tertiary" size="sm">
              Cancel
            </ModusWcButton>
            <ModusWcButton variant="filled" color="primary" size="sm">
              Save
            </ModusWcButton>
          </div>
        </ModusWcCard>
      </section>

      {/* Notifications card */}
      <section aria-label="Notification settings">
        <ModusWcCard bordered={false} padding="compact">
          <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
            <ModusWcIcon name="notifications" decorative />
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Notifications" />
          </div>

          <div className="flex flex-col">
            {/* Row: Email Reports */}
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-0.5">
                <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="Email Reports" />
                <ModusWcTypography
                  hierarchy="p"
                  size="xs"
                  customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
                  label="Receive completed reports via email"
                />
              </div>
              <ModusWcSwitch
                value={emailReports}
                aria-label="Toggle email reports"
                onInputChange={(e: CustomEvent) => setEmailReports(e.detail)}
              />
            </div>
            <ModusWcDivider />

            {/* Row: Push Notifications */}
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-0.5">
                <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="Push Notifications" />
                <ModusWcTypography
                  hierarchy="p"
                  size="xs"
                  customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
                  label="Browser notifications for critical alerts"
                />
              </div>
              <ModusWcSwitch
                value={pushNotifs}
                aria-label="Toggle push notifications"
                onInputChange={(e: CustomEvent) => setPushNotifs(e.detail)}
              />
            </div>
            <ModusWcDivider />

            {/* Row: Weekly Digest */}
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-0.5">
                <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="Weekly Digest" />
                <ModusWcTypography
                  hierarchy="p"
                  size="xs"
                  customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
                  label="Summary email every Monday at 8 AM"
                />
              </div>
              <ModusWcSwitch
                value={weeklyDigest}
                aria-label="Toggle weekly digest"
                onInputChange={(e: CustomEvent) => setWeeklyDigest(e.detail)}
              />
            </div>
          </div>
        </ModusWcCard>
      </section>

      {/* Data preferences */}
      <section aria-label="Data preferences">
        <ModusWcCard bordered={false} padding="compact">
          <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
            <ModusWcIcon name="settings" decorative />
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Data Preferences" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="data-retention"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--modus-wc-color-base-content-low-contrast)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Data Retention (days)
              </label>
              <ModusWcSelect
                inputId="data-retention"
                value={dataRetention}
                onInputChange={(e: CustomEvent) => setDataRetention(e.detail ?? '90')}
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
              </ModusWcSelect>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="timezone"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--modus-wc-color-base-content-low-contrast)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Timezone
              </label>
              <ModusWcSelect
                inputId="timezone"
                value={timezone}
                onInputChange={(e: CustomEvent) => setTimezone(e.detail ?? 'utc')}
              >
                <option value="utc">UTC (Coordinated Universal Time)</option>
                <option value="est">EST (Eastern Standard Time)</option>
                <option value="cst">CST (Central Standard Time)</option>
                <option value="mst">MST (Mountain Standard Time)</option>
                <option value="pst">PST (Pacific Standard Time)</option>
                <option value="gmt">GMT (Greenwich Mean Time)</option>
                <option value="cet">CET (Central European Time)</option>
              </ModusWcSelect>
            </div>
          </div>

          <div
            slot="footer"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              paddingInline: 'var(--modus-wc-spacing-md)',
              paddingTop: 'var(--modus-wc-spacing-md)',
              paddingBottom: 'var(--modus-wc-spacing-md)',
            }}
          >
            <ModusWcButton variant="filled" color="primary" size="sm">
              Save Preferences
            </ModusWcButton>
          </div>
        </ModusWcCard>
      </section>

      {/* Danger zone */}
      <section aria-label="Danger zone">
        <ModusWcCard bordered={false} padding="compact">
          <div slot="title" className="flex w-full min-w-0 items-center justify-start gap-2">
            <ModusWcIcon name="error" decorative />
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Danger Zone" />
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col gap-0.5">
              <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="Delete all data" />
              <ModusWcTypography
                hierarchy="p"
                size="xs"
                customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
                label="Permanently remove all analytics data. This cannot be undone."
              />
            </div>
            <ModusWcButton variant="outlined" color="danger" size="sm">
              Delete Data
            </ModusWcButton>
          </div>
        </ModusWcCard>
      </section>
    </>
  )
}

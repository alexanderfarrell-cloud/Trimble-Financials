/**
 * Automated screenshot capture for the Import Wizard V2 flow.
 * Run with: node screenshot-flow.mjs
 * Requires the dev server to be running at http://localhost:5173
 */

import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR   = path.join(__dirname, 'screenshots')
const BASE_URL  = 'http://localhost:5173'

let shotIndex = 0
async function shot(page, label) {
  const filename = path.join(OUT_DIR, `${String(shotIndex).padStart(2, '0')}-${label}.png`)
  await page.screenshot({ path: filename, fullPage: false })
  console.log(`  ✓ ${filename}`)
  shotIndex++
}

// Wait for a visible button whose text matches (case-insensitive trim)
async function clickText(page, text, options = {}) {
  const btn = page.locator(`button, [role="button"]`).filter({ hasText: new RegExp(text.trim(), 'i') }).first()
  await btn.waitFor({ state: 'visible', timeout: 8000 })
  await btn.click(options)
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx     = await browser.newContext({ viewport: { width: 390, height: 844 } })  // iPhone-sized for the mobile-first flow
  const page    = await ctx.newPage()

  // Clear any persisted state so we always start fresh
  await page.goto(BASE_URL)
  await page.evaluate(() => {
    localStorage.removeItem('onboarding-path')
    localStorage.removeItem('import-completed-steps')
    localStorage.removeItem('getting-started-dismissed')
    localStorage.removeItem('import-banner-dismissed')
  })

  // ── 01 Onboarding setup ───────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/onboarding`)
  await page.waitForLoadState('networkidle')
  await shot(page, '01-onboarding-choice')

  // Select "Import Data" card
  await page.locator('text=Import Data').first().click()
  await page.waitForTimeout(300)
  await shot(page, '02-onboarding-import-selected')

  // Click "Get Started"
  await clickText(page, 'Get Started')
  await page.waitForURL(`**\/onboarding\/import-v2`)
  await page.waitForTimeout(600)

  // ── 02 Intro screen ───────────────────────────────────────────────────────
  await shot(page, '03-intro-screen')
  await clickText(page, "Let's get started")
  await page.waitForTimeout(400)

  // ── Steps 1-5: upload → review ────────────────────────────────────────────
  const steps = [
    { id: 1, name: 'bank-accounts' },
    { id: 2, name: 'customers' },
    { id: 3, name: 'vendors' },
    { id: 4, name: 'open-invoices' },
    { id: 5, name: 'trial-balance' },
  ]

  for (const step of steps) {
    const padded = String(step.id + 3).padStart(2, '0')

    // Upload screen
    await shot(page, `${padded}a-step${step.id}-${step.name}-upload`)

    // Use sample data (enables Continue button)
    await clickText(page, 'Use sample data')
    await page.waitForTimeout(300)
    await shot(page, `${padded}b-step${step.id}-${step.name}-upload-ready`)

    // Continue → review
    await clickText(page, 'Continue')
    await page.waitForTimeout(400)
    await shot(page, `${padded}c-step${step.id}-${step.name}-review`)

    // Next / Review summary (last step)
    const isLast = step.id === 5
    await clickText(page, isLast ? 'Review summary' : 'Next')
    await page.waitForTimeout(400)
  }

  // ── Summary screen ────────────────────────────────────────────────────────
  await shot(page, '09a-summary-balance-warning')

  // Apply auto-balance to resolve the discrepancy
  await clickText(page, 'Apply auto-balance')
  await page.waitForTimeout(300)
  await shot(page, '09b-summary-balance-resolved')

  // Click "Import All"
  await clickText(page, 'Import All')
  await page.waitForTimeout(400)
  await shot(page, '10-confirm-modal')

  // Confirm — the modal's primary button also says "Import All"
  // Target the one inside the modal overlay (second match)
  const importAllBtns = page.locator(`button`).filter({ hasText: /^Import All$/i })
  await importAllBtns.last().waitFor({ state: 'visible', timeout: 8000 })
  await importAllBtns.last().click()
  await page.waitForTimeout(500)

  // ── Success screen ────────────────────────────────────────────────────────
  await shot(page, '11-success')

  await browser.close()
  console.log(`\nDone — ${shotIndex} screenshots saved to ./screenshots/`)
}

main().catch((err) => { console.error(err); process.exit(1) })

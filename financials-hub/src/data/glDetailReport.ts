export interface GlAccount {
  id: string
  code: string
  name: string
}

export interface GlDetailRow {
  id: string
  accountId: string
  sourceModule: string
  glAccount: string
  jeNumber: string
  debit: number | null
  credit: number | null
  sourceRef: string
  date: string
  dateIso: string
  postedBy: string
}

export interface GlAccountSummary {
  accountId: string | null
  label: string
  transactionCount: number
  totalDebits: number | null
  totalCredits: number | null
}

export const GL_ACCOUNTS: GlAccount[] = [
  { id: '1010', code: '1010', name: 'Cash on Hand' },
  { id: '1020', code: '1020', name: 'Petty Cash' },
  { id: '1100', code: '1100', name: 'Undeposited Funds' },
  { id: '1200', code: '1200', name: 'Accounts Receivable' },
  { id: '1300', code: '1300', name: 'Inventory' },
  { id: '1500', code: '1500', name: 'Prepaid Expenses' },
  { id: '1700', code: '1700', name: 'Equipment' },
  { id: '2000', code: '2000', name: 'Accounts Payable' },
  { id: '2100', code: '2100', name: 'Accrued Expenses' },
  { id: '2200', code: '2200', name: 'Payroll Liabilities' },
  { id: '2300', code: '2300', name: 'Sales Tax Payable' },
  { id: '2400', code: '2400', name: 'Unearned Revenue' },
  { id: '2500', code: '2500', name: 'Notes Payable' },
  { id: '3000', code: '3000', name: 'Owner Equity' },
  { id: '3100', code: '3100', name: 'Retained Earnings' },
  { id: '4000', code: '4000', name: 'Service Revenue' },
  { id: '4100', code: '4100', name: 'Project Revenue' },
  { id: '5000', code: '5000', name: 'Cost of Goods Sold' },
  { id: '5100', code: '5100', name: 'Direct Labor' },
  { id: '5200', code: '5200', name: 'Subcontractor Costs' },
  { id: '5300', code: '5300', name: 'Materials' },
  { id: '6000', code: '6000', name: 'Operating Expenses' },
  { id: '6100', code: '6100', name: 'Office Supplies' },
  { id: '6200', code: '6200', name: 'Insurance' },
  { id: '6300', code: '6300', name: 'Depreciation' },
]

export const DEFAULT_SELECTED_ACCOUNT_IDS = ['1010', '1200', '2000']

export const ALL_ACCOUNTS_OPTION = '__all__'

export const ALL_ACCOUNT_IDS = GL_ACCOUNTS.map((a) => a.id)

export const DEFAULT_START_DATE = '2026-06-10'
export const DEFAULT_END_DATE = '2026-07-08'

const SOURCE_MODULES = [
  'Billings Guided Entry',
  'Expenses',
  'Journal Entry',
  'Bank Reconciliation',
  'Payroll',
] as const

const DEMO_DATES = [
  { iso: '2026-06-10', label: 'Jun 10, 2026' },
  { iso: '2026-06-18', label: 'Jun 18, 2026' },
  { iso: '2026-06-26', label: 'Jun 26, 2026' },
  { iso: '2026-07-02', label: 'Jul 02, 2026' },
  { iso: '2026-07-08', label: 'Jul 08, 2026' },
] as const

function row(
  id: string,
  accountId: string,
  sourceModule: string,
  jeNumber: string,
  debit: number | null,
  credit: number | null,
  sourceRef: string,
  dateIso: string,
  date: string,
): GlDetailRow {
  const account = GL_ACCOUNTS.find((a) => a.id === accountId)
  return {
    id,
    accountId,
    sourceModule,
    glAccount: account?.name ?? accountId,
    jeNumber,
    debit,
    credit,
    sourceRef,
    dateIso,
    date,
    postedBy: 'Alex Farrell',
  }
}

/** Three demo rows per account so any selection always has data to show */
function generateRowsForAccount(account: GlAccount, index: number): GlDetailRow[] {
  const baseJe = 3400 + index * 3
  const baseAmount = 2500 + (index % 7) * 1750
  const module = SOURCE_MODULES[index % SOURCE_MODULES.length]
  const prefix = account.code

  return [
    row(
      `${account.id}-1`,
      account.id,
      module,
      String(baseJe),
      baseAmount,
      null,
      `${prefix}-REF-01`,
      DEMO_DATES[0].iso,
      DEMO_DATES[0].label,
    ),
    row(
      `${account.id}-2`,
      account.id,
      SOURCE_MODULES[(index + 1) % SOURCE_MODULES.length],
      String(baseJe + 1),
      null,
      baseAmount + 500,
      `${prefix}-REF-02`,
      DEMO_DATES[2].iso,
      DEMO_DATES[2].label,
    ),
    row(
      `${account.id}-3`,
      account.id,
      SOURCE_MODULES[(index + 2) % SOURCE_MODULES.length],
      String(baseJe + 2),
      Math.round(baseAmount * 0.4),
      null,
      `${prefix}-REF-03`,
      DEMO_DATES[4].iso,
      DEMO_DATES[4].label,
    ),
  ]
}

/** Full dummy ledger — every GL account has rows within the default date range */
export const GL_DETAIL_ROWS: GlDetailRow[] = GL_ACCOUNTS.flatMap((account, index) =>
  generateRowsForAccount(account, index),
)

export function formatCurrency(amount: number | null): string {
  if (amount === null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

/** ISO date (YYYY-MM-DD) → display label matching ModusWcDate format */
export function formatDisplayDate(iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function accountLabel(account: GlAccount): string {
  return `${account.code} ${account.name}`
}

function sumSide(rows: GlDetailRow[], side: 'debit' | 'credit'): number | null {
  const total = rows.reduce((sum, r) => sum + (r[side] ?? 0), 0)
  return total > 0 ? total : null
}

function summarizeRows(rows: GlDetailRow[], accountId: string | null): GlAccountSummary {
  const filtered = accountId ? rows.filter((r) => r.accountId === accountId) : rows
  const account = accountId ? GL_ACCOUNTS.find((a) => a.id === accountId) : undefined

  return {
    accountId,
    label: accountId && account ? accountLabel(account) : 'All Accounts',
    transactionCount: filtered.length,
    totalDebits: sumSide(filtered, 'debit'),
    totalCredits: sumSide(filtered, 'credit'),
  }
}

/** Summary cards: All Accounts + one card per selected account (even if zero rows) */
export function buildSummaries(
  reportRows: GlDetailRow[],
  selectedAccountIds: string[],
): GlAccountSummary[] {
  const accountIdsForCards =
    selectedAccountIds.length > 0
      ? selectedAccountIds
      : [...new Set(reportRows.map((r) => r.accountId))].sort()

  if (reportRows.length === 0 && accountIdsForCards.length === 0) return []

  const allSummary = summarizeRows(reportRows, null)

  return [allSummary, ...accountIdsForCards.map((id) => summarizeRows(reportRows, id))]
}

export function filterReportRows(
  accountIds: string[],
  startDate: string,
  endDate: string,
): GlDetailRow[] {
  return GL_DETAIL_ROWS.filter((row) => {
    if (accountIds.length > 0 && !accountIds.includes(row.accountId)) return false
    if (startDate && row.dateIso < startDate) return false
    if (endDate && row.dateIso > endDate) return false
    return true
  })
}

export function rowsToTableData(rows: GlDetailRow[]) {
  return rows.map((row) => ({
    id: row.id,
    sourceModule: row.sourceModule,
    glAccount: row.glAccount,
    jeNumber: row.jeNumber,
    debit: formatCurrency(row.debit),
    credit: formatCurrency(row.credit),
    sourceRef: row.sourceRef,
    date: row.date,
    postedBy: row.postedBy,
  }))
}

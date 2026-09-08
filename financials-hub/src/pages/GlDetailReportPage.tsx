import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ModusWcAlert,
  ModusWcButton,
  ModusWcCard,
  ModusWcChip,
  ModusWcDate,
  ModusWcIcon,
  ModusWcSelect,
  ModusWcTable,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  accountLabel,
  ALL_ACCOUNT_IDS,
  ALL_ACCOUNTS_OPTION,
  buildSummaries,
  DEFAULT_END_DATE,
  DEFAULT_SELECTED_ACCOUNT_IDS,
  DEFAULT_START_DATE,
  filterReportRows,
  formatCurrency,
  GL_ACCOUNTS,
  rowsToTableData,
} from '../data/glDetailReport'

const TABLE_COLUMNS = [
  { id: 'sourceModule', header: 'Source module', accessor: 'sourceModule' },
  { id: 'glAccount', header: 'GL account', accessor: 'glAccount' },
  { id: 'jeNumber', header: 'JE #', accessor: 'jeNumber', width: '80px' },
  { id: 'debit', header: 'Debit', accessor: 'debit' },
  { id: 'credit', header: 'Credit', accessor: 'credit' },
  { id: 'sourceRef', header: 'Source ref #', accessor: 'sourceRef' },
  { id: 'date', header: 'Date', accessor: 'date' },
  { id: 'postedBy', header: 'Posted by', accessor: 'postedBy' },
]

/** ~2 rows of sm chips on a typical desktop filter width */
const CHIP_COLLAPSED_VISIBLE = 8

interface AccountFilterChipsProps {
  accountIds: string[]
  onRemoveAccount: (accountId: string) => void
  onClearAll: () => void
}

function AccountFilterChips({ accountIds, onRemoveAccount, onClearAll }: AccountFilterChipsProps) {
  const [expanded, setExpanded] = useState(false)
  const allSelected = accountIds.length === GL_ACCOUNTS.length
  const overflowCount = Math.max(0, accountIds.length - CHIP_COLLAPSED_VISIBLE)
  const showOverflow = !allSelected && overflowCount > 0

  useEffect(() => {
    if (accountIds.length <= CHIP_COLLAPSED_VISIBLE) {
      setExpanded(false)
    }
  }, [accountIds.length])

  if (accountIds.length === 0) {
    return <div className="gl-detail-report__chips" hidden />
  }

  if (allSelected) {
    return (
      <div className="gl-detail-report__chips">
        <ModusWcChip
          size="sm"
          variant="outline"
          label={`All Accounts (${GL_ACCOUNTS.length})`}
          showRemove
          onChipRemove={onClearAll}
        />
      </div>
    )
  }

  const visibleIds =
    showOverflow && !expanded ? accountIds.slice(0, CHIP_COLLAPSED_VISIBLE) : accountIds

  const chipsClassName = [
    'gl-detail-report__chips',
    expanded && showOverflow ? 'gl-detail-report__chips--expanded' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={chipsClassName}>
      {visibleIds.map((id) => {
        const account = GL_ACCOUNTS.find((a) => a.id === id)
        if (!account) return null
        return (
          <ModusWcChip
            key={id}
            size="sm"
            variant="outline"
            label={accountLabel(account)}
            showRemove
            onChipRemove={() => onRemoveAccount(id)}
          />
        )
      })}
      {showOverflow && !expanded && (
        <ModusWcChip
          size="sm"
          variant="filled"
          label={`+${overflowCount} more`}
          onChipClick={() => setExpanded(true)}
        />
      )}
      {showOverflow && expanded && (
        <ModusWcChip
          size="sm"
          variant="filled"
          label="Show less"
          onChipClick={() => setExpanded(false)}
        />
      )}
    </div>
  )
}

export function GlDetailReportPage() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [filterAccountIds, setFilterAccountIds] = useState<string[]>(DEFAULT_SELECTED_ACCOUNT_IDS)
  const [filterStartDate, setFilterStartDate] = useState(DEFAULT_START_DATE)
  const [filterEndDate, setFilterEndDate] = useState(DEFAULT_END_DATE)
  const [dateFieldsKey, setDateFieldsKey] = useState(0)
  const [selectValue, setSelectValue] = useState('')

  const [reportRows, setReportRows] = useState(() =>
    filterReportRows(DEFAULT_SELECTED_ACCOUNT_IDS, DEFAULT_START_DATE, DEFAULT_END_DATE),
  )
  const [displaySummaries, setDisplaySummaries] = useState(() =>
    buildSummaries(
      filterReportRows(DEFAULT_SELECTED_ACCOUNT_IDS, DEFAULT_START_DATE, DEFAULT_END_DATE),
      DEFAULT_SELECTED_ACCOUNT_IDS,
    ),
  )
  const [tableAccountFilter, setTableAccountFilter] = useState<string | null>(null)
  const [reportActive, setReportActive] = useState(true)

  const hasReport = reportActive

  const summaries = displaySummaries

  const visibleRows = useMemo(
    () =>
      tableAccountFilter
        ? reportRows.filter((row) => row.accountId === tableAccountFilter)
        : reportRows,
    [reportRows, tableAccountFilter],
  )

  const tableData = useMemo(() => rowsToTableData(visibleRows), [visibleRows])

  const allAccountsSelected = filterAccountIds.length === GL_ACCOUNTS.length

  const availableOptions = useMemo(
    () => [
      { label: 'Select accounts', value: '' },
      ...(allAccountsSelected
        ? []
        : [{ label: 'All Accounts', value: ALL_ACCOUNTS_OPTION }]),
      ...GL_ACCOUNTS
        .filter((a) => !filterAccountIds.includes(a.id))
        .map((a) => ({ label: accountLabel(a), value: a.id })),
    ],
    [filterAccountIds, allAccountsSelected],
  )

  const handleAccountSelect = (value: string) => {
    if (!value) return
    if (value === ALL_ACCOUNTS_OPTION) {
      setFilterAccountIds(ALL_ACCOUNT_IDS)
      setSelectValue('')
      return
    }
    if (filterAccountIds.includes(value)) return
    setFilterAccountIds((prev) => [...prev, value])
    setSelectValue('')
  }

  const handleRemoveAccount = (accountId: string) => {
    setFilterAccountIds((prev) => prev.filter((id) => id !== accountId))
  }

  const handleClear = () => {
    setFilterAccountIds([])
    setFilterStartDate('')
    setFilterEndDate('')
    setDateFieldsKey((k) => k + 1)
    setSelectValue('')
    setReportRows([])
    setDisplaySummaries([])
    setTableAccountFilter(null)
    setReportActive(false)
  }

  const handleRunReport = () => {
    const rows = filterReportRows(filterAccountIds, filterStartDate, filterEndDate)
    const accountIds =
      filterAccountIds.length > 0
        ? [...filterAccountIds]
        : [...new Set(rows.map((r) => r.accountId))].sort()
    setReportRows(rows)
    setDisplaySummaries(buildSummaries(rows, accountIds))
    setTableAccountFilter(null)
    setReportActive(true)
  }

  const handleSummaryClick = (accountId: string | null) => {
    if (!hasReport) return
    setTableAccountFilter(accountId)
  }

  return (
    <div className="hub-page gl-detail-report">
      <ModusWcTypography
        hierarchy="h1"
        size="xl"
        weight="bold"
        label="GL Account Details Report"
        customClass="gl-detail-report__title"
      />

      <ModusWcCard bordered={false} padding="compact">
        <div className="gl-detail-report__filters">
          <div className="gl-detail-report__filter-account">
            <ModusWcSelect
              label="Account"
              size="sm"
              value={selectValue}
              options={availableOptions}
              onInputChange={(e) => {
                const value = (e as CustomEvent).detail?.target?.value ?? ''
                handleAccountSelect(value)
              }}
            />
          </div>
          <div className="gl-detail-report__filter-dates">
            <ModusWcDate
              key={`gl-start-${dateFieldsKey}`}
              label="Start Date"
              size="sm"
              format="MMM DD, YYYY"
              value={filterStartDate}
              onInputChange={(e) => {
                const value = (e as CustomEvent).detail?.target?.value ?? ''
                setFilterStartDate(value)
              }}
            />
            <ModusWcDate
              key={`gl-end-${dateFieldsKey}`}
              label="End Date"
              size="sm"
              format="MMM DD, YYYY"
              value={filterEndDate}
              onInputChange={(e) => {
                const value = (e as CustomEvent).detail?.target?.value ?? ''
                setFilterEndDate(value)
              }}
            />
          </div>
          <div className="gl-detail-report__filter-actions">
            <ModusWcButton
              size="sm"
              variant="outlined"
              color="tertiary"
              onButtonClick={handleClear}
            >
              Clear
            </ModusWcButton>
            <ModusWcButton size="sm" variant="filled" color="primary" onButtonClick={handleRunReport}>
              Run Report
            </ModusWcButton>
          </div>
        </div>
      </ModusWcCard>

      <AccountFilterChips
        accountIds={filterAccountIds}
        onRemoveAccount={handleRemoveAccount}
        onClearAll={() => setFilterAccountIds([])}
      />

      <section className="gl-detail-report__section" hidden={!hasReport} aria-hidden={!hasReport}>
        <ModusWcTypography hierarchy="h2" size="md" weight="semibold" label="Summary" />
        <div className="gl-detail-report__summary-grid">
          {summaries.map((summary) => {
            const isActive = tableAccountFilter === summary.accountId
            return (
              <button
                key={summary.accountId ?? 'all'}
                type="button"
                className={`gl-detail-report__summary-btn${isActive ? ' gl-detail-report__summary-btn--active' : ''}`}
                onClick={() => handleSummaryClick(summary.accountId)}
                aria-pressed={isActive}
              >
                <div className="gl-detail-report__summary-panel">
                  <div className="gl-detail-report__summary-card-inner">
                    <div className="gl-detail-report__summary-header">
                      <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label={summary.label} />
                      <span className="gl-detail-report__summary-count">
                        {summary.transactionCount} total
                      </span>
                    </div>
                    <div className="gl-detail-report__summary-row">
                      <span className="gl-detail-report__summary-label">Total Debits</span>
                      <span className="gl-detail-report__summary-value">{formatCurrency(summary.totalDebits)}</span>
                    </div>
                    <div className="gl-detail-report__summary-row">
                      <span className="gl-detail-report__summary-label">Total Credits</span>
                      <span className="gl-detail-report__summary-value">{formatCurrency(summary.totalCredits)}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="gl-detail-report__section">
        <ModusWcTypography hierarchy="h2" size="md" weight="semibold" label="Details" />

        <ModusWcCard bordered={false} padding="compact">
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            label="Select accounts and a date range, then run the report to view details."
            customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
            hidden={hasReport}
          />

          <div hidden={!hasReport || !isDesktop}>
            <ModusWcTable
              columns={TABLE_COLUMNS}
              data={tableData}
              zebra
              sortable={false}
              hover={false}
              density="comfortable"
              caption="GL account detail transactions"
            />
          </div>

          <ModusWcAlert
            hidden={!hasReport || isDesktop}
            variant="info"
            alertTitle="Optimized for mobile"
            alertDescription="Your multi-column detailed report is hidden for mobile view. Review your account summaries or export the full file for desktop."
          />
        </ModusWcCard>

        <div className="gl-detail-report__export-row" hidden={!hasReport}>
          <ModusWcButton size="sm" variant="outlined" color="primary" onButtonClick={() => {}}>
            <ModusWcIcon name="file_download" size="xs" decorative />
            Export Details
          </ModusWcButton>
        </div>
      </section>

      <ModusWcButton
        size="sm"
        variant="borderless"
        color="primary"
        onButtonClick={() => navigate('/reports')}
      >
        Back
      </ModusWcButton>
    </div>
  )
}

export default GlDetailReportPage

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ModusWcAlert,
  ModusWcAutocomplete,
  ModusWcButton,
  ModusWcCard,
  ModusWcChip,
  ModusWcDate,
  ModusWcIcon,
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
  formatDisplayDate,
  GL_ACCOUNTS,
  rowsToTableData,
} from '../data/glDetailReport'

const TABLE_COLUMNS = [
  { id: 'sourceModule', header: 'Source module', accessor: 'sourceModule', sortable: true },
  { id: 'glAccount', header: 'GL account', accessor: 'glAccount', sortable: true },
  { id: 'jeNumber', header: 'JE #', accessor: 'jeNumber', width: '80px', sortable: true },
  { id: 'debit', header: 'Debit', accessor: 'debit', sortable: true },
  { id: 'credit', header: 'Credit', accessor: 'credit', sortable: true },
  { id: 'sourceRef', header: 'Source ref #', accessor: 'sourceRef', sortable: true },
  { id: 'date', header: 'Date', accessor: 'date', sortable: true },
  { id: 'postedBy', header: 'Posted by', accessor: 'postedBy', sortable: true },
]

/** ~2 rows of sm chips on a typical desktop filter width */
const CHIP_COLLAPSED_VISIBLE = 8

interface AccountFilterChipsProps {
  accountIds: string[]
}

function AccountFilterChips({ accountIds }: AccountFilterChipsProps) {
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
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [filterAccountIds, setFilterAccountIds] = useState<string[]>(DEFAULT_SELECTED_ACCOUNT_IDS)
  const [filterStartDate, setFilterStartDate] = useState(DEFAULT_START_DATE)
  const [filterEndDate, setFilterEndDate] = useState(DEFAULT_END_DATE)
  const [dateFieldsKey, setDateFieldsKey] = useState(0)
  const [accountSelectKey, setAccountSelectKey] = useState(0)

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
  const [appliedStartDate, setAppliedStartDate] = useState(DEFAULT_START_DATE)
  const [appliedEndDate, setAppliedEndDate] = useState(DEFAULT_END_DATE)

  const hasReport = reportActive
  const datesLocked = hasReport
  const appliedPeriodLabel =
    appliedStartDate && appliedEndDate
      ? `${formatDisplayDate(appliedStartDate)} – ${formatDisplayDate(appliedEndDate)}`
      : ''

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

  const accountAutocompleteItems = useMemo(
    () => [
      {
        label: 'All Accounts',
        value: ALL_ACCOUNTS_OPTION,
        visibleInMenu: true,
        checkbox: true,
        selected: allAccountsSelected,
      },
      ...GL_ACCOUNTS.map((account) => ({
        label: accountLabel(account),
        value: account.id,
        visibleInMenu: true,
        checkbox: true,
        selected: filterAccountIds.includes(account.id),
      })),
    ],
    [filterAccountIds, allAccountsSelected],
  )

  const handleAccountItemSelect = (e: CustomEvent<{ value: string; selected?: boolean }>) => {
    const item = e.detail
    const wasSelected = item.selected ?? false

    if (item.value === ALL_ACCOUNTS_OPTION) {
      setFilterAccountIds(wasSelected ? [] : ALL_ACCOUNT_IDS)
      return
    }

    setFilterAccountIds((prev) => {
      if (wasSelected) {
        return prev.filter((id) => id !== item.value)
      }
      if (prev.includes(item.value)) return prev
      return [...prev, item.value]
    })
  }

  const handleClear = () => {
    setFilterAccountIds([])
    setFilterStartDate(DEFAULT_START_DATE)
    setFilterEndDate(DEFAULT_END_DATE)
    setAppliedStartDate('')
    setAppliedEndDate('')
    setDateFieldsKey((k) => k + 1)
    setAccountSelectKey((k) => k + 1)
    setReportRows([])
    setDisplaySummaries([])
    setTableAccountFilter(null)
    setReportActive(false)
  }

  const handleRunReport = () => {
    const startDate = datesLocked ? appliedStartDate : filterStartDate
    const endDate = datesLocked ? appliedEndDate : filterEndDate
    if (!datesLocked) {
      setAppliedStartDate(filterStartDate)
      setAppliedEndDate(filterEndDate)
    }
    const rows = filterReportRows(filterAccountIds, startDate, endDate)
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

  const showDetailsTable = hasReport && isDesktop && tableData.length > 0
  const showDesktopDetailsEmpty = isDesktop && !showDetailsTable
  const showMobileDetailsEmpty = !isDesktop && !hasReport
  const showMobileDetailsAlert = hasReport && !isDesktop

  const detailsEmptyTitle = hasReport ? 'No transactions found' : 'No details yet'
  const detailsEmptyDescription = !isDesktop
    ? 'Select accounts and a date range, then run the report. Review the summary above or export the full file for line-level detail.'
    : hasReport
      ? 'No transactions match the current account selection and period. Use Clear to adjust filters and run the report again.'
      : 'Select accounts and a date range, then click Run Report to view transaction details.'

  return (
    <div className="hub-page gl-detail-report">
      <div className="gl-detail-report__content">
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
            <ModusWcAutocomplete
              key={`gl-account-select-${accountSelectKey}`}
              label="Account"
              size="sm"
              placeholder="Select accounts"
              multiSelect
              leaveMenuOpen
              showMenuOnFocus
              minChars={0}
              maxChips={-1}
              items={accountAutocompleteItems}
              onItemSelect={handleAccountItemSelect}
            />
          </div>
          <div className="gl-detail-report__filter-dates" hidden={datesLocked}>
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
            <ModusWcButton
              size="sm"
              variant="filled"
              color="primary"
              disabled={hasReport}
              onButtonClick={handleRunReport}
            >
              Run Report
            </ModusWcButton>
          </div>
        </div>
      </ModusWcCard>

      <div className="gl-detail-report__selection">
        {datesLocked && appliedPeriodLabel && (
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            weight="semibold"
            label={`Period: ${appliedPeriodLabel}`}
            customClass="gl-detail-report__period"
          />
        )}
        <AccountFilterChips accountIds={filterAccountIds} />
      </div>

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
          <div
            className="gl-detail-report__details-empty empty-state"
            hidden={!showDesktopDetailsEmpty && !showMobileDetailsEmpty}
          >
            <ModusWcIcon name="receipt" size="lg" decorative />
            <ModusWcTypography
              hierarchy="h3"
              size="sm"
              weight="semibold"
              label={showDesktopDetailsEmpty && hasReport ? detailsEmptyTitle : 'No details yet'}
            />
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              label={detailsEmptyDescription}
              customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
            />
          </div>

          <div className="gl-detail-report__table-wrap" hidden={!showDetailsTable}>
            <ModusWcTable
              columns={TABLE_COLUMNS}
              data={tableData}
              zebra
              sortable
              hover={false}
              density="comfortable"
              caption="GL account detail transactions"
            />
          </div>

          <div className="gl-detail-report__mobile-alert-wrap" hidden={!showMobileDetailsAlert}>
            <ModusWcAlert
              variant="info"
              alertTitle="Optimized for mobile"
              alertDescription="Your multi-column detailed report is hidden for mobile view. Review your account summaries or export the full file for desktop."
            />
          </div>
        </ModusWcCard>

        <div className="gl-detail-report__export-row" hidden={!hasReport}>
          <ModusWcButton size="sm" variant="outlined" color="primary" onButtonClick={() => {}}>
            <ModusWcIcon name="file_download" size="xs" decorative />
            Export Details
          </ModusWcButton>
        </div>
      </section>
      </div>

      <footer className="gl-detail-report__footer">
        <ModusWcButton
          size="sm"
          variant="borderless"
          color="primary"
          onButtonClick={() => navigate('/reports')}
        >
          Back
        </ModusWcButton>
      </footer>
    </div>
  )
}

export default GlDetailReportPage

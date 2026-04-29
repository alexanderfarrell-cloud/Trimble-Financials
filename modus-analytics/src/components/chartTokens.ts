/**
 * Modus-aligned chart constants — all colors reference CSS custom properties
 * so charts follow light/dark and theme switches automatically.
 */

/** Ordered categorical palette for multi-series / pie charts */
export const CHART_COLORS = [
  'var(--modus-wc-color-primary)',
  'var(--modus-wc-color-warning)',
  'var(--modus-wc-color-success)',
  'var(--modus-wc-color-error)',
  'var(--modus-wc-color-secondary)',
]

/** Shared Recharts <Tooltip /> props — card-surface chrome */
export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'var(--modus-wc-color-base-100)',
    border: '1px solid var(--modus-wc-color-base-200)',
    borderRadius: 'var(--radius-button, 8px)',
    color: 'var(--modus-wc-color-base-content)',
    padding: '8px 12px',
    fontSize: 12,
  },
  itemStyle: { color: 'var(--modus-wc-color-base-content)' },
  labelStyle: { color: 'var(--modus-wc-color-base-content)', fontWeight: 600 },
  cursor: { fill: 'var(--modus-wc-color-base-200)' },
}

/** Axis / grid stroke tokens */
export const AXIS_STROKE = 'var(--modus-wc-color-base-content-low-contrast)'
export const GRID_STROKE = 'var(--modus-wc-color-base-200)'

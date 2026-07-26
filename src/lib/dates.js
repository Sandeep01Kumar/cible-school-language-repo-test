/**
 * Civil-date parsing and formatting helpers for the CIBLE School of Language website.
 *
 * The site's event and blog data store dates as bare, date-only ISO strings
 * (`'YYYY-MM-DD'`) with no time or zone component. Passing such a string to the
 * native `new Date('YYYY-MM-DD')` constructor parses it as **UTC midnight**, so
 * in any timezone west of UTC (for example `America/New_York`) the rendered
 * local date shifts one day earlier — the off-by-one defect confirmed in review
 * for `EventCard` and `BlogCard`.
 *
 * These helpers instead interpret a date-only value as a **civil date**: the
 * calendar day the author intended, independent of the viewer's timezone. They
 * do this by constructing the `Date` from explicit year/month/day components
 * via `new Date(year, monthIndex, day)`, which the language spec defines to use
 * **local** time, so the day never drifts.
 *
 * Every export is a pure, deterministic function with no React, JSX, or hooks,
 * which keeps the module trivially lint-compliant and safe to import anywhere.
 * All values are exported by name; there is no default export.
 *
 * @module lib/dates
 */

/**
 * Matches a strict date-only ISO string: four-digit year, two-digit month,
 * two-digit day, separated by hyphens. Any time or zone suffix is intentionally
 * rejected so this path only ever handles genuine date-only values.
 *
 * @type {RegExp}
 */
const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * The default locale used when formatting dates for display.
 *
 * `en-IN` matches the institute's primary audience (India) and yields the
 * expected day-month-year ordering for Indian users.
 *
 * @type {string}
 */
export const DEFAULT_LOCALE = 'en-IN'

/**
 * Parse a value into a `Date` without the UTC-midnight day-shift.
 *
 * - A strict date-only string (`'YYYY-MM-DD'`) is parsed as a civil date in the
 *   viewer's local timezone, so the calendar day is preserved everywhere.
 * - Any other string (for example a full ISO date-time with an explicit zone)
 *   is delegated to the native `Date` constructor, which already carries
 *   unambiguous instant information.
 * - A `Date` instance is returned as-is; any other input yields `null`.
 *
 * An invalid date (for example `'2026-13-40'`) yields `null` so callers can
 * fall back gracefully rather than render `Invalid Date`.
 *
 * @param {string|Date|null|undefined} value - A date-only string, ISO date-time, or `Date`.
 * @returns {Date|null} A valid `Date`, or `null` when the input cannot be parsed.
 */
export function parseCivilDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (typeof value !== 'string') return null

  const match = DATE_ONLY_REGEX.exec(value.trim())
  if (match) {
    const year = Number(match[1])
    const monthIndex = Number(match[2]) - 1
    const day = Number(match[3])
    const date = new Date(year, monthIndex, day)
    // Guard against JS date rollover (e.g. month 13 / day 40 silently wrapping):
    // require the constructed parts to match the requested parts exactly.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== monthIndex ||
      date.getDate() !== day
    ) {
      return null
    }
    return date
  }

  const fallback = new Date(value)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

/**
 * Format a date-only value (or `Date`) for display as a civil date.
 *
 * Parses the input with {@link parseCivilDate} — so the day never shifts across
 * timezones — then formats it with `Intl.DateTimeFormat`. When the value cannot
 * be parsed, an empty string is returned so the UI can omit the date rather than
 * display `Invalid Date`.
 *
 * @param {string|Date|null|undefined} value - The date-only string, ISO date-time, or `Date`.
 * @param {Intl.DateTimeFormatOptions} [options] - Formatting options; defaults to `{ year, month, day }` as long form.
 * @param {string} [locale=DEFAULT_LOCALE] - The BCP 47 locale to format in.
 * @returns {string} The formatted date, or `''` when the value is unparseable.
 */
export function formatCivilDate(
  value,
  options = { year: 'numeric', month: 'long', day: 'numeric' },
  locale = DEFAULT_LOCALE,
) {
  const date = parseCivilDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, options).format(date)
}

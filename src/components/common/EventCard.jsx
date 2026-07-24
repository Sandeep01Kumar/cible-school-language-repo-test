import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import { cn } from '../../lib/cn.js'
import { FiClock, FiMapPin } from 'react-icons/fi'

/**
 * EventCard
 *
 * The single canonical upcoming-event card for the CIBLE School of Language SPA
 * (AAP §0.6.1 Group 7). It is composed on the Events page and in the Home page
 * events preview to render one entry from `src/data/events.js`. Reuse this
 * component rather than restyling a raw surface, so every event tile stays
 * visually and semantically consistent (project reuse-first rule).
 *
 * It is intentionally presentational (no data fetching, no local state, no
 * animation): the parent list is responsible for layout and any scroll-reveal
 * motion. Only a subtle `hover:-translate-y-1` lift is baked in as a
 * micro-interaction, which the shared base honours.
 *
 * Composition (never forks a second Button/Card/Badge):
 * - Root surface        → `ui/Card` rendered `as="article"` (self-contained
 *   landmark). `p-0` is merged LAST so it overrides Card's default `p-6`,
 *   letting the banner bleed to the rounded edges (`overflow-hidden`).
 * - Category label       → `ui/Badge variant="accent"` (green "free/positive"
 *   signal), the accessible source of `event.type`.
 * - Conversion CTA       → `ui/Button` rendered as a react-router `<Link>` via
 *   the polymorphic `to` prop (default `/contact`) — admissions-first.
 *
 * Banner:
 * - When `event.image` is truthy an `<img>` is shown. It is treated as
 *   decorative (`alt=""` + `aria-hidden`) because the title, type and date
 *   already convey the event; it is lazy-loaded and async-decoded for
 *   Core Web Vitals.
 * - Otherwise a brand-gradient fallback (`from-secondary-500 → 70% orange`)
 *   fills the 16:9 banner so image-less events (the current data set) still
 *   read as finished, premium cards rather than empty rectangles.
 * - A white "date badge" is overlaid top-left in both cases: the two-digit day
 *   over the short month, wrapped in a machine-readable `<time dateTime>`.
 *
 * Styling is entirely token-driven (Tailwind v4 `@theme` tokens defined in
 * src/index.css) — every colour, spacing, radius and shadow resolves to a design
 * token or utility on the 8px scale, with no hardcoded values. Colour tokens use
 * the project's scale-based names (`text-primary-600`, `text-muted`,
 * `from-secondary-500`), matching the shared `Card`/`Badge`/`Button` primitives.
 *
 * Accessibility (WCAG AA):
 * - Semantic `<article>` landmark, a single `<h3>` title, and `<time dateTime>`
 *   for both the badge and the full date.
 * - Banner image and meta icons are decorative and `aria-hidden`.
 * - The repeated "Register" CTA is disambiguated with a per-event `aria-label`.
 * - Text pairings use AA-compliant tokens on white (`foreground` ~17:1,
 *   `muted` ~7.5:1, `primary-600` ~4.6:1).
 *
 * @param {object} props
 * @param {object} props.event Event record — `{ title, date, time, type,
 *   description, location, image }`. `date` is an ISO 'YYYY-MM-DD' string;
 *   `image` is a URL or `null` (→ gradient fallback). If `event` is missing the
 *   component renders `null`.
 * @param {string} [props.to='/contact'] Route the "Register" CTA links to.
 * @param {string} [props.className] Extra classes merged LAST onto the Card root.
 * @param {object} [props] Any other props are forwarded to the Card root
 *   (`id`, `aria-*`, `data-*`, event handlers, …).
 * @returns {import('react').ReactElement|null} The rendered event card, or
 *   `null` when no `event` is supplied.
 */

// Shared, guarded Intl date formatter. Returns '' for missing/invalid dates so
// the card degrades gracefully instead of throwing (Intl.format throws on an
// Invalid Date). Uses the en-IN locale to match CIBLE's India-based audience.
function formatDate(iso, options) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', options).format(date)
}

// Two-digit day for the overlaid date badge, e.g. '16'.
function getDay(iso) {
  return formatDate(iso, { day: '2-digit' })
}

// Short month for the overlaid date badge, e.g. 'Aug'.
function getMonth(iso) {
  return formatDate(iso, { month: 'short' })
}

// Full, human-readable date for the meta row, e.g. 'Sat, 16 Aug 2026'.
function formatFullDate(iso) {
  return formatDate(iso, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function EventCard({ event, to = '/contact', className, ...props }) {
  // Guard: nothing to render without an event record.
  if (!event) return null

  const { title, date, time, type, description, location, image } = event

  // Combine the full date and display time into one meta string, dropping any
  // empty part so an invalid date never yields a stray leading separator.
  const schedule = [formatFullDate(date), time].filter(Boolean).join(' · ')

  return (
    <Card
      as="article"
      className={cn(
        'flex h-full flex-col overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1',
        className,
      )}
      {...props}
    >
      {/* Banner — real image when supplied, brand-gradient fallback otherwise. */}
      <div className="relative aspect-[16/9]">
        {image ? (
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary-500 to-secondary-500/70">
            {/* BLITZY [A11Y]: The decorative event-type label is white on the
                orange secondary-500 gradient (~2.80:1, below the WCAG AA 4.5:1
                minimum for normal text). It is retained per the banner design,
                marked aria-hidden, and the same `type` is exposed accessibly by
                the <Badge> below — so no information is conveyed by colour/text
                alone. Flagged for designer review. */}
            {type ? (
              <span
                aria-hidden="true"
                className="px-4 text-center text-2xl font-bold uppercase tracking-wide text-white"
              >
                {type}
              </span>
            ) : null}
          </div>
        )}

        {/* Date badge — day stacked over short month, machine-readable via <time>. */}
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-xl bg-white px-3 py-2 shadow-sm">
          <time dateTime={date} className="flex flex-col items-center">
            <span className="text-xl font-bold leading-none text-primary-600">
              {getDay(date)}
            </span>
            <span className="text-xs font-medium uppercase text-muted">
              {getMonth(date)}
            </span>
          </time>
        </div>
      </div>

      {/* Body — category, title, description, meta rows, and admission CTA. */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {type ? (
          <Badge variant="accent" className="self-start">
            {type}
          </Badge>
        ) : null}

        <h3 className="text-lg font-semibold text-foreground">{title}</h3>

        {description ? (
          <p className="text-sm leading-relaxed text-muted">{description}</p>
        ) : null}

        {schedule ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <FiClock aria-hidden="true" />
            {schedule}
          </p>
        ) : null}

        {location ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <FiMapPin aria-hidden="true" />
            {location}
          </p>
        ) : null}

        {/* BLITZY [A11Y]: The Register CTA uses the shared Button's size="sm"
            (36px tall) per this component's explicit spec — below the 44px
            touch-target guideline. It spans the full card width (comfortably
            wide) and is a native <a>; implemented per spec and flagged for
            designer review rather than silently enlarged. */}
        <Button
          to={to}
          variant="primary"
          size="sm"
          className="mt-auto"
          aria-label={title ? `Register for ${title}` : 'Register for this event'}
        >
          Register
        </Button>
      </div>
    </Card>
  )
}

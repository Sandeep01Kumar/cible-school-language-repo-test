import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import { cn } from '../../lib/cn.js'

/**
 * Breadcrumbs
 *
 * THE canonical breadcrumb navigation for the CIBLE School of Language SPA.
 * Rendered near the top of interior pages (Courses, individual course pages,
 * Faculty, Blog, etc.) to expose the page's position in the site hierarchy and
 * give one-tap access back to any ancestor.
 *
 * Data contract (shared, single source of truth):
 * - The `items` prop uses the SAME `{ name, path }` shape consumed by
 *   `breadcrumbSchema(items)` in `src/lib/schema.js` and injected as
 *   Breadcrumb JSON-LD by `seo/StructuredData.jsx`. Passing the identical
 *   array to both keeps the visible trail and the structured data in agreement,
 *   which is what search engines expect. Do NOT diverge the shape.
 *
 * Accessibility (WCAG AA):
 * - The trail is wrapped in a `<nav aria-label="Breadcrumb">` landmark so
 *   assistive technology can locate and announce it, and the crumbs live in an
 *   ordered list `<ol>` because breadcrumbs are inherently sequential.
 * - The final crumb represents the current page. It is rendered as plain text
 *   inside a `<span aria-current="page">` (never a link) so screen readers
 *   announce the user's current location and there is no self-referential link.
 * - Separators are purely decorative and are hidden from assistive technology
 *   via `aria-hidden="true"`.
 * - Ancestor crumbs are React Router `<Link>`s (client-side navigation, no full
 *   page reload) and expose a clearly visible keyboard focus ring. Each ancestor
 *   link is an `inline-flex` box sized to a `min-h-11`/`min-w-11` (44×44px)
 *   minimum so it satisfies the WCAG 2.5.5 / project 44×44 touch-target guideline
 *   for comfortable tapping on mobile, with its label centred inside the hit area.
 *
 * Styling:
 * - Every class resolves to a Tailwind `@theme` token or a native utility
 *   (see `src/index.css`); there are no hardcoded or arbitrary values. The list
 *   uses `flex flex-wrap` so long trails wrap onto multiple lines on small
 *   screens instead of forcing horizontal scroll, and 8px-scale `gap-2`
 *   spacing between crumbs and separators.
 * - Link contrast: `text-muted` (~7.5:1 on white) → hover `text-primary-600`
 *   (~4.6:1); the current crumb uses `text-foreground` (~17:1). All AA-compliant.
 *
 * @param {Object} props
 * @param {Array<{ name: string, path: string }>} [props.items=[]] Ordered
 *   crumbs from site root to the current page, e.g.
 *   `[{ name: 'Home', path: '/' }, { name: 'Courses', path: '/courses' },
 *     { name: 'Spoken English', path: '/spoken-english' }]`. The last entry is
 *   treated as the current page and rendered as non-link text.
 * @param {string} [props.className] Extra classes merged last onto the root
 *   `<nav>` (via `cn`, so caller overrides win deterministically).
 * @returns {JSX.Element|null} The breadcrumb navigation, or `null` when
 *   `items` is empty (nothing to show).
 */
function Breadcrumbs({ items = [], className }) {
  if (!items.length) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-2 text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                  >
                    {item.name}
                  </Link>
                  <FaChevronRight aria-hidden="true" className="h-3 w-3 shrink-0 text-border" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs

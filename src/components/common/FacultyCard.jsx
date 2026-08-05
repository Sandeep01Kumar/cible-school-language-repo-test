import Card from '../ui/Card.jsx'
import { cn } from '../../lib/cn.js'

/**
 * FacultyCard
 *
 * The single canonical faculty-member card for the CIBLE School of Language
 * SPA (AAP §0.6.1 Group 7). It is composed by the Faculty page grid and the
 * Home-page faculty preview — always reuse this component rather than
 * restyling a raw <div>, so every teacher tile stays visually and
 * semantically consistent (project reuse-first rule).
 *
 * The card is driven entirely by a single `member` object (source of truth:
 * `src/data/faculty.js`) of shape `{ name, role, bio, image, socials }`. It is
 * purely presentational and stateless: no hooks, no data fetching, no
 * framer-motion. Reveal/stagger animation is owned by the PARENT grid; the
 * card itself only adds a subtle, token-driven hover lift.
 *
 * Composition & styling (Tailwind v4 `@theme` tokens from src/index.css — zero
 * hardcoded values, everything on the 8px scale):
 * - Root surface reuses the canonical <Card> primitive. On top of Card's base
 *   (`rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md`) it layers a
 *   vertical, centered column: `flex h-full flex-col items-center gap-4
 *   text-center`. `h-full` lets every card in a grid row match the tallest
 *   sibling. `gap-4` (16px) spaces the avatar → name → role → bio → socials
 *   stack without per-child margins.
 * - Hover lift: opted in via Card's `lift` prop instead of re-declared here, so
 *   the 4px rise (motion only, never color) lives in one place for every
 *   browsable marketing card. `lift` raises the card and deepens the hover
 *   elevation a step past the base `hover:shadow-md` to the interactive
 *   `hover:shadow-lg`, both eased over the same 200ms — so the rise now
 *   complements the shadow SMOOTHLY rather than snapping it. This is why the
 *   root `className` must carry NO `transition-*` utility: they all share one
 *   tailwind-merge conflict group in which only the last wins, and since this
 *   `className` merges LAST, declaring one here would silently drop Card's own
 *   transition and leave the shadow change un-animated.
 * - Reduced motion needs the explicit `motion-reduce:transform-none` (plus the
 *   paired `motion-reduce:hover:translate-none`) that `lift` applies; the global
 *   `prefers-reduced-motion` rule in src/index.css is NOT sufficient on its own,
 *   because it only forces `scroll-behavior: auto` and clamps animation /
 *   transition DURATION and never resets a transform — alone it would make the
 *   rise instantaneous rather than remove it (WCAG 2.3.3).
 * - Avatar (`h-24 w-24 rounded-full`, 96px circle): when `member.image` is a
 *   truthy URL it renders a lazy-loaded, `object-cover` <img>. Otherwise it
 *   renders an INITIALS FALLBACK — the first letters of up to two name parts on
 *   a brand-blue disc (`bg-primary-600 text-white`). This keeps the roster
 *   free of broken images while real photos are still `null` in the data.
 * - Name is an <h3> (`text-foreground`), role is brand-blue (`text-primary-600`)
 *   and the bio is muted secondary text (`text-muted`) — all AA-contrast on
 *   white (foreground ~17:1, primary-600 ~4.6:1, muted ~7.5:1).
 * - Socials (optional) pin to the card bottom via `mt-auto` so rows of cards
 *   keep their social rows aligned regardless of differing bio lengths.
 *
 * Token note: the brand blue uses the numbered `primary-600` scale (matching
 * the shared Button/Badge/Input primitives and the registered `@theme`
 * tokens); a bare `primary`/`muted-foreground` alias is intentionally NOT used
 * because it is not defined in this project's theme.
 *
 * Accessibility (WCAG AA):
 * - The initials fallback is exposed as a single image to assistive tech via
 *   `role="img"` + `aria-label={member.name}`, so the decorative letters convey
 *   the person's identity rather than being read as raw text.
 * - Each social link carries a descriptive `aria-label` (e.g. "LinkedIn") and
 *   its icon is `aria-hidden` (decorative), so screen readers announce the
 *   destination once, not the icon glyph. Links are real <a> elements and
 *   inherit the global `:focus-visible` ring (outlines are never removed).
 * - That ring only PAINTS because the link is `inline-flex`. Its sole child is a
 *   react-icons <svg>, which Tailwind's Preflight sets to `display: block`; on a
 *   default `display: inline` anchor that block-in-inline split leaves the inline
 *   fragments zero-area, so the outline has no geometry to draw and keyboard
 *   users get NO visible focus (WCAG 2.4.7). Keep a display utility here.
 *   `min-h-11 min-w-11` then holds the icon-only target at 44x44px and
 *   `items-center justify-center` keeps the 20px glyph optically centred —
 *   the same icon-control recipe as the Navbar hamburger and shared Button.
 * - Semantic list markup (`<ul>`/`<li>`) groups the social links, and the name
 *   is a proper <h3> heading for a logical document outline.
 *
 * Override contract: any `className` a caller passes is merged LAST through
 * `cn()` (clsx + tailwind-merge) so it deterministically wins over the base;
 * all other props (`id`, `data-*`, `aria-*`, event handlers, …) are forwarded
 * to the underlying Card root element.
 *
 * @param {object} props
 * @param {object} props.member                 The faculty member to render.
 * @param {string} props.member.name            Full name (also the avatar/alt label).
 * @param {string} props.member.role            Subject / title (e.g. 'Head of Spoken English').
 * @param {string} props.member.bio             Short descriptive paragraph.
 * @param {string|null} [props.member.image]    Photo URL; when falsy an initials avatar is shown.
 * @param {Array<{label: string, href: string, icon?: import('react').ComponentType}>} [props.member.socials]
 *   Optional social links; `icon` is a react-icons component reference.
 * @param {string} [props.className]             Extra classes merged LAST (override the base).
 * @param {object} [props]                       Any other props forwarded to the Card root.
 * @returns {import('react').ReactElement|null}  The rendered faculty card, or null when no member.
 */

// Derive up-to-two uppercase initials from a full name (e.g. 'Asha Kumari' →
// 'AK'). Module-local (not exported) so the file exposes only the FacultyCard
// component and react/only-export-components stays clean. `filter(Boolean)`
// drops the empty strings produced by any double/leading/trailing spaces.
function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function FacultyCard({ member, className, ...props }) {
  // Defensive guard: render nothing when no member is supplied, so callers can
  // safely map over sparse or filtered data without crashing.
  if (!member) return null

  const { name, role, bio, image, socials } = member

  return (
    <Card lift className={cn('flex h-full flex-col items-center gap-4 text-center', className)} {...props}>
      {image ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-600 text-2xl font-semibold text-white"
          role="img"
          aria-label={name}
        >
          {getInitials(name)}
        </div>
      )}

      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <p className="text-sm font-medium text-primary-600">{role}</p>
      <p className="text-sm leading-relaxed text-muted">{bio}</p>

      {socials?.length ? (
        <ul className="mt-auto flex items-center justify-center gap-3 pt-2">
          {socials.map((s) => {
            const Icon = s.icon
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted transition-colors hover:text-primary-600"
                >
                  {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
                </a>
              </li>
            )
          })}
        </ul>
      ) : null}
    </Card>
  )
}

export default FacultyCard

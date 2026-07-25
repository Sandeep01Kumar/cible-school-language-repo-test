import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaBars, FaTimes, FaPhoneAlt } from 'react-icons/fa'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import { cn } from '../../lib/cn.js'
import { primaryNav } from '../../data/navigation.js'
import siteConfig from '../../data/siteConfig.js'
import logo from '../../assets/logo.svg'

/**
 * Navbar — the site-wide primary navigation bar for the CIBLE School of
 * Language SPA (AAP §0.6.1 Group 5). It is rendered inside the sticky
 * `<header>` owned by `src/components/layout/Layout.jsx` and appears above all
 * 17 pages plus the 404 view.
 *
 * Conversion-first: alongside the navigation links it surfaces a persistent
 * "Admission" call-to-action (the shared polymorphic `Button` routing to
 * `/admission`) and a click-to-call action (`siteConfig.phoneHref`), keeping
 * the primary admissions intents reachable from every page. All brand, link and
 * contact content is read from `src/data/*` — nothing is hardcoded here.
 *
 * Responsive behaviour (mobile-first, native Tailwind breakpoints):
 *   • `< md`  — brand + Admission CTA + hamburger (call text hidden to save room)
 *   • `md`    — the inline click-to-call action appears
 *   • `>= lg` — the full 7-link row appears and the hamburger is hidden
 * The `< lg` experience opens a right-anchored slide-in drawer that repeats the
 * links, the call action and the Admission CTA. If the viewport is resized up to
 * the `lg` breakpoint WHILE the drawer is open, a `matchMedia` listener closes
 * it automatically so the body scroll-lock is released (otherwise the drawer
 * would hide via `lg:hidden` but leave scrolling locked on desktop).
 *
 * Landmark, sticky & stacking coordination (IMPORTANT):
 *   • Layout owns the sticky `<header>` (`sticky top-0 z-50`); the visual bar
 *     here is a `<nav aria-label="Primary">` and MUST NOT add its own
 *     `<header>` or any `sticky`/`top-0` — a sticky element only travels within
 *     its parent's box, so the header (child of the full-height flex column) is
 *     what actually pins.
 *   • The component returns a fragment holding the `<nav>` bar AND the mobile
 *     drawer as SIBLINGS. The drawer is deliberately NOT a child of `<nav>`:
 *     the bar carries `backdrop-blur`, and per the CSS spec any ancestor with a
 *     non-`none` `backdrop-filter`/`filter`/`transform` becomes the containing
 *     block for `position: fixed` descendants. If the drawer lived inside the
 *     bar, its `fixed inset-0` would resolve against the ~64px bar box instead
 *     of the viewport and collapse to a top strip. As a sibling it escapes that
 *     containing block and fills the viewport. (Do NOT move the drawer back
 *     inside `<nav>`.)
 *   • Both siblings still render inside Layout's `z-50` `<header>` (a stacking
 *     context; `sticky` does not create a fixed-positioning containing block),
 *     so the `fixed inset-0 z-50` drawer paints above the root-level `z-40`
 *     floating widgets / sticky bottom bar. No React portal is required.
 *
 * Accessibility (WCAG AA):
 *   • Semantic `<nav aria-label="Primary">`; the drawer is a nested
 *     `<nav aria-label="Mobile">` inside a `role="dialog" aria-modal="true"`
 *     container labelled "Site menu".
 *   • The hamburger exposes `aria-label`, `aria-expanded` and
 *     `aria-controls="mobile-nav"` (matching the drawer `id`).
 *   • While the drawer is open, focus moves in, is trapped (Tab / Shift+Tab
 *     wrap), Esc closes it, and focus returns to the hamburger on close; body
 *     scroll is locked meanwhile.
 *   • Active route is conveyed by `NavLink` active styling (a token colour
 *     change); `end` on the Home link keeps `/` active only on the exact index.
 *   • Icons are decorative (`aria-hidden`); every control carries text or an
 *     `aria-label`. The global `:focus-visible` ring (src/index.css) is left
 *     intact for keyboard users.
 *   • The icon-only hamburger and drawer Close controls are sized to a 44×44px
 *     minimum (`min-h-11 min-w-11`, icon centred via `inline-flex`) so they meet
 *     the touch-target guideline on mobile.
 *
 * Styling is entirely token-driven (Tailwind v4 `@theme` tokens from
 * src/index.css) on the 8px spacing scale — every colour, radius, spacing and
 * shadow resolves to a design token/utility, with no hardcoded or arbitrary
 * `[..]` values.
 *
 * @param {object} [props]
 * @param {string} [props.className] Extra classes merged LAST via {@link cn}
 *   onto the root `<nav>` (Layout renders this component with none).
 * @returns {import('react').ReactElement} The primary navigation bar.
 */

// Module-scope active-link class builder shared by the desktop and mobile
// `NavLink`s. React Router calls it with `{ isActive }`; the active route gets
// the deeper primary token, the rest get foreground text with a primary hover.
// Not exported (the file exposes only the Navbar component) — module-scope
// `const` is permitted by oxlint `allowConstantExport`.
const navLinkClass = ({ isActive }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'text-primary-700' : 'text-foreground hover:text-primary-600'
  )

function Navbar({ className }) {
  // All hooks are declared unconditionally at the top level (oxlint
  // `react/rules-of-hooks`). `open` toggles the mobile drawer; the refs let the
  // effect trap focus inside the drawer and restore it to the hamburger.
  const [open, setOpen] = useState(false)
  const drawerRef = useRef(null)
  const toggleRef = useRef(null)

  // Drawer behaviour, wired only while `open`: initial focus, Esc-to-close, a
  // Tab focus trap, body scroll lock, and — on cleanup — listener removal,
  // scroll restore and focus return to the hamburger.
  useEffect(() => {
    if (!open) return

    // Capture the ref nodes at effect run time. `toggle` is used in cleanup to
    // restore focus; copying it into a local avoids reading a possibly-changed
    // `ref.current` inside the cleanup closure (react-hooks/exhaustive-deps).
    const node = drawerRef.current
    const toggle = toggleRef.current
    const focusables = node
      ? node.querySelectorAll('a[href], button:not([disabled])')
      : []
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (first) first.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key === 'Tab' && focusables.length > 0) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    // Auto-close the drawer when the viewport grows to the `lg` breakpoint
    // (Tailwind default 64rem) — the width at which BOTH the hamburger and the
    // drawer become `lg:hidden`. Without this, resizing mobile → desktop while
    // the drawer is open would visually hide the drawer but leave `open === true`,
    // so this effect would keep the body scroll-lock (`overflow: hidden`) applied
    // and the desktop page could never be scrolled (the reported bug). Setting
    // `open` to false here unmounts the drawer and runs the cleanup below, which
    // restores `document.body.style.overflow`. The listener supports the modern
    // `addEventListener` API with the legacy `addListener` fallback.
    const desktopQuery = window.matchMedia('(min-width: 64rem)')
    const onViewportChange = (event) => {
      if (event.matches) setOpen(false)
    }
    if (desktopQuery.matches) {
      // Already at/above `lg` when opened — close immediately.
      setOpen(false)
    }
    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', onViewportChange)
    } else {
      desktopQuery.addListener(onViewportChange)
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      if (typeof desktopQuery.removeEventListener === 'function') {
        desktopQuery.removeEventListener('change', onViewportChange)
      } else {
        desktopQuery.removeListener(onViewportChange)
      }
      if (toggle) toggle.focus()
    }
  }, [open])

  return (
    <>
      <nav
        aria-label="Primary"
        className={cn('w-full border-b border-border bg-white/95 backdrop-blur', className)}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand — plain Link (not NavLink) so the logo never gets active styling */}
            <Link
              to="/"
              className="flex items-center"
              aria-label="CIBLE School of Language — home"
            >
              <img src={logo} alt="CIBLE School of Language" className="h-10 w-auto" />
            </Link>

            {/* Desktop link row (lg and up) */}
            <ul className="hidden items-center gap-1 lg:flex">
              {primaryNav.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} end={item.path === '/'} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right cluster: click-to-call + Admission CTA + hamburger */}
            <div className="flex items-center gap-2">
              <a
                href={siteConfig.phoneHref}
                className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-surface md:inline-flex"
              >
                <FaPhoneAlt aria-hidden="true" className="h-4 w-4" />
                <span>{siteConfig.phone}</span>
              </a>

              <Button to="/admission" size="sm">
                Admission
              </Button>

              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-foreground hover:bg-surface lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-nav"
                onClick={() => setOpen(true)}
                ref={toggleRef}
              >
                <FaBars aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile drawer (below lg) — rendered as a SIBLING of <nav> (see JSDoc:
          escapes the bar's backdrop-filter containing block so the fixed
          overlay fills the viewport). Rendered only while open. */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/60"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-0 top-0 flex h-full w-72 max-w-full flex-col gap-2 bg-white p-6 shadow-md"
          >
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center self-end rounded-md p-2 text-foreground hover:bg-surface"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <FaTimes aria-hidden="true" className="h-6 w-6" />
            </button>

            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <a
              href={siteConfig.phoneHref}
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary-700"
            >
              <FaPhoneAlt aria-hidden="true" className="h-4 w-4" />
              {siteConfig.phone}
            </a>

            <Button to="/admission" className="mt-2" onClick={() => setOpen(false)}>
              Admission
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar

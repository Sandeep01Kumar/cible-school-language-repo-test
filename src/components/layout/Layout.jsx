import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import FloatingWhatsApp from '../cta/FloatingWhatsApp.jsx'
import FloatingCall from '../cta/FloatingCall.jsx'
import StickyBottomCTA from '../cta/StickyBottomCTA.jsx'
import Spinner from '../ui/Spinner.jsx'

/**
 * Layout — the single persistent application shell for the CIBLE School of
 * Language SPA (AAP §0.6.1 Group 5 / §0.6.3 "Layout shell"). It hosts ALL 17
 * pages plus the 404 view: `src/App.jsx` mounts it as the element of a parent
 * route (`<Route element={<Layout/>}>…children…</Route>`), so this component
 * renders a React Router `<Outlet/>` where the active page appears.
 *
 * Responsibilities:
 *   • Provides the semantic page landmarks — exactly one `<header>`, one
 *     `<main>` and one `<footer>` at this level (Navbar's root is `<nav>` and
 *     Footer's root is a `<div>`, so no landmark is nested/duplicated).
 *   • Renders a working skip-to-content link as the FIRST focusable element.
 *   • Owns the sticky navigation header and the footer.
 *   • Keeps the always-available conversion widgets — FloatingWhatsApp,
 *     FloatingCall and the mobile StickyBottomCTA — mounted on every route so
 *     Call & WhatsApp are reachable everywhere, prominently on mobile.
 *   • Restores scroll to the top on every client-side navigation via
 *     `<ScrollToTop/>` (which renders `null`).
 *
 * This is the conversion backbone of the site — the shell that guarantees the
 * primary admissions intents (Call / WhatsApp / Admission) never disappear as a
 * visitor moves between pages.
 *
 * Reuse-first composition (AAP rule: never duplicate components): Layout does
 * NOT re-implement navigation, footer or the widgets — it composes the existing
 * canonical sibling components, each a self-contained default export that reads
 * its own content from `src/data/*`. Layout itself takes NO props and holds no
 * state (no hooks), so it stays a thin, declarative composition root.
 *
 * Sticky header + stacking coordination (IMPORTANT — do not relocate):
 *   • The sticky positioning lives HERE on `<header className="sticky top-0
 *     z-50">`, NOT on Navbar's `<nav>`. A `sticky` element only travels within
 *     its own parent's box; the header's parent is this full-height flex column,
 *     so the header is what actually pins to the top of the scroll container.
 *   • `z-50` is REQUIRED. The header establishes a stacking context, and
 *     Navbar's mobile drawer (rendered inside it as `fixed inset-0 z-50`) must
 *     paint ABOVE the root-level `z-40` floating/sticky conversion widgets. With
 *     header `z-50` > widgets `z-40`, the drawer overlays everything without
 *     needing a React portal. A lower header z-index would trap the drawer
 *     beneath the widgets.
 *
 * Sticky footer behaviour: the root is a `flex min-h-screen flex-col` column and
 * `<main>` carries `flex-1`, so `main` grows to absorb spare height and the
 * footer sinks to the bottom of the viewport on short pages (e.g. the 404 view)
 * instead of floating mid-screen.
 *
 * In-shell Suspense boundary: `src/App.jsx` already wraps the routes in an outer
 * Suspense boundary; this inner boundary around `<Outlet/>` gives a smooth
 * in-shell fallback (the nav + footer stay visible) while a lazy page chunk
 * resolves. The fallback centres the canonical `Spinner` in a `min-h-[50vh]`
 * box so it reads as a reasonable page-region loader rather than a tiny glyph.
 *
 * Accessibility (WCAG AA):
 *   • The `.skip-link` (global class from src/index.css — hidden off-screen
 *     until focused) is the first focusable element; its `href="#main"` matches
 *     `<main id="main">`, satisfying the bypass-blocks requirement (SC 2.4.1).
 *   • `<main>` carries `id="main"` + `tabIndex={-1}` so the skip link can move
 *     focus programmatically into the content region. `focus:outline-none` is
 *     applied ONLY to this structural landmark (not to any interactive control)
 *     so activating the skip link does not paint a stray outline around the
 *     whole page; individual controls keep their global `:focus-visible` rings.
 *   • Tab order is skip-link → nav → main content → footer → widgets; the mobile
 *     drawer (inside Navbar) traps focus while open and restores it on close.
 *
 * Styling is entirely token-driven (Tailwind v4 `@theme` tokens from
 * src/index.css) on the project's 8px spacing scale — `bg-background` /
 * `text-foreground` resolve to design tokens, and every other value is a native
 * utility. The single intentional exception is `min-h-[50vh]` on the Suspense
 * fallback box: a viewport-relative height with no token equivalent, documented
 * as the one permitted arbitrary utility for this shell.
 *
 * @returns {import('react').ReactElement} The persistent shell wrapping the
 *   routed page `<Outlet/>`, the navigation/footer landmarks and the conversion
 *   widgets.
 */
function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Route-change scroll restoration; renders null, so placement is free. */}
      <ScrollToTop />

      {/* Bypass-blocks: first focusable element, visible on focus, targets #main. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* Layout owns the sticky positioning + z-50 stacking (see JSDoc). */}
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      {/* flex-1 lets main grow so the footer sinks to the bottom on short pages.
          id/tabIndex are the skip-link target; outline-none only on this landmark. */}
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Layout owns the contentinfo landmark; Footer's own root is a <div>. */}
      <footer>
        <Footer />
      </footer>

      {/* Always-available conversion widgets — self-positioned (fixed) at
          root level; StickyBottomCTA auto-hides at lg. Render order is
          immaterial since each is absolutely/fixed-positioned. */}
      <FloatingWhatsApp />
      <FloatingCall />
      <StickyBottomCTA />
    </div>
  )
}

export default Layout

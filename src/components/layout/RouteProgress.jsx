import { cn } from '../../lib/cn.js'

/**
 * RouteProgress — the accessible pending-navigation indicator (M18 / m01).
 *
 * Background: with route-level code splitting, `react-router` wraps navigations
 * in a React transition, so clicking a link to an un-cached page changes the
 * URL immediately but keeps the OLD page on screen (no Suspense fallback flash)
 * until the new chunk resolves — which on a slow network left the visitor with
 * no signal that anything was happening. `src/App.jsx` drives a controlled
 * `<Routes location={displayLocation}>` with `useTransition`, and passes that
 * hook's `isPending` here as {@link active}, so this component reflects EXACTLY
 * the window between "navigation started" and "new page committed".
 *
 * It renders two independent parts:
 *   • A slim visual progress bar pinned to the very top of the viewport. It is
 *     purely decorative, so it carries `aria-hidden` — assistive technology is
 *     served by the status region below, not by the bar. Being `aria-hidden`
 *     also keeps it exempt from the landmark-region rule even though it renders
 *     above the `<main>` landmark. It sits at `z-route-progress` (60) so it
 *     paints above the sticky header / drawer (z-50) and the floating widgets
 *     (z-40). Reduced-motion users get the global transition reset from
 *     src/index.css, so it simply appears/disappears with no animation.
 *   • A visually-hidden `role="status" aria-live="polite"` region that announces
 *     the pending transition ("Loading page…") to screen-reader users. The
 *     COMMITTED page name is announced separately by `Layout` once the new route
 *     renders, so together they give "pending → committed" feedback (m01). A
 *     live-region role also exempts this node from the region rule.
 *
 * @param {object} props
 * @param {boolean} props.active True while a route navigation is pending.
 * @returns {import('react').ReactElement} The bar + polite status region.
 */
function RouteProgress({ active }) {
  return (
    <>
      {/* Decorative bar — aria-hidden; animates via scaleX from the left edge. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-route-progress h-1 origin-left bg-primary-600 transition-transform duration-300 ease-out',
          active ? 'scale-x-100' : 'scale-x-0'
        )}
      />
      {/* Polite pending announcement; the committed page title is announced by Layout. */}
      <div role="status" aria-live="polite" className="sr-only">
        {active ? 'Loading page…' : ''}
      </div>
    </>
  )
}

export default RouteProgress

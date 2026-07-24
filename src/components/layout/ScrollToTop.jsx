import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop
 *
 * Route-change scroll restoration for the CIBLE School of Language SPA.
 *
 * React Router preserves the previous window scroll position when navigating
 * between routes, which makes deep pages open part-way down the viewport and
 * feels broken. This render-null utility lives inside the persistent <Layout>
 * shell and resets the window scroll position to the top-left on every
 * client-side navigation (once per pathname change).
 *
 * Motion preference:
 * - Users who have NOT requested reduced motion get a smooth animated scroll.
 * - Users with `prefers-reduced-motion: reduce` get an instant ('auto') jump.
 *   The `typeof window` guard keeps the component safe if it is ever evaluated
 *   outside a browser; at runtime in this Vite SPA `window` always exists, so
 *   the guard is purely defensive and lint-clean.
 *
 * Scope: pathname-change scroll-to-top only. It intentionally does NOT handle
 * hash anchors or scroll-to-element behaviour.
 *
 * Requirements:
 * - MUST be rendered inside a React Router ancestor (guaranteed by
 *   <BrowserRouter> in src/main.jsx). `useLocation()` is called at the top
 *   level of the component body to comply with the Rules of Hooks
 *   (oxlint `react/rules-of-hooks`).
 *
 * @returns {null} Renders nothing; its only effect is the scroll side effect.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, left: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
  }, [pathname])

  return null
}

export default ScrollToTop

import { useEffect, useState } from 'react'

/**
 * Vertical scroll offset, in CSS pixels, past which the header is treated as
 * "scrolled". Declared once so the synchronous reader and the hook's runtime
 * subscription share a single source of truth.
 *
 * 8px is deliberately small, and deliberately not 0:
 * - Not larger: the elevation exists to separate the bar from the content
 *   sliding underneath it. A generous threshold (say 64px) would leave the bar
 *   looking flat while a whole header's worth of content had already passed
 *   beneath it, which reads as a rendering bug rather than as restraint.
 * - Not 0: `scrollY` reports fractional values on high-DPI displays, and
 *   overscroll/rubber-band gestures plus browser scroll anchoring can nudge the
 *   offset a hair above and below zero while the page is visually at rest. A
 *   `> 0` test would flip the boolean on that jitter and re-render the whole
 *   navigation subtree for no visible reason. 8px clears the noise floor while
 *   still firing on the first real scroll gesture.
 * 8 also keeps this value on the project's 8px spacing scale, the rhythm every
 * other measurement in the design system resolves to.
 */
const SCROLL_THRESHOLD = 8

/**
 * Options for the `scroll` subscription. Declared once so the subscription and
 * its cleanup pass one identical object, which keeps the add/remove pair
 * provably symmetrical.
 *
 * `passive: true` is the load-bearing half: it promises the browser that the
 * handler will never call `preventDefault()`, so the compositor does not have to
 * block on JavaScript before committing each scroll frame. Without it, a
 * `window` scroll listener makes every scroll wait on this code — precisely the
 * input latency the project's Core Web Vitals budget exists to protect.
 */
const SCROLL_LISTENER_OPTIONS = { passive: true }

/**
 * Synchronously read whether the document is scrolled past `threshold` pixels.
 *
 * SSR-safe and defensive: returns false when `window` is unavailable (server
 * rendering, non-DOM test environments), so importing this module outside a
 * browser can never throw and the header defaults to its resting appearance.
 *
 * This is a plain helper, intentionally NOT named use*, so it can be called
 * anywhere — including as the lazy initializer for useState and from inside an
 * animation-frame callback — without being treated as a React hook by the
 * linter. It is intentionally NOT exported: the hook below is the only contract
 * this module publishes, and no consumer needs a one-shot read.
 *
 * The offset comes from `scrollY`, with its legacy alias `pageYOffset` as a
 * fallback for very old browsers. Both are scroll positions the browser already
 * has to hand, so reading them is free and — unlike `getBoundingClientRect()`,
 * `offsetTop` or `getComputedStyle()` — never forces a synchronous reflow. That
 * is what makes this safe to call on every animation frame of a scroll.
 *
 * @param {number} threshold Offset in CSS pixels to compare the position against.
 * @returns {boolean} True when the document is scrolled past `threshold`.
 */
function isScrolledPast(threshold) {
  if (typeof window === 'undefined') {
    return false
  }
  const offset = typeof window.scrollY === 'number' ? window.scrollY : window.pageYOffset
  return offset > threshold
}

/**
 * Header scroll-state hook: reports whether the document has scrolled past a
 * small threshold, so the primary navigation bar can lift off the page.
 *
 * Consumer: `src/components/layout/Navbar.jsx`. The observation lives in a hook
 * rather than in that component because watching the document scroll position is
 * behaviour, not markup. Keeping it here leaves Navbar a pure presentational
 * mapping from one boolean to a set of classes, and makes this the single place
 * scroll state is derived anywhere in the SPA.
 *
 * Ownership boundary (deliberately narrow — do not widen it):
 *   • This hook returns state and nothing else. It never writes a class, an
 *     inline style or a CSS custom property, never reads one, and never touches
 *     the header element or any other node.
 *   • `Navbar` maps the returned boolean onto its `<nav>` classes.
 *   • `Layout` owns the sticky header itself (`sticky top-0 z-50`). A sticky
 *     element only travels within its parent's box, so that ownership must never
 *     migrate here or into Navbar.
 *   • `src/index.css` owns the visual vocabulary the boolean selects between —
 *     the `--shadow-lg` / `--shadow-xl` elevation tokens and `--header-height`.
 *
 * Protected invariant: the scrolled state may change only the bar's border,
 * backdrop and elevation. The header measures exactly 64px in BOTH states, so
 * crossing the threshold moves no layout and contributes no cumulative layout
 * shift. Driving a height, padding or margin change off this boolean would break
 * that contract.
 *
 * SSR-safe: every DOM access sits behind a `typeof window` guard — in the reader
 * that seeds state, and again at the top of the effect, which no-ops and returns
 * `undefined` when there is no window. Importing this module in a non-browser
 * environment therefore cannot throw, and the module performs no work at import
 * time, so it adds nothing to the first-paint critical path.
 *
 * Performance — three separate mechanisms, each load-bearing:
 *   1. The `scroll` listener is passive, so the compositor never blocks on it.
 *   2. Scroll events fire far more often than once per frame, so the handler only
 *      schedules a `requestAnimationFrame`; the position read and the comparison
 *      happen inside that frame, and a second frame is never queued while one is
 *      outstanding. Work is therefore capped at once per frame.
 *   3. The next boolean is diffed against the last value committed to state, and
 *      the setter runs only on a genuine flip. This is the mechanism that keeps
 *      Navbar — and its whole subtree, including the portalled mobile drawer —
 *      from re-rendering on every frame of every scroll.
 *
 * Initial value: state is seeded lazily from the live scroll position and
 * re-synced once inside the effect before subscribing. A visitor can land on a
 * deep-linked anchor, or reload mid-page and have the browser restore the scroll
 * offset, so assuming "not scrolled" on mount would paint the resting bar and
 * then flash to the scrolled one. The same boolean diff also makes React
 * StrictMode's second effect invocation a harmless no-op.
 *
 * All hooks are called unconditionally at the top level, in a stable order, to
 * satisfy the Rules of Hooks.
 *
 * @param {number} [threshold=8] Offset in CSS pixels past which the header
 *   counts as scrolled. Defaults to the shared 8px value; a non-finite argument
 *   falls back to that same default.
 * @returns {boolean} True once the document is scrolled past `threshold`.
 *
 * @example
 * const isScrolled = useHeaderScrollState()
 * // <nav className={cn('border-b border-border', isScrolled && 'shadow-lg')} />
 */
export function useHeaderScrollState(threshold = SCROLL_THRESHOLD) {
  // Normalise before the value reaches state or the dependency array. A
  // non-finite argument (null, NaN, a stray string) would otherwise make the
  // comparison behave unpredictably — and NaN in particular never equals itself,
  // so it would re-run the effect and re-subscribe the listener on EVERY render.
  const safeThreshold = Number.isFinite(threshold) ? threshold : SCROLL_THRESHOLD

  // All hooks are declared unconditionally at the top level (oxlint
  // `react/rules-of-hooks`). The lazy initializer reads the real scroll position
  // once, so a deep-linked or scroll-restored load paints the correct state.
  const [isScrolled, setIsScrolled] = useState(() => isScrolledPast(safeThreshold))

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    // Effect-scoped mirror of the value last handed to React, and the single
    // outstanding animation-frame slot. `committed` is the PRIMARY diff:
    // comparing against a local that the frame callback also updates means no
    // closure ever captures a stale render's `isScrolled`, and that state never
    // has to become a dependency of this effect.
    let committed = isScrolledPast(safeThreshold)
    let frame = null

    // Close the gap between the lazy initial read and this subscription: the
    // page can scroll during that window (restored offset, an anchor jump, or a
    // fast flick on a slow first paint).
    setIsScrolled(committed)

    const onFrame = () => {
      // Release the slot first, so a scroll landing later in this same frame can
      // schedule the next read instead of being dropped.
      frame = null
      const next = isScrolledPast(safeThreshold)
      if (next === committed) return
      committed = next
      // The functional form is a secondary safeguard only; `committed` above is
      // what actually prevents a per-frame render.
      setIsScrolled((previous) => (previous === next ? previous : next))
    }

    const onScroll = () => {
      // Coalesce: at most one frame in flight, and no work in the event handler
      // itself beyond this check.
      if (frame !== null) return
      frame = window.requestAnimationFrame(onFrame)
    }

    window.addEventListener('scroll', onScroll, SCROLL_LISTENER_OPTIONS)

    return () => {
      // Cancel before removing: a frame queued by the last scroll event would
      // otherwise still run after unmount and call setState on a dead component.
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
        frame = null
      }
      window.removeEventListener('scroll', onScroll, SCROLL_LISTENER_OPTIONS)
    }
  }, [safeThreshold])

  return isScrolled
}

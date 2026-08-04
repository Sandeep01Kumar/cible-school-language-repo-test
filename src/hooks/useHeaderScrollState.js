import { useEffect, useState } from 'react'

/**
 * Vertical scroll offset, in CSS pixels, past which the header is treated as
 * "scrolled". Declared once so the synchronous reader and the hook's runtime
 * subscription share a single source of truth.
 *
 * The value is small so the state flips on the first real scroll gesture rather
 * than after a screenful, but deliberately not 0: `scrollY` reports fractional
 * offsets and overscroll/scroll-anchoring can nudge it either side of zero while
 * the page is visually at rest, and a `> 0` test would flip the boolean on that
 * jitter.
 */
const SCROLL_THRESHOLD = 8

/**
 * Options for the `scroll` subscription. `passive: true` documents that the
 * handler never calls `preventDefault()`, so the browser can commit scroll
 * frames without waiting on this code.
 */
const SCROLL_LISTENER_OPTIONS = { passive: true }

/**
 * Synchronously read whether the document is scrolled past `threshold` pixels.
 *
 * SSR-safe: returns false when `window` is unavailable, so importing this module
 * outside a browser cannot throw and the header defaults to its resting
 * appearance.
 *
 * A plain helper, intentionally NOT named use*, so it can be called anywhere —
 * including as the lazy initializer for useState and from inside an
 * animation-frame callback — without being treated as a React hook by the
 * linter. It is intentionally NOT exported: the hook below is the only contract
 * this module publishes.
 *
 * The offset comes from `scrollY`, with its legacy alias `pageYOffset` as a
 * fallback for very old browsers. Unlike `getBoundingClientRect()`, `offsetTop`
 * or `getComputedStyle()`, neither read forces layout, which is what makes this
 * safe to call on every animation frame of a scroll.
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
 * small threshold, so the primary navigation bar can lift off the page. Watching
 * the scroll position is behaviour rather than markup, so it lives here — the
 * single place scroll state is derived anywhere in the SPA.
 *
 * Ownership boundary (deliberately narrow): this hook returns state and nothing
 * else. It never reads or writes a class, an inline style or a CSS custom
 * property, and never touches the header element. `Navbar` may map the returned
 * boolean onto its `<nav>` backdrop and elevation classes; `Layout` owns the
 * sticky header itself (`sticky top-0 z-50`), and `src/index.css` owns the
 * elevation tokens and `--header-height` such a mapping selects between.
 *
 * Protected invariant: the bar's border and its 64px height are unchanged in both
 * states, so crossing the threshold moves no layout and contributes no cumulative
 * layout shift. Driving a height, padding or margin change off this boolean would
 * break that contract.
 *
 * SSR-safe: every DOM access sits behind a `typeof window` guard — in the reader
 * that seeds state, and again at the top of the effect, which no-ops when there
 * is no window. The module also performs no work at import time.
 *
 * Three load-bearing performance mechanisms: the `scroll` listener is passive;
 * the handler only schedules a `requestAnimationFrame`, and never a second while
 * one is outstanding, so the position read is capped at once per frame; and the
 * next boolean is diffed against the last value committed to state, so the setter
 * — and therefore a consumer's re-render — happens only on a genuine flip.
 * Cleanup cancels any pending frame before removing the listener.
 *
 * State is seeded lazily from the live scroll position and re-synced once inside
 * the effect before subscribing, because a visitor can land on a deep-linked
 * anchor or reload mid-page and have the browser restore the offset. That same
 * diff makes React StrictMode's second effect invocation a harmless no-op.
 *
 * All hooks are called unconditionally at the top level, in a stable order, to
 * satisfy the Rules of Hooks.
 *
 * @param {number} [threshold=8] Offset in CSS pixels past which the header counts
 *   as scrolled. A non-finite argument falls back to that default.
 * @returns {boolean} True once the document is scrolled past `threshold`.
 *
 * @example
 * const isScrolled = useHeaderScrollState()
 * // <nav className={cn('border-b border-border', isScrolled && 'shadow-md')} />
 */
export function useHeaderScrollState(threshold = SCROLL_THRESHOLD) {
  // A non-finite argument (null, NaN, a stray string) would make every offset
  // comparison below behave unpredictably, so it is normalised to the default
  // before the value reaches state or the effect's dependency array.
  const safeThreshold = Number.isFinite(threshold) ? threshold : SCROLL_THRESHOLD

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

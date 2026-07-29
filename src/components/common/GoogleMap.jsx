import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '../../lib/cn.js'
import siteConfig from '../../data/siteConfig.js'

/**
 * GoogleMap
 *
 * THE single canonical map embed for the CIBLE School of Language SPA. It renders
 * the institute's location (State Highway 75 (SH75), Mukhiapatti, Saharghat,
 * Madhubani, Bihar) as a responsive, lazy-loaded Google Maps `<iframe>` so
 * prospective students and parents can find and visit the campus — a core
 * conversion action ("Visit the Institute"). Compose this primitive on the
 * Contact page and inside the Footer; never hand-roll a raw map `<iframe>`
 * elsewhere so the source URL, accessibility, and framing stay consistent.
 *
 * Data source: the embed URL and the human "open in Maps" link both come from
 * `siteConfig` (single source of truth) — `siteConfig.mapEmbedUrl` (the
 * `https://www.google.com/maps/embed?...`-style URL used as the `<iframe src>`)
 * and `siteConfig.mapLink` (the shareable Google Maps search link). No location
 * value is hardcoded here.
 *
 * Styling (Tailwind v4 `@theme` tokens from src/index.css — zero hardcoded
 * values):
 * - `relative` + `aspect-video`   → a fixed 16:9 box that reserves its height at
 *   every width, so the map never triggers Cumulative Layout Shift while it loads.
 * - `w-full`                       → fills the parent column; combined with the
 *   `aspect-video` ratio the embed reflows on every breakpoint with no horizontal
 *   overflow.
 * - `overflow-hidden` + `rounded-2xl` (--radius-2xl) → clips the map to the brand
 *   rounded-card corners.
 * - `border border-border` (--color-border) → 1px hairline matching the `Card`
 *   surface so the map reads as part of the design system.
 * - `bg-surface` (--color-surface) → a subtle neutral fill shown behind the iframe
 *   while it loads and behind the graceful fallback.
 *
 * Performance: the iframe uses `loading="lazy"` so the (heavy, third-party) map is
 * only fetched when it scrolls near the viewport — protecting initial load and
 * Core Web Vitals.
 *
 * Privacy: the iframe requests Google with `referrerPolicy="strict-origin-when-
 * cross-origin"`, so the cross-origin request carries only this site's origin
 * (never the full page path or query) — a deliberately stricter policy than the
 * browser/legacy `no-referrer-when-downgrade` default.
 *
 * Hardening: the iframe is sandboxed (QA Issue 23) to the minimum capabilities a
 * Google Maps embed needs — `allow-scripts`, `allow-same-origin`, `allow-popups`,
 * `allow-popups-to-escape-sandbox`, `allow-forms` — which lets the map render and
 * its "View larger map" / directions links open, while denying top-level
 * navigation, downloads, pointer-lock, and other capabilities by default.
 *
 * Graceful degradation: an address + "Open in Google Maps" link
 * (`siteConfig.mapLink`, opened in a new `noopener`-isolated tab) is ALWAYS
 * rendered as a layer BENEATH the iframe, so the location stays reachable in
 * every failure mode. When `siteConfig.mapEmbedUrl` is absent/empty no iframe is
 * rendered and the fallback is the sole content. A transparent/blocked frame
 * simply lets the fallback show through — but a hard failure while OFFLINE makes
 * the browser paint an OPAQUE error page ("dino") that would COVER the fallback
 * (QA Issue 23). To prevent that, the component actively detects failure and
 * UNMOUNTS the iframe so the fallback beneath is revealed: (1) it reacts to the
 * browser `offline`/`online` events (and the initial `navigator.onLine`), and
 * (2) once the lazy iframe has actually scrolled into view it starts a load
 * timeout that, if no `onLoad` (or an `onError`) resolves it in time, treats the
 * embed as failed. The timeout is gated on in-view (via
 * `react-intersection-observer`) so a below-the-fold lazy map the user has not
 * scrolled to yet is never prematurely removed. The embed therefore never
 * degrades to an empty box or an opaque error page, and the fallback link
 * doubles as a keyboard/AT-reachable text alternative to the embedded frame.
 *
 * Accessibility (WCAG AA): the `<iframe>` always carries a descriptive `title`
 * (mandatory for assistive technology to announce the embedded frame); the
 * fallback exposes a real, focusable `<a>` link. The wrapper adds no interactive
 * semantics of its own.
 *
 * @param {object} props
 * @param {string} [props.title='CIBLE School of Language location on Google Maps']
 *   Accessible name announced for the embedded map frame. Always applied to the
 *   `<iframe>` and required for accessibility.
 * @param {number} [props.loadTimeoutMs=8000] How long (ms) to wait, AFTER the
 *   lazy iframe scrolls into view, for a successful load before treating the
 *   embed as failed and revealing the fallback (QA Issue 23).
 * @param {string} [props.className] Extra classes merged LAST via `cn(...)` (clsx +
 *   tailwind-merge), so caller-supplied utilities always win over the base surface.
 * @param {object} [props] Any other props (`id`, `aria-*`, `data-*`, `style`, …)
 *   are forwarded to the rendered wrapper `<div>`.
 * @returns {import('react').ReactElement} The rendered responsive map surface.
 */
export default function GoogleMap({
  title = 'CIBLE School of Language location on Google Maps',
  loadTimeoutMs = 8000,
  className,
  ...props
}) {
  const hasEmbed = Boolean(siteConfig.mapEmbedUrl)

  // Observe the wrapper so the load timeout is armed only once the lazy iframe is
  // actually near/in the viewport. `triggerOnce` keeps `inView` true once reached
  // (no need to re-arm), the `rootMargin` pre-arms slightly before it is fully
  // visible, and `skip` avoids observing at all when there is no embed to watch.
  const { ref: viewRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
    skip: !hasEmbed,
  })

  // Embed status: 'idle' (mounted, not yet confirmed) → 'loaded' on a successful
  // onLoad while online; 'failed' on error/timeout; 'offline' when the browser
  // reports no connectivity. Initialised from navigator.onLine so a page opened
  // while offline never renders the frame (and thus never paints the opaque
  // browser error page over the fallback — QA Issue 23).
  const [status, setStatus] = useState(() =>
    typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'idle',
  )
  const timeoutRef = useRef(null)

  // React to connectivity changes. Going offline forces the frame to unmount so
  // the address + link fallback shows instead of the opaque error page; coming
  // back online re-arms a fresh load attempt.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const handleOffline = () => setStatus('offline')
    const handleOnline = () => setStatus((prev) => (prev === 'offline' ? 'idle' : prev))
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  // Load timeout — started ONLY once the lazy iframe is in view and still
  // unconfirmed. If no onLoad/onError resolves it within the window, treat the
  // embed as failed and reveal the fallback (covers frames that hang or are
  // blocked without ever firing onError). Gating on `inView` avoids prematurely
  // failing a below-the-fold map the user has not scrolled to yet.
  useEffect(() => {
    if (!hasEmbed || !inView || status !== 'idle') return undefined
    timeoutRef.current = window.setTimeout(() => {
      setStatus((prev) => (prev === 'idle' ? 'failed' : prev))
    }, loadTimeoutMs)
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [hasEmbed, inView, status, loadTimeoutMs])

  const clearLoadTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleLoad = () => {
    clearLoadTimeout()
    // Promote to 'loaded' only when online; an onLoad that fires while offline is
    // the browser's error page, which must NOT be treated as a successful map.
    setStatus((prev) => (prev === 'offline' ? prev : 'loaded'))
  }

  const handleError = () => {
    clearLoadTimeout()
    setStatus('failed')
  }

  // Render the frame unless we have determined it failed or we are offline.
  const showIframe = hasEmbed && status !== 'failed' && status !== 'offline'

  return (
    <div
      ref={viewRef}
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface',
        className,
      )}
      {...props}
    >
      {/* Always-present fallback layer. Rendered BEFORE the iframe so it sits
          beneath it in the stacking order (both are `absolute inset-0`; the
          later sibling — the iframe — paints on top). It keeps the address and
          an "Open in Google Maps" link reachable in every failure mode: when no
          embed URL is configured (no iframe is rendered), when a network or
          privacy blocker stops Google from loading, and when the frame is
          actively unmounted after an offline/error/timeout — so the map never
          becomes an empty box or an opaque error page (QA Issue 23). */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted">
        <p>{siteConfig.address}</p>
        {siteConfig.mapLink ? (
          <a
            href={siteConfig.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700"
          >
            Open in Google Maps
          </a>
        ) : null}
      </div>
      {showIframe ? (
        <iframe
          src={siteConfig.mapEmbedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : null}
    </div>
  )
}

import { Component } from 'react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

/**
 * isChunkLoadError — classify whether a caught error is a failed dynamic-import
 * (lazy route chunk) rather than a transient render error (QA Issue 15).
 *
 * This matters for recovery: a rejected `import()` is CACHED by `React.lazy`, so
 * re-rendering the same lazy element (what "Try again" does) simply rethrows the
 * cached rejection without issuing a fresh network request — it cannot recover.
 * A full page reload CAN, because it re-fetches `index.html` and the fresh chunk
 * manifest. So when the boundary catches a chunk-load failure it must steer the
 * visitor to "Reload page", not "Try again".
 *
 * Detection is message/name based across engines: Chromium ("Failed to fetch
 * dynamically imported module"), Firefox ("error loading dynamically imported
 * module"), Safari ("Importing a module script failed"), and the historical
 * webpack `ChunkLoadError` name — matched case-insensitively and defensively so
 * a non-Error throwable never crashes the classifier.
 *
 * @param {unknown} error The value thrown to the boundary.
 * @returns {boolean} True when the error looks like a failed lazy-chunk import.
 */
function isChunkLoadError(error) {
  if (!error) return false
  const name = typeof error.name === 'string' ? error.name : ''
  const message = typeof error.message === 'string' ? error.message : ''
  if (name === 'ChunkLoadError') return true
  return /dynamically imported module|importing a module script failed|failed to fetch dynamically|error loading dynamically imported/i.test(
    message,
  )
}

/**
 * ErrorBoundary — the app's render-error safety net (M18 route resilience).
 *
 * React error boundaries are the ONE documented case where a class component is
 * REQUIRED: there is no hook equivalent for `getDerivedStateFromError` /
 * `componentDidCatch` in React 19, so this file is an intentional, isolated
 * exception to the "functional components only" project rule (functional
 * components remain the rule for every other component).
 *
 * It wraps the routed `<Outlet/>` inside `Layout` and is keyed by pathname
 * there, so it RESETS automatically on navigation. Consequences:
 *   • The persistent shell — Navbar, Footer and the conversion widgets — stays
 *     mounted and interactive when a page fails; only the content region is
 *     replaced by the recovery UI, so a visitor can always navigate away or
 *     reach the Call / WhatsApp / Admission actions.
 *   • Two failure classes are handled: (1) a lazily-imported page chunk that
 *     rejects even after {@link lazyWithRetry}'s retry + one-time reload (e.g. a
 *     genuinely broken module), and (2) a runtime error thrown while a page
 *     renders.
 *
 * Recovery affordances (accessible), tailored to the failure class (QA Issue 15):
 *   • The panel is a `role="alert"` region so assistive technology announces it
 *     immediately, with a real `<h1>` heading and human-readable guidance.
 *   • For a TRANSIENT RENDER error: "Try again" (primary) resets the boundary to
 *     re-attempt rendering the SAME route without a full reload, with "Reload
 *     page" and "Go to homepage" as secondary options.
 *   • For a FAILED LAZY-CHUNK import (detected via {@link isChunkLoadError}):
 *     "Try again" cannot help because `React.lazy` caches the rejected import
 *     and re-rendering rethrows it with no new request, so the UI OMITS it and
 *     leads with "Reload page" (a hard reload re-fetches the fresh chunk
 *     manifest — the surest fix for a stale deployment), with "Go to homepage"
 *     as the safe secondary. "Go to homepage" is always a normal client-side
 *     link.
 *
 * Styling is token-driven on the 8px scale via the canonical `Container` and
 * `Button` primitives — no hardcoded or arbitrary (`[..]`) utility values.
 *
 * @augments {Component<{ children: import('react').ReactNode }, { hasError: boolean }>}
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReset = this.handleReset.bind(this)
    this.handleReload = this.handleReload.bind(this)
  }

  /**
   * React lifecycle: derive the error state from a thrown error so the next
   * render shows the fallback UI instead of the crashed subtree. The error is
   * captured (not discarded) so `render` can distinguish a failed lazy-chunk
   * import — for which "Try again" cannot help and "Reload page" must lead
   * (QA Issue 15) — from a transient render error.
   * @param {unknown} error The thrown error.
   * @returns {{ hasError: boolean, error: unknown }} The next state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  /**
   * React lifecycle: side-effect hook for diagnostics. Logs to the console so
   * the failure is inspectable in the field; this client-only SPA (AAP §0.7.2)
   * has no remote logging backend, so the console is the appropriate sink.
   * @param {Error} error The thrown error.
   * @param {{ componentStack: string }} info React component-stack info.
   * @returns {void}
   */
  componentDidCatch(error, info) {
    console.error('Route render error caught by ErrorBoundary:', error, info)
  }

  /**
   * Clear the error so the same route is re-attempted (transient failures).
   * @returns {void}
   */
  handleReset() {
    this.setState({ hasError: false, error: null })
  }

  /**
   * Hard reload — the surest recovery from a stale deployment / broken chunk.
   * @returns {void}
   */
  handleReload() {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    // A failed lazy-chunk import cannot be recovered by re-rendering the cached
    // rejected module ("Try again"); only a full reload re-fetches the fresh
    // chunk manifest. So for chunk errors we lead with "Reload page" and omit
    // the non-functional "Try again" affordance, while transient render errors
    // keep "Try again" as the primary, no-reload recovery (QA Issue 15).
    const chunkError = isChunkLoadError(this.state.error)

    return (
      <Container className="flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
        <div role="alert" className="flex max-w-xl flex-col items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Something went wrong</h1>
          <p className="text-muted">
            {chunkError
              ? 'This page couldn’t be downloaded — usually because the site was updated while your tab was open, or a brief network interruption. Reloading fetches the latest version. The menu and quick-contact actions stay available.'
              : 'This page failed to load. That can happen after a site update or a brief network interruption. You can try again, reload the page, or return to the homepage — the menu and quick-contact actions stay available.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {chunkError ? (
              <>
                <Button type="button" onClick={this.handleReload}>
                  Reload page
                </Button>
                <Button to="/" variant="outline">
                  Go to homepage
                </Button>
              </>
            ) : (
              <>
                <Button type="button" onClick={this.handleReset}>
                  Try again
                </Button>
                <Button type="button" variant="secondary" onClick={this.handleReload}>
                  Reload page
                </Button>
                <Button to="/" variant="outline">
                  Go to homepage
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    )
  }
}

export default ErrorBoundary

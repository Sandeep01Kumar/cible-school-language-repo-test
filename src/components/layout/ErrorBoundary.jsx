import { Component } from 'react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

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
 * Recovery affordances (accessible):
 *   • The panel is a `role="alert"` region so assistive technology announces it
 *     immediately, with a real `<h1>` heading and human-readable guidance.
 *   • "Try again" resets the boundary to re-attempt rendering the SAME route
 *     (clears a transient error without a full reload).
 *   • "Reload page" performs a hard reload (the surest fix for a stale
 *     deployment). "Go to homepage" is a normal client-side link, always safe.
 *
 * Styling is token-driven on the 8px scale via the canonical `Container` and
 * `Button` primitives — no hardcoded or arbitrary (`[..]`) utility values.
 *
 * @augments {Component<{ children: import('react').ReactNode }, { hasError: boolean }>}
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
    this.handleReset = this.handleReset.bind(this)
    this.handleReload = this.handleReload.bind(this)
  }

  /**
   * React lifecycle: derive the error state from a thrown error so the next
   * render shows the fallback UI instead of the crashed subtree.
   * @returns {{ hasError: boolean }} The next state.
   */
  static getDerivedStateFromError() {
    return { hasError: true }
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
    this.setState({ hasError: false })
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

    return (
      <Container className="flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
        <div role="alert" className="flex max-w-xl flex-col items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Something went wrong</h1>
          <p className="text-muted">
            This page failed to load. That can happen after a site update or a brief network
            interruption. You can try again, reload the page, or return to the homepage — the menu
            and quick-contact actions stay available.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button type="button" onClick={this.handleReset}>
              Try again
            </Button>
            <Button type="button" variant="secondary" onClick={this.handleReload}>
              Reload page
            </Button>
            <Button to="/" variant="outline">
              Go to homepage
            </Button>
          </div>
        </div>
      </Container>
    )
  }
}

export default ErrorBoundary

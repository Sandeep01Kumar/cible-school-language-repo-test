import { lazy } from 'react'

/**
 * Session-storage key recording that a one-time recovery reload has ALREADY
 * happened this browser session, so the retry logic never loops reloading.
 */
const RELOAD_FLAG = 'cible:chunk-reload'

/** Milliseconds to wait before the single retry (clears transient blips). */
const RETRY_DELAY_MS = 400

/**
 * lazyWithRetry — a hardened wrapper around `React.lazy` for route-level code
 * splitting (M18 route resilience).
 *
 * Problem: with hashed, code-split chunks a visitor who keeps a tab open across
 * a redeploy can navigate to a route whose OLD chunk filename no longer exists
 * on the server, so the dynamic `import()` rejects ("Failed to fetch
 * dynamically imported module"). A transient network blip causes the same
 * rejection. Raw `React.lazy` surfaces this as a hard crash to the nearest
 * error boundary with no attempt at recovery.
 *
 * Strategy (defence in depth):
 *   1. Retry the import ONCE after a short delay — clears transient network
 *      failures with no user-visible disruption.
 *   2. If it still fails, assume a stale deployment and force a ONE-TIME full
 *      page reload (guarded by a `sessionStorage` flag) so the browser
 *      re-fetches `index.html` and the fresh chunk manifest, then loads the
 *      correct chunk.
 *   3. If a reload has ALREADY happened this session and the import STILL fails,
 *      stop reloading and reject, letting {@link ErrorBoundary} show its
 *      accessible recovery UI. This prevents an infinite reload loop when the
 *      failure is not a stale chunk (e.g. the module genuinely throws at import
 *      time).
 *
 * On any SUCCESSFUL import the reload flag is cleared, so a later stale-chunk
 * event in the same session is still allowed its own single recovery reload.
 *
 * @param {() => Promise<{ default: import('react').ComponentType }>} factory
 *   The dynamic import factory, e.g. `() => import('./pages/Home.jsx')`.
 * @returns {import('react').LazyExoticComponent<import('react').ComponentType>}
 *   A lazy component with the retry / reload recovery behaviour baked in.
 */
export function lazyWithRetry(factory) {
  return lazy(() =>
    factory()
      .then((module) => {
        // Success — clear any prior "we reloaded" flag so a future stale-chunk
        // event in this session may recover with its own single reload.
        clearReloadFlag()
        return module
      })
      .catch(() =>
        // First failure → retry once after a short delay (transient network).
        delay(RETRY_DELAY_MS)
          .then(factory)
          .then((module) => {
            clearReloadFlag()
            return module
          })
          .catch((error) => {
            // Second failure → most likely a stale chunk after a redeploy.
            // Force a single guarded full reload to fetch the fresh manifest.
            if (!hasReloadedThisSession()) {
              markReloadedThisSession()
              window.location.reload()
              // Resolve never: keep React suspended (no render, no throw) for
              // the brief moment before the reload navigates the document away.
              return new Promise(() => undefined)
            }
            // Already reloaded once and still failing → surface to ErrorBoundary.
            throw error
          })
      )
  )
}

/**
 * Promise-based delay used to space out the single retry.
 * @param {number} ms Milliseconds to wait.
 * @returns {Promise<void>} Resolves after `ms`.
 */
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Whether a recovery reload has already happened this browser session. Wrapped
 * in try/catch because `sessionStorage` access can throw (privacy mode /
 * storage disabled); on any error we behave as "not reloaded" so recovery still
 * attempts once and never crashes on storage access.
 * @returns {boolean} True when a recovery reload was already performed.
 */
function hasReloadedThisSession() {
  try {
    return window.sessionStorage.getItem(RELOAD_FLAG) === '1'
  } catch {
    return false
  }
}

/**
 * Record that a recovery reload has been forced this session (best-effort).
 * @returns {boolean} True on success, false when storage is unavailable.
 */
function markReloadedThisSession() {
  try {
    window.sessionStorage.setItem(RELOAD_FLAG, '1')
    return true
  } catch {
    return false
  }
}

/**
 * Clear the recovery-reload flag after a successful import (best-effort).
 * @returns {boolean} True on success, false when storage is unavailable.
 */
function clearReloadFlag() {
  try {
    window.sessionStorage.removeItem(RELOAD_FLAG)
    return true
  } catch {
    return false
  }
}

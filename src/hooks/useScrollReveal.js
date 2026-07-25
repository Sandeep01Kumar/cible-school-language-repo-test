import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

/**
 * Media query that matches when the user has requested reduced motion at the
 * operating-system / browser level. Declared once so the synchronous reader and
 * the hook's runtime subscription share a single source of truth.
 */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Default IntersectionObserver options for scroll-reveal:
 * - triggerOnce: the reveal fires a single time and then stops observing, so
 *   content never re-hides when it scrolls back out of view.
 * - threshold: 0 reveals as soon as ANY part of the observed element enters the
 *   viewport. This is deliberate and important for robustness. The ref returned
 *   by this hook is usually attached to a whole section/grid CONTAINER, and a
 *   positive threshold t requires at least a fraction t of that container to be
 *   on-screen at once. For any container taller than viewportHeight / t the
 *   maximum achievable intersection ratio is itself below t, so the trigger is
 *   mathematically unsatisfiable and the content stays hidden FOREVER (e.g. a
 *   tall single-column course grid on a narrow mobile viewport — the grid can
 *   never occupy 15% of the screen, so a threshold of 0.15 would never fire and
 *   the cards would remain opacity:0). threshold: 0 is satisfiable at every
 *   container height, so paired with triggerOnce it reveals content exactly
 *   once as it scrolls into view and never traps it in the hidden state.
 * Callers may override any field (including threshold) by passing their own
 * options to useScrollReveal (caller options are merged OVER these defaults).
 */
const DEFAULT_OPTIONS = { triggerOnce: true, threshold: 0 }

/**
 * Synchronously read whether the user prefers reduced motion.
 *
 * SSR-safe and defensive: returns false when window or window.matchMedia is
 * unavailable (server rendering, very old browsers, non-DOM test environments)
 * so callers never crash and motion is treated as allowed by default.
 *
 * This is a plain helper, intentionally NOT named use*, so it can be called
 * anywhere, including as the lazy initializer for useState, without being
 * treated as a React hook by the linter.
 *
 * @returns {boolean} True when the user has requested reduced motion.
 *
 * @example
 * // Gate a framer-motion element so it appears with no transition:
 * const reduce = prefersReducedMotion()
 * // <motion.div initial={reduce ? false : 'hidden'} animate="visible" />
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/**
 * Reveal-on-scroll hook: the first layer of the project's animation system.
 *
 * Wraps react-intersection-observer's useInView and layers in full respect for
 * prefers-reduced-motion:
 * - When motion is allowed, it observes the target and flips inView to true the
 *   first time the element enters the viewport (triggerOnce by default).
 * - When the user prefers reduced motion, observation is skipped entirely and
 *   inView is true immediately, so content is shown at once, never hidden behind
 *   an animation and never dependent on scroll position.
 *
 * The preference is tracked in state and kept in sync at runtime: a matchMedia
 * listener updates the value if the user toggles the OS setting while the page
 * is open (supporting both the modern addEventListener API and the legacy
 * addListener API for older browsers), and the subscription is cleaned up on
 * unmount.
 *
 * All hooks (useState, useEffect, useInView) are called unconditionally at the
 * top level, in a stable order, to satisfy the Rules of Hooks.
 *
 * @param {Object} [options] Optional useInView options merged OVER the defaults
 *   ({ triggerOnce: true, threshold: 0 }). Common overrides: threshold,
 *   rootMargin, root, triggerOnce, skip.
 * @returns {{ ref: (node?: Element | null) => void, inView: boolean }} ref is a
 *   callback ref to attach to the observed element (for example a motion.*
 *   element), and inView indicates whether the reveal should show.
 *
 * @example
 * const { ref, inView } = useScrollReveal()
 * // <motion.div
 * //   ref={ref}
 * //   variants={fadeUp}
 * //   initial="hidden"
 * //   animate={inView ? 'visible' : 'hidden'}
 * // />
 */
export function useScrollReveal(options = {}) {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }
    const media = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = (event) => setReduced(event.matches)
    setReduced(media.matches)
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    }
    media.addListener(onChange)
    return () => media.removeListener(onChange)
  }, [])

  const { ref, inView } = useInView({
    ...DEFAULT_OPTIONS,
    ...options,
    skip: reduced || options.skip,
  })

  return { ref, inView: reduced || inView }
}

/**
 * Canonical framer-motion variant presets: the single, shared animation
 * vocabulary for reveal-on-scroll sections across the site. Exporting them here
 * (rather than redefining variants in every component) honors the reuse-first,
 * zero-duplication rule.
 *
 * They are plain objects in framer-motion's Variants shape, so this module has
 * no dependency on framer-motion itself, and consuming components pass them to
 * <motion.* variants={...}> and drive them with the inView flag returned by
 * useScrollReveal.
 *
 * @example
 * const { ref, inView } = useScrollReveal()
 * // <motion.div ref={ref} variants={fadeUp} initial="hidden"
 * //   animate={inView ? 'visible' : 'hidden'} />
 */

/** Fade in while translating up from a small vertical offset. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/** Simple opacity fade with no positional movement. */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

/**
 * Parent container that staggers the reveal of its children. Pair with child
 * elements that use the fadeUp or fadeIn variants.
 */
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

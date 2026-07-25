import { motion } from 'framer-motion'
import { cn } from '../../lib/cn.js'
import { useScrollReveal, prefersReducedMotion, fadeUp, staggerContainer } from '../../hooks/useScrollReveal.js'

/**
 * Timeline — CIBLE School of Language.
 *
 * A vertical, reveal-on-scroll timeline used to communicate an ordered sequence
 * of steps — for example the admission process ("Enquire → Counseling → Enrol")
 * or institute milestones. It renders a semantic ordered list with a single
 * connecting vertical line, a circular numbered/icon marker per step, and a
 * title + description for each entry.
 *
 * This component is intentionally DATA-AGNOSTIC: the consuming page supplies the
 * `items` array (admission steps, milestones, …), so the same primitive is
 * reused everywhere ordered sequences appear. It is NOT a card list — timeline
 * entries are lightweight text rows on a rail, so it deliberately does not use
 * the `ui/Card` surface.
 *
 * Animation (respecting reduced-motion):
 * - The reveal is driven by a SINGLE top-level `useScrollReveal()` call (the
 *   project's shared scroll-reveal hook), so the Rules of Hooks are satisfied
 *   and the effect is centralized. When the timeline scrolls into view (or
 *   immediately, if the user prefers reduced motion — the hook forces `inView`
 *   true and skips observation), the parent list transitions to its `visible`
 *   variant.
 * - The parent `<motion.ol>` uses the shared `staggerContainer` variant; each
 *   child `<motion.li>` uses the shared `fadeUp` variant with NO own
 *   `initial`/`animate`, so framer-motion propagates the variant label from the
 *   parent and staggers the children (a smooth top-to-bottom cascade).
 * - Reduced-motion is honored at the JavaScript layer (framer-motion drives
 *   inline transform/opacity tweens that the CSS `prefers-reduced-motion` reset
 *   in src/index.css cannot neutralize): the `<motion.ol>` is gated with
 *   `initial={reduce ? false : 'hidden'}` (via {@link prefersReducedMotion}) so
 *   it mounts DIRECTLY at its final state with no enter animation, and the
 *   site-wide `<MotionConfig reducedMotion="user">` in `src/App.jsx` is the
 *   global safety net (WCAG 2.3.3).
 *
 * Styling (Tailwind v4 `@theme` brand tokens from src/index.css — zero hardcoded
 * values; only native layout/spacing utilities and the exempt `white` color are
 * used directly):
 * - `border-l border-border` on the `<ol>` draws the single vertical rail, and
 *   `pl-8` (32px) reserves the gutter the markers sit in.
 * - Each marker is a `rounded-full` disc in `bg-primary-600` with `text-white`,
 *   absolutely centered on the rail (`-left-8 -translate-x-1/2`).
 * - Titles use `text-foreground`; descriptions use the lower-emphasis
 *   `text-muted` — both AA-contrast on white per the design system.
 * - `className` is merged LAST via `cn(...)`, so caller utilities win.
 *
 * Accessibility (WCAG AA):
 * - A real `<ol>`/`<li>` conveys the ordered sequence to assistive technology,
 *   so screen readers announce step order natively. The numeric/icon markers are
 *   therefore purely decorative and marked `aria-hidden="true"` to avoid double
 *   announcing the position.
 * - Each step title is an `<h3>`, intended to sit under a section `<h2>` on the
 *   host page, keeping the document outline logical.
 * - Any step icon is a decorative glyph inside the already-hidden marker; the
 *   textual title/description carry the meaning (color is never the sole signal).
 *
 * @param {object} props
 * @param {Array<{ title: string, description?: import('react').ReactNode, icon?: import('react').ElementType }>} [props.items=[]]
 *   Ordered steps. `title` labels the step (and is used as the React key);
 *   `description` is the supporting copy; `icon` is an OPTIONAL react-icons
 *   component reference rendered inside the marker (when omitted, the 1-based
 *   step number is shown instead).
 * @param {string} [props.className] Extra classes merged LAST onto the `<ol>`
 *   (e.g. width/max-width or spacing overrides).
 * @param {object} [props] Any other props (`id`, `aria-*`, data attributes, …)
 *   are forwarded to the root `<motion.ol>`.
 * @returns {import('react').ReactElement | null} The timeline list, or `null`
 *   when `items` is empty.
 */
export default function Timeline({ items = [], className, ...props }) {
  // Single, unconditional top-level hook (Rules of Hooks): drives the staggered
  // reveal and transparently respects prefers-reduced-motion.
  const { ref, inView } = useScrollReveal()
  // Synchronous, SSR-safe read of prefers-reduced-motion (plain helper, not a
  // hook — safe to call before the early return). When true the list mounts
  // with `initial={false}`: every step renders at its final state with no
  // fade-up/stagger reveal (WCAG 2.3.3).
  const reduce = prefersReducedMotion()

  // Nothing to render for an empty/undefined list — guard AFTER the hooks so
  // hook order stays stable across renders.
  if (!items?.length) return null

  return (
    <motion.ol
      ref={ref}
      variants={staggerContainer}
      initial={reduce ? false : 'hidden'}
      animate={inView ? 'visible' : 'hidden'}
      className={cn('relative flex flex-col gap-8 border-l border-border pl-8', className)}
      {...props}
    >
      {items.map((item, index) => {
        // react-icons component reference supplied by the item data (optional).
        // Capitalized so JSX renders it as a component; falls back to the number.
        const Icon = item.icon
        return (
          <motion.li key={item.title} variants={fadeUp} className="relative">
            <span
              className="absolute -left-8 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white"
              aria-hidden="true"
            >
              {Icon ? <Icon className="h-4 w-4" /> : index + 1}
            </span>
            <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}

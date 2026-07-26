import { useId } from 'react'
import CountUpModule from 'react-countup'
import { motion } from 'framer-motion'
import Container from '../ui/Container.jsx'
import { cn } from '../../lib/cn.js'
import { useScrollReveal, prefersReducedMotion, fadeUp, staggerContainer } from '../../hooks/useScrollReveal.js'
import stats from '../../data/stats.js'

// react-countup@6.5.3 is published as CommonJS (its default export IS the
// CountUp component). Vite's dependency pre-bundler (rolldown) emits the dep as
// `export default require_build()`, which surfaces the ENTIRE CJS
// `module.exports` object ({ __esModule, default: CountUp, useCountUp }) as this
// module's ESM default. A plain `import CountUp from 'react-countup'` therefore
// binds the wrapper OBJECT (not the function), and rendering <CountUp> throws
// "Element type is invalid … got: object", unmounting the tree. Normalize once
// at module scope: use the default import when it is already the component
// function, otherwise unwrap the nested `.default`. This is a no-op under
// correct CJS→ESM interop (Node SSR / production), so the component works
// identically across dev, build, and server rendering.
const CountUp = typeof CountUpModule === 'function' ? CountUpModule : CountUpModule?.default

/**
 * Statistics — the animated "achievement" counter bar for CIBLE School of
 * Language (AAP §0.6.3: the Home page places it directly after the Hero; it is
 * also reusable on the About page and other landing sections). It renders a
 * bold blue, full-width band of headline metrics — students trained, years of
 * excellence, expert faculty, courses offered — whose numbers count up from 0
 * the first time the bar scrolls into view, giving an immediate,
 * conversion-oriented trust signal.
 *
 * Composition & reuse (design-system rule: compose ONE canonical primitive,
 * never duplicate layout/markup):
 *  - Width & responsive gutters come from the shared {@link Container} primitive.
 *  - Class composition goes through the shared {@link cn} helper
 *    (clsx + tailwind-merge) so a caller-supplied `className` always wins on
 *    conflicting utilities.
 *  - Reveal + count-up gating comes from the shared {@link useScrollReveal} hook
 *    and the shared framer-motion variants ({@link staggerContainer} /
 *    {@link fadeUp}) — the single, site-wide animation vocabulary.
 *  - Content comes entirely from the `src/data/stats.js` single source of truth
 *    (overridable via the `items` prop for other sections or tests).
 *
 * Animation:
 *  - A single top-level `useScrollReveal()` call returns a callback `ref`
 *    (attached to the grid) and an `inView` flag. The `<motion.ul>` plays
 *    `staggerContainer` and each `<motion.li>` plays `fadeUp` when `inView`
 *    flips to true (the hook triggers once and then stops observing, so the
 *    numbers never re-animate on scroll-back).
 *  - Each number is a react-countup `<CountUp>` that is MOUNTED only once
 *    `inView` is true AND motion is allowed. Because react-countup's
 *    `startOnMount` defaults to true, mounting auto-starts the 0 → value count
 *    (2s duration, thousands grouped with a comma). Before reveal, a static
 *    "prefix + 0 + suffix" placeholder is rendered so the layout never shifts
 *    and the reveal is seamless (the mounted CountUp's first frame is the
 *    identical "…0…" string).
 *  - Under prefers-reduced-motion the reveal AND the count are both suppressed
 *    at the JavaScript layer (the CSS reduced-motion reset in src/index.css
 *    cannot stop react-countup's JS-driven tween): the `<motion.ul>` mounts with
 *    `initial={false}` (via {@link prefersReducedMotion}) and, instead of
 *    `<CountUp>`, each metric renders its STATIC final value directly (e.g.
 *    "5,000+") — so the numbers are present at once, never counting up (WCAG
 *    2.3.3). The site-wide `<MotionConfig reducedMotion="user">` in src/App.jsx
 *    is the additional global safety net.
 *
 * Styling — 100% token-driven (Tailwind v4 @theme tokens defined in
 * `src/index.css`); no hardcoded values (only the exempt
 * 0/auto/inherit/currentColor/transparent) and spacing on the project's 8px
 * scale (py-16/md:py-20 band padding, gap-8 grid gap, gap-2 within each item):
 *  - The band background is `bg-primary-700`. The design brief's shorthand
 *    "bg-primary" has no bare `--color-primary` token in this project (the theme
 *    defines numbered shades only), so it must resolve to a real numbered shade.
 *    The 700 shade is chosen (over the 600 brand anchor) because it is the deeper
 *    "bold blue band" the brief calls for AND it lifts BOTH the white numbers
 *    (~6.7:1) and the slightly dimmed white/90 labels (~5.7:1) clear of the WCAG
 *    AA 4.5:1 threshold — on primary-600 the white/90 labels land at ~4.5:1
 *    (borderline), so 700 guarantees an accessible label.
 *  - The metric icon is `text-secondary-400`, the bright brand orange that pops
 *    on the deep blue band. It is decorative (aria-hidden) and paired with the
 *    always-present text label, so color is never the sole carrier of meaning.
 *
 * Accessibility (WCAG AA):
 *  - The band is a labelled landmark: the `<section>` carries `aria-labelledby`
 *    pointing at an `sr-only` `<h2>` (a `useId()`-generated id keeps it unique
 *    even if the band is used more than once on a page), so assistive technology
 *    announces the region by name and it appears in the heading outline, without
 *    adding a visible heading that would alter the premium counter-bar design.
 *  - The metrics are a semantic list (`<ul>`/`<li>`), so assistive technology
 *    announces the group and its item count.
 *  - Icons are purely decorative and removed from the accessibility tree with
 *    `aria-hidden`, avoiding redundant announcements.
 *  - The count-up is a visual-only effect: the rendered value is real text
 *    content, so a screen reader reads the final number (e.g. "5,000+"), never
 *    an animation.
 *
 * @param {object} props
 * @param {string} [props.heading='By the numbers'] Accessible name for the band.
 *   Rendered into an `sr-only` `<h2>` and referenced by the section's
 *   `aria-labelledby`; override it when a page needs a more specific label.
 * @param {Array<{
 *   label: string,
 *   value: number,
 *   suffix?: string,
 *   prefix?: string,
 *   icon?: import('react-icons').IconType,
 * }>} [props.items=stats] Metrics to render; defaults to the `src/data/stats.js`
 *   single source of truth. Each `value` must be a plain number so react-countup
 *   can animate 0 → value.
 * @param {string} [props.className] Extra classes merged LAST via {@link cn}, so
 *   a caller can extend or override the band styling (for example, swap the
 *   background on a differently themed section).
 * @returns {import('react').ReactElement} The statistics band `<section>`.
 */
function Statistics({ items = stats, heading = 'By the numbers', className, ...props }) {
  // Single, unconditional, top-level hook (satisfies react/rules-of-hooks):
  // `ref` is a callback ref attached to the grid; `inView` gates BOTH the
  // framer-motion reveal and the mounting of the count-up numbers.
  const { ref, inView } = useScrollReveal()
  // Synchronous, SSR-safe read of prefers-reduced-motion (plain helper, not a
  // hook). It gates BOTH motion sources here: (1) the framer-motion reveal is
  // mounted with `initial={false}`, and (2) the react-countup 0→value tween is
  // replaced by a STATIC final value — a JS-driven count that the CSS
  // reduced-motion reset in src/index.css cannot neutralize (WCAG 2.3.3).
  const reduce = prefersReducedMotion()
  // Collision-safe id linking the section's accessible name to its sr-only
  // heading, so the band stays a properly labelled landmark even when rendered
  // more than once on a page (Home + About). Top-level hook — rules-of-hooks OK.
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className={cn('bg-primary-700 py-16 text-white md:py-20', className)}
      {...props}
    >
      <Container>
        {/* Visually hidden but AT- and outline-visible section name (m06). */}
        <h2 id={headingId} className="sr-only">
          {heading}
        </h2>
        <motion.ul
          ref={ref}
          variants={staggerContainer}
          initial={reduce ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-8 text-center md:grid-cols-4"
        >
          {items.map((stat) => {
            // react-icons component reference from the data module (optional).
            // Captured in a Capitalized local so JSX renders it as a component.
            const Icon = stat.icon

            // The final, formatted number as plain text (thousands grouped with
            // a comma to match react-countup's `separator=","`, e.g. "5,000+").
            const finalValue = `${stat.prefix || ''}${stat.value.toLocaleString('en-US')}${stat.suffix || ''}`

            // Choose the number's rendering by motion policy:
            //  - reduced motion  → the static final value (NO count tween);
            //  - in view (motion) → the animated <CountUp> 0 → value;
            //  - before reveal    → a static "prefix + 0 + suffix" placeholder so
            //    the layout never shifts (CountUp's first frame is identical).
            let number
            if (reduce) {
              number = finalValue
            } else if (inView) {
              number = (
                <CountUp
                  end={stat.value}
                  duration={2}
                  separator=","
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              )
            } else {
              number = `${stat.prefix || ''}0${stat.suffix || ''}`
            }

            return (
              <motion.li key={stat.label} variants={fadeUp} className="flex flex-col items-center gap-2">
                {Icon ? <Icon className="h-8 w-8 text-secondary-400" aria-hidden="true" /> : null}

                <span className="text-3xl font-bold md:text-4xl">{number}</span>

                <span className="text-sm font-medium text-white/90">{stat.label}</span>
              </motion.li>
            )
          })}
        </motion.ul>
      </Container>
    </section>
  )
}

export default Statistics

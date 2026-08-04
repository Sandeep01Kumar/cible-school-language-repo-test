import CountUpModule from 'react-countup'
import { useReducedMotion } from '../../hooks/useScrollReveal.js'
import { cn } from '../../lib/cn.js'

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
 * StatCounter — the single, canonical renderer for one animated headline number
 * (AAP §0.6.1 / §0.5.3). It owns count-up behaviour and nothing else, so the
 * repository has exactly ONE implementation of numeric formatting, activation
 * gating and reduced-motion output.
 *
 * Consumers and the ownership boundary (AAP §0.5.1 "single ownership"): the
 * count-up band in {@link Statistics} passes `active={inView}` from its shared
 * scroll-reveal hook, and the above-the-fold proof row in {@link Hero} relies on
 * the `active` default because the Hero is deliberately observer-free to protect
 * LCP. This component therefore renders ONLY the number: no label, no icon, no
 * list item, no heading and no spacing — every one of those belongs to the
 * consumer, which wraps StatCounter in its own sized/coloured element. The root
 * is a plain inline `<span>` so it nests cleanly inside that wrapper.
 *
 * This extraction is the reason the file exists: without it, Hero would have to
 * copy Statistics' formatting, zero-placeholder, reduced-motion and CommonJS
 * interop logic. `react-countup` is consequently imported by exactly one module
 * in the whole repository — this one (see the module-scope normalization above,
 * which is load-bearing under Vite/rolldown, not decoration).
 *
 * Three rendering branches — and only three:
 *  1. Reduced motion → the STATIC final value, rendered at once with no tween.
 *  2. Active and motion allowed → a `<CountUp>` that mounts and, because
 *     react-countup's `startOnMount` defaults to true, auto-starts the 0 → value
 *     count (thousands grouped with a comma).
 *  3. Not yet active → a static "prefix + 0 + suffix" placeholder. CountUp's
 *     first frame is that identical string, so the handover when `active` flips
 *     is seamless: no flash and no reflow.
 *
 * Reduced-motion contract: the preference is read through the shared LIVE
 * {@link useReducedMotion} hook rather than the one-shot `prefersReducedMotion`
 * reader, so toggling the OS/browser setting WHILE the component is mounted
 * swaps a running tween for the final value instead of leaving the count stuck
 * with the value read on first paint. The CSS reduced-motion reset in
 * src/index.css cannot neutralize a JS-driven tween, so this JavaScript layer is
 * what actually satisfies WCAG 2.3.3 for the counter.
 *
 * Accessibility (WCAG AA) — exactly ONE accessible node per counter: a number
 * that animates would otherwise be re-announced on every frame, flooding a
 * screen reader. The visible output (static or counting) is always removed from
 * the accessibility tree with `aria-hidden`, and it is always paired with a
 * single `sr-only` span carrying the FINAL formatted value. That structure is
 * identical in all three branches, so assistive technology hears the end value
 * once and never an intermediate frame. No live region is used anywhere: the
 * final value is static text, so there is nothing to politely announce.
 *
 * Styling: the component ships one utility, `tabular-nums`, so every digit has
 * the same advance width and the number does not jitter as it counts. It is
 * applied to the root and inherited by the visible output (`font-variant-numeric`
 * is an inherited property). Colour, size and weight are the consumer's concern;
 * `className` is merged LAST through {@link cn} so a caller's utility always
 * wins on conflict.
 *
 * @param {object} props
 * @param {number} props.value Required plain number to count up to and to format
 *   as the final value. `src/data/stats.js` and `src/data/heroProof.js` both
 *   guarantee a plain number, so no coercion is performed here.
 * @param {string} [props.prefix] Optional text rendered immediately before the
 *   number (for example a currency mark). Absent values render as "" — never
 *   "undefined".
 * @param {string} [props.suffix] Optional text rendered immediately after the
 *   number (for example "+" or "%"). Absent values render as "" — never
 *   "undefined".
 * @param {boolean} [props.active=true] Whether the count may run. Pass the
 *   caller's own in-view flag to defer the count until the number is on screen
 *   (Statistics does); leave it at the default for always-visible, above-the-fold
 *   counters (Hero does). It arrives as a plain boolean because the viewport
 *   observer stays encapsulated inside `useScrollReveal`, never imported here.
 * @param {number} [props.duration=2] Count duration in seconds. The default
 *   preserves the band's established 2-second count so neither consumer has to
 *   pass it.
 * @param {string} [props.className] Extra classes merged LAST via {@link cn}, so
 *   a caller can extend or override the numeral styling.
 * @returns {import('react').ReactElement} The rendered counter.
 */
function StatCounter({ value, prefix, suffix, active = true, duration = 2, className }) {
  // Single, unconditional, top-level hook (satisfies react/rules-of-hooks —
  // there is deliberately no early return above this line). Live subscription,
  // so an OS preference change while mounted re-renders with the new value.
  const reduced = useReducedMotion()

  // The final, formatted number as plain text. Thousands are grouped with a
  // comma to match react-countup's `separator=","` character for character (e.g.
  // "5,000+"), and the `|| ''` guards keep an absent prefix/suffix from
  // rendering the string "undefined".
  const finalValue = `${prefix || ''}${value.toLocaleString('en-US')}${suffix || ''}`

  // Choose the visible output by motion policy and activation. These are the
  // only three states this component has.
  let visible
  if (reduced) {
    visible = finalValue
  } else if (active) {
    visible = (
      <CountUp end={value} duration={duration} separator="," prefix={prefix} suffix={suffix} />
    )
  } else {
    visible = `${prefix || ''}0${suffix || ''}`
  }

  return (
    <span className={cn('tabular-nums', className)}>
      {/* Visual output only. Hidden from assistive technology so a counting
          number is never announced frame by frame. */}
      <span aria-hidden="true">{visible}</span>
      {/* The single accessible node: the end value, announced exactly once. */}
      <span className="sr-only">{finalValue}</span>
    </span>
  )
}

export default StatCounter

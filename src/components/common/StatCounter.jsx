import CountUpModule from 'react-countup'
import { useReducedMotion } from '../../hooks/useScrollReveal.js'
import { cn } from '../../lib/cn.js'

// react-countup is published as CommonJS, so a default import can bind either
// the CountUp component itself or the whole `module.exports` wrapper object
// ({ __esModule, default: CountUp, useCountUp }) — which shape arrives depends on
// how the toolchain performs the CJS→ESM interop. Rendering the wrapper object
// throws "Element type is invalid … got: object" and unmounts the tree, so both
// shapes are normalized once here: keep the default import when it is already the
// component function, otherwise unwrap the nested `.default`.
const CountUp = typeof CountUpModule === 'function' ? CountUpModule : CountUpModule?.default

// Count duration bounds, in seconds. `duration` is a PUBLIC prop, and countup.js
// turns whatever it receives into `Number(duration) * 1000` and then keeps
// scheduling a requestAnimationFrame for as long as `progress < duration`: a
// non-finite duration would therefore never terminate (an animation frame per
// frame, forever) and an oversized one would keep per-frame work running long
// after anyone has stopped reading the number. The value is bounded here so the
// reusable API cannot schedule unbounded work, whatever a future caller passes.
const DEFAULT_COUNT_DURATION = 2
const MAX_COUNT_DURATION = 10

/**
 * Clamp a caller-supplied count duration to a finite, bounded number of seconds.
 *
 * @param {number} duration Requested duration in seconds.
 * @returns {number} `duration` when it is a finite, non-negative number no
 *   larger than {@link MAX_COUNT_DURATION}; {@link MAX_COUNT_DURATION} when it
 *   is finite but larger; otherwise {@link DEFAULT_COUNT_DURATION} (which also
 *   covers `Infinity`, `NaN` and any non-numeric value).
 */
function normalizeCountDuration(duration) {
  if (!Number.isFinite(duration) || duration < 0) {
    return DEFAULT_COUNT_DURATION
  }
  return Math.min(duration, MAX_COUNT_DURATION)
}

/**
 * StatCounter — the canonical renderer for one animated headline number.
 *
 * It renders ONLY the number: label, icon, list item, heading and spacing all
 * belong to the consumer that wraps it, and the root stays an inline-level
 * `<span>` so it nests cleanly inside that wrapper.
 *
 * Three rendering branches, and only three:
 *  1. Reduced motion → the STATIC final value, with no tween.
 *  2. Active and motion allowed → the `prefix`/`suffix` text plus a `<CountUp>`
 *     that auto-starts the 0 → value count on mount (react-countup's
 *     `startOnMount` defaults to true) over a bounded duration.
 *  3. Not yet active → a static "prefix + 0 + suffix" placeholder. `start={0}`
 *     makes the composed first frame of branch 2 that identical string, so the
 *     handover when `active` flips is seamless: no flash and no reflow.
 * The static branches format with `value.toLocaleString('en-US')`, which matches
 * CountUp's `separator=","` character for character (e.g. "5,000+"), so no branch
 * can render a differently formatted number.
 *
 * Security contract — the affixes never reach the counting library: countup.js
 * concatenates prefix + number + suffix and writes the result to the target
 * element's `innerHTML`, which would turn an affix into live markup and bypass
 * React's escaping (CWE-79). `<CountUp>` is therefore given ONLY the numeric
 * `start`/`end`, the bounded `duration` and the fixed separator, so nothing but
 * digits and separators can come out of it, while `prefix` and `suffix` are
 * rendered as ordinary React children that React escapes as text. The visible
 * string is unchanged, no HTML is ever required, and no sanitizer is needed.
 *
 * Reduced motion is read through the shared LIVE {@link useReducedMotion} hook
 * rather than the one-shot `prefersReducedMotion` reader, so toggling the
 * OS/browser setting WHILE the component is mounted swaps a running tween for the
 * final value instead of leaving the count stuck with the value read on first
 * paint. The CSS reduced-motion reset in src/index.css cannot neutralize a
 * JS-driven tween, so this JavaScript layer is what satisfies WCAG 2.3.3 here.
 *
 * Accessibility (WCAG AA): every visual layer — the output itself, static or
 * counting, and the sizing layer described below — is always `aria-hidden`, and
 * they are paired with a single `sr-only` span carrying the final formatted
 * value. That structure is identical in all three branches, so assistive
 * technology is exposed to exactly one stable value per counter rather than a
 * changing one. No live region is used; the accessible value is static text.
 *
 * Layout stability (Core Web Vitals / CLS): `tabular-nums` equalises DIGIT
 * widths, but it cannot equalise STRING lengths — "0+" is narrower than
 * "5,000+", so a counter that rendered only the current value would widen as it
 * counted and reflow whatever sits beside it. The `sr-only` label cannot absorb
 * that: it is absolutely positioned and contributes no width. The root is
 * therefore an `inline-grid` stacking two layers in ONE cell
 * (`col-start-1 row-start-1`): the visible output, and an `invisible` copy of the
 * FINAL value which is hidden from view yet still measured by layout. The cell —
 * and so this component's intrinsic width — is the final value's width from the
 * very first frame, in all three branches, which keeps the box rock-steady
 * through the whole count and on an above-the-fold LCP path. Both layers stretch
 * across the shared cell, so the CONSUMER's own `text-align` still positions the
 * numerals.
 *
 * Styling: the component ships only the layout and numeral utilities above.
 * `tabular-nums` sits on the root and is inherited by the visible output
 * (`font-variant-numeric` is an inherited property). Colour, size and weight are
 * the consumer's concern; `className` is merged LAST through {@link cn} so a
 * caller's utility always wins.
 *
 * @param {object} props
 * @param {number} props.value Required plain number to count up to and to format
 *   as the final value; no coercion is performed here.
 * @param {string} [props.prefix] Optional text rendered immediately before the
 *   number. Rendered as an escaped React text node, never passed to
 *   react-countup (see the security contract above). Absent values render as ""
 *   — never "undefined".
 * @param {string} [props.suffix] Optional text rendered immediately after the
 *   number (for example "+" or "%"). Rendered as an escaped React text node,
 *   never passed to react-countup (see the security contract above). Absent
 *   values render as "" — never "undefined".
 * @param {boolean} [props.active=true] Whether the count may run. Pass an in-view
 *   flag to defer the count until the number is on screen; leave the default for
 *   always-visible counters. It arrives as a plain boolean because the viewport
 *   observer stays encapsulated inside `useScrollReveal`, never imported here.
 * @param {number} [props.duration=2] Count duration in seconds. Bounded by
 *   {@link normalizeCountDuration} before it reaches CountUp, so the animation is
 *   always finite and never longer than {@link MAX_COUNT_DURATION} seconds.
 * @param {string} [props.className] Extra classes merged LAST via {@link cn}, so
 *   a caller can extend or override the numeral styling.
 * @returns {import('react').ReactElement} The rendered counter.
 */
function StatCounter({
  value,
  prefix,
  suffix,
  active = true,
  duration = DEFAULT_COUNT_DURATION,
  className,
}) {
  const reduced = useReducedMotion()

  const finalValue = `${prefix || ''}${value.toLocaleString('en-US')}${suffix || ''}`

  let visible
  if (reduced) {
    visible = finalValue
  } else if (active) {
    // SECURITY (CWE-79, DOM XSS): `prefix` and `suffix` are NEVER handed to
    // react-countup. countup.js builds "prefix + number + suffix" in its
    // formatting function and assigns that string to `element.innerHTML` (its
    // printValue writes textContent only for <input>/<text>/<tspan>, and
    // react-countup renders a plain <span>), so any markup inside an affix
    // would be parsed as HTML and escape React's text escaping. CountUp
    // therefore receives ONLY the numeric `start`/`end`, the bounded `duration`
    // and the fixed separator — its output can contain nothing but digits and
    // separators. The affixes stay React children, which React always renders as
    // escaped text, so the composed string is byte-identical (e.g. "5,000" +
    // "+") while being inert. This is why the component needs no HTML sanitizer.
    //
    // `start={0}` is load-bearing, not decoration: react-countup renders
    // `formattingFn(props.start)` as CountUp's own first frame ONLY when `start`
    // is defined, and an EMPTY string otherwise. Without it the counter's first
    // painted frame is blank — a visible collapse for always-active counters and
    // a "0 → blank → count" flicker on the deferred handover. With it that frame
    // is "0", which the sibling affixes compose into prefix + 0 + suffix:
    // character for character the placeholder rendered by the branch below.
    visible = (
      <>
        {prefix || ''}
        <CountUp
          start={0}
          end={value}
          duration={normalizeCountDuration(duration)}
          separator=","
        />
        {suffix || ''}
      </>
    )
  } else {
    visible = `${prefix || ''}0${suffix || ''}`
  }

  return (
    <span className={cn('inline-grid tabular-nums', className)}>
      {/* Transient visual output is hidden from assistive technology; the
          adjacent sr-only node exposes the stable final value. */}
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {visible}
      </span>
      {/* Sizing layer: same grid cell, so it reserves the FINAL value's width
          from the first frame and the box never widens as the number counts.
          `invisible` keeps it measured by layout but unpainted, and it is hidden
          from assistive technology so the counter still exposes exactly one
          accessible node. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {finalValue}
      </span>
      <span className="sr-only">{finalValue}</span>
    </span>
  )
}

export default StatCounter

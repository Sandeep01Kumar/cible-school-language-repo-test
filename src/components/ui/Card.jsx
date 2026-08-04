import { cn } from '../../lib/cn.js'

/**
 * Card
 *
 * THE single canonical content-card surface for the CIBLE School of Language
 * SPA. Every card in the product — course cards, faculty cards, review cards,
 * blog/event cards, feature cards, statistic tiles, form panels, etc. — is
 * built by composing this primitive. Never restyle a raw <div> as a card
 * elsewhere; always compose <Card> so the brand surface stays consistent
 * (design system: `bg-white rounded-2xl shadow-sm hover:shadow-md`).
 *
 * The base surface is intentionally neutral (a rounded, white, hairline-bordered
 * panel with soft padding and a subtle shadow that deepens on hover). It bakes
 * in NO use-case-specific typography or spacing — callers compose their own
 * children (heading, body, footer, buttons, media) inside.
 *
 * Styling (Tailwind v4 `@theme` tokens from src/index.css — zero hardcoded
 * values):
 * - `rounded-2xl`   → --radius-2xl (1.25rem) rounded corners.
 * - `border border-border` → 1px hairline in --color-border (slate-200) so the
 *   surface reads crisply on white-on-white and neutral `surface` sections.
 * - `bg-white`      → white card fill.
 * - `p-6`           → 24px padding (8px spacing scale).
 * - `shadow-sm` → `hover:shadow-md` → soft shadow (--shadow-sm/--shadow-md)
 *   that deepens on hover. Hover is signalled by SHADOW, not color, so it does
 *   not rely on color alone and text contrast is unaffected (WCAG).
 * - `transition-shadow duration-200` → smooth 200ms hover micro-interaction.
 *
 * Opt-in hover lift (`lift`, default OFF): raises the card 4px
 * (`hover:-translate-y-1`) and deepens it to the interactive elevation step
 * (`hover:shadow-lg` → --shadow-lg), both eased over the base `duration-200`.
 * This is the single home for that micro-interaction, so a browsable marketing
 * card opts in with `<Card lift>` rather than re-declaring the hover classes.
 * - The lift swaps the base `transition-shadow` for the BARE `transition`
 *   utility because tailwind-merge keeps only the LAST `transition-*` class
 *   (they all share one conflict group). `transition` covers `translate` AND
 *   `box-shadow`, so the raise and the shadow animate together instead of one
 *   of them snapping. Do not reintroduce `transition-transform` here.
 * - `motion-reduce:transform-none motion-reduce:hover:translate-none` cancel
 *   the raise for reduced-motion users (WCAG 2.3.3). Both are required: the
 *   global reduced-motion reset in index.css only clamps animation/transition
 *   DURATION and never resets a transform, and Tailwind v4 renders
 *   `hover:-translate-y-1` via the `translate` property, so the opt-out must
 *   also match the `hover:` variant to win on selector specificity.
 * - Default OFF is deliberate: <ReviewCard> renders inside a Swiper carousel,
 *   where a hover transform can jitter a slide mid-transition, and
 *   src/pages/Career.jsx and src/pages/Contact.jsx compose <Card> directly as
 *   static information panels. Those stay stationary — and keep the plain
 *   `hover:shadow-md` affordance — simply by not passing `lift`.
 *
 * Override contract: `className` is merged LAST via `cn(...)` (clsx +
 * tailwind-merge), so caller-supplied utilities always win over the base. For
 * example an image-topped card can pass `className="p-0 overflow-hidden"` to
 * drop the default padding and clip the media to the rounded corners.
 *
 * Accessibility: this is a structural surface. Use the polymorphic `as` prop to
 * pick the correct semantics (e.g. `as="article"` for a self-contained card,
 * `as="li"` inside a list). It intentionally adds NO click semantics — if a
 * whole card must be actionable, compose an interactive <Button>/<a>/<Link>
 * inside it (or pass appropriate role/handlers via `...props`), so keyboard and
 * screen-reader behaviour remain correct.
 *
 * @param {object} props
 * @param {import('react').ElementType} [props.as='div'] Element/component to
 *   render as the card root (e.g. `'div'`, `'article'`, `'li'`).
 * @param {boolean} [props.lift=false] Opt in to the hover lift (4px raise plus
 *   `shadow-lg`). Purely visual — it adds no click semantics — and it stays off
 *   for static panels and for any card rendered inside a carousel.
 * @param {string} [props.className] Extra classes merged LAST (override the base).
 * @param {import('react').ReactNode} [props.children] Card content.
 * @param {object} [props] Any other props (`id`, `aria-*`, `onClick`, `style`,
 *   data attributes, …) are forwarded to the rendered root element.
 * @returns {import('react').ReactElement} The rendered card surface.
 */
function Card({ as: Component = 'div', lift = false, className, children, ...props }) {
  return (
    <Component
      className={cn(
        'rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md',
        lift &&
          'transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:hover:translate-none',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card

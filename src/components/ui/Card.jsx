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
 * @param {string} [props.className] Extra classes merged LAST (override the base).
 * @param {import('react').ReactNode} [props.children] Card content.
 * @param {object} [props] Any other props (`id`, `aria-*`, `onClick`, `style`,
 *   data attributes, …) are forwarded to the rendered root element.
 * @returns {import('react').ReactElement} The rendered card surface.
 */
function Card({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component
      className={cn(
        'rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card

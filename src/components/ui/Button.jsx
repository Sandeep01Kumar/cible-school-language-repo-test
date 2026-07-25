import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn.js'

/**
 * Button — the single canonical, polymorphic button for the CIBLE School of
 * Language SPA (AAP §0.6.1 Group 6). It is reused everywhere: the Navbar
 * "Admission" CTA and click-to-call action, every page's CTASection, the Hero
 * dual CTAs, cards, form submit controls, and the floating / sticky conversion
 * widgets. There must be exactly ONE button implementation in the codebase —
 * always compose this component, never fork a second one.
 *
 * Polymorphic rendering (precedence: `to` > `href` > native `<button>`):
 *   • `to`   → a react-router <Link> for internal SPA navigation (client-side).
 *   • `href` → a semantic <a>. External http(s) URLs (including the WhatsApp
 *              deep link https://wa.me/919899315093) open in a new tab with
 *              rel="noopener noreferrer". Non-http schemes such as
 *              tel:+919899315093 and mailto: are treated as in-place navigation
 *              (no target="_blank") so the device dialer / mail client opens
 *              directly.
 *   • otherwise → a semantic <button> with an explicit `type` (default
 *              'button') and native `disabled` support.
 *
 * Styling is entirely token-driven (Tailwind v4 @theme tokens defined in
 * src/index.css) — every color, radius, spacing and size resolves to a design
 * token or utility, with no hardcoded values. The blue / orange / green fills
 * are locked to WCAG-AA-compliant shades: white text is used ONLY on
 * primary-600, secondary-700 (hover -800) and accent-700 (hover -800); the
 * `outline` variant renders primary-600 text on a transparent surface with a
 * primary-50 hover tint. (secondary-600 = #ea580c is only ~3.56:1 under white
 * text and fails AA, so the secondary fill starts at -700 = #c2410c ≈ 5.18:1.)
 * Sizes sit on the 8px scale — md (44px) and lg (48px)
 * meet the WCAG touch-target guideline; sm (36px) is for compact contexts.
 *
 * Accessibility: a semantic element is rendered for every usage (never a
 * clickable <div>); a visible :focus-visible ring is exposed on all three
 * renderings via the shared base classes; and arbitrary props (onClick,
 * aria-*, etc.) are forwarded. When a button contains only an icon, the caller
 * MUST pass an `aria-label` (forwarded via `...props`) so the control has an
 * accessible name.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'accent'|'outline'} [props.variant='primary'] Visual style.
 * @param {'sm'|'md'|'lg'} [props.size='md'] Control height / padding on the 8px scale.
 * @param {string} [props.to] Internal route path → renders a react-router <Link>.
 * @param {string} [props.href] URL → renders an <a>; external http(s) opens in a new tab.
 * @param {'button'|'submit'|'reset'} [props.type='button'] Native type (native <button> only).
 * @param {string} [props.className] Extra classes, merged LAST so callers can override.
 * @param {import('react').ReactNode} [props.children] Button content (label and/or icon).
 * @param {boolean} [props.disabled=false] Disables the native <button>.
 * @returns {import('react').ReactElement} A <Link>, <a>, or <button> styled per variant/size.
 */

// Shared, always-applied classes: layout, shape, typography, motion, the
// keyboard focus ring, and the disabled treatment. Module-local (not exported)
// so the file exposes only the Button component (react/only-export-components).
const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

// Variant fills — locked to AA-compliant shades (see the WCAG note above and
// the guidance block in src/index.css). Do NOT substitute lighter shades
// (secondary-500 / secondary-600 / accent-600) under white text; they fail AA
// for normal text (secondary-600 = #ea580c is only ~3.56:1, secondary-700 =
// #c2410c ≈ 5.18:1).
const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-secondary-700 text-white hover:bg-secondary-800',
  accent: 'bg-accent-700 text-white hover:bg-accent-800',
  outline: 'border-2 border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50',
}

// Size steps on the 8px scale. md/lg satisfy the 44px touch-target guideline.
const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-12 px-8 text-lg',
}

function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  className,
  children,
  disabled = false,
  ...props
}) {
  // Compose base + variant + size, then merge the caller's className LAST so it
  // can override any preceding utility. Unknown variant/size fall back to the
  // primary / md defaults so the button always renders a styled control.
  const classes = cn(base, variants[variant] || variants.primary, sizes[size] || sizes.md, className)

  // Internal SPA navigation takes precedence: render a client-side <Link>.
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  // External / protocol links render a semantic <a>. Only http(s) URLs are
  // "external" and open in a new tab (with rel="noopener noreferrer" for
  // security). tel:, mailto: and other schemes open in place so the native
  // handler (dialer, mail client) launches directly.
  if (href) {
    const isExternal = /^https?:\/\//.test(href)
    const externalProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} className={classes} {...externalProps} {...props}>
        {children}
      </a>
    )
  }

  // Default: a real <button>. `type` and `disabled` apply only here.
  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button

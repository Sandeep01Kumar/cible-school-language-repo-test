import { cn } from '../../lib/cn.js'

/**
 * Badge
 *
 * The single canonical pill / label primitive for the CIBLE School of Language
 * SPA. Use it everywhere a short, non-interactive descriptor is needed — course
 * categories and tags, "New" / "Popular" markers, faculty specialties, event
 * types, etc. Reuse this component rather than restyling a raw <span>, so every
 * label stays visually and semantically consistent (project reuse-first rule).
 *
 * Design system (Tailwind CSS v4 `@theme` tokens defined in src/index.css):
 * - Shape/type are fixed by `base`: a fully rounded pill (`rounded-full`) with an
 *   8px-scale gutter (`px-4 py-2` = 16px / 8px) and small, semibold label text
 *   (`text-xs font-semibold`). Icon + text children align via `inline-flex
 *   items-center gap-2` (8px). Every spacing value is an even step on the 8px
 *   scale — no 4px/12px half-steps, no hardcoded or arbitrary values.
 * - Color is chosen by `variant` from the module-local `variants` map. Each pairing
 *   is a LIGHT brand-scale fill (`-50`) with DARK brand-scale text (`-700`), or the
 *   neutral surface with the standard foreground. This "dark text on light fill"
 *   direction is deliberately AA-compliant for normal-size text (>= 4.5:1); we never
 *   put white text on a light fill.
 *
 * Accessibility:
 * - A Badge is labeling / decorative text: meaning is carried by its readable
 *   `children`, never by color alone (project WCAG AA rule). When a Badge is used
 *   purely as a status signal whose text is not self-explanatory, the caller can
 *   forward an `aria-label` (or any ARIA attribute) through `...props`.
 * - The element is a non-interactive <span>; it receives no hover/focus states and
 *   is not keyboard-focusable by design.
 *
 * Composition:
 * - `className` is merged LAST through `cn()` (clsx + tailwind-merge), so any
 *   utility a caller passes deterministically overrides the matching base/variant
 *   utility (e.g. passing `bg-primary-100` supersedes the variant's `bg-primary-50`).
 * - All other props are forwarded to the underlying <span> (`title`, `id`,
 *   `data-*`, `aria-*`, event handlers, …).
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'accent'|'neutral'} [props.variant='primary']
 *   Color scheme. Unknown values fall back to `'primary'`.
 * @param {string} [props.className] Extra classes, merged last (wins on conflict).
 * @param {import('react').ReactNode} [props.children] The visible label content.
 * @returns {import('react').ReactElement} A styled, non-interactive <span> pill.
 */

// Fixed shape + typography shared by every variant (module-local; not exported so
// `react/only-export-components` stays clean).
const base = 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold'

// Variant → color utilities. Light token fill (`-50` / surface-muted) paired with
// dark token text (`-700` / foreground) for WCAG AA contrast (module-local).
const variants = {
  primary: 'bg-primary-50 text-primary-700',
  secondary: 'bg-secondary-50 text-secondary-700',
  accent: 'bg-accent-50 text-accent-700',
  neutral: 'bg-surface-muted text-foreground',
}

function Badge({ variant = 'primary', className, children, ...props }) {
  return (
    <span className={cn(base, variants[variant] || variants.primary, className)} {...props}>
      {children}
    </span>
  )
}

export default Badge

import { FaPhone } from 'react-icons/fa'
import { siteConfig } from '../../data/siteConfig.js'
import { cn } from '../../lib/cn.js'

/**
 * FloatingCall — the persistent, always-visible click-to-call floating action
 * button (FAB) for the CIBLE School of Language SPA (AAP §0.6.1 Group 8). It is
 * rendered once by the layout shell (src/components/layout/Layout.jsx) alongside
 * FloatingWhatsApp and the mobile StickyBottomCTA, keeping the phone dialer one
 * tap away on every route — directly serving the AAP conversion rule "Display
 * WhatsApp and Call actions prominently on mobile."
 *
 * Behaviour: an icon-only semantic anchor whose href is the `tel:` deep link
 * read from siteConfig (the siteConfig.phoneHref `tel:` deep link). The number
 * is NEVER hardcoded here — it flows from the single source of truth in
 * src/data/siteConfig.js so brand/contact changes propagate automatically.
 * Because a `tel:` scheme is NOT an http(s) URL, it is treated as in-place
 * navigation (the anchor opens no new tab and carries no rel) so the device
 * dialer opens directly — matching the non-external rule in the shared Button
 * primitive.
 *
 * Positioning & non-overlap contract (VALIDATION-CRITICAL — coordinated with
 * FloatingWhatsApp + StickyBottomCTA):
 *   • DESKTOP-ONLY (`hidden lg:flex`). Below `lg` the mobile StickyBottomCTA bar
 *     already surfaces Call / WhatsApp / Admission, so these FABs render ONLY at
 *     `>= lg` (where the sticky bar is hidden). This removes the mobile FAB
 *     stack that covered and mis-triggered underlying controls (QA Issue 1).
 *   • This FAB sits directly ABOVE FloatingWhatsApp so the two never overlap:
 *     bottom-28 (112px) vs the WhatsApp FAB at bottom-6 (24px → occupies 24→80px),
 *     leaving a ~32px gap. The right gutter (right-6) matches the WhatsApp FAB so
 *     they align vertically.
 *   • z-40 keeps the FAB above page content but below the z-50 nav drawer.
 *   • Sizing is h-14 w-14 (56px) and MUST stay identical to FloatingWhatsApp —
 *     the stacked bottom offsets above are derived from this height. If either
 *     FAB's size changes, both FABs' offsets must be re-derived together.
 *   • Collision-aware suppression: Layout passes `suppressed` when the footer is
 *     in view so the FAB fades out and leaves the tab order rather than covering
 *     the footer's content (QA Issue 1).
 *
 * Styling is fully token-driven (Tailwind v4 @theme tokens in src/index.css):
 * brand-blue fill bg-primary-600 → hover bg-primary-700 with white icon
 * (contrast ≈ 5.17:1, passing WCAG AA for non-text/UI), rounded-full, soft
 * shadow, and a transition. No hardcoded or arbitrary values are used.
 *
 * Accessibility (WCAG AA): the control is icon-only, so it carries an explicit
 * accessible name via aria-label="Call CIBLE"; the decorative FaPhone glyph is
 * hidden from assistive tech with aria-hidden="true"; a visible keyboard focus
 * ring is exposed via :focus-visible; the 56px hit area exceeds the 44px
 * touch-target guideline; and when `suppressed` the control is removed from the
 * accessibility tree + tab order (`aria-hidden` + `tabIndex={-1}` +
 * `pointer-events-none`).
 *
 * @param {object} [props]
 * @param {boolean} [props.suppressed=false] When true, the FAB fades out and is
 *   removed from the tab order + accessibility tree (Layout sets this while the
 *   footer is in view so the FAB never covers footer content).
 * @returns {import('react').ReactElement} A fixed-position <a> click-to-call FAB.
 */
function FloatingCall({ suppressed = false }) {
  return (
    <a
      href={siteConfig.phoneHref}
      aria-label="Call CIBLE"
      aria-hidden={suppressed ? 'true' : undefined}
      tabIndex={suppressed ? -1 : undefined}
      className={cn(
        'fixed bottom-28 right-6 z-40 hidden lg:flex',
        'h-14 w-14 items-center justify-center rounded-full',
        'bg-primary-600 text-white shadow-lg transition-all duration-200 hover:bg-primary-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
        suppressed && 'pointer-events-none opacity-0',
      )}
    >
      <FaPhone aria-hidden="true" className="h-6 w-6" />
    </a>
  )
}

export default FloatingCall

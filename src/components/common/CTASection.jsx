import { motion } from 'framer-motion'
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import { cn } from '../../lib/cn.js'
import { useScrollReveal, prefersReducedMotion, fadeUp } from '../../hooks/useScrollReveal.js'
import siteConfig from '../../data/siteConfig.js'

/**
 * CTASection — the reusable admission call-to-action block that closes EVERY
 * page of the CIBLE School of Language website (AAP §0.6.3: "Every page ends
 * with an admission CTASection"). It is the site's primary conversion surface,
 * surfacing the four admission actions the ruleset requires on every page —
 * RANKED rather than equally weighted, so the visitor is never asked to choose
 * between four competing peers (AAP §0.6.3: "so four destinations no longer
 * compete equally"). Every destination is preserved; only the emphasis differs:
 *
 *   DOMINANT — large, first, the clearest action on the page
 *     1. Fill Admission Form  → internal route /admission   (primary · lg)
 *   SUPPORTING — large, alongside the dominant action
 *     2. Book Free Counseling → internal route /contact      (outline · lg)
 *   TERTIARY — quieter row beneath, still fully tappable
 *     3. WhatsApp             → siteConfig.whatsappHref      (accent  · md)
 *     4. Call {phone}         → siteConfig.phoneHref (tel:)   (ghost   · md)
 *
 * Counseling is deliberately `outline` rather than the filled orange
 * `secondary`: two saturated fills side by side compete for the same attention
 * and blunt the admission CTA, which the ruleset requires to be unmistakably
 * the primary action on every page. The tertiary pair is demoted in VISUAL
 * WEIGHT only — every Button size is at least 44px tall (sm/md = h-11,
 * lg = h-12) over a `min-h-11 min-w-11` floor, so both contact actions stay
 * comfortably tappable down to 320px, as the mobile-conversion rule requires.
 *
 * Reuse-first (zero duplication): this component composes the single canonical
 * {@link Container} width/gutter primitive and the single canonical polymorphic
 * {@link Button}. It never restyles a raw button and never re-implements layout
 * that a primitive already owns. Because Button is polymorphic (`to` renders a
 * react-router <Link>, `href` renders a semantic <a>), this file must NOT import
 * <Link> itself — passing `to`/`href` is sufficient.
 *
 * Contact deep-links are read exclusively from {@link siteConfig} (the single
 * source of truth) rather than hardcoded, so the WhatsApp (https://wa.me/…) and
 * click-to-call (tel:…) targets stay consistent site-wide. These are real,
 * tappable deep-links — kept prominent for mobile conversion per the ruleset.
 *
 * Styling — token-driven, zero hardcoded values (Tailwind v4 @theme tokens from
 * src/index.css, all on the 8px spacing scale). The panel is intentionally a
 * LIGHT brand surface — a very subtle blue→neutral→orange gradient tint — so
 * every Button variant rendered on it (the blue and green fills, the outline,
 * and the quiet ghost) retains WCAG-AA contrast; a dark panel would break the
 * filled buttons' contrast and the ghost variant outright, so it is deliberately
 * avoided. This is an accessibility constraint, not a stylistic preference.
 *
 * Elevation — the panel carries the project `shadow-lg` token, the
 * "interactive" step of the ascending elevation scale declared in
 * src/index.css (`shadow-sm` resting → `shadow-md` raised/scrolled →
 * `shadow-lg` interactive/fixed → `shadow-xl` drawer/highest local surface).
 * It is layered WITH `ring-1 ring-border`, not instead of it: the ring is the
 * hairline definition, the shadow is the lift. Both resolve to @theme tokens —
 * this file declares no raw shadow value and no hardcoded colour of any kind.
 *
 * Responsive — mobile-first, now with a genuine desktop tier. The band steps
 * `py-16` → `md:py-24` → `xl:py-32` and the panel steps `px-6 py-12` →
 * `md:px-12 md:py-16` → `xl:px-16 xl:py-20`; every value is an even Tailwind
 * step, i.e. an 8px multiple, and no arbitrary `[..]` utility is used. The
 * heading tops out at `xl:text-5xl` so it matches SectionHeading's display tier
 * and never out-ranks the Hero <h1>'s `xl:text-6xl`. {@link Container} supplies
 * the matching `xl:px-8` page gutter, so no gutter work is duplicated here.
 *
 * At the 320px floor the panel's inner measure is only 240px, which is narrower
 * than "Book Free Counseling" set in `text-lg` inside the `lg` size's `px-8`.
 * The two large actions therefore step down to `px-4` below `sm` (restoring
 * `sm:px-8` from 640px up) via Button's documented className extension point, so
 * neither label wraps out of its fixed 48px control. Height, type scale, variant
 * and hit area are untouched — only the inline padding flexes.
 *
 * NOTE ON TOKEN CLASS NAMES — the design brief illustrated the gradient/muted
 * tints as `from-primary/5`, `to-secondary/5`, and `text-muted-foreground`.
 * The committed @theme in src/index.css exposes SCALE color tokens
 * (--color-primary-600, --color-secondary-500, …) and the semantic token
 * --color-muted, but no bare --color-primary / --color-secondary /
 * --color-muted-foreground. Those bare/`-foreground` utilities therefore emit
 * NO CSS (verified with the Tailwind v4 compiler). To honor the brief's binding
 * rule — "@theme tokens only" — while preserving the exact visual intent, the
 * brand-anchor scale tokens and the real semantic token are used instead:
 *   from-primary/5        → from-primary-600/5   (brand blue anchor,  5% tint)
 *   to-secondary/5        → to-secondary-500/5   (brand orange anchor, 5% tint)
 *   text-muted-foreground → text-muted           (--color-muted, ~7.5:1 on white)
 *
 * Animation — a single subtle fade-up reveal via framer-motion driven by
 * {@link useScrollReveal}, which fully respects `prefers-reduced-motion`: the
 * panel is gated with `initial={reduce ? false : 'hidden'}` (via
 * {@link prefersReducedMotion}) so it mounts directly at its final state with
 * NO enter animation for users who request reduced motion (WCAG 2.3.3). All
 * hooks are called unconditionally at the top level.
 *
 * Accessibility (WCAG AA) — one <h2> titles the section; the actions sit in two
 * stacked flex rows of real <Link>/<a> controls (keyboard-operable, focus-ring
 * exposed by the shared Button base). DOM order matches the visual hierarchy, so
 * tab order runs Admission → Counseling → WhatsApp → Call with no tabindex
 * juggling. The leading icons are purely decorative (`aria-hidden`), so each
 * button is named entirely by its visible text label.
 *
 * @param {object} props
 * @param {string} [props.title='Ready to shape your future?'] Section heading.
 * @param {string} [props.subtitle] Supporting line beneath the heading.
 * @param {string} [props.className] Extra classes merged LAST onto the root
 *   <section> via {@link cn} so callers can tune vertical rhythm / background
 *   without forking the component.
 * @param {object} [props.props] Any remaining props are forwarded to the root
 *   <section> (e.g. `id`, `aria-labelledby`, data-* attributes).
 * @returns {import('react').ReactElement} The admission CTA section.
 */
export default function CTASection({
  title = 'Ready to shape your future?',
  subtitle = 'Join CIBLE School of Language today — talk to our counselors or apply online in minutes.',
  className,
  ...props
}) {
  const { ref, inView } = useScrollReveal()
  // Synchronous, SSR-safe read of prefers-reduced-motion (plain helper, not a
  // hook). When true the panel mounts with `initial={false}` and renders at its
  // final state with no fade-up reveal (WCAG 2.3.3).
  const reduce = prefersReducedMotion()

  return (
    <section className={cn('py-16 md:py-24 xl:py-32', className)} {...props}>
      <Container>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial={reduce ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          className="rounded-3xl bg-gradient-to-br from-primary-600/5 via-surface to-secondary-500/5 px-6 py-12 text-center shadow-lg ring-1 ring-border md:px-12 md:py-16 xl:px-16 xl:py-20"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl xl:text-5xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">{subtitle}</p>
          {/* Dominant admission action, with counseling as the supporting choice.
              The two large labels take the compact horizontal padding below `sm`
              so neither wraps inside its fixed 48px control at 320px. */}
          <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
            <Button to="/admission" variant="primary" size="lg" className="px-4 sm:px-8">
              Fill Admission Form
            </Button>
            <Button to="/contact" variant="outline" size="lg" className="px-4 sm:px-8">
              Book Free Counseling
            </Button>
          </div>
          {/* Tertiary contact options: quieter, still ≥44px and reachable on mobile. */}
          <div className="mt-4 flex flex-col flex-wrap items-center justify-center gap-4 sm:mt-6 sm:flex-row">
            <Button href={siteConfig.whatsappHref} variant="accent" size="md">
              <FaWhatsapp aria-hidden="true" className="h-5 w-5" />
              WhatsApp
            </Button>
            <Button href={siteConfig.phoneHref} variant="ghost" size="md">
              <FaPhoneAlt aria-hidden="true" className="h-4 w-4" />
              Call {siteConfig.phone}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

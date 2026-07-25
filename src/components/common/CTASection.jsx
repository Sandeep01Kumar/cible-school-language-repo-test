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
 * surfacing the four admission actions the ruleset requires on every page:
 *
 *   1. Fill Admission Form  → internal route  /admission   (primary   CTA)
 *   2. Book Free Counseling → internal route  /contact     (secondary CTA)
 *   3. WhatsApp             → siteConfig.whatsappHref       (accent    CTA)
 *   4. Call {phone}         → siteConfig.phoneHref (tel:)   (outline   CTA)
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
 * LIGHT brand surface — a very subtle blue→neutral→orange gradient tint — so all
 * four Button variants (blue / orange / green fills and the outline) retain
 * WCAG-AA contrast against it; a dark panel would break the filled buttons'
 * contrast, so it is deliberately avoided.
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
 * Accessibility (WCAG AA) — one <h2> titles the section; the actions sit in a
 * flex row of real <Link>/<a> controls (keyboard-operable, focus-ring exposed
 * by the shared Button base). The leading icons are purely decorative
 * (`aria-hidden`), so each button is named entirely by its visible text label.
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
    <section className={cn('py-16 md:py-24', className)} {...props}>
      <Container>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial={reduce ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          className="rounded-3xl bg-gradient-to-br from-primary-600/5 via-surface to-secondary-500/5 px-6 py-12 text-center ring-1 ring-border md:px-12 md:py-16"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">{subtitle}</p>
          <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
            <Button to="/admission" variant="primary" size="lg">
              Fill Admission Form
            </Button>
            <Button to="/contact" variant="secondary" size="lg">
              Book Free Counseling
            </Button>
            <Button href={siteConfig.whatsappHref} variant="accent" size="lg">
              <FaWhatsapp aria-hidden="true" className="h-5 w-5" />
              WhatsApp
            </Button>
            <Button href={siteConfig.phoneHref} variant="outline" size="lg">
              <FaPhoneAlt aria-hidden="true" className="h-4 w-4" />
              Call {siteConfig.phone}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

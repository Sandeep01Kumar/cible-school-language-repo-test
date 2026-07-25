import { motion } from 'framer-motion'
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import { cn } from '../../lib/cn.js'
import { useScrollReveal, prefersReducedMotion, fadeUp, fadeIn, staggerContainer } from '../../hooks/useScrollReveal.js'
import siteConfig from '../../data/siteConfig.js'
import heroImg from '../../assets/hero.svg'

/**
 * Hero — the primary above-the-fold hero section for the CIBLE School of
 * Language SPA (AAP §0.6.1 Group 7 / §0.6.3 "Home composition"). It is the
 * conversion-first opening of the Home page and is reusable as the lead section
 * of other marketing pages, which override `title` / `subtitle` / `eyebrow`.
 *
 * Layout: a two-column band on a subtle neutral surface. The left column is the
 * value proposition (eyebrow kicker → page headline → lead paragraph → a row of
 * three admission-focused CTAs); the right column is the brand hero
 * illustration. On mobile the grid collapses to a single stacked column
 * (`md:grid-cols-2` only splits from the `md` breakpoint up), so there is never
 * any horizontal scroll and touch targets stay comfortably tappable.
 *
 * Conversion (per the admissions-first ruleset): the CTA row exposes the three
 * canonical actions — "Apply for Admission" (internal route → react-router
 * <Link>), WhatsApp (external deep link https://wa.me/919899315093, opens in a
 * new tab via the Button primitive), and click-to-call (tel:+919899315093,
 * opens the device dialer in place). All three are rendered through the single
 * canonical <Button> primitive (never restyled raw anchors), and the brand
 * contact values are read from siteConfig — never hardcoded.
 *
 * Animation: a subtle entrance reveal built on the project's shared animation
 * system. `useScrollReveal()` returns an `inView` flag that fully respects
 * `prefers-reduced-motion` — under reduced motion (and because the Hero sits
 * above the fold) `inView` is `true` immediately, and each motion element is
 * gated with `initial={reduce ? false : 'hidden'}` so it mounts DIRECTLY at its
 * final visible state with no enter animation at all (WCAG 2.3.3). The left
 * column is a `staggerContainer` parent whose children (`fadeUp`) reveal in
 * sequence; the illustration uses a gentle `fadeIn`. No aggressive transforms
 * are added.
 *
 * Design-system compliance (Tailwind v4 @theme tokens from src/index.css; the
 * project rule is ZERO hardcoded style values — every value traces to a token
 * or utility on the 8px spacing scale). Two example class names from the file
 * brief are NOT backed by tokens in this repository and were snapped to the
 * defined tokens (verified by inspecting the generated CSS) so the output is
 * actually styled and stays WCAG-AA compliant — see the inline BLITZY flags:
 *   • the muted lead text uses `text-muted` (the defined --color-muted token);
 *   • the eyebrow pill uses `bg-primary-50` + `text-primary-700` (the same
 *     AA-safe pairing as the canonical Badge primary variant, ≈6.16:1).
 *
 * Accessibility (WCAG AA): the section owns the page's single <h1>; the
 * illustration is meaningful, so it carries a descriptive (non-empty) `alt`; the
 * `width`/`height` attributes reserve space to avoid layout shift (CLS); the
 * button icons are decorative (`aria-hidden`) and each button's visible text
 * label provides its accessible name; focus rings and AA-contrast token pairings
 * are inherited from the shared primitives and the global base layer.
 *
 * @param {object} props
 * @param {import('react').ReactNode} [props.title=siteConfig.tagline] Headline
 *   rendered as the page <h1>. Defaults to the brand tagline so Home works out
 *   of the box; other pages pass their own heading.
 * @param {import('react').ReactNode} [props.subtitle=siteConfig.description]
 *   Supporting lead paragraph beneath the headline.
 * @param {import('react').ReactNode} [props.eyebrow='Admissions Open'] Small
 *   kicker label shown in the pill above the headline.
 * @param {string} [props.className] Extra classes merged LAST onto the root
 *   <section> via {@link cn} so callers can extend/override the defaults.
 * @param {object} [props] Any remaining props are forwarded to the root
 *   <section> (e.g. `id`, `aria-*`, `data-*`).
 * @returns {import('react').ReactElement} The rendered hero section.
 */
function Hero({
  title = siteConfig.tagline,
  subtitle = siteConfig.description,
  eyebrow = 'Admissions Open',
  className,
  ...props
}) {
  // Single reveal hook at the top level (Rules of Hooks). `inView` drives both
  // columns; it is true immediately above the fold and under reduced motion.
  const { ref, inView } = useScrollReveal()
  // Synchronous, SSR-safe read of the OS "reduce motion" preference (plain
  // helper, not a hook). When true, each motion element mounts with
  // `initial={false}` so it renders DIRECTLY at its final state — no enter
  // reveal at all (WCAG 2.3.3). `useScrollReveal` re-renders on runtime toggle.
  const reduce = prefersReducedMotion()

  return (
    <section className={cn('bg-surface', className)} {...props}>
      <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        {/* Left column: value proposition + CTAs. Stagger parent — its children
            inherit the visible/hidden state and reveal in sequence. */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial={reduce ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-6"
        >
          {/* BLITZY [TOKEN-SNAP]: brief suggested `bg-primary/10` + `text-primary`,
              which resolve to NO token in this repo (verified against the built
              CSS). Snapped to the canonical Badge-primary pairing bg-primary-50 +
              text-primary-700 — both defined @theme tokens, WCAG AA ≈6.16:1. */}
          <motion.span
            variants={fadeUp}
            className="inline-flex w-fit items-center rounded-full bg-primary-50 px-4 py-1 text-sm font-medium text-primary-700"
          >
            {eyebrow}
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-tight text-foreground md:text-5xl"
          >
            {title}
          </motion.h1>
          {/* BLITZY [TOKEN-SNAP]: brief suggested `text-muted-foreground`, which
              resolves to no token here. Snapped to `text-muted` (the defined
              --color-muted token, ≈7.5:1 on the surface — WCAG AA). */}
          <motion.p variants={fadeUp} className="max-w-prose text-lg text-muted">
            {subtitle}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            {/* Primary admission CTA → internal route (react-router <Link>). */}
            <Button to="/admission" variant="primary" size="lg">
              Apply for Admission
            </Button>
            {/* WhatsApp deep link (external http → opens in a new tab). Icon is
                decorative; the "WhatsApp" text is the accessible name. */}
            <Button href={siteConfig.whatsappHref} variant="accent" size="lg">
              <FaWhatsapp aria-hidden="true" className="h-5 w-5" />
              WhatsApp
            </Button>
            {/* Click-to-call (tel: → opens the dialer in place). The visible
                phone number labels the control; the icon is decorative. */}
            <Button href={siteConfig.phoneHref} variant="outline" size="lg">
              <FaPhoneAlt aria-hidden="true" className="h-4 w-4" />
              {siteConfig.phone}
            </Button>
          </motion.div>
        </motion.div>

        {/* Right column: brand illustration. Gentle opacity fade driven by the
            same `inView` flag. `width`/`height` prevent layout shift (CLS). */}
        <motion.div
          variants={fadeIn}
          initial={reduce ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          className="flex justify-center"
        >
          <img
            src={heroImg}
            alt="Students learning English and building confidence at CIBLE School of Language — speech bubbles, an open book, a graduation cap and growth charts"
            className="h-auto w-full max-w-lg"
            width="640"
            height="480"
          />
        </motion.div>
      </Container>
    </section>
  )
}

export default Hero

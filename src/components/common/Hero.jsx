import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import { cn } from '../../lib/cn.js'
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
 * Performance / LCP (review M10): the Hero is entirely above the fold, so its
 * critical content is rendered IMMEDIATELY at its final visible state — it is
 * intentionally NOT gated behind a scroll-reveal. An earlier version wrapped the
 * headline in framer-motion with `initial="hidden"` driven by an
 * IntersectionObserver `inView` flag; because that flag is `false` on first
 * paint until the observer fires asynchronously, the above-fold `<h1>` (the LCP
 * element) was held at opacity 0 for hundreds of milliseconds. To eliminate that
 * delay — and to keep the above-fold JavaScript cost minimal — the Hero now uses
 * plain semantic elements (no framer-motion) so the h1, lead paragraph and CTAs
 * paint at once. The hero image additionally declares `loading="eager"`,
 * `fetchPriority="high"` and `decoding="async"` to signal it as high-priority.
 * Subtle scroll-reveal animation is retained across the site's BELOW-fold
 * sections, where it does not affect LCP.
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
  return (
    <section className={cn('bg-surface', className)} {...props}>
      <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        {/* Left column: value proposition + CTAs. Rendered immediately (no
            scroll-reveal gating) so the above-fold h1/lead/CTAs paint at once —
            critical for LCP (M10). Plain elements keep above-fold JS minimal. */}
        <div className="flex flex-col gap-6">
          {/* Eyebrow pill: canonical Badge-primary token pairing bg-primary-50 +
              text-primary-700 — both defined @theme tokens, WCAG AA ≈6.16:1. */}
          <span className="inline-flex w-fit items-center rounded-full bg-primary-50 px-4 py-1 text-sm font-medium text-primary-700">
            {eyebrow}
          </span>
          <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
            {title}
          </h1>
          {/* Lead paragraph uses `text-muted` (the defined --color-muted token,
              ≈7.5:1 on the surface — WCAG AA). */}
          <p className="max-w-prose text-lg text-muted">{subtitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
          </div>
        </div>

        {/* Right column: brand illustration. Rendered immediately with explicit
            high-priority hints so it is not deprioritised on the above-fold path
            (M10). `width`/`height` reserve space to prevent layout shift (CLS).
            The alt makes clear this is a representative ILLUSTRATION, not a photo
            of real students (m13). */}
        <div className="flex justify-center">
          <img
            src={heroImg}
            alt="Illustration representing learning English and building confidence at CIBLE School of Language — speech bubbles, an open book, a graduation cap and growth charts"
            className="h-auto w-full max-w-lg"
            width="640"
            height="480"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </Container>
    </section>
  )
}

export default Hero

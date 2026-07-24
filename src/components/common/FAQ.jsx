import { motion } from 'framer-motion'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Accordion from '../ui/Accordion.jsx'
import { cn } from '../../lib/cn.js'
import { useScrollReveal, fadeUp } from '../../hooks/useScrollReveal.js'
import faq from '../../data/faq.js'

/**
 * FAQ — CIBLE School of Language.
 *
 * The canonical frequently-asked-questions SECTION for the SPA. It is a thin,
 * presentational composition layer: it owns the section chrome (vertical
 * rhythm, constrained reading width, an optional heading and a scroll-reveal
 * wrapper) and delegates ALL disclosure behavior to the shared `ui/Accordion`
 * primitive. The accordion — not this component — implements the WAI-ARIA
 * disclosure pattern (`<button aria-expanded aria-controls>`, labelled
 * `role="region"` panels, native keyboard activation and focus management), so
 * this component intentionally builds NO accordion markup of its own (reuse
 * first, zero duplication).
 *
 * Content comes from the single source of truth `src/data/faq.js`
 * (`{ question, answer, category }[]`). Callers may pass their own `items`, or
 * narrow the default list to a single `category` (e.g. `'Admissions'`,
 * `'Courses'`, `'Fees'`, `'General'`) — filtered objects are passed through
 * intact, so the extra `category` key is simply ignored by `ui/Accordion`
 * (which reads only `question`/`answer`).
 *
 * Styling flows entirely through Tailwind `@theme` brand tokens/utilities on
 * the project's 8px spacing scale (`py-16`/`md:py-24`, `mt-8`, `max-w-3xl`);
 * there are no hardcoded or arbitrary `[..]` values, and the caller
 * `className` is merged LAST via {@link cn} so callers can extend or override.
 *
 * Accessibility (WCAG AA):
 * - `SectionHeading` renders the section's real `<h2>` (default) while each
 *   question sits inside an `<h3>` (`headingAs="h3"`), keeping the document
 *   outline logical (page `<h1>` -> section `<h2>` -> question `<h3>`).
 * - Disclosure semantics, keyboard operability and focus rings are provided by
 *   `ui/Accordion`.
 * - The reveal animation is gated by `useScrollReveal`, which honors
 *   `prefers-reduced-motion` (content is shown immediately, never trapped
 *   behind an animation, when reduced motion is requested).
 *
 * @param {object} props
 * @param {Array<{question: string, answer: import('react').ReactNode, category?: string}>} [props.items=faq]
 *   FAQ entries to render. Defaults to the full site FAQ dataset.
 * @param {string} [props.category] When provided, only entries whose
 *   `category` matches are rendered (objects are kept intact).
 * @param {import('react').ReactNode} [props.title='Frequently Asked Questions']
 *   Section heading title (rendered as the `<h2>` by `SectionHeading`).
 * @param {import('react').ReactNode} [props.subtitle] Optional supporting
 *   paragraph shown under the title.
 * @param {string} [props.eyebrow='FAQ'] Small uppercase kicker above the title.
 * @param {boolean} [props.showHeading=true] When `false`, the `SectionHeading`
 *   is omitted (useful when the FAQ is embedded under an existing heading).
 * @param {boolean} [props.allowMultiple=false] Forwarded to `ui/Accordion`:
 *   when `true`, multiple panels may be open at once; otherwise one at a time.
 * @param {string} [props.className] Extra classes merged onto the root
 *   `<section>` after the defaults.
 * @returns {import('react').ReactElement} The rendered FAQ section.
 */
function FAQ({
  items = faq,
  category,
  title = 'Frequently Asked Questions',
  subtitle,
  eyebrow = 'FAQ',
  showHeading = true,
  allowMultiple = false,
  className,
  ...props
}) {
  // Reveal-on-scroll: `inView` flips true when the accordion enters the
  // viewport (and immediately when the user prefers reduced motion). Called
  // unconditionally at the top level to satisfy the Rules of Hooks.
  const { ref, inView } = useScrollReveal()

  // Optionally narrow the dataset to a single category, keeping each object
  // intact so `ui/Accordion` still receives `{ question, answer }`.
  const list = category ? items.filter((f) => f.category === category) : items

  return (
    <section className={cn('py-16 md:py-24', className)} {...props}>
      <Container className="max-w-3xl">
        {showHeading ? (
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        ) : null}
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-8"
        >
          <Accordion items={list} allowMultiple={allowMultiple} headingAs="h3" />
        </motion.div>
      </Container>
    </section>
  )
}

export default FAQ

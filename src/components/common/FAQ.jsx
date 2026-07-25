import { motion } from 'framer-motion'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Accordion from '../ui/Accordion.jsx'
import { cn } from '../../lib/cn.js'
import { useScrollReveal, prefersReducedMotion, fadeUp } from '../../hooks/useScrollReveal.js'
import faq from '../../data/faq.js'

/**
 * Clamp an arbitrary heading-level input into the valid HTML range h1–h6.
 *
 * Non-numeric / non-finite input falls back to 2 (the section default) so a
 * bad prop can never produce an invalid tag such as `h0` or `h7`.
 *
 * @param {number} level Desired heading level.
 * @returns {number} An integer in the inclusive range [1, 6].
 */
function clampHeadingLevel(level) {
  const n = Math.trunc(Number(level))
  if (!Number.isFinite(n)) return 2
  return Math.min(6, Math.max(1, n))
}

/**
 * Whether a raw FAQ entry can actually be rendered by `ui/Accordion`.
 *
 * An entry is renderable only when it is a plain (non-null) object that exposes
 * a non-empty string question (`question` or the tolerated `title` alias) AND a
 * usable answer (`answer` or the tolerated `content` alias) that is neither
 * `null`/`undefined` nor an empty/whitespace-only string. This is the guard for
 * I-57: it stops malformed data (null holes, missing/blank fields, wrong types)
 * from crashing `ui/Accordion` (which reads `item.question`) or emitting empty,
 * meaningless disclosures.
 *
 * @param {unknown} item Candidate FAQ entry.
 * @returns {boolean} True when the entry is safe to render.
 */
function isRenderableFaqItem(item) {
  if (!item || typeof item !== 'object') return false
  const question = item.question ?? item.title
  if (typeof question !== 'string' || question.trim() === '') return false
  const answer = item.answer ?? item.content
  if (answer === null || answer === undefined) return false
  if (typeof answer === 'string' && answer.trim() === '') return false
  return true
}

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
 * Robustness / empty state (I-57): the incoming `items` prop is treated as
 * untrusted. A non-array value is coerced to an empty list, and every entry is
 * validated with {@link isRenderableFaqItem} so malformed data can neither throw
 * nor render blank disclosures. When the (optionally category-filtered) list is
 * empty, a meaningful, accessible no-results message is shown instead of an
 * empty bordered accordion shell.
 *
 * State identity (I-58): `ui/Accordion` tracks its open panels by positional
 * index. To stop a stale index from staying open on a DIFFERENT question after
 * the visible set changes (category switch, reorder, replaced `items`), the
 * accordion is keyed by the identity of the current question set, so React
 * remounts it with a fresh, correct open state whenever that set changes.
 *
 * Styling flows entirely through Tailwind `@theme` brand tokens/utilities on
 * the project's 8px spacing scale (`py-16`/`md:py-24`, `mt-8`, `max-w-3xl`,
 * `rounded-2xl`, `border-border`, `text-muted`); there are no hardcoded or
 * arbitrary `[..]` values, and the caller `className` is merged LAST via
 * {@link cn} so callers can extend or override.
 *
 * Accessibility (WCAG AA):
 * - Heading levels are configurable (I-59). By default `SectionHeading` renders
 *   the section's `<h2>` and each question sits inside an `<h3>`, keeping the
 *   outline logical (page `<h1>` -> section `<h2>` -> question `<h3>`). When the
 *   FAQ is embedded under an existing heading, or its own heading is hidden,
 *   callers pass `headingLevel`/`questionHeadingLevel` so the questions land at
 *   the correct depth for the surrounding document.
 * - Disclosure semantics, keyboard operability and focus rings are provided by
 *   `ui/Accordion`.
 * - Reduced motion (I-60): when the user prefers reduced motion the reveal
 *   wrapper is rendered statically with `initial={false}` (no fade/slide
 *   animation at all); otherwise it fades/slides in the first time it scrolls
 *   into view via `useScrollReveal`.
 *
 * @param {object} props
 * @param {Array<{question: string, answer: import('react').ReactNode, category?: string}>} [props.items=faq]
 *   FAQ entries to render. Defaults to the full site FAQ dataset. Untrusted:
 *   non-array or malformed entries are handled gracefully.
 * @param {string} [props.category] When provided, only entries whose
 *   `category` matches are rendered (objects are kept intact).
 * @param {import('react').ReactNode} [props.title='Frequently Asked Questions']
 *   Section heading title (rendered by `SectionHeading` at `headingLevel`).
 * @param {import('react').ReactNode} [props.subtitle] Optional supporting
 *   paragraph shown under the title.
 * @param {string} [props.eyebrow='FAQ'] Small uppercase kicker above the title.
 * @param {boolean} [props.showHeading=true] When `false`, the `SectionHeading`
 *   is omitted (useful when the FAQ is embedded under an existing heading).
 * @param {number} [props.headingLevel=2] Heading level (1–6) for the section
 *   title. Also the basis for the default question level.
 * @param {number} [props.questionHeadingLevel] Heading level (1–6) for each
 *   question. Defaults to `headingLevel + 1` (clamped) so questions nest one
 *   level below the section title.
 * @param {boolean} [props.allowMultiple=false] Forwarded to `ui/Accordion`:
 *   when `true`, multiple panels may be open at once; otherwise one at a time.
 * @param {import('react').ReactNode} [props.emptyMessage] Content shown when
 *   there are no renderable questions (e.g. a category with no matches).
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
  headingLevel = 2,
  questionHeadingLevel,
  allowMultiple = false,
  emptyMessage = 'No questions are available here yet. Please call or WhatsApp us and we will be happy to help.',
  className,
  ...props
}) {
  // Reveal-on-scroll: `inView` flips true when the accordion enters the
  // viewport (and immediately when the user prefers reduced motion). Called
  // unconditionally at the top level to satisfy the Rules of Hooks.
  const { ref, inView } = useScrollReveal()
  // Synchronous, SSR-safe read of the OS "reduce motion" preference. This is a
  // plain helper (not a hook); `useScrollReveal` re-renders the component when
  // the preference is toggled at runtime, so this value stays in sync.
  const reduce = prefersReducedMotion()

  // I-57: treat `items` as untrusted. Coerce non-arrays to an empty list,
  // optionally narrow by category (guarding null holes), then keep only entries
  // `ui/Accordion` can actually render so malformed data never throws or emits
  // blank disclosures.
  const source = Array.isArray(items) ? items : []
  const scoped = category ? source.filter((f) => f && f.category === category) : source
  const list = scoped.filter(isRenderableFaqItem)

  // I-59: resolve the heading tags so the document outline stays correct whether
  // the FAQ owns its section heading or is embedded under another heading depth.
  const titleAs = `h${clampHeadingLevel(headingLevel)}`
  const questionAs = `h${clampHeadingLevel(questionHeadingLevel ?? clampHeadingLevel(headingLevel) + 1)}`
  // Capitalized alias so JSX can render the resolved section heading tag
  // dynamically (React treats a string-valued capitalized identifier as a host
  // element, the same pattern `SectionHeading` uses for its `as` prop). Consumed
  // only by the `showHeading === false` branch below to emit the visually-hidden
  // bridging heading with `sr-only` ON THE HEADING ELEMENT ITSELF.
  const HiddenSectionHeading = titleAs

  // I-58: identity of the current question set. Changing category, reordering,
  // or replacing `items` changes this string, remounting `ui/Accordion` with a
  // fresh open state so a positional index can never stay open on a different
  // question. It is deterministic, so it stays stable across renders when the
  // visible set is unchanged (no needless remounts).
  const listKey = `${category ?? 'all'}:${list.length}:${list.map((f) => f.question ?? f.title).join('\n')}`

  return (
    <section className={cn('py-16 md:py-24', className)} {...props}>
      <Container className="max-w-3xl">
        {showHeading ? (
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} as={titleAs} />
        ) : (
          // QA Issue 9: even when the visible section heading is suppressed
          // (e.g. the /faq page supplies its own page <h1> above), emit a
          // visually-hidden heading AT THE SECTION LEVEL so the accordion's
          // question headings (h3 by default) are NOT orphaned directly under
          // the page <h1> (an h1 -> h3 skip). The `sr-only` class sits on the
          // heading element itself (identical to the Courses/Faculty/Blog/Events
          // page fixes), so the heading is present in the accessibility tree and
          // the document outline while being removed from the visual layout.
          // Screen-reader users get a labelled section; sighted users see only
          // the surrounding page heading, unchanged.
          <HiddenSectionHeading className="sr-only">{title}</HiddenSectionHeading>
        )}
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial={reduce ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          className="mt-8"
        >
          {list.length > 0 ? (
            <Accordion
              key={listKey}
              items={list}
              allowMultiple={allowMultiple}
              headingAs={questionAs}
            />
          ) : (
            <p
              role="status"
              className="rounded-2xl border border-border bg-white px-6 py-8 text-center text-muted"
            >
              {emptyMessage}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  )
}

export default FAQ

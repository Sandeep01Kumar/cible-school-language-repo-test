import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import { cn } from '../../lib/cn.js'
import { FiClock } from 'react-icons/fi'
import { FaCheck } from 'react-icons/fa'
import courseEnglish from '../../assets/course-english.svg'
import coursePersonality from '../../assets/course-personality.svg'
import courseScience from '../../assets/course-science.svg'
import courseComputer from '../../assets/course-computer.svg'
import courseCareer from '../../assets/course-career.svg'

/**
 * CourseCard
 *
 * The single canonical course tile for the CIBLE School of Language SPA. It is
 * driven entirely by a `course` object (single source of truth: src/data/courses.js)
 * and is composed from the shared primitives — <Card> (surface), <Badge> (category
 * pill) and <Button> (conversion CTA) — so it never restyles raw elements and stays
 * visually consistent with the rest of the product. It is consumed by CourseGrid and
 * by the course/category pages.
 *
 * Reuse & safety:
 * - No forked button/card markup: styling flows through the primitives + Tailwind
 *   `@theme` tokens (zero hardcoded values; only 0/auto/inherit/currentColor/transparent
 *   are exempt).
 * - Intentionally uses NO framer-motion so it is safe to mount inside grids, sliders
 *   and carousels; scroll-reveal is owned by the parent grid. The only motion here is
 *   a lightweight CSS `hover:-translate-y-1` lift.
 *
 * Image resolution (course → one of 5 illustrations):
 * There are only 5 illustrations, and `category` alone is ambiguous because the
 * "English" family spans TWO images (general English vs. personality/speaking). The
 * card therefore resolves the illustration by SLUG first (see {@link IMAGE_BY_SLUG}),
 * falls back to the category illustration (see {@link IMAGE_BY_CATEGORY}), and finally
 * defaults to the English illustration so a card never renders without media.
 *
 * CTA destination & label:
 * The CTA links to the most relevant existing route for the course's category (see
 * {@link ROUTE_BY_CATEGORY}), with a `/courses` fallback. The 'Career' category has
 * no dedicated page, so it routes to `/admission` (never back to the /courses
 * catalog the card sits in — that self-referential dead end was QA Issue 8).
 * Callers may override the destination with the `to` prop (the category landing
 * pages pass `to="/admission?course=<title>"` so their cards drive admission
 * instead of self-linking) and the visible/aria label via `ctaLabel`. The link is
 * produced by <Button to=...>, which renders a react-router <Link> — so this file
 * never imports Link directly.
 *
 * Accessibility (WCAG AA):
 * - The illustration is decorative (the title conveys the meaning), so it uses an
 *   empty `alt` + `aria-hidden`; every icon is likewise decorative (`aria-hidden`).
 * - The card title is an <h3> (cards sit beneath a section <h2>).
 * - The CTA label repeats across a page of many cards, so it carries a
 *   descriptive `aria-label` combining the label and the course title.
 * - The default root element is a semantic <article> (self-contained content);
 *   callers can override via the `as` prop forwarded through `...props`
 *   (e.g. `as="li"` inside a list).
 *
 * @param {object} props
 * @param {object} props.course The course record. Shape:
 *   `{ slug, title, category, summary, duration, highlights, icon }` where `category`
 *   is one of `'English' | 'Science' | 'Computer' | 'Career'`, `highlights` is an
 *   array of short strings, and `icon` is a react-icons component REFERENCE (rendered,
 *   never called). When `course` is falsy the component renders `null`.
 * @param {string} [props.to] Optional explicit destination that overrides the
 *   category-derived route for the CTA.
 * @param {string} [props.ctaLabel='Learn more'] Visible CTA text (also used to
 *   build the descriptive `aria-label`). Category pages pass e.g. "Apply now".
 * @param {string} [props.className] Extra classes merged LAST onto the <Card> surface.
 * @param {object} [props] Any other props (`as`, `id`, `data-*`, …) are forwarded to
 *   the underlying <Card> root.
 * @returns {import('react').ReactElement|null} The rendered course card, or `null`.
 */

// slug → illustration. Resolved FIRST because the "English" category maps to two
// different illustrations (general English vs. personality / speaking). Module-scope
// constant map (allowed by oxlint react/only-export-components allowConstantExport).
const IMAGE_BY_SLUG = {
  'spoken-english': courseEnglish,
  'english-communication': courseEnglish,
  'personality-development': coursePersonality,
  'public-speaking': coursePersonality,
  'interview-preparation': coursePersonality,
  'pcm-coaching': courseScience,
  'pcb-coaching': courseScience,
  'basic-computer': courseComputer,
  'digital-literacy': courseComputer,
  'career-guidance': courseCareer,
}

// category → illustration. Fallback when a course slug is not in IMAGE_BY_SLUG.
const IMAGE_BY_CATEGORY = {
  English: courseEnglish,
  Science: courseScience,
  Computer: courseComputer,
  Career: courseCareer,
}

// category → existing in-app route for the CTA (with a /courses fallback). The
// three subject tracks point at their dedicated landing pages; 'Career' has no
// dedicated page in the frozen 17-route table, so — rather than link back to the
// same /courses catalog the card already sits in (a self-referential dead end,
// QA Issue 8) — it drives straight to the conversion-focused /admission page
// with the specific course PRESELECTED via `?course=<title>` (read by Admission
// through useSearchParams). The title is URL-encoded (%20 for the space) so the
// query round-trips exactly to the course's `title`; there is a single 'Career'
// course today ('Career Guidance'), so a static value is correct and minimal
// (QA Issue 16).
const ROUTE_BY_CATEGORY = {
  English: '/spoken-english',
  Science: '/science-coaching',
  Computer: '/computer-courses',
  Career: '/admission?course=Career%20Guidance',
}

export default function CourseCard({
  course,
  to: toProp,
  ctaLabel = 'Learn more',
  className,
  ...props
}) {
  // Guard: nothing to render without a course record.
  if (!course) return null

  // Resolve media by slug first, then category, then a safe default.
  const image =
    IMAGE_BY_SLUG[course.slug] || IMAGE_BY_CATEGORY[course.category] || courseEnglish

  // Resolve the CTA destination: explicit prop wins, else category route, else /courses.
  const to = toProp || ROUTE_BY_CATEGORY[course.category] || '/courses'

  // react-icons component reference supplied via data — render, never call.
  const Icon = course.icon

  // Surface up to four highlights (all courses currently define exactly four,
  // so this renders the complete set — QA Issue 16); tolerate a missing/empty
  // highlights array.
  const highlights = course.highlights?.slice(0, 4) ?? []

  return (
    <Card
      as="article"
      className={cn(
        'flex h-full flex-col overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1',
        className,
      )}
      {...props}
    >
      {/* Media block: 4:3 illustration (matches the SVG viewBox) with a category
          badge overlaid top-left and the course icon in a floating token circle
          top-right. The image is purely decorative — the title carries meaning. */}
      <div className="relative aspect-4-3 w-full bg-surface">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4">
          <Badge variant="primary">{course.category}</Badge>
        </span>
        {Icon ? (
          <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      {/* Body: icon + title, duration, summary, up to four highlights, and the
          admission-oriented CTA pinned to the bottom of the card. */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-6 w-6 shrink-0 text-primary-600" aria-hidden="true" /> : null}
          <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
        </div>

        {course.duration ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <FiClock aria-hidden="true" />
            {course.duration}
          </p>
        ) : null}

        {course.summary ? (
          <p className="text-sm leading-relaxed text-muted">{course.summary}</p>
        ) : null}

        {highlights.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {highlights.map((highlight, index) => (
              <li
                key={highlight || index}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <FaCheck className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-2">
          <Button
            to={to}
            variant="primary"
            size="sm"
            aria-label={`${ctaLabel} — ${course.title}`}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </Card>
  )
}

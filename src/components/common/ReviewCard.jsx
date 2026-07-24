import Card from '../ui/Card.jsx'
import { cn } from '../../lib/cn.js'
import { FaStar, FaRegStar, FaQuoteLeft } from 'react-icons/fa'

/**
 * ReviewCard
 *
 * The single canonical testimonial / social-proof card for the CIBLE School of
 * Language SPA (AAP §0.6.1 Group 7). It renders one student/parent review — a
 * five-star rating, the quote, and an author block (name + role/course) with an
 * initials-avatar fallback — by composing the shared <Card> surface. Reuse this
 * component everywhere a review is shown (the Home testimonials preview, the
 * <TestimonialSlider> swiper carousel, and the Success Stories page); never fork
 * a second review card.
 *
 * CAROUSEL-SAFE: this card is rendered inside a swiper carousel, so it
 * deliberately uses NO framer-motion and NO layout-shifting hover transform
 * (e.g. `hover:-translate-y`), which can jitter a slide mid-transition. The only
 * hover affordance is <Card>'s own soft `hover:shadow-md`, which deepens the
 * shadow without moving the element.
 *
 * Semantics (WCAG AA): rendered as a <figure> (via Card's polymorphic `as`
 * prop) containing a <blockquote> for the quote and a <figcaption> for the
 * author — the standard, accessible testimonial structure. The rating is exposed
 * to assistive technology as a single labelled image (`role="img"` +
 * `aria-label="Rated N out of 5"`) while the individual star glyphs are
 * `aria-hidden`; the filled/outline star SHAPES (not color alone) also convey the
 * score, so color is never the sole indicator of meaning.
 *
 * Styling is 100% token-driven (Tailwind v4 `@theme` tokens from src/index.css)
 * with zero hardcoded values. Brand colors resolve to the project's numeric
 * scale exactly as the sibling primitives (`Button`, `Badge`, `Card`) use them:
 * primary → `primary-600` (avatar fill, faded quote mark), secondary →
 * `secondary-500` (orange stars), plus the semantic `foreground` / `muted` /
 * `border` text tokens. The base surface (rounded-2xl, white, hairline border,
 * p-6, soft shadow) is inherited from <Card>; this component only adds the
 * vertical flex layout.
 *
 * @param {object} props
 * @param {{ name: string, role?: string, course?: string, rating: number,
 *   quote: string, image?: string|null }} props.review One testimonial record
 *   (shape per src/data/testimonials.js). A null/absent `image` renders the
 *   initials-avatar fallback; a truthy URL renders an <img>.
 * @param {string} [props.className] Extra classes merged LAST onto the Card root.
 * @param {object} [props] Any other props are forwarded to the underlying Card
 *   (`id`, `data-*`, `aria-*`, …).
 * @returns {import('react').ReactElement|null} The review card, or `null` when no
 *   `review` is supplied.
 */

// First letters of up to the first two whitespace-separated words of `name`,
// uppercased (e.g. "Priya Kumari" → "PK", "Rahul" → "R"). Module-local so the
// file exports ONLY the ReviewCard component (keeps react/only-export-components
// clean). Guards an empty/missing name to an empty string rather than throwing.
function getInitials(name) {
  if (!name) return ''
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
}

export default function ReviewCard({ review, className, ...props }) {
  // Nothing to render without a review record.
  if (!review) return null

  // Normalize the rating to a 0–5 number so a missing/invalid value degrades to
  // "0 out of 5" (all outline stars) instead of surfacing "NaN"/"undefined".
  const rating = typeof review.rating === 'number' ? review.rating : 0
  const rounded = Math.round(rating)

  // Always exactly five stars: the first `rounded` render filled (solid orange),
  // the remainder outlined (faded orange). Each glyph is decorative — the score
  // is announced once by the wrapping role="img" + aria-label below.
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < rounded ? (
      <FaStar key={i} className="text-secondary-500" aria-hidden="true" />
    ) : (
      <FaRegStar key={i} className="text-secondary-500/30" aria-hidden="true" />
    ),
  )

  return (
    <Card as="figure" className={cn('flex h-full flex-col gap-4', className)} {...props}>
      {/* Decorative opening quote mark. */}
      <FaQuoteLeft className="h-6 w-6 text-primary-600/30" aria-hidden="true" />

      {/* Star rating — one labelled image to assistive tech; glyphs hidden. */}
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`Rated ${rating} out of 5`}
      >
        {stars}
      </div>

      {/* The testimonial itself. `flex-1` lets short and long quotes share a
          common row height in the carousel so author blocks align at the bottom. */}
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{review.quote}&rdquo;
      </blockquote>

      {/* Author block: avatar (real photo or initials fallback) + name + role. */}
      <figcaption className="mt-auto flex items-center gap-3 pt-2">
        {review.image ? (
          <img
            src={review.image}
            alt={review.name}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white"
            role="img"
            aria-label={review.name}
          >
            {getInitials(review.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          <p className="text-xs text-muted">{review.role || review.course}</p>
        </div>
      </figcaption>
    </Card>
  )
}

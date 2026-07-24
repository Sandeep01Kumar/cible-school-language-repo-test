import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/a11y'
import 'swiper/css/autoplay'
import ReviewCard from './ReviewCard.jsx'
import { cn } from '../../lib/cn.js'
import { prefersReducedMotion } from '../../hooks/useScrollReveal.js'
import testimonials from '../../data/testimonials.js'

/**
 * TestimonialSlider — CIBLE School of Language.
 *
 * THE canonical student/parent testimonial carousel for the SPA (AAP §0.6.1
 * Group 7). It is a Swiper v14 carousel that renders one sibling <ReviewCard>
 * per slide from the shared `src/data/testimonials.js` single source of truth,
 * with arrow navigation, clickable pagination bullets, the Swiper a11y module
 * enabled, and reduced-motion-aware autoplay. It is consumed by the Home
 * testimonials section and the Success Stories page, and it stays fully
 * presentational — the review records are supplied by the caller (defaulting to
 * the shared data) and every slide reuses the canonical <ReviewCard>; this
 * component never forks a second review card or restyles a raw card.
 *
 * Responsive behaviour (Tailwind breakpoint scale → CIBLE mobile/tablet/laptop):
 * - base   : 1 slide  per view (mobile)
 * - >= 768 : 2 slides per view (`md` — tablet)
 * - >= 1024: 3 slides per view (`lg` — laptop/desktop)
 * `spaceBetween={24}` keeps a consistent 24px (8px-scale) gutter between slides,
 * and `pb-12` reserves vertical room BELOW the cards for the pagination bullets
 * so they never overlap the last row of content.
 *
 * Equal-height cards: each <SwiperSlide> is `h-auto` (so the slide grows to the
 * tallest card in the visible row rather than Swiper's default equal-but-clipped
 * height) while the <ReviewCard> is `h-full` (so a short quote's card stretches
 * to match a long one). Together they align every author block along a common
 * baseline across the row.
 *
 * Motion / prefers-reduced-motion (WCAG AA — REQUIRED): autoplay advances slides
 * every 5s ONLY when the user has not requested reduced motion. When
 * `prefersReducedMotion()` is true the `autoplay` prop is `false`, so the
 * carousel makes NO automatic (non-user-initiated) movement; slide changes then
 * happen only through the user's own actions (arrows, pagination, drag/swipe),
 * which is acceptable under reduced motion. `prefersReducedMotion` is a plain
 * helper (not a hook), so it is read synchronously during render.
 *
 * Accessibility (WCAG AA):
 * - Swiper's `A11y` module labels the navigation arrows and the region, and the
 *   `clickable` pagination bullets are keyboard-focusable/operable, so the whole
 *   carousel is usable by keyboard and screen-reader users.
 * - Each slide's <ReviewCard> carries the accessible testimonial structure
 *   (<figure>/<blockquote>/<figcaption>) and exposes its star score once as a
 *   single labelled `role="img"` — colour is never the sole indicator of meaning.
 *
 * Styling: every value resolves to a Tailwind `@theme` token / native utility
 * from `src/index.css` (`pb-12`, `h-auto`, `h-full`) with zero hardcoded style
 * values; the caller `className` is merged LAST through the shared `cn()` helper
 * so it can override. The numeric Swiper API values (`spaceBetween`,
 * `slidesPerView`, breakpoints) are carousel configuration, not CSS style values.
 *
 * Stable references (Swiper re-init safety): all static Swiper configuration
 * (`MODULES`, `BREAKPOINTS`, `PAGINATION`, `A11Y`, `AUTOPLAY`) is hoisted to
 * module scope so its references never change across re-renders — Swiper's React
 * wrapper re-initialises (resetting the active slide and restarting autoplay)
 * when it sees a new prop reference, which would otherwise glitch the carousel
 * whenever a parent (e.g. a framer-motion reveal section) re-renders. The
 * `Autoplay` module stays registered in every case; reduced motion is honoured
 * purely by passing `autoplay={false}`, keeping the prop reference stable too.
 *
 * @param {object} props
 * @param {Array<{ name: string, role?: string, course?: string, rating: number,
 *   quote: string, image?: string|null }>} [props.items=testimonials] The review
 *   records to render (shape per `src/data/testimonials.js`); defaults to the
 *   shared testimonials data. When empty the component renders nothing.
 * @param {string} [props.className] Extra classes merged LAST onto the <Swiper>
 *   root element.
 * @param {object} [props] Any additional props are forwarded to the underlying
 *   <Swiper> (e.g. `loop`, `grabCursor`).
 * @returns {import('react').ReactElement|null} The testimonial carousel, or
 *   `null` when there are no items.
 */

// Swiper feature modules registered once at module scope so the array keeps a
// STABLE reference across renders (see JSDoc). The Autoplay module is always
// registered; reduced motion is honoured via the autoplay prop below, not by
// removing the module (which would create a new array reference and re-init).
const MODULES = [Navigation, Pagination, A11y, Autoplay]

// The remaining Swiper configuration is fully static, so it is hoisted to module
// scope (stable references) for the same reason — a re-render of TestimonialSlider
// (or an ancestor) must never reset the carousel's active slide.
const BREAKPOINTS = { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
const PAGINATION = { clickable: true }
const A11Y = { enabled: true }
const AUTOPLAY = { delay: 5000, disableOnInteraction: true }

export default function TestimonialSlider({ items = testimonials, className, ...props }) {
  // Render nothing when there is no content — keeps callers free of guards.
  if (!items?.length) return null

  // Plain helper (intentionally NOT named use*), safe to read synchronously
  // during render: true when the user has requested reduced motion at the OS
  // level. When true, autoplay is disabled so the carousel never moves on its own.
  const reduced = prefersReducedMotion()

  return (
    <Swiper
      modules={MODULES}
      spaceBetween={24}
      slidesPerView={1}
      navigation
      pagination={PAGINATION}
      a11y={A11Y}
      autoplay={reduced ? false : AUTOPLAY}
      breakpoints={BREAKPOINTS}
      className={cn('pb-12', className)}
      {...props}
    >
      {items.map((t, i) => (
        <SwiperSlide key={t.name || i} className="h-auto">
          <ReviewCard review={t} className="h-full" />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules'
import { FaPlay, FaPause } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/a11y'
import 'swiper/css/autoplay'
import ReviewCard from './ReviewCard.jsx'
import Button from '../ui/Button.jsx'
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
 * Pause / Stop control (WCAG 2.2.2 "Pause, Stop, Hide" — REQUIRED for auto-
 * advancing content that runs longer than 5s): when autoplay is active (motion
 * allowed) the slider renders a visible, keyboard-operable Play/Pause toggle
 * (the canonical <Button>) that stops and restarts Swiper's autoplay controller
 * via a ref to the instance. Its `isPlaying` state is kept in sync with Swiper's
 * own `autoplayStart` / `autoplayStop` events, and the button's visible label
 * flips ("Pause autoplay" ↔ "Play autoplay") so the action is always
 * unambiguous. `pauseOnMouseEnter` additionally pauses rotation on hover (with
 * `disableOnInteraction: false` so a swipe never silently kills it). Under
 * reduced motion nothing auto-moves, so the toggle is intentionally not rendered.
 *
 * Accessibility (WCAG AA):
 * - Swiper's `A11y` module labels the navigation arrows and the region, and the
 *   `clickable` pagination bullets are keyboard-focusable/operable, so the whole
 *   carousel is usable by keyboard and screen-reader users.
 * - The Play/Pause toggle is a real <button> (via the shared <Button>), fully
 *   keyboard-operable with a visible focus ring; its icon is decorative
 *   (`aria-hidden`) and its changing visible text is the accessible name.
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
// Autoplay config (WCAG 2.2.2 "Pause, Stop, Hide"): `pauseOnMouseEnter` pauses
// the rotation while a pointer is over the carousel and resumes on leave, which
// requires `disableOnInteraction: false` so a swipe/arrow does not silently kill
// autoplay. The explicit, keyboard-operable Play/Pause toggle below is the
// primary, always-available mechanism to stop the automatic movement.
const AUTOPLAY = { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }

export default function TestimonialSlider({ items = testimonials, className, ...props }) {
  // Plain helper (intentionally NOT named use*), safe to read synchronously
  // during render: true when the user has requested reduced motion at the OS
  // level. When true, autoplay is disabled so the carousel never moves on its own.
  const reduced = prefersReducedMotion()

  // Live handle to the Swiper instance so the Play/Pause toggle can drive its
  // autoplay controller. Play/Pause reflects whether autoplay is currently
  // running; it starts running only when motion is allowed. BOTH hooks are
  // declared UNCONDITIONALLY at the top level — before the early return below —
  // so hook order is stable every render (react/rules-of-hooks).
  const swiperRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(!reduced)

  // Render nothing when there is no content — AFTER the hooks so their order
  // never changes across renders. Keeps callers free of empty-state guards.
  if (!items?.length) return null

  // Explicit user control (WCAG 2.2.2): stop/start Swiper's autoplay. Guarded so
  // it is a no-op if the instance or its autoplay controller is not ready.
  const togglePlay = () => {
    const swiper = swiperRef.current
    if (!swiper?.autoplay) return
    if (isPlaying) {
      swiper.autoplay.stop()
    } else {
      swiper.autoplay.start()
    }
  }

  return (
    <div className={cn('relative', className)}>
      {/* Play/Pause toggle — the required mechanism to pause the auto-rotating
          content. Rendered only when autoplay is actually active (i.e. motion is
          allowed); under reduced motion nothing auto-moves, so no control is
          needed. It is the canonical <Button> (a real, keyboard-operable
          <button> with a visible focus ring); the icon is decorative and the
          visible text is the accessible name, which flips with state so the
          control's action is always unambiguous. */}
      {!reduced ? (
        <div className="mb-4 flex justify-end">
          <Button type="button" variant="outline" size="md" onClick={togglePlay}>
            {isPlaying ? (
              <FaPause aria-hidden="true" className="h-4 w-4" />
            ) : (
              <FaPlay aria-hidden="true" className="h-4 w-4" />
            )}
            {isPlaying ? 'Pause autoplay' : 'Play autoplay'}
          </Button>
        </div>
      ) : null}

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onAutoplayStart={() => setIsPlaying(true)}
        onAutoplayStop={() => setIsPlaying(false)}
        modules={MODULES}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={PAGINATION}
        a11y={A11Y}
        autoplay={reduced ? false : AUTOPLAY}
        breakpoints={BREAKPOINTS}
        className="pb-12"
        {...props}
      >
        {items.map((t, i) => (
          <SwiperSlide key={t.name || i} className="h-auto">
            <ReviewCard review={t} className="h-full" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y, Keyboard } from 'swiper/modules'
import { FiX } from 'react-icons/fi'
import { cn } from '../../lib/cn.js'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/a11y'

/**
 * Gallery — CIBLE School of Language.
 *
 * THE canonical responsive, accessible image gallery for the SPA (campus,
 * classrooms, events). It is a Swiper v14 carousel with arrow navigation,
 * clickable pagination bullets, keyboard control, and the a11y module enabled,
 * plus an OPTIONAL lightbox that opens the clicked slide in an accessible modal
 * dialog. It is consumed by the Gallery page and any section that needs an
 * image carousel, and it stays fully presentational — every image is supplied
 * by the caller through the `images` prop (single source of truth in
 * `src/data`).
 *
 * Responsive behaviour (Tailwind breakpoint scale):
 * - base   : 1 slide  per view (mobile)
 * - >= 640 : 2 slides per view (`sm` — tablet)
 * - >= 1024: 3 slides per view (`lg` — laptop/desktop)
 * `spaceBetween={16}` keeps a consistent 16px (8px-scale) gutter between slides.
 *
 * Accessibility (WCAG AA):
 * - Every `<img>` carries a meaningful `alt` supplied by the data.
 * - Swiper's `A11y` module labels the navigation/pagination controls, the
 *   `Keyboard` module enables arrow-key control, and pagination bullets are
 *   `clickable` and keyboard-focusable.
 * - Each lightbox trigger is a real `<button type="button">` with a descriptive
 *   `aria-label` ("View image: <alt>"), so activation, focusability and focus
 *   rings (global `:focus-visible` in `src/index.css`) come for free.
 * - The lightbox is a `role="dialog" aria-modal="true"` labelled by the image
 *   `alt`. It can be dismissed via the labelled Close button, the Escape key, or
 *   a click on the backdrop scrim. On open, focus is moved into the dialog (the
 *   Close button); on close, focus is restored to the element that opened it,
 *   and background scroll is locked while it is open — the standard modal focus
 *   contract for keyboard and screen-reader users.
 * - Slide captions use semantic `<figure>` / `<figcaption>`.
 *
 * Motion:
 * - There is intentionally NO `autoplay`; the carousel is entirely
 *   user-driven, so there is no continuous motion to suppress. Any slide/modal
 *   transitions are user-initiated and are additionally neutralised for users
 *   who request reduced motion via the global rule in `src/index.css`.
 *
 * Styling:
 * - Every value resolves to a Tailwind `@theme` brand token defined in
 *   `src/index.css` (`bg-surface`, `bg-foreground/90`, `text-muted`,
 *   `rounded-2xl`) or a native/utility token (`text-white`, `bg-white/10`,
 *   `aspect-[4/3]`, `max-h-[85vh]`, `z-50`). There are no hardcoded style
 *   values. Class composition (including the caller `className`, merged last so
 *   it can override) flows through the shared `cn()` helper.
 *
 * @param {object} props
 * @param {Array<{src: string, alt: string, caption?: string}>} [props.images=[]]
 *   Images to display. `alt` is required and must be meaningful; `caption` is
 *   optional. When empty the component renders nothing.
 * @param {string} [props.className] Extra classes merged last onto the Swiper
 *   root element.
 * @param {boolean} [props.lightbox=true] When `true` (default) each slide is a
 *   button that opens the image in the modal lightbox; when `false` slides are
 *   static, non-interactive images.
 * @param {object} [props.props] Any additional props are forwarded to the
 *   underlying `<Swiper>` (e.g. `loop`, `grabCursor`).
 * @returns {JSX.Element|null} The rendered gallery, or `null` when there are no
 *   images.
 */

// Swiper feature modules registered once at module scope so the array keeps a
// STABLE reference across renders — Swiper diffs its props and would otherwise
// re-initialise when Gallery re-renders (e.g. on lightbox open/close).
const MODULES = [Navigation, Pagination, A11y, Keyboard]

// The remaining Swiper configuration is fully static, so it is also hoisted to
// module scope (stable references) for the same reason: a re-render of Gallery
// must never reset the carousel's active slide.
const BREAKPOINTS = { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
const PAGINATION = { clickable: true }
const KEYBOARD = { enabled: true }
const A11Y = { enabled: true }

export default function Gallery({ images = [], className, lightbox = true, ...props }) {
  // `null` = lightbox closed; a number = index of the image currently viewed.
  const [openIndex, setOpenIndex] = useState(null)
  // Ref to the lightbox Close button so focus can be moved into the dialog when
  // it opens (WCAG AA modal focus management).
  const closeButtonRef = useRef(null)

  // Stable close handler shared by the Escape listener, the scrim click, and the
  // Close button; memoised so the effect dependency below stays stable.
  const close = useCallback(() => setOpenIndex(null), [])

  // While the lightbox is open: close on Escape, lock background scroll, move
  // focus into the dialog, and restore focus to the opener on close. `document`
  // is only ever touched here, inside the effect (never during render).
  useEffect(() => {
    if (openIndex === null) return
    const previouslyFocused = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('overflow-hidden')
    closeButtonRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('overflow-hidden')
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [openIndex, close])

  // Render nothing when there is no content — keeps callers free of guards.
  if (!images.length) return null

  // Guard against a stale index if the `images` prop shrinks while the lightbox
  // is open, so we never dereference an out-of-bounds element.
  const activeImage = openIndex === null ? null : images[openIndex]

  return (
    <>
      <Swiper
        modules={MODULES}
        spaceBetween={16}
        slidesPerView={1}
        navigation
        pagination={PAGINATION}
        keyboard={KEYBOARD}
        a11y={A11Y}
        breakpoints={BREAKPOINTS}
        className={cn('w-full', className)}
        {...props}
      >
        {images.map((img, i) => {
          // Build the media element once and reuse it in both the interactive
          // (lightbox trigger) and static branches — no duplicated markup.
          const media = (
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          )
          return (
            <SwiperSlide key={img.src || i}>
              <figure className="m-0">
                {lightbox ? (
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    aria-label={`View image: ${img.alt}`}
                    className="block w-full overflow-hidden rounded-2xl bg-surface"
                  >
                    {media}
                  </button>
                ) : (
                  <div className="overflow-hidden rounded-2xl bg-surface">{media}</div>
                )}
                {img.caption ? (
                  <figcaption className="mt-2 text-center text-sm text-muted">
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {lightbox && activeImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <FiX className="h-6 w-6" aria-hidden="true" />
          </button>
          <figure
            className="m-0 flex flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />
            {activeImage.caption ? (
              <figcaption className="text-center text-sm text-white/80">
                {activeImage.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </>
  )
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
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
 *   `alt`, PORTALLED to `<body>` (a sibling of `#root`) so it can escape the app
 *   shell's stacking/inert scope. It can be dismissed via the labelled Close
 *   button, the Escape key, or a click on the backdrop scrim. It implements the
 *   full modal contract for keyboard and screen-reader users (WCAG 2.1.2 /
 *   4.1.2): on open, focus moves into the dialog (the Close button); Tab and
 *   Shift+Tab are TRAPPED so focus cycles only among the dialog's focusable
 *   elements and can never reach the background; the entire app shell (`#root`)
 *   is made `inert` while the dialog is open so neither the keyboard nor
 *   assistive technology can reach the page behind it; background scroll is
 *   locked; and on close the `inert` flag is cleared BEFORE focus is restored to
 *   the element that opened the dialog (focusing an element inside an inert tree
 *   is a no-op, so order matters).
 * - The Close button is a comfortably tappable target: it is centred via
 *   `inline-flex` and sized to a 44×44px minimum (`min-h-11 min-w-11`) so it
 *   meets the touch-target guideline on mobile.
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
 *   `rounded-2xl`), a built-in utility (`text-white`, `bg-white/10`, `z-50`), or
 *   one of the project's custom named utilities from `src/index.css`
 *   (the 4:3 thumbnail-frame utility and the lightbox max-height ceiling
 *   utility). There are no hardcoded or arbitrary-value style classes.
 *   Class composition (including the caller `className`, merged last so it can
 *   override) flows through the shared `cn()` helper.
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
// Arrow-key control for the carousel. `onlyInViewport` MUST be false: Swiper
// v14's in-viewport gate compares the carousel's PAGE-coordinate offset against
// the window height, so a carousel below the fold (as on the Gallery page) never
// passes the check and arrow keys are silently ignored. `pageUpDown` is disabled
// so the module never hijacks the browser's native PageUp/PageDown scrolling.
const KEYBOARD = { enabled: true, onlyInViewport: false, pageUpDown: false }
const A11Y = { enabled: true }

export default function Gallery({ images = [], className, lightbox = true, ...props }) {
  // `null` = lightbox closed; a number = index of the image currently viewed.
  const [openIndex, setOpenIndex] = useState(null)
  // Ref to the lightbox Close button so focus can be moved into the dialog when
  // it opens (WCAG AA modal focus management).
  const closeButtonRef = useRef(null)
  // Ref to the dialog container so the keyboard handler can scope the Tab focus
  // trap to the elements INSIDE the modal.
  const dialogRef = useRef(null)
  // Ref to the exact trigger element that opened the dialog. Captured from the
  // click's `currentTarget` (NOT `document.activeElement`, which can already be
  // `<body>` — e.g. a programmatic click that never set focus), so focus can be
  // reliably RESTORED to the opener on close (WAI-ARIA dialog pattern).
  const openerRef = useRef(null)

  // Stable close handler shared by the Escape listener, the scrim click, and the
  // Close button; memoised so the effect dependency below stays stable.
  const close = useCallback(() => setOpenIndex(null), [])

  // While the lightbox is open, enforce the full modal contract (WCAG 2.1.2
  // "No Keyboard Trap" done RIGHT — i.e. a deliberate, escapable focus trap —
  // and 4.1.2): close on Escape; TRAP Tab / Shift+Tab so focus cycles only among
  // the dialog's focusable elements and can never reach the background; make the
  // rest of the app (`#root`) `inert` so neither the keyboard nor assistive tech
  // can reach it (the dialog itself is portalled to <body>, OUTSIDE #root, so it
  // stays interactive); lock background scroll; move focus into the dialog on
  // open; and restore focus to the opener on close. `document` is only ever
  // touched here, inside the effect (never during render).
  useEffect(() => {
    if (openIndex === null) return undefined
    const previouslyFocused = document.activeElement
    const rootEl = document.getElementById('root')

    const onKey = (e) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      // Focusable descendants of the dialog, in DOM order. In this modal that is
      // just the Close button, but the trap is written generically so it stays
      // correct if the dialog ever gains more controls.
      const focusables = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusables.length === 0) {
        // Nothing focusable inside — keep focus pinned to the dialog itself.
        e.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (e.shiftKey) {
        // Shift+Tab off the first element (or from outside) wraps to the last.
        if (active === first || !dialog.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !dialog.contains(active)) {
        // Tab off the last element (or from outside) wraps to the first.
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.classList.add('overflow-hidden')
    // Hide the entire app shell from AT and remove it from the tab order. The
    // dialog is portalled to <body> (a sibling of #root), so it is unaffected.
    if (rootEl) rootEl.inert = true
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('overflow-hidden')
      // Clear inert BEFORE restoring focus — focus() on an element inside an
      // inert subtree is a no-op, so the opener must be focusable again first.
      if (rootEl) rootEl.inert = false
      // Restore focus to the control that opened the dialog (WAI-ARIA dialog
      // pattern). This cleanup runs in React's passive phase, AFTER the portal
      // dialog has been removed from the DOM (which blurs the Close button to
      // <body>), so this is the final focus operation and it must target a LIVE,
      // focusable node. Prefer the explicitly-captured opener; fall back to the
      // element that was focused before opening. `document.body` is skipped
      // (focusing it is a no-op and would leave the user at the document start).
      const opener = openerRef.current
      const restoreTarget =
        opener && opener.isConnected
          ? opener
          : previouslyFocused instanceof HTMLElement &&
              previouslyFocused.isConnected &&
              previouslyFocused !== document.body
            ? previouslyFocused
            : null
      restoreTarget?.focus()
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
              className="aspect-4-3 h-full w-full object-cover"
            />
          )
          return (
            <SwiperSlide key={img.src || i}>
              <figure className="m-0">
                {lightbox ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      // Capture the exact trigger node so focus can be restored
                      // to it when the lightbox closes (see the effect cleanup).
                      openerRef.current = e.currentTarget
                      setOpenIndex(i)
                    }}
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

      {lightbox && activeImage && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={dialogRef}
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
                className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
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
                  className="max-h-screen-85 max-w-full rounded-2xl object-contain"
                />
                {activeImage.caption ? (
                  <figcaption className="text-center text-sm text-white/80">
                    {activeImage.caption}
                  </figcaption>
                ) : null}
              </figure>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

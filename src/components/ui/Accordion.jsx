import { useId, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { cn } from '../../lib/cn.js'

/**
 * Accordion — CIBLE School of Language.
 *
 * THE canonical accessible disclosure/accordion primitive for the SPA. It
 * renders a vertical stack of question/answer disclosures following the
 * WAI-ARIA Accordion (disclosure) pattern, and is composed by higher-level
 * components (`src/components/common/FAQ.jsx`) and the FAQ page
 * (`src/pages/Faq.jsx`).
 *
 * Accessibility (WCAG AA):
 * - Each trigger is a real `<button type="button">`, so native Enter/Space
 *   activation, focusability and disabled semantics come for free — no custom
 *   key handling on a non-interactive element.
 * - `aria-expanded` reflects the open state and `aria-controls` points at the
 *   panel; the panel is a labelled `role="region"` (`aria-labelledby` -> the
 *   trigger id) so assistive technology announces the relationship. Trigger and
 *   panel ids are scoped with a `useId()` prefix so they stay globally unique
 *   even when multiple accordions are rendered on the same page.
 * - Collapsed panels use the native `hidden` attribute (`hidden={!isOpen}`),
 *   which removes them from both the visual layout and the accessibility tree
 *   while keeping the `aria-controls` target present in the DOM.
 * - Each trigger is wrapped in a real heading element (configurable via
 *   `headingAs`, default `<h3>`) so the document outline stays correct; `m-0`
 *   prevents the heading's default margins from leaking into the layout.
 * - The disclosure chevron is decorative (`aria-hidden`) and rotates to signal
 *   state; hover feedback (`hover:bg-surface`) is background-based, never a
 *   color-only signal. A visible keyboard focus ring is rendered via
 *   `focus-visible:ring-*`. Reduced-motion is honored globally in
 *   `src/index.css`, so transitions are neutralized there with no extra work.
 *
 * Styling:
 * - Every value resolves to a Tailwind `@theme` brand token defined in
 *   `src/index.css` (border, surface, foreground, muted, primary-600,
 *   radius-2xl) on the 8px spacing scale — there are no hardcoded or arbitrary
 *   `[..]` values. Class composition (including the caller `className`, merged
 *   last so it can override) flows through the shared `cn()` helper.
 *
 * @param {object} props
 * @param {Array<{question?: string, answer?: React.ReactNode, title?: string, content?: React.ReactNode}>} [props.items=[]]
 *   Disclosure items. `{ question, answer }` is canonical; `{ title, content }`
 *   is also tolerated (read via `??`) so flexible FAQ data shapes work as-is.
 * @param {boolean} [props.allowMultiple=false] When `false` (default) only one
 *   panel is open at a time; when `true` any number may be open simultaneously.
 * @param {React.ElementType} [props.headingAs='h3'] Heading element that wraps
 *   each trigger button, chosen to fit the surrounding document outline.
 * @param {string} [props.className] Extra classes merged last onto the outer
 *   wrapper.
 * @returns {JSX.Element} The rendered accordion wrapper.
 */
function Accordion({ items = [], allowMultiple = false, headingAs: Heading = 'h3', className }) {
  const [openIndexes, setOpenIndexes] = useState(() => [])
  // Per-instance unique id prefix so trigger/panel ids stay globally unique when
  // several accordions render on the same page (valid HTML + correct
  // aria-controls / aria-labelledby resolution for assistive technology).
  const accordionId = useId()

  const toggle = (index) => {
    setOpenIndexes((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index)
      return allowMultiple ? [...prev, index] : [index]
    })
  }

  return (
    <div className={cn('divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white', className)}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index)
        const triggerId = `${accordionId}-trigger-${index}`
        const panelId = `${accordionId}-panel-${index}`
        const question = item.question ?? item.title
        const answer = item.answer ?? item.content
        return (
          <div key={triggerId}>
            <Heading className="m-0">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-base font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600"
              >
                <span>{question}</span>
                <FaChevronDown
                  aria-hidden="true"
                  className={cn('h-4 w-4 shrink-0 text-muted transition-transform duration-200', isOpen && 'rotate-180')}
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="px-6 pb-4 text-muted"
            >
              {answer}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion

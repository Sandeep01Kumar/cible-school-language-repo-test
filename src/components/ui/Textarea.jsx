import { useId } from 'react'
import { cn } from '../../lib/cn.js'

/**
 * Textarea — the canonical multi-line text field for the CIBLE School of
 * Language SPA.
 *
 * This is the single, reusable multi-line input primitive (project design
 * system, AAP §0.6.1 Group 6). It is the exact multi-line counterpart of the
 * `Input` primitive: same label / hint / error contract and identical
 * accessibility wiring, but it renders a native `<textarea>` and adds a `rows`
 * prop (no `type`). It is consumed by the site's forms — `ContactForm`
 * (message) and `AdmissionForm` (notes) — which drive validation with
 * `react-hook-form`.
 *
 * Styling is token-only (Tailwind v4 `@theme` tokens from `src/index.css`); no
 * arbitrary values are used and spacing follows the 8px scale. Because the
 * design system defines no dedicated "danger"/red family, error affordances
 * intentionally reuse the brand's secondary (orange) tokens
 * (`border-secondary-600`, `ring-secondary-600`, `text-secondary-700`).
 *
 * Accessibility (WCAG AA):
 * - The `<label>` is associated with the control via `htmlFor`/`id`; when no
 *   `id` is supplied a stable, unique one is generated with `useId`.
 * - `aria-invalid` is set only while an `error` is present.
 * - `aria-describedby` points at the error message when present, otherwise at
 *   the hint, so assistive technology announces exactly one helper string.
 * - The error message is a live region (`role="alert"`).
 * - The required marker (`*`) is decorative and hidden from assistive tech
 *   (`aria-hidden`); requiredness is conveyed to AT via the `required`
 *   attribute on the control.
 * - A visible `:focus-visible` ring is provided for keyboard users.
 *
 * Ref forwarding (React 19): `ref` is accepted as a regular prop and attached
 * directly to the `<textarea>`, which is what `react-hook-form`'s `register`
 * relies on to read and focus the field. (React 19 treats `ref` as a normal
 * prop for function components; `forwardRef` is an equivalent alternative.)
 *
 * @param {object} props - Component props.
 * @param {string} [props.id] - Explicit field id; when omitted a unique id is generated with `useId`.
 * @param {import('react').ReactNode} [props.label] - Visible label text; when omitted no `<label>` is rendered.
 * @param {import('react').ReactNode} [props.error] - Error message; when truthy the field is marked invalid and the message is shown as an alert.
 * @param {import('react').ReactNode} [props.hint] - Helper text shown only when there is no error.
 * @param {boolean} [props.required=false] - Marks the field required and renders a decorative `*` next to the label.
 * @param {number} [props.rows=4] - Number of visible text rows for the `<textarea>`.
 * @param {string} [props.className] - Extra classes for the wrapping `<div>`.
 * @param {string} [props.textareaClassName] - Extra classes for the `<textarea>` element itself.
 * @param {import('react').Ref<HTMLTextAreaElement>} [props.ref] - Ref attached to the `<textarea>` (used by `react-hook-form register`).
 * @param {object} [props....props] - Any other native `<textarea>` attributes (e.g. `name`, `onChange`, `onBlur`, `placeholder`, `maxLength`, `aria-label`) are spread onto the control.
 * @returns {import('react').ReactElement} The rendered field group (label, textarea, and hint/error text).
 */
function Textarea({ id, label, error, hint, required = false, rows = 4, className, textareaClassName, ref, ...props }) {
  const autoId = useId()
  const fieldId = id || autoId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const describedBy = cn(error && errorId, hint && !error && hintId) || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {required ? <span className="ml-1 text-secondary-600" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        ref={ref}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full resize-y rounded-md border border-border bg-white px-4 py-2 text-base text-foreground shadow-sm',
          'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-secondary-600 focus-visible:ring-secondary-600',
          textareaClassName,
        )}
        {...props}
      />
      {hint && !error ? <p id={hintId} className="text-xs text-muted">{hint}</p> : null}
      {error ? <p id={errorId} role="alert" className="text-xs font-medium text-secondary-700">{error}</p> : null}
    </div>
  )
}

export default Textarea

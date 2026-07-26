import { useId } from 'react'
import { cn } from '../../lib/cn.js'

/**
 * Input
 *
 * THE canonical single-line form field for the CIBLE School of Language SPA.
 * A thin, accessible wrapper around the native <input> that standardises label
 * association, helper/error messaging, focus styling and the ARIA wiring every
 * form control needs — so pages and forms never hand-roll raw <input> markup.
 *
 * react-hook-form integration (why `ref` and `...props` matter):
 * - Consumers (`forms/AdmissionForm`, `forms/ContactForm`, `common/Newsletter`)
 *   drive validation with react-hook-form by spreading `register('field', rules)`
 *   directly onto this component: `<Input {...register('email')} />`.
 * - `register()` returns `{ name, onChange, onBlur, ref }`. This component MUST
 *   therefore (a) forward `ref` to the native <input> so RHF can focus the field
 *   on validation error and read its value, and (b) spread `...props` so `name`,
 *   `onChange` and `onBlur` (plus `placeholder`, `autoComplete`, `aria-label`,
 *   `disabled`, etc.) reach the underlying <input>.
 * - React 19 lets function components accept `ref` as an ordinary prop, so no
 *   `React.forwardRef` wrapper is required — `ref` is destructured and attached
 *   to the <input> directly.
 *
 * Accessibility (WCAG AA):
 * - Programmatic label/field association via `htmlFor`/`id`. An explicit `id`
 *   prop is honoured; otherwise a stable, collision-free id is generated with
 *   `useId()` (unique across multiple instances on the same page).
 * - When `label` is omitted, callers MUST provide an accessible name via
 *   `aria-label` (or `aria-labelledby`) through `...props`.
 * - `aria-invalid` is set to `true` ONLY while an `error` is present (it is
 *   omitted — never `false` — otherwise). `aria-describedby` points at the
 *   error message when invalid, or at the hint when valid, and is `undefined`
 *   when neither exists. The error message uses `role="alert"` so assistive
 *   technology announces it as it appears.
 * - A visible keyboard focus ring is applied via `focus-visible` (brand primary
 *   in the rest state, brand secondary/orange in the error state).
 * - The required marker `*` is decorative (`aria-hidden`); the requirement is
 *   conveyed programmatically by the native `required` attribute.
 *
 * Error colour rationale:
 * - The brand palette (blue / orange / green) intentionally has NO red/danger
 *   token, so error affordances standardise on the SECONDARY (orange) scale:
 *   `border-secondary-600`, focus `ring-secondary-600`, message
 *   `text-secondary-700` (AA on white) and the required `*` in
 *   `text-secondary-600`. No red/hex or arbitrary values are introduced.
 *
 * @param {object} props
 * @param {string} [props.id] Explicit input id; auto-generated via useId when omitted.
 * @param {import('react').ReactNode} [props.label] Visible label text (strongly recommended for a11y).
 * @param {string} [props.error] Error message; when truthy enables error styling + ARIA wiring.
 * @param {import('react').ReactNode} [props.hint] Helper text shown only when there is no error.
 * @param {boolean} [props.required=false] Sets the native `required` attribute and renders a visual `*`.
 * @param {string} [props.type='text'] Native input type (e.g. 'text', 'email', 'tel').
 * @param {string} [props.className] Extra classes for the wrapping <div> (merged last).
 * @param {string} [props.inputClassName] Extra classes for the <input> element itself.
 * @param {import('react').Ref<HTMLInputElement>} [props.ref] Forwarded to the native <input> (react-hook-form).
 * @param {object} props... Remaining props spread onto the <input> (name/onChange/onBlur/placeholder/autoComplete/...).
 * @returns {import('react').ReactElement} The labelled, accessible input field.
 */
function Input({ id, label, error, hint, required = false, type = 'text', className, inputClassName, ref, ...props }) {
  const autoId = useId()
  const inputId = id || autoId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const describedBy = cn(error && errorId, hint && !error && hintId) || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {required ? <span className="ml-1 text-secondary-600" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        ref={ref}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-md border border-border bg-white px-4 py-2 text-base text-foreground shadow-sm',
          'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-secondary-600 focus-visible:ring-secondary-600',
          inputClassName,
        )}
        {...props}
      />
      {hint && !error ? <p id={hintId} className="text-xs text-muted">{hint}</p> : null}
      {error ? <p id={errorId} role="alert" className="text-xs font-medium text-secondary-700">{error}</p> : null}
    </div>
  )
}

export default Input

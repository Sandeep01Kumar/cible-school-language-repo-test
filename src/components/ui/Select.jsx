/**
 * Select — the canonical dropdown field for the CIBLE School of Language SPA.
 * ----------------------------------------------------------------------------
 * A single, reusable form primitive that renders a NATIVE `<select>` element so
 * it inherits the browser's built-in keyboard interaction and assistive-tech
 * support (arrow keys, type-ahead, screen-reader option announcement) for free —
 * no custom listbox widget, no ARIA re-implementation, no focus-trap bugs.
 *
 * It mirrors the `Input` primitive's label / hint / error / `required` contract
 * exactly so the two compose interchangeably inside forms (notably the
 * admission and contact forms), keeping the field UI consistent across the site.
 *
 * Design-system compliance (Tailwind v4 tokens from `src/index.css`):
 *   • Surface   : `bg-white`, `border-border`, `rounded-md`, `shadow-sm`.
 *   • Text      : `text-foreground` (values) / `text-muted` (hint).
 *   • Focus     : visible brand ring — `focus-visible:ring-2 ring-primary-600`.
 *   • Error     : the palette intentionally has NO red, so error affordances use
 *                 the SECONDARY (orange) scale — `border-secondary-600`,
 *                 `ring-secondary-600`, `text-secondary-700`.
 *   • Spacing   : 8px scale (`gap-2` = 8px, `px-4` = 16px, `py-2` = 8px),
 *                 matching the Input/Textarea field primitives so all form
 *                 controls align. No arbitrary values — every class resolves to
 *                 a theme token or a native Tailwind utility.
 *
 * react-hook-form usage:
 *   The DOM node is exposed via `ref` (React 19 ref-as-prop), and `name` /
 *   `onChange` / `onBlur` flow through `...props`, so a field registers with a
 *   single spread:
 *
 *     <Select
 *       label="Course of interest"
 *       placeholder="Select a course"
 *       required
 *       options={courses.map((c) => ({ value: c.slug, label: c.title }))}
 *       error={errors.course?.message}
 *       {...register('course', { required: 'Please choose a course' })}
 *     />
 *
 *   When a `placeholder` is supplied it becomes a DISABLED, empty-value first
 *   option and the control defaults to it, so a `required` field that is never
 *   touched submits `''` and fails validation as intended.
 * ----------------------------------------------------------------------------
 */

import { useId } from 'react'
import { cn } from '../../lib/cn.js'

/**
 * @param {Object} props
 * @param {string} [props.id] - Explicit id; falls back to a generated `useId`.
 * @param {import('react').ReactNode} [props.label] - Visible field label.
 * @param {string} [props.error] - Error message; when present, shows the orange
 *   error affordances, sets `aria-invalid`, and renders a `role="alert"` message.
 * @param {import('react').ReactNode} [props.hint] - Helper text shown only when
 *   there is no error.
 * @param {boolean} [props.required=false] - Marks the field required (adds the
 *   native `required` attribute and a visual asterisk on the label).
 * @param {Array<{ value: string|number, label: import('react').ReactNode }>} [props.options=[]]
 *   - Option data mapped to `<option>` elements when no `children` are provided.
 * @param {string} [props.placeholder] - Optional prompt rendered as a disabled,
 *   empty-value first option so an unselected required field fails validation.
 * @param {string} [props.className] - Extra classes for the outer wrapper.
 * @param {string} [props.selectClassName] - Extra classes for the `<select>`.
 * @param {import('react').Ref<HTMLSelectElement>} [props.ref] - Forwarded to the
 *   native `<select>` (required by react-hook-form's `register`).
 * @param {import('react').ReactNode} [props.children] - Optional `<option>`
 *   elements passed directly; when present they take precedence over `options`.
 * @returns {import('react').ReactElement}
 */
function Select({
  id,
  label,
  error,
  hint,
  required = false,
  options = [],
  placeholder,
  className,
  selectClassName,
  ref,
  children,
  ...props
}) {
  // Hooks must run unconditionally at the top level (react/rules-of-hooks).
  const autoId = useId()
  const fieldId = id || autoId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  // Point `aria-describedby` at whichever helper is actually rendered: the error
  // when present, otherwise the hint. `cn` drops the falsy branch and yields ''
  // when neither applies, which we normalise to `undefined` so the attribute is
  // omitted entirely rather than emitted empty.
  const describedBy = cn(error && errorId, hint && !error && hintId) || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {required ? (
            <span className="ml-1 text-secondary-600" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <select
        id={fieldId}
        ref={ref}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        defaultValue={placeholder ? '' : undefined}
        className={cn(
          'w-full rounded-md border border-border bg-white px-4 py-2 text-base text-foreground shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-secondary-600 focus-visible:ring-secondary-600',
          selectClassName,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>

      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-secondary-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default Select

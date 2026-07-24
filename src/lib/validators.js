/**
 * Form validation helpers for the CIBLE School of Language website.
 *
 * Pure, side-effect-free utilities used by the site's forms — `AdmissionForm`,
 * `ContactForm`, and the `Newsletter` signup — which drive validation with
 * `react-hook-form`. Every export here is deterministic (same input always
 * yields the same output), performs no I/O, and contains no React, JSX, or
 * hooks, which keeps the module trivially compliant with the project's lint
 * rules and safe to import anywhere.
 *
 * The email check is a practical, RFC-lite pattern (not a full RFC 5322
 * grammar), and the phone check targets Indian mobile numbers: the ten-digit
 * subscriber core must begin with a digit from 6 to 9. User-entered phone
 * strings are first normalized (see {@link normalizePhone}) so common formats
 * such as `+91`, spaces, hyphens, and parentheses are accepted transparently.
 *
 * All values are exported by name; there is no default export. Generic,
 * India-appropriate messages live here; brand and contact details belong in
 * the site configuration module, not in this file.
 *
 * @module lib/validators
 */

/**
 * Practical, RFC-lite email pattern.
 *
 * Matches a local part of one or more non-space, non-`@` characters, a single
 * `@`, a domain label of one or more non-space, non-`@` characters, a literal
 * dot, and a top-level domain of one or more non-space, non-`@` characters.
 * This intentionally rejects spaces, missing dots, and empty labels while
 * staying permissive enough for real-world addresses.
 *
 * @type {RegExp}
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Ten-digit Indian mobile core pattern.
 *
 * The first digit must be in the range 6 to 9, followed by exactly nine more
 * digits. Apply this to the value returned by {@link normalizePhone}, never to
 * raw user input, so that country codes and separators are stripped first.
 *
 * @type {RegExp}
 */
export const PHONE_REGEX = /^[6-9]\d{9}$/

/**
 * Reduce a user-entered phone string to its ten-digit subscriber core.
 *
 * Removes every non-digit character (so `+`, spaces, hyphens, and parentheses
 * are dropped), then strips a leading country or trunk prefix:
 * - a twelve-digit value beginning with `91` loses the `91` country code, and
 * - an eleven-digit value beginning with `0` loses the leading trunk `0`.
 *
 * Any non-string input yields an empty string, so callers never have to guard
 * against `null`, `undefined`, or numeric values themselves.
 *
 * @param {unknown} value - The raw phone value, typically a form field string.
 * @returns {string} The normalized digits (ideally ten), or `''` for non-strings.
 */
export function normalizePhone(value) {
  if (typeof value !== 'string') return ''
  let digits = value.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

/**
 * Determine whether a value is a syntactically valid email address.
 *
 * Non-string input returns `false`. Strings are trimmed of surrounding
 * whitespace before being tested against {@link EMAIL_REGEX}.
 *
 * @param {unknown} value - The candidate email, typically a form field string.
 * @returns {boolean} `true` when the trimmed value matches the email pattern.
 */
export function isValidEmail(value) {
  if (typeof value !== 'string') return false
  return EMAIL_REGEX.test(value.trim())
}

/**
 * Determine whether a value is a valid Indian mobile number.
 *
 * The input is normalized with {@link normalizePhone} — accepting `+91`,
 * spaces, hyphens, parentheses, and a leading trunk `0` — and the resulting
 * ten-digit core is tested against {@link PHONE_REGEX}. Non-string input
 * normalizes to `''`, which fails the pattern and returns `false`.
 *
 * @param {unknown} value - The candidate phone value, typically a form field string.
 * @returns {boolean} `true` when the normalized value is a valid 10-digit mobile core.
 */
export function isValidPhone(value) {
  return PHONE_REGEX.test(normalizePhone(value))
}

/**
 * Build a `react-hook-form` "required" rule object.
 *
 * Spread the result into a field's registration options to make the field
 * mandatory and surface the given message when it is empty, for example
 * `register('name', requiredRule('Name is required'))`.
 *
 * @param {string} [message='This field is required'] - The message shown when the field is empty.
 * @returns {{ required: string }} A rule object consumable by `react-hook-form`.
 */
export const requiredRule = (message = 'This field is required') => ({ required: message })

/**
 * Ready-made `react-hook-form` rules for an email field.
 *
 * Marks the field as required and validates its content with
 * {@link isValidEmail}. The `validate` function follows the `react-hook-form`
 * contract: it returns `true` when the value is valid, or the error-message
 * string when it is not, so the form can render a field-level error.
 *
 * @type {{ required: string, validate: (value: unknown) => true | string }}
 */
export const emailRules = {
  required: 'Email is required',
  validate: (value) => isValidEmail(value) || 'Enter a valid email address',
}

/**
 * Ready-made `react-hook-form` rules for a phone field.
 *
 * Marks the field as required and validates its content with
 * {@link isValidPhone}. The `validate` function returns `true` when the value
 * is a valid Indian mobile number, or the error-message string otherwise, per
 * the `react-hook-form` field-level error contract.
 *
 * @type {{ required: string, validate: (value: unknown) => true | string }}
 */
export const phoneRules = {
  required: 'Phone number is required',
  validate: (value) => isValidPhone(value) || 'Enter a valid 10-digit Indian mobile number',
}

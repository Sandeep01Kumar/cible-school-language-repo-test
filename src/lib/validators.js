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
 * Matches a local part, a single `@`, a domain label, a literal dot, and a
 * top-level domain of at least two characters. In addition to rejecting spaces
 * and `@` inside labels, the character class explicitly excludes the angle
 * brackets `<` and `>` so markup- or script-like strings (for example
 * `<script>@evil.com`) can never satisfy the pattern — hardening the field
 * against CWE-20 style injection payloads while staying permissive enough for
 * real-world addresses. Length is bounded separately by {@link MAX_LENGTHS}.
 *
 * @type {RegExp}
 */
export const EMAIL_REGEX = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/

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
 * Allowed-character pattern for a RAW phone string, applied BEFORE normalization.
 *
 * A phone entry may contain only digits, spaces, and the conventional grouping
 * characters `+`, `(`, `)`, and `-`. This defines the explicit phone-input
 * policy (QA Issue 24): because {@link normalizePhone} strips every non-digit,
 * a permissive input such as `"9899a315093"` would otherwise have its embedded
 * letter silently discarded and pass as a valid number. Rejecting any string
 * that contains a character outside this set closes that gap while still
 * transparently accepting real-world formats like `+91 98993-15093` or
 * `(0)9899315093`. Apply to the trimmed value.
 *
 * @type {RegExp}
 */
export const PHONE_INPUT_REGEX = /^[\d\s+()-]+$/

/**
 * Per-field maximum character lengths for user-entered form values.
 *
 * These caps prevent a single field — or the assembled WhatsApp / `mailto:`
 * handoff URL built from them — from ballooning into a multi-thousand-character
 * payload (the CWE-20 concern raised in review). Forms apply them both as the
 * native `maxLength` attribute on the `<input>`/`<textarea>` (a hard UI cap)
 * and as `react-hook-form` `maxLength` rules (a validated cap), and may use
 * {@link truncate} as a final defensive clamp when constructing the handoff
 * string. The `email` bound follows the RFC 5321 maximum address length.
 *
 * @type {Readonly<{name: number, email: number, phone: number, subject: number, message: number}>}
 */
export const MAX_LENGTHS = Object.freeze({
  name: 80,
  email: 254,
  phone: 20,
  subject: 120,
  message: 1000,
})

/**
 * Allowed-character pattern for a person's name.
 *
 * The value must begin with a Unicode letter and may then contain further
 * Unicode letters, combining marks (so Devanagari and other Indic scripts with
 * matras are accepted), spaces, and the punctuation commonly found in names —
 * period, apostrophe, and hyphen. Digits, angle brackets, and other symbols are
 * rejected, which blocks script-like or numeric noise while remaining
 * script-agnostic for the institute's multilingual audience. Apply to the
 * trimmed value; length is bounded separately by {@link MAX_LENGTHS}.
 *
 * @type {RegExp}
 */
export const NAME_REGEX = /^[\p{L}][\p{L}\p{M} .'-]*$/u

/**
 * Determine whether a value is a non-empty string once surrounding whitespace
 * is removed.
 *
 * This is the trim-aware emptiness check used across the rule builders so that
 * whitespace-only submissions (spaces, tabs, newlines) are treated as empty and
 * rejected, closing the "whitespace-only names pass" gap identified in review.
 *
 * @param {unknown} value - The candidate value, typically a form field string.
 * @returns {boolean} `true` when `value` is a string with visible characters.
 */
export function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Defensively clamp a string to at most `max` characters.
 *
 * Used by forms as a last-line safeguard when assembling the WhatsApp / mail
 * handoff message, so that even if a field somehow bypassed its validated cap
 * the outbound URL can never exceed a sane length. Non-string input yields `''`.
 *
 * @param {unknown} value - The value to clamp.
 * @param {number} max - The maximum number of characters to retain.
 * @returns {string} The original string, or its first `max` characters.
 */
export function truncate(value, max) {
  if (typeof value !== 'string') return ''
  return value.length > max ? value.slice(0, max) : value
}

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
 * returns `false`. As a guard against the "overly permissive" normalization
 * flagged in review, the raw value is rejected outright BEFORE normalization
 * when it (a) exceeds {@link MAX_LENGTHS.phone} characters, or (b) contains any
 * character outside the explicit {@link PHONE_INPUT_REGEX} policy set (digits,
 * spaces, and `+ ( ) -`). Guard (b) closes the gap where an embedded letter —
 * e.g. `"9899a315093"` — would previously be stripped by normalization and
 * pass; such inputs are now rejected rather than silently "corrected".
 *
 * @param {unknown} value - The candidate phone value, typically a form field string.
 * @returns {boolean} `true` when the normalized value is a valid 10-digit mobile core.
 */
export function isValidPhone(value) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > MAX_LENGTHS.phone) return false
  // Explicit input policy (QA Issue 24): reject any raw string containing a
  // character outside [digits, whitespace, + ( ) -] BEFORE normalization, so an
  // embedded letter/symbol can never be silently discarded into a valid core.
  if (!PHONE_INPUT_REGEX.test(trimmed)) return false
  return PHONE_REGEX.test(normalizePhone(trimmed))
}

/**
 * Build a `react-hook-form` "required" rule object.
 *
 * Spread the result into a field's registration options to make the field
 * mandatory and surface the given message when it is empty, for example
 * `register('name', requiredRule('Name is required'))`. In addition to the
 * native `required` check (which rejects an empty string), the rule adds a
 * trim-aware `validate` so that whitespace-only input — spaces, tabs, or
 * newlines — is also rejected rather than accepted as a "present" value.
 *
 * @param {string} [message='This field is required'] - The message shown when the field is empty or blank.
 * @returns {{ required: string, validate: (value: unknown) => true | string }} A rule object consumable by `react-hook-form`.
 */
export const requiredRule = (message = 'This field is required') => ({
  required: message,
  validate: (value) => isNonEmpty(value) || message,
})

/**
 * Ready-made `react-hook-form` rules for an email field.
 *
 * Marks the field as required and validates its content with
 * {@link isValidEmail}. The `validate` function follows the `react-hook-form`
 * contract: it returns `true` when the value is valid, or the error-message
 * string when it is not, so the form can render a field-level error. A
 * `maxLength` rule caps the field at {@link MAX_LENGTHS.email} characters.
 *
 * @type {{ required: string, maxLength: { value: number, message: string }, validate: (value: unknown) => true | string }}
 */
export const emailRules = {
  required: 'Email is required',
  maxLength: { value: MAX_LENGTHS.email, message: `Email must be ${MAX_LENGTHS.email} characters or fewer` },
  validate: (value) => isValidEmail(value) || 'Enter a valid email address',
}

/**
 * Ready-made `react-hook-form` rules for a phone field.
 *
 * Marks the field as required and validates its content with
 * {@link isValidPhone}. The `validate` function returns `true` when the value
 * is a valid Indian mobile number, or the error-message string otherwise, per
 * the `react-hook-form` field-level error contract. A `maxLength` rule caps the
 * field at {@link MAX_LENGTHS.phone} characters.
 *
 * @type {{ required: string, maxLength: { value: number, message: string }, validate: (value: unknown) => true | string }}
 */
export const phoneRules = {
  required: 'Phone number is required',
  maxLength: { value: MAX_LENGTHS.phone, message: 'Phone number is too long' },
  validate: (value) => isValidPhone(value) || 'Enter a valid 10-digit Indian mobile number',
}

/**
 * Build `react-hook-form` rules for a person's name field.
 *
 * Combines a required check, a {@link MAX_LENGTHS.name} length cap, and a set of
 * named `validate` predicates that (a) reject whitespace-only input, (b) enforce
 * the {@link NAME_REGEX} allowed-character set on the trimmed value, and (c)
 * require at least two visible characters. Together these close the
 * "whitespace-only names pass" and "no allowed-character validation" gaps.
 *
 * @param {string} [message='Enter your full name'] - Message for the empty/blank case.
 * @returns {object} A rule object consumable by `react-hook-form`.
 */
export const nameRules = (message = 'Enter your full name') => ({
  required: message,
  maxLength: { value: MAX_LENGTHS.name, message: `Name must be ${MAX_LENGTHS.name} characters or fewer` },
  validate: {
    notBlank: (value) => isNonEmpty(value) || message,
    minLength: (value) =>
      (typeof value === 'string' && value.trim().length >= 2) || 'Name must be at least 2 characters',
    allowedChars: (value) =>
      (typeof value === 'string' && NAME_REGEX.test(value.trim())) ||
      "Use letters, spaces, and . ' - only",
  },
})

/**
 * Build `react-hook-form` rules for a free-text subject line.
 *
 * Required, trim-aware (rejects whitespace-only), and capped at
 * {@link MAX_LENGTHS.subject} characters.
 *
 * @param {string} [message='Enter a subject'] - Message for the empty/blank case.
 * @returns {object} A rule object consumable by `react-hook-form`.
 */
export const subjectRules = (message = 'Enter a subject') => ({
  required: message,
  maxLength: { value: MAX_LENGTHS.subject, message: `Subject must be ${MAX_LENGTHS.subject} characters or fewer` },
  validate: (value) => isNonEmpty(value) || message,
})

/**
 * Build `react-hook-form` rules for a multi-line message / free-text body.
 *
 * By default the field is required (trim-aware) and capped at
 * {@link MAX_LENGTHS.message} characters. Pass `{ required: false }` for an
 * optional body that is still length-capped when present.
 *
 * @param {{ required?: boolean, max?: number, message?: string }} [options]
 * @returns {object} A rule object consumable by `react-hook-form`.
 */
export const messageRules = ({
  required = true,
  max = MAX_LENGTHS.message,
  message = 'Please enter a message',
} = {}) => {
  const rule = {
    maxLength: { value: max, message: `Please keep this to ${max} characters or fewer` },
    validate: (value) => (required ? isNonEmpty(value) || message : true),
  }
  if (required) rule.required = message
  return rule
}

/**
 * Build a `react-hook-form` allowlist ("one of") rule.
 *
 * Ensures the submitted value is a member of a known, server-defined set — used
 * for the course and batch selects so a tampered or stale option cannot be
 * submitted (the "no form-level allowlists" gap). When `required` is `true`
 * (the default) an empty value fails; when `false`, an empty value is accepted
 * but any non-empty value must still be a member of `allowed`.
 *
 * @param {Array<string>} allowed - The permitted values.
 * @param {string} [message='Select a valid option'] - Message for an invalid/empty selection.
 * @param {{ required?: boolean }} [options]
 * @returns {object} A rule object consumable by `react-hook-form`.
 */
export const oneOfRule = (allowed, message = 'Select a valid option', { required = true } = {}) => {
  const list = Array.isArray(allowed) ? allowed : []
  const rule = {
    validate: (value) => {
      if (!required && (value === '' || value === null || value === undefined)) return true
      return list.includes(value) || message
    },
  }
  if (required) rule.required = message
  return rule
}

/**
 * AdmissionForm — the primary admission-inquiry conversion form for the CIBLE
 * School of Language SPA (AAP §0.6.1 Group 9; forms/ file #1).
 *
 * A single functional component (DEFAULT export) that composes the canonical
 * `ui/*` field primitives (`Input` / `Select` / `Textarea` / `Button` /
 * `Spinner`) and drives validation with `react-hook-form`. Because the site is
 * client-only with NO backend (AAP §0.7.2), a submission does not POST anywhere:
 * it opens a PRE-FILLED WhatsApp deep link (primary) or a `mailto:` link
 * (secondary) composed from the field values, so the visitor lands in their
 * messaging app with the inquiry ready to send. Every contact endpoint is read
 * from `siteConfig` — nothing is hardcoded.
 *
 * The component renders the four required UX states:
 *   • empty      — the pristine `idle` render (blank fields, no errors/success).
 *   • loading    — `submitting`: submit controls disabled, an inline `Spinner`,
 *                  and the WhatsApp button label switches to “Sending…”.
 *   • error      — a form-level `role="alert"` message (field-level errors are
 *                  rendered inside each primitive).
 *   • success    — a confirmation panel that programmatically receives focus.
 *
 * Accessibility (WCAG AA): every field has a programmatic `<label>` (via the
 * primitive's `label` prop), invalid fields expose `aria-invalid` + a
 * `role="alert"` message (via the `error` prop), a failed submit auto-focuses
 * the first invalid field (react-hook-form default `shouldFocusError`), and a
 * successful submit moves focus to the success panel. Icons are `aria-hidden`
 * because the adjacent text label conveys meaning.
 *
 * @param {object} [props] Component props.
 * @param {string} [props.className] Extra classes merged LAST onto the root
 *   element so pages can place the form in different layouts.
 * @param {string} [props.defaultCourse] Optional course TITLE used to preselect
 *   the “Course of Interest” select (e.g. when opened from a course page).
 * @returns {import('react').ReactElement} The admission inquiry form, or the
 *   success confirmation panel once an inquiry has been dispatched.
 */
import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'
import { cn } from '../../lib/cn.js'
import { requiredRule, emailRules, phoneRules } from '../../lib/validators.js'
import { siteConfig } from '../../data/siteConfig.js'
import { courses } from '../../data/courses.js'

// Preferred-batch options. Module-local (NOT exported) so the module exposes
// only the default component export and stays clean under the enforced
// `react/only-export-components` lint rule.
const batchOptions = [
  { value: 'Morning', label: 'Morning' },
  { value: 'Afternoon', label: 'Afternoon' },
  { value: 'Evening', label: 'Evening' },
  { value: 'Weekend', label: 'Weekend' },
]

// Subject line for the mailto: channel. Module-local (NOT exported).
const EMAIL_SUBJECT = 'Admission Inquiry — CIBLE School of Language'

// Compose the human-readable inquiry body from the validated field values.
// Optional fields (batch / message) are dropped when empty via `filter(Boolean)`
// so the message never contains blank lines. Module-local (NOT exported).
const buildMessage = (data) =>
  [
    'New Admission Inquiry — CIBLE School of Language',
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Course: ${data.course}`,
    data.batch ? `Preferred Batch: ${data.batch}` : null,
    data.message ? `Notes: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')

function AdmissionForm({ className, defaultCourse } = {}) {
  // --- Hooks: ALL declared at the top level, before any conditional return,
  // so react/rules-of-hooks holds even with the early `success` return below.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      course: defaultCourse || '',
      batch: '',
      message: '',
    },
  })

  // Four-state machine: 'idle'(empty) | 'submitting'(loading) | 'success' | 'error'.
  const [status, setStatus] = useState('idle')
  const successRef = useRef(null)
  const isSubmitting = status === 'submitting'

  // Move keyboard focus to the confirmation panel once the inquiry is dispatched
  // so screen-reader and keyboard users are taken straight to the result.
  useEffect(() => {
    if (status === 'success' && successRef.current) successRef.current.focus()
  }, [status])

  // Course options come from the single source of truth (data/courses.js) — the
  // 10 course titles — never hardcoded here.
  const courseOptions = courses.map((c) => ({ value: c.title, label: c.title }))

  // Build the submit handler for a given channel. `handleSubmit` validates first
  // and only calls this with `data` when every field passes, so empty/invalid
  // input surfaces field errors and blocks dispatch.
  //
  // CRITICAL: the link is opened SYNCHRONOUSLY inside the handler to preserve the
  // user gesture (otherwise the WhatsApp tab is popup-blocked). Only AFTER the
  // link is opened do we flip to `success` on a short, honest delay so the
  // loading state is observable — there is no fake network latency and no
  // fetch/XHR anywhere.
  const sendInquiry = (channel) => (data) => {
    try {
      const text = buildMessage(data)
      setStatus('submitting')
      if (channel === 'email') {
        window.location.href = `${siteConfig.emailHref}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(text)}`
      } else {
        window.open(`${siteConfig.whatsappHref}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
      }
      window.setTimeout(() => {
        setStatus('success')
        reset()
      }, 500)
    } catch {
      setStatus('error')
    }
  }

  // --- SUCCESS state: a confirmation panel that receives focus. Rendered
  // instead of the form; all hooks above have already run, so this early return
  // is safe.
  if (status === 'success') {
    return (
      <div className={cn('flex flex-col items-start gap-4 rounded-2xl border border-border bg-accent-50 p-6', className)}>
        <div ref={successRef} tabIndex={-1} role="status" className="focus-visible:outline-none">
          <h3 className="text-xl font-bold text-accent-800">Thank you! Your inquiry is on its way.</h3>
          <p className="mt-2 text-muted">
            We&rsquo;ve opened WhatsApp / your email with your details pre-filled — just press send and our team will reach
            out shortly. If nothing opened, contact us directly below.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={siteConfig.whatsappHref} variant="accent" size="sm">
            <FaWhatsapp aria-hidden="true" />
            WhatsApp Us
          </Button>
          <Button href={siteConfig.phoneHref} variant="secondary" size="sm">
            Call Now
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setStatus('idle')}>
            Submit another inquiry
          </Button>
        </div>
      </div>
    )
  }

  // --- EMPTY / LOADING / ERROR states all render the form. `noValidate` hands
  // validation messaging entirely to react-hook-form's accessible output rather
  // than the browser's native bubbles.
  return (
    <form noValidate onSubmit={handleSubmit(sendInquiry('whatsapp'))} className={cn('flex flex-col gap-6', className)}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Full Name"
          type="text"
          required
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName', requiredRule('Please enter your full name'))}
        />
        <Input
          label="Phone Number"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone', phoneRules)}
        />
        <Input
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', emailRules)}
        />
        <Select
          label="Course of Interest"
          required
          placeholder="Select a course"
          options={courseOptions}
          error={errors.course?.message}
          {...register('course', requiredRule('Please select a course'))}
        />
        <Select
          label="Preferred Batch"
          placeholder="Select a batch (optional)"
          options={batchOptions}
          {...register('batch')}
        />
      </div>

      <Textarea
        label="Message / Notes"
        rows={4}
        placeholder="Tell us anything else (optional)"
        {...register('message')}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
            <FaWhatsapp aria-hidden="true" />
            {isSubmitting ? 'Sending…' : 'Send via WhatsApp'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmit(sendInquiry('email'))}
            className="w-full sm:w-auto"
          >
            <FaEnvelope aria-hidden="true" />
            Send via Email
          </Button>
        </div>

        {isSubmitting ? <Spinner size="sm" className="justify-start py-0" /> : null}

        {status === 'error' ? (
          <p role="alert" className="text-sm font-medium text-secondary-700">
            Something went wrong opening your messaging app. Please call or WhatsApp us directly.
          </p>
        ) : null}
      </div>
    </form>
  )
}

export default AdmissionForm

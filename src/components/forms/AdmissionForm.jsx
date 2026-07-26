/**
 * AdmissionForm — the primary admission-inquiry conversion form for the CIBLE
 * School of Language SPA (AAP §0.6.1 Group 9; forms/ file #1).
 *
 * A single functional component (DEFAULT export) that composes the canonical
 * `ui/*` field primitives (`Input` / `Select` / `Textarea` / `Button`) and
 * drives validation with `react-hook-form`. Because the site is client-only
 * with NO backend (AAP §0.7.2), a submission does not POST anywhere: it opens a
 * PRE-FILLED WhatsApp deep link (primary) or a `mailto:` link (secondary)
 * composed from the field values, so the visitor lands in their messaging app
 * with the inquiry ready to send. Every contact endpoint is read from
 * `siteConfig` — nothing is hardcoded.
 *
 * Truthful handoff (M04): opening a pre-filled draft is NOT a send. The form
 * therefore never claims the inquiry was received. After the draft opens it
 * shows a "ready to send" panel that tells the visitor to press Send in their
 * messaging app, keeps their typed values (no `reset()`, so recovery data
 * survives), and offers a directly clickable link to re-open the same
 * pre-filled draft. If the browser blocks the WhatsApp tab, a `role="alert"`
 * recovery panel surfaces the pre-filled link instead of a false success.
 *
 * No manufactured latency (M05): the deep link is opened SYNCHRONOUSLY inside
 * the submit handler (preserving the user gesture so the tab is not
 * popup-blocked); there is no artificial `setTimeout`, no fetch/XHR, and hence
 * no timer to leak across unmount. A `submittingRef` guards against a
 * double-submit dispatching two drafts.
 *
 * Bounded, allow-listed input (M06): field values are trimmed, character- and
 * length-constrained by the shared rules in `lib/validators.js` (name pattern,
 * email/phone validation, course/batch allowlists), carry native `maxLength`
 * caps, and the assembled handoff text is clamped to a total-channel limit so
 * the outbound URL can never balloon into a multi-thousand-character payload.
 *
 * Privacy at the point of handoff (M07): a disclosure adjacent to the submit
 * controls explains that the entered details are passed to WhatsApp/Meta or the
 * visitor's email provider under their terms, that CIBLE only receives them
 * when the visitor presses Send, and asks under-18 visitors to involve a
 * parent/guardian — linking to the Privacy Policy.
 *
 * Course sync (M24): when the `defaultCourse` prop changes (e.g. navigating
 * from `/admission?course=X` to `/admission`), the "Course of Interest" value
 * is reset to the new validated course (or cleared), so a stale selection can
 * never be submitted for the wrong course.
 *
 * Accessibility (WCAG AA): every field has a programmatic `<label>` (via the
 * primitive's `label` prop), invalid fields expose `aria-invalid` + a
 * `role="alert"` message (via the `error` prop), a failed submit auto-focuses
 * the first invalid field (react-hook-form default `shouldFocusError`), and the
 * result panel programmatically receives focus. Icons are `aria-hidden` because
 * the adjacent text label conveys meaning.
 *
 * @param {object} [props] Component props.
 * @param {string} [props.className] Extra classes merged LAST onto the root
 *   element so pages can place the form in different layouts.
 * @param {string} [props.defaultCourse] Optional course TITLE used to preselect
 *   the “Course of Interest” select (e.g. when opened from a course page). It is
 *   validated against the known course list; an unknown value is ignored.
 * @returns {import('react').ReactElement} The admission inquiry form, or the
 *   "ready to send" panel once a pre-filled draft has been opened.
 */
import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import { cn } from '../../lib/cn.js'
import {
  nameRules,
  emailRules,
  phoneRules,
  messageRules,
  oneOfRule,
  truncate,
  MAX_LENGTHS,
} from '../../lib/validators.js'
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

// Allowlists derived ONCE from the single sources of truth so `oneOfRule` can
// reject a tampered/stale <option> (M06) and the M24 course-sync effect can
// validate `defaultCourse`. Module-local (NOT exported); stable across renders.
const courseTitles = courses.map((c) => c.title)
const courseOptions = courseTitles.map((title) => ({ value: title, label: title }))
const batchValues = batchOptions.map((o) => o.value)

// Subject line for the mailto: channel. Module-local (NOT exported).
const EMAIL_SUBJECT = 'Admission Inquiry — CIBLE School of Language'

// Total-channel cap (M06): a final, defensive clamp on the ASSEMBLED handoff
// body, on top of the per-field caps, so the outbound WhatsApp/mailto URL is
// hard-bounded and can never become a multi-thousand-character payload.
const MAX_CHANNEL_TEXT = 1600

// Compose the human-readable inquiry body from the validated field values.
// Each interpolated value is defensively clamped with `truncate` (M06) even
// though the fields are already validated/capped. Optional fields (batch /
// message) are dropped when empty via `filter(Boolean)` so the message never
// contains blank lines. Module-local (NOT exported).
const buildMessage = (data) =>
  [
    'New Admission Inquiry — CIBLE School of Language',
    `Name: ${truncate(data.fullName, MAX_LENGTHS.name)}`,
    `Phone: ${truncate(data.phone, MAX_LENGTHS.phone)}`,
    `Email: ${truncate(data.email, MAX_LENGTHS.email)}`,
    `Course: ${truncate(data.course, MAX_LENGTHS.subject)}`,
    data.batch ? `Preferred Batch: ${truncate(data.batch, MAX_LENGTHS.subject)}` : null,
    data.message ? `Notes: ${truncate(data.message, MAX_LENGTHS.message)}` : null,
  ]
    .filter(Boolean)
    .join('\n')

function AdmissionForm({ className, defaultCourse } = {}) {
  // --- Hooks: ALL declared at the top level, before any conditional return,
  // so react/rules-of-hooks holds even with the early result returns below.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    // Keep field values in the RHF store when inputs unmount (the result panel
    // replaces the form), so returning to the form preserves recovery data (M04).
    shouldUnregister: false,
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      course: courseTitles.includes(defaultCourse) ? defaultCourse : '',
      batch: '',
      message: '',
    },
  })

  // Four honest states: 'idle'(empty/form) | 'opened'(draft opened, awaiting the
  // user's Send) | 'blocked'(browser blocked the WhatsApp tab — recoverable) |
  // 'error'. There is deliberately NO manufactured 'submitting' state (M05).
  const [status, setStatus] = useState('idle')
  // The fully pre-filled deep link we last opened, stashed so both the 'opened'
  // and 'blocked' panels can offer a directly clickable link to (re-)open it.
  const [draftUrl, setDraftUrl] = useState('')
  const [draftChannel, setDraftChannel] = useState('whatsapp')
  const panelRef = useRef(null)
  // Synchronous duplicate-submit guard (M05): prevents a rapid double click from
  // dispatching two drafts. Reset only when the user returns to the form.
  const submittingRef = useRef(false)

  // Move keyboard focus to whichever result panel is shown ('opened' OR
  // 'blocked') so screen-reader and keyboard users are taken straight to the
  // outcome and its next-step actions.
  useEffect(() => {
    if ((status === 'opened' || status === 'blocked') && panelRef.current) {
      panelRef.current.focus()
    }
  }, [status])

  // Course sync (M24): when the validated `defaultCourse` prop changes — e.g.
  // in-place navigation from `/admission?course=X` to plain `/admission` — set
  // the field to the new validated course (or clear it), so a stale RHF value
  // can never be submitted for the wrong course. Runs only when `defaultCourse`
  // changes; a user's manual selection is untouched otherwise.
  useEffect(() => {
    setValue('course', courseTitles.includes(defaultCourse) ? defaultCourse : '')
  }, [defaultCourse, setValue])

  // Return to the pristine form and re-arm the duplicate-submit guard. Field
  // values are NOT cleared here (no `reset()`), preserving recovery data (M04).
  const returnToForm = () => {
    submittingRef.current = false
    setStatus('idle')
  }

  // Build the submit handler for a given channel. `handleSubmit` validates first
  // and only calls this with `data` when every field passes, so empty/invalid
  // input surfaces field errors and blocks dispatch.
  //
  // CRITICAL: the link is opened SYNCHRONOUSLY inside the handler to preserve the
  // user gesture (otherwise the WhatsApp tab is popup-blocked). There is no fake
  // latency and no network call — opening a draft is instantaneous, so we move
  // straight to the honest 'opened' (or 'blocked') result.
  const sendInquiry = (channel) => (data) => {
    if (submittingRef.current) return // duplicate-submit guard (M05)
    submittingRef.current = true
    try {
      const text = truncate(buildMessage(data), MAX_CHANNEL_TEXT)
      if (channel === 'email') {
        const mailUrl = `${siteConfig.emailHref}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(text)}`
        setDraftUrl(mailUrl)
        setDraftChannel('email')
        window.location.href = mailUrl
        setStatus('opened')
      } else {
        const waUrl = `${siteConfig.whatsappHref}?text=${encodeURIComponent(text)}`
        setDraftUrl(waUrl)
        setDraftChannel('whatsapp')
        // Open WITHOUT the 'noopener' feature so the return value reliably
        // reports whether the browser blocked the popup (with 'noopener' the
        // return is always null and a block is undetectable). We then sever the
        // opener reference manually to keep the same security posture.
        const win = window.open(waUrl, '_blank')
        if (!win) {
          // Popup blocked — do NOT claim success. The 'blocked' panel offers the
          // pre-filled link as a real, clickable <a> (M04 / truthfulness). The
          // guard stays armed until the user returns to the form.
          setStatus('blocked')
          return
        }
        win.opener = null
        setStatus('opened')
      }
    } catch {
      // A genuine failure re-arms the guard so the user can retry from the form.
      submittingRef.current = false
      setStatus('error')
    }
  }

  // --- OPENED state: the pre-filled draft was opened in WhatsApp / the mail app.
  // We do NOT claim it was sent (M04) — we tell the visitor to press Send, keep
  // their data, and offer a link to re-open the same pre-filled draft. All hooks
  // above have already run, so this early return is safe.
  if (status === 'opened') {
    return (
      <div className={cn('flex flex-col items-start gap-4 rounded-2xl border border-border bg-accent-50 p-6', className)}>
        <div ref={panelRef} tabIndex={-1} role="status" className="focus-visible:outline-none">
          <h3 className="text-xl font-bold text-accent-800">Your inquiry is ready to send</h3>
          <p className="mt-2 text-muted">
            We&rsquo;ve opened {draftChannel === 'email' ? 'your email app' : 'WhatsApp'} with your details pre-filled.{' '}
            <strong className="font-semibold text-foreground">Please press Send there to complete your inquiry</strong> —
            it has not been sent automatically. Your details are kept here in case you need them again.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {draftUrl ? (
            <Button href={draftUrl} variant="accent" size="sm">
              {draftChannel === 'email' ? <FaEnvelope aria-hidden="true" /> : <FaWhatsapp aria-hidden="true" />}
              {draftChannel === 'email' ? 'Re-open email draft' : 'Re-open WhatsApp draft'}
            </Button>
          ) : null}
          <Button href={siteConfig.phoneHref} variant="secondary" size="sm">
            Call Now
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={returnToForm}>
            Edit my details
          </Button>
        </div>
      </div>
    )
  }

  // --- BLOCKED state: the browser prevented the WhatsApp tab from opening. We
  // never pretend the inquiry was sent; instead we present a directly clickable,
  // fully pre-filled recovery link (a real <a>, so a genuine click is not
  // popup-blocked) plus direct Call / form-return fallbacks. All hooks above
  // have already run, so this early return is safe.
  if (status === 'blocked') {
    return (
      <div className={cn('flex flex-col items-start gap-4 rounded-2xl border border-border bg-secondary-50 p-6', className)}>
        <div ref={panelRef} tabIndex={-1} role="alert" className="focus-visible:outline-none">
          <h3 className="text-xl font-bold text-secondary-800">Your browser blocked the WhatsApp tab</h3>
          <p className="mt-2 text-muted">
            We couldn&rsquo;t open WhatsApp automatically, so your inquiry has NOT been sent yet. Tap the
            button below to open your pre-filled message and press send — or contact us directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={draftUrl} variant="accent" size="sm">
            <FaWhatsapp aria-hidden="true" />
            Open WhatsApp
          </Button>
          <Button href={siteConfig.phoneHref} variant="secondary" size="sm">
            Call Now
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={returnToForm}>
            Back to the form
          </Button>
        </div>
      </div>
    )
  }

  // --- EMPTY / ERROR states render the form. `noValidate` hands validation
  // messaging entirely to react-hook-form's accessible output rather than the
  // browser's native bubbles.
  return (
    <form noValidate onSubmit={handleSubmit(sendInquiry('whatsapp'))} className={cn('flex flex-col gap-6', className)}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Full Name"
          type="text"
          required
          autoComplete="name"
          maxLength={MAX_LENGTHS.name}
          error={errors.fullName?.message}
          {...register('fullName', nameRules('Please enter your full name'))}
        />
        <Input
          label="Phone Number"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          maxLength={MAX_LENGTHS.phone}
          error={errors.phone?.message}
          {...register('phone', phoneRules)}
        />
        <Input
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          maxLength={MAX_LENGTHS.email}
          error={errors.email?.message}
          {...register('email', emailRules)}
        />
        <Select
          label="Course of Interest"
          required
          placeholder="Select a course"
          options={courseOptions}
          error={errors.course?.message}
          {...register('course', oneOfRule(courseTitles, 'Please select a course'))}
        />
        <Select
          label="Preferred Batch"
          placeholder="Select a batch (optional)"
          options={batchOptions}
          error={errors.batch?.message}
          {...register('batch', oneOfRule(batchValues, 'Select a valid batch', { required: false }))}
        />
      </div>

      <Textarea
        label="Message / Notes"
        rows={4}
        placeholder="Tell us anything else (optional)"
        maxLength={MAX_LENGTHS.message}
        error={errors.message?.message}
        {...register('message', messageRules({ required: false }))}
      />

      <div className="flex flex-col gap-4">
        {/* Privacy disclosure at the point of handoff (M07). */}
        <p className="text-xs leading-relaxed text-muted">
          Submitting opens WhatsApp or your email app with your name, phone, email and course pre-filled so you
          can review and press Send. Those details are then handled by WhatsApp/Meta or your email provider under
          their own terms; CIBLE only receives them once you press Send. If you are under 18, please ask a parent
          or guardian to help. See our{' '}
          <Link to="/privacy-policy" className="font-medium text-primary-700 underline hover:text-primary-800">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto">
            <FaWhatsapp aria-hidden="true" />
            Send via WhatsApp
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSubmit(sendInquiry('email'))}
            className="w-full sm:w-auto"
          >
            <FaEnvelope aria-hidden="true" />
            Send via Email
          </Button>
        </div>

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

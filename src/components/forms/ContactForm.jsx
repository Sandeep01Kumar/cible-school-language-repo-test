import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import Input from '../ui/Input.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import { cn } from '../../lib/cn.js'
import {
  nameRules,
  emailRules,
  phoneRules,
  subjectRules,
  messageRules,
  truncate,
  MAX_LENGTHS,
} from '../../lib/validators.js'
import { siteConfig } from '../../data/siteConfig.js'

/**
 * ContactForm — the general-enquiry contact form for the CIBLE School of
 * Language SPA (AAP §0.6.1 Group 9). Consumed by `src/pages/Contact.jsx`.
 *
 * It shares the exact architecture of `AdmissionForm` — the same honest
 * handoff model and accessibility wiring — but carries the contact field set
 * (name, email, phone, subject, message) and has NO course dropdown.
 *
 * Composition over ad-hoc markup: every field is one of the canonical `ui/*`
 * primitives (`Input`, `Textarea`) and every action is the canonical `Button`.
 *
 * Truthful handoff (M04): opening a pre-filled WhatsApp/mail draft is NOT a
 * send. The form never claims the message was received; after the draft opens
 * it shows a "ready to send" panel telling the visitor to press Send, keeps
 * their typed values (no `reset()` — recovery data survives), and offers a link
 * to re-open the same pre-filled draft. A blocked WhatsApp tab shows a
 * `role="alert"` recovery panel instead of a false success.
 *
 * No manufactured latency (M05): the deep link opens SYNCHRONOUSLY inside the
 * handler (preserving the user gesture); there is no artificial `setTimeout`,
 * no fetch/XHR, and therefore no timer to leak across unmount. A `submittingRef`
 * guards against a double-submit dispatching two drafts.
 *
 * Bounded, validated input (M06): values are trimmed, character- and
 * length-constrained by the shared `lib/validators` rules (name pattern,
 * email/phone validation, subject/message caps), carry native `maxLength`
 * attributes, and the assembled body is clamped to a total-channel limit.
 *
 * Privacy at handoff (M07): a disclosure adjacent to the submit controls
 * explains the WhatsApp/Meta / email-provider processing and links to the
 * Privacy Policy.
 *
 * Accessible form name & outline (M17): the `<form>` is associated with a
 * page-supplied heading via `aria-labelledby={headingId}` (falling back to an
 * `aria-label` when no heading id is supplied), giving the form a programmatic
 * name; the result panels use `<h3>` so they nest correctly beneath that
 * section heading.
 *
 * @param {object} [props] Component props.
 * @param {string} [props.className] Extra classes merged LAST onto the root element.
 * @param {string} [props.headingId] `id` of the visible section heading that
 *   names this form; wired to the form via `aria-labelledby` (M17).
 * @param {string} [props.defaultSubject] Optional value used to pre-fill the
 *   Subject field (e.g. an event name from `/contact?event=…`); kept in sync
 *   when it changes so a stale subject is never submitted.
 * @returns {import('react').ReactElement} The accessible, validated contact form.
 */

// Total-channel cap (M06): a final defensive clamp on the ASSEMBLED body, on top
// of the per-field caps, so the outbound URL can never balloon. Module-local.
const MAX_CHANNEL_TEXT = 1600

// Trim-then-clamp a single field value for the handoff body. Surrounding
// whitespace is stripped FIRST (QA Issue 24: entered values must not carry
// leading/trailing whitespace into the WhatsApp/email draft), then the result
// is defensively clamped by `truncate` (M06). Non-string input yields ''.
// Module-local (NOT exported).
const clean = (value, max) => truncate(typeof value === 'string' ? value.trim() : '', max)

// Module-local (NOT exported) so the module exposes only the default component
// export and stays clean under `react/only-export-components`. Serialises the
// validated field values into the plain-text body shared by both channels, with
// each value trimmed and length-clamped by `clean`.
const buildMessage = (data) =>
  [
    'New Contact Message — CIBLE School of Language',
    `Name: ${clean(data.name, MAX_LENGTHS.name)}`,
    `Email: ${clean(data.email, MAX_LENGTHS.email)}`,
    `Phone: ${clean(data.phone, MAX_LENGTHS.phone)}`,
    `Subject: ${clean(data.subject, MAX_LENGTHS.subject)}`,
    `Message: ${clean(data.message, MAX_LENGTHS.message)}`,
  ].join('\n')

function ContactForm({ className, headingId, defaultSubject } = {}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    // Retain values when the inputs unmount (the result panel replaces the
    // form), so returning to the form preserves recovery data (M04).
    shouldUnregister: false,
    defaultValues: { name: '', email: '', phone: '', subject: defaultSubject || '', message: '' },
  })

  // Four honest states: 'idle'(empty/form) | 'opened'(draft opened, awaiting the
  // user's Send) | 'blocked'(WhatsApp popup blocked — recoverable) | 'error'.
  // There is deliberately NO manufactured 'submitting' state (M05).
  const [status, setStatus] = useState('idle')
  // The fully pre-filled deep link we last opened, stashed so both the 'opened'
  // and 'blocked' panels can offer a directly clickable link to (re-)open it.
  const [draftUrl, setDraftUrl] = useState('')
  const [draftChannel, setDraftChannel] = useState('whatsapp')
  const panelRef = useRef(null)
  // Synchronous duplicate-submit guard (M05).
  const submittingRef = useRef(false)

  // Move focus to whichever result panel is shown ('opened' OR 'blocked') so
  // keyboard and screen-reader users are taken straight to the outcome.
  useEffect(() => {
    if ((status === 'opened' || status === 'blocked') && panelRef.current) {
      panelRef.current.focus()
    }
  }, [status])

  // Keep the Subject field in sync with a changing `defaultSubject` (e.g.
  // navigating from `/contact?event=X` to `/contact`) so a stale prefilled
  // subject can never be submitted. Runs only when `defaultSubject` changes.
  useEffect(() => {
    setValue('subject', defaultSubject || '')
  }, [defaultSubject, setValue])

  // Return to the pristine form and re-arm the duplicate-submit guard. Field
  // values are NOT cleared (no `reset()`), preserving recovery data (M04).
  const returnToForm = () => {
    submittingRef.current = false
    setStatus('idle')
  }

  // Curried submit handler: `channel` selects the delivery method, and the inner
  // function receives the validated form data from `handleSubmit`. The outbound
  // navigation happens SYNCHRONOUSLY to keep the user gesture intact; there is
  // no fake latency and no network call (M05).
  const sendMessage = (channel) => (data) => {
    if (submittingRef.current) return // duplicate-submit guard (M05)
    submittingRef.current = true
    try {
      const text = truncate(buildMessage(data), MAX_CHANNEL_TEXT)
      if (channel === 'email') {
        const subject = `CIBLE Website Contact: ${truncate(data.subject, MAX_LENGTHS.subject)}`
        const mailUrl = `${siteConfig.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
        setDraftUrl(mailUrl)
        setDraftChannel('email')
        window.location.href = mailUrl
        setStatus('opened')
      } else {
        const waUrl = `${siteConfig.whatsappHref}?text=${encodeURIComponent(text)}`
        setDraftUrl(waUrl)
        setDraftChannel('whatsapp')
        // Open WITHOUT 'noopener' so the return value reliably reports a blocked
        // popup; sever the opener reference manually to keep the same posture.
        const win = window.open(waUrl, '_blank')
        if (!win) {
          setStatus('blocked')
          return
        }
        win.opener = null
        setStatus('opened')
      }
    } catch {
      submittingRef.current = false
      setStatus('error')
    }
  }

  // --- OPENED state: the pre-filled draft opened. We do NOT claim it was sent
  // (M04); we tell the visitor to press Send, keep their data, and offer a link
  // to re-open the same pre-filled draft. All hooks above have already run.
  if (status === 'opened') {
    return (
      <div className={cn('flex flex-col items-start gap-4 rounded-2xl border border-border bg-accent-50 p-6', className)}>
        <div ref={panelRef} tabIndex={-1} role="status" className="focus-visible:outline-none">
          <h3 className="text-xl font-bold text-accent-800">Your message is ready to send</h3>
          <p className="mt-2 text-muted">
            We&rsquo;ve opened {draftChannel === 'email' ? 'your email app' : 'WhatsApp'} with your message pre-filled.{' '}
            <strong className="font-semibold text-foreground">Please press Send there to reach us</strong> — it has not
            been sent automatically. Your message is kept here in case you need it again.
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
            Edit my message
          </Button>
        </div>
      </div>
    )
  }

  // --- BLOCKED state: the browser prevented the WhatsApp tab from opening. We
  // never pretend the message was sent; we present a directly clickable,
  // fully pre-filled recovery link plus a direct Call fallback. All hooks above
  // have already run, so this early return is safe.
  if (status === 'blocked') {
    return (
      <div className={cn('flex flex-col items-start gap-4 rounded-2xl border border-border bg-secondary-50 p-6', className)}>
        <div ref={panelRef} tabIndex={-1} role="alert" className="focus-visible:outline-none">
          <h3 className="text-xl font-bold text-secondary-800">Your browser blocked the WhatsApp tab</h3>
          <p className="mt-2 text-muted">
            We couldn&rsquo;t open WhatsApp automatically, so your message has NOT been sent yet. Tap the
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

  return (
    <form
      noValidate
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : 'Contact form'}
      onSubmit={handleSubmit(sendMessage('whatsapp'))}
      className={cn('flex flex-col gap-6', className)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Name"
          type="text"
          required
          autoComplete="name"
          maxLength={MAX_LENGTHS.name}
          error={errors.name?.message}
          {...register('name', nameRules('Please enter your name'))}
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
          label="Subject"
          type="text"
          required
          className="sm:col-span-2"
          maxLength={MAX_LENGTHS.subject}
          error={errors.subject?.message}
          {...register('subject', subjectRules('Please add a subject'))}
        />
      </div>
      <Textarea
        label="Message"
        rows={5}
        required
        maxLength={MAX_LENGTHS.message}
        error={errors.message?.message}
        {...register('message', messageRules({ message: 'Please enter your message' }))}
      />
      <div className="flex flex-col gap-4">
        {/* Privacy disclosure at the point of handoff (M07). */}
        <p className="text-xs leading-relaxed text-muted">
          Submitting opens WhatsApp or your email app with your details pre-filled so you can review and press Send.
          Those details are then handled by WhatsApp/Meta or your email provider under their own terms; CIBLE only
          receives them once you press Send. See our{' '}
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
            onClick={handleSubmit(sendMessage('email'))}
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

export default ContactForm

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import Input from '../ui/Input.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'
import { cn } from '../../lib/cn.js'
import { requiredRule, emailRules, phoneRules } from '../../lib/validators.js'
import { siteConfig } from '../../data/siteConfig.js'

/**
 * ContactForm — the general-enquiry contact form for the CIBLE School of
 * Language SPA (AAP §0.6.1 Group 9). Consumed by `src/pages/Contact.jsx`.
 *
 * It shares the exact architecture of `AdmissionForm` — the same four-state
 * machine, the same backend-free submission model, and the same accessibility
 * wiring — but carries the contact field set (name, email, phone, subject,
 * message) and has NO course dropdown (no `Select`, no `courses.js`).
 *
 * Composition over ad-hoc markup: every field is one of the canonical `ui/*`
 * primitives (`Input`, `Textarea`), every action is the canonical `Button`, and
 * the busy indicator is the canonical `Spinner`. No raw <input>/<button> is
 * restyled here.
 *
 * Validation: driven entirely by `react-hook-form`. Rules come from the shared
 * `lib/validators` helpers (`requiredRule`, `emailRules`, `phoneRules`) so the
 * messages stay consistent across the site's forms. The form is `noValidate`
 * so react-hook-form's accessible, in-DOM messages win over native browser
 * bubbles.
 *
 * Submission (NO backend — AAP §0.7.2): the collected fields are serialised
 * into a plain-text message and delivered through one of two user-chosen
 * channels, both pointing at the single source of truth in `siteConfig`:
 *   • WhatsApp — opens `siteConfig.whatsappHref` with a prefilled `?text=…` in
 *     a new tab (the default form submit).
 *   • Email — navigates to `siteConfig.emailHref` (a `mailto:`) with a prefilled
 *     subject and body.
 * The `window.open` / `window.location.href` call is made SYNCHRONOUSLY inside
 * the click/submit handler to preserve the user gesture (avoids popup
 * blocking). For the WhatsApp channel the `window.open` return value is checked:
 * on success the confirmation panel appears shortly after; if the browser
 * blocked the tab (a null return) the form does NOT claim success and instead
 * shows a recovery panel with a directly clickable pre-filled link. No network,
 * fetch, or XHR is performed.
 *
 * UX states (folder requirement — four states plus a recoverable block state):
 *   • empty      → pristine `idle` render (the default form).
 *   • loading    → `submitting` (buttons disabled + inline `Spinner` + `Sending…`).
 *   • error      → a form-level `role="alert"` message.
 *   • success    → a focused confirmation panel (`role="status"`), from which
 *                  the user can jump straight to WhatsApp/Call or reset the form.
 *   • blocked    → the browser blocked the WhatsApp tab: a focused `role="alert"`
 *                  recovery panel with a clickable, pre-filled link (Issue 7).
 *
 * Accessibility (WCAG AA): every field has a real <label> and, when invalid,
 * `aria-invalid` plus a `role="alert"` message (all provided by the primitives
 * from the `label`/`error` props). On a failed submit react-hook-form focuses
 * the first invalid field; on success, focus is moved programmatically to the
 * confirmation panel via `successRef` (`tabIndex={-1}`, `role="status"`). Icons
 * are decorative (`aria-hidden`); buttons expose the visible focus ring from
 * the `Button` primitive. The responsive grid stacks to a single column on
 * small viewports (no horizontal scroll) and the `lg` buttons are ≥44px tall
 * for comfortable touch.
 *
 * Styling: token-only Tailwind v4 utilities (`@theme` tokens from
 * `src/index.css`) on the 8px spacing scale — zero hardcoded values. The
 * optional `className` is merged LAST via `cn(...)` so callers can position the
 * form on any page.
 *
 * @param {object} [props] Component props.
 * @param {string} [props.className] Extra classes merged LAST onto the root element.
 * @returns {import('react').ReactElement} The accessible, validated contact form.
 */

// Module-local (NOT exported) so the module exposes only the default component
// export and stays clean under `react/only-export-components`. Serialises the
// validated field values into the plain-text body shared by both channels.
const buildMessage = (data) =>
  [
    'New Contact Message — CIBLE School of Language',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Subject: ${data.subject}`,
    `Message: ${data.message}`,
  ].join('\n')

function ContactForm({ className } = {}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  })

  // 'idle' (empty) | 'submitting' (loading) | 'success' |
  // 'blocked' (WhatsApp popup blocked — recoverable) | 'error'
  const [status, setStatus] = useState('idle')
  // Stash the fully pre-filled WhatsApp deep link when the popup is blocked so
  // the 'blocked' panel can offer it as a directly clickable recovery link.
  const [fallbackUrl, setFallbackUrl] = useState('')
  const panelRef = useRef(null)
  const isSubmitting = status === 'submitting'

  // Move focus to whichever result panel is shown (success OR the blocked /
  // recovery panel) so keyboard and screen-reader users are taken straight to
  // the outcome.
  useEffect(() => {
    if ((status === 'success' || status === 'blocked') && panelRef.current) {
      panelRef.current.focus()
    }
  }, [status])

  // Curried submit handler: `channel` selects the delivery method, and the
  // inner function receives the validated form data from `handleSubmit`. The
  // outbound navigation happens synchronously to keep the user gesture intact.
  const sendMessage = (channel) => (data) => {
    try {
      const text = buildMessage(data)
      const subject = `CIBLE Website Contact: ${data.subject}`
      setStatus('submitting')
      if (channel === 'email') {
        window.location.href = `${siteConfig.emailHref}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(text)}`
      } else {
        const waUrl = `${siteConfig.whatsappHref}?text=${encodeURIComponent(text)}`
        // Open WITHOUT the 'noopener' feature so the return value reliably
        // reports whether the browser blocked the popup (with 'noopener' the
        // return is always null and a block is undetectable). Sever the opener
        // reference manually to keep the same security posture.
        const win = window.open(waUrl, '_blank')
        if (!win) {
          // Popup blocked — do NOT claim success. Offer a recoverable,
          // user-clickable pre-filled link instead (Issue 7 / truthfulness).
          setFallbackUrl(waUrl)
          setStatus('blocked')
          return
        }
        win.opener = null
      }
      window.setTimeout(() => {
        setStatus('success')
        reset()
      }, 500)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('flex flex-col items-start gap-4 rounded-2xl border border-border bg-accent-50 p-6', className)}>
        <div ref={panelRef} tabIndex={-1} role="status" className="focus-visible:outline-none">
          <h3 className="text-xl font-bold text-accent-800">Thank you for reaching out!</h3>
          <p className="mt-2 text-muted">
            We’ve opened WhatsApp / your email with your message pre-filled — just press send and we’ll reply soon. If
            nothing opened, contact us directly below.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={siteConfig.whatsappHref} variant="accent" size="sm">
            WhatsApp Us
          </Button>
          <Button href={siteConfig.phoneHref} variant="secondary" size="sm">
            Call Now
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setStatus('idle')}>
            Send another message
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
          <Button href={fallbackUrl} variant="accent" size="sm">
            <FaWhatsapp aria-hidden="true" />
            Open WhatsApp
          </Button>
          <Button href={siteConfig.phoneHref} variant="secondary" size="sm">
            Call Now
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setStatus('idle')}>
            Back to the form
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit(sendMessage('whatsapp'))} className={cn('flex flex-col gap-6', className)}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Name"
          type="text"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', requiredRule('Please enter your name'))}
        />
        <Input
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', emailRules)}
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
          label="Subject"
          type="text"
          required
          className="sm:col-span-2"
          error={errors.subject?.message}
          {...register('subject', requiredRule('Please add a subject'))}
        />
      </div>
      <Textarea
        label="Message"
        rows={5}
        required
        error={errors.message?.message}
        {...register('message', requiredRule('Please enter your message'))}
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
            onClick={handleSubmit(sendMessage('email'))}
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

export default ContactForm

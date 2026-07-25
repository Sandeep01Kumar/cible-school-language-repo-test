import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'
import { cn } from '../../lib/cn.js'
import { emailRules } from '../../lib/validators.js'
import siteConfig from '../../data/siteConfig.js'

/**
 * Newsletter — the single canonical newsletter subscribe form for the CIBLE
 * School of Language SPA (AAP §0.6.1 Group 7). It is a small, self-contained,
 * fully validated block that the Footer and marketing pages compose to capture
 * email sign-ups for admission updates, tips, and event invites.
 *
 * Reuse-first composition: it never hand-rolls raw form markup. It composes the
 * canonical UI primitives — `ui/Input` for the field, `ui/Button` for submit,
 * and `ui/Spinner` for the busy indicator — so styling, focus rings, and ARIA
 * wiring stay consistent with the rest of the site. It is intentionally
 * independent of `components/forms/*` (AdmissionForm / ContactForm) and imports
 * nothing from that folder.
 *
 * Validation & the four states (empty / loading / error / success):
 * - `react-hook-form` drives validation via the shared `emailRules` (required +
 *   RFC-lite email check) spread onto the `<Input>`. Field-level messages are
 *   surfaced through the Input's `error` prop (which also wires
 *   `aria-invalid` / `aria-describedby` and `role="alert"`).
 *   • empty   → the initial `idle` state renders the bare form, no messages.
 *   • loading → submit is disabled and shows a `Spinner` + "Subscribing…".
 *   • error   → a submit-level `role="alert"` message (field errors render
 *               inline through the Input).
 *   • success → a polite `role="status"` mailto-handoff notice (it does NOT
 *               falsely claim a subscription was confirmed — it explains the
 *               email app was opened pre-filled) and the form is reset.
 *
 * Client-side only submission: the site has no backend, so a valid submission
 * opens a pre-filled `mailto:` to the institute (`siteConfig.emailHref`, or a
 * mailto built from `siteConfig.email`). A brief artificial delay surfaces the
 * loading state so the interaction reads clearly.
 *
 * Accessibility (WCAG AA):
 * - `<form noValidate>` hands validation messaging to react-hook-form / Input
 *   rather than the browser's native bubbles.
 * - Success uses `role="status"` (announced politely); a submit failure uses
 *   `role="alert"` (announced assertively).
 * - While loading, the submit control is disabled and renders `Spinner`, which
 *   carries its own accessible label.
 * - Colours resolve to AA-contrast brand tokens (accent/secondary 700 on the
 *   light `surface`), and the shared focus-visible ring is preserved.
 *
 * Styling is entirely token-driven (Tailwind v4 `@theme` tokens from
 * src/index.css) on the 8px scale — no hardcoded style values (only `0` via
 * `py-0` on the inline Spinner, which is an exempt value). Success/error text
 * use `text-accent-700` / `text-secondary-700` (the defined, AA-safe brand
 * shades) rather than shadeless aliases, matching the Input error convention.
 *
 * @param {object} props
 * @param {string} [props.className] Extra classes merged LAST onto the root
 *   `<section>` so callers (e.g. the Footer) can override layout/background.
 * @param {string} [props.title='Stay in the loop'] Heading text.
 * @param {string} [props.subtitle='Get admission updates, tips, and event invites.']
 *   Supporting copy beneath the heading.
 * @param {object} props... Remaining props spread onto the root `<section>`.
 * @returns {import('react').ReactElement} The accessible newsletter subscribe form.
 */
export default function Newsletter({
  className,
  title = 'Stay in the loop',
  subtitle = 'Get admission updates, tips, and event invites.',
  ...props
}) {
  // All hooks are declared unconditionally at the top level of the component,
  // as required by the enforced `react/rules-of-hooks` lint rule.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onBlur', defaultValues: { email: '' } })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  // Unique-but-semantic field id. Keeps the readable `newsletter-email` intent
  // while guaranteeing uniqueness via useId(), so the form can be rendered more
  // than once on a single page (e.g. the persistent Footer AND a page section)
  // without producing duplicate ids / broken <label> association (WCAG AA).
  const generatedId = useId()
  const fieldId = `newsletter-email-${generatedId}`

  // Client-side-only submit: no backend exists, so a valid email opens a
  // pre-filled mailto: to the institute. The short delay surfaces the loading
  // state; any unexpected failure flips the form into the error state.
  const onSubmit = async (data) => {
    setStatus('loading')
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      const subject = encodeURIComponent('Newsletter subscription — CIBLE')
      const body = encodeURIComponent(
        `Please subscribe this email to the CIBLE newsletter: ${data.email}`,
      )
      const mailto = siteConfig.emailHref || `mailto:${siteConfig.email}`
      window.location.href = `${mailto}?subject=${subject}&body=${body}`
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={cn('rounded-2xl bg-surface p-6 md:p-8', className)} {...props}>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      {status === 'success' ? (
        <p role="status" className="mt-4 text-sm font-medium text-accent-700">
          We&rsquo;ve opened your email app with a subscription request pre-filled — just press send and
          we&rsquo;ll add you to the list. If nothing opened, email us at {siteConfig.email}.
        </p>
      ) : null}

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <Input
          id={fieldId}
          type="email"
          label="Email address"
          required
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          className="flex-1"
          {...register('email', emailRules)}
        />
        <Button type="submit" variant="primary" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              {/* py-0 neutralises Spinner's default full-section py-24 padding
                  so the ring sits inline within the button's fixed height. */}
              <Spinner size="sm" className="py-0" />
              Subscribing…
            </>
          ) : (
            'Subscribe'
          )}
        </Button>
      </form>

      {status === 'error' ? (
        <p role="alert" className="mt-2 text-sm text-secondary-700">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </section>
  )
}

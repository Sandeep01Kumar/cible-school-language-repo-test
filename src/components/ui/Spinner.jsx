import { cn } from '../../lib/cn.js'

/**
 * Size map — ring box dimensions and border thickness, expressed purely with
 * Tailwind scale utilities on the 8px system (h-4/8/12 = 16/32/48px). Kept as a
 * module-local `const` (intentionally NOT exported) so the module exposes a
 * single default component export and stays clean under the enforced
 * `react/only-export-components` lint rule.
 */
const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
}

/**
 * Spinner — the single canonical loading indicator for the CIBLE School of
 * Language SPA.
 *
 * Rendered as the route-level Suspense fallback in `src/App.jsx`
 * (`<Suspense fallback={<Spinner />}>`) while lazy-loaded pages resolve, and
 * reused anywhere a busy/loading state must be shown (e.g. a submitting form).
 * It is deliberately tiny — its only dependency is the shared `cn()` class
 * merger, with no React hooks or icon libraries — so it never bloats the
 * initial route bundle it guards.
 *
 * Accessibility (WCAG AA):
 * - The wrapper carries `role="status"` + `aria-live="polite"` so assistive
 *   technology announces the loading state politely, without interrupting the
 *   user's current task.
 * - A visually hidden `<span className="sr-only">{label}</span>` provides the
 *   text alternative: screen readers announce the label while sighted users see
 *   the animated ring. `.sr-only` is the GLOBAL helper defined once in
 *   `src/index.css` — this component reuses it rather than redefining it.
 * - The animated ring is purely decorative and carries no text, so it needs no
 *   additional ARIA.
 *
 * Styling: every value resolves to a Tailwind `@theme` token or a built-in
 * utility (zero hardcoded values). The ring colour is the brand blue
 * `border-primary-600` with a transparent top segment (`border-t-transparent`)
 * to create the classic rotating gap, and all sizing/spacing sits on the 8px
 * scale. Motion respects user preference: the global `prefers-reduced-motion`
 * reset in `src/index.css` neutralises `animate-spin` for users who request
 * reduced motion.
 *
 * @param {Object} [props] Component props (all optional — renders with none).
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] Ring size on the 8px scale;
 *   unknown values fall back to `'md'`.
 * @param {string} [props.className] Extra classes merged LAST so callers can
 *   override layout (e.g. change the centring or padding).
 * @param {string} [props.label='Loading…'] Screen-reader-only status text.
 * @returns {JSX.Element} An accessible, centred loading status region.
 */
function Spinner({ size = 'md', className, label = 'Loading…' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex items-center justify-center py-24', className)}
    >
      <span
        className={cn(
          'inline-block animate-spin rounded-full border-primary-600 border-t-transparent',
          sizes[size] || sizes.md,
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export default Spinner

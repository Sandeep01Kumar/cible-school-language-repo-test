import { cn } from '../../lib/cn.js'

/**
 * Container
 *
 * The single canonical width-and-gutter wrapper for the CIBLE School of
 * Language SPA. It centers page content and applies the responsive horizontal
 * gutters that used to be provided by the removed Vite boilerplate
 * `#root { width: 1126px }` rule — layout width is now owned entirely by this
 * primitive rather than by a fixed pixel width on the mount node.
 *
 * Every page section, the Navbar inner row, and the Footer inner content are
 * expected to compose this component so that max-width and gutters stay
 * consistent across the whole site (design-system rule: reuse one primitive,
 * never duplicate layout wrappers).
 *
 * Styling (Tailwind v4 utilities on the project's 8px spacing scale):
 * - `mx-auto`     — horizontally centers the box within its parent.
 * - `w-full`      — fills the available inline space up to the max-width.
 * - `max-w-7xl`   — caps content width at the native 80rem (1280px) token.
 * - `px-4`        — 16px inline gutters on mobile.
 * - `md:px-6`     — 24px inline gutters from the `md` breakpoint (768px) up.
 * All values resolve to native Tailwind tokens/utilities — there are no
 * hardcoded pixel widths and no arbitrary `[..]` values.
 *
 * Accessibility / semantics:
 * - Purely structural. The `as` prop lets callers render the correct semantic
 *   landmark for the context (e.g. `'main'`, `'header'`, `'footer'`,
 *   `'section'`) instead of an inert `<div>`, so the primitive never forces a
 *   non-semantic element. No ARIA is added here; callers own their semantics.
 *
 * @param {object} props
 * @param {import('react').ElementType} [props.as='div'] Element or component to
 *   render as the container's root (destructured to a capitalized local so JSX
 *   treats it as a tag/component).
 * @param {string} [props.className] Extra classes, merged LAST via {@link cn}
 *   so callers can extend or override the defaults (e.g. add `py-16`).
 * @param {import('react').ReactNode} [props.children] Content to render inside
 *   the container.
 * @returns {import('react').ReactElement} The rendered container element.
 */
function Container({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component className={cn('mx-auto w-full max-w-7xl px-4 md:px-6', className)} {...props}>
      {children}
    </Component>
  )
}

export default Container

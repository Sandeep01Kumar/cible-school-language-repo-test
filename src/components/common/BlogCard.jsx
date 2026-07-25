import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import { cn } from '../../lib/cn.js'
import { FiCalendar, FiClock } from 'react-icons/fi'

/**
 * BlogCard
 *
 * The single canonical blog-post preview card for the CIBLE School of Language
 * SPA. It teases one article inside a grid and is reused by `src/pages/Blog.jsx`
 * (the article listing) and the Home page blog-preview section — never fork a
 * second card, always compose this one (project reuse-first rule).
 *
 * It is purely presentational: every value is read from the `post` prop (source
 * of truth `src/data/blog.js`) and it composes the shared primitives rather than
 * restyling raw markup — `ui/Card` (the surface) and `ui/Badge` (the category
 * pill). It is a NON-interactive preview: the app's frozen route table has no
 * per-article route, so the card intentionally carries no navigational CTA — the
 * former "Read more" button linked back to the `/blog` listing the card already
 * sits in (a self-referential dead end), which was removed for QA Issue 8.
 *
 * Banner: article imagery is client-supplied and currently absent (`image` is
 * `null` for every entry in `blog.js`). With no image the card renders a branded
 * gradient header showing the post category as a large white label, so the grid
 * never exposes an empty or broken media slot; when a real image URL is dropped
 * in later, an `<img>` is rendered instead. The banner image is decorative
 * (`alt=""` + `aria-hidden`) because the visible <h3> title already conveys the
 * post's meaning to assistive technology.
 *
 * Styling is 100% token-driven Tailwind (v4 `@theme` tokens from `src/index.css`)
 * with no hardcoded values. Two class names resolve to THIS project's actual
 * tokens rather than generic shadcn-style names:
 *   • muted text uses `text-muted` (token `--color-muted`, ~7.5:1 on white); the
 *     repo defines no `muted-foreground` token — see index.css and every ui/*
 *     primitive (SectionHeading, Input, Accordion, …).
 *   • the fallback gradient uses the numbered brand scale
 *     `from-primary-600 to-primary-800` (the repo defines `--color-primary-600…900`,
 *     not a bare `--color-primary`); both stops stay dark enough to keep the white
 *     category label at WCAG-AA contrast across the whole banner.
 *
 * Motion: no framer-motion here — the parent grid owns scroll-reveal animation.
 * The card adds only a subtle `hover:-translate-y-1` lift, which the global
 * `prefers-reduced-motion` rule in index.css neutralises.
 *
 * @param {object} props
 * @param {object} props.post - The blog post. Shape:
 *   `{ slug, title, excerpt, date, author, category, readTime, image, content }`.
 *   `date` is an ISO string; `readTime` is a string ("5 min read") or a number of
 *   minutes; `image` is a URL or `null` (→ branded gradient fallback).
 * @param {string} [props.className] - Extra classes merged LAST onto the Card root.
 * @param {object} [props] - Any other props are forwarded to the Card root.
 * @returns {import('react').ReactElement | null} The card, or `null` when `post`
 *   is missing (defensive guard so a bad list entry cannot crash the grid).
 */

// Format an ISO date as e.g. "15 Jul 2025" using the en-IN locale (the
// institute's audience). Module-scope (not a hook, not exported) so the file
// exposes only the BlogCard component (react/only-export-components). Guards an
// invalid/unparseable date by returning '' so the <time> stays empty instead of
// rendering "Invalid Date".
function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function BlogCard({ post, className, ...props }) {
  // Defensive guard: one bad list entry must never crash the whole grid.
  if (!post) return null

  const formattedDate = formatDate(post.date)
  const readTime =
    typeof post.readTime === 'number' ? `${post.readTime} min read` : post.readTime

  return (
    <Card
      as="article"
      className={cn(
        'flex h-full flex-col overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1',
        className,
      )}
      {...props}
    >
      {/* Banner — 16/9 (aspect-video is Tailwind's named 16/9 utility, so no
          arbitrary value). shrink-0 keeps the ratio inside the flex column. */}
      <div className="aspect-video w-full shrink-0">
        {post.image ? (
          <img
            src={post.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-center">
            <span className="text-lg font-semibold text-white">{post.category}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <Badge variant="secondary" className="self-start">
          {post.category}
        </Badge>

        <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>

        <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>

        {/* Meta row — date, read time and (optionally) author. Each item renders
            only when present so the row stays clean for any data state. */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
          {formattedDate ? (
            <span className="flex items-center gap-1">
              <FiCalendar aria-hidden="true" />
              <time dateTime={post.date}>{formattedDate}</time>
            </span>
          ) : null}
          {readTime ? (
            <span className="flex items-center gap-1">
              <FiClock aria-hidden="true" />
              {readTime}
            </span>
          ) : null}
          {post.author ? <span>By {post.author}</span> : null}
        </div>
      </div>
    </Card>
  )
}

export default BlogCard

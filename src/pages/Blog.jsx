import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import BlogCard from '../components/common/BlogCard.jsx'
import CTASection from '../components/common/CTASection.jsx'
import blog from '../data/blog.js'

/**
 * Blog — the CIBLE School of Language article listing (route `/blog`).
 *
 * Lazy-loaded by `src/App.jsx` inside the shared `<Layout>`
 * (`const Blog = lazy(() => import('./pages/Blog.jsx'))`,
 * `<Route path="blog" element={<Blog />} />`), so this component renders ONLY
 * the page's own content — the Navbar, Footer and floating conversion widgets
 * are supplied by the surrounding layout shell.
 *
 * Composition (reuse-first, zero duplication — every element is a shared
 * primitive, never hand-rolled markup):
 * - `<Seo>`            : per-page head. `type="article"` sets Open Graph
 *                        `og:type=article` because this is a content page;
 *                        the title resolves to "Blog | CIBLE School of Language".
 * - `<StructuredData>` : emits BreadcrumbList JSON-LD from the same `crumbs`
 *                        trail rendered visibly by `<Breadcrumbs>`, keeping the
 *                        visible trail and structured data in agreement.
 * - `<Container as="section">` : the canonical width/gutter wrapper, rendered as
 *                        the correct semantic landmark.
 * - `<SectionHeading as="h1">` : the page's SINGLE `<h1>` (each `BlogCard`
 *                        renders its own `<h3>`, so the heading outline stays
 *                        logical).
 * - `<BlogCard>`       : one presentational preview card per post; each renders
 *                        its own semantic `<article>` and a "Read more" link.
 * - `<CTASection>`     : the admission call-to-action that closes every page.
 *
 * Data comes exclusively from `src/data/blog.js` (single source of truth); the
 * page holds no state and uses no hooks. Styling is 100% token-driven Tailwind
 * on the project's 8px spacing scale — there are no hardcoded values.
 *
 * @returns {import('react').ReactElement} The blog listing page.
 */

// Breadcrumb trail for this page. Module-local (never exported) and shared by
// both the visible <Breadcrumbs> and the BreadcrumbList JSON-LD via
// <StructuredData>. Shape is the shared { name, path } contract consumed by
// `Breadcrumbs` and `breadcrumbSchema` alike.
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
]

function Blog() {
  return (
    <>
      <Seo
        title="Blog"
        type="article"
        canonical="/blog"
        description="Read the CIBLE School of Language blog — tips on spoken English, exam preparation, personality development, computer skills and career guidance for students in Bihar."
      />
      <StructuredData breadcrumbs={crumbs} />

      {/* Page header */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Insights & Tips"
          title="CIBLE Blog"
          subtitle="Guidance on English, exams, personality and careers from the CIBLE teaching team."
        />
      </Container>

      {/* Blog grid */}
      <Container as="section" className="pb-16 md:pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blog.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>

      <CTASection />
    </>
  )
}

export default Blog

import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import ReviewCard from '../components/common/ReviewCard.jsx'
import TestimonialSlider from '../components/common/TestimonialSlider.jsx'
import Statistics from '../components/common/Statistics.jsx'
import RepresentativeNote from '../components/common/RepresentativeNote.jsx'
import CTASection from '../components/common/CTASection.jsx'
import testimonials from '../data/testimonials.js'

/**
 * SuccessStories — CIBLE School of Language (route `/success-stories`).
 *
 * The site's social-proof page. It converts prospective students and parents by
 * showcasing CIBLE outcomes — spoken-English confidence, exam results and career
 * wins — through three reinforcing trust signals, then closes with the shared
 * admission CTA. The testimonials are polished REPRESENTATIVE samples (not
 * verified student records); a `RepresentativeNote` discloses this at the top of
 * the review grid and the site-wide Footer band reinforces it (M03, AAP §0.7.2):
 *
 *   1. A responsive grid of canonical <ReviewCard>s (one per testimonial), so
 *      every review is scannable at a glance on the initial viewport.
 *   2. The animated <Statistics> band (self-wrapping blue band + CountUp
 *      counters) for headline achievement numbers.
 *   3. The <TestimonialSlider> (Swiper carousel) on a tinted `bg-surface` band
 *      for a featured, swipeable highlight reel of the same reviews.
 *
 * Reuse-first / zero duplication (AAP §0.8): this page is purely presentational
 * and composes ONLY the shared primitives/components — it holds NO testimonial
 * content of its own. All review records come from the single source of truth
 * `src/data/testimonials.js`; the same `testimonials` array feeds both the grid
 * and the slider so the two views can never drift apart. The only module-local
 * datum is the breadcrumb trail (`crumbs`), which is intentionally NOT exported
 * to keep the file's public surface a single default component (clean under the
 * `react/only-export-components` lint rule).
 *
 * Routing: lazy-loaded by `src/App.jsx`
 *   `const SuccessStories = lazy(() => import('./pages/SuccessStories.jsx'))`
 *   `<Route path="success-stories" element={<SuccessStories />} />`
 * rendered inside the shared <Layout> (which owns the Navbar/Footer/floating
 * CTAs), so this component renders ONLY page content — no page chrome.
 *
 * SEO: <Seo> emits the unique title ("Success Stories | CIBLE School of
 * Language"), description and canonical `/success-stories`; <StructuredData>
 * emits BreadcrumbList JSON-LD from the SAME `crumbs` array that drives the
 * visible <Breadcrumbs>, keeping the rendered trail and the structured data in
 * agreement (what search engines expect).
 *
 * Accessibility (WCAG AA): exactly ONE <h1> on the page — the header rendered by
 * <SectionHeading as="h1">. Every subsequent section heading is a <h2> (the
 * <SectionHeading> default) and each <ReviewCard> renders its own accessible
 * <figure>/<blockquote>/<figcaption> testimonial structure, so the heading
 * outline stays logical.
 *
 * Styling: 100% token-driven Tailwind utilities on the project's 8px spacing
 * scale (`py-12`/`md:py-16`, `pb-16`/`md:pb-20`, `gap-6`, `mt-10`, `bg-surface`)
 * with zero hardcoded values. Section rhythm alternates for visual clarity:
 * white header → white review grid → blue <Statistics> band → tinted
 * `bg-surface` slider band → <CTASection>.
 */

// Breadcrumb trail from the site root to this page. Module-local (never
// exported) and shared verbatim by the visible <Breadcrumbs> and the
// <StructuredData> BreadcrumbList so both stay in lock-step. Shape matches the
// `{ name, path }` contract consumed by `breadcrumbSchema` in src/lib/schema.js.
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Success Stories', path: '/success-stories' },
]

function SuccessStories() {
  return (
    <>
      <Seo
        title="Success Stories"
        canonical="/success-stories"
        description="Read success stories from CIBLE School of Language students — spoken English confidence, exam results and career wins from learners across Madhubani, Bihar."
      />
      <StructuredData breadcrumbs={crumbs} />

      {/* Page header — the single <h1> for this route. */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Student Success"
          title="Success Stories"
          subtitle="Real results from CIBLE students who built confidence, cleared exams and shaped their futures."
        />
      </Container>

      {/* Review grid — one canonical <ReviewCard> per testimonial. Labelled as a
          region (m06) with a visually-hidden <h2> referenced via
          `aria-labelledby`, because each ReviewCard renders a
          <figure>/<blockquote>/<figcaption> with no heading of its own, so the
          section would otherwise have no accessible name. */}
      <Container as="section" aria-labelledby="reviews-heading" className="pb-16 md:pb-20">
        <h2 id="reviews-heading" className="sr-only">Student reviews</h2>
        <RepresentativeNote className="mb-8">
          These success stories and reviews are representative samples for
          demonstration, not verified student records. They will be replaced with
          consent-approved outcomes before launch.
        </RepresentativeNote>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </Container>

      {/* Animated stats band (self-wrapping blue band + CountUp counters). */}
      <Statistics />

      {/* Featured testimonial slider on a tinted surface band. */}
      <section className="bg-surface py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="In Their Words"
            title="Hear From Our Students"
            subtitle="Swipe through highlights from the CIBLE learning community."
          />
          <div className="mt-10">
            <TestimonialSlider items={testimonials} />
          </div>
        </Container>
      </section>

      {/* Admission call-to-action closing every page. */}
      <CTASection />
    </>
  )
}

export default SuccessStories

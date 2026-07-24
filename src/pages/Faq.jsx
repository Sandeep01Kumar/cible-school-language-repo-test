import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import FAQ from '../components/common/FAQ.jsx'
import CTASection from '../components/common/CTASection.jsx'

/**
 * Faq — CIBLE School of Language frequently-asked-questions page.
 *
 * Rendered at the LOWERCASE route `/faq`. Note the deliberate filename/route
 * split: the FILE is `Faq.jsx` (capital `F`, lowercase `aq`) so it matches the
 * lazy import in `src/App.jsx`
 * (`const Faq = lazy(() => import('./pages/Faq.jsx'))`,
 * `<Route path="faq" element={<Faq />} />`), while the URL segment stays
 * lowercase. This page renders ONLY its own content — the persistent Navbar,
 * Footer and floating conversion widgets are supplied by the shared `<Layout>`
 * that hosts the routed `<Outlet/>`.
 *
 * Composition (reuse-first, zero duplication — every element is a shared
 * primitive/composite, never hand-rolled markup):
 * - `<Seo>`            — per-page title/description/canonical + Open Graph and
 *                        Twitter meta. `title="Frequently Asked Questions"`
 *                        renders `document.title` as
 *                        "Frequently Asked Questions | CIBLE School of Language".
 * - `<StructuredData>` — emits BreadcrumbList JSON-LD from the same `crumbs`
 *                        array that feeds the visible trail, so the structured
 *                        data and the on-page breadcrumbs never diverge.
 * - Page header        — a `Container` section holding the visible
 *                        `<Breadcrumbs>` and the page's single `<SectionHeading
 *                        as="h1">`.
 * - `<FAQ showHeading={false}>` — the canonical FAQ composite. It SELF-WRAPS in
 *                        its own `<section>`/`Container` and pulls its content
 *                        from `src/data/faq.js` by default, so this page neither
 *                        wraps it again nor imports the `faq` data itself.
 *                        `showHeading={false}` suppresses FAQ's internal
 *                        `<h2>` so the page header above is the single top
 *                        heading and FAQ contributes only the accessible
 *                        accordion (each question sits in an `<h3>`).
 * - `<CTASection>`     — the admission call-to-action that closes every page.
 *
 * Accessibility (WCAG AA): exactly ONE `<h1>` (the page header). The FAQ
 * accordion renders `<button aria-expanded aria-controls>` triggers wrapped in
 * `<h3>` question labels, yielding a logical outline (page `<h1>` → question
 * `<h3>`).
 *
 * Styling: static, token-only Tailwind utilities on the project's 8px spacing
 * scale (`py-12`/`md:py-16`, `mb-6`); no `cn()` merge is needed because the
 * page adds no conditional classes, and there are no hardcoded/arbitrary
 * values.
 *
 * @returns {import('react').ReactElement} The rendered FAQ page fragment.
 */

// Breadcrumb trail for this page — module-local (NOT exported). The identical
// array is passed to both the visible <Breadcrumbs> and <StructuredData> so the
// rendered trail and the BreadcrumbList JSON-LD stay in agreement (the shape is
// the shared `{ name, path }` contract consumed by breadcrumbSchema).
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'FAQ', path: '/faq' },
]

function Faq() {
  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        canonical="/faq"
        description="Answers to common questions about CIBLE School of Language — courses, fees, batch timings, admission process and contact details in Madhubani, Bihar."
      />
      <StructuredData breadcrumbs={crumbs} />

      {/* Page header — the single <h1> that introduces the FAQ section. */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Help Center"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about courses, admissions and classes at CIBLE."
        />
      </Container>

      {/* Accordion — FAQ self-wraps its own Container/section and reads
          src/data/faq.js by default, so it is neither wrapped again nor passed
          the data here. showHeading={false} suppresses its internal heading so
          the page header above remains the single top heading. */}
      <FAQ showHeading={false} />

      <CTASection />
    </>
  )
}

export default Faq

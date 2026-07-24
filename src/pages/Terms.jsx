/**
 * Terms — Terms & Conditions legal page (route `/terms`).
 *
 * A readable, long-form legal-prose page presenting the terms that govern use
 * of the CIBLE School of Language website. It mirrors the structural pattern of
 * the Privacy Policy page: a single page `<h1>` supplied by the shared
 * `SectionHeading` primitive, followed by semantic `<h2>` prose sections inside
 * a reading-measure `max-w-3xl` container, and closing with the reusable
 * admission `CTASection` that ends every page of the site.
 *
 * Rendering contract: this component renders ONLY page content. The persistent
 * shell (Navbar, Footer, floating conversion widgets, ScrollToTop) is provided
 * by the routing `<Layout>`, while per-page document `<head>` output is handled
 * by the `<Seo>` and `<StructuredData>` helpers. It is lazy-loaded by
 * `src/App.jsx`:
 *   const Terms = lazy(() => import('./pages/Terms.jsx'))
 *   <Route path="terms" element={<Terms />} />
 *
 * Accessibility (WCAG AA): exactly one `<h1>` (the page header); every section
 * title is a semantic `<h2>`; the contact email is a real `mailto:` `<a>`. All
 * styling flows through the Tailwind `@theme` brand tokens defined in
 * `src/index.css` on the 8px spacing scale — there are no hardcoded values and
 * no runtime class composition (static classNames only, no `cn`).
 */
import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import CTASection from '../components/common/CTASection.jsx'
import siteConfig from '../data/siteConfig.js'

// Breadcrumb trail — the SAME `{ name, path }` shape is consumed by both the
// visible <Breadcrumbs> trail and the Breadcrumb JSON-LD emitted by
// <StructuredData>, keeping the rendered trail and structured data in agreement.
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Terms & Conditions', path: '/terms' },
]

const lastUpdated = 'January 2025'

// Representative terms copy — MUST be reviewed and finalized by the institute's
// legal team before launch (AAP §0.7.2: genuine editorial/legal copy is
// client-supplied and swapped in later; this is production-quality structure
// with representative content, not a placeholder page).
const sections = [
  {
    heading: 'Acceptance of Terms',
    body: 'By accessing and using the CIBLE School of Language website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use this website.',
  },
  {
    heading: 'Use of the Website',
    body: 'This website is provided for informational purposes about our courses, admissions and activities. You agree to use it only for lawful purposes and not to misuse or disrupt the website or its content.',
  },
  {
    heading: 'Admissions & Enrolment',
    body: 'Submitting an admission or enquiry form does not guarantee enrolment. Course availability, batch timings, fees and schedules are subject to confirmation by CIBLE School of Language and may change.',
  },
  {
    heading: 'Intellectual Property',
    body: 'All content on this website, including text, logos, graphics and images, is the property of CIBLE School of Language unless otherwise stated, and may not be reproduced without permission.',
  },
  {
    heading: 'Limitation of Liability',
    body: 'While we strive to keep information accurate and up to date, CIBLE School of Language is not liable for any errors, omissions, or outcomes arising from the use of this website.',
  },
  {
    heading: 'Changes to These Terms',
    body: 'We may revise these Terms & Conditions at any time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.',
  },
]

function Terms() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        canonical="/terms"
        description="Read the CIBLE School of Language terms and conditions governing use of our website, admission enquiries, intellectual property and limitations of liability."
      />
      <StructuredData breadcrumbs={crumbs} />

      {/* Page header */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Legal"
          title="Terms & Conditions"
          subtitle="The terms that govern your use of the CIBLE School of Language website."
        />
      </Container>

      {/* Prose body */}
      <Container as="section" className="max-w-3xl pb-16 md:pb-20">
        <p className="text-sm text-muted">Last updated: {lastUpdated}</p>
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="mt-8 mb-3 text-xl font-semibold text-foreground md:text-2xl">{section.heading}</h2>
            <p className="text-muted leading-relaxed">{section.body}</p>
          </div>
        ))}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-foreground md:text-2xl">Contact Us</h2>
        <p className="text-muted leading-relaxed">
          For questions about these Terms &amp; Conditions, contact us at{' '}
          <a href={siteConfig.emailHref} className="font-medium text-primary-600 hover:underline">{siteConfig.email}</a>.
        </p>
      </Container>

      <CTASection />
    </>
  )
}

export default Terms

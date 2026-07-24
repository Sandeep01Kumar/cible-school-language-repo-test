import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import CTASection from '../components/common/CTASection.jsx'
import siteConfig from '../data/siteConfig.js'

// Breadcrumb trail. The SAME array is passed to <Breadcrumbs> (visible trail)
// and <StructuredData> (BreadcrumbList JSON-LD) so the two stay in agreement,
// which is what search engines expect. Module-local, not exported.
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
]

// Human-readable revision date surfaced in the "Last updated" line.
const lastUpdated = 'January 2025'

// Representative privacy-policy copy — this is production-quality structure and
// polished, plausible wording, but it is NOT verified legal text. It MUST be
// reviewed and finalized by the institute's legal team before launch
// (AAP §0.7.2: authentic, legally-reviewed copy is client-supplied). Module-local.
const sections = [
  {
    heading: 'Information We Collect',
    body: 'When you submit an admission or contact form, we collect the details you provide such as your name, phone number, email address and course of interest. We may also collect basic, non-identifying analytics about how visitors use our website.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'We use your information to respond to enquiries, provide course and admission guidance, schedule counseling sessions and keep you informed about relevant programs at CIBLE School of Language. We do not sell your personal information.',
  },
  {
    heading: 'Information Sharing',
    body: 'We do not share your personal information with third parties except as required to operate our services or comply with applicable law. Any service providers we use are expected to protect your information.',
  },
  {
    heading: 'Data Security',
    body: 'We take reasonable measures to protect the information you share with us. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
  },
  {
    heading: 'Your Choices',
    body: 'You may request access to, correction of, or deletion of the personal information you have shared with us by contacting us using the details below.',
  },
  {
    heading: 'Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.',
  },
]

/**
 * PrivacyPolicy — the `/privacy-policy` legal page for CIBLE School of Language.
 *
 * A readable, long-form legal-prose page that explains how the institute
 * collects, uses, shares and protects the personal information visitors submit
 * through the website's admission and contact forms. It is lazy-loaded by the
 * route table in `src/App.jsx`
 * (`const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))`,
 * `<Route path="privacy-policy" element={<PrivacyPolicy />} />`) and rendered
 * inside the shared `<Layout>`, so this component renders ONLY page content —
 * the persistent Navbar, Footer and floating conversion widgets are owned by
 * the layout shell.
 *
 * Reuse-first composition (zero duplication): the page is assembled entirely
 * from the canonical primitives — `<Seo>`/`<StructuredData>` for the head,
 * `<Container>` for width/gutters, `<SectionHeading>` for the single page
 * `<h1>`, `<Breadcrumbs>` for the hierarchy trail and `<CTASection>` for the
 * closing admission call-to-action that every page shares.
 *
 * Semantics & accessibility (WCAG AA):
 * - Exactly ONE `<h1>` on the page — the header rendered by
 *   `<SectionHeading as="h1">`. Every policy section title below is a genuine
 *   `<h2>` in document order, keeping a logical heading outline for assistive
 *   technology.
 * - The body copy is real long-form prose rendered with semantic `<p>`
 *   elements. Legal pages legitimately use bare `<h2>`/`<p>` for prose rather
 *   than restyling a component's role.
 * - The narrow `max-w-3xl` measure on the prose `<Container>` keeps line length
 *   comfortable for reading long-form legal text.
 * - The contact address is a real, actionable `mailto:` link
 *   (`siteConfig.emailHref`) with a visible hover affordance.
 *
 * SEO: `<Seo>` emits a unique title/description/canonical (and Open Graph /
 * Twitter) head for the page, and `<StructuredData breadcrumbs={crumbs}>`
 * injects a BreadcrumbList JSON-LD block that mirrors the visible trail.
 *
 * All styling flows through the Tailwind `@theme` brand tokens defined in
 * `src/index.css` (spacing on the project's 8px scale, `text-foreground` /
 * `text-muted` / `text-primary-600`); there are no hardcoded or arbitrary
 * values and no runtime class composition — the classNames are static.
 *
 * @returns {import('react').ReactElement} The rendered privacy policy page.
 */
function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        canonical="/privacy-policy"
        description="Read the CIBLE School of Language privacy policy — how we collect, use, share and protect the personal information you provide through our website and admission forms."
      />
      <StructuredData breadcrumbs={crumbs} />

      {/* Page header */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Legal"
          title="Privacy Policy"
          subtitle="How CIBLE School of Language handles your personal information."
        />
      </Container>

      {/* Prose body — narrow measure for readable long-form legal text */}
      <Container as="section" className="max-w-3xl pb-16 md:pb-20">
        <p className="text-sm text-muted">Last updated: {lastUpdated}</p>
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="mt-8 mb-3 text-xl font-semibold text-foreground md:text-2xl">
              {section.heading}
            </h2>
            <p className="text-muted leading-relaxed">{section.body}</p>
          </div>
        ))}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-foreground md:text-2xl">
          Contact Us
        </h2>
        <p className="text-muted leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a
            href={siteConfig.emailHref}
            className="font-medium text-primary-600 hover:underline"
          >
            {siteConfig.email}
          </a>
          .
        </p>
      </Container>

      <CTASection />
    </>
  )
}

export default PrivacyPolicy

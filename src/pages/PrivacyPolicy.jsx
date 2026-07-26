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

// Privacy-policy copy REWRITTEN to describe how this website ACTUALLY works
// (M07 / M09): a static, client-only site with NO backend or database. The
// forms do not transmit data to a CIBLE server — they open a pre-filled
// WhatsApp or email draft on the visitor's own device, which is sent only if
// the visitor presses send. The text therefore discloses the third parties that
// process that message (WhatsApp/Meta and email providers), corrects the earlier
// false "analytics/collection/retention/deletion" claims, and addresses minors.
//
// This remains representative pre-launch copy: it MUST be reviewed by legal
// counsel and approved by the institute before publication (AAP §0.7.2 —
// authentic, legally-reviewed copy is client-supplied). That pending-approval
// status is surfaced to visitors in the notice box below. Module-local.
const sections = [
  {
    heading: 'How This Website Works',
    body: 'CIBLE School of Language operates this website as a static, client-side website with no backend server and no database. Nothing you type into a form is transmitted to, or stored on, a CIBLE server. Instead, our admission, contact and newsletter forms open a pre-filled message — a WhatsApp chat or an email draft — on your own device. That message is sent only if you choose to press send.',
  },
  {
    heading: 'Information You Choose to Share',
    body: 'The only personal information we receive is what you decide to send us through those channels: typically your name, phone number, email address and course of interest, plus anything you write in your message. We ask only for the details needed to respond to your enquiry, and you never have to submit a form to browse the site.',
  },
  {
    heading: 'Third-Party Processing (WhatsApp / Meta and Email)',
    body: 'Because your message is delivered through WhatsApp or email, your information is handled by those third parties. WhatsApp messages are processed by WhatsApp and Meta under the WhatsApp and Meta privacy policies; email is processed by your email provider and by the provider of the institute\u2019s inbox. Their handling of your data is governed by their own terms and privacy policies, which we do not control. Please review them before sending sensitive information.',
  },
  {
    heading: 'No Tracking, Analytics or Advertising Cookies',
    body: 'This website does not use analytics, advertising, tracking pixels, or cookies that identify you, and it does not build visitor profiles. We do not collect browsing data about you.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'We use the details you send only to respond to your enquiry, provide course and admission guidance, and arrange counseling sessions or campus visits. We do not maintain a marketing database, and we do not sell or rent your personal information.',
  },
  {
    heading: 'Data Retention and Your Choices',
    body: 'Because we do not operate a server-side database, any message you send lives in WhatsApp, in your own email, and in the institute\u2019s inbox. To review, correct or remove information you have sent, contact us using the details below, or use the controls provided by WhatsApp/Meta or your email provider. You remain in control of what you choose to send.',
  },
  {
    heading: 'Children\u2019s Privacy',
    body: 'Our courses serve learners of many ages. If you are under 18, please involve a parent or guardian before sharing personal details or submitting a form, and share only the information necessary for an admission enquiry.',
  },
  {
    heading: 'Changes to This Policy',
    body: 'As the institute finalizes its operations, this policy will be reviewed by legal counsel and updated. Any changes will be posted on this page with a revised date once the policy is formally published.',
  },
]

/**
 * PrivacyPolicy — the `/privacy-policy` legal page for CIBLE School of Language.
 *
 * A readable, long-form legal-prose page that describes how the institute
 * handles the personal information visitors choose to share through the
 * website's WhatsApp and email enquiry forms. Critically, it reflects the
 * site's ACTUAL data-flow (M07 / M09): this is a static, client-only website
 * with no backend — forms open a pre-filled WhatsApp/email draft on the
 * visitor's device rather than transmitting data to a CIBLE server — so the
 * copy discloses the third parties (WhatsApp/Meta, email providers) that
 * process those messages, states that no analytics/tracking is used, and
 * addresses minors. It is lazy-loaded by the route table in `src/App.jsx`
 * (`<Route path="privacy-policy" element={<PrivacyPolicy />} />`) and rendered
 * inside the shared `<Layout>`, so this component renders ONLY page content.
 *
 * Pending legal approval: the copy is representative pre-launch text that has
 * NOT yet been reviewed by legal counsel or approved by the institute; that
 * status is surfaced to visitors in a `role="note"` disclosure at the top of
 * the page, and no effective date is asserted until the policy is published.
 *
 * Reuse-first composition (zero duplication): the page is assembled entirely
 * from the canonical primitives — `<Seo>`/`<StructuredData>` for the head,
 * `<Container>` for width/gutters, `<SectionHeading>` for the single page
 * `<h1>`, `<Breadcrumbs>` for the hierarchy trail and `<CTASection>` for the
 * closing admission call-to-action that every page shares.
 *
 * Semantics & accessibility (WCAG AA): exactly ONE `<h1>` (via
 * `<SectionHeading as="h1">`); every policy section title is a genuine `<h2>`
 * in document order; body copy is real long-form prose in semantic `<p>`
 * elements; the narrow `max-w-3xl` measure keeps line length comfortable; and
 * the contact address is a real, actionable `mailto:` link. All styling flows
 * through the Tailwind `@theme` brand tokens defined in `src/index.css` on the
 * 8px spacing scale — no hardcoded or arbitrary values.
 *
 * @returns {import('react').ReactElement} The rendered privacy policy page.
 */
function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        canonical="/privacy-policy"
        description="How CIBLE School of Language handles the information you share through our website's WhatsApp and email enquiry forms — a static, client-only site with no backend data collection."
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
          subtitle="How CIBLE School of Language handles the information you choose to share."
        />
      </Container>

      {/* Prose body — narrow measure for readable long-form legal text */}
      <Container as="section" className="max-w-3xl pb-16 md:pb-20">
        {/* Draft / pending-approval disclosure (M09). No effective date is
            asserted until the policy is reviewed by counsel and published. */}
        <div role="note" className="rounded-xl border border-border bg-secondary-50 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            <strong className="font-semibold">Draft for review.</strong> This Privacy Policy is a representative
            pre-launch draft that describes how the website currently works. It has not yet been reviewed by legal
            counsel or approved by CIBLE School of Language, and no effective date applies until it is published.
          </p>
        </div>

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
